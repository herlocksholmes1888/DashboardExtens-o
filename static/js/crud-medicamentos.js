document.addEventListener("DOMContentLoaded", () => {
    // Referências aos elementos do DOM
    const medicamentList = document.getElementById("medicamentList");
    const noMedicamentsMessage = document.getElementById("noMedicamentsMessage");
    // As referências ao modal podem ser mantidas se você quiser adicionar/editar
    // direto da tela principal, mas isso exigiria mais lógica de API.
    // Para este exemplo, vamos focar em apenas carregar e exibir os dados.

    // Função para renderizar a agenda de medicamentos
    function renderMedications(agenda) {
        medicamentList.innerHTML = ""; // Limpa a lista atual

        if (agenda.length === 0) {
            noMedicamentsMessage.style.display = "flex";
            medicamentList.style.display = "none";
        } else {
            noMedicamentsMessage.style.display = "none";
            medicamentList.style.display = "block";
            agenda.forEach((item) => {
                const listItem = document.createElement("li");
                listItem.setAttribute("data-id", item.prescricao_id);

                const [hour, minute] = item.horario.split(":");
                const period = Number.parseInt(hour) >= 12 ? "PM" : "AM";

                listItem.innerHTML = `
                    <div class="medicamentsUserImg">
                        <img src="../static/img/Logo-Photoroom.jpg" alt="Pill">
                    </div>
                    <div class="medicamentsUserInfo">
                        <h2>${item.medicamento}</h2>
                        <span class="priority">Paciente: ${item.paciente}</span>
                    </div>
                    <div class="medicamentsUserCity">
                        <span>${item.horario.substring(0, 5)}</span><br>
                        <span>${period}</span>
                    </div>
                    <div class="medicament-actions">
                        <span class="material-symbols-outlined" title="Dosagem: ${item.dosagem}">info</span>
                    </div>
                `;
                medicamentList.appendChild(listItem);
            });
        }
    }

    // Função para buscar a agenda do dia da API
    async function loadAgenda() {
        try {
            const response = await fetchWithAuth('/prescricoes/agenda_hoje/');
            if (response.ok) {
                const agenda = await response.json();
                renderMedications(agenda);
            } else {
                console.error("Erro ao buscar a agenda:", response.statusText);
                noMedicamentsMessage.querySelector('p').textContent = "Erro ao carregar agenda.";
                noMedicamentsMessage.style.display = "flex";
                medicamentList.style.display = "none";
            }
        } catch (error) {
            console.error(error);
            noMedicamentsMessage.querySelector('p').textContent = "Falha na conexão.";
            noMedicamentsMessage.style.display = "flex";
            medicamentList.style.display = "none";
        }
    }

    // Carrega a agenda quando a página é aberta
    loadAgenda();
});