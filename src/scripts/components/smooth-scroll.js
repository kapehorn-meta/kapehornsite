// ===== Smooth Scroll Component =====

export class SmoothScroll {
  constructor() {
    this.scrollArrows = [];
  }
  
  init() {
    this.scrollArrows = document.querySelectorAll('[data-scroll-arrow]');
    this.bindEvents();
  }
  
  bindEvents() {
    this.scrollArrows.forEach(arrow => {
      arrow.addEventListener('click', (e) => this.handleArrowClick(e));
    });
  }
  
  handleArrowClick(event) {
    const arrow = event.currentTarget;
    const targetSectionId = arrow.getAttribute('data-scroll-arrow');
    
    if (targetSectionId) {
      this.scrollToSection(targetSectionId);
    }
  }
  
  scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    
    if (!targetSection) {
      console.error('Section not found:', sectionId);
      return;
    }
    
    const targetPosition = targetSection.offsetTop;
    console.log('Scrolling to:', sectionId, 'Target position:', targetPosition);
    
    this.smoothScrollTo(targetPosition, 1000);
  }
  
  smoothScrollTo(targetPosition, duration = 1000) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let start = null;
    
    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    
    function easeInOutCubic(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    }
    
    requestAnimationFrame(animation);
  }
  
  destroy() {
    this.scrollArrows.forEach(arrow => {
      arrow.removeEventListener('click', this.handleArrowClick);
    });
  }
}