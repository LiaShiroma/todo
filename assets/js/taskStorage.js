export function loadTasksFromLocalStorage() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  return storedTasks ? storedTasks : [];
}

export function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
