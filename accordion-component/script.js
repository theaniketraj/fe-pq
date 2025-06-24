document.addEventListener('DOMContentLoaded', () => {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        if (!header || !content) return;

        header.addEventListener('click', () => {
            const isOpen = header.classList.contains('active');

            // --- Logic for "only one open at a time" ---
            // Close all other items before opening the current one
            accordionItems.forEach(otherItem => {
                const otherHeader = otherItem.querySelector('.accordion-header');
                const otherContent = otherItem.querySelector('.accordion-content');

                if (otherItem !== item && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherContent.style.maxHeight = null; // Collapse
                    otherContent.style.paddingTop = '0';
                    otherContent.style.paddingBottom = '0';
                    // Wait for transition to finish before setting display none for accessibility
                    setTimeout(() => {
                        if (!otherHeader.classList.contains('active')) { // Check again in case it was re-opened quickly
                            // otherContent.style.display = 'none'; // Optional: for better performance on very long pages
                        }
                    }, 300); // Match CSS transition duration
                }
            });
            // --- End of "only one open at a time" logic ---


            // Toggle the clicked item
            if (isOpen) {
                // Close the current item
                header.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null; // Collapse
                content.style.paddingTop = '0';
                content.style.paddingBottom = '0';
                setTimeout(() => {
                    if (!header.classList.contains('active')) {
                        // content.style.display = 'none';
                    }
                }, 300);
            } else {
                // Open the current item
                header.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                // content.style.display = 'block'; // Make it visible to calculate scrollHeight
                content.style.paddingTop = '15px'; // Add padding back before expanding
                content.style.paddingBottom = '15px';
                content.style.maxHeight = content.scrollHeight + "px"; // Expand
            }
        });

        // Initialize: Ensure content is hidden if not active (for JS-disabled or initial load)
        if (!header.classList.contains('active')) {
            content.style.maxHeight = null;
            // content.style.display = 'none'; // Optional
        } else {
            // If an item is pre-set to active in HTML (e.g. for specific page state)
            header.setAttribute('aria-expanded', 'true');
            content.style.paddingTop = '15px';
            content.style.paddingBottom = '15px';
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});