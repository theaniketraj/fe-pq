document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const folderListUl = document.getElementById('folderList');
    const emailListUl = document.getElementById('emailList');
    const currentFolderNameH2 = document.getElementById('currentFolderName');
    const searchEmailsInput = document.getElementById('searchEmails');

    const noEmailSelectedViewDiv = document.getElementById('noEmailSelectedView');
    const emailContentViewDiv = document.getElementById('emailContentView');
    const emailSubjectH3 = document.getElementById('emailSubject');
    const emailFromSpan = document.getElementById('emailFrom');
    const emailToSpan = document.getElementById('emailTo');
    const emailDateSpan = document.getElementById('emailDate');
    const emailBodyDiv = document.getElementById('emailBody');
    const composeBtn = document.getElementById('composeBtn');


    // --- Sample Data ---
    const foldersData = [
        { id: 'inbox', name: 'Inbox' },
        { id: 'sent', name: 'Sent Items' },
        { id: 'drafts', name: 'Drafts' },
        { id: 'junk', name: 'Junk Email' },
        { id: 'archive', name: 'Archive' }
    ];

    let emailsData = [
        { id: 'e1', folderId: 'inbox', sender: 'Alice Wonderland', recipient: 'you@example.com', subject: 'Meeting Reminder', body: 'Hi team,\n\nJust a friendly reminder about our meeting tomorrow at 10 AM.\n\nBest,\nAlice', timestamp: new Date(2023, 10, 20, 9, 30), isRead: false },
        { id: 'e2', folderId: 'inbox', sender: 'Bob The Builder', recipient: 'you@example.com', subject: 'Project Update', body: 'The project is on track. I\'ve attached the latest report.', timestamp: new Date(2023, 10, 19, 15, 0), isRead: true },
        { id: 'e3', folderId: 'sent', sender: 'you@example.com', recipient: 'Charlie Brown', subject: 'Re: Your Question', body: 'Hi Charlie,\n\nThanks for your question. Here is the answer...', timestamp: new Date(2023, 10, 18, 11, 20), isRead: true },
        { id: 'e4', folderId: 'inbox', sender: 'Support Team', recipient: 'you@example.com', subject: 'Your ticket #12345 has been updated', body: 'Dear User,\n\nYour support ticket has been updated. Please log in to view the details.\n\nThanks,\nSupport', timestamp: new Date(2023, 10, 20, 14, 5), isRead: false },
        { id: 'e5', folderId: 'drafts', sender: 'you@example.com', recipient: 'Diana Prince', subject: '(No Subject)', body: 'Draft of important email...', timestamp: new Date(2023, 10, 17, 16, 0), isRead: true },
        { id: 'e6', folderId: 'junk', sender: 'Spam King', recipient: 'you@example.com', subject: '!!! YOU WON !!!', body: 'Click here to claim your prize!', timestamp: new Date(2023, 10, 15, 8, 0), isRead: false },
        { id: 'e7', folderId: 'inbox', sender: 'Eve Online', recipient: 'you@example.com', subject: 'Welcome to our newsletter!', body: 'Thanks for subscribing! Get ready for exciting updates.', timestamp: new Date(2023, 10, 21, 10, 0), isRead: false },

    ];

    // --- State ---
    let currentFolderId = 'inbox';
    let currentEmailId = null;
    let currentSearchTerm = '';

    // --- Helper Functions ---
    function formatDate(date) {
        if (!(date instanceof Date)) date = new Date(date); // Ensure it's a Date object
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // --- Render Functions ---
    function renderFolders() {
        folderListUl.innerHTML = '';
        foldersData.forEach(folder => {
            const li = document.createElement('li');
            li.textContent = folder.name;
            li.dataset.folderId = folder.id;
            if (folder.id === currentFolderId) {
                li.classList.add('active');
            }
            li.addEventListener('click', () => selectFolder(folder.id));
            folderListUl.appendChild(li);
        });
    }

    function renderEmailList() {
        emailListUl.innerHTML = '';
        currentFolderNameH2.textContent = foldersData.find(f => f.id === currentFolderId)?.name || 'Folder';

        const filteredEmails = emailsData
            .filter(email => email.folderId === currentFolderId)
            .filter(email => { // Search filter
                if (!currentSearchTerm) return true;
                const term = currentSearchTerm.toLowerCase();
                return email.sender.toLowerCase().includes(term) ||
                    email.subject.toLowerCase().includes(term) ||
                    email.body.toLowerCase().includes(term);
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Newest first

        if (filteredEmails.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No emails in this folder' + (currentSearchTerm ? ' matching your search.' : '.');
            li.style.textAlign = 'center';
            li.style.padding = '20px';
            li.style.color = '#605e5c';
            emailListUl.appendChild(li);
            return;
        }

        filteredEmails.forEach(email => {
            const li = document.createElement('li');
            li.classList.add('email-item');
            li.dataset.emailId = email.id;
            if (email.id === currentEmailId) {
                li.classList.add('selected');
            }
            if (!email.isRead) {
                li.classList.add('unread');
            }

            li.innerHTML = `
                <span class="email-item-date">${formatDate(email.timestamp)}</span>
                <span class="email-sender">${email.sender}</span>
                <span class="email-subject">${email.subject || '(No Subject)'}</span>
                <span class="email-snippet">${email.body.substring(0, 50)}...</span>
            `;
            li.addEventListener('click', () => selectEmail(email.id));
            emailListUl.appendChild(li);
        });
    }

    function renderEmailContent() {
        if (!currentEmailId) {
            noEmailSelectedViewDiv.classList.remove('hidden');
            emailContentViewDiv.classList.add('hidden');
            return;
        }

        const email = emailsData.find(e => e.id === currentEmailId);
        if (!email) {
            noEmailSelectedViewDiv.classList.remove('hidden');
            emailContentViewDiv.classList.add('hidden');
            console.error("Email not found:", currentEmailId);
            return;
        }

        noEmailSelectedViewDiv.classList.add('hidden');
        emailContentViewDiv.classList.remove('hidden');

        emailSubjectH3.textContent = email.subject || '(No Subject)';
        emailFromSpan.textContent = email.sender;
        emailToSpan.textContent = email.recipient;
        emailDateSpan.textContent = formatDate(email.timestamp);
        emailBodyDiv.textContent = email.body; // Using textContent for simplicity (prevents XSS if body was HTML)
        // For HTML emails, you'd use .innerHTML and sanitize
    }

    // --- Event Handlers & Logic ---
    function selectFolder(folderId) {
        currentFolderId = folderId;
        currentEmailId = null; // Deselect email when changing folder
        currentSearchTerm = ''; // Reset search on folder change
        searchEmailsInput.value = '';
        renderFolders(); // Re-render to update active class
        renderEmailList();
        renderEmailContent(); // Will show "no email selected"
    }

    function selectEmail(emailId) {
        currentEmailId = emailId;
        const email = emailsData.find(e => e.id === emailId);
        if (email && !email.isRead) {
            email.isRead = true;
            // No need to re-render entire list, just update this item's class
            const emailItemElement = emailListUl.querySelector(`.email-item[data-email-id="${emailId}"]`);
            if (emailItemElement) {
                emailItemElement.classList.remove('unread');
            }
        }
        // Update selected class on list items
        document.querySelectorAll('.email-item.selected').forEach(el => el.classList.remove('selected'));
        const selectedEl = emailListUl.querySelector(`.email-item[data-email-id="${emailId}"]`);
        if (selectedEl) selectedEl.classList.add('selected');

        renderEmailContent();
    }

    searchEmailsInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        renderEmailList(); // Re-render list with search filter
        // If an email was selected, it might disappear from list. Clear reading pane.
        if (currentEmailId && !emailsData.find(em => em.id === currentEmailId && em.folderId === currentFolderId && (em.subject.toLowerCase().includes(currentSearchTerm.toLowerCase()) || em.sender.toLowerCase().includes(currentSearchTerm.toLowerCase())))) {
            currentEmailId = null;
            renderEmailContent();
        }
    });

    composeBtn.addEventListener('click', () => {
        alert("Compose new email functionality would go here!");
        // In a real app, this would open a new modal or view.
    });


    // --- Initial Setup ---
    renderFolders();
    renderEmailList();
    renderEmailContent(); // Show "no email selected" initially
});