/* ============================================================
   NATASHA CRUZ PORTFOLIO — script.js
   Interactions, Animations, Particles
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========== AOS INIT ==========
  AOS.init({
    duration: 700,
    once: true,
    easing: 'ease-out-cubic',
    offset: 60
  });

  // ========== NAVBAR SCROLL ==========
  const navbar = document.getElementById('mainNav');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ========== ACTIVE NAV LINK (Intersection Observer) ==========
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => sectionObserver.observe(sec));

  // ========== SKILL BARS ANIMATION ==========
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.getAttribute('data-width');
        fill.style.width = targetWidth + '%';
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  // ========== PARTICLES ==========
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = document.getElementById('home').offsetHeight;
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -Math.random() * 0.6 - 0.2;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.decay = Math.random() * 0.003 + 0.001;

      // Color palette: pinks, purples, whites
      const colors = [
        'rgba(255, 133, 161,',
        'rgba(255, 77, 109,',
        'rgba(191, 90, 242,',
        'rgba(255, 214, 231,',
        'rgba(255, 200, 221,',
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= this.decay;

      if (this.opacity <= 0 || this.y < -10) {
        this.reset();
        this.y = canvas.height + 10;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.opacity})`;
      ctx.fill();

      // Glow effect for larger particles
      if (this.size > 1.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${this.opacity * 0.15})`;
        ctx.fill();
      }
    }
  }

  // Create initial particles
  const PARTICLE_COUNT = 80;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height; // spread vertically on init
    particles.push(p);
  }

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animFrame = requestAnimationFrame(animateParticles);
  };

  animateParticles();

  // ========== SMOOTH SCROLL FOR NAV LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;

      window.scrollTo({ top: targetPos, behavior: 'smooth' });

      // Close mobile menu
      const bsCollapse = bootstrap.Collapse.getInstance(document.getElementById('navMenu'));
      if (bsCollapse) bsCollapse.hide();
    });
  });

  // ========== STICKER CARD CLICK EFFECT ==========
  document.querySelectorAll('.sticker-card').forEach(card => {
    card.addEventListener('click', function () {
      this.classList.add('pop');
      setTimeout(() => this.classList.remove('pop'), 300);
    });
  });

  // ========== CONTACT FORM SUBMIT ==========
  const sendBtn = document.querySelector('.btn-gamer');
  if (sendBtn && sendBtn.closest('.contact-card')) {
    sendBtn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.contact-card .pink-input');
      let allFilled = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          allFilled = false;
          input.classList.add('input-error');
          setTimeout(() => input.classList.remove('input-error'), 1000);
        }
      });

      if (allFilled) {
        sendBtn.textContent = '✓ ¡Mensaje enviado! 🌸';
        sendBtn.style.background = 'linear-gradient(135deg, #4ade80, #22d3ee)';
        setTimeout(() => {
          inputs.forEach(input => (input.value = ''));
          sendBtn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Enviar Mensaje';
          sendBtn.style.background = '';
        }, 3000);
      }
    });
  }

  // ========== HERO AVATAR PARALLAX (subtle) ==========
  const heroSection = document.getElementById('home');
  const heroAvatar = document.getElementById('heroAvatar');

  if (heroAvatar) {
    window.addEventListener('mousemove', (e) => {
      if (window.scrollY > window.innerHeight) return;

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      heroAvatar.style.transform = `translate(${dx * 6}px, ${dy * 6}px)`;
    });
  }

  // ========== TYPING EFFECT for hero tagline ==========
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    const phrases = [
      '🎨 Illustrator · 💻 Web Developer · ✨ Graphic Designer',
      '🌸 Emotes & Stickers · 🎮 Gamer Vibes · 💖 Creative Soul',
      '🖌️ Digital Art · 🖥️ Full Stack · 🌟 Twitch Creator'
    ];
    let phraseIndex = 0;

    setInterval(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      tagline.style.opacity = '0';
      tagline.style.transform = 'translateY(8px)';

      setTimeout(() => {
        tagline.textContent = phrases[phraseIndex];
        tagline.style.opacity = '0.9';
        tagline.style.transform = 'translateY(0)';
      }, 350);
    }, 3500);

    tagline.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  }

  // ========== SCROLL REVEAL COUNTER for fun ==========
  // Adds a small "visited" sparkle when sections come into view
  const sectionTitles = document.querySelectorAll('.section-title');

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('title-revealed');
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  sectionTitles.forEach(t => titleObserver.observe(t));

  // ========== ADD POP KEYFRAME DYNAMICALLY ==========
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes pop {
      0% { transform: scale(1); }
      40% { transform: scale(0.92) rotate(-2deg); }
      70% { transform: scale(1.08) rotate(2deg); }
      100% { transform: scale(1); }
    }

    .sticker-card.pop {
      animation: pop 0.3s ease !important;
    }

    .input-error {
      animation: shake 0.4s ease !important;
      border-color: #ff4d6d !important;
      box-shadow: 0 0 0 3px rgba(255, 77, 109, 0.25) !important;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      60% { transform: translateX(6px); }
    }

    .title-revealed .title-deco {
      animation: sparkle-in 0.6s ease forwards;
    }

    @keyframes sparkle-in {
      0% { transform: scale(0.5); opacity: 0; }
      60% { transform: scale(1.3); }
      100% { transform: scale(1); opacity: 1; }
    }

    .nav-link.active {
      color: #ff85a1 !important;
    }

    .nav-link.active::after {
      width: 60%;
    }
  `;
  document.head.appendChild(styleSheet);

  console.log(
    '%c✦ Natasha Cruz Portfolio ✦',
    'color: #ff85a1; font-family: Orbitron, monospace; font-size: 18px; font-weight: bold;'
  );
  console.log(
    '%c🌸 Hecho con amor y código 🌸',
    'color: #ffc8dd; font-family: Nunito; font-size: 12px;'
  );
});
