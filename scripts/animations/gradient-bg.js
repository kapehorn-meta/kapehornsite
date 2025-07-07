// ===== Gradient Background Animation =====

class GradientBackground {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.time = 0;
    this.isRunning = false;
  }
  
  init() {
    this.canvas = DOMHelpers.selectByData('gradient-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.setupCanvas();
    this.bindEvents();
    this.start();
  }
  
  setupCanvas() {
    this.resizeCanvas();
  }
  
  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  bindEvents() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
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
    if (!this.isRunning) return;
    
    // Performance optimization: skip frames if tab is not visible
    if (document.hidden) {
      this.animationId = requestAnimationFrame(() => this.animate());
      return;
    }
    
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Increment time for smooth animation
    this.time += CONSTANTS.ANIMATION.GRADIENT_SPEED;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Draw gradient layers
    this.drawGradientLayers(width, height);
    
    // Continue animation
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  drawGradientLayers(width, height) {
    const layers = CONSTANTS.GRADIENT_LAYERS;
    const colors = CONSTANTS.GRADIENT_COLORS;
    
    layers.forEach((layer, index) => {
      const layerTime = this.time * (0.5 + index * 0.3);
      const centerX = width * (layer.baseX + Math.sin(layerTime * 0.5 + index) * layer.moveX);
      const centerY = height * (layer.baseY + Math.cos(layerTime * 0.3 + index) * layer.moveY);
      const radius = Math.min(width, height) * (layer.baseRadius + Math.sin(layerTime * 0.4 + index) * layer.moveRadius);
      
      // Create radial gradient
      const gradient = this.ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      
      // Calculate dynamic colors
      const colorSpeed = 0.04 + index * 0.02;
      const colorIndex = (layerTime * colorSpeed) % colors.length;
      const nextColorIndex = (colorIndex + 1) % colors.length;
      const colorProgress = (layerTime * colorSpeed) % 1;
      
      const currentColor = colors[Math.floor(colorIndex)];
      const nextColor = colors[Math.floor(nextColorIndex)];
      
      // Interpolate colors
      const color1 = AnimationUtils.interpolateColor(currentColor, nextColor, colorProgress);
      const color2 = AnimationUtils.interpolateColor(
        nextColor, 
        colors[(Math.floor(nextColorIndex) + 1) % colors.length], 
        colorProgress
      );
      
      // Add gradient stops
      this.addGradientStops(gradient, color1, color2, layer.opacity);
      
      // Fill canvas
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, width, height);
    });
  }
  
  addGradientStops(gradient, color1, color2, opacity) {
    gradient.addColorStop(0, AnimationUtils.createRGBA(color1, opacity));
    gradient.addColorStop(0.15, AnimationUtils.createRGBA({
      r: color1.r * 0.8 + color2.r * 0.2,
      g: color1.g * 0.8 + color2.g * 0.2,
      b: color1.b * 0.8 + color2.b * 0.2
    }, opacity * 0.9));
    gradient.addColorStop(0.3, AnimationUtils.createRGBA(color2, opacity * 0.7));
    gradient.addColorStop(0.45, AnimationUtils.createRGBA({
      r: color2.r * 0.8 + color1.r * 0.2,
      g: color2.g * 0.8 + color1.g * 0.2,
      b: color2.b * 0.8 + color1.b * 0.2
    }, opacity * 0.6));
    gradient.addColorStop(0.6, AnimationUtils.createRGBA(color1, opacity * 0.5));
    gradient.addColorStop(0.75, AnimationUtils.createRGBA({
      r: color1.r * 0.6 + color2.r * 0.4,
      g: color1.g * 0.6 + color2.g * 0.4,
      b: color1.b * 0.6 + color2.b * 0.4
    }, opacity * 0.3));
    gradient.addColorStop(0.9, AnimationUtils.createRGBA({
      r: color2.r * 0.3 + color1.r * 0.7,
      g: color2.g * 0.3 + color1.g * 0.7,
      b: color2.b * 0.3 + color1.b * 0.7
    }, opacity * 0.1));
    gradient.addColorStop(1, AnimationUtils.createRGBA(color2, 0));
  }
  
  destroy() {
    this.stop();
    window.removeEventListener('resize', this.resizeCanvas);
  }
}

// Export for global use
window.GradientBackground = GradientBackground;