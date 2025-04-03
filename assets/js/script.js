const $form = document.getElementById("tasks-form");
const $list = document.getElementById("tasks-list");
const $modal = document.getElementById("modal-create");
const $btnModal = document.getElementById("btn-open-modal");
const $handleCloseModal = document.getElementById("close");
const btnFilter = document.querySelectorAll(".filters button");
const $modalTitle = document.querySelector(".modal-title");
const $input = document.getElementById("task");
const $priority = document.getElementById("priority");
const $btnSave = document.getElementById("btn-save");
const taskIdInput = document.querySelector("input[name='task-id']");

let tasks = loadTasksFromLocalStorage();
renderTaskList(tasks);

function loadTasksFromLocalStorage() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  return storedTasks ? storedTasks : [];
}

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTaskList(tasksList) {
  if (!tasksList.length) {
    $list.innerHTML = "<p>There is no tasks yet!</p>";
    return;
  }
  handleCreateHTMLList(tasksList, $list);
}

function handleCreateHTMLList(tasksList, element) {
  element.innerHTML = "";
  tasksList.forEach((item) => {
    element.insertAdjacentHTML(
      "afterbegin",
      `<li data-id="${item.id}" class="${
        item.status ? "finished" : "unfinished"
      }">
          <p>${item.task}</p>
          <span class="date">• ${item.date}</span>
          <span class="priority-${item.priority}"> • ${item.priority}</span>
          <button class="btn-edit">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-delete">
            <i class="fa-solid fa-trash"></i>
          </button>
      </li>`
    );
  });
}

function findTaskById(id) {
  return tasks.find((item) => parseInt(item.id) === parseInt(id));
}

function createTask(taskData) {
  tasks.push({
    ...taskData,
    id: Date.now(),
    status: false,
    date: new Date().toLocaleDateString(),
  });
}

function updateTask(task) {
  task.task = $input.value;
  task.priority = $priority.value;
  task.status = false;
}

function handleDeleteTask(task) {
  task.remove();
  tasks = tasks.filter(
    (item) => parseInt(item.id) !== parseInt(task.getAttribute("data-id"))
  );
  saveTasksToLocalStorage();
}

function toggleStatus(task) {
  const id = task.getAttribute("data-id");
  const item = findTaskById(id);
  if (item) {
    item.status = !item.status;
  }
  saveTasksToLocalStorage();
  const activeFilter = getActiveFilterButton();
  activeFilter ? handleFilterTasks(activeFilter) : renderTaskList(tasks);
}

function getActiveFilterButton() {
  return [...btnFilter].find((item) => item.classList.contains("active")) || null;
}

function handleFilterTasks(button) {
  const status = button.getAttribute("data-filter");
  const validStatuses = ["all", "pending", "completed"];
  if (!validStatuses.includes(status) || status === "all") {
    return renderTaskList(tasks);
  }
  const filteredList = tasks.filter((task) => {
    return status === "completed" ? task.status : !task.status;
  });
  renderTaskList(filteredList);
}

function setModalTitle(title) {
  $modalTitle.innerHTML = title;
}

function resetFormFields(values) {
  values.forEach((item) => (item.value = ""));
}

function validateEmptyField(field) {
  if (!field.value) {
    field.classList.add("error");
    return false;
  }
  field.classList.remove("error");
  return true;
}

function handleOpenModal() {
  $modal.classList.add("show");
}

function handleCloseModal() {
  $modal.classList.remove("show");
}

function openEditModal(task) {
  handleOpenModal();
  const id = task.getAttribute("data-id");
  taskIdInput.value = id;
  const item = findTaskById(parseInt(id));
  if (!item) return;
  initializeTaskModal("edit", item);
}

function initializeTaskModal(mode, task = null) {
  setModalTitle(mode === "edit" ? "Edit task" : "Create task");
  $btnSave.setAttribute("data-action", mode);
  if (mode === "edit" && task) {
    $input.value = task.task;
    $priority.value = task.priority;
    taskIdInput.value = task.id;
  } else {
    resetFormFields([$input, $priority, taskIdInput]);
  }
}

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
    createTask({ task: $input.value, priority: $priority.value });
  } else if (action === "edit") {
    const item = findTaskById(taskIdInput.value);
    if (item) {
      updateTask(item);
    }
  }
  resetFormFields([$input, $priority, taskIdInput]);
  saveTasksToLocalStorage();
  renderTaskList(tasks);
  handleCloseModal();
});

$list.addEventListener("click", (e) => {
  const taskElement = e.target.closest("li");
  if (e.target.closest(".btn-delete")) {
    handleDeleteTask(taskElement);
  }
  if (e.target.closest(".btn-edit")) {
    openEditModal(taskElement);
  }
  if (e.target.matches("li")) {
    toggleStatus(e.target);
  }
});

btnFilter.forEach((btn) => {
  btn.addEventListener("click", function () {
    btnFilter.forEach((button) => button.classList.remove("active"));
    this.classList.add("active");
    handleFilterTasks(this);
  });
});

$btnModal.addEventListener("click", function () {
  handleOpenModal();
  initializeTaskModal("create");
});

window.onclick = function (event) {
  if (event.target === $modal) {
    handleCloseModal();
  }
};
