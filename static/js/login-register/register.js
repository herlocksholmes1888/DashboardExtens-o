document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const errorMessage = document.getElementById("error-message");

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        errorMessage.textContent = "";

        // Validações básicas
        if (!name || !email || !password) {
            errorMessage.textContent = "Por favor, preencha todos os campos.";
            return;
        }

        if (password !== confirmPassword) {
            errorMessage.textContent = "As senhas não coincidem.";
            return;
        }

        // Recupera usuários existentes ou cria um array vazio
        const users = JSON.parse(localStorage.getItem("healthDashboardUsers")) || [];

        // Verifica se o email já está em uso
        if (users.some(user => user.email === email)) {
            errorMessage.textContent = "Este email já está cadastrado.";
            return;
        }

        // Adiciona o novo usuário
        const newUser = { name, email, password };
        users.push(newUser);

        // Salva a lista atualizada no localStorage
        localStorage.setItem("healthDashboardUsers", JSON.stringify(users));

        // Sucesso
        alert("Conta criada com sucesso! Você será redirecionado para o login.");
        window.location.href = "login.html";
    });
});