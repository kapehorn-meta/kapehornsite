// ===== DOM Helper Functions =====

const DOMHelpers = {
  // Safe element selection
  select: (selector) => {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`Element not found: ${selector}`);
    }
    return element;
  },
  
  selectAll: (selector) => {
    return document.querySelectorAll(selector);
  },
  
  // Safe element selection by data attribute
  selectByData: (dataAttribute) => {
    return DOMHelpers.select(`[data-${dataAttribute}]`);
  },
  
  selectAllByData: (dataAttribute) => {
    return DOMHelpers.selectAll(`[data-${dataAttribute}]`);
  },
  
  // Create SVG elements
  createSVGElement: (tagName, attributes = {}) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  },
  
  // Set multiple attributes at once
  setAttributes: (element, attributes) => {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  },
  
  // Add class with animation support
  addClass: (element, className, delay = 0) => {
    if (delay > 0) {
      setTimeout(() => {
        element.classList.add(className);
      }, delay);
    } else {
      element.classList.add(className);
    }
  },
  
  // Remove class with animation support
  removeClass: (element, className, delay = 0) => {
    if (delay > 0) {
      setTimeout(() => {
        element.classList.remove(className);
      }, delay);
    } else {
      element.classList.remove(className);
    }
  },
  
  // Toggle class
  toggleClass: (element, className) => {
    element.classList.toggle(className);
  },
  
  // Set CSS custom properties
  setCSSProperty: (element, property, value) => {
    element.style.setProperty(property, value);
  },
  
  // Get viewport dimensions
  getViewport: () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  
  // Check if element is in viewport
  isInViewport: (element, threshold = 0) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < windowHeight * (1 - threshold);
  }
};

// Export for global use
window.DOMHelpers = DOMHelpers;