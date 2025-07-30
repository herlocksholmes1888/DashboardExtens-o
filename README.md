# Farmavision - Painel de Gerenciamento de Saúde - Projeto de Extensão da UNIP
## Curso: Ciência da Computação - UNIP

**Farmavision** é um sistema de gerenciamento voltado para enfermeiros que trabalham em casas de repouso. Ele visa facilitar a gestão do estoque de remédios e a administração destes mesmos remédios em pacientes. Consiste em um painel interativo com a aparência de um dashboard moderno, cujos dados são suplementados por uma API RESTful construída com Django Rest Framework. 

### ✨ Funcionalidades
**Backend (API RESTful)**
* **Gerenciamento de Pacientes**: Adicionar dados
* **Gerenciamento de Medicamentos**: Adicionar dados
* **Gerenciamento de Prescrições Médicas**: Adicionar dados
* **Registro de Administração de Medicamentos**: Adicionar dados
* **Autenticação via JWT**: Adicionar dados
* **Sistema de Permissões**: Adicionar dados

**Frontend (Painel de Controle)**
* **Dashboard Interativo**: Adicionar dados
* **Registro de Novos Enfermeiros**: Adicionar dados
* **Visualização de Desempenho**: Adicionar dados
* **Histórico de Tarefas**: Adicionar dados
* **Central de Suporte**: Adicionar dados
* **Configurações de Tema**: Adicionar dados

### 🛠️ Tecnologias Utilizadas
**Backend**
* Python3
* Django
* Django Rest Framework (DRF)

**Frontend**
* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Chart.js

### 🚀 Instalação e Configuração
Adicionar dados

### 📞 API Endpoints
```
    POST /api/register/
    POST /api/token/
    POST /api/token/refresh/
    GET, POST /pacientes/
    GET /pacientes/ativos/
    GET, PUT, PATCH, DELETE /pacientes/{id}/
    GET, POST /medicamentos/
    GET, POST /prescricoes/
    GET /prescricoes/agenda_hoje/
```

## Desenvolvido por Gustavo Dias de Oliveira, Luisa Frugoli Valente Lopes, Kaiky Souza Proença de Andrade, Daniel Toledo Mattos de Souza, Cristopher de Souza Martins e Gabriel Matias Oliveira