// ==========================================
// VFD M-Pesa STK Push API - PRODUCTION READY
// Based on actual Safaricom API structure
// ==========================================

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (Server-side)
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { phoneNumber, amount, accountReference } = req.body;

        // Validation
        if (!phoneNumber || !amount || !accountReference) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: phoneNumber, amount, accountReference'
            });
        }

        // Validate phone number format
        const cleanPhone = phoneNumber.replace(/\s+/g, '');
        if (!/^254\d{9}$/.test(cleanPhone)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid phone number format. Use 254XXXXXXXXX'
            });
        }

        console.log('=== M-Pesa STK Push Request ===');
        console.log('Phone:', cleanPhone);
        console.log('Amount:', amount);
        console.log('Reference:', accountReference);

        // Get M-Pesa credentials from environment
        const consumerKey = process.env.MPESA_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
        const shortcode = process.env.MPESA_SHORTCODE || '174379';
        const passkey = process.env.MPESA_PASSKEY;
        const callbackUrl = process.env.MPESA_CALLBACK_URL;

        if (!consumerKey || !consumerSecret || !passkey || !callbackUrl) {
            console.error('Missing M-Pesa credentials in environment variables');
            return res.status(500).json({
                success: false,
                error: 'Server configuration error'
            });
        }

        // Step 1: Get Access Token
        const authString = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        
        const tokenResponse = await fetch(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${authString}`
                }
            }
        );

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Token generation failed:', errorText);
            return res.status(500).json({
                success: false,
                error: 'Failed to authenticate with M-Pesa'
            });
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        console.log('Access token obtained');

        // Step 2: Generate timestamp and password
        const timestamp = new Date().toISOString()
            .replace(/[^0-9]/g, '')
            .slice(0, 14); // YYYYMMDDHHmmss

        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

        // Step 3: Make STK Push request
        const stkPushData = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.ceil(amount), // Ensure integer
            PartyA: cleanPhone,
            PartyB: shortcode,
            PhoneNumber: cleanPhone,
            CallBackURL: callbackUrl,
            AccountReference: accountReference,
            TransactionDesc: `Payment for ${accountReference}`
        };

        console.log('Sending STK Push...');

        const stkResponse = await fetch(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stkPushData)
            }
        );

        const stkData = await stkResponse.json();

        console.log('M-Pesa Response:', stkData);

        // Check response
        if (stkData.ResponseCode === '0') {
            // Success!
            
            // Update Order in Supabase with CheckoutRequestID
            if (accountReference) {
                const { error: updateError } = await supabase
                    .from('orders')
                    .update({ 
                        checkout_request_id: stkData.CheckoutRequestID,
                        merchant_request_id: stkData.MerchantRequestID,
                        payment_status: 'processing'
                    })
                    .eq('order_number', accountReference);

                if (updateError) {
                    console.error('Failed to update order with CheckoutRequestID:', updateError);
                    // We don't fail the request, but logging is critical
                }
            }

            return res.status(200).json({
                success: true,
                message: 'STK Push sent successfully',
                data: {
                    MerchantRequestID: stkData.MerchantRequestID,
                    CheckoutRequestID: stkData.CheckoutRequestID,
                    ResponseCode: stkData.ResponseCode,
                    ResponseDescription: stkData.ResponseDescription,
                    CustomerMessage: stkData.CustomerMessage
                }
            });
        } else {
            // M-Pesa returned an error
            console.error('M-Pesa Error:', stkData);
            return res.status(400).json({
                success: false,
                error: stkData.errorMessage || stkData.ResponseDescription || 'Payment request failed',
                data: stkData
            });
        }

    } catch (error) {
        console.error('=== STK Push Error ===');
        console.error(error);
        
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
}
