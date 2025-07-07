// ===== Smooth Scroll Component =====

class SmoothScroll {
  constructor() {
    this.scrollArrows = [];
  }
  
  init() {
    this.scrollArrows = DOMHelpers.selectAll('[data-scroll-arrow]');
    this.bindEvents();
  }
  
  bindEvents() {
    this.scrollArrows.forEach(arrow => {
      arrow.addEventListener('click', (e) => this.handleArrowClick(e));
    });
  }
  
  handleArrowClick(event) {
    event.preventDefault();
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
    
    AnimationUtils.smoothScrollTo(targetPosition, CONSTANTS.ANIMATION.SCROLL_DURATION);
  }
  
  destroy() {
    this.scrollArrows.forEach(arrow => {
      arrow.removeEventListener('click', this.handleArrowClick);
    });
  }
}

// Export for global use
window.SmoothScroll = SmoothScroll;