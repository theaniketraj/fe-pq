document.addEventListener('DOMContentLoaded', () => {
    // Sample data (array of objects)
    const originalData = [
        { id: 1, name: "Alice Wonderland", email: "alice@example.com", age: 30, city: "New York" },
        { id: 2, name: "Bob The Builder", email: "bob@example.com", age: 24, city: "London" },
        { id: 3, name: "Charlie Brown", email: "charlie@example.com", age: 35, city: "Paris" },
        { id: 4, name: "Diana Prince", email: "diana@example.com", age: 28, city: "New York" },
        { id: 5, name: "Edward Scissorhands", email: "edward@example.com", age: 42, city: "Berlin" },
        { id: 6, name: "Fiona Gallagher", email: "fiona@example.com", age: 29, city: "London" },
        { id: 7, name: "George Costanza", email: "george@example.com", age: 50, city: "Paris" },
    ];

    let currentData = [...originalData]; // Data to be displayed (can be filtered/sorted)
    let sortConfig = { key: null, direction: 'ascending' }; // null, 'ascending', 'descending'

    const table = document.getElementById('dataTable');
    const tableHead = table.querySelector('thead');
    const tableBody = table.querySelector('tbody');
    const searchInput = document.getElementById('searchInput');
    const noResultsDiv = document.getElementById('noResults');

    // Define which columns are sortable and their display names
    // The 'key' must match the property name in your data objects
    const columnDefinitions = [
        { key: 'id', label: 'ID', sortable: true, type: 'number' },
        { key: 'name', label: 'Name', sortable: true, type: 'string' },
        { key: 'email', label: 'Email', sortable: false }, // Example of non-sortable
        { key: 'age', label: 'Age', sortable: true, type: 'number' },
        { key: 'city', label: 'City', sortable: true, type: 'string' }
    ];

    function renderHeaders() {
        tableHead.innerHTML = ''; // Clear existing headers
        const headerRow = document.createElement('tr');
        columnDefinitions.forEach(colDef => {
            const th = document.createElement('th');
            th.textContent = colDef.label;
            th.dataset.key = colDef.key; // Store key for sorting
            th.dataset.type = colDef.type; // Store type for sorting logic

            if (colDef.sortable) {
                th.addEventListener('click', () => requestSort(colDef.key));
                const sortIconSpan = document.createElement('span');
                sortIconSpan.classList.add('sort-icon');
                th.appendChild(sortIconSpan);
            }
            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);
        updateSortIcons();
    }

    function renderTable(dataToRender) {
        tableBody.innerHTML = ''; // Clear existing rows

        if (dataToRender.length === 0) {
            noResultsDiv.style.display = 'block';
            table.style.display = 'none';
            return;
        }

        noResultsDiv.style.display = 'none';
        table.style.display = ''; // or 'table'

        dataToRender.forEach(item => {
            const row = document.createElement('tr');
            columnDefinitions.forEach(colDef => {
                const cell = document.createElement('td');
                cell.textContent = item[colDef.key] === undefined ? '' : item[colDef.key];
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    }

    function requestSort(key) {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        sortConfig = { key, direction };
        applySortAndFilter();
    }

    function applySort(data) {
        if (!sortConfig.key) return data; // No sort applied

        const colDef = columnDefinitions.find(cd => cd.key === sortConfig.key);
        if (!colDef) return data;

        return [...data].sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];

            let comparison = 0;
            if (colDef.type === 'number') {
                comparison = valA - valB;
            } else if (colDef.type === 'string') {
                comparison = valA.toString().toLowerCase().localeCompare(valB.toString().toLowerCase());
            } else { // Default to string comparison if type is unknown
                comparison = String(valA).localeCompare(String(valB));
            }

            return sortConfig.direction === 'ascending' ? comparison : -comparison;
        });
    }

    function updateSortIcons() {
        tableHead.querySelectorAll('th').forEach(th => {
            th.classList.remove('sorted-asc', 'sorted-desc');
            if (th.dataset.key === sortConfig.key) {
                th.classList.add(sortConfig.direction === 'ascending' ? 'sorted-asc' : 'sorted-desc');
            }
        });
    }

    function applyFilter(data) {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) return data;

        return data.filter(item => {
            // Search across all string values of the item
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(searchTerm)
            );
        });
    }

    function applySortAndFilter() {
        let processedData = [...originalData];
        processedData = applyFilter(processedData);
        processedData = applySort(processedData);
        currentData = processedData;
        renderTable(currentData);
        updateSortIcons(); // Ensure icons are correct after re-render
    }

    // Event Listeners
    searchInput.addEventListener('input', () => {
        // When searching, we might want to reset sort or keep it.
        // For simplicity, let's re-apply current sort to filtered results.
        applySortAndFilter();
    });

    // Initial Render
    renderHeaders();
    applySortAndFilter(); // Initial render with default (or no) sort/filter
});