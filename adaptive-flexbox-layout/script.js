document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNavigation = document.querySelector('.main-navigation ul'); // Target the UL directly

    if (mobileNavToggle && mainNavigation) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mainNavigation.classList.toggle('active');
            mobileNavToggle.classList.toggle('active'); // For hamburger animation
            mobileNavToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Optional: Focus main content when skip link is used
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.getElementById('main-content');
    if (skipLink && mainContent) {
        skipLink.addEventListener('click', (e) => {
            // e.preventDefault(); // Optional: if you want to handle scrolling smoothly
            mainContent.focus();
        });
    }
});