# 🛍️ VFD Shop Deployment Guide

Complete guide to deploying the Victory Fashion Designers online shop with M-Pesa integration on Vercel + Supabase.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [M-Pesa Setup](#mpesa-setup)
4. [Vercel Deployment](#vercel-deployment)
5. [Testing](#testing)
6. [Going Live](#going-live)

---

## 🎯 Prerequisites

- GitHub account
- Vercel account (free tier works!)
- Supabase account (free tier works!)
- M-Pesa Daraja developer account
- Your PayBill number: **222111**
- Your Account number: **2571412**

---

## 🗄️ Supabase Setup

### Step 1: Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project details:
   - Name: `vfd-shop`
   - Database Password: (save this securely)
   - Region: Choose closest to Kenya
4. Wait 2-3 minutes for setup

### Step 2: Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Open `SUPABASE_SCHEMA.md` file
3. Copy and paste each SQL block
4. Run them in order:
   - ✅ Products table
   - ✅ Orders table
   - ✅ Order Items table
   - ✅ Payments table
   - ✅ C2B Payments table
   - ✅ Enrollments table
   - ✅ RLS policies
   - ✅ Functions

### Step 3: Get API Keys

1. Go to **Project Settings** → **API**
2. Copy these values:
   ```
   Project URL: https://xxxx.supabase.co
   anon public key: eyJhbGci...
   service_role key: eyJhbGci... (KEEP SECRET!)
   ```
3. Save these for Vercel setup

---

## 💳 M-Pesa Setup

### Step 1: Your Sandbox Credentials

You already have these:

```
Consumer Key: SVKiR1yQTkwZ9yBCadTTuwWnGxT73nJXCmfxxwqqjN8xPtJb
Consumer Secret: EYk0O76ZnHoayoge9EGIRKGQtAvUZiG8uHG7mZwd5J5h0QZNs44IOLnTR27CzPhi
Shortcode: 174379 (sandbox)
PayBill: 222111
Account: 2571412
```

### Step 2: Get Passkey

1. Go to [Daraja Portal](https://developer.safaricom.co.ke)
2. Navigate to your app **VFD**
3. Go to **APIs** → **Lipa Na M-Pesa Sandbox**
4. Find the **Passkey** in test credentials
5. Should be: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`

### Step 3: Register C2B URLs (After Vercel Deployment)

You'll do this AFTER deploying to Vercel.

---

## 🚀 Vercel Deployment

### Step 1: Push to GitHub

```bash
cd e:\Xampp\htdocs\VFD

# Initialize git (if not done)
git init
git add .
git commit -m "Add VFD online shop with M-Pesa integration"

# Push to your repository
git push origin master:main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: `./`

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
# M-Pesa Credentials
MPESA_CONSUMER_KEY = SVKiR1yQTkwZ9yBCadTTuwWnGxT73nJXCmfxxwqqjN8xPtJb
MPESA_CONSUMER_SECRET = EYk0O76ZnHoayoge9EGIRKGQtAvUZiG8uHG7mZwd5J5h0QZNs44IOLnTR27CzPhi
MPESA_SHORTCODE = 174379
MPESA_PASSKEY = bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_PAYBILL = 222111
MPESA_ACCOUNT = 2571412

# Callback URLs (replace YOUR_DOMAIN with your Vercel URL)
MPESA_CALLBACK_URL = https://YOUR_DOMAIN.vercel.app/api/mpesa-callback
C2B_VALIDATION_URL = https://YOUR_DOMAIN.vercel.app/api/c2b-validation
C2B_CONFIRMATION_URL = https://YOUR_DOMAIN.vercel.app/api/c2b-confirmation

# Supabase (from Step 3 above)
NEXT_PUBLIC_SUPABASE_URL = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGci...

# Site Config
NEXT_PUBLIC_SITE_URL = https://v-f-d.github.io
```

### Step 4: Deploy

1. Click **Deploy**
2. Wait 2-3 minutes
3. Your site will be live at: `https://your-project.vercel.app`

### Step 5: Update Callback URLs

1. Copy your Vercel URL: `https://your-project.vercel.app`
2. Go back to Vercel Environment Variables
3. Update:
   ```
   MPESA_CALLBACK_URL = https://your-project.vercel.app/api/mpesa-callback
   C2B_VALIDATION_URL = https://your-project.vercel.app/api/c2b-validation
   C2B_CONFIRMATION_URL = https://your-project.vercel.app/api/c2b-confirmation
   ```
4. Redeploy project

### Step 6: Register C2B URLs with M-Pesa

Use Postman or curl:

```bash
# Get access token first
curl -X GET \
  'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials' \
  -H 'Authorization: Basic [BASE64_OF_KEY:SECRET]'

# Register URLs
curl -X POST \
  'https://sandbox.safaricom.co.ke/mpesa/c2b/v2/registerurl' \
  -H 'Authorization: Bearer [ACCESS_TOKEN]' \
  -H 'Content-Type: application/json' \
  -d '{
    "ShortCode": "222111",
    "ResponseType": "Completed",
    "ConfirmationURL": "https://your-project.vercel.app/api/c2b-confirmation",
    "ValidationURL": "https://your-project.vercel.app/api/c2b-validation"
  }'
```

---

## 🧪 Testing

### Test M-Pesa STK Push

1. Go to your shop: `https://your-project.vercel.app/shop.html`
2. Add items to cart
3. Proceed to checkout
4. Use test phone number: `254708374149`
5. Enter amount
6. Check logs in Vercel dashboard

### Test Manual PayBill

1. Use M-Pesa simulator on Daraja portal
2. Pay to PayBill: **222111**
3. Account: Order ID (e.g., "ORD123")
4. Amount: Test amount
5. Check C2B confirmation in Vercel logs

### Check Database

1. Go to Supabase dashboard
2. **Table Editor** → **orders**
3. Verify order was created
4. Check **payments** table for transaction

---

## 🎉 Going Live (Production)

### Step 1: Go Live on Daraja

1. Go to [Daraja Portal](https://developer.safaricom.co.ke)
2. Navigate to your app **VFD**
3. Click **GO LIVE** tab
4. Fill in:
   - Organization short code: `222111`
   - Organization name: `Victory Fashion Designers`
   - M-Pesa Username: (Your Business Admin username)
5. Enter OTP sent to your phone
6. Wait for approval (usually same day)

### Step 2: Get Production Credentials

After Go Live approval, you'll receive email with:

- Production Consumer Key
- Production Consumer Secret
- Production Passkey

### Step 3: Update Vercel Environment Variables

Replace sandbox values with production:

```
MPESA_CONSUMER_KEY = [PRODUCTION_KEY]
MPESA_CONSUMER_SECRET = [PRODUCTION_SECRET]
MPESA_PASSKEY = [PRODUCTION_PASSKEY]
MPESA_SHORTCODE = 222111
```

Update URLs to production:

```
MPESA_CALLBACK_URL = https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest
C2B_BASE_URL = https://api.safaricom.co.ke/mpesa/c2b/v2/
```

### Step 4: Register Production C2B URLs

Same as Step 6 above, but use:

- Production endpoints
- Production credentials
- Your actual shortcode: 222111

### Step 5: Test with Real Money

1. Use small amounts first (KSh 1)
2. Test full checkout flow
3. Verify database updates
4. Check M-Pesa statements

---

## 📊 Monitoring

### Vercel Logs

1. Go to Vercel dashboard
2. Your project → **Logs**
3. Filter by function:
   - `/api/mpesa-stk-push`
   - `/api/mpesa-callback`
   - `/api/c2b-confirmation`

### Supabase Logs

1. Supabase dashboard → **Logs**
2. Check API requests
3. Monitor database queries

### M-Pesa Org Portal

1. Go to [org.ke.m-pesa.com](https://org.ke.m-pesa.com)
2. Login with Business Admin
3. Check statements
4. View transactions

---

## ⚠️ Troubleshooting

### "Invalid Access Token"

- Token expires every hour
- Check consumer key/secret are correct
- Verify you're using correct environment (sandbox/production)

### "Invalid ShortCode"

- Ensure using correct shortcode for environment
- Sandbox: 174379
- Production: 222111

### Callback Not Received

- Check URL is publicly accessible
- Verify HTTPS (production requires HTTPS)
- Check Vercel function logs
- Ensure callback URL is registered

### Payment Succeeded but Order Not Updated

- Check Supabase service role key
- Verify Supabase RLS policies
- Check Vercel function logs for errors

---

## 🎯 Next Steps

1. ✅ Add product images
2. ✅ Configure email notifications
3. ✅ Set up admin dashboard (coming soon)
4. ✅ Add order tracking for customers
5. ✅ Implement inventory management

---

## 📞 Support

- **M-Pesa API**: apisupport@safaricom.co.ke
- **Vercel**: vercel.com/support
- **Supabase**: support@supabase.io

---

**🎊 Congratulations! Your shop is ready to accept M-Pesa payments!** 🎊
