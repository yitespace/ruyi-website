'use client';

import { useEffect, useState } from 'react';
import Particles from './Particles';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: '首页', icon: '🏠' },
  { id: 'about', label: '关于我', icon: '💕' },
  { id: 'hobbies', label: '兴趣', icon: '🎨' },
  { id: 'contact', label: '联系', icon: '💌' },
];

export default function Navigation() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 页面加载完成后隐藏加载动画
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // 显示/隐藏回到顶部按钮
      setShowBackToTop(window.scrollY > 300);

      // 更新当前激活的导航项
      const sections = navItems.map((item) => item.id);
      const scrollPos = window.scrollY + 100;

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const offsetTop = section.offsetTop;
          const offsetHeight = section.offsetHeight;

          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileNavOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMenu = () => {
    setMobileNavOpen(!mobileNavOpen);
    document.body.style.overflow = !mobileNavOpen ? 'hidden' : '';
  };

  return (
    <>
      {/* 加载动画 */}
      {loading && (
        <div className="loading">
          <div className="loading-spinner" />
        </div>
      )}

      {/* 导航遮罩 */}
      <div
        className={`nav-overlay ${mobileNavOpen ? 'active' : ''}`}
        onClick={toggleMenu}
      />

      {/* 移动端侧边导航 */}
      <nav className={`mobile-nav ${mobileNavOpen ? 'active' : ''}`}>
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <a onClick={() => scrollToSection(item.id)}>
                {item.icon} {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 回到顶部按钮 */}
      <button
        className={`back-to-top ${showBackToTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="回到顶部"
      >
        ↑
      </button>

      <style jsx>{`
        .loading {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #667eea, #764ba2, #f093fb);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 0.5s ease, visibility 0.5s ease;
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
          to {
            transform: rotate(360deg);
          }
        }

        .nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
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

        .mobile-nav {
          position: fixed;
          top: 0;
          right: -100%;
          width: 80%;
          max-width: 300px;
          height: 100vh;
          background: linear-gradient(
            180deg,
            rgba(102, 126, 234, 0.95),
            rgba(118, 75, 162, 0.95)
          );
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
        }

        .mobile-nav.active li {
          opacity: 1;
          transform: translateX(0);
        }

        .mobile-nav li:nth-child(1) {
          transition-delay: 0.1s;
        }
        .mobile-nav li:nth-child(2) {
          transition-delay: 0.2s;
        }
        .mobile-nav li:nth-child(3) {
          transition-delay: 0.3s;
        }
        .mobile-nav li:nth-child(4) {
          transition-delay: 0.4s;
        }

        .mobile-nav a {
          color: #fff;
          text-decoration: none;
          font-size: 22px;
          font-weight: 500;
          padding: 15px 20px;
          border-radius: 12px;
          display: block;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.1);
          cursor: pointer;
        }

        .mobile-nav a:active {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0.98);
        }

        .back-to-top {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 50px;
          height: 50px;
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #fff;
          text-decoration: none;
          box-shadow: 0 5px 20px rgba(255, 107, 157, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 99;
          border: none;
          cursor: pointer;
          -webkit-appearance: none;
        }

        .back-to-top.show {
          opacity: 1;
          visibility: visible;
        }

        .back-to-top:active {
          transform: scale(0.9);
        }

        @media (min-width: 768px) {
          .back-to-top {
            right: 40px;
            bottom: 120px;
          }
        }

        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .back-to-top {
            bottom: calc(90px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  );
}
