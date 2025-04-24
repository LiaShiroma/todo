import { saveTasksToLocalStorage } from "./taskStorage.js";

export function createTask(taskData, tasks) {
  tasks.push({
    ...taskData,
    id: Date.now(),
    status: false,
    date: new Date().toLocaleDateString(),
  });
}

export function updateTask(task, updatedData) {
  console.log({task, updatedData});
  
  task.task = updatedData.task;
  task.priority = updatedData.priority;
  task.status = false;
}

export function findTaskById(id, tasks) {
  return tasks.find((item) => parseInt(item.id) === parseInt(id));
}

export function deleteTaskById (task, tasks) {
  tasks = tasks.filter(
    (item) => parseInt(item.id) !== parseInt(task.getAttribute("data-id"))
  );
  saveTasksToLocalStorage(tasks);
}

export function toggleStatus(task, tasks) {
  const id = parseInt(task.getAttribute("data-id"));
  const item = findTaskById(id, tasks);
  if (item) {
    item.status = !item.status;
  }
  saveTasksToLocalStorage(tasks);
 
}
