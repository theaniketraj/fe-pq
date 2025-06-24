document.addEventListener('DOMContentLoaded', () => {
    const directoryTreeContainer = document.getElementById('directoryTree');

    const fileSystemData = {
        name: "My Drive",
        type: "folder",
        id: "root", // Add unique IDs for easier management if needed
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

    function createTreeElement(node) {
        const listItem = document.createElement('li');
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('tree-item', node.type); // Add 'folder' or 'file' class

        const iconSpan = document.createElement('span');
        iconSpan.classList.add('icon');
        // Icon content is handled by CSS ::before pseudo-elements

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('name');
        nameSpan.textContent = node.name;

        itemDiv.appendChild(iconSpan);
        itemDiv.appendChild(nameSpan);
        listItem.appendChild(itemDiv);

        if (node.type === 'folder') {
            // Make folder name clickable to toggle
            nameSpan.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent li click if name is clicked
                toggleFolder(itemDiv, listItem);
            });
            // Also allow clicking the icon area to toggle
            iconSpan.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleFolder(itemDiv, listItem);
            });


            if (node.children && node.children.length > 0) {
                const childrenUList = document.createElement('ul');
                node.children.forEach(childNode => {
                    childrenUList.appendChild(createTreeElement(childNode));
                });
                listItem.appendChild(childrenUList);
                // Optionally start with some folders open
                // if (node.id === 'root' || node.id === 'docs') { // Example: Open root and Documents
                //    itemDiv.classList.add('open');
                // }
            } else {
                // Style empty folders slightly differently if needed (e.g., no toggle arrow)
                iconSpan.style.visibility = 'hidden'; // Hide arrow for empty folders
            }
        } else { // It's a file
            itemDiv.addEventListener('click', () => {
                console.log(`File clicked: ${node.name} (id: ${node.id})`);
                // Add action for file click, e.g., display file info
            });
        }

        return listItem;
    }

    function toggleFolder(itemDiv, listItemElement) {
        itemDiv.classList.toggle('open');
        // The actual hiding/showing of the child UL is handled by CSS:
        // .tree-item.folder:not(.open) > ul { display: none; }
    }

    // --- Initial Render ---
    if (fileSystemData) {
        const rootUl = document.createElement('ul');
        // We treat the root object itself as the first item in the tree
        const rootLi = createTreeElement(fileSystemData);
        // By default, open the root folder if it's the main container
        const rootItemDiv = rootLi.querySelector('.tree-item.folder');
        if (rootItemDiv) {
            rootItemDiv.classList.add('open');
        }
        rootUl.appendChild(rootLi);
        directoryTreeContainer.appendChild(rootUl);
    } else {
        directoryTreeContainer.innerHTML = '<p>No data to display.</p>';
    }
});