// ==========================================
// VFD Shop - DYNAMIC VERSION (Supabase Integration)
// ==========================================

// Supabase Configuration
const SUPABASE_URL = 'https://vjhrmxfsiwmbeuswdagb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqaHJteGZzaXdtYmV1c3dkYWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3Njg5NzcsImV4cCI6MjA4MzM0NDk3N30.THudEElbjP_sBG9wyH5_RdXAuTsjH2wyraNTafeAoKc';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Products Cache (loaded from Supabase)
let products = [];

// Shopping Cart State
let cart = JSON.parse(localStorage.getItem('vfd_cart')) || [];

// ==========================================
// Initialize Shop
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadProductsFromDB();
    updateCartUI();
    initializeCart();
    initializeCheckout();
});

// ==========================================
// Load Products from Supabase
// ==========================================
async function loadProductsFromDB() {
    try {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        // Show loading state
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);"><div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div><div>Loading products...</div></div>';

        // Fetch products from Supabase
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('is_active', true) // FIXED: Changed from status to is_active
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading products:', error);
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);"><div style="font-size: 3rem; margin-bottom: 1rem;">😔</div><div>Error loading products. Please refresh the page.</div><p style="font-size: 0.875rem; margin-top: 0.5rem;">Error: ' + error.message + '</p></div>';
            return;
        }

        if (!data || data.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);"><div style="font-size: 3rem; margin-bottom: 1rem;">🛍️</div><div>No products available yet. Check back soon!</div></div>';
            return;
        }

        // Cache products
        products = data;

        // Display products
        displayProducts(products);
        
        console.log(`✅ Loaded ${products.length} products from database`);
    } catch (error) {
        console.error('Fatal error loading products:', error);
        const grid = document.getElementById('productsGrid');
        if (grid) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);"><div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div><div>Unable to load products. Please try again later.</div></div>';
        }
    }
}

// ==========================================
// Display Products
// ==========================================
function displayProducts(productsToShow) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = productsToShow.map(product => {
        // Check stock
        const isOutOfStock = product.stock_quantity === 0 || product.stock_quantity < 0;
        const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

        // Determine badge
        let badge = '';
        if (isOutOfStock) {
            badge = '<span class="product-badge" style="background: #ef4444;">Out of Stock</span>';
        } else if (isLowStock) {
            badge = '<span class="product-badge" style="background: #f59e0b;">Only ' + product.stock_quantity + ' left!</span>';
        } else if (product.badge) {
            badge = '<span class="product-badge">' + product.badge + '</span>';
        }

        return `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image_url}" alt="${product.name}" loading="lazy" onerror="this.src='assets/images/placeholder.jpg'">
                    ${badge}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">KSh ${parseFloat(product.price).toLocaleString()}</div>
                    <button 
                        class="add-to-cart-btn" 
                        onclick="addToCart('${product.id}')" 
                        ${isOutOfStock ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// Filter Products
// ==========================================
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// Make globally accessible
window.filterProducts = filterProducts;

// ==========================================
// Cart Functions
// ==========================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check stock
    if (product.stock_quantity === 0) {
        showNotification('This item is out of stock', 'error');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Check if adding one more would exceed stock
        if (existingItem.quantity >= product.stock_quantity) {
            showNotification(`Only ${product.stock_quantity} available in stock`, 'error');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image_url,
            quantity: 1,
            maxStock: product.stock_quantity
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('Item added to cart!', 'success');
    
    // Animate cart button
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
        cartToggle.style.animation = 'bounce 0.5s';
        setTimeout(() => {
            cartToggle.style.animation = '';
        }, 500);
    }
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
    } else if (item.quantity > item.maxStock) {
        showNotification(`Only ${item.maxStock} available in stock`, 'error');
        item.quantity = item.maxStock;
        saveCart();
        updateCartUI();
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
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='assets/images/placeholder.jpg'">
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
        if (cartSidebar) cartSidebar.classList.add('active');
        if (cartOverlay) cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeCart() {
        if (cartSidebar) cartSidebar.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
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
        <div style="background: #f0f9ff; border: 1px solid #3b82f6; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
            <div style="display: flex; align-items: start; gap: 0.75rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" style="flex-shrink: 0; margin-top: 0.125rem;">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <div style="font-size: 0.875rem; color: #1e40af;">
                    <strong style="display: block; margin-bottom: 0.25rem;">M-Pesa Integration Coming Soon</strong>
                    <span>Online payment is currently under development. For now, please contact us on <strong>+254 723 056 432</strong> to complete your order.</span>
                </div>
            </div>
        </div>
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
    
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.remove('active');
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
    
    // Validate phone for M-Pesa (must start with 254)
    if (!/^254\d{9}$/.test(customerPhone)) {
        showNotification('Phone number must be in format 254XXXXXXXXX', 'error');
        return;
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 5000 ? 0 : 300;
    const total = subtotal + deliveryFee;
    
    // Show loading with M-Pesa context
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10"/>
        </svg>
        <span>Initiating M-Pesa...</span>
    `;
    
    try {
        // 1. Create Order in Supabase
        const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        
        const { data: order, error: orderError } = await supabaseClient
            .from('orders')
            .insert({
                order_number: orderNumber,
                customer_name: customerName,
                customer_phone: customerPhone,
                delivery_address: deliveryAddress,
                subtotal: subtotal,
                delivery_fee: deliveryFee,
                total: total,
                status: 'pending',
                payment_status: 'pending'
            })
            .select()
            .single();

        if (orderError) throw new Error('Failed to create order: ' + orderError.message);

        // 2. Create Order Items
        const orderItems = cart.map(item => ({
            order_id: order.id,
            product_id: item.id, // Assuming product items have IDs
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        }));

        const { error: itemsError } = await supabaseClient
            .from('order_items')
            .insert(orderItems);

        if (itemsError) console.error('Error saving items:', itemsError); // Log but continue

        // 3. Initiate M-Pesa STK Push
        const stkResponse = await fetch('/api/mpesa-stk-push', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber: customerPhone,
                amount: Math.ceil(total), // Ensure integer
                accountReference: orderNumber
            })
        });

        const stkResult = await stkResponse.json();

        if (!stkResponse.ok || !stkResult.success) {
            throw new Error(stkResult.error || 'M-Pesa initiation failed');
        }

        // Success!
        showNotification('✅ M-Pesa prompt sent! Check your phone to complete payment.', 'success');
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();
        closeCheckoutModal();

        // Optional: Redirect to success page or show detailed modal
        setTimeout(() => {
             alert(`Order ${orderNumber} created. Please check your phone for the M-Pesa PIN prompt.`);
        }, 1000);

    } catch (error) {
        console.error('Checkout error:', error);
        showNotification(error.message || 'Payment initiation failed', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
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
window.filterProducts = filterProducts;
