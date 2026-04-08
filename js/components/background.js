/**
 * Animated canvas background — floating particles with connection lines
 */
(() => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, raf;
  const PARTICLE_COUNT = 60;
  const MAX_DISTANCE = 140;
  const SPEED = 0.3;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * SPEED;
      this.vy = (Math.random() - 0.5) * SPEED;
      this.radius = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--color-primary-rgb').trim()}, ${this.opacity})`;
      ctx.fill();
    }
  }

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    if (particles) particles.forEach(p => { if (p.x > W) p.x = W; if (p.y > H) p.y = H; });
  };

  const init = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  };

  const getPrimaryRgb = () => {
    try {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary-rgb').trim() || '99, 102, 241';
    } catch {
      return '99, 102, 241';
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, W, H);

    const rgb = getPrimaryRgb();

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DISTANCE) {
          const alpha = (1 - dist / MAX_DISTANCE) * 0.12;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    raf = requestAnimationFrame(animate);
  };

  init();
  animate();

  window.addEventListener('resize', UI.debounce(resize, 200));
})();
