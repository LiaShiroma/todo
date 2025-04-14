import { findTaskById } from "./taskData.js";

export function handleCreateHTMLList(tasks, element) {
  element.innerHTML = "";
  tasks.forEach((item) => {
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

export function renderTaskList(tasks, $list) {
  if (!tasks.length) {
    $list.innerHTML = "<p>There is no tasks yet!</p>";
    return;
  }
  handleCreateHTMLList(tasks, $list);
}

export function getActiveFilterButton(btnFilter) {
  return (
    [...btnFilter].find((item) => item.classList.contains("active")) || null
  );
}

export function handleFilterTasks(button, tasks, $list) {
  const status = button.getAttribute("data-filter");
  const validStatuses = ["all", "pending", "completed"];
  if (!validStatuses.includes(status) || status === "all") {
    return renderTaskList(tasks, $list);
  }
  const filteredList = tasks.filter((task) => {
    return status === "completed" ? task.status : !task.status;
  });
  renderTaskList(filteredList, $list);
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

export function initializeTaskModal(
  mode,
  task = null,
  $btnSave,
  $input,
  $priority,
  taskIdInput,
  $modalTitle
) {
  setModalTitle(mode === "edit" ? "Edit task" : "Create task", $modalTitle);
  $btnSave.setAttribute("data-action", mode);
  if (mode === "edit" && task) {
    $input.value = task.task;
    $priority.value = task.priority;
    taskIdInput.value = task.id;
  } else {
    resetFormFields([$input, $priority, taskIdInput]);
  }
}

export function openEditModal(task, $modal, taskIdInput, tasks, $btnSave, $input, $priority, $modalTitle) {
  handleOpenModal($modal);
  const id = task.getAttribute("data-id");
  taskIdInput.value = id;
  const item = findTaskById(parseInt(id), tasks);
  if (!item) return;
  initializeTaskModal("edit", item, $btnSave, $input, $priority, taskIdInput, $modalTitle);
}
