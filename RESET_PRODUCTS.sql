-- ==========================================
-- VFD Product Reset Script
-- ==========================================
-- Run this in Supabase SQL Editor to clear all products
-- Then add products from Admin panel!

-- Delete all existing products
DELETE FROM products;

-- Reset the table (optional - removes all data and resets)
TRUNCATE TABLE products CASCADE;

-- Verification
SELECT COUNT(*) as remaining_products FROM products;
-- Should return 0

-- ==========================================
-- Now go to Admin > Products > Add Product
-- Add products with images from Supabase Storage!
-- ==========================================

-- OPTIONAL: Add Supabase Storage for images
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create bucket named "product-images"
-- 3. Set bucket to PUBLIC
-- 4. Upload images
-- 5. Get public URL: https://vjhrmxfsiwmbeuswdagb.supabase.co/storage/v1/object/public/product-images/FILENAME.jpg
-- 6. Use this URL when adding products in admin

-- ==========================================
-- Contact Form Table (NEW!)
-- ==========================================

CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_contact_status ON contact_messages(status);
CREATE INDEX idx_contact_created ON contact_messages(created_at);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (submit contact form)
CREATE POLICY "Anyone can submit contact form"
    ON contact_messages FOR INSERT
    WITH CHECK (true);

-- Service role can read all
CREATE POLICY "Service role can view contacts"
    ON contact_messages FOR SELECT
    USING (auth.role() = 'service_role');

-- ==========================================
-- Success!
-- ==========================================
-- ✅ Products cleared - ready for admin entry
-- ✅ Contact form table created
-- ✅ Ready to use!
