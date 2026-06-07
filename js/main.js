// ===== DOM =====
const cursorCircle = document.getElementById('cursorCircle');
const cursorText = document.getElementById('cursorText');
const heroTitle = document.getElementById('heroTitle');
const nav = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');
const navIndicator = document.getElementById('navIndicator');

// ===== 状态 =====
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let circleX = mouseX;
let circleY = mouseY;
const LERP = 0.08;

// ===== 初始化 =====
function init() {
  setupCursor();
  setupTitle3D();
  setupNav();
  setupNavIndicator();
  setupScrollFadeIn();
  setupStatCounter();
  setupSkillCards();
}

// ===== 1. 黑圈跟随鼠标 =====
function setupCursorCircle() {
  // 跟随动画循环
  function animate() {
    circleX += (mouseX - circleX) * LERP;
    circleY += (mouseY - circleY) * LERP;
    cursorCircle.style.left = circleX + 'px';
    cursorCircle.style.top = circleY + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  // 鼠标移动更新目标位置
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // 鼠标进入页面时显示黑圈
  document.addEventListener('mouseenter', () => {
    cursorCircle.classList.add('visible');
  });

  // 鼠标离开页面时隐藏黑圈
  document.addEventListener('mouseleave', () => {
    cursorCircle.classList.remove('visible');
  });
}

// ===== 2. 黑圈文字遮罩 — 根据位置显示中文 =====
function setupCursorText() {
  const titleEl = document.getElementById('heroTitle');
  if (!titleEl) return;

  document.addEventListener('mousemove', (e) => {
    const rect = titleEl.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;

    if (e.clientY > rect.top && e.clientY < rect.bottom && relX >= 0 && relX <= 1) {
      cursorCircle.classList.add('visible');
      cursorText.classList.add('show');

      if (relX < 0.45) {
        cursorText.textContent = '你好';
      } else if (relX < 0.65) {
        cursorText.textContent = '我是';
      } else {
        cursorText.textContent = '查胜海';
      }
    } else {
      cursorText.classList.remove('show');
      cursorText.textContent = '';
    }
  });
}

// ===== 3. 标题 3D 透视倾斜 =====
function setupTitle3D() {
  const title = document.getElementById('heroTitle');
  if (!title) return;

  document.addEventListener('mousemove', (e) => {
    const rect = title.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angleX = (e.clientY - centerY) / 50;
    const angleY = (centerX - e.clientX) / 50;

    title.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
  });
}

// ===== 4. 导航栏 =====
function setupNav() {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    navToggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      navToggle.classList.remove('active');
    });
  });

  // 滚动时导航栏样式
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ===== 5. 导航指示器滑动 =====
function setupNavIndicator() {
  updateNavIndicator();

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(updateNavIndicator, 300);
    });
  });
}

function updateNavIndicator() {
  const activeLink = navLinks.querySelector('.nav-link.active');
  if (!activeLink || !navIndicator) return;

  const linkRect = activeLink.getBoundingClientRect();
  const navRect = navLinks.getBoundingClientRect();

  navIndicator.style.left = (linkRect.left - navRect.left) + 'px';
  navIndicator.style.width = linkRect.width + 'px';
}

function updateActiveNavLink() {
  const sections = ['hero', 'skills', 'projects', 'contact'];
  let current = 'hero';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 3) {
        current = id;
      }
    }
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });

  updateNavIndicator();
}

// ===== 6. 滚动淡入动画 =====
function setupScrollFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.1}s`;
    observer.observe(el);
  });
}

// ===== 7. 数字计数器 =====
function setupStatCounter() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        animateNumber(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(el => observer.observe(el));
}

function animateNumber(el, target, duration = 1500) {
  const startTime = performance.now();
  const isFloat = target % 1 !== 0;

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = target * ease;
    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ===== 8. 技能卡片展开/折叠 =====
function setupSkillCards() {
  document.querySelectorAll('.skill-card[data-expand]').forEach(card => {
    const targetId = card.dataset.expand;
    const panel = document.getElementById(targetId);
    if (!panel) return;

    const expandBtn = card.querySelector('.skill-card-expand');

    card.addEventListener('click', () => {
      const isOpen = panel.classList.contains('open');

      if (isOpen) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.offsetHeight;
        panel.style.maxHeight = '0';
        panel.classList.remove('open');
        if (expandBtn) expandBtn.textContent = '查看详情 ↓';
      } else {
        panel.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        if (expandBtn) expandBtn.textContent = '收起 ↑';
        setTimeout(() => {
          if (panel.classList.contains('open')) panel.style.maxHeight = 'none';
        }, 400);
      }
    });
  });
}

// ===== 合并初始化 =====
function setupCursor() {
  setupCursorCircle();
  setupCursorText();
}

// ===== 控制台 =====
console.log('%c👋 Hi, I\'m 查胜海', 'font-size: 24px; font-weight: bold; color: #111;');
console.log('%c📧 1320843216@qq.com', 'font-size: 14px; color: #666;');
console.log('%c🔗 github.com/zhashenghai', 'font-size: 14px; color: #666;');

// ===== 启动 =====
document.addEventListener('DOMContentLoaded', init);
