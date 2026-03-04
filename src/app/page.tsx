'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
      const sections = ['home', 'about', 'hobbies', 'contact'];
      const scrollPos = window.scrollY + 100;
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          if (scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
            setActiveSection(id);
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      {loading && (
        <div className="loading" id="loading">
          <div className="loading-spinner" />
        </div>
      )}

      <div className="particles" id="particles" />

      <div className="nav-overlay" id="navOverlay" onClick={() => setMenuOpen(false)} />

      <nav className={`mobile-nav ${menuOpen ? 'active' : ''}`} id="mobileNav">
        <ul>
          <li onClick={() => scrollTo('home')}>🏠 首页</li>
          <li onClick={() => scrollTo('about')}>💕 关于我</li>
          <li onClick={() => scrollTo('hobbies')}>🎨 兴趣</li>
          <li onClick={() => scrollTo('contact')}>💌 联系</li>
        </ul>
      </nav>

      <div className="container">
        <header>
          <div className="logo">✨ 汝意的世界</div>
          <button className="menu-btn" id="menuBtn" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </header>

        <section className="hero" id="home">
          <div className="avatar-container">
            <div className="avatar-ring" />
            <div className="avatar">👸</div>
          </div>
          <h1>欢迎来到<br />我的世界 🌸</h1>
          <p>你好呀！我是 ruyi！一个热爱生活、充满好奇心的女孩。这里是我分享生活的小天地～</p>
          <button className="btn" onClick={() => scrollTo('about')}>了解更多 ↓</button>
        </section>

        <section className="section" id="about">
          <h2 className="section-title">关于我 💕</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3>🎀 我是谁</h3>
              <p>一个温柔善良、乐观向上的女生。喜欢探索新事物，享受生活中的每一个小确幸。</p>
            </div>
            <div className="about-card">
              <h3>🌟 我的特点</h3>
              <p>细心、有耐心、富有创造力。对待朋友真诚，对待生活热情满满！</p>
            </div>
            <div className="about-card">
              <h3>💫 我的梦想</h3>
              <p>成为更好的自己，去更多地方，见更多人，体验更精彩的人生！</p>
            </div>
          </div>
        </section>

        <section className="section" id="hobbies">
          <h2 className="section-title">兴趣爱好 🎨</h2>
          <div className="hobbies-container">
            <div className="hobbies">
              <div className="hobby-tag">📸 摄影</div>
              <div className="hobby-tag">🎨 绘画</div>
              <div className="hobby-tag">📚 阅读</div>
              <div className="hobby-tag">🎵 音乐</div>
              <div className="hobby-tag">✈️ 旅行</div>
              <div className="hobby-tag">🍰 美食</div>
              <div className="hobby-tag">🌸 花艺</div>
              <div className="hobby-tag">💄 美妆</div>
              <div className="hobby-tag">🎬 电影</div>
              <div className="hobby-tag">🧘 瑜伽</div>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <h2 className="section-title">联系我 💌</h2>
          <p>欢迎和我交朋友！期待与你相遇～</p>
          <div className="social-links">
            <a className="social-link" title="微信">💬</a>
            <a className="social-link" title="微博">📱</a>
            <a className="social-link" title="邮箱">📧</a>
            <a className="social-link" title="小红书">📕</a>
            <a className="social-link" title="抖音">🎵</a>
          </div>
        </section>

        <footer>
          <p>© 2026 汝意的个人主页</p>
          <p>用爱制作 💖 | 欢迎来到我的世界</p>
        </footer>
      </div>

      <div className="bottom-nav">
        <a className={`nav-link ${activeSection === 'home' ? 'active' : ''}`} onClick={() => scrollTo('home')}>🏠</a>
        <a className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={() => scrollTo('about')}>💕</a>
        <a className={`nav-link ${activeSection === 'hobbies' ? 'active' : ''}`} onClick={() => scrollTo('hobbies')}>🎨</a>
        <a className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={() => scrollTo('contact')}>💌</a>
      </div>

      <button className={`back-to-top ${showBackToTop ? 'show' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>

      <style jsx global>{`
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
        }
        .loading {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: linear-gradient(180deg, #667eea, #764ba2, #f093fb);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        .loading.hidden {
          opacity: 0;
          visibility: hidden;
        }
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .particles {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.5);
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
        .container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          padding: 15px;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 15px;
          margin-bottom: 20px;
          position: sticky;
          top: 10px;
          z-index: 100;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .logo {
          font-size: 20px;
          font-weight: 600;
          background: linear-gradient(45deg, #fff, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .menu-btn {
          width: 40px; height: 40px;
          border: none;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .menu-btn span {
          width: 20px; height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .mobile-nav {
          position: fixed;
          top: 0; right: -100%;
          width: 80%;
          max-width: 300px;
          height: 100vh;
          background: linear-gradient(180deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 999;
          padding: 80px 30px;
          transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -5px 0 30px rgba(0, 0, 0, 0.3);
        }
        .mobile-nav.active {
          right: 0;
        }
        .mobile-nav ul {
          list-style: none;
        }
        .mobile-nav li {
          margin-bottom: 25px;
          opacity: 0;
          transform: translateX(30px);
          transition: all 0.4s ease;
          cursor: pointer;
        }
        .mobile-nav.active li {
          opacity: 1;
          transform: translateX(0);
        }
        .mobile-nav li:nth-child(1) { transition-delay: 0.1s; }
        .mobile-nav li:nth-child(2) { transition-delay: 0.2s; }
        .mobile-nav li:nth-child(3) { transition-delay: 0.3s; }
        .mobile-nav li:nth-child(4) { transition-delay: 0.4s; }
        .nav-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .nav-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        .hero {
          text-align: center;
          padding: 40px 20px 60px;
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .avatar-container {
          width: 140px; height: 140px;
          margin: 0 auto 25px;
          position: relative;
        }
        .avatar {
          width: 100%; height: 100%;
          border-radius: 50%;
          background: linear-gradient(45deg, #ff6b9d, #c44569, #f093fb);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 60px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          animation: pulse 2s infinite;
          border: 4px solid rgba(255, 255, 255, 0.3);
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          }
          50% {
            box-shadow: 0 8px 45px rgba(255, 107, 157, 0.5);
          }
        }
        .avatar-ring {
          position: absolute;
          top: -8px; left: -8px; right: -8px; bottom: -8px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          animation: rotate 10s linear infinite;
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .hero h1 {
          font-size: 28px;
          margin-bottom: 15px;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
          line-height: 1.3;
        }
        .hero p {
          font-size: 16px;
          max-width: 400px;
          margin: 0 auto 30px;
          opacity: 0.95;
          padding: 0 10px;
        }
        .btn {
          display: inline-block;
          padding: 14px 35px;
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          color: #fff;
          text-decoration: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 5px 20px rgba(255, 107, 157, 0.4);
          border: none;
          cursor: pointer;
          -webkit-appearance: none;
        }
        .btn:active {
          transform: scale(0.95);
          box-shadow: 0 3px 15px rgba(255, 107, 157, 0.4);
        }
        .section {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 35px 20px;
          margin: 20px 0;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .section-title {
          font-size: 24px;
          text-align: center;
          margin-bottom: 30px;
          position: relative;
          font-weight: 600;
        }
        .section-title::after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #ff6b9d, #f093fb);
          margin: 12px auto 0;
          border-radius: 2px;
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }
        .about-card {
          background: rgba(255, 255, 255, 0.18);
          padding: 25px 20px;
          border-radius: 15px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .about-card:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.25);
        }
        .about-card h3 {
          font-size: 18px;
          margin-bottom: 12px;
          color: #ffd700;
        }
        .about-card p {
          line-height: 1.7;
          opacity: 0.95;
          font-size: 15px;
        }
        .hobbies-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding: 10px 0;
          margin: 20px -20px 0;
        }
        .hobbies {
          display: flex;
          gap: 12px;
          padding: 0 20px;
          scrollbar-width: none;
        }
        .hobbies::-webkit-scrollbar {
          display: none;
        }
        .hobby-tag {
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 14px;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 3px 15px rgba(255, 107, 157, 0.3);
          transition: all 0.3s ease;
        }
        .hobby-tag:active {
          transform: scale(0.95);
        }
        .contact {
          text-align: center;
          padding: 40px 20px;
        }
        .contact p {
          font-size: 16px;
          opacity: 0.95;
          margin-bottom: 25px;
        }
        .social-links {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }
        .social-link {
          width: 55px; height: 55px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          transition: all 0.3s ease;
          text-decoration: none;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        .social-link:active {
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          transform: scale(0.9);
          border-color: transparent;
        }
        footer {
          text-align: center;
          padding: 25px 20px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 20px 20px 0 0;
          margin-top: 30px;
        }
        footer p {
          opacity: 0.85;
          font-size: 13px;
          line-height: 1.8;
        }
        .bottom-nav {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-radius: 50px;
          padding: 10px 25px;
          display: flex;
          gap: 30px;
          z-index: 100;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .bottom-nav a {
          color: #fff;
          text-decoration: none;
          font-size: 22px;
          padding: 10px;
          border-radius: 50%;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .bottom-nav a:active {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0.9);
        }
        .bottom-nav a.active {
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          box-shadow: 0 3px 15px rgba(255, 107, 157, 0.5);
        }
        .back-to-top {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 50px; height: 50px;
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #fff;
          box-shadow: 0 5px 20px rgba(255, 107, 157, 0.5);
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
        @media (min-width: 768px) {
          .container { max-width: 900px; padding: 30px; }
          header { padding: 20px 30px; margin-bottom: 30px; }
          .logo { font-size: 24px; }
          .menu-btn { display: none; }
          .mobile-nav, .nav-overlay, .bottom-nav { display: none; }
          .hero { padding: 60px 40px 80px; }
          .avatar-container { width: 180px; height: 180px; }
          .avatar { font-size: 80px; }
          .hero h1 { font-size: 40px; }
          .hero p { font-size: 18px; }
          .about-grid { grid-template-columns: repeat(3, 1fr); }
          .hobbies-container { overflow-x: visible; margin: 20px 0 0; }
          .hobbies { flex-wrap: wrap; justify-content: center; padding: 0; }
          .back-to-top { right: 40px; bottom: 120px; }
        }
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .bottom-nav { bottom: calc(20px + env(safe-area-inset-bottom)); }
          .back-to-top { bottom: calc(90px + env(safe-area-inset-bottom)); }
          footer { padding-bottom: calc(25px + env(safe-area-inset-bottom)); }
        }
      `}</style>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const isMobile = window.innerWidth < 768;
          const particleCount = isMobile ? 30 : 50;
          const container = document.getElementById('particles');
          for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 15 + 5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = (Math.random() * 100) + '%';
            particle.style.top = (Math.random() * 100 + 100) + '%';
            particle.style.animationDelay = (Math.random() * 15) + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            container.appendChild(particle);
          }
        })();
      `}} />
    </>
  );
}
