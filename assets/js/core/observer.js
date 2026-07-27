class SectionObserver {
  constructor() {
    this.observers = new Map();
    this.intersectionObserver = null;
    this.init();
  }
  init() {
    const options = { root: null, rootMargin: '0px 0px -100px 0px', threshold: [0, 0.25, 0.5, 1] };
    this.intersectionObserver = new IntersectionObserver((entries) => this.handleIntersect(entries), options);
    this.setupReducedMotion();
  }
  handleIntersect(entries) {
    entries.forEach(entry => {
      const callbacks = this.observers.get(entry.target);
      if (!callbacks) return;
      if (entry.isIntersecting) {
        if (callbacks.enter) callbacks.enter(entry);
        if (callbacks.once) { this.unobserve(entry.target); }
      } else {
        if (callbacks.leave) callbacks.leave(entry);
      }
    });
  }
  observe(element, callbacks, once = false) {
    if (!element) return;
    this.observers.set(element, { ...callbacks, once });
    this.intersectionObserver.observe(element);
  }
  unobserve(element) {
    if (!element) return;
    this.observers.delete(element);
    this.intersectionObserver.unobserve(element);
  }
  setupReducedMotion() {
    if (NeuroUtils.prefersReducedMotion()) {
      document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('animated'));
    }
  }
  destroy() {
    this.observers.clear();
    if (this.intersectionObserver) this.intersectionObserver.disconnect();
  }
}
window.sectionObserver = new SectionObserver();
