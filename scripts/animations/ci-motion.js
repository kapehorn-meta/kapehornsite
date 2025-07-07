// ===== CI Motion Animation Sequence =====

class CIMotion {
  constructor() {
    this.isRunning = false;
    this.frameIds = [];
    this.timeoutIds = [];
  }
  
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clear();
    this.runSequence();
  }
  
  clear() {
    this.frameIds.forEach(id => cancelAnimationFrame(id));
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.frameIds = [];
    this.timeoutIds = [];
  }
  
  runSequence() {
    // Setup SVG and elements
    this.setupSVG();
    this.setupMountain();
    this.setupLines();
    this.setupLogo();
    
    // Hide hero content initially
    const heroContent = DOMHelpers.selectByData('hero-content');
    if (heroContent) {
      heroContent.style.opacity = 0;
    }
    
    // Start animation sequence
    this.animateMountain();
  }
  
  setupSVG() {
    const svg = DOMHelpers.selectByData('ci-svg');
    if (!svg) return;
    
    const svgW = window.innerWidth;
    const svgH = window.innerHeight;
    
    DOMHelpers.setAttributes(svg, {
      width: svgW,
      height: svgH,
      viewBox: `0 0 ${svgW} ${svgH}`
    });
    
    // Setup defs for gradients and masks
    this.setupGradientMask(svg, svgW, svgH);
  }
  
  setupGradientMask(svg, svgW, svgH) {
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = DOMHelpers.createSVGElement('defs');
      svg.prepend(defs);
    }
    
    // Remove existing gradient and mask
    const existingGrad = svg.querySelector('#mountain-grad');
    const existingMask = svg.querySelector('#mountain-grad-mask');
    if (existingGrad) existingGrad.remove();
    if (existingMask) existingMask.remove();
    
    // Create linear gradient
    const grad = DOMHelpers.createSVGElement('linearGradient', {
      id: 'mountain-grad',
      x1: '0',
      y1: '0',
      x2: '0',
      y2: '1',
      gradientUnits: 'objectBoundingBox'
    });
    
    // Add gradient stops
    const stops = [
      { offset: '0%', color: 'white', opacity: '1' },
      { offset: '85%', color: 'white', opacity: '1' },
      { offset: '100%', color: 'white', opacity: '0' }
    ];
    
    stops.forEach(stop => {
      const stopElement = DOMHelpers.createSVGElement('stop', {
        offset: stop.offset,
        'stop-color': stop.color,
        'stop-opacity': stop.opacity
      });
      grad.appendChild(stopElement);
    });
    
    defs.appendChild(grad);
    
    // Create mask
    const mask = DOMHelpers.createSVGElement('mask', { id: 'mountain-grad-mask' });
    const maskRect = DOMHelpers.createSVGElement('rect', {
      x: 0,
      y: 0,
      width: svgW,
      height: svgH,
      fill: 'url(#mountain-grad)'
    });
    
    mask.appendChild(maskRect);
    defs.appendChild(mask);
  }
  
  setupMountain() {
    const mountain = DOMHelpers.selectByData('mountain');
    if (!mountain) return;
    
    const svgW = window.innerWidth;
    const svgH = window.innerHeight;
    const centerX = svgW / 2;
    const centerY = svgH / 2;
    
    const { WIDTH: mountainW, HEIGHT: mountainH } = CONSTANTS.MOUNTAIN_DIMENSIONS;
    
    // Adjust mountain scale for mobile
    const isMobile = svgW <= 600;
    const widthFactor = isMobile ? 0.8 : 0.7;
    const heightFactor = isMobile ? 0.15 : 0.18;
    const scale = 2 * Math.min(svgW * widthFactor / mountainW, svgH * heightFactor / mountainH);
    
    const offsetX = centerX - (mountainW * scale) / 2;
    const offsetY = centerY - (mountainH * scale) / 2 - (isMobile ? svgH * 0.05 : svgH * 0.1);
    
    DOMHelpers.setAttributes(mountain, {
      d: CONSTANTS.MOUNTAIN_PATH,
      transform: `translate(${offsetX},${offsetY}) scale(${scale})`,
      mask: 'url(#mountain-grad-mask)'
    });
    
    mountain.removeAttribute('filter');
    mountain.style.opacity = 0;
  }
  
  setupLines() {
    const linesGroup = DOMHelpers.selectByData('lines-group');
    if (!linesGroup) return;
    
    linesGroup.innerHTML = '';
    
    const svgW = window.innerWidth;
    const svgH = window.innerHeight;
    const centerX = svgW / 2;
    const centerY = svgH / 2;
    
    const { WIDTH: mountainW, HEIGHT: mountainH } = CONSTANTS.MOUNTAIN_DIMENSIONS;
    const scale = 2 * Math.min(svgW * 0.7 / mountainW, svgH * 0.18 / mountainH);
    
    // Adjust baseY for mobile screens
    const isMobile = svgW <= 600;
    const baseYOffset = isMobile ? svgH * 0.05 : svgH * 0.1;
    const baseY = centerY + (mountainH * scale) / 2 + scale * 8 - baseYOffset;
    const lineCount = 7;
    
    this.lines = [];
    this.lineParams = [];
    
    for (let i = 0; i < lineCount; i++) {
      // Adjust line spacing and thickness for mobile
      const lineSpacing = isMobile ? scale * 28 / 2.5 : scale * 38 / 2.5;
      const y = baseY + i * lineSpacing;
      
      // Ensure lines stay within viewport
      if (y > svgH - 20) break;
      
      const thickness = i === 0 ? scale * 1.5 : scale * (1 + i * 4.5) / 3.5;
      
      // Adjust line width for mobile
      const widthFactor = isMobile ? 0.4 : 0.35;
      const widthReduction = isMobile ? scale * 12 / 2.5 : scale * 18 / 2.5;
      const halfWidth = svgW * widthFactor - i * widthReduction;
      const left = centerX - halfWidth;
      const right = centerX + halfWidth;
      
      // Skip lines that would be too narrow
      if (halfWidth < scale * 10) continue;
      
      const line = DOMHelpers.createSVGElement('rect', {
        x: left,
        y: y - thickness / 2,
        width: right - left,
        height: thickness,
        fill: 'white'
      });
      
      line.style.opacity = 0;
      linesGroup.appendChild(line);
      
      this.lines.push(line);
      this.lineParams.push({ y, thickness, halfWidth });
    }
  }
  
  setupLogo() {
    const logoImg = DOMHelpers.selectByData('ci-logo');
    if (!logoImg) return;
    
    const { WIDTH: logoW, HEIGHT: logoH, SCALE: logoScale } = CONSTANTS.LOGO_DIMENSIONS;
    logoImg.style.width = (logoW * logoScale) + 'px';
    logoImg.style.height = (logoH * logoScale) + 'px';
  }
  
  animateMountain() {
    const mountain = DOMHelpers.selectByData('mountain');
    if (!mountain) return;
    
    const timeoutId = setTimeout(() => {
      mountain.style.transition = 'opacity 0.7s';
      mountain.style.opacity = 1;
      
      this.animateLines();
    }, CONSTANTS.ANIMATION.CI_MOTION_DELAYS.MOUNTAIN_APPEAR);
    
    this.timeoutIds.push(timeoutId);
  }
  
  animateLines() {
    let idx = 0;
    const svgW = window.innerWidth;
    const centerX = svgW / 2;
    
    const showLine = () => {
      if (idx < this.lines.length) {
        const line = this.lines[idx];
        const params = this.lineParams[idx];
        
        line.style.transition = 'opacity 0.5s';
        line.style.opacity = 1;
        
        // Animate line expansion
        this.animateLineExpansion(line, params, centerX, svgW);
        
        idx++;
        const timeoutId = setTimeout(showLine, CONSTANTS.ANIMATION.CI_MOTION_DELAYS.LINE_INTERVAL);
        this.timeoutIds.push(timeoutId);
      } else {
        this.finishLinesAnimation();
      }
    };
    
    showLine();
  }
  
  animateLineExpansion(line, params, centerX, svgW) {
    const duration = 700;
    const startHalfWidth = params.halfWidth;
    const endHalfWidth = svgW / 2;
    let start = null;
    
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const halfWidth = startHalfWidth + (endHalfWidth - startHalfWidth) * progress;
      const left = centerX - halfWidth;
      const right = centerX + halfWidth;
      
      DOMHelpers.setAttributes(line, {
        x: left,
        width: right - left
      });
      
      if (progress < 1) {
        const frameId = requestAnimationFrame(animate);
        this.frameIds.push(frameId);
      }
    };
    
    const frameId = requestAnimationFrame(animate);
    this.frameIds.push(frameId);
  }
  
  finishLinesAnimation() {
    const timeoutId = setTimeout(() => {
      this.fadeOutAndShowLogo();
    }, CONSTANTS.ANIMATION.CI_MOTION_DELAYS.FADE_TRANSITION);
    
    this.timeoutIds.push(timeoutId);
  }
  
  fadeOutAndShowLogo() {
    const fadeDuration = CONSTANTS.ANIMATION.FADE_DURATION;
    const start = performance.now();
    
    const animate = (ts) => {
      const progress = Math.min((ts - start) / fadeDuration, 1);
      const curved = AnimationUtils.easing.inOutQuint(progress);
      
      // Fade out mountain and lines
      const fadeOutOpacity = 1 - curved;
      const mountainGroup = DOMHelpers.selectByData('mountain-group');
      const linesGroup = DOMHelpers.selectByData('lines-group');
      const glowGroup = DOMHelpers.selectByData('glow-group');
      
      if (mountainGroup) mountainGroup.style.opacity = fadeOutOpacity;
      if (linesGroup) linesGroup.style.opacity = fadeOutOpacity;
      if (glowGroup) glowGroup.style.opacity = fadeOutOpacity;
      
      // Fade in logo
      const logoWrap = DOMHelpers.selectByData('ci-logo-wrap');
      if (logoWrap) logoWrap.style.opacity = curved;
      
      if (progress < 1) {
        const frameId = requestAnimationFrame(animate);
        this.frameIds.push(frameId);
      } else {
        this.showHeroContent();
      }
    };
    
    const frameId = requestAnimationFrame(animate);
    this.frameIds.push(frameId);
  }
  
  showHeroContent() {
    const timeoutId = setTimeout(() => {
      const heroContent = DOMHelpers.selectByData('hero-content');
      if (heroContent) {
        heroContent.style.transition = 'opacity 1s';
        heroContent.style.opacity = 1;
      }
      
      this.isRunning = false;
      
      // Show navbar after CI motion completes
      setTimeout(() => {
        const navbar = DOMHelpers.selectByData('navbar');
        if (navbar) {
          DOMHelpers.addClass(navbar, 'show');
          window.navbarInitialized = true;
        }
      }, CONSTANTS.ANIMATION.CI_MOTION_DELAYS.NAVBAR_DELAY);
      
    }, CONSTANTS.ANIMATION.CI_MOTION_DELAYS.HERO_TEXT_DELAY);
    
    this.timeoutIds.push(timeoutId);
  }
  
  destroy() {
    this.clear();
    this.isRunning = false;
  }
}

// Export for global use
window.CIMotion = CIMotion;