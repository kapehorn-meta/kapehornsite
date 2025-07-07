// ===== Performance Monitoring Utility =====

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameCount: 0,
      lastTime: performance.now(),
      animationFrames: new Set()
    };
    this.isMonitoring = false;
  }
  
  init() {
    // Monitor performance only in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      this.startMonitoring();
    }
    
    // Add visibility change listener for performance optimization
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Add reduced motion detection
    this.setupReducedMotionDetection();
  }
  
  startMonitoring() {
    this.isMonitoring = true;
    this.monitorFPS();
  }
  
  monitorFPS() {
    if (!this.isMonitoring) return;
    
    const now = performance.now();
    this.metrics.frameCount++;
    
    if (now >= this.metrics.lastTime + 1000) {
      this.metrics.fps = Math.round((this.metrics.frameCount * 1000) / (now - this.metrics.lastTime));
      this.metrics.frameCount = 0;
      this.metrics.lastTime = now;
      
      // Log performance warnings
      if (this.metrics.fps < 30) {
        console.warn(`Low FPS detected: ${this.metrics.fps}fps`);
      }
    }
    
    requestAnimationFrame(() => this.monitorFPS());
  }
  
  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, pause non-essential animations
      this.pauseAnimations();
    } else {
      // Page is visible, resume animations
      this.resumeAnimations();
    }
  }
  
  pauseAnimations() {
    // Notify all animation components to pause
    if (window.kapehornApp && window.kapehornApp.components) {
      const { gradientBg, logoEffects } = window.kapehornApp.components;
      if (gradientBg && typeof gradientBg.pause === 'function') {
        gradientBg.pause();
      }
      if (logoEffects && typeof logoEffects.pause === 'function') {
        logoEffects.pause();
      }
    }
  }
  
  resumeAnimations() {
    // Notify all animation components to resume
    if (window.kapehornApp && window.kapehornApp.components) {
      const { gradientBg, logoEffects } = window.kapehornApp.components;
      if (gradientBg && typeof gradientBg.resume === 'function') {
        gradientBg.resume();
      }
      if (logoEffects && typeof logoEffects.resume === 'function') {
        logoEffects.resume();
      }
    }
  }
  
  setupReducedMotionDetection() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotion = (e) => {
      if (e.matches) {
        // User prefers reduced motion
        this.disableAnimations();
      } else {
        // User is okay with animations
        this.enableAnimations();
      }
    };
    
    // Check initial state
    handleReducedMotion(mediaQuery);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleReducedMotion);
  }
  
  disableAnimations() {
    document.body.classList.add('reduce-motion');
    
    // Disable complex animations
    if (window.kapehornApp && window.kapehornApp.components) {
      const { gradientBg, logoEffects, ciMotion } = window.kapehornApp.components;
      if (gradientBg) gradientBg.stop();
      if (logoEffects) logoEffects.stop();
      if (ciMotion) ciMotion.destroy();
    }
  }
  
  enableAnimations() {
    document.body.classList.remove('reduce-motion');
  }
  
  // Utility method to debounce resize events
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Memory usage monitoring
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  }
  
  destroy() {
    this.isMonitoring = false;
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}

// Export for global use
window.PerformanceMonitor = PerformanceMonitor;