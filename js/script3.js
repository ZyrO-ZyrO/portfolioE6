/* ============================================================
   PORTFOLIO BTS SIO — Script thème Amber Cosmos
   Curseur custom + traînée de particules + étoiles + reveal
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   1. CURSEUR PERSONNALISÉ avec traînée de particules
══════════════════════════════════════════════════════════ */

// Crée le point central
const curDot  = document.createElement('div');
curDot.className = 'cur-dot';
document.body.appendChild(curDot);

// Crée l'anneau
const curRing = document.createElement('div');
curRing.className = 'cur-ring';
document.body.appendChild(curRing);

// Crée 10 particules de traînée
const TRAIL_COUNT = 10;
const trailDots   = [];

for (let i = 0; i < TRAIL_COUNT; i++) {
  const d = document.createElement('div');
  d.className = 'cur-trail';
  document.body.appendChild(d);
  trailDots.push({ el: d, x: 0, y: 0 });
}

// Position courante de la souris
let mouseX = window.innerWidth  / 2;
let mouseY = window.innerHeight / 2;

// Position lissée de l'anneau
let ringX  = mouseX;
let ringY  = mouseY;

// Historique de positions pour la traînée
const history = Array.from({ length: TRAIL_COUNT * 3 }, () => ({ x: mouseX, y: mouseY }));

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function lerp(a, b, t) { return a + (b - a) * t; }

let frame = 0;
function animateCursor() {
  // Point central — suit instantanément
  curDot.style.left = mouseX + 'px';
  curDot.style.top  = mouseY + 'px';

  // Anneau — suit avec inertie
  ringX = lerp(ringX, mouseX, 0.14);
  ringY = lerp(ringY, mouseY, 0.14);
  curRing.style.left = ringX + 'px';
  curRing.style.top  = ringY + 'px';

  // Historique décalé
  history.unshift({ x: mouseX, y: mouseY });
  if (history.length > TRAIL_COUNT * 3) history.pop();

  // Traînée — chaque point suit une position dans l'historique
  trailDots.forEach((dot, i) => {
    const idx   = Math.min(Math.floor(i * 3) + 3, history.length - 1);
    const pos   = history[idx];
    const scale = 1 - i / TRAIL_COUNT;
    const op    = (1 - i / TRAIL_COUNT) * 0.55;
    const size  = 5 * scale;

    dot.el.style.left    = pos.x + 'px';
    dot.el.style.top     = pos.y + 'px';
    dot.el.style.opacity = op;
    dot.el.style.width   = size + 'px';
    dot.el.style.height  = size + 'px';

    // Dégradé de couleur sur la traînée : amber → orange → rose
    const hue = 270 + i * 2; // violet → violet-rose
    dot.el.style.background = `hsl(${hue}, 85%, 65%)`;
    dot.el.style.boxShadow  = `0 0 ${6 * scale}px hsl(${hue}, 85%, 65%)`;
  });

  frame++;
  requestAnimationFrame(animateCursor);
}

animateCursor();

// Cacher le curseur quand la souris quitte la fenêtre
document.addEventListener('mouseleave', () => {
  curDot.style.opacity  = '0';
  curRing.style.opacity = '0';
  trailDots.forEach(d => { d.el.style.opacity = '0'; });
});

document.addEventListener('mouseenter', () => {
  curDot.style.opacity  = '1';
  curRing.style.opacity = '1';
});

/* ══════════════════════════════════════════════════════════
   2. FOND ÉTOILÉ — Canvas avec teinte chaude
══════════════════════════════════════════════════════════ */
const canvas = document.getElementById('stars-canvas');
const ctx    = canvas.getContext('2d');
let stars    = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  const count = Math.floor((canvas.width * canvas.height) / 7500);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    // Vitesse variable : petites étoiles bougent plus lentement
    const r     = Math.random() * 1.5 + 0.2;
    const spd   = (0.08 + Math.random() * 0.18) * (0.4 + r * 0.3);
    stars.push({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r,
      vx:      Math.cos(angle) * spd,
      vy:      Math.sin(angle) * spd,
      phase:   Math.random() * Math.PI * 2,
      speed:   Math.random() * 0.007 + 0.002,
      warm:    Math.random() > 0.65,
      opacity: Math.random() * 0.55 + 0.1,
    });
  }
}

let animTime = 0;
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  animTime += 0.016;

  stars.forEach(s => {
    const op = s.opacity * (0.5 + 0.5 * Math.sin(animTime * s.speed * 60 + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    // Étoiles chaudes légèrement ambrées
    if (s.warm) {
      ctx.fillStyle = `rgba(200, 180, 255, ${op})`;
    } else {
      ctx.fillStyle = `rgba(240, 235, 255, ${op})`;
    }
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

resizeCanvas();
initStars();
drawStars();

window.addEventListener('resize', () => {
  resizeCanvas();
  initStars();
}, { passive: true });

/* ══════════════════════════════════════════════════════════
   3. NAVIGATION
══════════════════════════════════════════════════════════ */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === current);
  });
}, { passive: true });

/* ══════════════════════════════════════════════════════════
   4. BURGER MOBILE
══════════════════════════════════════════════════════════ */
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('nav-links');

burger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  burger.classList.toggle('open', open);
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burger.classList.remove('open');
  });
});

/* ══════════════════════════════════════════════════════════
   5. REVEAL AU SCROLL
══════════════════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), (i % 4) * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════════════════════════
   6. TIMELINE
══════════════════════════════════════════════════════════ */
const timelineEntries = document.querySelectorAll('.timeline-entry');

const tlObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 150);
      tlObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

timelineEntries.forEach(el => tlObserver.observe(el));

/* ══════════════════════════════════════════════════════════
   7. PARALLAXE 3D sur les glass cards
══════════════════════════════════════════════════════════ */
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-3px)`;
    card.style.transition = 'transform .08s ease, border-color .3s, background .3s';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform .5s ease, border-color .3s, background .3s';
  });
});

/* ══════════════════════════════════════════════════════════
   8. FORMULAIRE
══════════════════════════════════════════════════════════ */
const form   = document.getElementById('contact-form');
const notice = document.getElementById('form-notice');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    notice.textContent = '✓ Message envoyé ! Je vous répondrai très bientôt.';
    notice.style.color = '#6ee7b7';
    form.reset();
    setTimeout(() => { notice.textContent = ''; }, 6000);
  });
}