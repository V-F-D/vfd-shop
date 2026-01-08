// ==========================================
// VFD Admin - Authentication
// ==========================================

// Admin password (in production, use environment variable)
const ADMIN_PASSWORD = 'vfd2026admin';

// Check if already logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('vfd_admin_auth');
    const loginTime = sessionStorage.getItem('vfd_admin_login_time');
    
    if (isLoggedIn && loginTime) {
        const now = new Date().getTime();
        const twoHours = 2 * 60 * 60 * 1000;
        
        // Auto-logout after 2 hours
        if (now - parseInt(loginTime) > twoHours) {
            logout();
            return false;
        }
        
        return true;
    }
    
    return false;
}

// Login handler
async function handleLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-message');
    const loginBtn = event.target.querySelector('button[type="submit"]');
    const loginText = document.getElementById('login-text');
    const loginSpinner = document.getElementById('login-spinner');
    
    // Show loading
    loginBtn.disabled = true;
    loginText.style.display = 'none';
    loginSpinner.style.display = 'block';
    errorMsg.style.display = 'none';
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (password === ADMIN_PASSWORD) {
        // Success!
        sessionStorage.setItem('vfd_admin_auth', 'true');
        sessionStorage.setItem('vfd_admin_login_time', new Date().getTime().toString());
        sessionStorage.setItem('vfd_admin_name', 'Admin');
        
        // Redirect to dashboard
        window.location.href = 'index.html';
    } else {
        // Failed
        errorMsg.textContent = '❌ Incorrect password. Please try again.';
        errorMsg.style.display = 'block';
        
        // Reset button
        loginBtn.disabled = false;
        loginText.style.display = 'inline';
        loginSpinner.style.display = 'none';
        
        // Clear password
        document.getElementById('password').value = '';
    }
}

// Logout
function logout() {
    sessionStorage.removeItem('vfd_admin_auth');
    sessionStorage.removeItem('vfd_admin_login_time');
    sessionStorage.removeItem('vfd_admin_name');
    window.location.href = 'login.html';
}

// Require auth for protected pages
function requireAuth() {
    if (!checkAuth()) {
        window.location.href = 'login.html';
    }
}

// Initialize on login page
if (window.location.pathname.includes('login.html')) {
    // Redirect if already logged in
    if (checkAuth()) {
        window.location.href = 'index.html';
    }
}
