// ===== Animation Utility Functions =====

const AnimationUtils = {
  // Easing functions
  easing: {
    // easeInOutQuint for smooth motion curves
    inOutQuint: (t) => t < 0.5
      ? 16 * t * t * t * t * t
      : 1 + 16 * (--t) * t * t * t * t,
    
    // easeInOutCubic for smooth scrolling
    inOutCubic: (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    }
  },
  
  // Color interpolation for gradients
  interpolateColor: (color1, color2, progress) => {
    return {
      r: color1.r + (color2.r - color1.r) * progress,
      g: color1.g + (color2.g - color1.g) * progress,
      b: color1.b + (color2.b - color1.b) * progress
    };
  },
  
  // Create RGBA string from color object
  createRGBA: (color, alpha) => {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
  },
  
  // Animation frame management
  frameManager: {
    ids: [],
    timeouts: [],
    
    add: (id) => {
      AnimationUtils.frameManager.ids.push(id);
    },
    
    addTimeout: (id) => {
      AnimationUtils.frameManager.timeouts.push(id);
    },
    
    clear: () => {
      AnimationUtils.frameManager.ids.forEach(id => cancelAnimationFrame(id));
      AnimationUtils.frameManager.timeouts.forEach(id => clearTimeout(id));
      AnimationUtils.frameManager.ids = [];
      AnimationUtils.frameManager.timeouts = [];
    }
  },
  
  // Smooth scroll animation
  smoothScrollTo: (targetPosition, duration = 1000) => {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, targetPosition);
      return;
    }
    
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let start = null;
    
    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = AnimationUtils.easing.inOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    
    requestAnimationFrame(animation);
  }
};

// Export for global use
window.AnimationUtils = AnimationUtils;