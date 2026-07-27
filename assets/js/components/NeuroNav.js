class NeuroNav {
  constructor() {
    this.header = document.getElementById('header');
    this.nav = document.getElementById('mainNav');
    this.toggle = document.getElementById('menuToggle');
    if (!this.header || !this.nav || !this.toggle) return;
    this.navLinks = this.nav.querySelectorAll('a');
    this.init();
  }
  init() {
    this.toggle.addEventListener('click', () => this.toggleMenu());
    document.addEventListener('click', (e) => {
      if (this.nav.classList.contains('open') && !this.nav.contains(e.target) && !this.toggle.contains(e.target)) {
        this.closeMenu();
      }
    });
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
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (!isOpen) this.resetScroll();
  }
  closeMenu() {
    this.nav.classList.remove('open');
    this.toggle.classList.remove('active');
    this.toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    this.resetScroll();
  }
  resetScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
  }
}
