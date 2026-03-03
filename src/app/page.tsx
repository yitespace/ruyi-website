'use client';

import Navigation from '@/components/Navigation';
import Particles from '@/components/Particles';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Hobbies from '@/components/Hobbies';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main>
      <Navigation />
      <Particles />

      <div className="container">
        {/* 头部导航栏 */}
        <Header />

        {/* 主要内容 */}
        <Hero />
        <About />
        <Hobbies />
        <Contact />

        {/* 页脚 */}
        <Footer />
      </div>

      {/* 底部导航栏 */}
      <BottomNav />
    </main>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="logo">✨ 汝意的世界</div>
      <button className="menu-btn" aria-label="菜单">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav className="desktop-nav">
        <a href="#home">首页</a>
        <a href="#about">关于我</a>
        <a href="#hobbies">兴趣</a>
        <a href="#contact">联系</a>
      </nav>

      <style jsx>{`
        .header {
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
          width: 40px;
          height: 40px;
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
          width: 20px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .desktop-nav {
          display: none;
          gap: 15px;
        }

        .desktop-nav a {
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          padding: 8px 16px;
          border-radius: 20px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.15);
        }

        .desktop-nav a:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (min-width: 768px) {
          .header {
            padding: 20px 30px;
            margin-bottom: 30px;
          }

          .logo {
            font-size: 24px;
          }

          .menu-btn {
            display: none;
          }

          .desktop-nav {
            display: flex;
            gap: 25px;
          }

          .desktop-nav a {
            font-size: 16px;
            padding: 10px 20px;
          }
        }
      `}</style>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 汝意的个人主页</p>
      <p>用爱制作 💖 | 欢迎来到我的世界</p>

      <style jsx>{`
        .footer {
          text-align: center;
          padding: 25px 20px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 20px 20px 0 0;
          margin-top: 30px;
        }

        .footer p {
          opacity: 0.85;
          font-size: 13px;
          line-height: 1.8;
        }

        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .footer {
            padding-bottom: calc(25px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </footer>
  );
}

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <a href="#home" className="nav-link active" data-section="home">
        🏠
      </a>
      <a href="#about" className="nav-link" data-section="about">
        💕
      </a>
      <a href="#hobbies" className="nav-link" data-section="hobbies">
        🎨
      </a>
      <a href="#contact" className="nav-link" data-section="contact">
        💌
      </a>

      <style jsx>{`
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
          position: relative;
        }

        .bottom-nav a:active {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0.9);
        }

        .bottom-nav a.active {
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          box-shadow: 0 3px 15px rgba(255, 107, 157, 0.5);
        }

        @media (min-width: 768px) {
          .bottom-nav {
            display: none;
          }
        }

        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .bottom-nav {
            bottom: calc(20px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </nav>
  );
}
