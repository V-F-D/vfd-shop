// ==========================================
// VFD - Contact Form & Enrollments Handler
// ==========================================

// Supabase configuration
const SUPABASE_URL = 'https://vjhrmxfsiwmbeuswdagb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqaHJteGZzaXdtYmV1c3dkYWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3Njg5NzcsImV4cCI6MjA4MzM0NDk3N30.THudEElbjP_sBG9wyH5_RdXAuTsjH2wyraNTafeAoKc';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// Contact Form Handler
// ==========================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('span').textContent;
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Sending...';
        
        try {
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('interest').value,
                message: document.getElementById('message').value.trim(),
                status: 'new'
            };
            
            // Insert into Supabase
            const { data, error } = await supabase
                .from('contact_messages')
                .insert([formData]);
            
            if (error) throw error;
            
            // Success!
            submitBtn.querySelector('span').textContent = '✓ Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            // Show success message
            showNotification('Thank you! We\'ll get back to you soon.', 'success');
            
            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
            
        } catch (error) {
            console.error('Contact form error:', error);
            submitBtn.querySelector('span').textContent = '❌ Error - Try Again';
            submitBtn.disabled = false;
            
            showNotification('Error sending message. Please try WhatsApp or call us.', 'error');
            
            setTimeout(() => {
                submitBtn.querySelector('span').textContent = originalText;
            }, 3000);
        }
    });
}

// ==========================================
// Course Enrollment Form Handler
// ==========================================

const enrollmentForm = document.getElementById('enrollmentForm');
if (enrollmentForm) {
    enrollmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = enrollmentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            // Get form data
            const formData = {
                full_name: document.getElementById('fullName').value.trim(),
                date_of_birth: document.getElementById('dob').value,
                gender: document.getElementById('gender').value,
                id_number: document.getElementById('idNumber').value.trim(),
                email: document.getElementById('enrollEmail').value.trim(),
                phone: document.getElementById('enrollPhone').value.trim(),
                address: document.getElementById('address').value.trim(),
                city: document.getElementById('city').value.trim(),
                county: document.getElementById('county').value.trim(),
                education_level: document.getElementById('education').value,
                has_experience: document.getElementById('experience').value,
                emergency_name: document.getElementById('emergencyName').value.trim(),
                emergency_relationship: document.getElementById('emergencyRelationship').value.trim(),
                emergency_phone: document.getElementById('emergencyPhone').value.trim(),
                intake_month: document.getElementById('intake').value,
                study_mode: document.getElementById('studyMode').value,
                additional_info: document.getElementById('additionalInfo')?.value.trim() || '',
                status: 'pending'
            };
            
            // Insert into Supabase
            const { data, error } = await supabase
                .from('enrollments')
                .insert([formData]);
            
            if (error) throw error;
            
            // Success!
            submitBtn.textContent = '✓ Enrolled Successfully!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            // Show success message
            showNotification('Enrollment successful! We will contact you shortly.', 'success');
            
            // Reset form after delay
            setTimeout(() => {
                enrollmentForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
            
        } catch (error) {
            console.error('Enrollment form error:', error);
            submitBtn.textContent = '❌ Error - Try Again';
            submitBtn.disabled = false;
            
            showNotification('Error submitting enrollment. Please call us.', 'error');
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
            }, 3000);
        }
    });
}

// ==========================================
// Notification Helper
// ==========================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.vfd-notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `vfd-notification vfd-notification-${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.25rem;">
                ${type === 'success' ? '✓' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                     type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
                     'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add animation styles
if (!document.querySelector('#vfd-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'vfd-notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}
