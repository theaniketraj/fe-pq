document.addEventListener('DOMContentLoaded', () => {
    // Sample data - this could come from an API or be hardcoded
    const items = [
        "Apple iPhone 15 Pro",
        "Samsung Galaxy S24 Ultra",
        "Google Pixel 8 Pro",
        "Sony WH-1000XM5 Headphones",
        "Bose QuietComfort Ultra Earbuds",
        "Dell XPS 15 Laptop",
        "MacBook Air M3",
        "LG C3 OLED TV",
        "Nintendo Switch OLED",
        "PlayStation 5",
        "Instant Pot Duo",
        "Kindle Paperwhite",
        "Apple Watch Series 9",
        "Fitbit Charge 6"
    ];

    const searchInput = document.getElementById('searchInput');
    const itemList = document.getElementById('itemList');
    const noResultsMessage = document.getElementById('noResultsMessage');

    // Function to display items in the list
    function displayItems(itemsToDisplay) {
        itemList.innerHTML = ''; // Clear current list

        if (itemsToDisplay.length === 0 && searchInput.value.trim() !== '') {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }

        itemsToDisplay.forEach(itemText => {
            const li = document.createElement('li');
            li.textContent = itemText;
            itemList.appendChild(li);
        });
    }

    // Function to filter items based on search query
    function filterItems() {
        const query = searchInput.value.toLowerCase().trim();

        if (query === '') {
            displayItems(items); // Show all items if search is empty
            return;
        }

        const filteredItems = items.filter(item => {
            return item.toLowerCase().includes(query);
        });

        displayItems(filteredItems);
    }

    // Event listener for the search input
    searchInput.addEventListener('input', filterItems);

    // Initial display of all items
    displayItems(items);
});