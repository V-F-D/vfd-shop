const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with SERVICE ROLE KEY
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const formData = req.body;

        console.log('Inserting enrollment:', formData.full_name);

        // Insert using Service Role
        const { data, error } = await supabase
            .from('enrollments')
            .insert([formData])
            .select();

        if (error) {
            console.error('Supabase Error:', error);
            throw error;
        }

        return res.status(200).json({ success: true, data });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
            error: 'Enrollment failed', 
            details: error.message 
        });
    }
}
