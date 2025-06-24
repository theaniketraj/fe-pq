document.addEventListener('DOMContentLoaded', () => {
    const channelListUl = document.getElementById('channelList');
    const currentChatNameH2 = document.getElementById('currentChatName');
    const messageListDiv = document.getElementById('messageList');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const noChannelSelectedDiv = document.querySelector('.no-channel-selected');

    const currentUser = "You"; // Simulate the current user

    // Sample Data
    const channels = [
        { id: 'general', name: 'General Discussion' },
        { id: 'project-alpha', name: 'Project Alpha' },
        { id: 'random', name: 'Random Chats' },
        { id: 'dev-team', name: 'Development Team' }
    ];

    let messages = {
        'general': [
            { id: 'msg1', sender: 'Alice', text: 'Hello everyone!', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
            { id: 'msg2', sender: currentUser, text: 'Hi Alice! How are you?', timestamp: new Date(Date.now() - 1000 * 60 * 4) },
            { id: 'msg3', sender: 'Bob', text: 'Welcome to the general channel!', timestamp: new Date(Date.now() - 1000 * 60 * 3) }
        ],
        'project-alpha': [
            { id: 'msg4', sender: 'Charlie', text: 'Any updates on Task X?', timestamp: new Date(Date.now() - 1000 * 60 * 10) }
        ],
        'random': [],
        'dev-team': [
            { id: 'msg5', sender: currentUser, text: 'Pushing the latest commit now.', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
            { id: 'msg6', sender: 'Dana', text: 'Great, I\'ll review it.', timestamp: new Date(Date.now() - 1000 * 60 * 1) }
        ]
    };

    let currentChannelId = null;

    function formatTimestamp(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function renderChannels() {
        channelListUl.innerHTML = '';
        channels.forEach(channel => {
            const li = document.createElement('li');
            li.textContent = channel.name;
            li.dataset.channelId = channel.id;
            if (channel.id === currentChannelId) {
                li.classList.add('active');
            }
            li.addEventListener('click', () => selectChannel(channel.id));
            channelListUl.appendChild(li);
        });
    }

    function renderMessages(channelId) {
        messageListDiv.innerHTML = ''; // Clear previous messages
        if (noChannelSelectedDiv) noChannelSelectedDiv.style.display = 'none';


        const channelMessages = messages[channelId] || [];
        if (channelMessages.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No messages in this channel yet. Start the conversation!';
            p.style.textAlign = 'center';
            p.style.color = '#777';
            messageListDiv.appendChild(p);
        } else {
            channelMessages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                messageDiv.classList.add(msg.sender === currentUser ? 'sent' : 'received');

                const senderSpan = document.createElement('div');
                senderSpan.classList.add('sender');
                senderSpan.textContent = msg.sender;

                const textP = document.createElement('p');
                textP.textContent = msg.text;

                const timestampSpan = document.createElement('div');
                timestampSpan.classList.add('timestamp');
                timestampSpan.textContent = formatTimestamp(new Date(msg.timestamp)); // Ensure timestamp is a Date object

                messageDiv.appendChild(senderSpan);
                messageDiv.appendChild(textP);
                messageDiv.appendChild(timestampSpan);
                messageListDiv.appendChild(messageDiv);
            });
        }
        scrollToBottom();
    }

    function selectChannel(channelId) {
        const selectedChannel = channels.find(ch => ch.id === channelId);
        if (!selectedChannel) return;

        currentChannelId = channelId;
        currentChatNameH2.textContent = selectedChannel.name;
        renderChannels(); // Re-render to update active class
        renderMessages(channelId);
        messageInput.focus();
    }

    function handleSendMessage() {
        const text = messageInput.value.trim();
        if (text === '' || !currentChannelId) {
            return;
        }

        const newMessage = {
            id: 'msg' + Date.now(), // Simple unique ID
            sender: currentUser,
            text: text,
            timestamp: new Date()
        };

        if (!messages[currentChannelId]) {
            messages[currentChannelId] = [];
        }
        messages[currentChannelId].push(newMessage);
        renderMessages(currentChannelId); // Re-render messages for the current channel
        messageInput.value = ''; // Clear input
        messageInput.focus();

        // Simulate a reply for demo purposes
        simulateReply(currentChannelId);
    }

    function simulateReply(channelId) {
        setTimeout(() => {
            const replies = ["Got it!", "Thanks for the update.", "Interesting point.", "Okay.", "Let me check on that."];
            const randomSender = ["Alice", "Bob", "Charlie", "Dana"].filter(name => name !== currentUser)[Math.floor(Math.random() * 3)];
            const replyText = replies[Math.floor(Math.random() * replies.length)];

            const replyMessage = {
                id: 'reply' + Date.now(),
                sender: randomSender,
                text: replyText,
                timestamp: new Date()
            };
            messages[channelId].push(replyMessage);
            if (channelId === currentChannelId) { // Only render if still in the same channel
                renderMessages(channelId);
            }
        }, 1000 + Math.random() * 1500); // Random delay for reply
    }


    function scrollToBottom() {
        messageListDiv.scrollTop = messageListDiv.scrollHeight;
    }

    // Event Listeners
    sendMessageBtn.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Initial Setup
    renderChannels();
    if (channels.length > 0 && !currentChannelId) {
        // Optionally select the first channel by default
        // selectChannel(channels[0].id);
    } else if (!currentChannelId) {
        if (noChannelSelectedDiv) noChannelSelectedDiv.style.display = 'flex';
    }
});