-- ==========================================
-- FIX CONTACT & ENROLLMENTS TABLES
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1. CREATE CONTACT_MESSAGES TABLE (if not exists)
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

-- 2. DROP OLD RLS POLICIES (if they exist)
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_messages;
DROP POLICY IF EXISTS "Public Access" ON contact_messages;

-- 3. DISABLE RLS TEMPORARILY TO TEST
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- 4. TEST: Try inserting a test record
INSERT INTO contact_messages (name, email, phone, subject, message)
VALUES ('Test User', NULL, '+254700000000', 'test', 'This is a test message');

-- 5. CHECK IF IT WORKED
SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5;

-- ==========================================
-- IF TEST WORKED, RE-ENABLE RLS WITH CORRECT POLICY
-- ==========================================

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (ANYONE can submit)
CREATE POLICY "public_insert_contact"
ON contact_messages
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow service role to select (for admin)
CREATE POLICY "service_select_contact"
ON contact_messages
FOR SELECT
TO service_role
USING (true);

-- Also allow authenticated users to select
CREATE POLICY "auth_select_contact"
ON contact_messages
FOR SELECT
TO authenticated
USING (true);

-- ==========================================
-- SAME FOR ENROLLMENTS
-- ==========================================

-- Check if enrollments table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'enrollments'
);

-- If it exists, fix RLS
ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;

-- Test insert
INSERT INTO enrollments (
    full_name, date_of_birth, gender, id_number, email, phone,
    address, city, county, education_level, has_experience,
    emergency_name, emergency_relationship, emergency_phone,
    intake_month, study_mode, status
) VALUES (
    'Test Student', '1990-01-01', 'Male', '12345678', 
    'test@test.com', '+254700000000', 'Test Address', 
    'Nairobi', 'Nairobi', 'High School', 'No',
    'Emergency Name', 'Parent', '+254711111111',
    'January 2026', 'Full-time', 'pending'
);

-- Check
SELECT * FROM enrollments ORDER BY created_at DESC LIMIT 5;

-- Re-enable RLS with correct policy
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_enrollment"
ON enrollments
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "auth_select_enrollment"
ON enrollments
FOR SELECT
TO authenticated
USING (true);

-- ==========================================
-- VERIFY EVERYTHING
-- ==========================================

-- Check contact_messages
SELECT COUNT(*) as contact_count FROM contact_messages;

-- Check enrollments
SELECT COUNT(*) as enrollment_count FROM enrollments;

-- Check RLS status
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename IN ('contact_messages', 'enrollments');

-- ==========================================
-- DONE! Now test the forms on website
-- ==========================================
