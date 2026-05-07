// ── Fireworks engine ──────────────────────────────────────────────────────────
const COLORS = [
  '#2563eb','#60a5fa','#93c5fd','#fbbf24','#f59e0b',
  '#ffffff','#a5f3fc','#34d399','#f472b6','#818cf8'
];

class Particle {
  constructor(x, y, color) {
    this.x = x; this.y = y; this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 1;
    this.alpha  = 1;
    this.decay  = Math.random() * 0.018 + 0.008;
    this.radius = Math.random() * 3 + 1;
    this.gravity = 0.12;
  }
  update() {
    this.x  += this.vx;
    this.y  += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.97;
    this.alpha -= this.decay;
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle   = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Rocket {
  constructor(canvas) {
    this.canvas    = canvas;
    this.x         = canvas.width * (0.1 + Math.random() * 0.8);
    this.y         = canvas.height + 10;
    this.targetY   = canvas.height * (0.08 + Math.random() * 0.45);
    this.speed     = 9 + Math.random() * 5;
    this.exploded  = false;
    this.particles = [];
    this.trail     = [];
    this.c1 = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.c2 = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  update() {
    if (!this.exploded) {
      this.trail.push({ x: this.x, y: this.y, alpha: 0.6 });
      if (this.trail.length > 10) this.trail.shift();
      this.trail.forEach(t => t.alpha -= 0.06);
      this.y -= this.speed;
      if (this.y <= this.targetY) this.explode();
    }
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.alpha > 0.01);
  }
  explode() {
    this.exploded = true;
    for (let i = 0; i < 90; i++) {
      this.particles.push(new Particle(this.x, this.y, i % 2 === 0 ? this.c1 : this.c2));
    }
  }
  draw(ctx) {
    if (!this.exploded) {
      this.trail.forEach(t => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, t.alpha);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    this.particles.forEach(p => p.draw(ctx));
  }
  isDone() { return this.exploded && this.particles.length === 0; }
}

let fwFired = false;

function launchFireworks() {
  if (fwFired) return;
  fwFired = true;

  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  let rockets    = [];
  let launched   = 0;
  const total    = 9;
  let animId;

  const launchOne = () => {
    rockets.push(new Rocket(canvas));
    launched++;
  };

  launchOne();
  const iv = setInterval(() => {
    launchOne();
    if (launched >= total) clearInterval(iv);
  }, 320);

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rockets.forEach(r => { r.update(); r.draw(ctx); });
    rockets = rockets.filter(r => !r.isDone());

    if (rockets.length > 0 || launched < total) {
      animId = requestAnimationFrame(animate);
    } else {
      canvas.style.display = 'none';
      cancelAnimationFrame(animId);
    }
  };
  animate();
}

// Dispara ao carregar a página
window.addEventListener('load', () => {
  setTimeout(launchFireworks, 800);
});
