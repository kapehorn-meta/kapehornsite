// ===== Mobile Menu Component =====

class MobileMenu {
  constructor() {
    this.isOpen = false;
  }
  
  init() {
    this.toggle = DOMHelpers.selectByData('mobile-menu-toggle');
    this.menu = DOMHelpers.selectByData('mobile-menu');
    
    if (!this.toggle || !this.menu) return;
    
    this.bindEvents();
  }
  
  bindEvents() {
    this.toggle.addEventListener('click', () => this.toggleMenu());
    window.addEventListener('resize', () => this.handleResize());
  }
  
  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.menu.style.display = this.isOpen ? 'block' : 'none';
  }
  
  closeMenu() {
    this.isOpen = false;
    this.menu.style.display = 'none';
  }
  
  handleResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 900) {
      this.closeMenu();
    }
  }
  
  destroy() {
    if (this.toggle) {
      this.toggle.removeEventListener('click', this.toggleMenu);
    }
    window.removeEventListener('resize', this.handleResize);
  }
}

// Export for global use
window.MobileMenu = MobileMenu;