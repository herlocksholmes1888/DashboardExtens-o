async function fetchWithAuth(url, options = {}) {
    const accessToken = localStorage.getItem('accessToken');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`http://127.0.0.1:8000${url}`, { ...options, headers });

    if (response.status === 401) {
        alert("Sua sessão expirou. Por favor, faça login novamente.");
        window.location.href = 'login.html';
        throw new Error("Não autorizado");
    }

    return response;
}