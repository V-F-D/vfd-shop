const { createClient } = require('@supabase/supabase-js');

// HARDCODED CREDENTIALS (Fix for missing Env Vars)
const SUPABASE_URL = 'https://vjhrmxfsiwmbeuswdagb.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqaHJteGZzaXdtYmV1c3dkYWdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzc2ODk3NywiZXhwIjoyMDgzMzQ0OTc3fQ.V9AmwnRgI9KIsEm72gd__XqUYg7M34HvTGZR5L6vR7Q';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

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
        const { name, phone, subject, message } = req.body;

        if (!name || !phone || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log('API Inserting contact message:', { name });

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
            // Check if error is related to table missing
            console.error('Supabase Data Error:', error);
            throw error;
        }

        return res.status(200).json({ success: true, data });

    } catch (error) {
        console.error('API Catch Error:', error);
        return res.status(500).json({ 
            error: 'Database operation failed', 
            details: error.message 
        });
    }
}
