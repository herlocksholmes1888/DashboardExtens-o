const taskList = document.getElementById("taskList");
const noTasksMessage = document.getElementById("noTasksMessage");
const taskModal = document.getElementById("taskModal");
const addTaskBtn = document.getElementById("addTaskBtn");
let tasks = [];

addTaskBtn.onclick = () => {
  abrirModal();
};

function abrirModal() {
  taskModal.style.display = "flex";
  document.getElementById("taskName").value = "";
  document.getElementById("taskPriority").value = "3";
  document.getElementById("taskDone").checked = false;
}

function fecharModal() {
  taskModal.style.display = "none";
}

function salvarTarefa() {
  const name = document.getElementById("taskName").value;
  const priority = +document.getElementById("taskPriority").value;
  const done = document.getElementById("taskDone").checked;

  if (!name.trim()) {
    alert("Nome da tarefa é obrigatório.");
    return;
  }

  tasks.push({ name, priority, done });
  renderizarTarefas();
  fecharModal();
}

function renderizarTarefas() {
  taskList.innerHTML = "";
  if (tasks.length === 0) {
    noTasksMessage.style.display = "flex";
    taskList.style.display = "none";
    return;
  }

  noTasksMessage.style.display = "none";
  taskList.style.display = "block";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="tasksIconName">
          <span class="tasksIcon ${
            task.done ? "done" : "notDone"
          }" onclick="alternarTarefa(${index})">
            ${
              task.done
                ? '<span class="material-symbols-outlined">check</span>'
                : ""
            }
          </span>
          <span class="taskName ${task.done ? "tasksLine" : ""}">${
      task.name
    }</span>
        </span>
        <span class="tasksStar" style="color: gold;">
          ${"★".repeat(task.priority)}${"☆".repeat(5 - task.priority)}
        </span>
        <span onclick="excluirTarefa(${index})" style="cursor:pointer; color:#e91e63; margin-left:10px;">
          <span class="material-symbols-outlined">delete</span>
        </span>
      `;
    taskList.appendChild(li);
  });
}

function alternarTarefa(index) {
  tasks[index].done = !tasks[index].done;
  renderizarTarefas();
}

function excluirTarefa(index) {
  tasks.splice(index, 1);
  renderizarTarefas();
}

