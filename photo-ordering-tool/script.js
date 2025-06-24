document.addEventListener('DOMContentLoaded', () => {
    // --- Sample Data ---
    const availablePhotos = [
        { id: 'p1', name: 'Sunset Bliss', basePrice: 5.00, imageUrl: 'https://via.placeholder.com/150/FFC107/000000?Text=Sunset' },
        { id: 'p2', name: 'Mountain Majesty', basePrice: 6.50, imageUrl: 'https://via.placeholder.com/150/8BC34A/000000?Text=Mountain' },
        { id: 'p3', name: 'Ocean Waves', basePrice: 4.75, imageUrl: 'https://via.placeholder.com/150/03A9F4/000000?Text=Ocean' },
        { id: 'p4', name: 'Forest Trail', basePrice: 5.25, imageUrl: 'https://via.placeholder.com/150/4CAF50/000000?Text=Forest' },
        { id: 'p5', name: 'City Lights', basePrice: 7.00, imageUrl: 'https://via.placeholder.com/150/9C27B0/000000?Text=City' },
        { id: 'p6', name: 'Desert Dunes', basePrice: 4.50, imageUrl: 'https://via.placeholder.com/150/FF9800/000000?Text=Desert' }
    ];

    const photoSizes = [
        { id: 's1', name: '4x6 Print', priceMultiplier: 1.0 },
        { id: 's2', name: '5x7 Print', priceMultiplier: 1.5 },
        { id: 's3', name: '8x10 Print', priceMultiplier: 2.5 },
        { id: 's4', name: '11x14 Canvas', priceMultiplier: 5.0 }
    ];

    // --- DOM Elements ---
    const photoGridDiv = document.getElementById('photoGrid');
    const selectedPhotosListDiv = document.getElementById('selectedPhotosList');
    const totalPriceSpan = document.getElementById('totalPrice');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const emptyOrderMessageP = document.querySelector('.empty-order-message');

    // --- State ---
    let currentOrder = []; // Array of { photoId, photoName, quantity, sizeId, sizeName, unitPrice, itemTotal }

    // --- Render Functions ---
    function renderPhotoGallery() {
        photoGridDiv.innerHTML = '';
        availablePhotos.forEach(photo => {
            const card = document.createElement('div');
            card.classList.add('photo-card');
            card.dataset.photoId = photo.id;
            if (currentOrder.some(item => item.photoId === photo.id)) {
                card.classList.add('selected');
            }

            card.innerHTML = `
                <img src="${photo.imageUrl}" alt="${photo.name}">
                <div class="photo-info">
                    <span class="photo-name">${photo.name}</span>
                    <span class="photo-price-info">Starts at $${photo.basePrice.toFixed(2)}</span>
                </div>
            `;
            card.addEventListener('click', () => togglePhotoSelection(photo.id));
            photoGridDiv.appendChild(card);
        });
    }

    function renderOrderSummary() {
        selectedPhotosListDiv.innerHTML = ''; // Clear previous items

        if (currentOrder.length === 0) {
            if (emptyOrderMessageP) emptyOrderMessageP.style.display = 'block';
        } else {
            if (emptyOrderMessageP) emptyOrderMessageP.style.display = 'none';

            currentOrder.forEach((orderItem, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('selected-photo-item');
                itemDiv.dataset.orderIndex = index;

                let sizeOptionsHtml = '';
                photoSizes.forEach(size => {
                    sizeOptionsHtml += `<option value="${size.id}" ${orderItem.sizeId === size.id ? 'selected' : ''}>${size.name}</option>`;
                });

                itemDiv.innerHTML = `
                    <h4>${orderItem.photoName}</h4>
                    <button class="remove-item-btn" data-photo-id="${orderItem.photoId}">×</button>
                    <div>
                        <label for="quantity-${orderItem.photoId}">Quantity:</label>
                        <input type="number" id="quantity-${orderItem.photoId}" value="${orderItem.quantity}" min="1" data-photo-id="${orderItem.photoId}" class="quantity-input">
                    </div>
                    <div>
                        <label for="size-${orderItem.photoId}">Size:</label>
                        <select id="size-${orderItem.photoId}" data-photo-id="${orderItem.photoId}" class="size-select">
                            ${sizeOptionsHtml}
                        </select>
                    </div>
                    <div class="item-price-display">Item Total: $${orderItem.itemTotal.toFixed(2)}</div>
                `;
                selectedPhotosListDiv.appendChild(itemDiv);
            });

            // Add event listeners for quantity and size changes
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', handleOrderItemChange);
                input.addEventListener('input', handleOrderItemChange); // For immediate feedback
            });
            document.querySelectorAll('.size-select').forEach(select => {
                select.addEventListener('change', handleOrderItemChange);
            });
            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', handleRemoveItem);
            });
        }
        updateTotalPrice();
    }

    function updateTotalPrice() {
        const total = currentOrder.reduce((sum, item) => sum + item.itemTotal, 0);
        totalPriceSpan.textContent = `$${total.toFixed(2)}`;
        placeOrderBtn.disabled = currentOrder.length === 0;
    }

    // --- Event Handlers & Logic ---
    function togglePhotoSelection(photoId) {
        const photo = availablePhotos.find(p => p.id === photoId);
        if (!photo) return;

        const existingItemIndex = currentOrder.findIndex(item => item.photoId === photoId);

        if (existingItemIndex > -1) {
            // Already selected, so deselect (remove from order)
            currentOrder.splice(existingItemIndex, 1);
            document.querySelector(`.photo-card[data-photo-id="${photoId}"]`)?.classList.remove('selected');
        } else {
            // Not selected, so add to order with default options
            const defaultSize = photoSizes[0];
            const unitPrice = photo.basePrice * defaultSize.priceMultiplier;
            currentOrder.push({
                photoId: photo.id,
                photoName: photo.name,
                quantity: 1,
                sizeId: defaultSize.id,
                sizeName: defaultSize.name,
                basePrice: photo.basePrice,
                unitPrice: unitPrice,
                itemTotal: unitPrice * 1
            });
            document.querySelector(`.photo-card[data-photo-id="${photoId}"]`)?.classList.add('selected');
        }
        renderOrderSummary();
    }

    function handleOrderItemChange(event) {
        const photoId = event.target.dataset.photoId;
        const orderItem = currentOrder.find(item => item.photoId === photoId);
        if (!orderItem) return;

        const quantityInput = document.getElementById(`quantity-${photoId}`);
        const sizeSelect = document.getElementById(`size-${photoId}`);

        orderItem.quantity = parseInt(quantityInput.value) || 1;
        if (orderItem.quantity < 1) orderItem.quantity = 1; // Ensure quantity is at least 1
        quantityInput.value = orderItem.quantity; // Update input if it was invalid

        orderItem.sizeId = sizeSelect.value;
        const selectedSize = photoSizes.find(s => s.id === orderItem.sizeId);
        orderItem.sizeName = selectedSize.name;
        orderItem.unitPrice = orderItem.basePrice * selectedSize.priceMultiplier;
        orderItem.itemTotal = orderItem.unitPrice * orderItem.quantity;

        // Re-render only the specific item's price display for efficiency
        const itemDiv = sizeSelect.closest('.selected-photo-item');
        if (itemDiv) {
            const priceDisplay = itemDiv.querySelector('.item-price-display');
            if (priceDisplay) {
                priceDisplay.textContent = `Item Total: $${orderItem.itemTotal.toFixed(2)}`;
            }
        }
        updateTotalPrice();
    }

    function handleRemoveItem(event) {
        const photoIdToRemove = event.target.dataset.photoId;
        currentOrder = currentOrder.filter(item => item.photoId !== photoIdToRemove);
        document.querySelector(`.photo-card[data-photo-id="${photoIdToRemove}"]`)?.classList.remove('selected');
        renderOrderSummary();
    }

    placeOrderBtn.addEventListener('click', () => {
        if (currentOrder.length === 0) {
            alert("Your order is empty!");
            return;
        }
        const orderDetails = currentOrder.map(item =>
            `${item.quantity}x "${item.photoName}" (${item.sizeName}) - $${item.itemTotal.toFixed(2)}`
        ).join('\n');
        const total = currentOrder.reduce((sum, item) => sum + item.itemTotal, 0);

        alert(`Order Placed!\n\nDetails:\n${orderDetails}\n\nTotal: $${total.toFixed(2)}\n\nThank you for your order!`);

        // Reset order
        currentOrder = [];
        renderPhotoGallery(); // To deselect all cards
        renderOrderSummary();
    });

    // --- Initial Setup ---
    renderPhotoGallery();
    renderOrderSummary(); // Will show empty order message
});