# 🛠 **Why M-Pesa Payment Doesn't Work - Complete Explanation**

## ❌ **Current Problem:**

You click "Pay with M-Pesa" but nothing happens because:

1. ✅ **M-Pesa logo is bigger now** (40px) - This is fixed!
2. ❌ **JavaScript still simulates payment** instead of calling real API
3. ⚠️ **Code references email field** that we removed from HTML

---

## 🔍 **What's Happening:**

### **Current Code** (Line 465 in `shop.js`):

```javascript
const customerEmail = document.getElementById("customerEmail").value;
```

**Problem:** This line tries to get an email field that doesn't exist anymore!
**Result:** JavaScript error, payment doesn't proceed

### **Current Code** (Lines 483-516):

The code says:

```javascript
// TODO: Replace with actual API call when deployed to Vercel
// For now, simulate M-Pesa STK Push
```

**Problem:** It's just simulation, not calling the real `/api/mpesa-stk-push`!

---

## ✅ **The Fix:**

### **Step 1: Remove Email Reference**

Open: `assets/js/shop.js`  
Find line 465:

```javascript
const customerEmail = document.getElementById("customerEmail").value;
```

**DELETE IT!**

### **Step 2: Update handleCheckout Function**

Replace lines 483-516 with this:

```javascript
try {
    const orderId = 'ORD' + Date.now();

    console.log('=== Calling M-Pesa API ===');
    console.log('Phone:', customerPhone);
    console.log('Amount:', total);

    // **CALL REAL API** instead of simulation
    const response = await fetch('/api/mpesa-stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            phoneNumber: customerPhone,
            amount: Math.ceil(total),
            accountReference: orderId
        })
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (data.success || data.data?.ResponseCode === '0') {
        showNotif ication('📱 Check your phone for M-Pesa prompt!', 'info');

        // Save order
        const orders = JSON.parse(localStorage.getItem('vfd_orders') || '[]');
        orders.push({
            id: orderId,
            customer: {
                name: customerName,
                phone: customerPhone,
                address: deliveryAddress
            },
            items: cart,
            total: total,
            checkoutRequestID: data.data?.CheckoutRequestID,
            status: 'pending',
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('vfd_orders', JSON.stringify(orders));

        // Clear cart after 2 seconds
        setTimeout(() => {
            cart = [];
            saveCart();
            updateCartUI();
            closeCheckoutModal();
            showNotification(`Order ${orderId} created! Check your phone.`, 'success');
        }, 2000);
    } else {
        throw new Error(data.message || 'Payment failed');
    }

} catch (error) {
    console.error('=== Checkout Error ===', error);

    let errorMsg = 'Payment failed. ';
    if (error.message.includes('404')) {
        errorMsg += 'API not found. Check Vercel deployment.';
    } else if (error.message.includes('Failed to fetch')) {
        errorMsg += 'Network error. Check internet connection.';
    } else {
        errorMsg += error.message;
    }

    showNotification(errorMsg, 'error');
}
```

Also update line 490 to remove email:

```javascript
customer: {
    name: customerName,
    phone: customerPhone,
    address: deliveryAddress  // NO EMAIL!
},
```

---

## 🧪 **After the Fix:**

1. **Try payment on Vercel:** `https://vfd-shop.vercel.app/shop`
2. **Open browser console** (F12 → Console tab
3. **Add item to cart** → **Checkout**
4. **Click M-Pesa button**
5. **Check console** for logs:
   ```
   === Calling M-Pesa API ===
   Phone: 254...
   Amount: 2800
   API Response status: 200
   ```

---

## 🎯 **Expected Behavior After Fix:**

### **If API Works (200 OK):**

- ✅ You see: "📱 Check your phone for M-Pesa prompt!"
- ✅ Real STK Push sent to phone
- ✅ User enters M-Pesa PIN
- ✅ Payment processes
- ✅ Cart clears
- ✅ Order saved

### **If API Fails (404/500):**

- ⚠️ Console shows exact error
- ⚠️ User sees: "API not found" or specific error
- ⚠️ We can debug from there

---

## 📊 **Why It Might Still Fail:**

1. **Environment variables not set in Vercel**

   - Go to Vercel → Settings → Environment Variables
   - Make sure ALL M-Pesa vars are there

2. **API files not deployed**

   - Check Vercel deployment logs
   - Make sure `/api/mpesa-stk-push.js` exists in deployment

3. **Callback URL wrong**
   - Must be: `https://vfd-shop.vercel.app/api/mpesa-callback`

---

## 🚀 **Quick Manual Fix (If You Want):**

I can't edit the file due to encoding issues, but YOU can:

1. Open `e:\Xampp\htdocs\VFD\assets\js\shop.js`
2. LINE 465: Delete the `customerEmail` line
3. LINES 483-516: Replace with code above
4. Save
5. Commit: `git add . && git commit -m "Fix M-Pesa API call" && git push origin master:main`
6. Wait 2 minutes for Vercel to deploy
7. Test on `vfd-shop.vercel.app/shop`

---

## 💡 **Or I Can Create a New File:**

Want me to create a completely new `shop.js` with all fixes?

---

**The M-Pesa integration code IS there - it's just not being called yet!** 🔧
