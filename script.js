/* ============================================================
   PORTFOLIO - MAIN JAVASCRIPT
   Controls: cursor, particles, skill bar animations, transitions
   ============================================================ */

// === CUSTOM CURSOR ===
const cursor = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
});

// Smooth ring follow
function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
  }

  requestAnimationFrame(animateCursor);
}
animateCursor();

// === NAV DOTS (page indicator) ===
// Each page sets its active dot via data-page attribute on <body>
function initNavDots() {
  const dots = document.querySelectorAll('.nav-dot');
  const bodyPage = document.body.dataset.page;

  dots.forEach((dot, i) => {
    if (dot.dataset.index === bodyPage) {
      dot.classList.add('active');
    }
  });
}

// === FLOATING PARTICLES ===
function initParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;

  // Create 20 particles
  for (let i = 0; i < 20; i++) {
    createParticle(container);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.classList.add('particle');

  // Random properties
  const size = Math.random() * 3 + 1;
  const left = Math.random() * 100;
  const duration = Math.random() * 15 + 10;
  const delay = Math.random() * 15;

  // Alternate colors between cyan and purple
  const colors = [
    'rgba(0, 245, 255, 0.8)',
    'rgba(191, 0, 255, 0.6)',
    'rgba(0, 102, 255, 0.7)',
    'rgba(255, 0, 144, 0.5)',
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  particle.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    background: ${color};
    box-shadow: 0 0 ${size * 3}px ${color};
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
  `;

  container.appendChild(particle);
}

// === SKILL BAR ANIMATION ===
// Triggered when skill bars enter viewport
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.dataset.width || '0%';
        // Small delay for staggered effect
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, 100);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

// === MAGNETIC BUTTON EFFECT ===
// Buttons slightly move toward mouse when hovered
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.25;
      const deltaY = (e.clientY - centerY) * 0.25;

      btn.style.transform = `translate(${deltaX}px, ${deltaY}px) translateY(-3px) scale(1.02)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// === PAGE TRANSITION (exit animation before navigate) ===
function initPageTransition() {
  const links = document.querySelectorAll('a.btn, a[data-transition]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // Only for internal HTML pages
      if (href && href.endsWith('.html') || href === 'index.html') {
        e.preventDefault();

        // Exit animation
        document.body.style.transition = 'opacity 0.35s ease, transform 0.35s ease, filter 0.35s ease';
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(-15px) scale(0.98)';
        document.body.style.filter = 'blur(6px)';

        setTimeout(() => {
          window.location.href = href;
        }, 350);
      }
    });
  });
}

// === CARD ENTRANCE ANIMATION ===
// Cards stagger-fade in when page loads
function initCardAnimations() {
  const cards = document.querySelectorAll('.glass-card, .contact-item');

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 300 + i * 100);
  });
}

// === GLITCH EFFECT on page title (subtle) ===
function initTitleGlitch() {
  const title = document.querySelector('.hero-title, .page-title');
  if (!title) return;

  setInterval(() => {
    if (Math.random() < 0.08) { // 8% chance every interval
      title.style.textShadow = `2px 0 rgba(255, 0, 144, 0.4), -2px 0 rgba(0, 245, 255, 0.4)`;
      setTimeout(() => {
        title.style.textShadow = 'none';
      }, 80);
    }
  }, 2000);
}

// === INIT ALL ===
document.addEventListener('DOMContentLoaded', () => {
  initNavDots();
  initParticles();
  initSkillBars();
  initMagneticButtons();
  initPageTransition();
  initCardAnimations();
  initTitleGlitch();

  // Page enters with fade-in
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
});
