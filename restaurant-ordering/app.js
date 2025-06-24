document.addEventListener('DOMContentLoaded', () => {
    // --- DATA (Hardcoded for this example) ---
    const restaurantsData = [
        {
            id: 'r1',
            name: 'Pizza Palace',
            cuisine: 'Italian, Pizza',
            imageUrl: 'https://via.placeholder.com/300x200/FFD700/000000?Text=Pizza+Palace',
            menu: ['m1', 'm2', 'm3']
        },
        {
            id: 'r2',
            name: 'Burger Barn',
            cuisine: 'American, Burgers',
            imageUrl: 'https://via.placeholder.com/300x200/90EE90/000000?Text=Burger+Barn',
            menu: ['m4', 'm5']
        },
        {
            id: 'r3',
            name: 'Taco Town',
            cuisine: 'Mexican',
            imageUrl: 'https://via.placeholder.com/300x200/ADD8E6/000000?Text=Taco+Town',
            menu: ['m6', 'm7']
        }
    ];

    const menuItemsData = {
        'm1': {
            id: 'm1',
            name: 'Margherita Pizza',
            description: 'Classic cheese and tomato pizza.',
            price: 10.99,
            imageUrl: 'https://via.placeholder.com/150/FFCCCB/000000?Text=Margherita',
            customizationGroups: [
                {
                    id: 'cg1', name: 'Crust Type', type: 'SINGLE_SELECT', isRequired: true, options: [
                        { id: 'opt1', name: 'Thin Crust', priceAdjustment: 0.00 },
                        { id: 'opt2', name: 'Thick Crust', priceAdjustment: 1.00 },
                        { id: 'opt3', name: 'Stuffed Crust', priceAdjustment: 2.50 }
                    ]
                },
                {
                    id: 'cg2', name: 'Extra Toppings', type: 'MULTI_SELECT', maxSelections: 3, options: [
                        { id: 'opt4', name: 'Mushrooms', priceAdjustment: 0.75 },
                        { id: 'opt5', name: 'Olives', priceAdjustment: 0.50 },
                        { id: 'opt6', name: 'Extra Cheese', priceAdjustment: 1.50 },
                        { id: 'opt7', name: 'Pepperoni', priceAdjustment: 1.25 }
                    ]
                }
            ]
        },
        'm2': { id: 'm2', name: 'Pepperoni Pizza', description: 'Pizza with pepperoni topping.', price: 12.99, imageUrl: 'https://via.placeholder.com/150/FFB6C1/000000?Text=Pepperoni', customizationGroups: [ /* Similar to m1 */] },
        'm3': { id: 'm3', name: 'Garlic Bread', description: 'Toasted bread with garlic butter.', price: 4.50, imageUrl: 'https://via.placeholder.com/150/FFFFE0/000000?Text=Garlic+Bread', customizationGroups: [] },
        'm4': {
            id: 'm4',
            name: 'Classic Burger',
            description: 'Beef patty with lettuce, tomato, and cheese.',
            price: 8.99,
            imageUrl: 'https://via.placeholder.com/150/98FB98/000000?Text=Burger',
            customizationGroups: [
                {
                    id: 'cg3', name: 'Add Ons', type: 'MULTI_SELECT', options: [
                        { id: 'opt8', name: 'Bacon', priceAdjustment: 1.50 },
                        { id: 'opt9', name: 'Extra Patty', priceAdjustment: 3.00 }
                    ]
                },
                {
                    id: 'cg4', name: 'Side Salad', type: 'SINGLE_SELECT', isRequired: false, options: [
                        { id: 'opt10', name: 'Caesar Salad', priceAdjustment: 2.00 },
                        { id: 'opt11', name: 'Garden Salad', priceAdjustment: 1.50 }
                    ]
                }
            ]
        },
        'm5': { id: 'm5', name: 'Fries', description: 'Crispy golden fries.', price: 3.00, imageUrl: 'https://via.placeholder.com/150/F0E68C/000000?Text=Fries', customizationGroups: [] },
        'm6': { id: 'm6', name: 'Chicken Tacos (3)', description: 'Three chicken tacos with salsa.', price: 9.50, imageUrl: 'https://via.placeholder.com/150/AFEEEE/000000?Text=Tacos', customizationGroups: [] },
        'm7': { id: 'm7', name: 'Guacamole & Chips', description: 'Fresh guacamole with tortilla chips.', price: 5.00, imageUrl: 'https://via.placeholder.com/150/B0E0E6/000000?Text=Guac', customizationGroups: [] }
    };
    // Fill in m2 customization for better demo
    menuItemsData['m2'].customizationGroups = JSON.parse(JSON.stringify(menuItemsData['m1'].customizationGroups));


    // --- DOM Elements ---
    const restaurantListView = document.getElementById('restaurantView');
    const restaurantListDiv = document.getElementById('restaurantList');
    const menuView = document.getElementById('menuView');
    const menuRestaurantNameH2 = document.getElementById('menuRestaurantName');
    const menuItemsContainerDiv = document.getElementById('menuItemsContainer');
    const backToRestaurantsBtn = document.getElementById('backToRestaurantsBtn');

    const cartItemsListUl = document.getElementById('cartItemsList');
    const cartSubtotalSpan = document.getElementById('cartSubtotal');
    const cartDeliveryFeeSpan = document.getElementById('cartDeliveryFee');
    const cartTotalSpan = document.getElementById('cartTotal');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const emptyCartMessageLi = document.querySelector('.empty-cart-message');

    const customizationModal = document.getElementById('customizationModal');
    const modalItemNameH3 = document.getElementById('modalItemName');
    const modalCustomizationGroupsDiv = document.getElementById('modalCustomizationGroups');
    const modalQuantityInput = document.getElementById('modalQuantity');
    const modalNotesTextarea = document.getElementById('modalNotes');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const closeModalBtn = customizationModal.querySelector('.close-modal-btn');
    const modalTotalPriceSpan = document.getElementById('modalTotalPrice');


    // --- State ---
    let cart = {
        items: [], // { menuItemId, menuItemName, quantity, basePrice, selectedCustomizations: [{groupId, optionId, optionName, priceAdjustment}], itemSubtotal, notes }
        subtotal: 0,
        deliveryFee: 2.50, // Example fee
        total: 0
    };
    let currentMenuItemForCustomization = null; // Stores the full menu item object

    // --- Render Functions ---
    function renderRestaurants() {
        restaurantListDiv.innerHTML = '';
        restaurantsData.forEach(restaurant => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.restaurantId = restaurant.id;
            card.innerHTML = `
                <img src="${restaurant.imageUrl}" alt="${restaurant.name}">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.cuisine}</p>
            `;
            card.addEventListener('click', () => showMenu(restaurant.id));
            restaurantListDiv.appendChild(card);
        });
    }

    function showMenu(restaurantId) {
        const restaurant = restaurantsData.find(r => r.id === restaurantId);
        if (!restaurant) return;

        menuRestaurantNameH2.textContent = `${restaurant.name} - Menu`;
        menuItemsContainerDiv.innerHTML = '';

        restaurant.menu.forEach(menuItemId => {
            const menuItem = menuItemsData[menuItemId];
            if (menuItem) {
                const card = document.createElement('div');
                card.classList.add('card');
                card.dataset.menuItemId = menuItem.id;
                card.innerHTML = `
                    <img src="${menuItem.imageUrl}" alt="${menuItem.name}">
                    <h3>${menuItem.name}</h3>
                    <p>${menuItem.description}</p>
                    <p><strong>$${menuItem.price.toFixed(2)}</strong></p>
                `;
                card.addEventListener('click', () => openCustomizationModal(menuItem.id));
                menuItemsContainerDiv.appendChild(card);
            }
        });

        restaurantListView.classList.add('hidden');
        menuView.classList.remove('hidden');
    }

    function openCustomizationModal(menuItemId) {
        currentMenuItemForCustomization = menuItemsData[menuItemId];
        if (!currentMenuItemForCustomization) return;

        modalItemNameH3.textContent = `Customize ${currentMenuItemForCustomization.name}`;
        modalCustomizationGroupsDiv.innerHTML = '';
        modalQuantityInput.value = 1;
        modalNotesTextarea.value = '';

        currentMenuItemForCustomization.customizationGroups.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.classList.add('customization-group');
            let optionsHtml = `<h4>${group.name} ${group.isRequired ? '*' : ''} ${group.maxSelections ? `(Max ${group.maxSelections})` : ''}</h4>`;

            group.options.forEach(option => {
                const inputType = group.type === 'SINGLE_SELECT' ? 'radio' : 'checkbox';
                const inputName = group.type === 'SINGLE_SELECT' ? `group-${group.id}` : `option-${option.id}`; // Name for radio group
                optionsHtml += `
                    <label>
                        <input type="${inputType}" name="${inputName}" value="${option.id}" data-group-id="${group.id}" data-price-adjustment="${option.priceAdjustment}" ${group.type === 'SINGLE_SELECT' && group.options.indexOf(option) === 0 && group.isRequired ? 'checked' : ''}>
                        ${option.name} ($${option.priceAdjustment.toFixed(2)})
                    </label>
                `;
            });
            groupDiv.innerHTML = optionsHtml;
            modalCustomizationGroupsDiv.appendChild(groupDiv);
        });

        // Add event listeners to update total price on change
        modalCustomizationGroupsDiv.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', updateModalTotalPrice);
        });
        modalQuantityInput.addEventListener('input', updateModalTotalPrice);


        updateModalTotalPrice(); // Initial calculation
        customizationModal.classList.remove('hidden');
    }

    function updateModalTotalPrice() {
        if (!currentMenuItemForCustomization) return;

        let currentItemPrice = currentMenuItemForCustomization.price;
        const quantity = parseInt(modalQuantityInput.value) || 1;

        // Add selected customization prices
        modalCustomizationGroupsDiv.querySelectorAll('input:checked').forEach(input => {
            currentItemPrice += parseFloat(input.dataset.priceAdjustment);
        });

        const totalPrice = currentItemPrice * quantity;
        modalTotalPriceSpan.textContent = `$${totalPrice.toFixed(2)}`;
    }


    function handleAddToCart() {
        if (!currentMenuItemForCustomization) return;

        const quantity = parseInt(modalQuantityInput.value) || 1;
        const notes = modalNotesTextarea.value.trim();
        let itemSubtotal = currentMenuItemForCustomization.price;
        const selectedCustomizations = [];

        modalCustomizationGroupsDiv.querySelectorAll('input:checked').forEach(input => {
            const groupId = input.dataset.groupId || (input.name.startsWith('group-') ? input.name.split('-')[1] : null); // Handle radio name
            const optionId = input.value;
            const group = currentMenuItemForCustomization.customizationGroups.find(g => g.id === groupId);
            const option = group ? group.options.find(o => o.id === optionId) : null;

            if (option) {
                itemSubtotal += option.priceAdjustment;
                selectedCustomizations.push({
                    groupId: group.id,
                    groupName: group.name,
                    optionId: option.id,
                    optionName: option.name,
                    priceAdjustment: option.priceAdjustment
                });
            }
        });

        itemSubtotal *= quantity;

        const cartItem = {
            menuItemId: currentMenuItemForCustomization.id,
            menuItemName: currentMenuItemForCustomization.name,
            quantity: quantity,
            basePrice: currentMenuItemForCustomization.price,
            selectedCustomizations: selectedCustomizations,
            itemSubtotal: itemSubtotal,
            notes: notes
        };

        cart.items.push(cartItem);
        renderCart();
        closeCustomizationModal();
    }

    function renderCart() {
        cartItemsListUl.innerHTML = ''; // Clear previous items
        if (cart.items.length === 0) {
            if (emptyCartMessageLi) emptyCartMessageLi.style.display = 'list-item';
        } else {
            if (emptyCartMessageLi) emptyCartMessageLi.style.display = 'none';
            cart.items.forEach((item, index) => {
                const li = document.createElement('li');
                let customizationsText = item.selectedCustomizations.map(cust => `${cust.optionName} (+$${cust.priceAdjustment.toFixed(2)})`).join(', ');
                if (customizationsText) customizationsText = `<br><span class="cart-item-details">Custom: ${customizationsText}</span>`;
                if (item.notes) customizationsText += `<br><span class="cart-item-details">Notes: ${item.notes}</span>`;

                li.innerHTML = `
                    ${item.quantity}x ${item.menuItemName} - $${item.itemSubtotal.toFixed(2)}
                    ${customizationsText}
                    <button class="remove-item-btn" data-index="${index}">Remove</button>
                `;
                cartItemsListUl.appendChild(li);
            });

            // Add event listeners to new remove buttons
            cartItemsListUl.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemIndex = parseInt(e.target.dataset.index);
                    cart.items.splice(itemIndex, 1);
                    renderCart(); // Re-render cart after removal
                });
            });
        }
        updateCartTotals();
    }

    function updateCartTotals() {
        cart.subtotal = cart.items.reduce((sum, item) => sum + item.itemSubtotal, 0);
        cart.total = cart.subtotal + (cart.items.length > 0 ? cart.deliveryFee : 0); // Apply delivery fee only if cart not empty

        cartSubtotalSpan.textContent = `$${cart.subtotal.toFixed(2)}`;
        cartDeliveryFeeSpan.textContent = `$${(cart.items.length > 0 ? cart.deliveryFee : 0).toFixed(2)}`;
        cartTotalSpan.textContent = `$${cart.total.toFixed(2)}`;

        placeOrderBtn.disabled = cart.items.length === 0;
    }

    function closeCustomizationModal() {
        customizationModal.classList.add('hidden');
        currentMenuItemForCustomization = null;
    }

    function handlePlaceOrder() {
        if (cart.items.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        alert(`Order placed successfully!\nTotal: $${cart.total.toFixed(2)}\nThank you for your order!`);
        // Reset cart
        cart.items = [];
        renderCart(); // This will also update totals
    }


    // --- Event Listeners ---
    backToRestaurantsBtn.addEventListener('click', () => {
        menuView.classList.add('hidden');
        restaurantListView.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', closeCustomizationModal);
    customizationModal.addEventListener('click', (event) => { // Close on overlay click
        if (event.target === customizationModal) {
            closeCustomizationModal();
        }
    });
    addToCartBtn.addEventListener('click', handleAddToCart);
    placeOrderBtn.addEventListener('click', handlePlaceOrder);


    // --- Initial Setup ---
    renderRestaurants();
    renderCart(); // Initial cart render (will show empty)
});