const $form = document.getElementById("tasks-form");
const $list = document.getElementById("tasks-list");
const $modal = document.getElementById("modal-create");
const $btnOpenModal = document.getElementById("btn-open-modal");
const $handleCloseModal = document.getElementById("close");
const $modalTitle = document.querySelector(".modal-title");
const btnFilter = document.querySelectorAll(".filters button");
const $btnModal = document.getElementById("btn-save");
const taskIdInput = document.querySelector("input[name='task-id']");
const modalFields = {
  $input: document.getElementById("task"),
  $priority: document.getElementById("priority")
}


import {
  loadTasksFromLocalStorage,
  saveTasksToLocalStorage,
} from "./taskStorage.js";
import { createTask, updateTask, findTaskById, toggleStatus, deleteTaskById  } from "./taskData.js";
import {
  renderTaskList,
  handleFilterTasks,
  validateEmptyField,
  handleCloseModal,
  getActiveFilterButton,
  resetFormFields,
  removeTaskFromDOM,
  setupModal
} from "./taskView.js";

let tasks = loadTasksFromLocalStorage();
renderTaskList(tasks, $list);

$form.addEventListener("submit", function (e) {
  e.preventDefault();
  const action = $btnModal.getAttribute("data-action");
  if (!action) {
    return;
  }

  let isValid = true;

  if (action === "create") {
    if (!validateEmptyField(modalFields.$input)) {
      isValid = false;;
    }
    if (!validateEmptyField(modalFields.$priority)) {
      isValid = false;;
    }

    if (!isValid) {
      return;
    }

    createTask({task: modalFields.$input.value, priority: modalFields.$priority.value}, tasks);
  } else if (action === "edit") {
    const item = findTaskById(taskIdInput.value, tasks);
    
    if (item) {
      updateTask(item, {task: modalFields.$input.value, priority: modalFields.$priority.value});
    }
  }
  resetFormFields([modalFields.$input, modalFields.$priority, taskIdInput]);
  saveTasksToLocalStorage(tasks);
  renderTaskList(tasks, $list);
  handleCloseModal($modal);
});

[modalFields.$input, modalFields.$priority].forEach(field => {
  field.addEventListener("input", function() {
    if (field.value !== "") {
      field.classList.remove("error");
    }
  });
});


$list.addEventListener("click", (e) => {
  const taskElement = e.target.closest("li");
  if (e.target.closest(".btn-delete")) {
    deleteTaskById (taskElement, tasks);
    removeTaskFromDOM(taskElement);
  }
  if (e.target.closest(".btn-edit")) {
    setupModal("edit", taskElement, taskIdInput, tasks, $btnModal, modalFields, $modal, $modalTitle)
  }
  if (e.target.matches("li")) {
    toggleStatus(e.target, tasks);
    const activeFilter = getActiveFilterButton(btnFilter);
    handleFilterTasks(activeFilter, tasks, $list)
  }
});

btnFilter.forEach((btn) => {
  btn.addEventListener("click", function () {
    btnFilter.forEach((button) => button.classList.remove("active"));
    this.classList.add("active");
    handleFilterTasks(this, tasks, $list);
  });
});


$btnOpenModal.addEventListener("click", function () {
  setupModal("create", null, null, tasks, $btnModal, modalFields, $modal, $modalTitle)
  
});

window.onclick = function (event) {
  if (event.target === $modal) {
    handleCloseModal($modal);
  }
};
