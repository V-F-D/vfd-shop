// ==========================================
// VFD Admin - Orders Management
// ==========================================

let allOrders = [];
let filteredOrders = [];

// Load all orders from Supabase
async function loadOrders() {
    try {
        showLoadingState();
        
        const { data: orders, error } = await supabaseClient
            .from('orders')
            .select(`
                *,
                order_items (
                    id,
                    product_name,
                    quantity,
                    price,
                    subtotal
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        allOrders = orders || [];
        filteredOrders = allOrders;
        
        renderOrders();
        updateOrdersCount();
        updatePendingBadge();
        
    } catch (error) {
        console.error('Load orders error:', error);
        showErrorState(error.message);
    }
}

// Render orders table
function renderOrders() {
    const tbody = document.getElementById('orders-tbody');
    
    if (!filteredOrders || filteredOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
                    <div>No orders found</div>
                    <p style="font-size: 0.875rem; margin-top: 0.5rem;">Orders will appear here once customers make purchases on the shop</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredOrders.map(order => {
        const itemCount = order.order_items?.length || 0;
        const statusBadge = getStatusBadgeClass(order.status);
        const paymentBadge = getPaymentBadgeClass(order.payment_status);
        
        return `
            <tr style="cursor: pointer;" onclick="viewOrderDetails('${order.id}')">
                <td><strong>#${order.order_number}</strong></td>
                <td>${formatDate(order.created_at)}</td>
                <td>${order.customer_name}</td>
                <td>${order.customer_phone}</td>
                <td>${itemCount} item${itemCount !== 1 ? 's' : ''}</td>
                <td><strong>KSh ${parseFloat(order.total).toLocaleString()}</strong></td>
                <td><span class="badge ${paymentBadge}">${order.payment_status}</span></td>
                <td><span class="badge ${statusBadge}">${order.status}</span></td>
                <td onclick="event.stopPropagation();">
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="viewOrderDetails('${order.id}')" class="btn btn-sm btn-primary" title="View Details">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                        <button onclick="whatsappCustomer('${order.customer_phone}', '${order.order_number}')" class="btn btn-sm btn-success" title="WhatsApp Customer">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter orders function
function filterOrders() {
    const statusFilter = document.getElementById('status-filter').value;
    const paymentFilter = document.getElementById('payment-filter').value;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();

    filteredOrders = allOrders.filter(order => {
        // Status filter
        if (statusFilter !== 'all' && order.status !== statusFilter) {
            return false;
        }

        // Payment filter
        if (paymentFilter !== 'all' && order.payment_status !== paymentFilter) {
            return false;
        }

        // Search filter
        if (searchQuery) {
            const searchable = `
                ${order.order_number}
                ${order.customer_name}
                ${order.customer_phone}
                ${order.customer_email || ''}
            `.toLowerCase();
            
            if (!searchable.includes(searchQuery)) {
                return false;
            }
        }

        return true;
    });

    renderOrders();
    updateOrdersCount();
}

// View order details
async function viewOrderDetails(orderId) {
    try {
        const { data: order, error } = await supabaseClient
            .from('orders')
            .select(`
                *,
                order_items (
                    id,
                    product_name,
                    quantity,
                    price,
                    subtotal
                ),
                payments (
                    mpesa_receipt_number,
                    phone_number,
                    amount,
                    status,
                    created_at
                )
            `)
            .eq('id', orderId)
            .single();

        if (error) throw error;

        displayOrderDetails(order);
        document.getElementById('order-modal').style.display = 'flex';
        
    } catch (error) {
        console.error('View order error:', error);
        showNotification('Error loading order details', 'error');
    }
}

// Display order details in modal
function displayOrderDetails(order) {
    const content = document.getElementById('order-details-content');
    const payment = order.payments?.[0];
    
    content.innerHTML = `
        <div style="display: grid; gap: var(--space-xl);">
            <!-- Order Info -->
            <div>
                <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-md); border-bottom: 1px solid var(--border-color); padding-bottom: var(--space-sm);">Order Information</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md);">
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Order Number</p>
                        <p style="font-weight: 600;">#${order.order_number}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Order Date</p>
                        <p style="font-weight: 600;">${formatDateTime(order.created_at)}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Status</p>
                        <span class="badge ${getStatusBadgeClass(order.status)}">${order.status}</span>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Payment Status</p>
                        <span class="badge ${getPaymentBadgeClass(order.payment_status)}">${order.payment_status}</span>
                    </div>
                </div>
            </div>

            <!-- Customer Info -->
            <div>
                <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-md); border-bottom: 1px solid var(--border-color); padding-bottom: var(--space-sm);">Customer Information</h3>
                <div style="display: grid; gap: var(--space-sm);">
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Name</p>
                        <p style="font-weight: 600;">${order.customer_name}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Phone</p>
                        <p style="font-weight: 600;">${order.customer_phone}</p>
                    </div>
                    ${order.customer_email ? `
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Email</p>
                        <p style="font-weight: 600;">${order.customer_email}</p>
                    </div>
                    ` : ''}
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Delivery Address</p>
                        <p style="font-weight: 600;">${order.delivery_address}</p>
                    </div>
                </div>
            </div>

            <!-- Order Items -->
            <div>
                <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-md); border-bottom: 1px solid var(--border-color); padding-bottom: var(--space-sm);">Order Items</h3>
                <table style="width: 100%;">
                    <thead>
                        <tr style="background: var(--bg-secondary);">
                            <th style="padding: var(--space-sm); text-align: left;">Product</th>
                            <th style="padding: var(--space-sm); text-align: center;">Qty</th>
                            <th style="padding: var(--space-sm); text-align: right;">Price</th>
                            <th style="padding: var(--space-sm); text-align: right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.order_items.map(item => `
                            <tr>
                                <td style="padding: var(--space-sm);">${item.product_name}</td>
                                <td style="padding: var(--space-sm); text-align: center;">${item.quantity}</td>
                                <td style="padding: var(--space-sm); text-align: right;">KSh ${parseFloat(item.price).toLocaleString()}</td>
                                <td style="padding: var(--space-sm); text-align: right; font-weight: 600;">KSh ${parseFloat(item.subtotal).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="border-top: 2px solid var(--border-color);">
                            <td colspan="3" style="padding: var(--space-sm); text-align: right; font-weight: 600;">Subtotal:</td>
                            <td style="padding: var(--space-sm); text-align: right; font-weight: 600;">KSh ${parseFloat(order.subtotal).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="padding: var(--space-sm); text-align: right; font-weight: 600;">Delivery Fee:</td>
                            <td style="padding: var(--space-sm); text-align: right; font-weight: 600;">KSh ${parseFloat(order.delivery_fee).toLocaleString()}</td>
                        </tr>
                        <tr style="border-top: 2px solid var(--border-color); background: var(--bg-secondary);">
                            <td colspan="3" style="padding: var(--space-md); text-align: right; font-weight: 700; font-size: 1.125rem;">Total:</td>
                            <td style="padding: var(--space-md); text-align: right; font-weight: 700; font-size: 1.125rem; color: var(--primary);">KSh ${parseFloat(order.total).toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            ${payment ? `
            <!-- Payment Info -->
            <div>
                <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-md); border-bottom: 1px solid var(--border-color); padding-bottom: var(--space-sm);">Payment Information</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md);">
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">M-Pesa Receipt</p>
                        <p style="font-weight: 600;">${payment.mpesa_receipt_number || 'N/A'}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Payment Date</p>
                        <p style="font-weight: 600;">${formatDateTime(payment.created_at)}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Amount Paid</p>
                        <p style="font-weight: 600; color: var(--success);">KSh ${parseFloat(payment.amount).toLocaleString()}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Payment Phone</p>
                        <p style="font-weight: 600;">${payment.phone_number}</p>
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- Actions -->
            <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
                <button onclick="updateOrderStatus('${order.id}', 'processing')" class="btn btn-primary">
                    Mark as Processing
                </button>
                <button onclick="updateOrderStatus('${order.id}', 'completed')" class="btn btn-success">
                    Mark as Completed
                </button>
                <button onclick="whatsappCustomer('${order.customer_phone}', '${order.order_number}')" class="btn btn-success">
                    WhatsApp Customer
                </button>
                <button onclick="updateOrderStatus('${order.id}', 'cancelled')" class="btn btn-danger">
                    Cancel Order
                </button>
            </div>
        </div>
    `;
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
    if (!confirm(`Are you sure you want to mark this order as "${newStatus}"?`)) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('orders')
            .update({ 
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', orderId);

        if (error) throw error;

        showNotification(`Order status updated to ${newStatus}!`, 'success');
        closeOrderModal();
        loadOrders();
        
    } catch (error) {
        console.error('Update status error:', error);
        showNotification('Error updating order status', 'error');
    }
}

// WhatsApp customer
function whatsappCustomer(phone, orderNumber) {
    const message = `Hello! This is Victory Fashion Designers. Regarding your order #${orderNumber}.`;
    const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Export orders to CSV
function exportOrders() {
    if (filteredOrders.length === 0) {
        showNotification('No orders to export', 'warning');
        return;
    }

    const headers = ['Order #', 'Date', 'Customer', 'Phone', 'Total', 'Payment Status', 'Order Status'];
    const rows = filteredOrders.map(order => [
        order.order_number,
        formatDate(order.created_at),
        order.customer_name,
        order.customer_phone,
        order.total,
        order.payment_status,
        order.status
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vfd-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    showNotification('Orders exported successfully!', 'success');
}

// Close modal
function closeOrderModal() {
    document.getElementById('order-modal').style.display = 'none';
}

// Helper functions
function getStatusBadgeClass(status) {
    const badges = {
        'pending': 'badge-warning',
        'processing': 'badge-info',
        'completed': 'badge-success',
        'cancelled': 'badge-danger'
    };
    return badges[status] || 'badge-info';
}

function getPaymentBadgeClass(status) {
    const badges = {
        'paid': 'badge-success',
        'pending': 'badge-warning',
        'failed': 'badge-danger'
    };
    return badges[status] || 'badge-info';
}

function updateOrdersCount() {
    document.getElementById('orders-count').textContent = filteredOrders.length;
}

function updatePendingBadge() {
    const pendingCount = allOrders.filter(o => o.status === 'pending').length;
    const badge = document.getElementById('pending-orders-badge');
    if (badge) {
        badge.textContent = pendingCount;
    }
}

function showLoadingState() {
    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="9" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
                <div>Loading orders...</div>
            </td>
        </tr>
    `;
}

function showErrorState(message) {
    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="9" style="text-align: center; padding: 3rem; color: var(--danger);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <div>Error loading orders</div>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">${message}</p>
                <button onclick="loadOrders()" class="btn btn-primary" style="margin-top: 1rem;">Try Again</button>
            </td>
        </tr>
    `;
}
