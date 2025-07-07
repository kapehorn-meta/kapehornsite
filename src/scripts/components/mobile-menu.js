// ===== Mobile Menu Component =====

export class MobileMenu {
  constructor() {
    this.isOpen = false;
  }
  
  init() {
    this.toggle = document.querySelector('[data-mobile-menu-toggle]');
    this.menu = document.querySelector('[data-mobile-menu]');
    
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