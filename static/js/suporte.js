// =============== JavaScript para Página de Suporte ===============

// Variáveis globais
let chatOpen = false
let messageCount = 0

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  initializeSupport()
})

// =============== Inicializar Suporte ===============
function initializeSupport() {
  console.log("🚀 Sistema de Suporte Ativo!")

  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && chatOpen) {
      const activeElement = document.activeElement
      if (activeElement && activeElement.id === "messageInput") {
        sendMessage()
      }
    }
  })

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("chatModal")
    if (event.target === modal) {
      closeChat()
    }
  })
}

// =============== Chatbot ===============
function startChat() {
  const modal = document.getElementById("chatModal")
  if (modal) {
    modal.style.display = "block"
    chatOpen = true

    setTimeout(() => {
      const messageInput = document.getElementById("messageInput")
      if (messageInput) messageInput.focus()
    }, 100)

    setTimeout(() => {
      addChatMessage("Suporte", "Olá! Como posso te ajudar?", "support")
    }, 1500)
  }
}

function closeChat() {
  const modal = document.getElementById("chatModal")
  if (modal) {
    modal.style.display = "none"
    chatOpen = false
  }
}

function sendMessage() {
  const input = document.getElementById("messageInput")
  const message = input ? input.value.trim() : ""
  if (message) {
    addChatMessage("Você", message, "user")
    input.value = ""

    setTimeout(() => {
      const responses = [
        "Entendi! Estou verificando...",
        "Certo! Já retorno com uma resposta.",
        "Pode me dar mais detalhes?",
      ]
      const reply = responses[Math.floor(Math.random() * responses.length)]
      addChatMessage("Suporte", reply, "support")
    }, 1000)
  }
}

function addChatMessage(sender, message, type) {
  const messagesContainer = document.getElementById("chatMessages")
  if (!messagesContainer) return

  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${type}`

  const now = new Date()
  const timeString = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  messageDiv.innerHTML = `
    <div class="message-avatar">${sender.charAt(0)}</div>
    <div class="message-content">
      <p>${message}</p>
      <span class="message-time">${timeString}</span>
    </div>
  `
  messagesContainer.appendChild(messageDiv)
  messagesContainer.scrollTop = messagesContainer.scrollHeight
  messageCount++
}

// =============== Google Maps ===============
function openMap() {
  const address = "Rua das Flores, 123, Centro, São Paulo, SP"
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  window.open(url, "_blank")
}

// =============== Redes Sociais ===============
function openSocial(platform) {
  const urls = {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    youtube: "#",
  }

  if (urls[platform]) {
    window.open(urls[platform], "_blank")
    console.log(`🔗 Acessando ${platform}`)
  }
}

// =============== Website Oficial ===============
function openWebsite() {
  window.open("#", "_blank")
  console.log("🌐 Acessando website oficial...")
}
