document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.custom-slider');

    sliders.forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const filledTrack = slider.querySelector('.slider-track-filled');
        const thumb = slider.querySelector('.slider-thumb');
        const valueDisplay = document.querySelector(`.slider-value-display[for="${slider.id}"]`);

        let min = parseFloat(slider.dataset.min) || 0;
        let max = parseFloat(slider.dataset.max) || 100;
        let step = parseFloat(slider.dataset.step) || 1;
        let currentValue = parseFloat(slider.dataset.value) || min;

        let isDragging = false;

        function updateSliderUI(value) {
            // Clamp value within min/max
            value = Math.max(min, Math.min(max, value));
            // Snap to step
            value = Math.round(value / step) * step;
            // Handle potential floating point inaccuracies for display
            const precision = step.toString().includes('.') ? step.toString().split('.')[1].length : 0;
            currentValue = parseFloat(value.toFixed(precision));


            const percentage = ((currentValue - min) / (max - min)) * 100;

            thumb.style.left = `${percentage}%`;
            filledTrack.style.width = `${percentage}%`;

            if (valueDisplay) {
                valueDisplay.textContent = currentValue;
            }
            slider.setAttribute('aria-valuenow', currentValue);
            slider.dataset.value = currentValue; // Update data attribute as well

            // Dispatch a custom event (optional)
            slider.dispatchEvent(new CustomEvent('sliderchange', { detail: { value: currentValue } }));
        }

        function handleInteraction(clientX) {
            const trackRect = track.getBoundingClientRect();
            let newValueRatio = (clientX - trackRect.left) / trackRect.width;
            newValueRatio = Math.max(0, Math.min(1, newValueRatio)); // Clamp between 0 and 1

            let newValue = min + newValueRatio * (max - min);
            updateSliderUI(newValue);
        }

        // Mouse Events
        thumb.addEventListener('mousedown', (event) => {
            event.preventDefault(); // Prevent text selection
            isDragging = true;
            thumb.style.cursor = 'grabbing';
            document.body.style.cursor = 'grabbing'; // Change cursor globally
        });

        // Touch Events
        thumb.addEventListener('touchstart', (event) => {
            event.preventDefault(); // Prevent page scroll
            isDragging = true;
            thumb.style.cursor = 'grabbing';
        }, { passive: false });


        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                handleInteraction(event.clientX);
            }
        });
        document.addEventListener('touchmove', (event) => {
            if (isDragging && event.touches.length > 0) {
                handleInteraction(event.touches[0].clientX);
            }
        }, { passive: false });


        const stopDragging = () => {
            if (isDragging) {
                isDragging = false;
                thumb.style.cursor = 'grab';
                document.body.style.cursor = 'default';
            }
        };
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);
        document.addEventListener('touchcancel', stopDragging);


        // Click on track to set value
        track.addEventListener('click', (event) => {
            if (event.target === thumb) return; // Don't trigger if click was on thumb itself
            handleInteraction(event.clientX);
        });
        // Also allow click on the main slider div for better UX
        slider.addEventListener('click', (event) => {
            if (event.target === thumb || event.target === track || event.target === filledTrack) return;
            handleInteraction(event.clientX);
        });


        // Keyboard Navigation
        slider.addEventListener('keydown', (event) => {
            let newValue = currentValue;
            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowDown': // Treat down same as left
                    newValue -= step;
                    event.preventDefault();
                    break;
                case 'ArrowRight':
                case 'ArrowUp': // Treat up same as right
                    newValue += step;
                    event.preventDefault();
                    break;
                case 'Home':
                    newValue = min;
                    event.preventDefault();
                    break;
                case 'End':
                    newValue = max;
                    event.preventDefault();
                    break;
                case 'PageUp':
                    newValue += step * 10; // Or some larger step
                    event.preventDefault();
                    break;
                case 'PageDown':
                    newValue -= step * 10; // Or some larger step
                    event.preventDefault();
                    break;
                default:
                    return; // Do nothing for other keys
            }
            updateSliderUI(newValue);
        });

        // Initial setup
        updateSliderUI(currentValue);

        // Example of listening to the custom event
        slider.addEventListener('sliderchange', (event) => {
            console.log(`${slider.id} value changed to:`, event.detail.value);
        });
    });
});