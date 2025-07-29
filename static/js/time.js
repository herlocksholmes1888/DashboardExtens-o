function atualizarTempo() {
            const hora = document.getElementById('hora');
            const temp = document.getElementById('temp');

            // Hora
            const agora = new Date();
            hora.textContent = agora.toLocaleTimeString('pt-BR');

            // Clima - Praia Grande
            fetch('https://api.open-meteo.com/v1/forecast?latitude=-24.0058&longitude=-46.402&current_weather=true')
                .then(res => res.json())
                .then(data => {
                    temp.textContent = `${data.current_weather.temperature}°C`;
                })
                .catch(() => {
                    temp.textContent = "Erro";
                });
        }

        atualizarTempo();
        setInterval(atualizarTempo, 1000); // Atualiza hora a cada segundo