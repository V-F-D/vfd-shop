// ==============================================
// Victory Fashion Designers - M-Pesa STK Push API
// Vercel Serverless Function
// ==============================================

// Get M-Pesa Access Token
async function getAccessToken() {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    
    const response = await fetch(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`
            }
        }
    );
    
    const data = await response.json();
    return data.access_token;
}

// Generate Password for STK Push
function generatePassword() {
    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const timestamp = getTimestamp();
    
    const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');
    return password;
}

// Get Timestamp
function getTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const minute = ('0' + date.getMinutes()).slice(-2);
    const second = ('0' + date.getSeconds()).slice(-2);
    
    return `${year}${month}${day}${hour}${minute}${second}`;
}

// Main Handler
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { phoneNumber, amount, accountReference } = req.body;
        
        // Validation
        if (!phoneNumber || !amount || !accountReference) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['phoneNumber', 'amount', 'accountReference']
            });
        }
        
        // Validate phone number format
        const phoneRegex = /^254[0-9]{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ 
                error: 'Invalid phone number format. Use 254XXXXXXXXX'
            });
        }
        
        // Get access token
        const accessToken = await getAccessToken();
        
        // Prepare STK Push request
        const timestamp = getTimestamp();
        const password = generatePassword();
        
        const stkPushData = {
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Math.ceil(amount), // Ensure whole number
            PartyA: phoneNumber,
            PartyB: process.env.MPESA_SHORTCODE,
            PhoneNumber: phoneNumber,
            CallBackURL: process.env.MPESA_CALLBACK_URL,
            AccountReference: accountReference,
            TransactionDesc: `VFD Order ${accountReference}`
        };
        
        // Initiate STK Push
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
        
        // Log the transaction (you can save to Supabase here)
        console.log('M-Pesa STK Push initiated:', {
            phone: phoneNumber,
            amount: amount,
            reference: accountReference,
            checkoutRequestID: stkData.CheckoutRequestID
        });
        
        // Return response
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
        
    } catch (error) {
        console.error('STK Push error:', error);
        return res.status(500).json({ 
            error: 'Failed to initiate payment',
            message: error.message 
        });
    }
}
