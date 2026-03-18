/* ============================================================
   PORTFOLIO BTS SIO SLAM — Script principal
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   1. FOND ÉTOILÉ ANIMÉ (Canvas)
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
  const count = Math.floor((canvas.width * canvas.height) / 8000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 1.4 + 0.2,
      phase:   Math.random() * Math.PI * 2,
      speed:   Math.random() * 0.006 + 0.002,
      opacity: Math.random() * 0.6 + 0.1,
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
    ctx.fillStyle = `rgba(255, 255, 255, ${op})`;
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
   2. NAVIGATION — scroll shadow + lien actif
══════════════════════════════════════════════════════════ */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  // Shadow sur la navbar
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // Lien actif selon la section visible
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
   3. BURGER MENU MOBILE
══════════════════════════════════════════════════════════ */
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('nav-links');

burger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
});

// Fermer au clic sur un lien
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

/* ══════════════════════════════════════════════════════════
   4. REVEAL AU SCROLL (Intersection Observer)
══════════════════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Délai en cascade pour les éléments d'une même passe
      const delay = (i % 4) * 100;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════════════════════════
   5. TIMELINE — apparition progressive
══════════════════════════════════════════════════════════ */
const timelineEntries = document.querySelectorAll('.timeline-entry');

const tlObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 150);
      tlObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

timelineEntries.forEach(el => tlObserver.observe(el));

/* ══════════════════════════════════════════════════════════
   6. FORMULAIRE CONTACT — feedback visuel
══════════════════════════════════════════════════════════ */
const form   = document.getElementById('contact-form');
const notice = document.getElementById('form-notice');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    notice.textContent = '✓ Message envoyé ! Je vous répondrai dans les plus brefs délais.';
    notice.style.color = '#34d399';
    form.reset();
    setTimeout(() => { notice.textContent = ''; }, 6000);
  });
}

/* ══════════════════════════════════════════════════════════
   7. HOVER sur les cartes projets — léger parallaxe
══════════════════════════════════════════════════════════ */
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - 0.5;
    const y      = (e.clientY - rect.top)  / rect.height - 0.5;
    const rotX   = y * -5;
    const rotY   = x *  5;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s ease, border-color .3s ease, background .3s ease';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform .1s ease, border-color .3s ease, background .3s ease';
  });
});