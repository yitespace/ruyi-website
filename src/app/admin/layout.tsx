'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        if (!data.isLoggedIn) {
          router.push('/admin/login');
          return;
        }
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to check auth:', error);
        router.push('/admin/login');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <div className="admin-layout">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="admin-layout">
        <div className="admin-loading">
          <div className="loading-gradient" />
          <div className="loading-content">
            <div className="loading-logo">
              <div className="logo-ring ring-1" />
              <div className="logo-ring ring-2" />
              <div className="logo-ring ring-3" />
              <div className="logo-core" />
            </div>
            <p className="loading-text">加载中...</p>
          </div>
        </div>
        <style jsx>{`
          .admin-loading {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%);
            position: relative;
            overflow: hidden;
          }

          .loading-gradient {
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.08) 0%, transparent 40%);
            animation: pulse 4s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }

          .loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 32px;
            z-index: 1;
          }

          .loading-logo {
            position: relative;
            width: 80px;
            height: 80px;
          }

          .logo-ring {
            position: absolute;
            border-radius: 50%;
            border: 2px solid transparent;
            animation: spin 1.5s linear infinite;
          }

          .ring-1 {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-top-color: #667eea;
            border-right-color: #667eea;
          }

          .ring-2 {
            top: 10px;
            left: 10px;
            width: calc(100% - 20px);
            height: calc(100% - 20px);
            border-bottom-color: #f093fb;
            border-right-color: #f093fb;
            animation-direction: reverse;
            animation-duration: 1.2s;
          }

          .ring-3 {
            top: 20px;
            left: 20px;
            width: calc(100% - 40px);
            height: calc(100% - 40px);
            border-top-color: #ff6b9d;
            border-left-color: #ff6b9d;
            animation-duration: 1s;
          }

          .logo-core {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #667eea, #f093fb);
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
            animation: glow 1.5s ease-in-out infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.6); }
            50% { box-shadow: 0 0 30px rgba(240, 147, 251, 0.8); }
          }

          .loading-text {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 1px;
          }
        `}</style>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="admin-layout">
        <div className="admin-content">{children}</div>
        <nav className="admin-bottom-nav">
          <div className="nav-glow" />
          <a href="/admin" className="admin-nav-item">
            <span className="nav-icon">🏠</span>
            <span className="nav-label">首页</span>
          </a>
          <a href="/admin/messages" className="admin-nav-item">
            <span className="nav-icon">💬</span>
            <span className="nav-label">留言</span>
          </a>
          <a href="/admin/visitors" className="admin-nav-item">
            <span className="nav-icon">📊</span>
            <span className="nav-label">访客</span>
          </a>
          <a href="/admin/content" className="admin-nav-item">
            <span className="nav-icon">✏️</span>
            <span className="nav-label">编辑</span>
          </a>
          <a href="/admin/settings" className="admin-nav-item">
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">设置</span>
          </a>
        </nav>
      </div>
    );
  }

  return null;
}
