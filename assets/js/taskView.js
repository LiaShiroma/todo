import { findTaskById } from "./taskData.js";

export function buildTask(task) {
  const li = document.createElement("li");
  li.classList.add(task.status ? "finished" : "unfinished");
  li.setAttribute("data-id", `${task.id}`);
  li.innerHTML = `
 <p>${task.task}</p>
		  <span class="date">• ${task.date}</span>
		  <span class="priority-${task.priority}"> • ${task.priority}</span>
		  <button class="btn-edit">
			<i class="fa-solid fa-pen"></i>
		  </button>
		  <button class="btn-delete">
			<i class="fa-solid fa-trash"></i>
		  </button> 
  `;

  return li;
}

export function renderTaskList(tasks, $list) {
  if (!tasks.length) {
    $list.innerHTML = "<p>There is no tasks yet!</p>";
    return;
  }

  $list.innerHTML = "";
  tasks.forEach((task) => {
    const taskElement = buildTask(task);
    $list.insertBefore(taskElement, $list.firstChild);
  });
}

export function getActiveFilterButton(btnFilter) {
  return (
    [...btnFilter].find((item) => item.classList.contains("active")) || null
  );
}

export function handleFilterTasks(button, tasks, $list) {
  const status = button.getAttribute("data-filter");
  const filteredList = filterTasksByStatus(tasks, status);
  renderTaskList(filteredList, $list);
}

export function filterTasksByStatus(tasks, status) {
  if (status === "all") return tasks;

  return tasks.filter((task) => {
    return status === "completed" ? task.status : !task.status;
  });
}

export function setModalTitle(title, $modalTitle) {
  $modalTitle.innerHTML = title;
}

export function resetFormFields(values) {
  values.forEach((item) => (item.value = ""));
}

export function validateEmptyField(field) {
  if (!field.value) {
    field.classList.add("error");
    return false;
  }
  field.classList.remove("error");
  return true;
}

export function handleOpenModal($modal) {
  $modal.classList.add("show");
}

export function handleCloseModal($modal) {
  $modal.classList.remove("show");
}

export function removeTaskFromDOM(task) {
  task.remove();
}

export function setupModal(
  mode,
  task = null,
  taskIdInput = null,
  tasks,
  $btnModal,
  modalFields,
  $modal,
  $modalTitle
) {
  const title = mode === "edit" ? "Edit task" : "Create task";

  setModalTitle(title, $modalTitle);

  $btnModal.setAttribute("data-action", mode);

  if (mode === "create") {
    resetFormFields([modalFields.$input, modalFields.$priority]);
  }
  if (mode === "edit") {
    populateModalFields(task, tasks, taskIdInput, modalFields);
  }

  handleOpenModal($modal);
}

function populateModalFields(task, tasks, taskIdInput, modalFields) {
  const id = parseInt(task.getAttribute("data-id"));

  const item = findTaskById(id, tasks);
  if (!item) return;

  taskIdInput.value = id;

  modalFields.$input.value = item.task;
  modalFields.$priority.value = item.priority;
}
