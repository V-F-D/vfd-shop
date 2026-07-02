# 🔄 BULK UPDATE GUIDE - ALL ADMIN PAGES

## Files to Update (8 total):

1. orders.html
2. products.html
3. customers.html
4. contacts.html
5. analytics.html
6. inventory.html
7. settings.html
8. enrollments.html

## Changes Needed for Each:

### 1. Add Mobile Menu (after <body> tag):

```html
<!-- Mobile Menu Button -->
<button
  class="mobile-menu-btn"
  onclick="toggleMobileMenu()"
  aria-label="Toggle Menu"
>
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 6h16M4 12h16M4 18h16"
    ></path>
  </svg>
</button>

<!-- Mobile Overlay -->
<div class="sidebar-overlay" onclick="toggleMobileMenu()"></div>
```

### 2. Add Enrollments Link (in sidebar, after Contacts):

```html
<a href="enrollments.html" class="nav-item">
  <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    ></path>
  </svg>
  <span>Enrollments</span>
</a>
```

## Updating now...
