// ===== CI Motion Animation Sequence =====

export class CIMotion {
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
    const heroContent = document.querySelector('[data-hero-content]');
    if (heroContent) {
      heroContent.style.opacity = 0;
    }
    
    // Start animation sequence
    this.animateMountain();
  }
  
  setupSVG() {
    const svg = document.querySelector('[data-ci-svg]');
    if (!svg) return;
    
    const svgW = window.innerWidth;
    const svgH = window.innerHeight;
    
    svg.setAttribute('width', svgW);
    svg.setAttribute('height', svgH);
    svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`);
    
    // Setup defs for gradients and masks
    this.setupGradientMask(svg, svgW, svgH);
  }
  
  setupGradientMask(svg, svgW, svgH) {
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.prepend(defs);
    }
    
    // Remove existing gradient and mask
    const existingGrad = svg.querySelector('#mountain-grad');
    const existingMask = svg.querySelector('#mountain-grad-mask');
    if (existingGrad) existingGrad.remove();
    if (existingMask) existingMask.remove();
    
    // Create linear gradient
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', 'mountain-grad');
    grad.setAttribute('x1', '0');
    grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '0');
    grad.setAttribute('y2', '1');
    grad.setAttribute('gradientUnits', 'objectBoundingBox');
    
    // Add gradient stops
    const stops = [
      { offset: '0%', color: 'white', opacity: '1' },
      { offset: '85%', color: 'white', opacity: '1' },
      { offset: '100%', color: 'white', opacity: '0' }
    ];
    
    stops.forEach(stop => {
      const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stopElement.setAttribute('offset', stop.offset);
      stopElement.setAttribute('stop-color', stop.color);
      stopElement.setAttribute('stop-opacity', stop.opacity);
      grad.appendChild(stopElement);
    });
    
    defs.appendChild(grad);
    
    // Create mask
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    mask.setAttribute('id', 'mountain-grad-mask');
    const maskRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    maskRect.setAttribute('x', 0);
    maskRect.setAttribute('y', 0);
    maskRect.setAttribute('width', svgW);
    maskRect.setAttribute('height', svgH);
    maskRect.setAttribute('fill', 'url(#mountain-grad)');
    
    mask.appendChild(maskRect);
    defs.appendChild(mask);
  }
  
  setupMountain() {
    const mountain = document.querySelector('[data-mountain]');
    if (!mountain) return;
    
    const svgW = window.innerWidth;
    const svgH = window.innerHeight;
    const centerX = svgW / 2;
    const centerY = svgH / 2;
    
    const mountainW = 1065;
    const mountainH = 65;
    
    // Adjust mountain scale for mobile
    const isMobile = svgW <= 600;
    const widthFactor = isMobile ? 0.8 : 0.7;
    const heightFactor = isMobile ? 0.15 : 0.18;
    const scale = 2 * Math.min(svgW * widthFactor / mountainW, svgH * heightFactor / mountainH);
    
    const offsetX = centerX - (mountainW * scale) / 2;
    const offsetY = centerY - (mountainH * scale) / 2 - (isMobile ? svgH * 0.05 : svgH * 0.1);
    
    const mountainPath = `M538.988 0.968806C541.624 1.13408 549.198 7.22309 552.327 11.0079C555.456 14.7928 555.95 19.5645 557.926 19.5645C559.902 19.5645 560.561 18.0841 561.22 17.4258C561.878 16.7679 562.207 22.6915 563.689 22.6915C565.172 22.6914 566.654 19.5645 569.124 19.5645C571.594 19.5649 571.429 24.8306 572.911 24.8311C574.393 24.8311 575.382 22.1981 578.017 24.8311C580.651 27.4642 578.84 31.7427 581.475 32.8946C584.109 34.0465 589.215 34.8694 592.179 32.8946C595.143 30.92 596.296 35.8569 597.119 36.6797C597.943 37.5023 599.425 36.6798 602.718 36.6797C606.011 36.6797 617.539 50.1741 625.114 48.1993C632.689 46.2245 630.384 44.5791 640.429 52.9717C650.473 61.3639 658.707 59.39 660.025 59.3897C660.72 59.3897 662.025 59.9627 663.148 60.5411C846.143 62.3827 1037.69 64.9834 1064.53 64.9835H0.177734C136.099 64.9833 276.15 64.6105 314.611 60.0147C322.601 59.0601 356.917 58.709 406.828 58.754C409.965 57.8571 414.107 56.938 419.268 56.2628C433.101 54.4525 458.461 50.6681 466.859 50.0098C475.258 49.3516 476.74 48.0348 478.716 46.2247C480.692 44.4144 485.138 42.1105 486.785 41.4522C488.432 40.7938 493.866 33.5531 494.689 30.92C495.513 28.2874 498.805 24.9968 499.465 24.8311C500.124 24.6666 498.971 23.5143 502.1 22.6915C505.228 21.8686 508.358 21.2102 510.005 19.5645C511.651 17.9188 512.145 13.9702 514.121 12.9825C516.097 11.9951 526.801 11.9946 529.271 8.04498C531.742 4.09542 536.353 0.804241 538.988 0.968806Z`;
    
    mountain.setAttribute('d', mountainPath);
    mountain.setAttribute('transform', `translate(${offsetX},${offsetY}) scale(${scale})`);
    mountain.setAttribute('mask', 'url(#mountain-grad-mask)');
    mountain.removeAttribute('filter');
    mountain.style.opacity = 0;
  }
  
  setupLines() {
    const linesGroup = document.querySelector('[data-lines-group]');
    if (!linesGroup) return;
    
    linesGroup.innerHTML = '';
    
    const svgW = window.innerWidth;
    const svgH = window.innerHeight;
    const centerX = svgW / 2;
    const centerY = svgH / 2;
    
    const mountainW = 1065;
    const mountainH = 65;
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
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      line.setAttribute('x', left);
      line.setAttribute('y', y - thickness / 2);
      line.setAttribute('width', right - left);
      line.setAttribute('height', thickness);
      line.setAttribute('fill', 'white');
      
      line.style.opacity = 0;
      linesGroup.appendChild(line);
      
      this.lines.push(line);
      this.lineParams.push({ y, thickness, halfWidth });
    }
  }
  
  setupLogo() {
    const logoImg = document.querySelector('[data-ci-logo]');
    if (!logoImg) return;
    
    const logoW = 173.93;
    const logoH = 92.09;
    const logoScale = 2;
    logoImg.style.width = (logoW * logoScale) + 'px';
    logoImg.style.height = (logoH * logoScale) + 'px';
  }
  
  animateMountain() {
    const mountain = document.querySelector('[data-mountain]');
    if (!mountain) return;
    
    const timeoutId = setTimeout(() => {
      mountain.style.transition = 'opacity 0.7s';
      mountain.style.opacity = 1;
      
      this.animateLines();
    }, 400);
    
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
        const timeoutId = setTimeout(showLine, 180);
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
      
      line.setAttribute('x', left);
      line.setAttribute('width', right - left);
      
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
    }, 500);
    
    this.timeoutIds.push(timeoutId);
  }
  
  fadeOutAndShowLogo() {
    const fadeDuration = 1000;
    const start = performance.now();
    
    const animate = (ts) => {
      const progress = Math.min((ts - start) / fadeDuration, 1);
      const curved = this.easeInOutQuint(progress);
      
      // Fade out mountain and lines
      const fadeOutOpacity = 1 - curved;
      const mountainGroup = document.querySelector('[data-mountain-group]');
      const linesGroup = document.querySelector('[data-lines-group]');
      const glowGroup = document.querySelector('[data-glow-group]');
      
      if (mountainGroup) mountainGroup.style.opacity = fadeOutOpacity;
      if (linesGroup) linesGroup.style.opacity = fadeOutOpacity;
      if (glowGroup) glowGroup.style.opacity = fadeOutOpacity;
      
      // Fade in logo
      const logoWrap = document.querySelector('[data-ci-logo-wrap]');
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
  
  easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
  }
  
  showHeroContent() {
    const timeoutId = setTimeout(() => {
      const heroContent = document.querySelector('[data-hero-content]');
      if (heroContent) {
        heroContent.style.transition = 'opacity 1s';
        heroContent.style.opacity = 1;
      }
      
      this.isRunning = false;
      
      // Show navbar after CI motion completes
      setTimeout(() => {
        const navbar = document.querySelector('[data-navbar]');
        if (navbar) {
          navbar.classList.add('show');
          window.navbarInitialized = true;
        }
      }, 300);
      
    }, 500);
    
    this.timeoutIds.push(timeoutId);
  }
  
  destroy() {
    this.clear();
    this.isRunning = false;
  }
}