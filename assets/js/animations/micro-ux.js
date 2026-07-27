class MicroUX {
  constructor() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.initMagneticButtons();
    this.initSmoothAnchors();
  }
  initMagneticButtons() {
    document.querySelectorAll('.btn-magnetic, .btn-primary, .btn-secondary').forEach(btn => {
      if (!btn.classList.contains('btn-magnetic')) btn.classList.add('btn-magnetic');
      const onMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      };
      const onLeave = () => { btn.style.transform = ''; };
      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
    });
  }
  initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const headerHeight = 80;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        if (window.gsap && gsap.registerPlugin) {
          try { gsap.to(window, { scrollTo: { y: targetPos }, duration: 1, ease: 'power3.inOut' }); }
          catch(e) { window.scrollTo({ top: targetPos, behavior: 'smooth' }); }
        } else {
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
        document.body.style.overflow = '';
        document.body.style.position = '';
        const nav = document.getElementById('mainNav');
        const toggle = document.getElementById('menuToggle');
        if (nav) {
          nav.classList.remove('open');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
}
