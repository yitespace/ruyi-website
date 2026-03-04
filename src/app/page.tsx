'use client';

import { useEffect, useState, useCallback } from 'react';

// 安全的粒子生成函数
function createParticles(container: HTMLElement | null) {
  if (!container) return;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particleCount = isMobile ? 25 : 40;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 12 + 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = (Math.random() * 100) + '%';
    particle.style.top = (Math.random() * 100 + 100) + '%';
    particle.style.animationDelay = (Math.random() * 15) + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    container.appendChild(particle);
  }
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [particlesContainer, setParticlesContainer] = useState<HTMLDivElement | null>(null);

  // 初始化粒子
  useEffect(() => {
    const container = document.getElementById('particles') as HTMLDivElement | null;
    setParticlesContainer(container);
  }, []);

  useEffect(() => {
    createParticles(particlesContainer);
  }, [particlesContainer]);

  // 加载动画
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // 滚动监听
  const handleScroll = useCallback(() => {
    setShowBackToTop(window.scrollY > 200);
    const sections = ['home', 'about', 'hobbies', 'contact'];
    const scrollPos = window.scrollY + window.innerHeight / 3;

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        if (scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  // 阻止身体滚动当菜单打开时
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      {/* 加载动画 */}
      {loading && (
        <div className="loading" id="loading" aria-hidden="true">
          <div className="loading-spinner" role="status">
            <span className="sr-only">加载中...</span>
          </div>
        </div>
      )}

      {/* 粒子背景 */}
      <div className="particles" id="particles" aria-hidden="true" ref={setParticlesContainer} />

      {/* 菜单遮罩 */}
      <div
        className={`nav-overlay ${menuOpen ? 'active' : ''}`}
        id="navOverlay"
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />

      {/* 侧边菜单 */}
      <nav
        className={`mobile-nav ${menuOpen ? 'active' : ''}`}
        id="mobileNav"
        role="navigation"
        aria-label="主导航"
        aria-hidden={!menuOpen}
      >
        <button
          className="menu-close-btn"
          onClick={() => setMenuOpen(false)}
          aria-label="关闭菜单"
        >
          ✕
        </button>
        <ul role="menubar">
          <li role="none">
            <button role="menuitem" onClick={() => scrollTo('home')}>🏠 首页</button>
          </li>
          <li role="none">
            <button role="menuitem" onClick={() => scrollTo('about')}>💕 关于我</button>
          </li>
          <li role="none">
            <button role="menuitem" onClick={() => scrollTo('hobbies')}>🎨 兴趣爱好</button>
          </li>
          <li role="none">
            <button role="menuitem" onClick={() => scrollTo('contact')}>💌 联系方式</button>
          </li>
          <li role="none">
            <a href="/quiz" role="menuitem">💖 契合度测试</a>
          </li>
          <li role="none">
            <a href="/messages" role="menuitem">📝 留言墙</a>
          </li>
          <li role="none">
            <a href="/admin/login" role="menuitem">🔐 管理端</a>
          </li>
        </ul>
      </nav>

      {/* 主容器 */}
      <div className="container">
        {/* 顶部导航栏 */}
        <header role="banner">
          <div className="logo">✨ 汝意的世界</div>
          <button
            className="menu-btn"
            id="menuBtn"
            onClick={() => setMenuOpen(true)}
            aria-label="打开菜单"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </header>

        {/* 英雄区域 */}
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="avatar-container" aria-hidden="true">
            <div className="avatar-ring" />
            <div className="avatar">👸</div>
          </div>
          <h1 id="hero-title">欢迎来到<br />我的世界 🌸</h1>
          <p>你好呀！我是 ruyi！一个热爱生活、充满好奇心的女孩。这里是我分享生活的小天地～</p>
          <button className="btn" onClick={() => scrollTo('about')}>了解更多 ↓</button>
        </section>

        {/* 关于我 */}
        <section className="section" id="about" aria-labelledby="about-title">
          <h2 id="about-title" className="section-title">关于我 💕</h2>
          <div className="about-grid">
            <article className="about-card">
              <h3>🎀 我是谁</h3>
              <p>一个温柔善良、乐观向上的女生。喜欢探索新事物，享受生活中的每一个小确幸。</p>
            </article>
            <article className="about-card">
              <h3>🌟 我的特点</h3>
              <p>细心、有耐心、富有创造力。对待朋友真诚，对待生活热情满满！</p>
            </article>
            <article className="about-card">
              <h3>💫 我的梦想</h3>
              <p>成为更好的自己，去更多地方，见更多人，体验更精彩的人生！</p>
            </article>
          </div>
        </section>

        {/* 兴趣爱好 */}
        <section className="section" id="hobbies" aria-labelledby="hobbies-title">
          <h2 id="hobbies-title" className="section-title">兴趣爱好 🎨</h2>
          <div className="hobbies-container" role="list">
            <div className="hobbies">
              {['📸 摄影', '🎨 绘画', '📚 阅读', '🎵 音乐', '✈️ 旅行', '🍰 美食', '🌸 花艺', '💄 美妆', '🎬 电影', '🧘 瑜伽'].map((hobby) => (
                <div key={hobby} className="hobby-tag" role="listitem">{hobby}</div>
              ))}
            </div>
          </div>
        </section>

        {/* 联系方式 */}
        <section className="contact" id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title" className="section-title">联系我 💌</h2>
          <p>欢迎和我交朋友！期待与你相遇～</p>
          <div className="social-links" role="navigation" aria-label="社交媒体链接">
            <a className="social-link" href="#" title="微信" aria-label="微信">💬</a>
            <a className="social-link" href="#" title="微博" aria-label="微博">📱</a>
            <a className="social-link" href="#" title="邮箱" aria-label="邮箱">📧</a>
            <a className="social-link" href="#" title="小红书" aria-label="小红书">📕</a>
            <a className="social-link" href="#" title="抖音" aria-label="抖音">🎵</a>
          </div>
        </section>

        {/* 快捷链接 */}
        <section className="quick-links" aria-label="快捷链接">
          <a href="/quiz" className="quick-link-card">
            <span className="quick-link-icon" aria-hidden="true">💖</span>
            <span className="quick-link-title">契合度测试</span>
            <span className="quick-link-desc">测测我们的默契</span>
          </a>
          <a href="/messages" className="quick-link-card">
            <span className="quick-link-icon" aria-hidden="true">📝</span>
            <span className="quick-link-title">留言墙</span>
            <span className="quick-link-desc">留下你的足迹</span>
          </a>
        </section>

        {/* 页脚 */}
        <footer role="contentinfo">
          <p>© 2026 汝意的个人主页</p>
          <p>用爱制作 💖 | 欢迎来到我的世界</p>
        </footer>
      </div>

      {/* 底部导航栏 - 仅移动端 */}
      <div className="bottom-nav" role="navigation" aria-label="底部导航">
        <button
          className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
          onClick={() => scrollTo('home')}
          aria-label="返回首页"
          aria-current={activeSection === 'home' ? 'true' : undefined}
        >
          🏠
        </button>
        <button
          className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
          onClick={() => scrollTo('about')}
          aria-label="关于我"
          aria-current={activeSection === 'about' ? 'true' : undefined}
        >
          💕
        </button>
        <button
          className={`nav-link ${activeSection === 'hobbies' ? 'active' : ''}`}
          onClick={() => scrollTo('hobbies')}
          aria-label="兴趣爱好"
          aria-current={activeSection === 'hobbies' ? 'true' : undefined}
        >
          🎨
        </button>
        <a className="nav-link" href="/quiz" aria-label="契合度测试">💖</a>
        <a className="nav-link" href="/messages" aria-label="留言墙">📝</a>
      </div>

      {/* 返回顶部按钮 */}
      <button
        className={`back-to-top ${showBackToTop ? 'show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="返回顶部"
      >
        ↑
      </button>

      <style jsx global>{`
        /* ========== 基础样式 - 移动端优先 ========== */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        body {
          font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          min-height: 100vh;
          overflow-x: hidden;
          color: #fff;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* 屏幕阅读器专用 */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        /* 加载动画 */
        .loading {
          position: fixed;
          inset: 0;
          background: linear-gradient(180deg, #667eea, #764ba2, #f093fb);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 0.4s ease, visibility 0.4s ease;
        }
        .loading.hidden {
          opacity: 0;
          visibility: hidden;
        }
        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* 粒子背景 */
        .particles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          animation: float 15s infinite;
          will-change: transform;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }

        /* 主容器 */
        .container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          padding: 12px;
          padding-bottom: 100px;
        }

        /* 顶部导航栏 */
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          margin-bottom: 16px;
          position: sticky;
          top: 12px;
          z-index: 100;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .logo {
          font-size: 18px;
          font-weight: 600;
          background: linear-gradient(45deg, #fff, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* 汉堡菜单按钮 */
        .menu-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
        }
        .menu-btn:active {
          transform: scale(0.95);
        }
        .menu-btn span {
          width: 20px;
          height: 2.5px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .menu-btn[aria-expanded="true"] span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .menu-btn[aria-expanded="true"] span:nth-child(2) {
          opacity: 0;
        }
        .menu-btn[aria-expanded="true"] span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        /* 侧边菜单 */
        .mobile-nav {
          position: fixed;
          top: 0;
          right: -100%;
          width: 85%;
          max-width: 320px;
          height: 100vh;
          background: linear-gradient(180deg, rgba(102, 126, 234, 0.98), rgba(118, 75, 162, 0.98));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 1000;
          padding: 60px 24px 24px;
          transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -5px 0 30px rgba(0, 0, 0, 0.4);
          overflow-y: auto;
        }
        .mobile-nav.active {
          right: 0;
        }
        .menu-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .menu-close-btn:active {
          transform: scale(0.9);
          background: rgba(255, 255, 255, 0.25);
        }
        .mobile-nav ul {
          list-style: none;
          margin-top: 20px;
        }
        .mobile-nav li {
          margin-bottom: 8px;
          opacity: 0;
          transform: translateX(20px);
          transition: all 0.3s ease;
        }
        .mobile-nav.active li {
          opacity: 1;
          transform: translateX(0);
        }
        .mobile-nav li:nth-child(1) { transition-delay: 0.08s; }
        .mobile-nav li:nth-child(2) { transition-delay: 0.12s; }
        .mobile-nav li:nth-child(3) { transition-delay: 0.16s; }
        .mobile-nav li:nth-child(4) { transition-delay: 0.2s; }
        .mobile-nav li:nth-child(5) { transition-delay: 0.24s; }
        .mobile-nav li:nth-child(6) { transition-delay: 0.28s; }
        .mobile-nav li:nth-child(7) { transition-delay: 0.32s; }
        .mobile-nav li button,
        .mobile-nav li a {
          display: block;
          width: 100%;
          padding: 16px 20px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 17px;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mobile-nav li button:active,
        .mobile-nav li a:active {
          background: rgba(255, 255, 255, 0.15);
        }

        /* 菜单遮罩 */
        .nav-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .nav-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        /* 英雄区域 */
        .hero {
          text-align: center;
          padding: 36px 16px 48px;
          animation: fadeIn 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .avatar-container {
          width: 120px;
          height: 120px;
          margin: 0 auto 20px;
          position: relative;
        }
        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(45deg, #ff6b9d, #c44569, #f093fb);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 52px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          animation: pulse 2s infinite;
          border: 3px solid rgba(255, 255, 255, 0.3);
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          }
          50% {
            box-shadow: 0 8px 36px rgba(255, 107, 157, 0.4);
          }
        }
        .avatar-ring {
          position: absolute;
          inset: -6px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          animation: rotate 8s linear infinite;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .hero h1 {
          font-size: 26px;
          margin-bottom: 12px;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
          line-height: 1.35;
        }
        .hero p {
          font-size: 15px;
          max-width: 360px;
          margin: 0 auto 24px;
          opacity: 0.95;
          padding: 0 8px;
        }
        .btn {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          color: #fff;
          text-decoration: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(255, 107, 157, 0.35);
          border: none;
          cursor: pointer;
        }
        .btn:active {
          transform: scale(0.96);
          box-shadow: 0 3px 12px rgba(255, 107, 157, 0.35);
        }

        /* 通用区块 */
        .section {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 18px;
          padding: 28px 16px;
          margin: 16px 0;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .section-title {
          font-size: 22px;
          text-align: center;
          margin-bottom: 24px;
          position: relative;
          font-weight: 600;
        }
        .section-title::after {
          content: '';
          display: block;
          width: 50px;
          height: 3px;
          background: linear-gradient(90deg, #ff6b9d, #f093fb);
          margin: 10px auto 0;
          border-radius: 2px;
        }

        /* 关于我卡片 */
        .about-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .about-card {
          background: rgba(255, 255, 255, 0.14);
          padding: 20px 16px;
          border-radius: 14px;
          transition: all 0.25s ease;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .about-card:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.2);
        }
        .about-card h3 {
          font-size: 17px;
          margin-bottom: 10px;
          color: #ffd700;
        }
        .about-card p {
          line-height: 1.7;
          opacity: 0.92;
          font-size: 14px;
        }

        /* 兴趣爱好标签 */
        .hobbies-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding: 8px 0;
          margin: 12px -16px 0;
          scrollbar-width: none;
        }
        .hobbies-container::-webkit-scrollbar {
          display: none;
        }
        .hobbies {
          display: flex;
          gap: 10px;
          padding: 0 16px;
        }
        .hobby-tag {
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          padding: 10px 18px;
          border-radius: 22px;
          font-size: 14px;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 3px 12px rgba(255, 107, 157, 0.25);
          transition: all 0.2s ease;
        }
        .hobby-tag:active {
          transform: scale(0.95);
        }

        /* 联系方式 */
        .contact {
          text-align: center;
          padding: 32px 16px;
        }
        .contact p {
          font-size: 15px;
          opacity: 0.95;
          margin-bottom: 20px;
        }
        .social-links {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .social-link {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          transition: all 0.25s ease;
          text-decoration: none;
          border: 2px solid rgba(255, 255, 255, 0.25);
        }
        .social-link:active {
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          transform: scale(0.9);
          border-color: transparent;
        }

        /* 快捷链接 */}
        .quick-links {
          display: grid;
          gap: 12px;
          margin: 16px 0;
          padding: 0 8px;
        }
        .quick-link-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(255, 107, 157, 0.25), rgba(240, 147, 251, 0.25));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 18px;
          padding: 24px 16px;
          text-decoration: none;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(255, 107, 157, 0.15);
        }
        .quick-link-card:active {
          transform: scale(0.98);
        }
        .quick-link-icon {
          font-size: 40px;
          margin-bottom: 8px;
        }
        .quick-link-title {
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .quick-link-desc {
          font-size: 13px;
          opacity: 0.75;
        }

        /* 页脚 */
        footer {
          text-align: center;
          padding: 24px 16px;
          background: rgba(0, 0, 0, 0.12);
          border-radius: 16px 16px 0 0;
          margin-top: 24px;
        }
        footer p {
          opacity: 0.8;
          font-size: 13px;
          line-height: 2;
        }

        /* 底部导航栏 */
        .bottom-nav {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-radius: 50px;
          padding: 10px 20px;
          display: flex;
          gap: 8px;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .bottom-nav button,
        .bottom-nav a {
          width: 44px;
          height: 44px;
          border: none;
          background: transparent;
          color: #fff;
          font-size: 20px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          text-decoration: none;
          padding: 0;
        }
        .bottom-nav button:active,
        .bottom-nav a:active {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(0.9);
        }
        .bottom-nav .active {
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          box-shadow: 0 3px 12px rgba(255, 107, 157, 0.4);
        }

        /* 返回顶部按钮 */
        .back-to-top {
          position: fixed;
          bottom: 80px;
          right: 16px;
          width: 44px;
          height: 44px;
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #fff;
          box-shadow: 0 4px 16px rgba(255, 107, 157, 0.4);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 99;
          border: none;
          cursor: pointer;
        }
        .back-to-top.show {
          opacity: 1;
          visibility: visible;
        }
        .back-to-top:active {
          transform: scale(0.9);
        }

        /* iPhone 安全区域 */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .bottom-nav {
            bottom: calc(16px + env(safe-area-inset-bottom));
          }
          .back-to-top {
            bottom: calc(80px + env(safe-area-inset-bottom));
          }
          footer {
            padding-bottom: calc(24px + env(safe-area-inset-bottom));
          }
        }

        /* ========== 平板和桌面端样式 ========== */
        @media (min-width: 768px) {
          .container {
            max-width: 800px;
            padding: 24px 32px;
            padding-bottom: 40px;
          }
          header {
            padding: 14px 24px;
            margin-bottom: 20px;
          }
          .logo {
            font-size: 22px;
          }
          .menu-btn {
            display: none;
          }
          .mobile-nav,
          .nav-overlay {
            display: none;
          }
          .hero {
            padding: 48px 32px 64px;
          }
          .avatar-container {
            width: 160px;
            height: 160px;
          }
          .avatar {
            font-size: 72px;
          }
          .hero h1 {
            font-size: 36px;
          }
          .hero p {
            font-size: 17px;
          }
          .about-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .hobbies-container {
            overflow-x: visible;
            margin: 16px 0 0;
          }
          .hobbies {
            flex-wrap: wrap;
            justify-content: center;
            padding: 0;
            gap: 12px;
          }
          .quick-links {
            grid-template-columns: repeat(2, 1fr);
            padding: 0;
          }
          .back-to-top {
            right: 32px;
            bottom: 40px;
            width: 48px;
            height: 48px;
            font-size: 22px;
          }
        }

        @media (min-width: 1024px) {
          .container {
            max-width: 960px;
          }
          .hero h1 {
            font-size: 42px;
          }
          .about-grid {
            gap: 16px;
          }
        }
      `}</style>
    </>
  );
}
