class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    if (!this.form) return;
    this.successEl = document.getElementById('formSuccess');
    this.errorEl = null;
    this.endpoint = 'https://misdemos.x10.mx/apichat/apibrevo.php';
    this.init();
  }
  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-error')) this.clearError(input);
      });
    });
  }
  validateField(input) {
    const group = input.closest('.form-group');
    if (!group) return true;
    if (input.hasAttribute('required') && !input.value.trim()) {
      group.classList.add('form-error'); return false;
    }
    if (input.type === 'email' && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        group.classList.add('form-error'); return false;
      }
    }
    group.classList.remove('form-error');
    return true;
  }
  clearError(input) {
    const group = input.closest('.form-group');
    if (group) group.classList.remove('form-error');
  }
  validateAll() {
    let valid = true;
    this.form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      if (!this.validateField(input)) valid = false;
    });
    return valid;
  }
  buildMensaje(data) {
    const lines = [
      `Nombre:\n${data.name || ''}`,
      `Correo:\n${data.email || ''}`,
      `Teléfono:\n${data.phone || ''}`,
      `Empresa:\n${data.company || ''}`,
      `Servicio:\n${data.service || ''}`,
      `Mensaje:\n${data.message || ''}`
    ];
    return lines.join('\n\n');
  }
  showError(msg) {
    if (!this.errorEl) {
      this.errorEl = document.createElement('div');
      this.errorEl.className = 'form-error-message';
      this.errorEl.style.cssText = 'color:#DC2626;background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:0.75rem 1rem;margin-top:1rem;text-align:center;font-size:0.85rem';
      this.form.appendChild(this.errorEl);
    }
    this.errorEl.textContent = msg;
    this.errorEl.style.display = 'block';
  }
  hideError() {
    if (this.errorEl) this.errorEl.style.display = 'none';
  }
  async handleSubmit(e) {
    e.preventDefault();
    if (!this.validateAll()) return;
    this.hideError();
    const btn = this.form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.classList.add('btn-loading');
    btn.textContent = 'Enviando...';
    try {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      const mensaje = this.buildMensaje(data);
      const payload = {
        nombre: 'Form web Empresa',
        email: 'frankball4@gmail.com',
        telefono: data.phone || '',
        mensaje: mensaje,
        asunto: 'Consulta Form web Empresa',
        sendername: 'Sitio WEB Empresa'
      };
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      this.form.reset();
      this.form.style.display = 'none';
      if (this.successEl) {
        this.successEl.textContent = text;
        this.successEl.classList.add('show');
      }
    } catch (err) {
      this.showError('Error de conexión. Verifica tu internet e intenta de nuevo.');
    } finally {
      btn.disabled = false;
      btn.classList.remove('btn-loading');
      btn.textContent = originalText;
    }
  }
}
