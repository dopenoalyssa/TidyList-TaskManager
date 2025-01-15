"use strict";
// Task class (Module 6 assignment requirement)
class Task {
    constructor(id, title, description, completed = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
    }
}
// TaskManager class
class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.loadFromLocalStorage();
    }
    // Adding a Task (Required methods from Module 6 assignment)
    addTask(task) {
        this.tasks.push(task);
        this.saveToLocalStorage();
    }
    // Getting a Task (Required methods from Module 6 assignment)
    getTaskById(id) {
        return this.tasks.find((t) => t.id === id);
    }
    // Marking a Task as Complete (Required methods from Module 6 assignment)
    markTaskComplete(id) {
        const task = this.getTaskById(id);
        if (task) {
            task.completed = !task.completed;
            this.saveToLocalStorage();
        }
    }
    // Listing all Tasks (Required methods from Module 6 assignment)
    listAllTasks() {
        console.log("All Tasks:", this.tasks);
    }
    // Loading and Saving in the browser's local storage
    loadFromLocalStorage() {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);
            this.tasks = parsedTasks.map((task) => new Task(task.id, task.title, task.description, task.completed));
            this.taskIdCounter = Math.max(...this.tasks.map((t) => t.id), 0) + 1;
        }
    }
    saveToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }
    // Return, Create, Edit & Delete Tasks
    getTasks() {
        return [...this.tasks];
    }
    createTask(title, description) {
        const task = new Task(this.taskIdCounter++, title, description);
        this.addTask(task);
    }
    editTask(id, newTitle, newDescription) {
        const task = this.getTaskById(id);
        if (task) {
            task.title = newTitle.trim();
            task.description = newDescription.trim();
            this.saveToLocalStorage();
        }
    }
    deleteTask(id) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
        this.saveToLocalStorage();
    }
    deleteAllTasks() {
        this.tasks = [];
        this.taskIdCounter = 1;
        localStorage.removeItem("tasks");
    }
}
// DOM Elements
const todoInput = document.getElementById("todoInput");
const descriptionInput = document.getElementById("descriptionInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const completedCount = document.getElementById("completedCount");
const incompleteCount = document.getElementById("incompleteCount");
const addButton = document.getElementById("addButton");
const deleteButton = document.getElementById("deleteButton");
// Instantiating TaskManager (Module 6 assignment requirement)
const taskManager = new TaskManager();
// Event Listeners
function initializeEventListeners() {
    if (addButton) {
        addButton.addEventListener("click", handleAddTask);
    }
    if (todoInput) {
        todoInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter")
                handleAddTask();
        });
    }
    if (deleteButton) {
        deleteButton.addEventListener("click", handleDeleteAllTasks);
    }
    renderTasks();
}
// Function that demonstrate adding a new task (Module 6 assignment requirement)
function handleAddTask() {
    const title = (todoInput === null || todoInput === void 0 ? void 0 : todoInput.value.trim()) || "";
    const description = (descriptionInput === null || descriptionInput === void 0 ? void 0 : descriptionInput.value.trim()) || "";
    if (title) {
        taskManager.createTask(title, description);
        if (todoInput)
            todoInput.value = "";
        if (descriptionInput)
            descriptionInput.value = "";
        renderTasks();
    }
}
// Function that renders the task list and updates counters
function renderTasks() {
    if (!todoList)
        return;
    todoList.innerHTML = "";
    const tasks = taskManager.getTasks();
    let completedTasks = 0;
    // List all tasks, list all tasks again and verify completion (Module 6 assignment requirement)
    tasks.forEach((task) => {
        if (task.completed)
            completedTasks++;
        const taskElement = document.createElement("div");
        taskElement.className = "task-item";
        taskElement.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="check-${task.id}" ${task.completed ? "checked" : ""}>
          <label class="form-check-label" for="check-${task.id}">
            <div class="task-title ${task.completed ? "completed" : ""}">${task.title}</div>
            <div class="task-description ${task.completed ? "completed" : ""}">${task.description}</div>
          </label>
        </div>
        <div class="btn-group">
          <button class="btn btn-outline-primary btn-edit">Edit</button>
          <button class="btn btn-outline-danger btn-delete">Delete</button>
        </div>
      </div>
      <div class="edit-form d-none mt-2">
        <div class="input-group">
          <input type="text" class="form-control edit-title" value="${task.title}">
          <input type="text" class="form-control edit-description" value="${task.description}">
          <button class="btn btn-success btn-save">Save</button>
        </div>
      </div>
    `;
        const checkbox = taskElement.querySelector(`#check-${task.id}`);
        const editButton = taskElement.querySelector(".btn-edit");
        const deleteButton = taskElement.querySelector(".btn-delete");
        const editForm = taskElement.querySelector(".edit-form");
        const saveButton = taskElement.querySelector(".btn-save");
        // Marking some tasks as complete (Module 6 assignment requirement)
        if (checkbox) {
            checkbox.addEventListener("change", () => {
                taskManager.markTaskComplete(task.id);
                renderTasks();
            });
        }
        if (editButton) {
            editButton.addEventListener("click", () => {
                editForm === null || editForm === void 0 ? void 0 : editForm.classList.toggle("d-none");
            });
        }
        if (saveButton) {
            saveButton.addEventListener("click", () => {
                const titleInput = editForm === null || editForm === void 0 ? void 0 : editForm.querySelector(".edit-title");
                const descInput = editForm === null || editForm === void 0 ? void 0 : editForm.querySelector(".edit-description");
                if (titleInput && descInput) {
                    taskManager.editTask(task.id, titleInput.value, descInput.value);
                    renderTasks();
                }
            });
        }
        if (deleteButton) {
            deleteButton.addEventListener("click", () => {
                taskManager.deleteTask(task.id);
                renderTasks();
            });
        }
        todoList.appendChild(taskElement);
    });
    if (todoCount)
        todoCount.textContent = `${tasks.length} total`;
    if (completedCount)
        completedCount.textContent = `${completedTasks} completed`;
    if (incompleteCount)
        incompleteCount.textContent = `${tasks.length - completedTasks} incomplete`;
}
// Function that handle deleting all tasks
function handleDeleteAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        taskManager.deleteAllTasks();
        renderTasks();
    }
}
// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializeEventListeners);
/*
// Direct demonstration of basic assignment requirements:
// Instantiate the TaskManager class
const taskManager = new TaskManager();

// Demonstrate the functionality by:
// 1. Adding tasks
taskManager.createTask("Task 1", "Description 1");
taskManager.createTask("Task 2", "Description 2");

// 2. Listing all tasks
taskManager.listAllTasks();

// 3. Marking a task as complete
taskManager.markTaskComplete(1);

// 4. Listing all tasks again to verify completion status
taskManager.listAllTasks();

Note: The above code is commented out as the functionality is already implemented
in the working web application through:
- Adding tasks: Using the input fields and "Add Task" button
- Listing tasks: Displayed in the todoList element
- Marking complete: Using the checkboxes
- Verifying status: Auto-updates in the UI and task counters
*/
