class Stats {
  constructor() {
    this.statCards = document.querySelectorAll('.stat-card');
    this.animated = false;
    if (!this.statCards.length) return;
    this.initObserver();
  }
  initObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.animateStatValues();
          this.animated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    this.statCards.forEach(card => observer.observe(card));
  }
  animateStatValues() {
    this.statCards.forEach(card => {
      const valueEl = card.querySelector('.stat-value');
      if (!valueEl) return;
      const countTo = parseFloat(valueEl.dataset.count);
      const suffix = valueEl.dataset.suffix || '';
      const isDecimal = countTo % 1 !== 0;
      const duration = 2000;
      const start = performance.now();
      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * countTo;
        valueEl.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current).toString()) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    });
  }
}
