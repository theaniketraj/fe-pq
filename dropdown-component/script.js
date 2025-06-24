document.addEventListener('DOMContentLoaded', () => {
    function createDropdown(dropdownElementId) {
        const dropdown = document.getElementById(dropdownElementId);
        if (!dropdown) return;

        const selectedValueDisplay = dropdown.querySelector('.dropdown-selected-value');
        const optionsList = dropdown.querySelector('.dropdown-options');
        const options = Array.from(optionsList.querySelectorAll('li[role="option"]'));
        const placeholderText = selectedValueDisplay.textContent; // Store initial placeholder

        let focusedOptionIndex = -1; // For keyboard navigation

        function toggleDropdown(forceOpen = null) {
            const isOpen = dropdown.classList.contains('open');
            if (forceOpen === true || (forceOpen === null && !isOpen)) {
                dropdown.classList.add('open');
                optionsList.setAttribute('aria-hidden', 'false');
                // Focus the first non-disabled option or the selected one
                const selected = optionsList.querySelector('.selected');
                if (selected) {
                    focusedOptionIndex = options.indexOf(selected);
                    selected.focus(); // For screen readers
                } else {
                    focusedOptionIndex = options.findIndex(opt => !opt.classList.contains('disabled'));
                    if (focusedOptionIndex !== -1) options[focusedOptionIndex].focus();
                }
            } else if (forceOpen === false || (forceOpen === null && isOpen)) {
                dropdown.classList.remove('open');
                optionsList.setAttribute('aria-hidden', 'true');
                focusedOptionIndex = -1; // Reset focus index
            }
        }

        function selectOption(optionElement) {
            if (optionElement.classList.contains('disabled')) return;

            const value = optionElement.dataset.value;
            const text = optionElement.textContent;

            selectedValueDisplay.textContent = text;
            selectedValueDisplay.classList.remove('placeholder'); // Remove placeholder style if it had one

            // Remove 'selected' class from previously selected option
            options.forEach(opt => opt.classList.remove('selected'));
            // Add 'selected' class to the new option
            optionElement.classList.add('selected');
            optionElement.setAttribute('aria-selected', 'true');


            toggleDropdown(false); // Close dropdown
            dropdown.focus(); // Return focus to the main dropdown element

            // Trigger a custom event or update a display (example)
            const displayElementId = dropdown.id === 'fruitDropdown' ? 'selectedValueDisplay' : 'selectedCountryDisplay';
            const displayElement = document.getElementById(displayElementId);
            if (displayElement) {
                displayElement.textContent = value ? `${text} (Value: ${value})` : 'None';
            }
            console.log(`Selected: ${text}, Value: ${value} from ${dropdown.id}`);
        }

        function handleKeyboardNavigation(event) {
            if (!dropdown.classList.contains('open')) {
                if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    toggleDropdown(true);
                }
                return;
            }

            const enabledOptions = options.filter(opt => !opt.classList.contains('disabled'));
            if (enabledOptions.length === 0) return;

            let currentFocusedInEnabled = enabledOptions.indexOf(options[focusedOptionIndex]);

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    currentFocusedInEnabled = (currentFocusedInEnabled + 1) % enabledOptions.length;
                    focusedOptionIndex = options.indexOf(enabledOptions[currentFocusedInEnabled]);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    currentFocusedInEnabled = (currentFocusedInEnabled - 1 + enabledOptions.length) % enabledOptions.length;
                    focusedOptionIndex = options.indexOf(enabledOptions[currentFocusedInEnabled]);
                    break;
                case 'Enter':
                case ' ': // Space also selects
                    event.preventDefault();
                    if (focusedOptionIndex !== -1 && !options[focusedOptionIndex].classList.contains('disabled')) {
                        selectOption(options[focusedOptionIndex]);
                    }
                    return; // Don't highlight after selection
                case 'Escape':
                    event.preventDefault();
                    toggleDropdown(false);
                    dropdown.focus(); // Return focus to the main dropdown element
                    return;
                case 'Tab':
                    toggleDropdown(false); // Close on tab out
                    // Allow default tab behavior
                    return;
                default:
                    // Allow typing to select (simple first-letter match)
                    const char = event.key.toLowerCase();
                    const firstMatchIndex = enabledOptions.findIndex(opt => opt.textContent.toLowerCase().startsWith(char));
                    if (firstMatchIndex !== -1) {
                        focusedOptionIndex = options.indexOf(enabledOptions[firstMatchIndex]);
                    }
                    break;
            }

            // Remove previous focus style and apply to new
            options.forEach(opt => opt.classList.remove('focused'));
            if (focusedOptionIndex !== -1) {
                options[focusedOptionIndex].classList.add('focused');
                options[focusedOptionIndex].focus(); // For screen readers and visual scroll
                optionsList.scrollTop = options[focusedOptionIndex].offsetTop - optionsList.offsetTop; // Scroll into view
            }
        }

        // Event Listeners
        dropdown.addEventListener('click', (event) => {
            // Prevent click on selected value from re-selecting if options are open
            if (event.target.closest('.dropdown-options')) return;
            toggleDropdown();
        });

        dropdown.addEventListener('keydown', handleKeyboardNavigation);

        options.forEach(option => {
            option.addEventListener('click', () => selectOption(option));
            // Make options focusable for keyboard nav, but not in natural tab order initially
            option.setAttribute('tabindex', '-1');
        });

        // Close dropdown if clicked outside
        document.addEventListener('click', (event) => {
            if (!dropdown.contains(event.target) && dropdown.classList.contains('open')) {
                toggleDropdown(false);
            }
        });

        // Set initial placeholder style if needed
        if (selectedValueDisplay.textContent === placeholderText) {
            selectedValueDisplay.classList.add('placeholder');
        }
    }

    // Initialize the first dropdown
    createDropdown('fruitDropdown');


    // --- Example: Dynamically populating the second dropdown ---
    const countryDropdownElement = document.getElementById('countryDropdown');
    const countryOptionsList = document.getElementById('countryOptionsList');
    const countries = [
        { value: 'us', name: 'United States' },
        { value: 'ca', name: 'Canada' },
        { value: 'gb', name: 'United Kingdom', disabled: true },
        { value: 'de', name: 'Germany' },
        { value: 'fr', name: 'France' }
    ];

    if (countryOptionsList) {
        countries.forEach(country => {
            const li = document.createElement('li');
            li.setAttribute('role', 'option');
            li.dataset.value = country.value;
            li.textContent = country.name;
            if (country.disabled) {
                li.classList.add('disabled');
                li.setAttribute('aria-disabled', 'true');
            }
            countryOptionsList.appendChild(li);
        });
        // Initialize the second dropdown after populating its options
        createDropdown('countryDropdown');
    }
});