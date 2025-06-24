document.addEventListener('DOMContentLoaded', () => {
    const addProgressBarBtn = document.getElementById('addProgressBarBtn');
    const progressBarsContainer = document.getElementById('progressBarsContainer');
    let progressBarIdCounter = 0;

    addProgressBarBtn.addEventListener('click', createAndRunProgressBar);

    function createAndRunProgressBar() {
        progressBarIdCounter++;
        const barId = `bar-${progressBarIdCounter}`;
        const durationSeconds = Math.floor(Math.random() * 3) + 3; // Random duration 3-5 seconds

        // Create progress bar elements
        const wrapper = document.createElement('div');
        wrapper.classList.add('progress-bar-wrapper');
        wrapper.id = `wrapper-${barId}`;

        const bar = document.createElement('div');
        bar.classList.add('progress-bar');
        bar.id = barId;
        bar.textContent = '0%';

        wrapper.appendChild(bar);
        progressBarsContainer.appendChild(wrapper);

        // Animate the progress bar
        let progress = 0;
        const intervalTime = (durationSeconds * 1000) / 100; // Time per 1% increment

        const intervalId = setInterval(() => {
            progress++;
            bar.style.width = `${progress}%`;
            bar.textContent = `${progress}%`;

            if (progress >= 100) {
                clearInterval(intervalId);
                bar.textContent = 'Complete!';
                bar.classList.add('finished');
                // Optional: Remove the bar after a delay
                setTimeout(() => {
                    // wrapper.remove(); // Uncomment to remove after completion
                }, 2000);
            }
        }, intervalTime);
    }
});