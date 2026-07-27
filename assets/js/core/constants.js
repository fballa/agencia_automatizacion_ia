const NEUROBITE = (() => {
  const BREAKPOINTS = { mobile: 768, tablet: 1024, desktop: 1280 };
  const SECTION_TL = { duration: 1, stagger: 0.15 };
  const THREE_CONFIG = { particleCount: 150, nodeCount: 80, edgeCount: 200 };
  const API = { web3forms: 'https://api.web3forms.com/submit', accessKey: '' };
  const SOCIAL = { linkedin: 'https://linkedin.com/company/neurobite', twitter: 'https://twitter.com/neurobite', github: 'https://github.com/neurobite' };
  const CHAT_RESPONSES = [
    '¡Excelente pregunta! En NeuroBite ofrecemos soluciones personalizadas de IA, desarrollo de software y automatización.',
    'Nuestro equipo de expertos puede ayudarte a transformar tu negocio con tecnología de vanguardia.',
    '¿Te gustaría agendar una consultoría gratuita? Escríbenos a frankball4@yahoo.es',
    'Contamos con más de 100 proyectos exitosos en diversas industrias. ¿Qué tipo de proyecto tienes en mente?',
    'La inteligencia artificial y la automatización son nuestras especialidades. ¿En qué área específica necesitas apoyo?',
    'Puedes conocer más sobre nuestros servicios navegando por las secciones de nuestro sitio.',
    '¡Claro! Déjame tu correo y un asesor especializado se pondrá en contacto contigo en menos de 24 horas.',
    'Trabajamos con tecnologías como TensorFlow, AWS, Kubernetes y más. ¿Qué stack tecnológico te interesa?'
  ];
  const isMobile = () => window.innerWidth <= BREAKPOINTS.mobile;
  const isTablet = () => window.innerWidth <= BREAKPOINTS.tablet;
  const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return Object.freeze({ BREAKPOINTS, SECTION_TL, THREE_CONFIG, API, SOCIAL, CHAT_RESPONSES, isMobile, isTablet, isReducedMotion });
})();
