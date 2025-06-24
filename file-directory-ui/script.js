document.addEventListener('DOMContentLoaded', () => {
    const directoryTreeContainer = document.getElementById('directoryTree');

    const fileSystemData = {
        name: "My Drive",
        type: "folder",
        id: "root",
        children: [
            {
                name: "Documents", type: "folder", id: "docs", children: [
                    { name: "Annual Report.docx", type: "file", id: "f1" },
                    { name: "Presentation Q1.pptx", type: "file", id: "f2" },
                    {
                        name: "Meeting Notes", type: "folder", id: "notes", children: [
                            { name: "2023-10-27.txt", type: "file", id: "f3" }
                        ]
                    }
                ]
            },
            {
                name: "Pictures", type: "folder", id: "pics", children: [
                    {
                        name: "Vacation 2023", type: "folder", id: "vac23", children: [
                            { name: "Beach Sunset.jpg", type: "file", id: "f4" },
                            { name: "Mountain Hike.png", type: "file", id: "f5" }
                        ]
                    },
                    { name: "Family Gathering.jpg", type: "file", id: "f6" }
                ]
            },
            { name: "Music", type: "folder", id: "music", children: [] }, // Empty folder
            {
                name: "Software", type: "folder", id: "software", children: [
                    { name: "Installer.exe", type: "file", id: "f7" },
                    { name: "License.txt", type: "file", id: "f8" }
                ]
            },
            { name: "README.md", type: "file", id: "f9" }
        ]
    };

    function createTreeElement(node, isRoot = false) {
        const listItem = document.createElement('li');
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('tree-item', node.type);
        itemDiv.dataset.nodeId = node.id || node.name; // Use ID or name as identifier

        const iconSpan = document.createElement('span');
        iconSpan.classList.add('icon');

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('name');
        nameSpan.textContent = node.name;

        itemDiv.appendChild(iconSpan);
        itemDiv.appendChild(nameSpan);
        listItem.appendChild(itemDiv);

        if (node.type === 'folder') {
            // Click on name or icon to toggle
            const toggleAction = (event) => {
                event.stopPropagation();
                toggleFolder(itemDiv);
            };
            nameSpan.addEventListener('click', toggleAction);
            iconSpan.addEventListener('click', toggleAction);

            if (node.children && node.children.length > 0) {
                const childrenUList = document.createElement('ul');
                node.children.forEach(childNode => {
                    childrenUList.appendChild(createTreeElement(childNode));
                });
                listItem.appendChild(childrenUList);

                // Optionally start with some folders open
                if (isRoot || node.id === 'docs') { // Example: Open root and Documents
                    itemDiv.classList.add('open');
                }
            } else {
                // For empty folders, make the icon non-interactive or visually different
                iconSpan.style.cursor = 'default';
                iconSpan.style.visibility = 'hidden'; // Hide arrow for empty folders
                nameSpan.style.fontWeight = 'normal'; // Less emphasis for empty folder name
                nameSpan.style.color = '#555';
            }
        } else { // It's a file
            itemDiv.addEventListener('click', () => {
                console.log(`File clicked: ${node.name} (id: ${node.id || 'N/A'})`);
                // Add action for file click, e.g., display file info
                // You could highlight the selected file here
                document.querySelectorAll('.tree-item.selected-file').forEach(el => el.classList.remove('selected-file'));
                itemDiv.classList.add('selected-file');
            });
        }
        return listItem;
    }

    function toggleFolder(itemDivElement) {
        // Only toggle if it's a folder with children (icon is visible)
        const icon = itemDivElement.querySelector('.icon');
        if (icon && window.getComputedStyle(icon).visibility !== 'hidden') {
            itemDivElement.classList.toggle('open');
        }
    }

    // --- Initial Render ---
    if (fileSystemData && Object.keys(fileSystemData).length > 0) {
        const rootUl = document.createElement('ul');
        const rootLi = createTreeElement(fileSystemData, true); // Pass true for isRoot
        rootUl.appendChild(rootLi);
        directoryTreeContainer.appendChild(rootUl);
    } else {
        directoryTreeContainer.innerHTML = '<p>No data to display.</p>';
    }
});