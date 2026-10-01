/**
 * MINAMO Inc. - Interactive Water Ripple Canvas
 * Draws subtle, elegant concentric ripple rings interacting with mouse & ambient motion.
 */

(function () {
  const canvas = document.getElementById('hero-ripple-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let ripples = [];
  let mouse = { x: null, y: null };
  let lastSpawn = 0;

  function resize() {
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  class Ripple {
    constructor(x, y, maxRadius = 260, color = 'rgba(52, 198, 217, 0.4)') {
      this.x = x;
      this.y = y;
      this.radius = 0;
      this.maxRadius = maxRadius;
      this.speed = 1.6 + Math.random() * 0.8;
      this.opacity = 0.65;
      this.color = color;
      this.rings = [0, -18, -36]; // 3 concentric ripples like the MINAMO motif!
    }

    update() {
      this.radius += this.speed;
      this.opacity = Math.max(0, 1 - (this.radius / this.maxRadius));
    }

    draw(ctx) {
      if (this.opacity <= 0) return;

      this.rings.forEach((offset, idx) => {
        const currentR = this.radius + offset;
        if (currentR > 0) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, currentR, 0, Math.PI * 2);
          
          const alpha = this.opacity * (1 - idx * 0.25);
          ctx.strokeStyle = idx === 0 
            ? `rgba(52, 198, 217, ${alpha * 0.7})` 
            : `rgba(26, 91, 216, ${alpha * 0.4})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });
    }

    isDead() {
      return this.radius >= this.maxRadius || this.opacity <= 0;
    }
  }

  function addRipple(x, y, maxR) {
    if (ripples.length > 12) ripples.shift();
    ripples.push(new Ripple(x, y, maxR));
  }

  // Ambient spontaneous ripples
  function spawnAmbientRipple() {
    const x = Math.random() * width;
    const y = Math.random() * height;
    addRipple(x, y, 220 + Math.random() * 100);
  }

  // Mouse interaction
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      const now = Date.now();
      if (now - lastSpawn > 220) {
        addRipple(e.clientX - rect.left, e.clientY - rect.top, 180);
        lastSpawn = now;
      }
    }
  });

  window.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      addRipple(e.clientX - rect.left, e.clientY - rect.top, 320);
    }
  });

  window.addEventListener('resize', resize);
  resize();

  // Initial drops
  setTimeout(() => spawnAmbientRipple(), 400);
  setTimeout(() => spawnAmbientRipple(), 1800);

  let ambientTimer = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    ambientTimer++;
    if (ambientTimer > 180) { // roughly every 3s
      spawnAmbientRipple();
      ambientTimer = 0;
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].draw(ctx);
      if (ripples[i].isDead()) {
        ripples.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
