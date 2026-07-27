const NeuroUtils = (() => {
  const debounce = (fn, delay = 100) => { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; };
  const throttle = (fn, limit = 16) => { let inThrottle; return (...args) => { if (!inThrottle) { fn(...args); inThrottle = true; setTimeout(() => { inThrottle = false; }, limit); } }; };
  const lerp = (start, end, t) => start * (1 - t) + end * t;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const isElementInView = (el, threshold = 0.3) => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return rect.top < vh * (1 - threshold) && rect.bottom > vh * threshold;
  };
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loadScript = (src, async = true) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src; script.async = async; script.defer = true;
    script.onload = resolve; script.onerror = reject;
    document.body.appendChild(script);
  });
  const preloadImage = (src) => { const link = document.createElement('link'); link.rel = 'preload'; link.as = 'image'; link.href = src; document.head.appendChild(link); };
  return Object.freeze({ debounce, throttle, lerp, clamp, getRandomFloat, getRandomInt, isElementInView, prefersReducedMotion, loadScript, preloadImage });
})();
