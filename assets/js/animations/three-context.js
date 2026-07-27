class NeuroThreeScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.particleData = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.animationId = null;
    this.isPaused = false;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.canvas || this.isReducedMotion) return;
    this.init();
    this.addEventListeners();
    this.startObserving();
  }
  init() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 30;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.createParticles();
    this.animate();
  }
  createParticles() {
    const count = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const colorCyan = new THREE.Color('#00F0FF');
    const colorPurple = new THREE.Color('#7C3AED');
    for (let i = 0; i < count; i++) {
      positions[i * 3] = NeuroUtils.getRandomFloat(-20, 20);
      positions[i * 3 + 1] = NeuroUtils.getRandomFloat(-20, 20);
      positions[i * 3 + 2] = NeuroUtils.getRandomFloat(-10, 10);
      sizes[i] = NeuroUtils.getRandomFloat(0.05, 0.3);
      const mix = Math.random();
      const color = colorCyan.clone().lerp(colorPurple, mix);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      this.particleData.push({
        speedX: NeuroUtils.getRandomFloat(-0.005, 0.005),
        speedY: NeuroUtils.getRandomFloat(-0.005, 0.005),
        speedZ: NeuroUtils.getRandomFloat(-0.002, 0.002),
        initialX: positions[i * 3],
        initialY: positions[i * 3 + 1],
        initialZ: positions[i * 3 + 2],
        phase: NeuroUtils.getRandomFloat(0, Math.PI * 2)
      });
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.15, vertexColors: true, transparent: true, opacity: 0.6,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    });
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }
  animate() {
    if (this.isPaused || this.isReducedMotion) return;
    this.animationId = requestAnimationFrame(() => this.animate());
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      const time = Date.now() * 0.001;
      for (let i = 0; i < this.particleData.length; i++) {
        const data = this.particleData[i];
        positions[i * 3] = data.initialX + Math.sin(time * 0.5 + data.phase) * 2 + this.mouseX * 0.1;
        positions[i * 3 + 1] = data.initialY + Math.cos(time * 0.3 + data.phase) * 1.5 + this.mouseY * -0.1;
        positions[i * 3 + 2] = data.initialZ + Math.sin(time * 0.2 + data.phase) * 0.5;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
    this.renderer.render(this.scene, this.camera);
  }
  onResize() {
    if (!this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  onMouseMove(e) {
    this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }
  pause() { this.isPaused = true; if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; } }
  resume() { this.isPaused = false; if (!this.animationId) this.animate(); }
  startObserving() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { this.resume(); } else { this.pause(); } });
    }, { threshold: 0 });
    observer.observe(hero);
  }
  addEventListeners() {
    window.addEventListener('resize', NeuroUtils.debounce(() => this.onResize(), 200));
    document.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
  }
  destroy() {
    this.pause();
    if (this.renderer) { this.renderer.dispose(); }
    if (this.particles) { this.particles.geometry.dispose(); this.particles.material.dispose(); }
    this.canvas = null;
  }
}
