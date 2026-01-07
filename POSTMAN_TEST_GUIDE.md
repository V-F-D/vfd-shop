# 🧪 **How to Test M-Pesa RIGHT NOW with Postman**

## 📥 **Step 1: Import the Collection**

1. **Open Postman**
2. **Click Import** (top left)
3. **Select File:** `VFD_MPESA_TEST.postman_collection.json`
4. **Click Import**
5. ✅ You should see "VFD M-Pesa Test Collection" in your collections

---

## 🔑 **Step 2: Get Access Token**

### **Run Request #1:**

```
1. Get M-Pesa Access Token
```

**What it does:**

- Calls M-Pesa OAuth API
- Uses your Consumer Key & Secret
- Returns access token

**Expected Response:**

```json
{
  "access_token": "JhbGciOiJSUzI1Ni...",
  "expires_in": "3599"
}
```

**Action:**

1. Copy the `access_token` value
2. Go to **Variables** tab (bottom)
3. Paste into `access_token` variable
4. Save

---

## 🧪 **Step 3A: Test Direct to M-Pesa (FASTEST)**

### **Run Request #2:**

```
2. STK Push - Direct to M-Pesa
```

**This will:**

- ✅ Auto-generate timestamp & password
- ✅ Send STK Push to YOUR phone (`254706036754`)
- ✅ Callback to your Vercel API
- ✅ Amount: KSh 1

**Expected Response:**

```json
{
  "MerchantRequestID": "29115-34620561-1",
  "CheckoutRequestID": "ws_CO_191220191020363925",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted for processing",
  "CustomerMessage": "Success. Request accepted for processing"
}
```

**📱 CHECK YOUR PHONE!** You should get M-Pesa prompt!

---

## 🌐 **Step 3B: Test Through VFD API**

### **Run Request #3:**

```
3. STK Push - Through VFD API
```

**This will:**

- ✅ Call YOUR Vercel API
- ✅ Your API calls M-Pesa
- ✅ Full end-to-end test

**Expected Response:**

```json
{
  "success": true,
  "message": "STK Push sent successfully",
  "data": {
    "MerchantRequestID": "...",
    "CheckoutRequestID": "...",
    "ResponseCode": "0"
  }
}
```

**📱 CHECK YOUR PHONE AGAIN!**

---

## 🎯 **What Each Test Does:**

### **Test #1: Access Token**

```
GET /oauth/v1/generate
```

- ✅ Verifies credentials work
- ✅ Gets auth token

### **Test #2: Direct M-Pesa**

```
POST /mpesa/stkpush/v1/processrequest
```

- ✅ Tests M-Pesa API directly
- ✅ Bypasses your code
- ✅ Fastest way to verify credentials

### **Test #3: Through Your API**

```
POST https://vfd-shop.vercel.app/api/mpesa-stk-push
```

- ✅ Tests your Vercel deployment
- ✅ Full end-to-end flow
- ✅ Tests what customers will use

---

## 🔧 **Customize Tests:**

### **Change Phone Number:**

In Request #2 & #3, update:

```json
"PhoneNumber": "254706036754"
```

To any Safaricom number (format: 254XXXXXXXXX)

### **Change Amount:**

```json
"Amount": "1"
```

Change to any amount (but keep as string!)

### **Change Account Reference:**

```json
"AccountReference": "VFD-TEST-001"
```

Use any order ID

---

## ✅ **Success Criteria:**

### **If Request #2 Works:**

✅ M-Pesa credentials are valid
✅ API structure is correct
✅ You get STK prompt on phone

### **If Request #3 Works:**

✅ Vercel deployment is correct
✅ Environment variables are set
✅ Full flow works end-to-end

### **If Both Work:**

🎉 **YOUR SHOP IS READY TO ACCEPT PAYMENTS!**

---

## 📊 **Expected Flow:**

1. **Customer** clicks "Pay with M-Pesa"
2. **Shop** calls `/api/mpesa-stk-push`
3. **Your API** gets access token
4. **Your API** sends STK Push
5. **M-Pesa** sends prompt to customer
6. **Customer** enters PIN
7. **M-Pesa** calls `/api/mpesa-callback`
8. **Your API** updates order status
9. ✅ **Payment complete!**

---

## 🚨 **Troubleshooting:**

### **Error: "Invalid Access Token"**

- Run Request #1 again
- Copy new token
- Update variable

### **Error: "Invalid Credentials"**

- Check Consumer Key/Secret in request
- Verify they match Daraja portal

### **Error: 404 on Request #3**

- Vercel deployment not ready
- Check: https://vfd-shop.vercel.app/
- Wait for deployment to complete

### **No Phone Prompt:**

- Check phone number format (254XXXXXXXXX)
- Verify phone is Safaricom
- Check M-Pesa app is active

---

## 🎯 **QUICK TEST RIGHT NOW:**

1. ✅ Import collection
2. ✅ Run Request #1 → Copy token
3. ✅ Run Request #2 → Check phone
4. 🎉 **If you get M-Pesa prompt, IT WORKS!**

---

**Test this NOW and tell me what happens!** 🚀
