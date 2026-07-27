class Blog {
  constructor() {
    this.modal = document.getElementById('articleModal');
    if (!this.modal) return;
    this.overlay = this.modal;
    this.content = this.modal.querySelector('.modal-content');
    this.closeBtn = this.modal.querySelector('.modal-close');
    this.catEl = this.modal.querySelector('.modal-category');
    this.dateEl = this.modal.querySelector('.modal-date');
    this.titleEl = this.modal.querySelector('.modal-title');
    this.bodyEl = this.modal.querySelector('.modal-body');
    this.articles = [
      {
        title: 'El Futuro de la IA Empresarial: Tendencias 2026',
        category: 'Inteligencia Artificial',
        date: 'Julio 15, 2026',
        content: '<p>La inteligencia artificial está redefiniendo la forma en que las empresas operan, toman decisiones y compiten en el mercado. En 2026, las tendencias clave incluyen la IA generativa aplicada a la automatización de procesos, modelos de lenguaje de código abierto que democratizan el acceso, y agentes autónomos capaces de ejecutar tareas complejas sin supervisión humana. Las empresas que adopten estas tecnologías no solo reducirán costos operativos, sino que podrán anticipar tendencias, personalizar experiencias a gran escala y mejorar la toma de decisiones estratégicas.</p>'
      },
      {
        title: 'Guía Definitiva para Migrar tu Infraestructura a la Nube',
        category: 'Cloud Computing',
        date: 'Junio 28, 2026',
        content: '<p>Migrar a la nube no es solo un cambio técnico, es una transformación estratégica. Esta guía te lleva por cada fase del proceso: evaluación de aplicaciones legacy, selección del modelo de nube (pública, privada o híbrida), planificación de la migración (lift-and-shift, re-plataforma o refactorización), y la ejecución con mínima interrupción del negocio. También abordamos la optimización de costos, la seguridad en la nube y la gestión del cambio cultural dentro de la organización.</p>'
      },
      {
        title: 'Cómo la Automatización Inteligente Está Redefiniendo las Empresas',
        category: 'Transformación Digital',
        date: 'Junio 10, 2026',
        content: '<p>La automatización inteligente combina IA, RPA y orquestación de procesos para crear flujos de trabajo autónomos que reducen costos, minimizan errores y liberan talento humano para tareas de mayor valor. Desde la atención al cliente con chatbots, hasta la conciliación financiera automatizada y la gestión de inventarios predictiva, las empresas están logrando eficiencias de hasta el 40% en procesos administrativos.</p>'
      }
    ];
    this.init();
  }
  init() {
    document.querySelectorAll('[data-article]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute('data-article'), 10);
        this.open(idx);
      });
    });
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) this.close();
    });
  }
  open(idx) {
    const article = this.articles[idx];
    if (!article) return;
    this.catEl.textContent = article.category;
    this.dateEl.textContent = article.date;
    this.titleEl.textContent = article.title;
    this.bodyEl.innerHTML = article.content;
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  close() {
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}
