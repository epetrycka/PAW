const appContainer = document.getElementById('app-container');
const addItemBtn = document.getElementById('add-item-btn');
const cancelBtn = document.getElementById('cancel-btn');
const editContainer = document.getElementById('edit-container');

const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const priorityCheck = document.getElementById('priority-check');
const itemList = document.getElementById('item-list');

function showEditMode() {
    editContainer.classList.remove('hidden');
    addItemBtn.classList.add('hidden');
    cancelBtn.classList.remove('hidden');
}

function hideEditMode() {
    editContainer.classList.add('hidden');
    addItemBtn.classList.remove('hidden');
    cancelBtn.classList.add('hidden');
    
    itemInput.value = '';
    priorityCheck.checked = false;
}

function addItem(event) {
    event.preventDefault(); 

    const itemText = itemInput.value.trim();

    if (itemText === '') {
        return;
    }

    const isHighPriority = priorityCheck.checked;

    const li = document.createElement('li');
    li.textContent = itemText;

    if (isHighPriority) {
        li.classList.add('high-priority');
    }

    itemList.prepend(li);

    hideEditMode();
}

function toggleItemState(event) {
    if (event.target.tagName === 'LI') {
        console.log(event.target.classList);
        event.target.classList.toggle('completed');
        console.log(event.target.classList);
    }
}

addItemBtn.addEventListener('click', showEditMode);

cancelBtn.addEventListener('click', hideEditMode);

itemForm.addEventListener('submit', addItem);

itemList.addEventListener('click', toggleItemState);