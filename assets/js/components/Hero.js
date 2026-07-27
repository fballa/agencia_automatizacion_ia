class Hero {
  constructor() {
    this.canvas = document.getElementById('heroCanvas');
    this.threeScene = null;
    this.init();
  }
  init() {
    if (this.canvas && typeof THREE !== 'undefined') {
      this.threeScene = new NeuroThreeScene(this.canvas);
    }
  }
}
