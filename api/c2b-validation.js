// ==============================================
// Victory Fashion Designers - C2B Validation API
// Validates manual PayBill payments before acceptance
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
        const validationData = req.body;
        
        console.log('C2B Validation request:', validationData);
        
        const {
            TransactionType,
            TransID,
            TransTime,
            TransAmount,
            BusinessShortCode,
            BillRefNumber,
            MSISDN,
            FirstName,
            MiddleName,
            LastName
        } = validationData;
        
        // Validation Logic
        // Example: Check if BillRefNumber is a valid order ID
        
        // You can add custom validation here:
        // 1. Check if order exists in Supabase
        // 2. Verify amount matches order total
        // 3. Check customer details
        
        // For now, accept all valid payments
        const isValid = TransAmount >= 1; // Minimum 1 KSh
        
        if (isValid) {
            console.log('Payment validated successfully:', {
                transID: TransID,
                amount: TransAmount,
                reference: BillRefNumber
            });
            
            // Accept the payment
            return res.status(200).json({
                ResultCode: "0",
                ResultDesc: "Accepted"
            });
        } else {
            console.log('Payment validation failed:', {
                transID: TransID,
                reason: 'Amount too low'
            });
            
            // Reject the payment
            return res.status(200).json({
                ResultCode: "C2B00013",
                ResultDesc: "Invalid Amount"
            });
        }
        
    } catch (error) {
        console.error('Validation error:', error);
        
        // In case of error, accept the payment to avoid customer issues
        return res.status(200).json({
            ResultCode: "0",
            ResultDesc: "Accepted"
        });
    }
}
