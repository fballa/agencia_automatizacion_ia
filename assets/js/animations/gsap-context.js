class GsapNeuro {
  constructor() {
    this.timelines = [];
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.isReduced) return;
    this.registerScrollTrigger();
    this.initAnimations();
  }
  registerScrollTrigger() {
    gsap.registerPlugin(ScrollTrigger);
  }
  initAnimations() {
    this.animateOnScroll();
    this.animateStats();
    this.animateParallax();
  }
  animateOnScroll() {
    const items = document.querySelectorAll('[data-animate]');
    items.forEach(el => {
      const animType = el.dataset.animate || 'fade-up';
      const delay = parseInt(el.dataset.delay) || 0;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
      switch (animType) {
        case 'fade-up': tl.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: delay / 1000, ease: 'power3.out' }); break;
        case 'fade-left': tl.fromTo(el, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: delay / 1000, ease: 'power3.out' }); break;
        case 'fade-right': tl.fromTo(el, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: delay / 1000, ease: 'power3.out' }); break;
        case 'scale': tl.fromTo(el, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, delay: delay / 1000, ease: 'power3.out' }); break;
      }
      this.timelines.push(tl);
    });
  }
  animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(el => {
      const countTo = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el.closest('.stat-card'), start: 'top 90%' }
      });
      tl.fromTo(el, { textContent: 0 }, {
        textContent: countTo,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: countTo % 1 === 0 ? 1 : 0.1 },
        onUpdate: () => { el.textContent = parseFloat(el.textContent).toFixed(countTo % 1 === 0 ? 0 : 1) + suffix; }
      });
      this.timelines.push(tl);
    });
  }
  animateParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      gsap.to(el, {
        y: () => window.innerHeight * speed * 0.5,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }
  animateHero() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSub = document.querySelector('.hero-subtitle');
    const heroActions = document.querySelector('.hero-actions');
    const heroTag = document.querySelector('.hero-tag');
    const heroBadge = document.querySelector('.hero-badge');
    if (this.isReduced) {
      [heroTitle, heroSub, heroActions, heroTag, heroBadge].forEach(el => { if (el) el.style.opacity = 1; });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(heroTag, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(heroTitle, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.3')
      .fromTo(heroSub, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
      .fromTo(heroActions, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
      .fromTo(heroBadge, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2');
    this.timelines.push(tl);
  }
  refresh() { ScrollTrigger.refresh(); }
  destroy() {
    this.timelines.forEach(tl => { if (tl.scrollTrigger) tl.scrollTrigger.kill(); tl.kill(); });
    this.timelines = [];
    ScrollTrigger.getAll().forEach(st => st.kill());
  }
}
