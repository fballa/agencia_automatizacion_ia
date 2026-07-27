class NeuroNav {
  constructor() {
    this.header = document.getElementById('header');
    this.nav = document.getElementById('mainNav');
    this.toggle = document.getElementById('menuToggle');
    this.closeBtn = document.getElementById('navClose');
    if (!this.header || !this.nav || !this.toggle || !this.closeBtn) return;
    this.navLinks = this.nav.querySelectorAll('a');
    this.overlay = this.createOverlay();
    this.init();
  }
  createOverlay() {
    const el = document.createElement('div');
    el.className = 'nav-overlay';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
  }
  init() {
    this.toggle.addEventListener('click', () => this.toggleMenu());
    this.closeBtn.addEventListener('click', () => this.closeMenu());
    this.overlay.addEventListener('click', () => this.closeMenu());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.nav.classList.contains('open')) this.closeMenu();
    });
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
  }
  toggleMenu() {
    const isOpen = this.nav.classList.toggle('open');
    this.toggle.classList.toggle('active');
    this.toggle.setAttribute('aria-expanded', isOpen);
    this.overlay.classList.toggle('active');
    this.header.classList.toggle('menu-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  closeMenu() {
    this.nav.classList.remove('open');
    this.toggle.classList.remove('active');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.overlay.classList.remove('active');
    this.header.classList.remove('menu-open');
    document.body.style.overflow = '';
  }
}
