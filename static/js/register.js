document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const errorMessage = document.getElementById("error-message");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            errorMessage.textContent = "";

            try {
                // Captura dos campos corretos
                const username = document.getElementById("username").value;
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
                const confirmPassword = document.getElementById("confirm-password").value;
                
                if (password !== confirmPassword) {
                    errorMessage.textContent = "As senhas não coincidem.";
                    return;
                }

                const response = await fetch('http://127.0.0.1:8000/api/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username, // Agora usamos a variável username diretamente
                        email: email,
                        password: password
                    }),
                });

                if (response.ok) {
                    alert("Conta criada com sucesso! Você será redirecionado para o login.");
                    window.location.href = "login.html";
                } else {
                    const errorData = await response.json();
                    errorMessage.textContent = Object.values(errorData).join(' ');
                }

            } catch (error) {
                console.error("Erro no script de registro:", error);
                errorMessage.textContent = "Ocorreu um erro inesperado. Verifique o console.";
            }
        });
    }
});