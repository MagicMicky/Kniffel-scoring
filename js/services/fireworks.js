/**
 * Fireworks Animation Service
 */

import { S } from '../state.js';

/**
 * Show simple fireworks celebration (using image)
 */
export function showFireworks() {
  const container = document.getElementById('fireworks-container');
  if (!container) return;

  container.classList.add('active');

  const fireworkCount = 5;
  const fireworks = [];

  for (let i = 0; i < fireworkCount; i++) {
    const firework = document.createElement('div');
    firework.className = 'firework';

    const left = Math.random() * 80 + 10;
    const top = Math.random() * 70 + 10;

    firework.style.left = left + '%';
    firework.style.top = top + '%';
    firework.style.animationDelay = (i * 0.15) + 's';

    container.appendChild(firework);
    fireworks.push(firework);
  }

  setTimeout(() => {
    fireworks.forEach(fw => fw.remove());
    container.classList.remove('active');
  }, 2000);
}

/**
 * Start canvas-based fireworks animation for end screen
 */
export function startFireworksCanvas() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 100;
  const gravity = 0.05;
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce', '#85c1e2', '#ff8b94'];

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.015;
      this.size = Math.random() * 3 + 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += gravity;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.5 + 50;
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(x, y, color));
    }
  }

  function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();

      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    if (S.view === 'endScreen') {
      requestAnimationFrame(animate);
    }
  }

  // Create initial fireworks
  for (let i = 0; i < 5; i++) {
    setTimeout(() => createFirework(), i * 200);
  }

  // Continue creating fireworks periodically
  const interval = setInterval(() => {
    if (S.view === 'endScreen') {
      createFirework();
    } else {
      clearInterval(interval);
    }
  }, 800);

  animate();
}
