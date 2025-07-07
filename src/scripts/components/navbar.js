// ===== Navigation Bar Component =====

export class Navbar {
  constructor() {
    this.lastScrollTop = 0;
    this.isInitialized = false;
  }
  
  init() {
    this.navbar = document.querySelector('[data-navbar]');
    if (!this.navbar) return;
    
    this.bindEvents();
  }
  
  bindEvents() {
    window.addEventListener('scroll', () => this.handleScroll());
  }
  
  handleScroll() {
    if (!this.isInitialized || !this.navbar) return;
    
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Scroll direction detection
    if (currentScrollTop > this.lastScrollTop && currentScrollTop > 100) {
      // Scrolling down (hide navbar)
      this.navbar.classList.remove('show');
      this.navbar.classList.add('hide');
    } else if (currentScrollTop < this.lastScrollTop) {
      // Scrolling up (show navbar)
      this.navbar.classList.remove('hide');
      this.navbar.classList.add('show');
    }
    
    this.lastScrollTop = currentScrollTop;
  }
  
  show() {
    if (!this.navbar) return;
    this.navbar.classList.add('show');
    this.isInitialized = true;
    window.navbarInitialized = true;
  }
  
  hide() {
    if (!this.navbar) return;
    this.navbar.classList.remove('show');
    this.navbar.classList.add('hide');
  }
  
  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}