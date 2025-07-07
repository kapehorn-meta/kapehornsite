// ===== Navigation Bar Component =====

import { DOMHelpers } from '../utils/dom-helpers.js';

export class Navbar {
  constructor() {
    this.lastScrollTop = 0;
    this.isInitialized = false;
    this.handleScroll = DOMHelpers.throttle(this._handleScroll.bind(this), 16);
  }
  
  init() {
    this.navbar = DOMHelpers.selectByData('navbar');
    if (!this.navbar) return;
    
    this.bindEvents();
  }
  
  bindEvents() {
    window.addEventListener('scroll', this.handleScroll);
  }
  
  _handleScroll() {
    if (!this.isInitialized || !this.navbar) return;
    
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Scroll direction detection
    if (currentScrollTop > this.lastScrollTop && currentScrollTop > 100) {
      // Scrolling down (hide navbar)
      DOMHelpers.removeClass(this.navbar, 'show');
      DOMHelpers.addClass(this.navbar, 'hide');
    } else if (currentScrollTop < this.lastScrollTop) {
      // Scrolling up (show navbar)
      DOMHelpers.removeClass(this.navbar, 'hide');
      DOMHelpers.addClass(this.navbar, 'show');
    }
    
    this.lastScrollTop = currentScrollTop;
  }
  
  show() {
    if (!this.navbar) return;
    DOMHelpers.addClass(this.navbar, 'show');
    this.isInitialized = true;
    window.navbarInitialized = true;
  }
  
  hide() {
    if (!this.navbar) return;
    DOMHelpers.removeClass(this.navbar, 'show');
    DOMHelpers.addClass(this.navbar, 'hide');
  }
  
  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}

// Export for global use (backward compatibility)
window.Navbar = Navbar;