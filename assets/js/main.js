// scripts.js
// Marquee hover pause/resume (only if present on the page)
document.querySelectorAll('.marquee-row').forEach(row => {
    if (!row) return;
    row.addEventListener('mouseover', () => {
        row.style.animationPlayState = 'paused';
    });
    row.addEventListener('mouseout', () => {
        row.style.animationPlayState = 'running';
    });
});
let open = false;

function menuOpen() {
    open = !open;
    document.getElementById('nav-links').style.display = open ? 'block' : 'none';
    document.getElementById('menu-icon').style.display = open ? 'none' : 'block';
    document.getElementById('close-icon').style.display = open ? 'block' : 'none';

    if (open) {
        document.querySelector('.navbar-links').style.display = 'block';
        document.querySelector('.navbar-cta').style.display = 'block';
    } else {
        document.querySelector('.navbar-links').style.display = 'none';
        document.querySelector('.navbar-cta').style.display = 'none';
    }
}

// Theme toggle (dark/light mode)
// Persist preference, initialize on load, and update the toggle icon/state.
(() => {
    const THEME_KEY = 'vfd_theme';
    const root = document.documentElement; // <html>

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        const iconEl = document.querySelector('#themeToggleBtn i');
        if (iconEl) {
            iconEl.classList.remove('bx-moon', 'bx-sun');
            iconEl.classList.add(theme === 'dark' ? 'bx-sun' : 'bx-moon');
        }
        const btn = document.getElementById('themeToggleBtn');
        if (btn) {
            btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Determine initial theme: localStorage -> system preference -> default light
        let stored = localStorage.getItem(THEME_KEY);
        if (!stored) {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            stored = prefersDark ? 'dark' : 'light';
        }
        applyTheme(stored);

        // Wire up toggle button
        const toggleBtn = document.getElementById('themeToggleBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
                const next = current === 'dark' ? 'light' : 'dark';
                applyTheme(next);
                localStorage.setItem(THEME_KEY, next);
            });
        }
    });
})();

// Form validation (only if contact form exists on current page)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let isValid = true;

        // Clear previous error messages
        document.querySelectorAll('.vfd-error-message').forEach(function (elem) {
            elem.style.display = 'none';
        });

        // Validate name
        const name = document.getElementById('name').value;
        if (!name.trim()) {
            document.getElementById('nameError').textContent = "Name is required.";
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        }

        // Validate email
        const email = document.getElementById('email').value;
        if (!email.includes('@') || !email.includes('.')) {
            document.getElementById('emailError').textContent = "Please enter a valid email.";
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        }

        // Validate phone
        const phone = document.getElementById('phone').value;
        if (!phone.match(/^\d{10}$/)) {
            document.getElementById('phoneError').textContent = "Phone number must be 10 digits.";
            document.getElementById('phoneError').style.display = 'block';
            isValid = false;
        }

        // Validate radio button
        const options = document.querySelector('input[name="option"]:checked');
        if (!options) {
            document.getElementById('optionError').textContent = "Please select an option.";
            document.getElementById('optionError').style.display = 'block';
            isValid = false;
        }

        // Validate message
        const message = document.getElementById('message').value;
        if (!message.trim()) {
            document.getElementById('messageError').textContent = "Message cannot be empty.";
            document.getElementById('messageError').style.display = 'block';
            isValid = false;
        }

        // If valid, send the email
        if (isValid) {
            SendMail(); // Call the function to send email
            const success = document.getElementById('formSuccessMessage');
            if (success) {
                success.textContent = "Your message has been sent successfully!";
                success.style.display = 'block';
            }
        }
    });
});

//emailingService
function SendMail() {
    var params = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.querySelector('input[name="option"]:checked').value,
        message: document.getElementById('message').value
    };

    emailjs.send("service_wq8kr6e", "template_runiszv", params).then(function(res) {
        console.log("Success!", res.status); // Log success status
        alert("Your message has been sent successfully!"); // Alert success message
    }).catch(function(error) {
        console.error("Failed to send email:", error); // Log error
        alert("Failed to send email: " + error); // Alert error
    });
    window.onbeforeunload = function() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.reset(); // Reset the form inputs
        }
    };
}


