// ==========================================
// VFD Shop - E-commerce & M-Pesa Integration
// ==========================================

// Sample Products Database (will be Supabase later)
const products = [
    // Dresses
    {
        id: 1,
        name: "Floral Maxi Dress",
        category: "dresses",
        price: 2800,
        image: "assets/images/A.webp",
        badge: "New",
        description: "Beautiful floral print maxi dress"
    },
    {
        id: 2,
        name: "African Print Dress",
        category: "dresses",
        price: 3200,
        image: "assets/images/B.webp",
        badge: "Popular",
        description: "Vibrant African print dress"
    },
    {
        id: 3,
        name: "Cocktail Dress",
        category: "dresses",
        price: 3500,
        image: "assets/images/C.webp",
        badge: null,
        description: "Perfect for evenings out"
    },
    
    // Tops
    {
        id: 4,
        name: "Casual Blouse",
        category: "tops",
        price: 1200,
        image: "assets/images/D.webp",
        badge: null,
        description: "Comfortable casual top"
    },
    {
        id: 5,
        name: "Designer Top",
        category: "tops",
        price: 1500,
        image: "assets/images/E.webp",
        badge: "Sale",
        description: "Stylish designer top"
    },
    
    // Two Pieces
    {
        id: 6,
        name: "Co-ord Set",
        category: "two-pieces",
        price: 3800,
        image: "assets/images/F.webp",
        badge: "New",
        description: "Matching top and bottom set"
    },
    {
        id: 7,
        name: "Ankara Two Piece",
        category: "two-pieces",
        price: 4200,
        image: "assets/images/G.webp",
        badge: null,
        description: "African print two piece"
    },
    
    // Skirts
    {
        id: 8,
        name: "A-Line Skirt",
        category: "skirts",
        price: 1800,
        image: "assets/images/H.webp",
        badge: null,
        description: "Classic A-line skirt"
    },
    {
        id: 9,
        name: "Pencil Skirt",
        category: "skirts",
        price: 2000,
        image: "assets/images/A.webp",
        badge: null,
        description: "Professional pencil skirt"
    },
    
    // Sandals
    {
        id: 10,
        name: "Summer Sandals",
        category: "sandals",
        price: 1500,
        image: "assets/images/B.webp",
        badge: null,
        description: "Comfortable summer sandals"
    },
    {
        id: 11,
        name: "Designer Sandals",
        category: "sandals",
        price: 2200,
        image: "assets/images/C.webp",
        badge: "New",
        description: "Elegant designer sandals"
    },
    
    // Underwear & Intimates
    {
        id: 12,
        name: "Cotton Panties (3-pack)",
        category: "underwear",
        price: 800,
        image: "assets/images/D.webp",
        badge: null,
        description: "Comfortable cotton panties"
    },
    {
        id: 13,
        name: "Lace Bra",
        category: "underwear",
        price: 1200,
        image: "assets/images/E.webp",
        badge: null,
        description: "Supportive lace bra"
    },
    {
        id: 14,
        name: "Men's Boxers (2-pack)",
        category: "underwear",
        price: 900,
        image: "assets/images/F.webp",
        badge: null,
        description: "Comfortable boxer shorts"
    },
    {
        id: 15,
        name: "Cotton Vest",
        category: "underwear",
        price: 600,
        image: "assets/images/G.webp",
        badge: null,
        description: "Basic cotton vest"
    },
    {
        id: 16,
        name: "Socks (5-pack)",
        category: "underwear",
        price: 500,
        image: "assets/images/H.webp",
        badge: "Sale",
        description: "Assorted color socks"
    },
    
    // Accessories
    {
        id: 17,
        name: "Leather Handbag",
        category: "accessories",
        price: 3500,
        image: "assets/images/A.webp",
        badge: "Popular",
        description: "Premium leather handbag"
    },
    {
        id: 18,
        name: "Crossbody Bag",
        category: "accessories",
        price: 2200,
        image: "assets/images/B.webp",
        badge: null,
        description: "Stylish crossbody bag"
    },
    {
        id: 19,
        name: "Evening Clutch",
        category: "accessories",
        price: 1800,
        image: "assets/images/C.webp",
        badge: null,
        description: "Elegant evening clutch"
    },
    {
        id: 20,
        name: "Tote Bag",
        category: "accessories",
        price: 2500,
        image: "assets/images/D.webp",
        badge: "New",
        description: "Spacious tote bag"
    }
];

// Shopping Cart State
let cart = JSON.parse(localStorage.getItem('vfd_cart')) || [];

// ==========================================
// Initialize Shop
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartUI();
    initializeFilters();
    initializeCart();
    initializeCheckout();
});

// ==========================================
// Load Products
// ==========================================
function loadProducts(category = 'all') {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    grid.innerHTML = filtered.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">KSh ${product.price.toLocaleString()}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// ==========================================
// Filters
// ==========================================
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter products
            const category = btn.dataset.category;
            loadProducts(category);
        });
    });
}

// ==========================================
// Cart Functions
// ==========================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('Item added to cart!', 'success');
    
    // Animate cart button
    const cartToggle = document.getElementById('cartToggle');
    cartToggle.style.animation = 'bounce 0.5s';
    setTimeout(() => {
        cartToggle.style.animation = '';
    }, 500);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showNotification('Item removed from cart', 'info');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('vfd_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update badge
    const badge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) badge.textContent = totalItems;
    
    // Update cart items
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem var(--space-md); color: var(--text-tertiary);">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin: 0 auto 1rem;">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">KSh ${item.price.toLocaleString()}</div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                        <button onclick="updateQuantity(${item.id}, -1)" style="background: var(--bg-tertiary); border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer;">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" style="background: var(--bg-tertiary); border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer;">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">×</button>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) cartTotal.textContent = `KSh ${total.toLocaleString()}`;
}

function initializeCart() {
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    
    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (cartToggle) cartToggle.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
}

// ==========================================
// Checkout
// ==========================================
function initializeCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            
            openCheckoutModal();
        });
    }
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const summary = document.getElementById('checkoutSummary');
    
    // Build order summary
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = total >= 5000 ? 0 : 300; // Free delivery over 5000
    const grandTotal = total + deliveryFee;
    
    summary.innerHTML = `
        ${cart.map(item => `
            <div class="summary-row">
                <span>${item.name} × ${item.quantity}</span>
                <span>KSh ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `).join('')}
        <div class="summary-row" style="margin-top: var(--space-sm); padding-top: var(--space-sm); border-top: 1px solid var(--border-color);">
            <span>Subtotal</span>
            <span>KSh ${total.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span>Delivery Fee</span>
            <span>${deliveryFee === 0 ? 'FREE' : 'KSh ' + deliveryFee}</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span>KSh ${grandTotal.toLocaleString()}</span>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

async function handleCheckout(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Get form data
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 5000 ? 0 : 300;
    const total = subtotal + deliveryFee;
    
    // Show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10"/>
        </svg>
        <span>Processing...</span>
    `;
    
    try {
        // TODO: Replace with actual API call when deployed to Vercel
        // For now, simulate M-Pesa STK Push
        
        const orderData = {
            customer: {
                name: customerName,
                phone: customerPhone,
                address: deliveryAddress
            },
            items: cart,
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            total: total,
            timestamp: new Date().toISOString()
        };
        
        // Save order to localStorage (will be Supabase)
        const orders = JSON.parse(localStorage.getItem('vfd_orders') || '[]');
        const orderId = 'ORD' + Date.now();
        orders.push({
            id: orderId,
            ...orderData,
            status: 'pending'
        });
        localStorage.setItem('vfd_orders', JSON.stringify(orders));
        
        // Simulate M-Pesa STK Push
        showNotification('📱 Check your phone for M-Pesa prompt...', 'info');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success simulation
        showNotification('✅ Payment successful! Order confirmed.', 'success');
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();
        
        // Close modal
        closeCheckoutModal();
        
        // Show success message with order ID
        setTimeout(() => {
            showNotification(`Order ${orderId} received! We'll contact you shortly.`, 'success');
        }, 1000);
        
    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('Payment failed. Please try again or contact us.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ==========================================
// M-Pesa Integration (When deployed to Vercel)
// ==========================================

// This function will be used when deployed to Vercel with API routes
async function initiateMpesaPayment(phoneNumber, amount, accountReference) {
    try {
        const response = await fetch('/api/mpesa-stk-push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                amount: amount,
                accountReference: accountReference
            })
        });
        
        const data = await response.json();
        
        if (data.ResponseCode === '0') {
            return {
                success: true,
                checkoutRequestID: data.CheckoutRequestID,
                merchantRequestID: data.MerchantRequestID
            };
        } else {
            throw new Error(data.ResponseDescription || 'Payment failed');
        }
    } catch (error) {
        console.error('M-Pesa error:', error);
        throw error;
    }
}

// ==========================================
// Utility: Notification
// ==========================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            max-width: 400px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        ">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Make functions global
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.closeCheckoutModal = closeCheckoutModal;
