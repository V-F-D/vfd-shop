// ==============================================
// Victory Fashion Designers - M-Pesa Callback API
// Handles payment confirmation from M-Pesa
// ==============================================

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
            
            // TODO: Save to Supabase
            // await supabase.from('payments').update({
            //     status: 'completed',
            //     mpesa_receipt: paymentData.mpesaReceiptNumber,
            //     transaction_date: paymentData.transactionDate
            // }).eq('checkout_request_id', CheckoutRequestID);
            
            // TODO: Update order status
            // await supabase.from('orders').update({
            //     payment_status: 'paid',
            //     status: 'confirmed'
            // }).eq('checkout_request_id', CheckoutRequestID);
            
            // TODO: Send confirmation email/SMS to customer
            
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
            
            // TODO: Update payment status in Supabase
            // await supabase.from('payments').update({
            //     status: 'failed',
            //     error_message: ResultDesc
            // }).eq('checkout_request_id', CheckoutRequestID);
            
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
