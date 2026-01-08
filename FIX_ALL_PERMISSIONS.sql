-- ==========================================
-- 🚨 FINAL FIX FOR VFD SYSTEM 🚨
-- ==========================================
-- This script makes the specific tables PUBLIC.
-- This is necessary because the Admin panel does not use real Supabase Auth yet.
-- It will allow:
-- 1. Anyone to Submit Forms (Insert)
-- 2. Admin to View Data (Select)
-- 3. Admin to Create/Edit/Delete products

-- ==========================================
-- 1. CONTACT MESSAGES
-- ==========================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DISABLE RLS completely for this table
-- This allows Public Read/Write
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. ENROLLMENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    id_number TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    county TEXT,
    education_level TEXT,
    has_experience TEXT,
    emergency_name TEXT,
    emergency_relationship TEXT,
    emergency_phone TEXT,
    intake_month TEXT,
    study_mode TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DISABLE RLS completely for this table
ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. PRODUCTS (Admin Managed)
-- ==========================================
-- Ensure products table exists
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    description TEXT,
    image_url TEXT,
    badge TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DISABLE RLS for products so Admin can manage them without login
ALTER TABLE products DISABLE ROW LEVEL SECURITY;


-- ==========================================
-- 4. ORDERS (Public Create, Admin View)
-- ==========================================
-- DISABLE RLS for orders
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- DISABLE RLS for order_items
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;


-- ==========================================
-- 5. STORAGE BUCKET (Images)
-- ==========================================
-- Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public access to all files
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'product-images' );

DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product-images' );

DROP POLICY IF EXISTS "Public Update" ON storage.objects;
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'product-images' );

DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'product-images' );

-- ==========================================
-- DONE!
-- Run this and EVERYTHING will work.
-- ==========================================
