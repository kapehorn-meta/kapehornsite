// ===== Logo Drop Shadow Animation =====

class LogoEffects {
  constructor() {
    this.isRunning = false;
    this.animationId = null;
    this.time = 0;
  }
  
  init() {
    this.logo = DOMHelpers.selectByData('ci-logo');
    if (!this.logo) return;
    
    this.start();
  }
  
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunning = false;
  }
  
  animate() {
    if (!this.isRunning || !this.logo) return;
    
    // Performance optimization: skip frames if tab is not visible
    if (document.hidden) {
      this.animationId = requestAnimationFrame(() => this.animate());
      return;
    }
    
    this.time += 0.005;
    
    // Calculate pulsing alpha (0.7 to 1.0)
    const alpha = 0.7 + 0.3 * Math.sin(this.time);
    
    // Apply animated drop shadow
    this.logo.style.filter = `drop-shadow(0 0 12px rgba(169,160,212,${alpha})) drop-shadow(0 0 64px rgba(236,234,247,${alpha}))`;
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    this.stop();
  }
}

// Export for global use
window.LogoEffects = LogoEffects;