class ScrollEffects {
  constructor() {
    this.cleanupFns = [];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.init();
  }
  init() {
    this.initServiceCards();
    this.initSectionTags();
    this.initNavigationEffect();
  }
  initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      };
      const onLeave = () => { card.style.transform = ''; };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      this.cleanupFns.push(() => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); });
    });
  }
  initSectionTags() {
    document.querySelectorAll('.section-tag').forEach(tag => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(tag, { scale: 0.8, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.4,
        scrollTrigger: { trigger: tag, start: 'top 90%', toggleActions: 'play none none reverse' }
      });
    });
  }
  initNavigationEffect() {
    const header = document.getElementById('header');
    if (!header) return;
    const onScroll = NeuroUtils.throttle(() => {
      if (window.scrollY > 50) { header.classList.add('scrolled'); } else { header.classList.remove('scrolled'); }
    }, 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    this.cleanupFns.push(() => window.removeEventListener('scroll', onScroll));
  }
  destroy() { this.cleanupFns.forEach(fn => fn()); this.cleanupFns = []; }
}
