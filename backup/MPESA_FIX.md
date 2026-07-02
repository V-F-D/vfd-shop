// Quick fix: Update handleCheckout to call real M-Pesa API

// Add this to the existing shop.js after line 465 (replace the customerEmail line and the entire handleCheckout function)

// UPDATED handleCheckout function:
async function handleCheckoutV2(e) {
e.preventDefault();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;

    // Get form data (NO EMAIL!)
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 5000 ? 0 : 300;
    const total = subtotal + deliveryFee;

    console.log('=== VFD Checkout ===');
    console.log('Total:', total);
    console.log('Phone:', customerPhone);

    // Show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span style="margin-left: 8px;">Processing...</span>`;

    try {
        const orderId = 'ORD' + Date.now();

        console.log('Calling /api/mpesa-stk-push...');

        const response = await fetch('/api/mpesa-stk-push', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber: customerPhone,
                amount: Math.ceil(total),
                accountReference: orderId
            })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`API Error ${response.status}`);
        }

        const data = await response.json();
        console.log('Response:', data);

        if (data.success) {
            showNotification('📱 Check your phone for M-Pesa prompt!', 'info');

            // Save order
            const orders = JSON.parse(localStorage.getItem('vfd_orders') || '[]');
            orders.push({
                id: orderId,
                customer: { name: customerName, phone: customerPhone, address: deliveryAddress },
                items: cart,
                total: total,
                status: 'pending',
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('vfd_orders', JSON.stringify(orders));

            // Clear cart
            setTimeout(() => {
                cart = [];
                saveCart();
                updateCartUI();
                closeCheckoutModal();
                showNotification('Order ' + orderId + ' created!', 'success');
            }, 2000);
        } else {
            throw new Error(data.message || 'Payment failed');
        }

    } catch (error) {
        console.error('Error:', error);
        let msg = 'Payment failed. ';
        if (error.message.includes('404')) msg += 'API not deployed on Vercel yet.';
        else msg += error.message;
        showNotification(msg, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    }

}

// Instructions:
// 1. Open shop.js
// 2. Find line 465: const customerEmail = document.getElementById('customerEmail').value;
// 3. DELETE that line (email field doesn't exist anymore)
// 4. Replace the entire handleCheckout function (lines 456-538) with handleCheckoutV2 above
// 5. Rename handleCheckoutV2 to handleCheckout
