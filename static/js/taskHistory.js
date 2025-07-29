// Mock data for tasks
const mockTasks = [
  {
    id: 1,
    title: "Consulta com Dr. Silva",
    description: "Revisão mensal do tratamento",
    completed: true,
    date: "2025-01-10",
    priority: "high",
    category: "Consulta",
  },
  {
    id: 2,
    title: "Exame de sangue",
    description: "Coleta para análise completa",
    completed: false,
    date: "2025-01-10",
    priority: "medium",
    category: "Exame",
  },
  {
    id: 3,
    title: "Fisioterapia",
    description: "Sessão de reabilitação",
    completed: true,
    date: "2025-01-09",
    priority: "medium",
    category: "Terapia",
  },
  {
    id: 4,
    title: "Medicação matinal",
    description: "Tomar remédios prescritos",
    completed: true,
    date: "2025-01-09",
    priority: "high",
    category: "Medicação",
  },
  {
    id: 5,
    title: "Consulta nutricional",
    description: "Avaliação da dieta",
    completed: false,
    date: "2025-01-08",
    priority: "low",
    category: "Consulta",
  },
  {
    id: 6,
    title: "Exercícios respiratórios",
    description: "Sessão de 30 minutos",
    completed: true,
    date: "2025-01-08",
    priority: "medium",
    category: "Exercício",
  },
  {
    id: 7,
    title: "Retorno cardiologista",
    description: "Consulta de acompanhamento",
    completed: false,
    date: "2025-01-07",
    priority: "high",
    category: "Consulta",
  },
  {
    id: 8,
    title: "Exame de urina",
    description: "Análise laboratorial",
    completed: true,
    date: "2025-01-07",
    priority: "medium",
    category: "Exame",
  },
]

class TaskHistoryManager {
  constructor() {
    this.tasks = mockTasks
    this.filteredTasks = [...this.tasks]
    this.currentPeriod = "day"
    this.currentDate = new Date().toISOString().split("T")[0]
    this.currentStatus = "all"
    this.searchTerm = ""

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setCurrentDate()
    this.filterTasks()
    this.renderTasks()
    this.updateStats()
  }

  setupEventListeners() {
    // Period buttons
    document.querySelectorAll(".period-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".period-btn").forEach((b) => b.classList.remove("active"))
        e.target.classList.add("active")
        this.currentPeriod = e.target.dataset.period
        this.filterTasks()
        this.renderTasks()
        this.updateStats()
      })
    })

    // Date filter
    document.getElementById("dateFilter").addEventListener("change", (e) => {
      this.currentDate = e.target.value
      this.filterTasks()
      this.renderTasks()
      this.updateStats()
    })

    // Status filter
    document.getElementById("statusFilter").addEventListener("change", (e) => {
      this.currentStatus = e.target.value
      this.filterTasks()
      this.renderTasks()
      this.updateStats()
    })

    // Search input
    document.getElementById("searchInput").addEventListener("input", (e) => {
      this.searchTerm = e.target.value.toLowerCase()
      this.filterTasks()
      this.renderTasks()
      this.updateStats()
    })
  }

  setCurrentDate() {
    document.getElementById("dateFilter").value = this.currentDate
  }

  filterTasks() {
    this.filteredTasks = this.tasks.filter((task) => {
      // Period filter
      const taskDate = new Date(task.date)
      const selectedDate = new Date(this.currentDate)

      let periodMatch = false
      switch (this.currentPeriod) {
        case "day":
          periodMatch = taskDate.toDateString() === selectedDate.toDateString()
          break
        case "month":
          periodMatch =
            taskDate.getMonth() === selectedDate.getMonth() && taskDate.getFullYear() === selectedDate.getFullYear()
          break
        case "year":
          periodMatch = taskDate.getFullYear() === selectedDate.getFullYear()
          break
      }

      // Status filter
      let statusMatch = true
      if (this.currentStatus === "completed") {
        statusMatch = task.completed
      } else if (this.currentStatus === "pending") {
        statusMatch = !task.completed
      }

      // Search filter
      let searchMatch = true
      if (this.searchTerm) {
        searchMatch =
          task.title.toLowerCase().includes(this.searchTerm) ||
          task.description.toLowerCase().includes(this.searchTerm) ||
          task.category.toLowerCase().includes(this.searchTerm)
      }

      return periodMatch && statusMatch && searchMatch
    })
  }

  renderTasks() {
    const tasksGrid = document.getElementById("tasksGrid")
    const emptyState = document.getElementById("emptyState")

    if (this.filteredTasks.length === 0) {
      tasksGrid.style.display = "none"
      emptyState.style.display = "block"
      return
    }

    tasksGrid.style.display = "grid"
    emptyState.style.display = "none"

    tasksGrid.innerHTML = this.filteredTasks
      .map(
        (task) => `
            <div class="task-card ${task.completed ? "completed" : "pending"}">
                <div class="task-header-card">
                    <div class="task-status">
                        <span class="material-symbols-outlined status-icon ${task.completed ? "completed" : "pending"}">
                            ${task.completed ? "check_circle" : "cancel"}
                        </span>
                    </div>
                    <div class="priority-indicator priority-${task.priority}"></div>
                </div>

                <div class="task-content">
                    <h3 class="task-title">${task.title}</h3>
                    <p class="task-description">${task.description}</p>

                    <div class="task-meta">
                        <span class="task-category">${task.category}</span>
                        <span class="task-date">${this.formatDate(task.date)}</span>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }

  updateStats() {
    const completed = this.filteredTasks.filter((task) => task.completed).length
    const total = this.filteredTasks.length
    const pending = total - completed
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    document.getElementById("totalTasks").textContent = total
    document.getElementById("completedTasks").textContent = completed
    document.getElementById("pendingTasks").textContent = pending
    document.getElementById("completionRate").textContent = `${percentage}%`
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TaskHistoryManager()
})
