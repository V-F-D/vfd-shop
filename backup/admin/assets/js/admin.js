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

    // Initialize notifications
    checkNotifications();
});


// ==========================================
// Notification System
// ==========================================

async function checkNotifications() {
    try {
        const notifList = document.getElementById('notification-list');
        const notifBadge = document.getElementById('notification-badge');
        
        if (!notifList || !notifBadge) return;
        
        const notifications = [];
        
        // 1. Pending Orders
        const { data: orders } = await supabaseClient
            .from('orders')
            .select('id, customer_name, total, created_at')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(5);
            
        if (orders) {
            orders.forEach(o => {
                notifications.push({
                    type: 'order',
                    title: `New Order: ${o.customer_name}`,
                    desc: `KSh ${parseFloat(o.total).toLocaleString()} - Pending`,
                    time: new Date(o.created_at),
                    link: 'orders.html'
                });
            });
        }
        
        // 2. Low Stock
        const { data: stock } = await supabaseClient
            .from('products')
            .select('name, stock_quantity')
            .lt('stock_quantity', 5)
            .eq('is_active', true)
            .limit(5);
            
        if (stock) {
            stock.forEach(p => {
                notifications.push({
                    type: 'stock',
                    title: `Low Stock: ${p.name}`,
                    desc: `Only ${p.stock_quantity} left!`,
                    time: new Date(), 
                    link: 'inventory.html'
                });
            });
        }
        
        // 3. New Messages
        const { data: messages } = await supabaseClient
            .from('contact_messages')
            .select('name, subject, created_at')
            .eq('status', 'new')
            .order('created_at', { ascending: false })
            .limit(3);
            
        if (messages) {
            messages.forEach(m => {
                notifications.push({
                    type: 'message',
                    title: `Message: ${m.name}`,
                    desc: m.subject,
                    time: new Date(m.created_at),
                    link: 'contacts.html'
                });
            });
        }
        
        // 4. Enrollments (Pending)
        try {
            const { data: enrollments } = await supabaseClient
                .from('enrollments')
                .select('full_name, course_name, created_at')
                .eq('status', 'pending')
                .limit(3);
                
            if (enrollments) {
                enrollments.forEach(e => {
                    notifications.push({
                        type: 'enrollment',
                        title: `Enrollment: ${e.full_name}`,
                        desc: e.course_name || 'New Application',
                        time: new Date(e.created_at),
                        link: 'enrollments.html'
                    });
                });
            }
        } catch (e) { console.log('Enrollment fetch error', e); }

        // Sort by time (newest first)
        notifications.sort((a, b) => b.time - a.time);
        
        // Update UI
        if (notifications.length > 0) {
            notifBadge.style.display = 'flex';
            notifBadge.textContent = notifications.length;
            
            notifList.innerHTML = notifications.map(n => `
                <a href="${n.link}" class="notification-item unread">
                    <div class="notif-icon ${n.type}">
                        ${getNotifIcon(n.type)}
                    </div>
                    <div class="notif-content">
                        <div class="notif-title">${n.title}</div>
                        <div style="font-size: 0.813rem; color: var(--text-secondary);">${n.desc}</div>
                        <div class="notif-time">${timeAgo(n.time)}</div>
                    </div>
                </a>
            `).join('');
        } else {
            notifBadge.style.display = 'none';
            notifList.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-secondary);">No new notifications</div>';
        }
        
    } catch (error) {
        console.error('Error checking notifications:', error);
    }
}

function getNotifIcon(type) {
    if (type === 'order') return '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>';
    if (type === 'stock') return '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
    if (type === 'message') return '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>';
    if (type === 'enrollment') return '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>';
    return '';
}

function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = { year: 31536000, month: 2592000, day: 86400, hour: 3600, minute: 60 };
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
}

function toggleNotifications() {
    const dropdown = document.getElementById('notification-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        if (dropdown.classList.contains('active')) {
            document.addEventListener('click', closeNotifOnClickOutside);
        }
    }
}

function closeNotifOnClickOutside(e) {
    const dropdown = document.getElementById('notification-dropdown');
    const btn = document.getElementById('notification-btn');
    if (dropdown && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.classList.remove('active');
        document.removeEventListener('click', closeNotifOnClickOutside);
    }
}

