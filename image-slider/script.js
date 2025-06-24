document.addEventListener('DOMContentLoaded', () => {
    const slidesContainer = document.querySelector('.slides');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');

    // Sample slide data (replace with your actual image paths and captions)
    const slideData = [
        { src: 'https://placehold.co/800x400/E91E63/FFFFFF?text=Image+1', alt: 'Image 1', caption: 'Beautiful Sunset View' },
        { src: 'https://placehold.co/800x400/2196F3/FFFFFF?text=Image+2', alt: 'Image 2', caption: 'Mountain Landscape' },
        { src: 'https://placehold.co/800x400/4CAF50/FFFFFF?text=Image+3', alt: 'Image 3', caption: 'City Skyline at Night' },
        { src: 'https://placehold.co/800x400/FFC107/000000?text=Image+4', alt: 'Image 4', caption: 'Forest Trail in Autumn' }
    ];

    let currentSlideIndex = 0;
    let slideInterval; // For auto-sliding
    const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds, set to 0 or null to disable

    // --- Create Slides and Dots ---
    function createSlides() {
        slidesContainer.innerHTML = ''; // Clear existing
        slideData.forEach((data, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.classList.add('slide');
            if (index === 0) slideDiv.classList.add('active'); // First slide active initially

            const img = document.createElement('img');
            img.src = data.src;
            img.alt = data.alt;
            slideDiv.appendChild(img);

            if (data.caption) {
                const captionDiv = document.createElement('div');
                captionDiv.classList.add('slide-caption');
                captionDiv.textContent = data.caption;
                slideDiv.appendChild(captionDiv);
            }
            slidesContainer.appendChild(slideDiv);
        });
    }

    function createDots() {
        dotsContainer.innerHTML = ''; // Clear existing
        slideData.forEach((_, index) => {
            const dot = document.createElement('button'); // Use button for accessibility
            dot.classList.add('dot');
            dot.dataset.slideIndex = index;
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlideInterval();
            });
            dotsContainer.appendChild(dot);
        });
    }

    // --- Slider Logic ---
    function goToSlide(index) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');

        if (index >= slides.length) {
            currentSlideIndex = 0;
        } else if (index < 0) {
            currentSlideIndex = slides.length - 1;
        } else {
            currentSlideIndex = index;
        }

        // Update slides (using opacity/display for fade effect)
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === currentSlideIndex) {
                slide.classList.add('active');
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === currentSlideIndex) {
                dot.classList.add('active');
            }
        });
    }

    function nextSlide() {
        goToSlide(currentSlideIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentSlideIndex - 1);
    }

    // --- Auto Sliding ---
    function startAutoSlide() {
        if (AUTO_SLIDE_INTERVAL && AUTO_SLIDE_INTERVAL > 0) {
            slideInterval = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
        }
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    function resetAutoSlideInterval() {
        stopAutoSlide();
        startAutoSlide();
    }

    // --- Event Listeners ---
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlideInterval();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlideInterval();
    });

    // Optional: Pause auto-slide on hover
    const sliderElement = document.querySelector('.slider');
    if (sliderElement) {
        sliderElement.addEventListener('mouseenter', stopAutoSlide);
        sliderElement.addEventListener('mouseleave', startAutoSlide);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            nextSlide();
            resetAutoSlideInterval();
        } else if (event.key === 'ArrowLeft') {
            prevSlide();
            resetAutoSlideInterval();
        }
    });

    // --- Initialize Slider ---
    function initSlider() {
        if (slideData.length === 0) {
            slidesContainer.innerHTML = "<p>No images to display.</p>";
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            dotsContainer.style.display = 'none';
            return;
        }
        createSlides();
        createDots();
        goToSlide(0); // Show the first slide
        startAutoSlide();
    }

    initSlider();
});