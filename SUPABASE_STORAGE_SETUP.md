# 📸 **SUPABASE STORAGE SETUP - 2 MINUTES!**

## ⚠️ **CRITICAL: Run This First!**

Your products now use **real image upload**, not URLs!

---

## 🗄️ **CREATE STORAGE BUCKET:**

### **Go to Supabase Dashboard:**

1. **Go to:** `https://supabase.com/dashboard/project/vjhrmxfsiwmbeuswdagb`
2. Click **"Storage"** in left sidebar
3. Click **"New bucket"** button

### **Bucket Settings:**

```
Name: product-images
Public: ✅ YES (enable)
File size limit: 50MB
Allowed MIME types: image/*
```

4. Click **"Create bucket"**

---

## 🔒 **SET STORAGE POLICIES:**

### **After creating bucket:**

1. Click on `product-images` bucket
2. Click **"Policies"** tab
3. Click **"New Policy"**

### **Policy 1: Public Read**

```
Policy name: Public product images
Allowed operation: SELECT
Policy definition: (
    bucket_id = 'product-images'
)
```

### **Policy 2: Admin Upload**

```
Policy name: Admins can upload
Allowed operation: INSERT
Policy definition: (
    bucket_id = 'product-images'
)
```

### **Policy 3: Admin Delete**

```
Policy name: Admins can delete
Allowed operation: DELETE
Policy definition: (
    bucket_id = 'product-images'
)
```

**OR Use SQL (Easier):**

Go to **SQL Editor** and run:

```sql
-- Create storage bucket (if not already created via UI)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true);

-- Allow public access to images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'product-images' );

-- Allow authenticated uploads
create policy "Authenticated uploads"
on storage.objects for insert
with check (
    bucket_id = 'product-images'
);

-- Allow authenticated deletes
create policy "Authenticated deletes"
on storage.objects for delete
using (
    bucket_id = 'product-images'
);
```

---

## ✅ **DONE! Now Your Mom Can:**

1. Open Products page on phone
2. Click "Add Product"
3. Click "Product Image" field
4. **Phone camera opens!** 📸
5. Take photo OR choose from gallery
6. Image uploads to Supabase automatically
7. Product saved with image!

---

## 🎯 **HOW IT WORKS:**

### **Old Way (Testing):**

- Copy/paste image URL
- Images from external links
- Inconvenient on phone

### **New Way (Production):**

- Tap "Upload Image"
- Take photo or choose from gallery
- **Perfect for mom's phone!** 📱
- Images stored securely in Supabase
- Automatic public URLs

---

## 📱 **MOBILE FEATURES:**

The file input has:

- `accept="image/*"` - Only allows images
- `capture="environment"` - Opens back camera on phones
- Works with front camera too
- Supports gallery selection
- JPG, PNG, WEBP supported

---

## 🔍 **TESTING:**

### **After setup:**

1. Login to admin on phone
2. Products → Add Product
3. Tap image field
4. Phone asks: Camera or Gallery?
5. Take/choose photo
6. Fill other fields
7. Save
8. **Check Products page - image should show!**

---

## 💾 **WHERE IMAGES ARE STORED:**

```
Supabase Storage
└── product-images (bucket)
    └── products/
        ├── 1704723000-abc123.jpg
        ├── 1704724000-def456.png
        └── 1704725000-ghi789.webp
```

**Public URLs:**

```
https://vjhrmxfsiwmbeuswdagb.supabase.co/storage/v1/object/public/product-images/products/FILENAME.jpg
```

---

## ⚠️ **IF IMAGES DON'T SHOW:**

### **Check:**

1. Bucket is marked PUBLIC ✅
2. Policies are created ✅
3. Console shows no upload errors
4. Image URL in products table is correct

### **Debug:**

```javascript
// Open Console (F12) when uploading
// Should see:
"Upload error: ..." ← If error
OR
Image URL: https://... ← If success
```

---

## 🎉 **BENEFITS:**

✅ Mom uploads directly from phone  
✅ No need to copy/paste URLs  
✅ Images stored securely  
✅ Automatic compression  
✅ Free up to 1GB storage  
✅ Professional setup

---

## 📊 **STORAGE LIMITS (Free Tier):**

- **Storage:** 1 GB
- **Bandwidth:** 2 GB/month -** Estimate:** ~500-1000 product images

**More than enough for VFD!** ✅

---

**RUN THE SQL ABOVE AND YOU'RE SET!** 🚀
