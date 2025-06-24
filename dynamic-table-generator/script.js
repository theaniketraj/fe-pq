document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('tableGeneratorForm');
    const tableContainer = document.getElementById('tableContainer');
    const rowsInput = document.getElementById('rows');
    const columnsInput = document.getElementById('columns');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission (page reload)

        const numRows = parseInt(rowsInput.value, 10);
        const numCols = parseInt(columnsInput.value, 10);

        // Basic validation (HTML5 'required' and 'min' handle most cases)
        if (isNaN(numRows) || isNaN(numCols) || numRows < 1 || numCols < 1) {
            alert('Please enter valid numbers for rows and columns (minimum 1).');
            return;
        }

        generateTable(numRows, numCols);
    });

    function generateTable(rows, cols) {
        // Clear any existing table
        tableContainer.innerHTML = '';

        // Create table element
        const table = document.createElement('table');

        // Create table header (thead)
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const th = document.createElement('th');
            th.textContent = `Header ${j + 1}`; // Example header content
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body (tbody)
        const tbody = document.createElement('tbody');
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const td = document.createElement('td');
                td.textContent = `Row ${i + 1}, Col ${j + 1}`; // Example cell content
                // You could make cells editable:
                // td.setAttribute('contenteditable', 'true');
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        // Append the generated table to the container
        tableContainer.appendChild(table);
    }

    // Optional: Generate a default table on page load
    // generateTable(parseInt(rowsInput.value, 10), parseInt(columnsInput.value, 10));
});