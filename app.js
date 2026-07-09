/* ==========================================
   RED BULL WIIINGS EXPERIENCE - INTERACTIVE SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. THEME & PRODUCT SELECTOR ---
  const body = document.body;
  const productCards = document.querySelectorAll('.product-card');
  const heroTitle = document.getElementById('hero-title');
  const heroDesc = document.getElementById('hero-desc');
  const heroCanImg = document.getElementById('hero-can-img');
  
  // Hero Stats
  const statCaffeine = document.getElementById('stat-caffeine');
  const statTaurine = document.getElementById('stat-taurine');
  const statCalories = document.getElementById('stat-calories');

  // Change hero theme and assets
  function switchTheme(flavorData) {
    const { flavor, title, desc, img, theme, caffeine, taurine, calories } = flavorData;
    
    // Fade out can image
    heroCanImg.style.opacity = '0';
    heroCanImg.style.transform = 'translateY(20px) scale(0.9)';
    
    setTimeout(() => {
      // Set new content
      heroTitle.textContent = title;
      heroDesc.textContent = desc;
      heroCanImg.src = img;
      
      statCaffeine.textContent = caffeine;
      statTaurine.textContent = taurine;
      statCalories.textContent = calories;
      
      // Update body class
      body.className = ''; // Reset
      body.classList.add(`theme-${theme}`);
      
      // If wings activation is running, preserve it
      if (isWiiingsActive) {
        body.classList.add('wiiings-active');
      }

      // Fade in can image
      heroCanImg.style.opacity = '1';
      heroCanImg.style.transform = 'translateY(0) scale(1)';
    }, 300);
  }

  // Bind click events on product cards
  productCards.forEach(card => {
    card.addEventListener('click', () => {
      productCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      const flavorData = {
        flavor: card.dataset.flavor,
        title: card.dataset.title,
        desc: card.dataset.desc,
        img: card.dataset.img,
        theme: card.dataset.theme,
        caffeine: card.dataset.caffeine,
        taurine: card.dataset.taurine,
        calories: card.dataset.calories
      };
      
      switchTheme(flavorData);
    });
  });


  // --- 2. ENERGY LABORATORY LOGIC ---
  const stateButtons = document.querySelectorAll('.state-btn');
  const focusVal = document.getElementById('metric-focus-val');
  const reactionVal = document.getElementById('metric-reaction-val');
  const staminaVal = document.getElementById('metric-stamina-val');
  const focusBar = document.getElementById('metric-focus-bar');
  const reactionBar = document.getElementById('metric-reaction-bar');
  const staminaBar = document.getElementById('metric-stamina-bar');

  // Recommendation Elements
  const recCanImg = document.getElementById('rec-can-img');
  const recTitle = document.getElementById('rec-title');
  const recReason = document.getElementById('rec-reason');
  const recActivateBtn = document.getElementById('rec-activate-btn');

  // Simulated metrics map
  const stateMetrics = {
    coding: {
      focus: 96,
      reaction: 84,
      stamina: 72,
      recProduct: 'original',
      recTitleText: 'Red Bull Original',
      recReasonText: 'Provides the classic balanced taurine/caffeine hit to maintain complex debugging logic and long-term focus.',
      recImg: 'assets/redbull_original.jpg'
    },
    study: {
      focus: 92,
      reaction: 78,
      stamina: 64,
      recProduct: 'sugarfree',
      recTitleText: 'Red Bull Sugarfree',
      recReasonText: 'Provides sharp mental alertness for study retention without sugars, preventing late-night carb-crashes.',
      recImg: 'assets/redbull_sugarfree.jpg'
    },
    workout: {
      focus: 80,
      reaction: 98,
      stamina: 96,
      recProduct: 'watermelon',
      recTitleText: 'Red Bull Red Edition',
      recReasonText: 'Delivers a refreshing watermelon boost with immediate caffeine release to maximize muscle reaction and raw stamina.',
      recImg: 'assets/redbull_watermelon.jpg'
    },
    drive: {
      focus: 88,
      reaction: 92,
      stamina: 82,
      recProduct: 'original',
      recTitleText: 'Red Bull Original',
      recReasonText: 'Classic physical vitalization and sustained energy release to maintain road awareness and combat fatigue.',
      recImg: 'assets/redbull_original.jpg'
    }
  };

  // Animate counter values
  function animateValue(element, start, end, duration, suffix = '%') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      element.textContent = current + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Update lab visualization panel
  function updateLabState(stateKey) {
    const metrics = stateMetrics[stateKey];
    if (!metrics) return;

    // Get current values from HTML text content
    const currentFocus = parseInt(focusVal.textContent) || 0;
    const currentReaction = parseInt(reactionVal.textContent) || 0;
    const currentStamina = parseInt(staminaVal.textContent) || 0;

    // Animate numbers
    animateValue(focusVal, currentFocus, metrics.focus, 800);
    animateValue(reactionVal, currentReaction, metrics.reaction, 800);
    animateValue(staminaVal, currentStamina, metrics.stamina, 800);

    // Update bars width
    focusBar.style.width = `${metrics.focus}%`;
    reactionBar.style.width = `${metrics.reaction}%`;
    staminaBar.style.width = `${metrics.stamina}%`;

    // Update recommendation section with brief fade transition
    recCanImg.style.opacity = '0';
    recCanImg.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
      recCanImg.src = metrics.recImg;
      recTitle.textContent = metrics.recTitleText;
      recReason.textContent = metrics.recReasonText;
      recActivateBtn.setAttribute('data-target-product', metrics.recProduct);
      
      recCanImg.style.opacity = '1';
      recCanImg.style.transform = 'scale(1)';
    }, 300);
  }

  // Bind state selector clicks
  stateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      stateButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const state = btn.dataset.state;
      updateLabState(state);
    });
  });

  // Recommended button loading logic
  recActivateBtn.addEventListener('click', () => {
    const targetProduct = recActivateBtn.getAttribute('data-target-product');
    const correspondingCard = document.querySelector(`.product-card[data-flavor="${targetProduct}"]`);
    if (correspondingCard) {
      correspondingCard.click();
      // Scroll smoothly to hero section to view the loaded product
      document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
    }
  });


  // --- 3. WIIINGS ACTIVATOR (SURGE MODE) ---
  const wiiingsBtn = document.getElementById('wiiings-btn');
  const navVitalityVal = document.getElementById('nav-vitality-val');
  let isWiiingsActive = false;
  let wiiingsTimeout = null;

  wiiingsBtn.addEventListener('click', () => {
    if (isWiiingsActive) {
      // Deactivate early
      deactivateWiiings();
    } else {
      activateWiiings();
    }
  });

  function activateWiiings() {
    isWiiingsActive = true;
    body.classList.add('wiiings-active');
    
    // Change button text
    wiiingsBtn.querySelector('.btn-text').textContent = 'Surge Active!';
    
    // Pulse animation for button
    wiiingsBtn.style.transform = 'scale(0.95)';
    setTimeout(() => wiiingsBtn.style.transform = '', 150);

    // Animate vitality to 200% supercharge
    animateValue(navVitalityVal, 100, 200, 1500, '%');
    
    // Canvas settings change
    maxParticles = 350;
    particleSpeedMultiplier = 3.5;

    // Auto-decay after 6 seconds
    if (wiiingsTimeout) clearTimeout(wiiingsTimeout);
    wiiingsTimeout = setTimeout(() => {
      deactivateWiiings();
    }, 6000);
  }

  function deactivateWiiings() {
    isWiiingsActive = false;
    body.classList.remove('wiiings-active');
    
    wiiingsBtn.querySelector('.btn-text').textContent = 'Activate Wiiings';
    
    // De-escalate vitality meter back to normal 100%
    const currentVit = parseInt(navVitalityVal.textContent) || 200;
    animateValue(navVitalityVal, currentVit, 100, 1000, '%');

    // Canvas settings restore
    maxParticles = 60;
    particleSpeedMultiplier = 1;
    
    if (wiiingsTimeout) clearTimeout(wiiingsTimeout);
  }


  // --- 4. CANVAS PARTICLE SYSTEM ---
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let maxParticles = 60;
  let particleSpeedMultiplier = 1;
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      // Spawn near bottom or around the center depending on mode
      if (isWiiingsActive) {
        // Spawn near the central can coordinates
        this.x = width / 2 + (Math.random() * 120 - 60);
        this.y = height / 2 + (Math.random() * 200 - 100);
        this.vx = (Math.random() * 4 - 2) * particleSpeedMultiplier;
        this.vy = -(Math.random() * 6 + 4) * particleSpeedMultiplier;
      } else {
        // Ambient particles floating up from bottom
        this.x = Math.random() * width;
        this.y = height + 10;
        this.vx = (Math.random() * 1 - 0.5);
        this.vy = -(Math.random() * 1 + 0.5);
      }
      
      this.size = Math.random() * 3 + 1;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.life = Math.random() * 150 + 100;
      this.maxLife = this.life;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Decay life
      this.life--;
      this.alpha = (this.life / this.maxLife) * (isWiiingsActive ? 0.8 : 0.4);

      if (this.life <= 0 || this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      // Get theme colors dynamically from page
      const themeColor = getComputedStyle(document.body).getPropertyValue('--accent-light').trim() || '#528bfd';
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(themeColor, this.alpha);
      ctx.shadowBlur = isWiiingsActive ? 8 : 0;
      ctx.shadowColor = themeColor;
      ctx.fill();
    }
  }

  // Convert Hex to RGBA utility
  function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Initialize particles
  for (let i = 0; i < 350; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    const count = isWiiingsActive ? maxParticles : 60;
    for (let i = 0; i < count; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    requestAnimationFrame(animate);
  }
  animate();


  // --- 5. INTERSECTION OBSERVER FOR ACTIVE NAVBAR & SCROLL REVEAL ---
  const sections = document.querySelectorAll('main > section');
  const navItems = document.querySelectorAll('.nav-links a');

  // Change active nav link on scroll
  const navObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  // Scroll reveal triggers
  const scrollRevealOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in-view');
        revealObserver.unobserve(entry.target); // Trigger only once
      }
    });
  }, scrollRevealOptions);

  // Apply reveal class targets
  const revealElements = [
    ...document.querySelectorAll('.product-card'),
    ...document.querySelectorAll('.lab-grid > div'),
    ...document.querySelectorAll('.sport-card')
  ];

  // Set initial style and observe
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  // Inject dynamic styles for scroll reveal in JS (to keep CSS clean)
  const style = document.createElement('style');
  style.innerHTML = `
    .reveal-in-view {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    /* Add slight delay staggering for grids */
    .product-card:nth-child(2) { transition-delay: 0.15s; }
    .product-card:nth-child(3) { transition-delay: 0.3s; }
    .sport-card:nth-child(2) { transition-delay: 0.15s; }
    .sport-card:nth-child(3) { transition-delay: 0.3s; }
  `;
  document.head.appendChild(style);

});
