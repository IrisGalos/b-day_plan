const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createFirework(x, y) {
  const colors = ['#ff4081', '#7c4dff', '#69f0ae', '#ffd740', '#40c4ff'];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x,
      y,
      angle: Math.random() * 2 * Math.PI,
      speed: random(2, 6),
      radius: 2,
      alpha: 1,
      decay: random(0.01, 0.03),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += Math.cos(p.angle) * p.speed;
    p.y += Math.sin(p.angle) * p.speed;
    p.alpha -= p.decay;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function loop() {
  updateParticles();
  drawParticles();
  requestAnimationFrame(loop);
}

// Fire every 1.5 seconds
setInterval(() => {
  const x = random(200, canvas.width - 200);
  const y = random(100, canvas.height / 2);
  createFirework(x, y);
}, 1500);

loop();