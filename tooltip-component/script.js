document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');
    let activeTooltip = null; // To store the currently visible tooltip element

    tooltipTriggers.forEach((trigger, index) => {
        const tooltipText = trigger.dataset.tooltip;
        const tooltipPosition = trigger.dataset.tooltipPosition || 'top'; // Default to top
        const tooltipId = `tooltip-${index + 1}`; // Generate a unique ID

        // Ensure trigger has aria-describedby pointing to a unique ID
        trigger.setAttribute('aria-describedby', tooltipId);

        let tooltipElement = null; // Will hold the dynamically created tooltip

        function showTooltip() {
            // Create tooltip element if it doesn't exist
            if (!tooltipElement) {
                tooltipElement = document.createElement('div');
                tooltipElement.classList.add('tooltip');
                tooltipElement.textContent = tooltipText;
                tooltipElement.setAttribute('role', 'tooltip');
                tooltipElement.id = tooltipId; // Assign the unique ID
                document.body.appendChild(tooltipElement); // Append to body to avoid overflow issues
            }

            // Add position class
            tooltipElement.classList.add(`position-${tooltipPosition}`);

            // Position the tooltip
            positionTooltip(trigger, tooltipElement, tooltipPosition);

            tooltipElement.classList.add('visible');
            activeTooltip = tooltipElement;
        }

        function hideTooltip() {
            if (tooltipElement) {
                tooltipElement.classList.remove('visible');
                // Optional: Remove the tooltip from DOM after hiding to clean up
                // setTimeout(() => {
                //     if (tooltipElement && !tooltipElement.classList.contains('visible')) {
                //         tooltipElement.remove();
                //         tooltipElement = null;
                //     }
                // }, 200); // Match transition duration
            }
            activeTooltip = null;
        }

        trigger.addEventListener('mouseenter', showTooltip);
        trigger.addEventListener('mouseleave', hideTooltip);
        trigger.addEventListener('focus', showTooltip);
        trigger.addEventListener('blur', hideTooltip);

        // Handle Escape key to close tooltip
        trigger.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && activeTooltip) {
                hideTooltip();
            }
        });
    });

    function positionTooltip(trigger, tooltip, position) {
        const triggerRect = trigger.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect(); // Get initial dimensions
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        let top, left;
        const offset = 10; // Space between trigger and tooltip (includes arrow height/width)

        switch (position) {
            case 'top':
                top = triggerRect.top + scrollY - tooltipRect.height - offset;
                left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'bottom':
                top = triggerRect.bottom + scrollY + offset;
                left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'left':
                top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2);
                left = triggerRect.left + scrollX - tooltipRect.width - offset;
                break;
            case 'right':
                top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2);
                left = triggerRect.right + scrollX + offset;
                break;
            default: // Default to top
                top = triggerRect.top + scrollY - tooltipRect.height - offset;
                left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
        }

        // Basic viewport collision detection (can be made more robust)
        // Adjust left position
        if (left < scrollX) {
            left = scrollX + 5; // Add a small padding from edge
        } else if (left + tooltipRect.width > scrollX + window.innerWidth) {
            left = scrollX + window.innerWidth - tooltipRect.width - 5;
        }

        // Adjust top position (less common to hit top/bottom viewport with typical tooltips)
        if (top < scrollY) {
            top = scrollY + 5;
        } else if (top + tooltipRect.height > scrollY + window.innerHeight) {
            // This might need more complex logic, e.g., flipping to the other side
            top = scrollY + window.innerHeight - tooltipRect.height - 5;
        }


        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }

    // Hide tooltip if user clicks outside
    // (More robust would be to check if click is on trigger or tooltip itself)
    document.addEventListener('click', (event) => {
        if (activeTooltip && !event.target.classList.contains('tooltip-trigger') && !event.target.classList.contains('tooltip')) {
            // This simple check might hide tooltip even if clicking on trigger again.
            // A more complex check would involve checking if event.target is a descendant of a trigger.
            // For now, we rely on mouseleave/blur for most cases.
        }
    });
});