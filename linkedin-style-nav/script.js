document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.li-nav-item');

    // Toggle mobile menu
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Handle active state for navigation items
    navItems.forEach(item => {
        item.addEventListener('click', function (event) {
            // Prevent default if it's just for visual state change
            // If these were actual links, you might not want to preventDefault
            // or handle it differently (e.g., if it's a single-page app)

            // For the profile dropdown, we don't want to set it as 'active' like other nav items
            if (this.classList.contains('li-nav-item-profile')) {
                // Optional: Toggle a class for the profile dropdown if you want click instead of hover on mobile
                // this.classList.toggle('open');
                return; // Don't proceed with active state logic for profile
            }

            // Remove active class from all items
            navItems.forEach(i => i.classList.remove('active'));
            // Add active class to the clicked item
            this.classList.add('active');

            // If mobile menu is open, close it after clicking an item
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Optional: Close mobile menu if clicking outside of it
    document.addEventListener('click', function (event) {
        if (navLinks && navLinks.classList.contains('active')) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnHamburger = hamburgerMenu.contains(event.target);
            if (!isClickInsideNav && !isClickOnHamburger) {
                navLinks.classList.remove('active');
            }
        }
    });
});