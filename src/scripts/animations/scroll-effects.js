// ===== Scroll-based Animations =====

export class ScrollEffects {
  constructor() {
    this.observers = [];
    this.waveIntroInitialized = false;
  }
  
  init() {
    this.initCoreValuesAnimation();
    this.initWaveIntroAnimation();
    this.initWaveLogoAnimation();
  }
  
  initCoreValuesAnimation() {
    const coreTitle = document.querySelector('[data-core-title]');
    const coreValues = document.querySelector('[data-core-values]');
    const coreValueElements = document.querySelectorAll('[data-core-value]');
    
    if (!coreTitle || !coreValues) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate title
          if (entry.target.hasAttribute('data-core-title')) {
            entry.target.classList.add('animate');
          }
          
          // Animate core values sequentially
          if (entry.target.hasAttribute('data-core-values')) {
            coreValueElements.forEach((value, index) => {
              setTimeout(() => {
                value.classList.add('animate');
              }, index * 200);
            });
          }
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });
    
    observer.observe(coreTitle);
    observer.observe(coreValues);
    this.observers.push(observer);
  }
  
  initWaveIntroAnimation() {
    if (this.waveIntroInitialized) return;
    
    const introElements = [
      document.querySelector('[data-wave-intro-en]'),
      document.querySelector('[data-wave-intro-title]'),
      document.querySelector('[data-wave-intro-desc]')
    ];
    
    introElements.forEach((el, idx) => {
      if (el) {
        setTimeout(() => {
          el.classList.add('show');
        }, 200 + idx * 350);
      }
    });
    
    this.waveIntroInitialized = true;
  }
  
  initWaveLogoAnimation() {
    const logo = document.querySelector('[data-wave-logo]');
    if (!logo) return;
    
    const checkLogoVisibility = () => {
      const rect = logo.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      if (rect.top < windowHeight * 0.85) {
        logo.classList.add('show');
        window.removeEventListener('scroll', checkLogoVisibility);
      }
    };
    
    window.addEventListener('scroll', checkLogoVisibility);
    // Check immediately in case already in view
    checkLogoVisibility();
  }
  
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}