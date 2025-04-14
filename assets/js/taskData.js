import { saveTasksToLocalStorage } from "./taskStorage.js";

export function createTask(taskData, tasks) {
  tasks.push({
    ...taskData,
    id: Date.now(),
    status: false,
    date: new Date().toLocaleDateString(),
  });
}

export function updateTask(task, $input, $priority) {
  task.task = $input.value;
  task.priority = $priority.value;
  task.status = false;
}

export function findTaskById(id, tasks) {
  return tasks.find((item) => parseInt(item.id) === parseInt(id));
}

export function handleDeleteTask(task, tasks) {
  task.remove();
  tasks = tasks.filter(
    (item) => parseInt(item.id) !== parseInt(task.getAttribute("data-id"))
  );
  saveTasksToLocalStorage(tasks);
}

export function toggleStatus(task, tasks) {
  const id = task.getAttribute("data-id");
  const item = findTaskById(id, tasks);
  if (item) {
    item.status = !item.status;
  }
  saveTasksToLocalStorage(tasks);
 
}
