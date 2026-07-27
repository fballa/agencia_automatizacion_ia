(function() {
  'use strict';

  const showFallback = () => {
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  };

  const waitForDeps = () => {
    if (typeof NeuroUtils === 'undefined' || typeof NEUROBITE === 'undefined') {
      setTimeout(waitForDeps, 50);
      return;
    }
    initApp();
  };

  const initApp = () => {
    try {
      new NeuroNav();
      new Hero();
      new Services();
      new TestimonialSlider();
      new ContactForm();
      new ChatWidget();
      new Stats();
      new Blog();
      if (typeof gsap !== 'undefined') {
        window.gsapCore = new GsapNeuro();
        window.scrollEffects = new ScrollEffects();
        new MicroUX();
        window.gsapCore.animateHero();
        setTimeout(() => window.gsapCore.refresh(), 500);
      } else {
        showFallback();
      }
    } catch (e) {
      console.warn('NeuroBite init error:', e);
      showFallback();
    }
    setTimeout(showFallback, 4000);
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 1000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForDeps);
  } else {
    waitForDeps();
  }
})();
