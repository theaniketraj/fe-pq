document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthH2 = document.getElementById('currentMonth');
    const currentYearSpan = document.getElementById('currentYear');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const todayBtn = document.getElementById('todayBtn');

    let currentDate = new Date(); // This will be the date we are viewing

    // Sample events data (in a real app, this would come from an API or storage)
    const events = {
        // Format: "YYYY-MM-DD": [{ title: "Event Name", time: "10:00 AM", color: "blue" }, ...]
        [`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`]: [
            { title: "Team Meeting", time: "10:00 AM" },
        ],
        // Add more sample events for testing
        "2024-01-15": [{ title: "Project Deadline", time: "All Day", color: "blue" }],
        "2024-01-20": [{ title: "Dentist Appointment", time: "2:30 PM" }, { title: "Gym Session", time: "6:00 PM" }],
    };


    function renderCalendar() {
        calendarGrid.innerHTML = ''; // Clear previous grid
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-indexed (0 for January)

        currentMonthH2.textContent = currentDate.toLocaleString('default', { month: 'long' });
        currentYearSpan.textContent = year;

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

        const today = new Date(); // For highlighting today's date

        // Calculate days from previous month to display
        const prevMonthLastDay = new Date(year, month, 0);
        const daysInPrevMonth = prevMonthLastDay.getDate();

        for (let i = 0; i < firstDayOfWeek; i++) {
            const day = daysInPrevMonth - firstDayOfWeek + 1 + i;
            const cell = createDayCell(day, month - 1, year, true); // true for other-month
            calendarGrid.appendChild(cell);
        }

        // Display days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const cell = createDayCell(day, month, year, false, isToday);
            calendarGrid.appendChild(cell);
        }

        // Calculate days from next month to fill the grid (usually 6 rows = 42 cells)
        const totalCells = 42; // 6 rows * 7 days
        const cellsRendered = firstDayOfWeek + daysInMonth;
        const remainingCells = totalCells - cellsRendered;

        for (let i = 1; i <= remainingCells; i++) {
            const cell = createDayCell(i, month + 1, year, true);
            calendarGrid.appendChild(cell);
        }
    }

    function createDayCell(day, month, year, isOtherMonth = false, isToday = false) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-day');
        if (isOtherMonth) {
            cell.classList.add('other-month');
        }
        if (isToday) {
            cell.classList.add('today');
        }

        const dayNumber = document.createElement('div');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = day;
        cell.appendChild(dayNumber);

        // Add events to the cell
        const eventsContainer = document.createElement('div');
        eventsContainer.classList.add('events-container');

        // Format date string for event lookup: YYYY-MM-DD
        // Adjust month because JS month is 0-indexed, but we want 1-indexed for keys
        let eventMonth = month;
        let eventYear = year;
        if (month < 0) { // Previous year
            eventMonth = 11; // December
            eventYear = year - 1;
        } else if (month > 11) { // Next year
            eventMonth = 0; // January
            eventYear = year + 1;
        }

        const dateString = `${eventYear}-${String(eventMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (events[dateString] && !isOtherMonth) { // Only show events for current month's days
            events[dateString].forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event-item');
                if (event.color === 'blue') {
                    eventDiv.classList.add('event-blue');
                }
                eventDiv.textContent = `${event.time ? event.time + ' ' : ''}${event.title}`;
                eventDiv.title = `${event.title} at ${event.time || 'All Day'}`; // Tooltip
                eventsContainer.appendChild(eventDiv);
            });
        }
        cell.appendChild(eventsContainer);

        // Add click listener for potential day-specific actions (e.g., open day view, add event)
        cell.addEventListener('click', () => {
            console.log(`Clicked on: ${month + 1}/${day}/${year}`);
            // Here you could open a modal to add an event or view day details
        });

        return cell;
    }

    // Event Listeners for Navigation
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    todayBtn.addEventListener('click', () => {
        currentDate = new Date(); // Reset to current actual date
        renderCalendar();
    });

    // Initial Render
    renderCalendar();
});