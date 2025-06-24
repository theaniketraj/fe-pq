document.addEventListener('DOMContentLoaded', () => {
    const ratingWidget = document.getElementById('productRating');
    if (!ratingWidget) return; // Exit if widget not found

    const starsContainer = ratingWidget.querySelector('.stars-container');
    const currentRatingDisplay = ratingWidget.querySelector('.current-rating-value');
    const hiddenRatingInput = document.getElementById('productRatingValue'); // Optional

    const maxRating = parseInt(ratingWidget.dataset.maxRating) || 5;
    let currentRating = parseInt(ratingWidget.dataset.currentRating) || 0;

    // --- Initialize Stars ---
    function createStars() {
        starsContainer.innerHTML = ''; // Clear any existing stars
        for (let i = 1; i <= maxRating; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            star.dataset.value = i;
            star.innerHTML = '★'; // Unicode star character (★)
            // star.innerHTML = '☆'; // Unicode empty star character (☆) - if you prefer to switch content

            // Event Listeners for each star
            star.addEventListener('click', handleStarClick);
            star.addEventListener('mouseover', handleStarMouseOver);
            star.addEventListener('mouseout', handleStarMouseOut); // Handled by container now

            starsContainer.appendChild(star);
        }
        // Add mouseout to the container to handle leaving the star area
        starsContainer.addEventListener('mouseout', handleStarsContainerMouseOut);
    }

    // --- Event Handlers ---
    function handleStarClick(event) {
        currentRating = parseInt(event.target.dataset.value);
        ratingWidget.dataset.currentRating = currentRating; // Update data attribute
        if (hiddenRatingInput) {
            hiddenRatingInput.value = currentRating; // Update hidden input
        }
        updateStarsDisplay();
        updateRatingFeedback();
    }

    function handleStarMouseOver(event) {
        const hoverValue = parseInt(event.target.dataset.value);
        highlightStars(hoverValue, true); // true for hover effect
    }

    function handleStarsContainerMouseOut() {
        // When mouse leaves the container, revert to the actual currentRating
        updateStarsDisplay();
    }

    // --- Update Display Functions ---
    function updateStarsDisplay() {
        highlightStars(currentRating, false); // false for selected state
    }

    function highlightStars(ratingValue, isHovering) {
        const stars = starsContainer.querySelectorAll('.star');
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value);
            star.classList.remove('selected', 'hovered'); // Clear previous states

            if (starValue <= ratingValue) {
                if (isHovering) {
                    star.classList.add('hovered');
                } else {
                    star.classList.add('selected');
                }
            }
        });
    }

    function updateRatingFeedback() {
        if (currentRatingDisplay) {
            currentRatingDisplay.textContent = currentRating;
        }
    }

    // --- Initialize Widget ---
    createStars();
    updateStarsDisplay(); // Set initial selected stars based on data-current-rating
    updateRatingFeedback(); // Set initial feedback text

    // --- Demo Submit Button ---
    const submitBtn = document.getElementById('submitRatingBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            alert(`Rating submitted: ${currentRating} out of ${maxRating} stars.\n(Value from hidden input: ${hiddenRatingInput ? hiddenRatingInput.value : 'N/A'})`);
            // In a real scenario, you would submit the form or send this via AJAX.
        });
    }
});