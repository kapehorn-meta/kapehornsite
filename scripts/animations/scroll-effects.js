// ===== Scroll-based Animations =====

class ScrollEffects {
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
    const coreTitle = DOMHelpers.selectByData('core-title');
    const coreValues = DOMHelpers.selectByData('core-values');
    const coreValueElements = DOMHelpers.selectAllByData('core-value');
    
    if (!coreTitle || !coreValues) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate title
          if (entry.target.hasAttribute('data-core-title')) {
            DOMHelpers.addClass(entry.target, 'animate');
          }
          
          // Animate core values sequentially
          if (entry.target.hasAttribute('data-core-values')) {
            coreValueElements.forEach((value, index) => {
              DOMHelpers.addClass(value, 'animate', index * 200);
            });
          }
        }
      });
    }, CONSTANTS.OBSERVER_OPTIONS);
    
    observer.observe(coreTitle);
    observer.observe(coreValues);
    this.observers.push(observer);
  }
  
  initWaveIntroAnimation() {
    if (this.waveIntroInitialized) return;
    
    const introElements = [
      DOMHelpers.selectByData('wave-intro-en'),
      DOMHelpers.selectByData('wave-intro-title'),
      DOMHelpers.selectByData('wave-intro-desc')
    ];
    
    introElements.forEach((el, idx) => {
      if (el) {
        DOMHelpers.addClass(el, 'show', 200 + idx * 350);
      }
    });
    
    this.waveIntroInitialized = true;
  }
  
  initWaveLogoAnimation() {
    const logo = DOMHelpers.selectByData('wave-logo');
    if (!logo) return;
    
    const checkLogoVisibility = () => {
      if (DOMHelpers.isInViewport(logo, 0.15)) {
        DOMHelpers.addClass(logo, 'show');
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

// Export for global use
window.ScrollEffects = ScrollEffects;