//trayendo todo lo importante
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const todoForm = document.getElementById("todo-form");
const taskSection = document.getElementById("task-section");
const taskSummary = document.getElementById("task-summary");
const filterMenuItems = document.querySelectorAll(".dropdown-item");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

const actualizarTareasCompletadas = () => {
  const completedTasks = tasks.filter((task) => task.estado).length;
  taskSummary.textContent = `${completedTasks}/${tasks.length} tareas completadas`;
};

const guardarTareas = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//renderizar tareas
const renderTasks = () => {
  taskList.innerHTML = "";
  //filtrar tareas
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.estado;
    if (filter === "incompleted") return !task.estado;
    return true;
  });

  //mostrar o ocultar el mensaje cuando no hay tareas
  if (filteredTasks.length === 0) {
    taskSection.querySelector("h4").classList.remove("d-none");
  } else {
    taskSection.querySelector("h4").classList.add("d-none");
  }
  //filtrar tareas completadas, incompletas y todas
  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task ${task.estado ? "completed" : ""}`;
    li.innerHTML = `
                <input type="checkbox" ${
                  task.estado ? "checked" : ""
                } class="checkbox">
                <span>${task.tarea}</span>
                <button class="btn btn-danger"><i class="bx bx-trash"></i></button>
            `;
    //cambiar el estado de las tareas cuando selecciona el click        
    li.querySelector(".checkbox").addEventListener("change", (e) => {
      task.estado = e.target.checked;
      li.classList.toggle("completed");
      guardarTareas();
      actualizarTareasCompletadas();
    });

    li.querySelector(".btn-danger").addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      guardarTareas();
      renderTasks();
      actualizarTareasCompletadas();
    });

    taskList.appendChild(li);
  });

  actualizarTareasCompletadas();
};

//el menu para seleccionar el tipo de tareas que hay 
filterMenuItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    filter = e.target.dataset.filter;
    renderTasks();
  });
});

//agregar una nueva tarea
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText && taskText.length > 3) {
    const newTask = { tarea: taskText, estado: false, id: Date.now() };
    tasks.push(newTask);
    guardarTareas();
    renderTasks();
    taskInput.value = "";
  } else {
    alert("Ingrese una tarea válida");
  }
});

renderTasks();
