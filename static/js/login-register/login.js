document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("error-message");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Limpa mensagens de erro anteriores
        errorMessage.textContent = "";

        // Pega os usuários salvos no localStorage (do registro)
        const users = JSON.parse(localStorage.getItem("healthDashboardUsers")) || [];

        // Procura pelo usuário com o email e senha correspondentes
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Login bem-sucedido
            alert("Login realizado com sucesso!");
            // Redireciona para a página principal do dashboard
            window.location.href = "index.html";
        } else {
            // Credenciais inválidas
            errorMessage.textContent = "Email ou senha incorretos. Tente novamente.";
        }
    });
});