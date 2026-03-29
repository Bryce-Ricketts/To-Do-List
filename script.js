let todos = [];

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const todoCount = document.querySelector("#todo-count");
const errorMessage = document.querySelector("#error-message");

document.addEventListener('DOMContentLoaded', function() {
    loadTodosFromStorage();
    renderTodos();

    todoForm.addEventListener('submit', handleFormSubmit);
    todoList.addEventListener('click', handleTodoListClick);
    todoList.addEventListener('change', handleTodoToggle);
});

function handleFormSubmit(event) {
    event.preventDefault();

    const rawTodoText = todoInput.value;
    const todoText = rawTodoText.trim();

    if (!todoText) {
        showErrorMessage('To-do list is empty.  Please enter a to-do item.');
        return;
    }

    const minimumLength = 3;
    if (todoText.length < minimumLength) {
        showErrorMessage('Your to-do item is too short.  Please enter a to-do item longer than 3 characters.');
        return;
    }
    
    hideErrorMessage();

    addTodo(todoText);

    todoInput.value = '';
}

function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    setTimeout(() => {
        hideErrorMessage();
    }, 3000);
}

function hideErrorMessage(message) {
    errorMessage.classList.remove('show');
}

function addTodo(text) {
    const newTodo = {
        id: Date.now().toString(),
        text: text,
        completed: false,
        createdAt: Date.now(),
    }

    todos.push(newTodo);
    updateUI();
}

function updateUI() {
    saveTodosToStorage();
    renderTodos();
}

function handleTodoListClick(event) {
    const todoItem = event.target.closest('.todo-item');
    if (!todoItem) return;

    const todoId = todoItem.dataset.id;

    if (event.target.classList.contains('delete-btn')) {
        deleteTodo(todoId);
        return;
    }
}
function handleTodoToggle(event) {
    if (event.target.type === 'checkbox') {
        const todoItem = event.target.closest('.todo-item');
        const todoId = todoItem.dataset.id;
        toggleTodo(todoId);
    }
}

function toggleTodo(id) {
    todos = todos.map(todo => {
        const isTargetTodo = todo.id === id;

        if (isTargetTodo) {
            const updateTodo = { ...todo, completed: !todo.completed };
            return updateTodo;
        }

        return todo;
    });
    updateUI();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id != id);
    updateUI();
}

function renderTodos() {
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty-state">No to-dos yet.  Add a to-do above!</li>';
        return;
    }

    todos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });
}

function createTodoElement(todo) {
    const li = document.createElement('li');

    const completedClass = todo.completed ? " completed" : "";
    li.className = `todo-item${completedClass}`;

    li.setAttribute("data-id", todo.id);

    const checkboxChecked = todo.completed ? "checked" : "";
    const checkboxAction = todo.completed ? "incomplete" : "complete";

    li.innerHTML = `
        <input type="checkbox"
        class="todo-checkbox"
               ${checkboxChecked}
               aria-label="Mark ${todo.text} as ${checkboxAction}">
        <span class="todo-text"></span>
        <div class="todo-actions">
            <button class="delete-btn" aria-label="Delete "${todo.text}"">Delete</button>
        </div>
    `;

    const textSpan = li.querySelector(".todo-text");
    textSpan.textContent = todo.text;

    return li;
}

function saveTodosToStorage () {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodosFromStorage() {
    const storedTodos = localStorage.getItem('todos');

    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
}
