document.addEventListener('DOMContentLoaded', () => {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navContainer = document.querySelector('.nav-container'); // Target the container of nav elements

    if (mobileNavToggle && navContainer) {
        mobileNavToggle.addEventListener('click', () => {
            navContainer.classList.toggle('active'); // Toggle active on the container
            mobileNavToggle.classList.toggle('active'); // For hamburger animation
            const isExpanded = navContainer.classList.contains('active');
            mobileNavToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
});