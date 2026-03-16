/* ============================================================
   PORTFOLIO BTS SIO — Script principal
   ============================================================ */

/* ── Navigation : scroll shadow + lien actif ── */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  // Ombre navbar au scroll
  navbar.classList.toggle('scrolled', window.scrollY > 10);

  // Lien actif
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

/* ── Burger menu mobile ── */
const burger   = document.getElementById('burger');
const navMenu  = document.getElementById('nav-links');

burger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});

// Fermer le menu au clic sur un lien
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burger.classList.remove('open');
  });
});

/* ── Timeline : apparition au scroll (Intersection Observer) ── */
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 130);
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

timelineItems.forEach(item => timelineObserver.observe(item));

/* ── Sections : animation d'entrée générale ── */
const animTargets = document.querySelectorAll(
  '.skills-group, .stage-card, .project-card, .certif-card, .veille-theme, .bts-card'
);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
      }, i * 80);
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animTargets.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  sectionObserver.observe(el);
});

/* ── Formulaire de contact : feedback visuel ── */
const form   = document.getElementById('contact-form');
const notice = document.getElementById('form-notice');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    notice.textContent = '✓ Message envoyé ! Je vous répondrai bientôt.';
    notice.style.color = '#4ade80';
    form.reset();
    setTimeout(() => { notice.textContent = ''; }, 5000);
  });
}