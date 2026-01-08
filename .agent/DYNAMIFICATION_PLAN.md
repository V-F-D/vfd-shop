# 🚀 VFD DYNAMIFICATION PLAN

## GOAL: Replace ALL static/placeholder data with REAL data from Supabase

---

## 📊 DATABASE SCHEMA REFERENCE

### **Tables Available:**

1. **products** - id, name, description, price, category, image_url, stock_quantity, created_at
2. **orders** - id, customer_name, customer_phone, delivery_address, items (JSON), total, status, created_at
3. **contact_messages** - id, name, phone, email, subject, message, status, created_at
4. **enrollments** - id, full_name, email, phone, date_of_birth, gender, id_number, address, city, county, education_level, has_experience, emergency_name, emergency_relationship, emergency_phone, intake_month, study_mode, additional_info, status, created_at

---

## ✅ PHASE 1: SHOP PAGE (HIGHEST PRIORITY)

### **File**: `shop.html + assets/js/shop.js`

#### Current State:

- Hardcoded product array in shop.js
- Static product cards

#### Changes Needed:

1. Add Supabase client initialization
2. Load products from `products` table
3. Filter by category dynamically
4. Show real product images, names, prices
5. Handle out-of-stock items (stock_quantity = 0)

---

## ✅ PHASE 2: ADMIN DASHBOARD STATS

### **File**: `admin/index.html` (Dashboard Stats)

#### Current State:

- Static placeholder values (KSh 0, 0 orders, etc.)
- Fake trend percentages

#### Changes Needed:

1. **Today's Sales** - SUM of orders.total WHERE created_at = TODAY
2. **Pending Orders** - COUNT of orders WHERE status = 'pending'
3. **Total Customers** - COUNT DISTINCT customer_phone from orders
4. **Low Stock Items** - COUNT of products WHERE stock_quantity < 5
5. **Trends** - Calculate % change vs previous period

---

## ✅ PHASE 3: GALLERY PAGE

### **File**: `gallery.html`

#### Current State:

- Static placeholder images

#### Changes Needed:

1. Load product images from `products` table
2. Display in masonry grid
3. Link to shop page filtered by category

---

## ✅ PHASE 4: HOMEPAGE STATS/FEATURES

### **File**: `index.html`

#### Changes Needed:

1. Replace any static stats with real counts
2. Load featured products if applicable

---

## 🎯 IMPLEMENTATION ORDER

1. ✅ **Shop.js** - Load products from database (CRITICAL)
2. ✅ **Admin Dashboard** - Real stats and trends (HIGH PRIORITY)
3. ⏳ **Gallery** - Dynamic product images
4. ⏳ **Homepage** - Featured products/stats

---

## 📝 NOTES

- All Supabase access uses ANON key (already configured)
- Products table already has data (added via admin)
- Orders table will have data once users make purchases
- Contact/Enrollment tables already receiving data from forms
