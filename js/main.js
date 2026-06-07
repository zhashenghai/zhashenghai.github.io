// ===== DOM =====
const cursorCircle = document.getElementById('cursorCircle');
const heroTitle = document.getElementById('heroTitle');
const nav = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');
const navIndicator = document.getElementById('navIndicator');
const pageLoader = document.getElementById('pageLoader');
const parallaxShapes = document.getElementById('parallaxShapes');
const revealLine1 = document.getElementById('revealLine1');
const revealLine2 = document.getElementById('revealLine2');
const heroSection = document.getElementById('hero');

// ===== 状态 =====
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let circleX = mouseX;
let circleY = mouseY;
const LERP = 0.08;
const CIRCLE_R = 175;
let isInHero = true;

// ===== 初始化 =====
function init() {
  setupPageLoader();
  setupCursor();
  setupTitle3D();
  setupNav();
  setupNavIndicator();
  setupScrollFadeIn();
  setupSkillCards();
  setupParallax();
  setupHeroScrollSnap();
}

// ===== Hero 滚轮一切：滚动一下直接跳到下一板块 =====
function setupHeroScrollSnap() {
  if (!heroSection) return;
  let isScrolling = false;

  document.addEventListener('wheel', (e) => {
    if (isScrolling) return;

    // 在 hero 区域向下滚 → snap 到 skills
    if (heroSection.contains(e.target) && e.deltaY > 0) {
      e.preventDefault();
      isScrolling = true;
      const nextSection = document.getElementById('skills');
      if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => { isScrolling = false; }, 1200);
      return;
    }

    // 在技能区顶部附近向上滚 → snap 回 hero
    if (e.deltaY < 0) {
      const skillsSection = document.getElementById('skills');
      if (skillsSection) {
        const rect = skillsSection.getBoundingClientRect();
        // 技能区顶部在视口上方 200px 以内都算"边界"
        if (rect.top >= -200 && rect.top <= 200) {
          e.preventDefault();
          isScrolling = true;
          heroSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => { isScrolling = false; }, 1200);
        }
      }
    }
  }, { passive: false });
}

// ===== 0. 页面加载动画 =====
function setupPageLoader() {
  // 页面加载后移除遮罩
  setTimeout(() => {
    if (pageLoader) {
      pageLoader.classList.add('loaded');
    }
    // 触发Hero区域的动画元素
    triggerHeroAnimations();
  }, 300);
}

function triggerHeroAnimations() {
  const heroElements = document.querySelectorAll('.hero .fade-in-short');
  heroElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 500 + i * 200);
  });
}

// ===== 1. 黑圈跟随鼠标 + 圆形裁剪揭示 =====
function setupCursorCircle() {
  const titleEl = document.getElementById('heroTitle');

  function animate() {
    circleX += (mouseX - circleX) * LERP;
    circleY += (mouseY - circleY) * LERP;
    cursorCircle.style.left = circleX + 'px';
    cursorCircle.style.top = circleY + 'px';

    updateHeroVisibility();

    if (titleEl && isInHero) {
      updateRevealText(titleEl);
    }

    requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseenter', () => {
    if (isInHero) cursorCircle.classList.add('visible');
  });

  document.addEventListener('mouseleave', () => {
    cursorCircle.classList.remove('visible');
    if (revealLine1) revealLine1.classList.remove('show');
    if (revealLine2) revealLine2.classList.remove('show');
  });

  function updateHeroVisibility() {
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    const wasInHero = isInHero;
    isInHero = rect.bottom > 100;

    if (isInHero && !wasInHero) {
      cursorCircle.classList.add('visible');
    } else if (!isInHero && wasInHero) {
      cursorCircle.classList.remove('visible');
      if (revealLine1) revealLine1.classList.remove('show');
      if (revealLine2) revealLine2.classList.remove('show');
    }
  }

  function updateRevealText(titleEl) {
    const rect = titleEl.getBoundingClientRect();
    const titleLines = titleEl.querySelectorAll('.title-line');

    // 计算 h1 未变换时的原始位置（用于重叠检测）
    let h1OrigLeft = rect.left;
    let h1OrigTop = rect.top;
    if (titleEl.offsetParent) {
      const parentRect = titleEl.offsetParent.getBoundingClientRect();
      h1OrigLeft = parentRect.left + titleEl.offsetLeft;
      h1OrigTop = parentRect.top + titleEl.offsetTop;
    }

    // 检查圆圈是否与标题重叠（使用原始位置）
    const isOverTitle = circleX + CIRCLE_R > h1OrigLeft && circleX - CIRCLE_R < h1OrigLeft + titleEl.offsetWidth &&
                        circleY + CIRCLE_R > h1OrigTop && circleY - CIRCLE_R < h1OrigTop + titleEl.offsetHeight;

    if (isOverTitle && titleLines.length >= 2) {
      // 圆圈的视觉左上角
      const circleLeft = circleX - CIRCLE_R;
      const circleTop = circleY - CIRCLE_R;

      // 直接使用每个 span 自身的 offset 计算未变换的精确位置
      titleLines.forEach((line, i) => {
        const revealEl = i === 0 ? revealLine1 : revealLine2;
        if (!revealEl) return;

        // span 的 offsetParent 是 h1，用 h1 的未变换 viewport 位置 + span 的 offset 得到精确坐标
        const lineCenterX = h1OrigLeft + line.offsetLeft + line.offsetWidth / 2;
        const lineCenterY = h1OrigTop + line.offsetTop + line.offsetHeight / 2;

        revealEl.style.left = (lineCenterX - circleLeft) + 'px';
        revealEl.style.top = (lineCenterY - circleTop) + 'px';
        revealEl.style.transform = 'translate(-50%, -50%)';
        revealEl.classList.add('show');
      });
    } else {
      if (revealLine1) revealLine1.classList.remove('show');
      if (revealLine2) revealLine2.classList.remove('show');
    }
  }
}

// ===== 2. 初始化光标文字 =====
function setupCursorText() {
  // 已合并到 setupCursorCircle 中
}

// ===== 3. 标题 3D 透视倾斜（方向已矫正） =====
function setupTitle3D() {
  const title = document.getElementById('heroTitle');
  if (!title) return;

  document.addEventListener('mousemove', (e) => {
    const rect = title.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 翻转方向：鼠标在哪侧，标题就向哪侧倾斜
    const angleX = -(e.clientY - centerY) / 50;
    const angleY = (e.clientX - centerX) / 50;

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
  const sections = ['hero', 'skills', 'intern', 'projects', 'contact'];
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
        // 为同级元素添加交错延迟
        const parent = entry.target.parentElement;
        const siblings = parent ? parent.querySelectorAll('.fade-in') : [];
        let index = 0;
        siblings.forEach((sib, i) => {
          if (sib === entry.target) index = i;
        });
        entry.target.style.transitionDelay = `${index * 0.15}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => {
    // 不观察hero区域的元素（已由triggerHeroAnimations处理）
    if (!el.closest('.hero')) {
      observer.observe(el);
    }
  });
}

// ===== 7. 技能卡片展开/折叠 =====
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

// ===== 9. 视差滚动效果 =====
function setupParallax() {
  if (!parallaxShapes) return;
  const shapes = parallaxShapes.querySelectorAll('.parallax-shape');
  
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        shapes.forEach(shape => {
          const speed = parseFloat(shape.dataset.speed) || 0.2;
          shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ===== 控制台 =====
console.log('%c👋 Hi, I\'m 查胜海', 'font-size: 24px; font-weight: bold; color: #111;');
console.log('%c📧 1320843216@qq.com', 'font-size: 14px; color: #666;');
console.log('%c🔗 github.com/zhashenghai', 'font-size: 14px; color: #666;');

// ===== 启动 =====
document.addEventListener('DOMContentLoaded', init);
