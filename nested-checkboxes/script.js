document.addEventListener('DOMContentLoaded', () => {
    const allCheckboxes = document.querySelectorAll('.checkbox-tree input[type="checkbox"]');

    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });

    function handleCheckboxChange(event) {
        const currentCheckbox = event.target;
        const isChecked = currentCheckbox.checked;

        // 1. Propagate change downwards (Parent to Children)
        const children = getDirectChildren(currentCheckbox);
        children.forEach(child => {
            child.checked = isChecked;
            child.indeterminate = false; // Children can't be indeterminate if parent forces state
            // Recursively update grandchildren if this child is also a parent
            if (child.classList.contains('parent-checkbox')) {
                propagateToChildren(child, isChecked);
            }
        });

        // 2. Propagate change upwards (Children to Parent)
        updateParentState(currentCheckbox);
    }

    function getDirectChildren(parentCheckbox) {
        const parentId = parentCheckbox.id;
        if (!parentId) return []; // Not a parent if it has no ID to be referenced

        // Find li > ul > li > input where input's data-parent-id matches parentId
        const parentLi = parentCheckbox.closest('li');
        if (!parentLi) return [];

        const childUl = parentLi.querySelector('ul'); // Direct child ul
        if (!childUl) return [];

        // Get direct children checkboxes from this UL
        return Array.from(childUl.querySelectorAll(`:scope > li > label > input[type="checkbox"][data-parent-id="${parentId}"]`));
    }

    function propagateToChildren(parentCheckbox, isChecked) {
        const children = getDirectChildren(parentCheckbox);
        children.forEach(child => {
            child.checked = isChecked;
            child.indeterminate = false;
            if (child.classList.contains('parent-checkbox')) {
                propagateToChildren(child, isChecked);
            }
        });
    }


    function updateParentState(checkbox) {
        const parentId = checkbox.dataset.parentId;
        if (!parentId) return; // No parent to update

        const parentCheckbox = document.getElementById(parentId);
        if (!parentCheckbox) return;

        const siblings = getDirectChildren(parentCheckbox); // These are the children of the parent
        if (siblings.length === 0) { // Should not happen if data-parent-id is set correctly
            parentCheckbox.indeterminate = false;
            parentCheckbox.checked = checkbox.checked; // If only one child, parent matches it
            updateParentState(parentCheckbox); // Recursively update grandparent
            return;
        }

        const allChecked = siblings.every(sib => sib.checked && !sib.indeterminate);
        const someChecked = siblings.some(sib => sib.checked || sib.indeterminate);

        if (allChecked) {
            parentCheckbox.checked = true;
            parentCheckbox.indeterminate = false;
        } else if (someChecked) {
            parentCheckbox.checked = false; // Indeterminate implies not fully checked
            parentCheckbox.indeterminate = true;
        } else { // None checked
            parentCheckbox.checked = false;
            parentCheckbox.indeterminate = false;
        }

        // Recursively update grandparent
        updateParentState(parentCheckbox);
    }

    // Initial state setup (important if some checkboxes are pre-checked in HTML)
    function initializeCheckboxStates() {
        // Iterate from bottom-up or trigger change on all leaves first
        // For simplicity, we can iterate all parents and update them based on their children
        const parentCheckboxes = document.querySelectorAll('.checkbox-tree .parent-checkbox');
        // Iterate in reverse to update children before parents in the initial pass
        Array.from(parentCheckboxes).reverse().forEach(parent => {
            // Temporarily remove its own change listener to avoid loops during init
            parent.removeEventListener('change', handleCheckboxChange);

            const children = getDirectChildren(parent);
            if (children.length > 0) {
                const allChecked = children.every(child => child.checked && !child.indeterminate);
                const someChecked = children.some(child => child.checked || child.indeterminate);

                if (allChecked) {
                    parent.checked = true;
                    parent.indeterminate = false;
                } else if (someChecked) {
                    parent.checked = false;
                    parent.indeterminate = true;
                } else {
                    parent.checked = false;
                    parent.indeterminate = false;
                }
            }
            // Re-add listener
            parent.addEventListener('change', handleCheckboxChange);
        });
    }

    initializeCheckboxStates();
});