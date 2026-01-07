// ==============================================
// Victory Fashion Designers - C2B Confirmation API
// Receives manual PayBill payment confirmations
// ==============================================

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const confirmationData = req.body;
        
        console.log('C2B Confirmation received:', JSON.stringify(confirmationData, null, 2));
        
        const {
            TransactionType,
            TransID,
            TransTime,
            TransAmount,
            BusinessShortCode,
            BillRefNumber,
            InvoiceNumber,
            OrgAccountBalance,
            ThirdPartyTransID,
            MSISDN,
            FirstName,
            MiddleName,
            LastName
        } = confirmationData;
        
        // Payment confirmed successfully
        const paymentData = {
            transactionType: TransactionType,
            transactionID: TransID,
            transactionTime: TransTime,
            amount: TransAmount,
            shortCode: BusinessShortCode,
            billRefNumber: BillRefNumber,
            phoneNumber: MSISDN,
            customerName: `${FirstName} ${MiddleName || ''} ${LastName || ''}`.trim(),
            accountBalance: OrgAccountBalance,
            status: 'completed',
            timestamp: new Date().toISOString()
        };
        
        console.log('C2B Payment confirmed:', paymentData);
        
        // TODO: Save to Supabase
        // await supabase.from('c2b_payments').insert({
        //     transaction_id: TransID,
        //     transaction_type: TransactionType,
        //     amount: TransAmount,
        //     phone_number: MSISDN,
        //     bill_ref_number: BillRefNumber,
        //     customer_name: paymentData.customerName,
        //     transaction_time: TransTime,
        //     status: 'completed'
        // });
        
        // TODO: If BillRefNumber matches an order ID, update order status
        // const order = await supabase.from('orders')
        //     .select('*')
        //     .eq('id', BillRefNumber)
        //     .single();
        // 
        // if (order) {
        //     await supabase.from('orders').update({
        //         payment_status: 'paid',
        //         status: 'confirmed',
        //         mpesa_transaction_id: TransID
        //     }).eq('id', BillRefNumber);
        // }
        
        // TODO: Send confirmation SMS/Email to customer
        
        return res.status(200).json({
            ResultCode: "0",
            ResultDesc: "Success"
        });
        
    } catch (error) {
        console.error('Confirmation error:', error);
        
        // Always return success to M-Pesa
        return res.status(200).json({
            ResultCode: "0",
            ResultDesc: "Confirmation processed"
        });
    }
}
