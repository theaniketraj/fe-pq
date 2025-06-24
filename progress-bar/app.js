document.addEventListener('DOMContentLoaded', () => {
    const addProgressBarBtn = document.getElementById('addProgressBarBtn');
    const progressBarsContainer = document.getElementById('progressBarsContainer');

    const MAX_CONCURRENT_BARS = 3;
    let activeBarsCount = 0;
    const pendingQueue = []; // Queue for tasks waiting to run
    let progressBarIdCounter = 0;

    addProgressBarBtn.addEventListener('click', () => {
        progressBarIdCounter++;
        const barDetails = {
            id: `bar-${progressBarIdCounter}`,
            duration: Math.floor(Math.random() * 3) + 3 // Random duration 3-5 seconds
        };

        if (activeBarsCount < MAX_CONCURRENT_BARS) {
            runProgressBar(barDetails);
        } else {
            pendingQueue.push(barDetails);
            console.log(`Queueing bar ${barDetails.id}. Queue size: ${pendingQueue.length}`);
        }
    });

    function runProgressBar(barDetails) {
        activeBarsCount++;
        console.log(`Starting bar ${barDetails.id}. Active: ${activeBarsCount}`);

        // Create progress bar elements
        const wrapper = document.createElement('div');
        wrapper.classList.add('progress-bar-wrapper');
        wrapper.id = `wrapper-${barDetails.id}`;

        const bar = document.createElement('div');
        bar.classList.add('progress-bar');
        bar.id = barDetails.id;
        bar.textContent = '0%';

        wrapper.appendChild(bar);
        progressBarsContainer.appendChild(wrapper);

        // Animate the progress bar
        let progress = 0;
        const intervalTime = (barDetails.duration * 1000) / 100; // Time per 1% increment

        const intervalId = setInterval(() => {
            progress++;
            bar.style.width = `${progress}%`;
            bar.textContent = `${progress}%`;

            if (progress >= 100) {
                clearInterval(intervalId);
                bar.textContent = 'Complete!';
                bar.classList.add('finished');

                activeBarsCount--;
                console.log(`Finished bar ${barDetails.id}. Active: ${activeBarsCount}`);

                // Optional: Remove the bar after a delay
                setTimeout(() => {
                    // wrapper.remove(); // Uncomment to remove after completion
                }, 2000);


                // Check if there are pending tasks in the queue
                if (pendingQueue.length > 0) {
                    const nextBarDetails = pendingQueue.shift(); // Get the next task
                    console.log(`Dequeuing bar ${nextBarDetails.id}. Queue size: ${pendingQueue.length}`);
                    runProgressBar(nextBarDetails); // Run it
                }
            }
        }, intervalTime);
    }
});