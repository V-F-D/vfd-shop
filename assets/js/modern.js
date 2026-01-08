// ==========================================
// Victory Fashion Designers - Modern JS
// Interactive Features & Enhancements  
// ==========================================

// Initialize EmailJS (only if library is loaded)
(function() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init("1Yy9BmUn8aid2j5Rs");
  }
})();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initNavigation();
  initThemeToggle();
  initScrollEffects();
  initFAQ();
  initContactForm();
  initAnimations();
  initBackToTop();
  setCurrentYear();
});

// ==========================================
// Navigation
// ==========================================

function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  // Toggle mobile menu
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle) navToggle.classList.remove('active');
      if (navMenu) navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu && navToggle && 
        !navMenu.contains(e.target) && 
        !navToggle.contains(e.target) &&
        navMenu.classList.contains('active')) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Navbar scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (navbar) {
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    lastScroll = currentScroll;
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ==========================================
// Theme Toggle
// ==========================================

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or default to 'light'
  const currentTheme = localStorage.getItem('theme') || 'light';
  htmlElement.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Add rotation animation
      themeToggle.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
      }, 300);
    });
  }
}

// ==========================================
// Scroll Effects
// ==========================================

function initScrollEffects() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll('section, .service-card, .gallery-item, .faq-item').forEach(el => {
    observer.observe(el);
  });

  // Parallax effect for hero section
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
      heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.7;
    }
  });
}

// ==========================================
// FAQ Accordion
// ==========================================

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active', !isActive);
      });
    }
  });
}

// ==========================================
// Contact Form - NOW HANDLED BY forms.js (Supabase)
// ==========================================

function initContactForm() {
  // DISABLED - Now using forms.js with Supabase instead of EmailJS
  // The contact form submission is handled in assets/js/forms.js
  // This prevents conflicts between EmailJS and Supabase
  
  console.log('Contact form will be handled by forms.js (Supabase)');
  
  /* OLD EMAILJS CODE - DISABLED
  const form = document.getElementById('contactForm');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10"/>
        </svg>
        <span>Sending...</span>
      `;
      
      try {
        // Get form data
        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          interest: document.getElementById('interest').value,
          message: document.getElementById('message').value
        };
        
        // Send email via EmailJS
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          interest: formData.interest,
          message: formData.message,
          to_name: 'Victory Fashion Designers'
        });
        
        // Show success message
        showNotification('Message sent successfully! We\\'ll get back to you soon.', 'success');
        form.reset();
        
      } catch (error) {
        console.error('Error sending email:', error);
        showNotification('Failed to send message. Please try again or contact us via WhatsApp.', 'error');
      } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
  */
}

// ==========================================
// Notification System
// ==========================================

function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      width: auto;
      max-width: min(400px, 90vw);
      z-index: 99999;
      animation: slideInRight 0.3s ease-out;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success' ? 
          '<polyline points="20 6 9 17 4 12"/>' : 
          type === 'error' ?
          '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' :
          '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
        }
      </svg>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// ==========================================
// Animations
// ==========================================

function initAnimations() {
  // Add keyframe animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Animate numbers on scroll
  const animateNumbers = () => {
    const numbers = document.querySelectorAll('.stat-number');
    
    numbers.forEach(number => {
      const target = parseInt(number.textContent.replace(/\D/g, ''));
      const suffix = number.textContent.replace(/[0-9]/g, '');
      let current = 0;
      const increment = target / 50;
      const duration = 2000;
      const stepTime = duration / 50;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              number.textContent = Math.floor(current) + suffix;
            }, stepTime);
            
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(number);
    });
  };
  
  animateNumbers();
}

// ==========================================
// Back to Top Button
// ==========================================

function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// ==========================================
// Utility Functions
// ==========================================

function setCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Gallery hover effects
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mouseenter', function() {
    this.style.zIndex = '10';
  });
  
  item.addEventListener('mouseleave', function() {
    this.style.zIndex = '1';
  });
});

// Service cards tilt effect (subtle 3D)
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const tiltX = (y / rect.height) * 10;
    const tiltY = (x / rect.width) * -10;
    
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Console message for developers
console.log('%c👋 Hello Developer!', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cVictory Fashion Designers & Training', 'font-size: 14px; color: #6b7280;');
console.log('%cWebsite developed by Kamaa', 'font-size: 12px; color: #9ca3af;');
console.log('%cInterested in collaboration? WhatsApp: +254 706 036 754', 'font-size: 12px; color: #10b981;');

// Performance monitoring
if ('PerformanceObserver' in window) {
  try {
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
        }
      }
    });
    
    perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
  } catch (e) {
    // Observer not supported
  }
}

// Disable right-click on images (optional - for portfolio protection)
// Uncomment if needed:
/*
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showNotification('Images are protected', 'info');
  });
});
*/

// Export functions for external use
window.VFD = {
  showNotification,
  initContactForm,
  initFAQ
};
