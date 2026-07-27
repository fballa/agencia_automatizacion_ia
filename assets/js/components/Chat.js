class ChatWidget {
  constructor() {
    this.toggle = document.getElementById('chatToggle');
    this.window = document.getElementById('chatWindow');
    this.close = document.getElementById('chatClose');
    this.input = document.getElementById('chatInput');
    this.send = document.getElementById('chatSend');
    this.messages = document.getElementById('chatMessages');
    this.typing = document.getElementById('chatTyping');
    if (!this.toggle || !this.window) return;
    this.isOpen = false;
    this.isSending = false;
    this.userIP = null;
    this.API_URL = 'https://nicatoolagente.app.n8n.cloud/webhook/neurobot';
    this.init();
  }
  init() {
    this.toggle.addEventListener('click', () => this.toggleChat());
    if (this.close) this.close.addEventListener('click', () => this.closeChat());
    if (this.send) this.send.addEventListener('click', () => this.sendMessage());
    if (this.input) {
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !this.isSending) this.sendMessage();
      });
    }
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.window.contains(e.target) && !this.toggle.contains(e.target)) {
        this.closeChat();
      }
    });
  }
  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }
  openChat() {
    this.isOpen = true;
    this.window.classList.add('open');
    this.toggle.classList.add('active');
    this.toggle.setAttribute('aria-label', 'Cerrar chat');
    if (this.input) setTimeout(() => this.input.focus(), 300);
  }
  closeChat() {
    this.isOpen = false;
    this.window.classList.remove('open');
    this.toggle.classList.remove('active');
    this.toggle.setAttribute('aria-label', 'Abrir chat');
  }
  async obtenerIP() {
    if (this.userIP) return this.userIP;
    try {
      const res = await fetch('https://api64.ipify.org?format=json');
      const data = await res.json();
      this.userIP = data.ip;
      return this.userIP;
    } catch {
      return '0.0.0.0';
    }
  }
  async enviarMensaje(mensaje) {
    const ip = await this.obtenerIP();
    const res = await fetch(this.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje, ip })
    });
    if (!res.ok) throw new Error('Error en la respuesta del servidor');
    const data = await res.json();
    if (!data || !data.output) throw new Error('Respuesta inválida');
    return data.output;
  }
  mostrarRespuesta(texto) {
    this.mostrarTyping(false);
    this.addMessage(texto, 'bot');
    this.scrollToBottom();
  }
  manejarErrores() {
    this.mostrarTyping(false);
    this.addMessage('No fue posible obtener una respuesta en este momento. Inténtalo nuevamente.', 'bot');
    this.scrollToBottom();
  }
  mostrarTyping(mostrar) {
    if (!this.typing) return;
    this.typing.style.display = mostrar ? 'flex' : 'none';
    if (mostrar) requestAnimationFrame(() => this.scrollToBottom());
  }
  scrollToBottom() {
    if (!this.messages) return;
    this.messages.scrollTop = this.messages.scrollHeight;
  }
  sendMessage() {
    if (!this.input || !this.input.value.trim() || this.isSending) return;
    const msg = this.input.value.trim();
    this.addMessage(msg, 'user');
    this.input.value = '';
    this.isSending = true;
    if (this.send) this.send.disabled = true;
    this.mostrarTyping(true);
    this.enviarMensaje(msg)
      .then(respuesta => this.mostrarRespuesta(respuesta))
      .catch(() => this.manejarErrores())
      .finally(() => {
        this.isSending = false;
        if (this.send) this.send.disabled = false;
        if (this.input) this.input.focus();
      });
  }
  addMessage(text, type) {
    if (!this.messages) return;
    const div = document.createElement('div');
    div.className = `chat-message ${type}`;
    if (type === 'bot' && typeof NeuroMarkdown !== 'undefined') {
      div.innerHTML = NeuroMarkdown.render(text);
    } else {
      div.textContent = text;
    }
    this.messages.appendChild(div);
    this.scrollToBottom();
  }
}
