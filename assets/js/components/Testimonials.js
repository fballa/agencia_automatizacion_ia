class TestimonialSlider {
  constructor() {
    this.swiperEl = document.querySelector('.swiper-testimonials');
    if (!this.swiperEl || typeof Swiper === 'undefined') return;
    this.init();
  }
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.createSwiper();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(this.swiperEl);
  }
  createSwiper() {
    new Swiper(this.swiperEl, {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 2 },
        1280: { slidesPerView: 3 }
      }
    });
  }
}
