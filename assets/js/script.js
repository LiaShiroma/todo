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


// REFATORADA
function renderTaskList(tasksList) {
  if (!tasksList.length) {
    $list.innerHTML = "<p>There is no tasks yet!</p>";
    return;
  }

  handleCreateHTMLList(tasksList, $list) 

}

// REFATORADA

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
  return tasks.find(item => parseInt(item.id) === parseInt(id))
}

function loadTasksFromLocalStorage() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  return storedTasks ? storedTasks : [];
}

function validateEmptyField(field) {
  if(!field.value) {
    field.classList.add("error")
    return false;
  } 

  field.classList.remove("error")
    return true;
}

function resetFormFields(values) {
  values.forEach(item => item.value = "")
}

// FALTA REFATORAR \/



$form.addEventListener("submit", function (e) {
  e.preventDefault();
  const action = $btnSave.getAttribute("data-action"); // Aqui acho que não fica meio claro o que é o btnSave e o que é o action também.

  // Aqui temos ifs aninhados, acredito que não é uma boa prática.
  if (action) {

    // O fluxo de 'criar' poderia ser mais legivel
    if (action === "create") {
      const id = Date.now();
      const status = false;

      // refatorado com a função validate
      if (!validateEmptyField($input)) {  
        return;  
      }

      $input.addEventListener("input", function () {
        validateEmptyField($input) 
      });

      hadleCreateTask($input.value, id, status, $priority.value);

    } 
    // Aqui poderia ser mais legivel e organizado também.
    else if (action === "edit") {

      const item = findTaskById(taskIdInput.value)
      if (item) {
        item.task = $input.value;
        item.priority = $priority.value;
        item.status = false;
      }

      saveTasksToLocalStorage();

      renderTaskList(tasks);

      $input.value = "";
      $priority.value = "";
      taskIdInput.value = "";
    }
  }

  handleCloseModal();
});



// Aqui, conforme vou incluindo novas informações a task, vão ficando muitos parametros passados para a função

function hadleCreateTask(task, id, status, priority) {

  // Aqui também, muita coisa sendo passada
  tasks.push({ task, id, status, date: new Date().toLocaleDateString(), priority });

  // Esse codigo também se repete
  saveTasksToLocalStorage();
  renderTaskList(tasks);
}


// Essa função eu acho que está ok, porque está simples e faz apenas 1 tarefa.
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Aqui acho que da pra entender, mas na parte do edit na minha opção já começa a ficar mais bagunçado
$list.addEventListener("click", (e) => {
  if (e.target.closest(".btn-delete")) {
    handleDeleteTask(e.target.closest("li"));
  }

  if (e.target.closest(".btn-edit")) {
    const taskElement = e.target.closest("li");
    handleEditTask(taskElement);
    taskIdInput.value = taskElement.getAttribute("data-id");
  }

  if (e.target.matches("li")) {
    toggleStatus(e.target);
  }
});


// Essa função eu acho que ta meio desorganizada e tem a parte de encontrar a task que se repete la em cima onde eu comentei
function handleEditTask(task) {
  handleOpenModal();

  $modalTitle.innerHTML = "Edit task";
  $btnSave.setAttribute("data-action", "edit");
  const id = task.getAttribute("data-id");

  const item = findTaskById(id);
  if (!item) return;

  $input.value = item.task;
  $priority.value = item.priority;

  if (task.classList.contains("finished")) {
    task.classList.remove("finished");
  }
}

//Aqui eu acho que ta ok
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

  // Essa parte me incomoda um pouco, me parece algo extenso pra uma abordagem "simples", mas não sei como refatorar

  const hasFilter = [...btnFilter].some((item) =>
    item.classList.contains("active")
  );
  if (hasFilter) {
    const activeButton = [...btnFilter].find((item) =>
      item.classList.contains("active")
    );
    handleFilterTasks(activeButton);
  } else {
    renderTaskList(tasks);
  }
}

//Aqui acho que está meio solto o código.

btnFilter.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    btnFilter.forEach((button) => button.classList.remove("active"));

    e.target.classList.add("active");

    handleFilterTasks(e.target);
  });
});

//Aqui eu acho que ta ok, mas ainda da pra melhorar
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

function handleOpenModal() {
  $modal.classList.add("show");
}

function handleCloseModal() {
  $modal.classList.remove("show");
}

//Esse aqui eu acho muito poluido - refatorado o resetFormFields
$btnModal.addEventListener("click", function () {
  handleOpenModal(); 
  $modalTitle.innerHTML = "Create task";  
  $btnSave.setAttribute("data-action", "create"); 

  resetFormFields([$input, $priority, taskIdInput])
});


window.onclick = function (event) {
  if (event.target === $modal) {
    handleCloseModal();
  }
};
