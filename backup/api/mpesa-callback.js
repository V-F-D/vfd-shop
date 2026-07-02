// ==============================================
// Victory Fashion Designers - M-Pesa Callback API
// Handles payment confirmation from M-Pesa
// ==============================================

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (Server-side)
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const callbackData = req.body;
        
        console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));
        
        // Extract callback details
        const { Body } = callbackData;
        const { stkCallback } = Body;
        
        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc
        } = stkCallback;
        
        // Check if payment was successful
        if (ResultCode === 0) {
            // Payment successful
            const { CallbackMetadata } = stkCallback;
            const metadata = {};
            
            // Parse metadata
            if (CallbackMetadata && CallbackMetadata.Item) {
                CallbackMetadata.Item.forEach(item => {
                    metadata[item.Name] = item.Value;
                });
            }
            
            const paymentData = {
                merchantRequestID: MerchantRequestID,
                checkoutRequestID: CheckoutRequestID,
                resultCode: ResultCode,
                resultDesc: ResultDesc,
                amount: metadata.Amount,
                mpesaReceiptNumber: metadata.MpesaReceiptNumber,
                transactionDate: metadata.TransactionDate,
                phoneNumber: metadata.PhoneNumber,
                status: 'completed',
                timestamp: new Date().toISOString()
            };
            
            console.log('Payment successful:', paymentData);
            
            // Save to Supabase transactions (optional log)
            // await supabase.from('mpesa_transactions').insert(paymentData);
            
            // Update order status and get ID
            const { data: updatedOrder, error: orderError } = await supabase
                .from('orders')
                .update({
                    payment_status: 'paid',
                    status: 'confirmed', 
                    mpesa_receipt: paymentData.mpesaReceiptNumber
                })
                .eq('checkout_request_id', CheckoutRequestID)
                .select()
                .single();

            if (orderError) {
                console.error('Failed to update order status:', orderError);
            } else if (updatedOrder) {
                // Deduct Stock Quantity
                const { data: orderItems } = await supabase
                    .from('order_items')
                    .select('product_id, quantity')
                    .eq('order_id', updatedOrder.id);
                
                if (orderItems && orderItems.length > 0) {
                    for (const item of orderItems) {
                        try {
                            // Fetch current stock
                            const { data: product } = await supabase
                                .from('products')
                                .select('stock_quantity')
                                .eq('id', item.product_id)
                                .single();
                                
                            if (product) {
                                const newStock = Math.max(0, product.stock_quantity - item.quantity);
                                await supabase
                                    .from('products')
                                    .update({ stock_quantity: newStock })
                                    .eq('id', item.product_id);
                            }
                        } catch (err) {
                            console.error(`Failed to update stock for product ${item.product_id}:`, err);
                        }
                    }
                }
            }

            return res.status(200).json({
                ResultCode: 0,
                ResultDesc: 'Success'
            });
            
        } else {
            // Payment failed or cancelled
            console.log('Payment failed:', {
                merchantRequestID: MerchantRequestID,
                checkoutRequestID: CheckoutRequestID,
                resultCode: ResultCode,
                resultDesc: ResultDesc
            });
            
            // Update payment status in Supabase
            await supabase
                .from('orders')
                .update({
                    payment_status: 'failed',
                    notes: `Payment failed: ${ResultDesc}`
                })
                .eq('checkout_request_id', CheckoutRequestID);
            
            return res.status(200).json({
                ResultCode: 0,
                ResultDesc: 'Callback received'
            });
        }
        
    } catch (error) {
        console.error('Callback error:', error);
        
        // Always return success to M-Pesa to avoid retries
        return res.status(200).json({
            ResultCode: 0,
            ResultDesc: 'Callback processed'
        });
    }
}
