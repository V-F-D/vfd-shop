// ==========================================
// VFD Admin - Core Functions
// ==========================================

// Supabase Configuration
const SUPABASE_URL = 'https://vjhrmxfsiwmbeuswdagb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqaHJteGZzaXdtYmV1c3dkYWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3Njg5NzcsImV4cCI6MjA4MzM0NDk3N30.THudEElbjP_sBG9wyH5_RdXAuTsjH2wyraNTafeAoKc';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// Dashboard Functions
// ==========================================

async function initDashboard() {
    try {
        await Promise.all([
            loadDashboardStats(),
            loadSalesChart(),
            loadTopProducts(),
            loadRecentOrders()
        ]);
    } catch (error) {
        console.error('Dashboard init error:', error);
        showNotification('Error loading dashboard data', 'error');
    }
}

async function loadDashboardStats() {
    try {
        // Today's sales
        const today = new Date().toISOString().split('T')[0];
        const { data: todayOrders } = await supabaseClient
            .from('orders')
            .select('total')
            .gte('created_at', today)
            .eq('payment_status', 'paid');
        
        const todaySales = todayOrders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;
        document.getElementById('today-sales').textContent = `KSh ${todaySales.toLocaleString()}`;

        // Pending orders
        const { count: pendingCount } = await supabaseClient
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');
        
        document.getElementById('pending-orders').textContent = pendingCount || 0;
        document.getElementById('pending-orders-badge').textContent = pendingCount || 0;

        // Total customers (distinct phone numbers)
        const { data: allOrders } = await supabaseClient
            .from('orders')
            .select('customer_phone');
        
        const uniqueCustomers = new Set(allOrders?.map(o => o.customer_phone) || []);
        document.getElementById('total-customers').textContent = uniqueCustomers.size;

        // Low stock items (from products table)
        const { count: lowStockCount } = await supabaseClient
            .from('products')
            .select('*', { count: 'exact', head: true })
            .lt('stock_quantity', 5)
            .eq('is_active', true); // FIXED: Changed from status to is_active
        
        document.getElementById('low-stock').textContent = lowStockCount || 0;

    } catch (error) {
        console.error('Stats error:', error);
    }
}

async function loadSalesChart() {
    try {
        // Get last 7 days of sales
        const days = 7;
        const salesData = [];
        const labels = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const { data } = await supabaseClient
                .from('orders')
                .select('total')
                .gte('created_at', dateStr)
                .lt('created_at', new Date(date.getTime() + 86400000).toISOString().split('T')[0])
                .eq('payment_status', 'paid');
            
            const dayTotal = data?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;
            salesData.push(dayTotal);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        }

        const ctx = document.getElementById('salesChart');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales (KSh)',
                    data: salesData,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Chart error:', error);
    }
}

async function loadTopProducts() {
    // Placeholder for now since products might not have sales data yet
    const topProductsHtml = `
        <div style="padding: 1rem; text-align: center; color: var(--text-secondary);">
            <p>No sales data yet</p>
            <p style="font-size: 0.813rem; margin-top: 0.5rem;">Products will appear here once orders are placed</p>
        </div>
    `;
    document.getElementById('top-products-list').innerHTML = topProductsHtml;
}

async function loadRecentOrders() {
    try {
        const { data: orders, error } = await supabaseClient
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;

        const tbody = document.querySelector('#recent-orders-table tbody');
        
        if (!orders || orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        No orders yet. Orders will appear here once customers make purchases.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td><strong>#${order.order_number}</strong></td>
                <td>${order.customer_name || 'N/A'}</td>
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td><strong>KSh ${parseFloat(order.total).toLocaleString()}</strong></td>
                <td>
                    <span class="badge ${
                        order.status === 'completed' ? 'badge-success' :
                        order.status === 'pending' ? 'badge-warning' :
                        order.status === 'cancelled' ? 'badge-danger' : 'badge-info'
                    }">
                        ${order.status}
                    </span>
                </td>
                <td>
                    <button onclick="viewOrder('${order.id}')" class="btn btn-sm btn-primary">View</button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Orders error:', error);
    }
}

// ==========================================
// Utility Functions
// ==========================================

function showNotification(message, type = 'info') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('vfd_theme', newTheme);
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('vfd_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
});

// Format currency
function formatCurrency(amount) {
    return `KSh ${parseFloat(amount).toLocaleString()}`;
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format date and time
function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// View order (placeholder)
function viewOrder(orderId) {
    window.location.href = `orders.html?id=${orderId}`;
}

// Mobile menu toggle for easy phone use
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

// Close menu when clicking overlay
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', toggleMobileMenu);
    }
    
    // Add greeting message
    const headerSubtitle = document.querySelector('.header-subtitle');
    if (headerSubtitle && headerSubtitle.textContent.includes('Manage')) {
        const hour = new Date().getHours();
        let greeting = 'Hello!';
        if (hour < 12) greeting = 'Good Morning!';
        else if (hour < 17) greeting = 'Good Afternoon!';
        else greeting = 'Good Evening!';
        headerSubtitle.textContent = greeting + ' ' + headerSubtitle.textContent;
    }
});

