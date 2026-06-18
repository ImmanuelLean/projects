/**
 * NEBULA VAULT - PORTAL LOGIC & ANIMATIONS
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFormTransitions();
  initPasswordToggles();
  initFormValidation();
  initBackgroundAnimation();
});

/* ==========================================
   1. THEME TOGGLER (LocalStorage Persistence)
   ========================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlElement = document.documentElement;

  // Retrieve theme preference or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = htmlElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Trigger visual ripple/bounce effect on click
    themeToggleBtn.style.transform = 'scale(0.85)';
    setTimeout(() => {
      themeToggleBtn.style.transform = 'translateY(-2px)';
    }, 150);
  });
}

/* ==========================================
   2. FORM VIEWS & TABS SWITCHING
   ========================================== */
function initFormTransitions() {
  const tabsContainer = document.getElementById('form-tabs-container');
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const toForgotBtn = document.getElementById('to-forgot');
  const forgotBackBtn = document.getElementById('forgot-back-btn');
  
  const loginView = document.getElementById('login-view');
  const signupView = document.getElementById('signup-view');
  const forgotView = document.getElementById('forgot-view');

  const formViews = [loginView, signupView, forgotView];

  function switchView(targetViewId) {
    formViews.forEach(view => {
      if (view.id === targetViewId) {
        view.style.display = 'flex';
        // Minor timeout to trigger CSS transitions after display change
        setTimeout(() => {
          view.classList.add('active');
        }, 10);
      } else {
        view.classList.remove('active');
        view.style.display = 'none';
      }
    });

    // Handle tab container visibility
    if (targetViewId === 'forgot-view') {
      tabsContainer.style.opacity = '0';
      tabsContainer.style.pointerEvents = 'none';
      tabsContainer.style.transform = 'translateY(-10px)';
      tabsContainer.style.transition = 'all 0.3s ease';
    } else {
      tabsContainer.style.opacity = '1';
      tabsContainer.style.pointerEvents = 'auto';
      tabsContainer.style.transform = 'translateY(0)';
      
      // Update tab active state based on view
      if (targetViewId === 'login-view') {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
      } else if (targetViewId === 'signup-view') {
        tabLogin.classList.remove('active');
        tabSignup.classList.add('active');
      }
    }
  }

  // Switch by tabs
  tabLogin.addEventListener('click', () => switchView('login-view'));
  tabSignup.addEventListener('click', () => switchView('signup-view'));

  // Switch to Forgot Password
  toForgotBtn.addEventListener('click', () => switchView('forgot-view'));

  // Back from Forgot Password
  forgotBackBtn.addEventListener('click', () => switchView('login-view'));
}

/* ==========================================
   3. PASSWORD SHOW/HIDE TOGGLES
   ========================================== */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.password-toggle');

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const eyeIcon = btn.querySelector('.eye-icon');
      const eyeOffIcon = btn.querySelector('.eye-off-icon');

      if (input.type === 'password') {
        input.type = 'text';
        eyeIcon.classList.add('hidden');
        eyeOffIcon.classList.remove('hidden');
      } else {
        input.type = 'password';
        eyeIcon.classList.remove('hidden');
        eyeOffIcon.classList.add('hidden');
      }
      
      // Keep input focused
      input.focus();
    });
  });
}

/* ==========================================
   4. FORM VALIDATION & INTERACTIVE FEEDBACK
   ========================================== */
function initFormValidation() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const forgotForm = document.getElementById('forgot-form');
  const authCard = document.querySelector('.auth-card');

  // Input groups event listeners to clear error dynamically
  const inputs = document.querySelectorAll('.input-group input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const group = input.parentElement;
      if (input.value.trim() !== '') {
        group.classList.remove('invalid');
      }
    });
    
    // Also clear errors on blur if it's filled
    input.addEventListener('blur', () => {
      validateField(input);
    });
  });

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase().trim());
  }

  function validateField(input) {
    const group = input.parentElement;
    let isValid = true;

    // Check empty value
    if (input.required && input.value.trim() === '') {
      isValid = false;
    } 
    // Check specific validation cases
    else if (input.type === 'email' && !validateEmail(input.value)) {
      isValid = false;
    } 
    else if (input.id === 'signup-password' && input.value.length < 8) {
      isValid = false;
    }
    else if (input.type === 'checkbox' && input.required && !input.checked) {
      isValid = false;
    }

    if (!isValid) {
      group.classList.add('invalid');
    } else {
      group.classList.remove('invalid');
    }

    return isValid;
  }

  function triggerCardShake() {
    authCard.classList.add('shake');
    setTimeout(() => {
      authCard.classList.remove('shake');
    }, 450);
  }

  function showToast(message) {
    const toast = document.getElementById('success-toast');
    const toastMsg = toast.querySelector('.toast-message');
    toastMsg.textContent = message;
    
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // Login Submit
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    const isEmailValid = validateField(emailInput);
    const isPasswordValid = validateField(passwordInput);

    if (isEmailValid && isPasswordValid) {
      showToast('Signed in successfully! Access granted.');
      loginForm.reset();
      // Remove class tags triggering floating labels
      inputs.forEach(i => i.parentElement.classList.remove('invalid'));
    } else {
      triggerCardShake();
    }
  });

  // Signup Submit
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const agreeCheck = document.getElementById('signup-agree');

    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isPasswordValid = validateField(passwordInput);
    
    // Special checkbox validator
    const isAgreeValid = agreeCheck.checked;
    const agreeGroup = agreeCheck.parentElement;
    if (!isAgreeValid) {
      agreeGroup.style.color = 'var(--color-error)';
    } else {
      agreeGroup.style.color = 'var(--text-muted)';
    }

    agreeCheck.addEventListener('change', () => {
      if (agreeCheck.checked) {
        agreeGroup.style.color = 'var(--text-muted)';
      }
    });

    if (isNameValid && isEmailValid && isPasswordValid && isAgreeValid) {
      showToast('Account created! Verification email sent.');
      signupForm.reset();
      inputs.forEach(i => i.parentElement.classList.remove('invalid'));
    } else {
      triggerCardShake();
    }
  });

  // Forgot Password Submit
  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('forgot-email');
    const isEmailValid = validateField(emailInput);

    if (isEmailValid) {
      showToast('Password recovery instructions sent to email.');
      forgotForm.reset();
      inputs.forEach(i => i.parentElement.classList.remove('invalid'));
    } else {
      triggerCardShake();
    }
  });
}

/* ==========================================
   5. INTERACTIVE PARTICLES CONSTELLATION
   ========================================== */
function initBackgroundAnimation() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let animationFrameId;

  let particlesArray = [];
  const numberOfParticles = 55;
  const maxConnectionDistance = 140;

  // Track Mouse Pointer Coordinates
  let mouse = {
    x: null,
    y: null,
    radius: 150
  };

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle Resize
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Particle Blueprint
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Bounce off boundaries
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Physics logic for mouse interactions
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          // Attract particles slightly towards the cursor
          const force = (mouse.radius - distance) / mouse.radius;
          this.x += (dx / distance) * force * 1.8;
          this.y += (dy / distance) * force * 1.8;
        }
      }

      // Normal movement
      this.x += this.directionX;
      this.y += this.directionY;
      
      this.draw();
    }
  }

  // Populate Array with custom particles
  function initParticles() {
    particlesArray = [];
    
    // Choose appropriate color based on dark/light mode
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const particleColor = isLight ? 'rgba(99, 102, 241, 0.25)' : 'rgba(139, 92, 246, 0.35)';

    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 1.5;
      let x = Math.random() * (innerWidth - size * 2) + size;
      let y = Math.random() * (innerHeight - size * 2) + size;
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;

      particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
    }
  }

  // Connect close nodes with thin lines
  function connectParticles() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const lineColorBase = isLight ? '99, 102, 241' : '139, 92, 246';

    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxConnectionDistance) {
          // Opacity fades out based on distance
          const opacity = (1 - (distance / maxConnectionDistance)) * 0.15;
          ctx.strokeStyle = `rgba(${lineColorBase}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Loop runner
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    
    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  }

  // Restart particle colors when theme toggles
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        initParticles();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // Start Loop
  animate();
}
