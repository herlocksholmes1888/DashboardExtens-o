document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("error-message");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            errorMessage.textContent = "";

            try {
                // Captura o username do campo correto com id="username"
                const username = document.getElementById("username").value;
                const password = document.getElementById("password").value;

                const response = await fetch('http://127.0.0.1:8000/api/token/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('accessToken', data.access);
                    localStorage.setItem('refreshToken', data.refresh);
                    window.location.href = "index.html";
                } else {
                    errorMessage.textContent = "Nome de usuário ou senha incorretos.";
                }
            } catch (error) {
                console.error("Erro ao tentar fazer login:", error);
                errorMessage.textContent = "Não foi possível conectar ao servidor.";
            }
        });
    }
});