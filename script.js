/* ==========================================
   MINHAS INNOVATIONS - INTERACTIVE SCRIPTS (script.js)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. DYNAMIC PRELOADER WITH PERCENT COUNTER
  const loader = document.getElementById('loader');
  const percentText = document.getElementById('loader-percent');
  const progressBar = document.querySelector('.loader-progress');
  const body = document.body;
  
  // Prevent scrolling during loader screen
  body.style.overflow = 'hidden';

  // Setup loader particle canvas
  const loaderParticlesCanvas = document.getElementById('loader-particles');
  if (loaderParticlesCanvas) {
    const lCtx = loaderParticlesCanvas.getContext('2d');
    let lWidth = (loaderParticlesCanvas.width = window.innerWidth);
    let lHeight = (loaderParticlesCanvas.height = window.innerHeight);
    let dots = [];

    window.addEventListener('resize', () => {
      lWidth = (loaderParticlesCanvas.width = window.innerWidth);
      lHeight = (loaderParticlesCanvas.height = window.innerHeight);
    });

    for (let i = 0; i < 40; i++) {
      dots.push({
        x: Math.random() * lWidth,
        y: Math.random() * lHeight,
        size: Math.random() * 1.5 + 0.5,
        speedY: -(Math.random() * 0.4 + 0.1),
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    function animateLoaderParticles() {
      if (loader.classList.contains('hidden')) return;
      lCtx.clearRect(0, 0, lWidth, lHeight);
      
      dots.forEach(dot => {
        dot.y += dot.speedY;
        if (dot.y < 0) dot.y = lHeight;
        lCtx.fillStyle = `rgba(0, 240, 255, ${dot.opacity})`;
        lCtx.beginPath();
        lCtx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        lCtx.fill();
      });
      requestAnimationFrame(animateLoaderParticles);
    }
    animateLoaderParticles();
  }

  // Loader count ticker
  let currentPercent = 0;
  const loadDuration = 2200; // ms
  const intervalTime = 20; // tick step
  const totalTicks = loadDuration / intervalTime;
  const incrementVal = 100 / totalTicks;

  const ticker = setInterval(() => {
    currentPercent += incrementVal;
    if (currentPercent >= 100) {
      currentPercent = 100;
      clearInterval(ticker);
      progressBar.style.width = '100%';
      percentText.innerText = '100%';
      
      // Delay homepage reveal slightly after 100%
      setTimeout(() => {
        loader.classList.add('hidden');
        body.style.overflow = '';
        initScrollAnimations();
      }, 300);
    } else {
      const rounded = Math.floor(currentPercent);
      progressBar.style.width = `${rounded}%`;
      percentText.innerText = `${rounded}%`;
    }
  }, intervalTime);


  // 2. STICKY HEADER & MOBILE NAV
  const header = document.querySelector('header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      const icon = navToggle.querySelector('i');
      if (icon) {
        if (isExpanded) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) {
        navMenu.classList.remove('active');
      }
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  });


  // 3. BACK TO TOP BUTTON
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (backToTopBtn) {
      if (window.scrollY > 600) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // 4. HERO CANVAS PARTICLES
  const heroParticlesCanvas = document.getElementById('hero-particles');
  const heroSection = document.getElementById('hero');
  let isHeroVisible = false;

  if (heroParticlesCanvas && heroSection) {
    const ctx = heroParticlesCanvas.getContext('2d');
    let particlesArray = [];
    let width = (heroParticlesCanvas.width = heroParticlesCanvas.offsetWidth);
    let height = (heroParticlesCanvas.height = heroParticlesCanvas.offsetHeight);
    let mouse = { x: null, y: null, radius: 120 };

    window.addEventListener('resize', () => {
      if (heroParticlesCanvas.offsetWidth > 0) {
        width = (heroParticlesCanvas.width = heroParticlesCanvas.offsetWidth);
        height = (heroParticlesCanvas.height = heroParticlesCanvas.offsetHeight);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (isHeroVisible) {
        const rect = heroParticlesCanvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.density = Math.random() * 30 + 10;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;

        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let directionX = dx / distance;
            let directionY = dy / distance;
            this.x -= directionX * force * 2;
            this.y -= directionY * force * 2;
          }
        }
      }
      draw() {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      const numberOfParticles = Math.floor((width * height) / 15000);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            let opacity = (100 - distance) / 100 * 0.15;
            ctx.strokeStyle = `rgba(171, 38, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    let animationFrameId = null;
    function animateParticles() {
      if (!isHeroVisible) {
        animationFrameId = null;
        return;
      }
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectParticles();
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    
    // Intersection Observer to start/stop particle rendering
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = isHeroVisible;
        isHeroVisible = entry.isIntersecting;
        if (isHeroVisible && !wasVisible) {
          if (!animationFrameId) {
            animateParticles();
          }
        }
      });
    }, { threshold: 0.05 });
    
    heroObserver.observe(heroSection);
  } else {
    isHeroVisible = true; // Fallback if element not found
  }


  // 5. LAPTOP SCREEN REAL-TIME DASHBOARD DATA
  const dashCanvas = document.getElementById('dash-canvas');
  if (dashCanvas) {
    const ctx = dashCanvas.getContext('2d');
    let points = Array(20).fill(30);
    
    function drawChart() {
      const w = (dashCanvas.width = dashCanvas.offsetWidth);
      const h = (dashCanvas.height = dashCanvas.offsetHeight);
      ctx.clearRect(0, 0, w, h);

      points.shift();
      const lastVal = points[points.length - 1];
      const change = (Math.random() - 0.5) * 15;
      let newVal = Math.max(10, Math.min(h - 10, lastVal + change));
      points.push(newVal);

      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(171, 38, 255, 0.0)');
      
      ctx.beginPath();
      ctx.moveTo(0, h);
      const segmentWidth = w / (points.length - 1);
      
      for (let i = 0; i < points.length; i++) {
        ctx.lineTo(i * segmentWidth, points[i]);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, points[0]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(i * segmentWidth, points[i]);
      }
      ctx.strokeStyle = 'var(--accent-cyan)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    
    setInterval(() => {
      if (isHeroVisible) {
        drawChart();
      }
    }, 300);
  }

  // Dashboard Stats updater
  const dbTasksVal = document.getElementById('db-tasks');
  const dbCpuVal = document.getElementById('db-cpu');
  const dbLatencyVal = document.getElementById('db-latency');

  if (dbTasksVal && dbCpuVal && dbLatencyVal) {
    let tasks = 14820;
    setInterval(() => {
      if (isHeroVisible) {
        tasks += Math.floor(Math.random() * 3) + 1;
        dbTasksVal.innerText = tasks.toLocaleString();
        
        const cpu = Math.floor(Math.random() * 15) + 32;
        dbCpuVal.innerText = `${cpu}%`;

        const lat = (Math.random() * 4 + 12).toFixed(1);
        dbLatencyVal.innerText = `${lat}ms`;
      }
    }, 1500);
  }


  // 6. SERVICES CARD HOVER GLOW EFFECT
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });


  // 7. ABOUT INTERACTIVE GRAPH CANVAS
  const aboutCanvas = document.getElementById('about-canvas');
  const aboutSection = document.getElementById('about');
  let isAboutVisible = false;

  if (aboutCanvas && aboutSection) {
    const ctx = aboutCanvas.getContext('2d');
    let width = (aboutCanvas.width = aboutCanvas.offsetWidth);
    let height = (aboutCanvas.height = aboutCanvas.offsetHeight);

    window.addEventListener('resize', () => {
      if (aboutCanvas.offsetWidth > 0) {
        width = (aboutCanvas.width = aboutCanvas.offsetWidth);
        height = (aboutCanvas.height = aboutCanvas.offsetHeight);
      }
    });

    const centerNode = { x: width / 2, y: height / 2 };
    const satElements = document.querySelectorAll('.satellite-node');
    let satellites = [];

    function updateSatellitesPositions() {
      satellites = [];
      const parentRect = aboutCanvas.getBoundingClientRect();
      
      satElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        satellites.push({
          x: (rect.left + rect.width / 2) - parentRect.left,
          y: (rect.top + rect.height / 2) - parentRect.top,
          pulseProgress: Math.random()
        });
      });
      centerNode.x = width / 2;
      centerNode.y = height / 2;
    }

    setTimeout(updateSatellitesPositions, 100);
    window.addEventListener('resize', () => setTimeout(updateSatellitesPositions, 100));

    let aboutAnimationFrameId = null;
    function drawAboutConnections() {
      if (!isAboutVisible) {
        aboutAnimationFrameId = null;
        return;
      }
      ctx.clearRect(0, 0, width, height);
      
      satellites.forEach(sat => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerNode.x, centerNode.y);
        ctx.lineTo(sat.x, sat.y);
        ctx.stroke();

        sat.pulseProgress += 0.006;
        if (sat.pulseProgress > 1) sat.pulseProgress = 0;

        const pulseX = centerNode.x + (sat.x - centerNode.x) * sat.pulseProgress;
        const pulseY = centerNode.y + (sat.y - centerNode.y) * sat.pulseProgress;

        ctx.fillStyle = 'var(--accent-cyan)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'var(--accent-cyan)';
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      aboutAnimationFrameId = requestAnimationFrame(drawAboutConnections);
    }
    
    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = isAboutVisible;
        isAboutVisible = entry.isIntersecting;
        if (isAboutVisible && !wasVisible) {
          if (!aboutAnimationFrameId) {
            drawAboutConnections();
          }
        }
      });
    }, { threshold: 0.05 });

    aboutObserver.observe(aboutSection);
  }


  // 8. COUNTER NUMBERS ANIMATION (About Section)
  function animateStatsCounter() {
    const stats = document.querySelectorAll('.stat-num');
    stats.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();
      const text = stat.innerText;
      const isPercent = text.includes('%');
      const isPlus = text.includes('+');

      function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = (ease * target);

        if (isPercent) {
          stat.innerText = `${Math.floor(currentVal)}%`;
        } else if (isPlus) {
          stat.innerText = `${Math.floor(currentVal)}+`;
        } else {
          stat.innerText = Math.floor(currentVal);
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          if (isPercent) stat.innerText = `${target}%`;
          else if (isPlus) stat.innerText = `${target}+`;
          else stat.innerText = target;
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }


  // 9. PORTFOLIO FILTER SYSTEM
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          // Smooth fade in
          setTimeout(() => {
            card.classList.remove('hidden');
          }, 50);
        } else {
          card.classList.add('hidden');
          // Wait for fade animation before display none
          setTimeout(() => {
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });


  // 10. PROJECT DETAIL MODAL SYSTEM
  const modal = document.getElementById('project-modal');
  const modalClose = document.querySelector('.modal-close');
  const modalMedia = document.getElementById('modal-media');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalFeaturesList = document.getElementById('modal-features-list');
  const modalTechList = document.getElementById('modal-tech-list');

  // Trigger modal open
  portfolioCards.forEach(card => {
    const handleCardTrigger = () => {
      if (!modal) return;
      const title = card.getAttribute('data-title') || 'Project Details';
      const categoryText = card.getAttribute('data-category-label') || 'Academic Project';
      const desc = card.getAttribute('data-desc') || '';
      
      // Ingest features list
      const featuresStr = card.getAttribute('data-features') || '';
      const featuresArr = featuresStr ? featuresStr.split('|') : [];
      
      // Ingest tech tags
      const techStr = card.getAttribute('data-tech') || '';
      const techArr = techStr ? techStr.split('|') : [];

      // Set titles & desc
      if (modalTitle) modalTitle.innerText = title;
      if (modalCategory) modalCategory.innerText = categoryText;
      if (modalDesc) modalDesc.innerText = desc;

      // Handle features rendering
      if (modalFeaturesList) {
        modalFeaturesList.innerHTML = '';
        featuresArr.forEach(feature => {
          const li = document.createElement('li');
          li.className = 'modal-feature-item';
          li.innerHTML = `<i class="fa-solid fa-square-check"></i> <span>${feature.trim()}</span>`;
          modalFeaturesList.appendChild(li);
        });
      }

      // Handle technology tags rendering
      if (modalTechList) {
        modalTechList.innerHTML = '';
        techArr.forEach(tech => {
          const span = document.createElement('span');
          span.className = 'modal-tech-badge';
          span.innerText = tech.trim();
          modalTechList.appendChild(span);
        });
      }

      // Handle media visual cloning or copying
      if (modalMedia) {
        const cardMedia = card.querySelector('.portfolio-media');
        modalMedia.innerHTML = '';
        if (cardMedia) {
          // Clone media contents to insert into modal cover
          const clonedMedia = cardMedia.cloneNode(true);
          // Remove portfolio overlay wrapper from cloned media
          const overlay = clonedMedia.querySelector('.portfolio-overlay');
          if (overlay) overlay.remove();
          modalMedia.appendChild(clonedMedia);
        }
      }

      // Show modal
      modal.classList.add('active');
      if (body) body.style.overflow = 'hidden'; // Disable page scrolling
    };

    card.addEventListener('click', handleCardTrigger);
    
    // Add Keyboard Trigger (Enter or Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardTrigger();
      }
    });
  });

  // Modal Dismiss
  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
    }
    if (body) {
      body.style.overflow = ''; // Re-enable scrolling
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });


  // 11. CLIPBOARD COPY TOAST FUNCTIONALITY
  const copyElements = document.querySelectorAll('.detail-icon');
  copyElements.forEach(element => {
    element.addEventListener('click', () => {
      const textToCopy = element.getAttribute('data-copy');
      const tooltip = element.parentElement.querySelector('.copy-tooltip');

      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          if (tooltip) {
            tooltip.innerText = 'Copied!';
            
            // Revert back to default after 2 seconds
            setTimeout(() => {
              tooltip.innerText = 'Click to Copy';
            }, 2000);
          }
        }).catch(err => {
          console.error('Could not copy text: ', err);
        });
      }
    });
  });


  // 12. INTERSECTION OBSERVER FOR ENTRANCE ANIMATIONS
  let observerStarted = false;

  function initScrollAnimations() {
    const animElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          
          if (entry.target.id === 'about' && !observerStarted) {
            observerStarted = true;
            setTimeout(animateStatsCounter, 300);
          }
        }
      });
    }, {
      threshold: 0.12
    });

    animElements.forEach(el => observer.observe(el));
  }


  // 13. DYNAMIC CONTACT FORM SYSTEM
  const contactForm = document.getElementById('contact-form');
  let isSubmitting = false;

  // HTML escaping utility for security
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Premium Toast Notification Function
  function showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `notification-toast ${type}`;
    
    const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark';
    
    toast.innerHTML = `
      <div class="notification-icon">
        <i class="${iconClass}" aria-hidden="true"></i>
      </div>
      <div class="notification-content">
        <div class="notification-title">${escapeHTML(title)}</div>
        <div class="notification-message">${escapeHTML(message).replace(/\n/g, '<br>')}</div>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.add('active');
    }, 10);
    
    // Automatically hide after 5 seconds
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 5000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isSubmitting) return;

      const btn = contactForm.querySelector('.form-submit-btn');
      const btnText = btn ? btn.querySelector('.btn-text') : null;
      const btnIcon = btn ? btn.querySelector('i') : null;

      // Fetch input elements
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const phoneInput = document.getElementById('form-phone');
      const subjectInput = document.getElementById('form-subject');
      const msgInput = document.getElementById('form-msg');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const projectType = subjectInput ? subjectInput.value.trim() : '';
      const message = msgInput ? msgInput.value.trim() : '';

      // Spam honeypot validation
      const honeyInput = document.getElementById('form-honey');
      if (honeyInput && honeyInput.value.trim() !== '') {
        // Pretend submission was successful to deceive the spam bot
        showToast('success', 'Thank you!', 'Your inquiry has been received successfully.\nOur team will contact you soon.');
        const successOverlay = document.getElementById('form-success-overlay');
        if (successOverlay) {
          successOverlay.classList.add('active');
          setTimeout(() => {
            successOverlay.classList.remove('active');
          }, 5000);
        }
        contactForm.reset();
        return;
      }

      // ES6 Validation
      if (!name || !email || !phone || !projectType || !message) {
        showToast('error', 'Something went wrong.', 'Please fill in all required fields.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('error', 'Something went wrong.', 'Please enter a valid email address.');
        return;
      }

      // Enter submitting state
      isSubmitting = true;
      if (btn) btn.disabled = true;
      if (btnText) btnText.innerText = 'Submitting...';
      if (btnIcon) btnIcon.className = 'fa-solid fa-spinner fa-spin';

      const payload = {
        name,
        email,
        phone,
        projectType,
        message
      };

      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycby5P-JdWxcUZw28SCgNEn5FH-gDwxHG77WSm9x2awn2wrPp8ymXVuHZeP8Sczu7YcTcYA/exec', {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const isSuccess = result && (
          result.status === 'success' || 
          result.result === 'success' || 
          (result.message && result.message.toLowerCase().includes('success'))
        );

        if (isSuccess) {
          showToast('success', 'Thank you!', 'Your inquiry has been received successfully.\nOur team will contact you soon.');
          
          // Show form success overlay
          const successOverlay = document.getElementById('form-success-overlay');
          if (successOverlay) {
            successOverlay.classList.add('active');
            setTimeout(() => {
              successOverlay.classList.remove('active');
            }, 5000);
          }
          
          contactForm.reset();
        } else {
          throw new Error((result && result.message) || 'Submission failed');
        }
      } catch (err) {
        console.error('Form submission failed:', err);
        showToast('error', 'Something went wrong.', 'Please try again.');
      } finally {
        // Exit submitting state
        if (btn) btn.disabled = false;
        if (btnText) btnText.innerText = 'Transmit Request';
        if (btnIcon) btnIcon.className = 'fa-solid fa-paper-plane';
        isSubmitting = false;
      }
    });
  }

});
