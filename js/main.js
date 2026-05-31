// ===== DOM 元素 =====
const snapContainer = document.getElementById('snapContainer');
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const progressDots = document.querySelectorAll('.progress-dot');
const sections = document.querySelectorAll('.snap-section');
const animateElements = document.querySelectorAll('.animate-in');
const statNumbers = document.querySelectorAll('.stat-number');
const projectExpandBtns = document.querySelectorAll('.project-expand-btn');

// ===== 状态 =====
let currentSection = 0;
let isScrolling = false;
let scrollTimeout;

// ===== 初始化 =====
function init() {
  setupScrollObserver();
  setupNavToggle();
  setupProgressDots();
  setupProjectCards();
  setupSmoothScrollLinks();
  animateOnLoad();
}

// ===== 滚动观察器 - 检测当前section =====
function setupScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        const index = Array.from(sections).indexOf(entry.target);
        if (index !== -1) {
          updateActiveSection(index);
        }
      }
    });
  }, {
    threshold: 0.5,
    root: snapContainer
  });

  sections.forEach(section => observer.observe(section));
}

// ===== 更新活跃section =====
function updateActiveSection(index) {
  if (currentSection === index) return;
  currentSection = index;

  // 更新进度点
  progressDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  // 更新导航链接
  document.querySelectorAll('.nav-link').forEach((link, i) => {
    link.classList.toggle('active', i === index - 1); // -1因为hero没有对应链接
  });

  // 更新导航栏样式
  if (index > 0) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

// ===== 元素入场动画 =====
function setupScrollObserver() {
  // Section 观察器
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        const index = Array.from(sections).indexOf(entry.target);
        if (index !== -1) {
          updateActiveSection(index);
        }
      }
    });
  }, {
    threshold: 0.5,
    root: snapContainer
  });

  sections.forEach(section => sectionObserver.observe(section));

  // 动画元素观察器
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animateObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    root: snapContainer,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(el => animateObserver.observe(el));
}

// ===== 数字滚动动画 =====
function animateNumber(element, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  const isFloat = target % 1 !== 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // easeOutExpo 缓动
    const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = start + (target - start) * easeOutExpo;

    if (isFloat) {
      element.textContent = current.toFixed(1);
    } else {
      element.textContent = Math.floor(current);
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// 数字动画观察器
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseFloat(entry.target.dataset.target);
      animateNumber(entry.target, target);
      statObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.5,
  root: snapContainer
});

statNumbers.forEach(num => statObserver.observe(num));

// ===== 移动端菜单 =====
function setupNavToggle() {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    navToggle.classList.toggle('active');
  });

  // 点击链接关闭菜单
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      navToggle.classList.remove('active');
    });
  });
}

// ===== 进度点点击 =====
function setupProgressDots() {
  progressDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      sections[index].scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ===== 项目卡片展开 =====
function setupProjectCards() {
  projectExpandBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      const detail = card.querySelector('.project-detail');

      btn.classList.toggle('active');
      detail.classList.toggle('show');
    });
  });
}

// ===== 平滑滚动链接 =====
function setupSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ===== 页面加载动画 =====
function animateOnLoad() {
  // 延迟一帧确保CSS已应用
  requestAnimationFrame(() => {
    // Hero section 的元素立即显示
    const heroElements = document.querySelectorAll('#hero .animate-in');
    heroElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, i * 150);
    });
  });
}

// ===== 键盘导航 =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    if (currentSection < sections.length - 1) {
      sections[currentSection + 1].scrollIntoView({ behavior: 'smooth' });
    }
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    if (currentSection > 0) {
      sections[currentSection - 1].scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// ===== 控制台彩蛋 =====
console.log('%c👋 Hi, I\'m 查胜海', 'font-size: 24px; font-weight: bold; color: #0071E3;');
console.log('%c📧 Contact: 1320843216@qq.com', 'font-size: 14px; color: #6E6E73;');
console.log('%c🔗 GitHub: https://github.com/zhashenghai', 'font-size: 14px; color: #6E6E73;');
console.log('%c✨ Built with high-end-visual-design skill', 'font-size: 12px; color: #AEAEB2;');

// ===== 启动 =====
document.addEventListener('DOMContentLoaded', init);
