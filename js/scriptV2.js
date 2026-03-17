/* ============================================================
   PORTFOLIO BTS SIO — Script thème "Terminal Luxe"
   ============================================================ */

/* ── Curseur personnalisé ── */
const dot  = document.createElement('div');
const ring = document.createElement('div');
dot.className  = 'cursor-dot';
ring.className = 'cursor-ring';
document.body.append(dot, ring);

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

// Ring suit avec un léger décalage (lerp)
function animateRing() {
  ringX += (mouseX - ringX) * .12;
  ringY += (mouseY - ringY) * .12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

/* ── Numéros de section (data-num) ── */
const sectionNums = {
  'accueil':      '01',
  'apropos':      '02',
  'competences':  '03',
  'parcours':     '04',
  'stages':       '05',
  'realisations': '06',
  'veille':       '07',
  'contact':      '08',
};

Object.entries(sectionNums).forEach(([id, num]) => {
  const sec = document.getElementById(id);
  if (sec) sec.setAttribute('data-num', num);
});

/* ── Navigation : scroll shadow + lien actif ── */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

/* ── Burger menu ── */
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

/* ── Timeline ── */
const timelineItems = document.querySelectorAll('.timeline-item');

const tlObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 130);
      tlObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

timelineItems.forEach(item => tlObserver.observe(item));

/* ── Animation d'entrée générale ── */
const animTargets = document.querySelectorAll(
  '.skills-group, .stage-card, .project-card, .certif-card, .veille-theme, .bts-card'
);

const animObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 75);
      animObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

animTargets.forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(14px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  animObs.observe(el);
});

/* ── Formulaire ── */
const form   = document.getElementById('contact-form');
const notice = document.getElementById('form-notice');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    notice.textContent = '> Message envoyé. Je vous répondrai bientôt.';
    notice.style.color = '#00ff87';
    form.reset();
    setTimeout(() => { notice.textContent = ''; }, 5000);
  });
}