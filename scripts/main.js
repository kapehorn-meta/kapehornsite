// ===== Main Application Entry Point =====

class KapehornApp {
  constructor() {
    this.components = {};
    this.isInitialized = false;
  }
  
  init() {
    if (this.isInitialized) return;
    
    console.log('Initializing Kapehorn website...');
    
    // Initialize all components
    this.initializeComponents();
    
    // Start animations
    this.startAnimations();
    
    this.isInitialized = true;
    console.log('Kapehorn website initialized successfully');
  }
  
  initializeComponents() {
    // Initialize utility components
    this.components.navbar = new Navbar();
    this.components.navbar.init();
    
    this.components.mobileMenu = new MobileMenu();
    this.components.mobileMenu.init();
    
    this.components.smoothScroll = new SmoothScroll();
    this.components.smoothScroll.init();
    
    this.components.scrollEffects = new ScrollEffects();
    this.components.scrollEffects.init();
  }
  
  startAnimations() {
    // Initialize background gradient
    this.components.gradientBg = new GradientBackground();
    this.components.gradientBg.init();
    
    // Initialize CI motion sequence
    this.components.ciMotion = new CIMotion();
    this.components.ciMotion.start();
    
    // Initialize logo effects
    this.components.logoEffects = new LogoEffects();
    this.components.logoEffects.init();
  }
  
  destroy() {
    // Clean up all components
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    
    this.components = {};
    this.isInitialized = false;
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.kapehornApp = new KapehornApp();
  window.kapehornApp.init();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.kapehornApp) {
    window.kapehornApp.destroy();
  }
});