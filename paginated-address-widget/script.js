document.addEventListener('DOMContentLoaded', () => {
    // Sample address data
    const allAddresses = [
        { name: "John Doe", street: "123 Main St", city: "Anytown", state: "CA", zip: "90210", country: "USA" },
        { name: "Jane Smith", street: "456 Oak Ave", city: "Otherville", state: "NY", zip: "10001", country: "USA" },
        { name: "Alice Johnson", street: "789 Pine Ln", city: "Somecity", state: "TX", zip: "75001", country: "USA" },
        { name: "Bob Brown", street: "101 Maple Dr", city: "Villagetown", state: "FL", zip: "33101", country: "USA" },
        { name: "Charlie Davis", street: "202 Birch Rd", city: "Metropolis", state: "IL", zip: "60601", country: "USA" },
        { name: "Diana Evans", street: "303 Cedar Ct", city: "Springfield", state: "MA", zip: "01101", country: "USA" },
        { name: "Edward Green", street: "404 Willow Way", city: "Riverside", state: "GA", zip: "30301", country: "USA" },
        { name: "Fiona Harris", street: "505 Elm St", city: "Lakewood", state: "OH", zip: "44101", country: "USA" },
        { name: "George Irwin", street: "606 Aspen Cir", city: "Hilltop", state: "WA", zip: "98101", country: "USA" },
        { name: "Hannah Jones", street: "707 Spruce Pl", city: "Bayview", state: "OR", zip: "97001", country: "USA" },
        { name: "Ian King", street: "808 Redwood Ave", city: "Mountain", state: "CO", zip: "80001", country: "USA" }
    ];

    const itemsPerPage = 5;
    let currentPage = 1;
    let totalPages = Math.ceil(allAddresses.length / itemsPerPage);

    const addressListDiv = document.getElementById('addressList');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const pageInfoSpan = document.getElementById('pageInfo');
    const noAddressesDiv = document.getElementById('noAddresses');

    function displayAddresses() {
        addressListDiv.innerHTML = ''; // Clear previous addresses
        noAddressesDiv.style.display = 'none';
        addressListDiv.style.display = 'flex'; // Ensure it's visible

        if (allAddresses.length === 0) {
            noAddressesDiv.style.display = 'block';
            addressListDiv.style.display = 'none';
            updatePaginationControls(); // Still update controls to disable them
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const addressesToShow = allAddresses.slice(startIndex, endIndex);

        addressesToShow.forEach(addr => {
            const addressItem = document.createElement('div');
            addressItem.classList.add('address-item');
            addressItem.innerHTML = `
                <strong>${addr.name}</strong>
                ${addr.street}<br>
                ${addr.city}, ${addr.state} ${addr.zip}<br>
                ${addr.country}
            `;
            addressListDiv.appendChild(addressItem);
        });

        updatePaginationControls();
    }

    function updatePaginationControls() {
        if (allAddresses.length === 0) {
            pageInfoSpan.textContent = 'Page 0 of 0';
            prevButton.disabled = true;
            nextButton.disabled = true;
            return;
        }

        totalPages = Math.ceil(allAddresses.length / itemsPerPage); // Recalculate in case data changes
        pageInfoSpan.textContent = `Page ${currentPage} of ${totalPages}`;

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages || totalPages === 0;
    }

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayAddresses();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayAddresses();
        }
    });

    // Initial display
    displayAddresses();
});