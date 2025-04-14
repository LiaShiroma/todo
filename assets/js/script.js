const $form = document.getElementById("tasks-form");
const $list = document.getElementById("tasks-list");
const $modal = document.getElementById("modal-create");
const $btnModal = document.getElementById("btn-open-modal");
const $handleCloseModal = document.getElementById("close");
const $modalTitle = document.querySelector(".modal-title");
const btnFilter = document.querySelectorAll(".filters button");
const $input = document.getElementById("task");
const $priority = document.getElementById("priority");
const $btnSave = document.getElementById("btn-save");
const taskIdInput = document.querySelector("input[name='task-id']");
import {
  loadTasksFromLocalStorage,
  saveTasksToLocalStorage,
} from "./taskStorage.js";
import { createTask, updateTask, findTaskById, toggleStatus, handleDeleteTask } from "./taskData.js";
import {
  renderTaskList,
  handleFilterTasks,
  validateEmptyField,
  handleOpenModal,
  handleCloseModal,
  initializeTaskModal,
  openEditModal,
  getActiveFilterButton,
  resetFormFields
} from "./taskView.js";

let tasks = loadTasksFromLocalStorage();
renderTaskList(tasks, $list);

$form.addEventListener("submit", function (e) {
  e.preventDefault();
  const action = $btnSave.getAttribute("data-action");
  if (!action) {
    return;
  }
  if (action === "create") {
    if (!validateEmptyField($input)) {
      return;
    }
    createTask({ task: $input.value, priority: $priority.value }, tasks);
  } else if (action === "edit") {
    const item = findTaskById(taskIdInput.value, tasks);
    if (item) {
      updateTask(item, $input, $priority);
    }
  }
  resetFormFields([$input, $priority, taskIdInput]);
  saveTasksToLocalStorage(tasks);
  renderTaskList(tasks, $list);
  handleCloseModal($modal);
});

$list.addEventListener("click", (e) => {
  const taskElement = e.target.closest("li");
  if (e.target.closest(".btn-delete")) {
    handleDeleteTask(taskElement, tasks);
  }
  if (e.target.closest(".btn-edit")) {
    openEditModal(taskElement, $modal, taskIdInput, tasks, $btnSave, $input, $priority, $modalTitle)
  }
  if (e.target.matches("li")) {
    toggleStatus(e.target, tasks);
    const activeFilter = getActiveFilterButton(btnFilter);
    activeFilter ? handleFilterTasks(activeFilter, tasks, $list) : renderTaskList(tasks, $list);
  }
});

btnFilter.forEach((btn) => {
  btn.addEventListener("click", function () {
    btnFilter.forEach((button) => button.classList.remove("active"));
    this.classList.add("active");
    handleFilterTasks(this, tasks, $list);
  });
});


$btnModal.addEventListener("click", function () {
  handleOpenModal($modal);
  initializeTaskModal("create", null, $btnSave, $input, $priority, taskIdInput, $modalTitle);
  
  
});

window.onclick = function (event) {
  if (event.target === $modal) {
    handleCloseModal($modal);
  }
};
