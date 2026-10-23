/**
 * StudySync AI Educational Suite
 * Synaptic Particle Mesh Canvas (Neural Learning Effect)
 * 
 * An interactive, high-performance HTML5 canvas constellation connecting 
 * academic formulas and neural synaptic nodes with mouse-reactive glowing lines.
 */

class SynapticMeshCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.impulses = [];
    this.mouse = { x: -9999, y: -9999, isHover: false, radius: 220 };
    this.animId = null;
    this.isRunning = true;
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.academicFormulas = [
      '∫ f(x)dx',
      'E = mc²',
      '∇ × B = μ₀J',
      'e^(iπ) + 1 = 0',
      '∑ (1/n²) = π²/6',
      'ħ = h / 2π',
      'O(n log n)',
      'λ = h / p',
      'Δx · Δp ≥ ħ/2',
      'c² = a² + b²',
      'lim x→0 (sin x)/x',
      'H|ψ⟩ = E|ψ⟩',
      'F = dp/dt',
      'f(t) = A·sin(ωt)',
      'S = k·ln(Ω)',
      '∇ · E = ρ / ε₀',
      'd/dx [e^x] = e^x',
      '01101001',
      'A = πr²',
      'Km = (k₋₁ + k₂)/k₁'
    ];

    this.colors = ['#38bdf8', '#818cf8', '#a855f7', '#10b981', '#ec4899'];

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Mouse and Touch Event Tracking (window-level so pointer-events:none canvas still receives coordinates)
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.isHover = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
      this.mouse.isHover = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        this.mouse.isHover = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
      this.mouse.isHover = false;
    });

    // Pause animation when tab is not visible to conserve battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isRunning = false;
        if (this.animId) cancelAnimationFrame(this.animId);
      } else {
        this.isRunning = true;
        this.animate();
      }
    });

    this.spawnParticles();
    this.animate();
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    if (this.particles.length > 0) {
      // Re-boundary particles
      this.particles.forEach(p => {
        if (p.x > this.width) p.x = Math.random() * this.width;
        if (p.y > this.height) p.y = Math.random() * this.height;
      });
    }
  }

  spawnParticles() {
    this.particles = [];
    const isMobile = this.width < 768;
    const formulaCount = isMobile ? 10 : 18;
    const nodeCount = isMobile ? 32 : 55;

    // 1. Spawn Academic Formula Nodes
    for (let i = 0; i < formulaCount; i++) {
      const formula = this.academicFormulas[i % this.academicFormulas.length];
      this.particles.push({
        type: 'formula',
        text: formula,
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        baseAlpha: 0.35 + Math.random() * 0.25,
        alpha: 0.4,
        color: this.colors[i % this.colors.length],
        size: isMobile ? 11 : 13
      });
    }

    // 2. Spawn Neural Synaptic Dot Nodes
    for (let i = 0; i < nodeCount; i++) {
      this.particles.push({
        type: 'node',
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: 1.8 + Math.random() * 2.2,
        baseAlpha: 0.4 + Math.random() * 0.35,
        alpha: 0.5,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const isDark = true; // Permanent dark theme
    const connectionDist = this.width < 768 ? 100 : 130;
    const connectionDistSq = connectionDist * connectionDist;
    const mouseRadiusSq = this.mouse.radius * this.mouse.radius;

    // 1. Update and Render Particles
    const pLen = this.particles.length;

    for (let i = 0; i < pLen; i++) {
      const p = this.particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Soft rebound against window viewport boundaries
      if (p.x < 10) { p.x = 10; p.vx *= -1; }
      else if (p.x > this.width - 10) { p.x = this.width - 10; p.vx *= -1; }

      if (p.y < 10) { p.y = 10; p.vy *= -1; }
      else if (p.y > this.height - 10) { p.y = this.height - 10; p.vy *= -1; }

      // Interaction with mouse cursor
      const dxM = this.mouse.x - p.x;
      const dyM = this.mouse.y - p.y;
      const distSqM = dxM * dxM + dyM * dyM;

      let isNearMouse = false;
      if (this.mouse.isHover && distSqM < mouseRadiusSq) {
        isNearMouse = true;
        const distM = Math.sqrt(distSqM);
        const factor = 1 - (distM / this.mouse.radius);

        // Gentle synaptic gravitational attraction
        p.x += (dxM / distM) * factor * 0.45;
        p.y += (dyM / distM) * factor * 0.45;

        // Neural excitation
        p.alpha = Math.min(1, p.baseAlpha + factor * 0.55);

        // Draw glowing synaptic line from particle to cursor
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);

        const grad = this.ctx.createLinearGradient(p.x, p.y, this.mouse.x, this.mouse.y);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, '#a855f7');

        this.ctx.strokeStyle = grad;
        this.ctx.globalAlpha = factor * 0.65;
        this.ctx.lineWidth = 1.2 + factor * 1.5;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.stroke();
        this.ctx.restore();

        // Occasionally spawn synaptic neural impulse spark toward mouse
        if (Math.random() < 0.04 && this.impulses.length < 25) {
          this.impulses.push({
            startX: p.x,
            startY: p.y,
            endX: this.mouse.x,
            endY: this.mouse.y,
            progress: 0,
            speed: 0.04 + Math.random() * 0.04,
            color: p.color
          });
        }
      } else {
        // Return to natural pulsing alpha
        p.alpha = p.baseAlpha;
      }

      // Draw the particle
      this.ctx.save();
      if (p.type === 'node') {
        p.pulsePhase += 0.03;
        const r = p.radius + Math.sin(p.pulsePhase) * 0.5 + (isNearMouse ? 1.2 : 0);
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha;
        if (isDark) {
          this.ctx.shadowColor = p.color;
          this.ctx.shadowBlur = isNearMouse ? 12 : 6;
        }
        this.ctx.fill();
      } else if (p.type === 'formula') {
        this.ctx.font = `600 ${p.size}px "JetBrains Mono", monospace`;
        this.ctx.fillStyle = isDark ? p.color : '#475569';
        this.ctx.globalAlpha = p.alpha;
        if (isDark && isNearMouse) {
          this.ctx.shadowColor = p.color;
          this.ctx.shadowBlur = 10;
        }
        this.ctx.fillText(p.text, p.x, p.y);
      }
      this.ctx.restore();

      // 2. Inter-Particle Synaptic Connections
      for (let j = i + 1; j < pLen; j++) {
        const p2 = this.particles[j];
        const dx = p2.x - p.x;
        const dy = p2.y - p.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < connectionDistSq) {
          const dist = Math.sqrt(distSq);
          const connFactor = 1 - (dist / connectionDist);

          // Boost line intensity if either particle is stimulated by mouse
          const energized = isNearMouse || (this.mouse.isHover && (
            (this.mouse.x - p2.x) * (this.mouse.x - p2.x) + 
            (this.mouse.y - p2.y) * (this.mouse.y - p2.y) < mouseRadiusSq
          ));

          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);

          if (isDark) {
            this.ctx.strokeStyle = energized ? '#38bdf8' : 'rgba(129, 140, 248, 0.45)';
            this.ctx.globalAlpha = energized ? connFactor * 0.55 : connFactor * 0.22;
            this.ctx.lineWidth = energized ? 1.4 : 0.8;
            if (energized) {
              this.ctx.shadowColor = '#38bdf8';
              this.ctx.shadowBlur = 6;
            }
          } else {
            this.ctx.strokeStyle = '#6366f1';
            this.ctx.globalAlpha = connFactor * 0.18;
            this.ctx.lineWidth = 0.8;
          }

          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }

    // 3. Render and Update Synaptic Impulses (Moving sparks along active neural connections)
    for (let k = this.impulses.length - 1; k >= 0; k--) {
      const imp = this.impulses[k];
      imp.progress += imp.speed;

      if (imp.progress >= 1) {
        this.impulses.splice(k, 1);
        continue;
      }

      const currX = imp.startX + (imp.endX - imp.startX) * imp.progress;
      const currY = imp.startY + (imp.endY - imp.startY) * imp.progress;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(currX, currY, 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = imp.color;
      this.ctx.shadowBlur = 10;
      this.ctx.globalAlpha = Math.sin(imp.progress * Math.PI);
      this.ctx.fill();
      this.ctx.restore();
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }
}

// Instantiate once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.synapticMesh = new SynapticMeshCanvas('synaptic-canvas');
});
