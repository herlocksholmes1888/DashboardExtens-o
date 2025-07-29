document.addEventListener("DOMContentLoaded", () => {
  const addMedicamentBtn = document.getElementById("addMedicamentBtn")
  const clearMedicamentsBtn = document.getElementById("clearMedicamentsBtn")
  const medicamentModal = document.getElementById("medicamentModal")
  const medicamentNameInput = document.getElementById("medicamentName")
  const medicamentDosageInput = document.getElementById("medicamentDosage")
  const medicamentTimeInput = document.getElementById("medicamentTime")
  const medicamentList = document.getElementById("medicamentList")
  const noMedicamentsMessage = document.getElementById("noMedicamentsMessage")
  const saveButton = medicamentModal.querySelector(".btnSalvar")

  let medications = []
  let editingMedicamentId = null

  // Function to initialize medications from localStorage
  function initMedicaments() {
    const storedMedications = localStorage.getItem("medications")
    if (storedMedications) {
      medications = JSON.parse(storedMedications)
    }
    renderMedications()
  }

  // Function to render medications
  function renderMedications() {
    medicamentList.innerHTML = "" // Clear current list

    if (medications.length === 0) {
      noMedicamentsMessage.style.display = "flex"
      medicamentList.style.display = "none"
    } else {
      noMedicamentsMessage.style.display = "none"
      medicamentList.style.display = "block"
      medications.forEach((medicament) => {
        const listItem = document.createElement("li")
        listItem.setAttribute("data-id", medicament.id) // Store ID for easy access

        const [hour, minute] = medicament.time.split(":")
        const period = Number.parseInt(hour) >= 12 ? "PM" : "AM"

        listItem.innerHTML = `
                    <div class="medicamentsUserImg">
                        <img src="src/images/Logo-Photoroom.jpg" alt="Pill">
                    </div>
                    <div class="medicamentsUserInfo">
                        <h2>${medicament.name}</h2>
                        <span class="priority">${medicament.dosage}</span>
                    </div>
                    <div class="medicamentsUserCity">
                        <span>${medicament.time}</span><br>
                        <span>${period}</span>
                    </div>
                    <div class="medicament-actions">
                        <span class="material-symbols-outlined edit-btn" title="Editar" onclick="editMedicament('${medicament.id}')" style=" color: #ff6600ff;">edit</span>
                        <span class="material-symbols-outlined delete-btn" title="Deletar" onclick="deleteMedicament('${medicament.id}')">delete</span>
                    </div>
                `
        medicamentList.appendChild(listItem)
      })
    }
  }

  // Function to open the medication modal
  function openMedicamentModal(medicament = null) {
    console.log("Attempting to open medicament modal.")
    medicamentModal.classList.add("show")
    if (medicament) {
      medicamentModal.querySelector(".modal-header h2").textContent = "Editar Medicamento"
      medicamentNameInput.value = medicament.name
      medicamentDosageInput.value = medicament.dosage
      medicamentTimeInput.value = medicament.time
      editingMedicamentId = medicament.id
    } else {
      medicamentModal.querySelector(".modal-header h2").textContent = "Adicionar Medicamento"
      medicamentNameInput.value = ""
      medicamentDosageInput.value = ""
      medicamentTimeInput.value = ""
      editingMedicamentId = null
    }
  }

  // Function to close the medication modal (made globally accessible)
  window.closeMedicamentModal = () => {
    console.log("closeMedicamentModal function called.")
    medicamentModal.classList.remove("show")
    medicamentNameInput.value = ""
    medicamentDosageInput.value = ""
    medicamentTimeInput.value = ""
    editingMedicamentId = null
  }

  // Function to save (add/edit) a medication (already globally accessible)
  window.saveMedicament = () => {
    console.log("saveMedicament function called.")
    const name = medicamentNameInput.value.trim()
    const dosage = medicamentDosageInput.value.trim()
    const time = medicamentTimeInput.value

    console.log("Input values:", { name, dosage, time })

    if (!name || !dosage || !time) {
      alert("Por favor, preencha todos os campos do medicamento.")
      console.log("Validation failed: fields are empty.")
      return
    }

    if (editingMedicamentId) {
      console.log("Editing existing medicament with ID:", editingMedicamentId)
      medications = medications.map((med) => (med.id === editingMedicamentId ? { ...med, name, dosage, time } : med))
    } else {
      console.log("Adding new medicament.")
      const newMedicament = {
        id: Date.now().toString(),
        name,
        dosage,
        time,
      }
      medications.push(newMedicament)
    }

    console.log("Medications array after update:", medications)
    localStorage.setItem("medications", JSON.stringify(medications))
    console.log("Medications saved to localStorage.")
    renderMedications()
    window.closeMedicamentModal()
    console.log("Modal closed and list re-rendered.")
  }

  // Function to edit a medication (made globally accessible)
  window.editMedicament = (id) => {
    console.log("Attempting to edit medicament with ID:", id)
    const medicamentToEdit = medications.find((med) => med.id === id)
    if (medicamentToEdit) {
      openMedicamentModal(medicamentToEdit)
    } else {
      console.log("Medicament not found for editing with ID:", id)
    }
  }

  // Function to delete a medication (made globally accessible)
  window.deleteMedicament = (id) => {
    console.log("Attempting to delete medicament with ID:", id)
    // Removido o prompt de confirmação
    medications = medications.filter((medicament) => medicament.id !== id)
    localStorage.setItem("medications", JSON.stringify(medications))
    renderMedications()
    console.log("Medicament deleted and list re-rendered.")
  }

  // Function to clear all medications
  function clearAllMedicaments() {
    if (confirm("Tem certeza que deseja limpar TODOS os medicamentos? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem("medications")
      medications = []
      renderMedications()
    }
  }

  // Event Listeners
  addMedicamentBtn.addEventListener("click", () => openMedicamentModal())
  clearMedicamentsBtn.addEventListener("click", clearAllMedicaments)

  // Event listener para fechar o modal clicando fora dele
  medicamentModal.addEventListener("click", (e) => {
    if (e.target === medicamentModal) {
      window.closeMedicamentModal()
    }
  })

  // Initialize on page load
  initMedicaments()
})
