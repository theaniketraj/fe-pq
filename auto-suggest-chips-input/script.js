document.addEventListener('DOMContentLoaded', () => {
    const chipsContainer = document.getElementById('chipsContainer');
    const recipientsInput = document.getElementById('recipientsInput');
    const suggestionsList = document.getElementById('suggestionsList');
    const sendEmailBtn = document.getElementById('sendEmailBtn');

    // Sample "people" data (in a real app, this would come from an API)
    const peopleData = [
        { id: 'u1', name: 'Alice Wonderland', email: 'alice@example.com', avatarInitial: 'A' },
        { id: 'u2', name: 'Bob The Builder', email: 'bob@example.com', avatarInitial: 'B' },
        { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com', avatarInitial: 'C' },
        { id: 'u4', name: 'Diana Prince', email: 'diana@example.com', avatarInitial: 'D' },
        { id: 'u5', name: 'Edward Scissorhands', email: 'edward@example.com', avatarInitial: 'E' },
        { id: 'u6', name: 'Alicia Keys', email: 'alicia@example.com', avatarInitial: 'AK' }
    ];

    let selectedRecipients = []; // Array of person objects
    let activeSuggestionIndex = -1;

    // --- Chip Creation and Management ---
    function createChip(person) {
        const chip = document.createElement('div');
        chip.classList.add('chip');
        chip.dataset.personId = person.id;

        const avatar = document.createElement('div');
        avatar.classList.add('chip-avatar');
        avatar.textContent = person.avatarInitial || person.name.charAt(0).toUpperCase();
        // For real avatars:
        // if (person.avatarUrl) {
        //     const img = document.createElement('img');
        //     img.src = person.avatarUrl;
        //     avatar.appendChild(img);
        // } else { avatar.textContent = ... }


        const nameSpan = document.createElement('span');
        nameSpan.classList.add('chip-name');
        nameSpan.textContent = person.name;

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('chip-remove-btn');
        removeBtn.innerHTML = '×'; // '×' character
        removeBtn.setAttribute('aria-label', `Remove ${person.name}`);
        removeBtn.addEventListener('click', () => removeChip(person.id));

        chip.appendChild(nameSpan); // Name first
        chip.appendChild(avatar);   // Then avatar
        chip.appendChild(removeBtn);// Then remove button

        // Insert chip before the input field
        chipsContainer.insertBefore(chip, recipientsInput);
    }

    function removeChip(personId) {
        selectedRecipients = selectedRecipients.filter(p => p.id !== personId);
        const chipToRemove = chipsContainer.querySelector(`.chip[data-person-id="${personId}"]`);
        if (chipToRemove) {
            chipsContainer.removeChild(chipToRemove);
        }
        recipientsInput.focus(); // Keep focus in the input area
        updateSuggestions(''); // Clear suggestions as input might be empty now
    }

    function addRecipient(person) {
        // Avoid adding duplicates
        if (selectedRecipients.some(p => p.id === person.id)) {
            recipientsInput.value = ''; // Clear input even if duplicate
            hideSuggestions();
            return;
        }
        selectedRecipients.push(person);
        createChip(person);
        recipientsInput.value = ''; // Clear the input field
        hideSuggestions();
        recipientsInput.focus();
    }

    // --- Auto-Suggestions ---
    function updateSuggestions(query) {
        const lowerQuery = query.toLowerCase().trim();
        suggestionsList.innerHTML = ''; // Clear previous suggestions
        activeSuggestionIndex = -1; // Reset active suggestion

        if (lowerQuery === '') {
            hideSuggestions();
            return;
        }

        const filteredPeople = peopleData.filter(person =>
            (person.name.toLowerCase().includes(lowerQuery) ||
                person.email.toLowerCase().includes(lowerQuery)) &&
            !selectedRecipients.some(sr => sr.id === person.id) // Don't suggest already selected
        );

        if (filteredPeople.length > 0) {
            filteredPeople.forEach((person, index) => {
                const li = document.createElement('li');
                li.dataset.personId = person.id;

                const avatar = document.createElement('div');
                avatar.classList.add('suggestion-avatar');
                avatar.textContent = person.avatarInitial || person.name.charAt(0).toUpperCase();

                const nameSpan = document.createElement('span');
                nameSpan.classList.add('suggestion-name');
                nameSpan.textContent = person.name;

                const emailSpan = document.createElement('span');
                emailSpan.classList.add('suggestion-email');
                emailSpan.textContent = `(${person.email})`;

                li.appendChild(avatar);
                li.appendChild(nameSpan);
                li.appendChild(emailSpan);

                li.addEventListener('click', () => {
                    addRecipient(person);
                });
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = 'block';
        } else {
            hideSuggestions();
        }
    }

    function hideSuggestions() {
        suggestionsList.style.display = 'none';
        activeSuggestionIndex = -1;
    }

    function highlightSuggestion(index) {
        const suggestions = suggestionsList.querySelectorAll('li');
        suggestions.forEach((li, i) => {
            li.classList.toggle('active-suggestion', i === index);
        });
    }

    // --- Event Listeners ---
    recipientsInput.addEventListener('input', (e) => {
        updateSuggestions(e.target.value);
    });

    recipientsInput.addEventListener('keydown', (e) => {
        const suggestions = suggestionsList.querySelectorAll('li');

        if (suggestionsList.style.display === 'block' && suggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeSuggestionIndex = (activeSuggestionIndex + 1) % suggestions.length;
                highlightSuggestion(activeSuggestionIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeSuggestionIndex = (activeSuggestionIndex - 1 + suggestions.length) % suggestions.length;
                highlightSuggestion(activeSuggestionIndex);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestionIndex > -1 && suggestions[activeSuggestionIndex]) {
                    const personId = suggestions[activeSuggestionIndex].dataset.personId;
                    const person = peopleData.find(p => p.id === personId);
                    if (person) addRecipient(person);
                } else if (recipientsInput.value.trim() !== '') {
                    // Try to match typed text if no suggestion selected (simple match for demo)
                    const typedName = recipientsInput.value.trim().toLowerCase();
                    const matchedPerson = peopleData.find(p => p.name.toLowerCase() === typedName && !selectedRecipients.some(sr => sr.id === p.id));
                    if (matchedPerson) {
                        addRecipient(matchedPerson);
                    } else {
                        // Optionally show an error or just clear input
                        console.log("No exact match for typed name:", recipientsInput.value);
                        recipientsInput.value = ''; // Clear if no match
                        hideSuggestions();
                    }
                }
            } else if (e.key === 'Escape') {
                hideSuggestions();
            }
        } else if (e.key === 'Enter' && recipientsInput.value.trim() !== '') {
            // Handle Enter even if suggestions are hidden (e.g., after Escape)
            e.preventDefault();
            const typedName = recipientsInput.value.trim().toLowerCase();
            const matchedPerson = peopleData.find(p => p.name.toLowerCase() === typedName && !selectedRecipients.some(sr => sr.id === p.id));
            if (matchedPerson) {
                addRecipient(matchedPerson);
            } else {
                recipientsInput.value = '';
                hideSuggestions();
            }
        }


        // Handle Backspace to remove last chip if input is empty
        if (e.key === 'Backspace' && recipientsInput.value === '' && selectedRecipients.length > 0) {
            const lastRecipient = selectedRecipients[selectedRecipients.length - 1];
            removeChip(lastRecipient.id);
        }
    });

    // Click on container to focus input
    chipsContainer.addEventListener('click', (e) => {
        // Only focus if the click is not on a chip or remove button
        if (e.target === chipsContainer || e.target === recipientsInput) {
            recipientsInput.focus();
        }
    });

    // Hide suggestions if clicked outside
    document.addEventListener('click', (e) => {
        if (!chipsContainer.contains(e.target) && !suggestionsList.contains(e.target)) {
            hideSuggestions();
        }
    });

    sendEmailBtn.addEventListener('click', () => {
        if (selectedRecipients.length === 0) {
            alert("Please add at least one recipient.");
            return;
        }
        const recipientNames = selectedRecipients.map(p => p.name).join(', ');
        const subject = document.getElementById('subjectInput').value || "(No Subject)";
        const body = document.getElementById('bodyTextarea').value || "(No Body)";

        alert(`Email Sent!\nTo: ${recipientNames}\nSubject: ${subject}\nBody: ${body.substring(0, 50)}...`);

        // Clear form (optional)
        selectedRecipients = [];
        chipsContainer.querySelectorAll('.chip').forEach(chip => chip.remove());
        recipientsInput.value = '';
        document.getElementById('subjectInput').value = '';
        document.getElementById('bodyTextarea').value = '';
        hideSuggestions();
    });

});