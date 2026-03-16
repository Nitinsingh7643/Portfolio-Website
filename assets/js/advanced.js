'use strict';

/* =============================================
   SCROLL PROGRESS BAR
   ============================================= */
const scrollProgressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  if (scrollProgressBar) scrollProgressBar.style.width = progress + '%';
});

/* =============================================
   TYPEWRITER EFFECT
   ============================================= */
const typewriterEl = document.getElementById('typewriter-text');
const roles = [
  'Full Stack Web Developer',
  'UI/UX Designer',
  'React Developer',
  'Node.js Engineer',
  'Problem Solver'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeDelay = 100;

function typeWriter() {
  if (!typewriterEl) return;
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    typeDelay = 60;
  } else {
    typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    typeDelay = 110;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    typeDelay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeDelay = 400;
  }

  setTimeout(typeWriter, typeDelay);
}
setTimeout(typeWriter, 800);

/* =============================================
   PARTICLE CANVAS BACKGROUND
   ============================================= */
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(45, 100%, 72%, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(45, 100%, 72%, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* =============================================
   CUSTOM CURSOR GLOW
   ============================================= */
const cursorDot = document.getElementById('cursor-dot');
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  }
});

function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  if (cursorGlow) {
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .project-item, .service-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursorDot) cursorDot.classList.add('cursor-hover');
    if (cursorGlow) cursorGlow.classList.add('cursor-hover');
  });
  el.addEventListener('mouseleave', () => {
    if (cursorDot) cursorDot.classList.remove('cursor-hover');
    if (cursorGlow) cursorGlow.classList.remove('cursor-hover');
  });
});

/* =============================================
   ANIMATED SKILL BARS (Intersection Observer)
   ============================================= */
const skillFills = document.querySelectorAll('.skill-progress-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const targetWidth = fill.getAttribute('data-width') || fill.style.width;
      fill.style.width = '0%';
      setTimeout(() => {
        fill.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        fill.style.width = targetWidth;
      }, 200);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.5 });

skillFills.forEach(fill => {
  const w = fill.style.width;
  fill.setAttribute('data-width', w);
  fill.style.width = '0%';
  skillObserver.observe(fill);
});

/* =============================================
   STATS COUNTER ANIMATION
   ============================================= */
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '+');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count);
      animateCounter(entry.target, target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
  statsObserver.observe(el);
});

/* =============================================
   BACK TO TOP BUTTON
   ============================================= */
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    if (backToTopBtn) backToTopBtn.classList.add('visible');
  } else {
    if (backToTopBtn) backToTopBtn.classList.remove('visible');
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =============================================
   TOAST NOTIFICATION
   ============================================= */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = message;
  toast.className = `toast-notification ${type}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* =============================================
   ENHANCED CONTACT FORM
   ============================================= */
const contactForm = document.querySelector('[data-form]');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = contactForm.querySelector('[data-form-btn]');
    btn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon><span>Sending...</span>';
    btn.disabled = true;

    setTimeout(() => {
      showToast('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
      contactForm.reset();
      btn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
      btn.disabled = true;
    }, 1500);
  });
}

/* =============================================
   AOS-LIKE SCROLL ANIMATIONS
   ============================================= */
const animatedEls = document.querySelectorAll('[data-animate]');
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      animateObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

animatedEls.forEach(el => animateObserver.observe(el));

/* =============================================
   DARK / LIGHT MODE TOGGLE
   ============================================= */
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
  if (!themeToggle) return;
  themeToggle.innerHTML = theme === 'dark'
    ? '<ion-icon name="sunny-outline"></ion-icon>'
    : '<ion-icon name="moon-outline"></ion-icon>';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeIcon(next);
  });
}

/* =============================================
   GITHUB STATS CARD EMBED LOADER
   ============================================= */
// Cards are loaded via iframe/img in HTML - just handle load states here
const githubCards = document.querySelectorAll('.github-stat-card');
githubCards.forEach(card => {
  card.addEventListener('load', () => card.classList.add('loaded'));
});

/* =============================================
   TILT EFFECT ON PROJECT CARDS
   ============================================= */
document.querySelectorAll('.project-item').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.querySelector('a').style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('a').style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
  });
});

/* =============================================
   NAVBAR ACTIVE STATE ENHANCEMENT
   ============================================= */
// Add ripple effect to navbar buttons
document.querySelectorAll('.navbar-link').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});
