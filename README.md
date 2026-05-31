# 查胜海 - 个人网站

🎯 **求职工具** | Soft Structuralism 清亮风格 | 高端设计 | GitHub Pages 托管

## 设计特色 (redesign-existing-projects 优化)

### 视觉风格
- **Soft Structuralism** — 白色/银灰色背景，清亮透气
- **Plus Jakarta Sans** — 高端 Grotesk 字体
- **噪点纹理** — 微妙的 film-grain 叠加层，增加质感
- **柔和阴影** — 大量留白，浮层卡片设计

### 交互体验
- **全屏滚动** — scroll-snap 整屏切换，滚轮/触控板驱动
- **入场动画** — 元素 fade-up + blur 解除，cubic-bezier 弹簧物理
- **进度指示** — 右侧圆点导航，点击可跳转
- **键盘支持** — ↑↓ / PageUp/PageDown 切换 section
- **数字滚动** — 统计数据数字动画

### 设计规范
- Double-Bezel 卡片架构（外层壳 + 内层核）
- Button-in-Button 按钮系统
- 100px 圆角胶囊元素
- 响应式布局（PC + 移动端）

### 无障碍优化 (WCAG)
- Focus ring 可见轮廓
- Skip-to-content 跳转链接
- 语义化 HTML 标签
- aria-label 标签

### SEO 优化
- meta description 描述
- Open Graph 社交分享标签
- Favicon 网站图标

### 视觉增强
- tabular-nums 数字等宽显示
- 更强的卡片 hover 阴影效果
- Hero 装饰元素动态浮动动画

## 技术栈

- HTML5
- CSS3 (CSS Variables, Grid, Flexbox, scroll-snap)
- 原生 JavaScript (IntersectionObserver)
- Google Fonts (Plus Jakarta Sans + Noto Sans SC)

## 预览方式

1. **直接打开**：双击 `index.html` 文件
2. **本地服务器**：运行 `python -m http.server 8000` 后访问 http://localhost:8000

## 操作说明

- 🖱️ **滚轮/触控板** — 整屏滚动切换
- ⌨️ **↑↓ 键盘** — 上下切换 section
- 🔘 **右侧圆点** — 点击跳转到对应 section
- 📱 **移动端** — 触摸滑动，菜单自适应

## 文件结构

```
personal-web/
├── index.html      # 主页面
├── css/style.css   # 样式（清亮高端风格）
├── js/main.js      # 交互逻辑
└── README.md       # 说明文档
```

---

Designed with ❤️ using high-end-visual-design skill
