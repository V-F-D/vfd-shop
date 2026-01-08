const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with SERVICE ROLE KEY (Server-side only!)
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
        const { name, phone, subject, message } = req.body;

        // Validation
        if (!name || !phone || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log('Inserting contact message:', { name, phone });

        // Insert using Service Role (Bypasses RLS)
        const { data, error } = await supabase
            .from('contact_messages')
            .insert([{
                name,
                email: null,
                phone,
                subject,
                message,
                status: 'new'
            }])
            .select();

        if (error) {
            console.error('Supabase Error:', error);
            throw error;
        }

        return res.status(200).json({ success: true, data });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
            error: 'Database error', 
            details: error.message 
        });
    }
}
