-- ==========================================
-- CLEAR ALL PRODUCTS - Quick Reset
-- ==========================================

-- Delete all products from database
DELETE FROM products;

-- Verify deletion
SELECT COUNT(*) as total_products FROM products;
-- Should return 0

-- ==========================================
-- DONE! Now add products from Admin panel
-- ==========================================
