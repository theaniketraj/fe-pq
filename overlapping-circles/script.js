document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const instructions = document.getElementById('instructions');
    const resetButton = document.getElementById('resetBtn');

    // Canvas dimensions (can be made responsive)
    canvas.width = 500;
    canvas.height = 400;

    let circles = []; // To store the two circles: { x, y, radius, color }
    let isDrawing = false;
    let startX, startY;

    const defaultColor = 'rgba(0, 123, 255, 0.7)'; // Blue
    const overlapColor = 'rgba(255, 0, 0, 0.7)';   // Red

    function drawCircle(circle) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circles.forEach(drawCircle);
    }

    function getMousePos(event) {
        const rect = canvas.getBoundingClientRect();
        let x, y;
        if (event.touches) { // Handle touch events
            x = event.touches[0].clientX - rect.left;
            y = event.touches[0].clientY - rect.top;
        } else { // Handle mouse events
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }
        return { x, y };
    }

    function checkOverlap() {
        if (circles.length < 2) return false;

        const [c1, c2] = circles;
        const distance = Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2));
        return distance < (c1.radius + c2.radius);
    }

    function updateCircleColors() {
        if (circles.length < 2) {
            if (circles.length === 1) circles[0].color = defaultColor;
            return;
        }

        if (checkOverlap()) {
            circles[0].color = overlapColor;
            circles[1].color = overlapColor;
            instructions.textContent = "Circles are overlapping!";
        } else {
            circles[0].color = defaultColor;
            circles[1].color = defaultColor;
            instructions.textContent = "Circles are not overlapping. Draw the next or reset.";
        }
        redrawCanvas();
    }

    function startDrawing(event) {
        event.preventDefault(); // Prevent default actions like text selection or page scroll
        if (circles.length >= 2) {
            instructions.textContent = "Two circles already drawn. Reset to draw new ones.";
            return;
        }
        isDrawing = true;
        const pos = getMousePos(event);
        startX = pos.x;
        startY = pos.y;

        // Create a temporary circle for visual feedback while dragging
        circles.push({ x: startX, y: startY, radius: 1, color: defaultColor });
        instructions.textContent = "Drag to set the radius and release.";
    }

    function draw(event) {
        event.preventDefault();
        if (!isDrawing || circles.length === 0) return;

        const currentCircle = circles[circles.length - 1];
        const pos = getMousePos(event);
        const dx = pos.x - startX;
        const dy = pos.y - startY;
        currentCircle.radius = Math.sqrt(dx * dx + dy * dy); // Radius is distance from start to current

        // Update the center to be the start point, radius is the drag distance
        currentCircle.x = startX;
        currentCircle.y = startY;

        redrawCanvas(); // Redraw all circles including the one being drawn
        updateCircleColors(); // Check overlap while drawing the second circle
    }

    function stopDrawing(event) {
        event.preventDefault();
        if (!isDrawing) return;
        isDrawing = false;

        if (circles.length === 1) {
            instructions.textContent = "First circle drawn. Click and drag for the second.";
        } else if (circles.length === 2) {
            updateCircleColors(); // Final check and color update
            if (!checkOverlap()) {
                instructions.textContent = "Second circle drawn. They are not overlapping.";
            }
        }
    }

    function resetCanvas() {
        circles = [];
        isDrawing = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        instructions.textContent = "Click and drag to draw the first circle. Release, then click and drag for the second.";
    }

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', () => { // Stop drawing if mouse leaves canvas
        if (isDrawing) {
            stopDrawing(new MouseEvent('mouseup')); // Simulate mouseup
        }
    });

    // Touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', () => { // Handle touch cancel
        if (isDrawing) {
            stopDrawing(new TouchEvent('touchend'));
        }
    });


    resetButton.addEventListener('click', resetCanvas);

    // Initial instruction
    instructions.textContent = "Click and drag to draw the first circle. Release, then click and drag for the second.";
});