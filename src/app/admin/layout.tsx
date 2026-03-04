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

  // 登录页不需要检查
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

  // 登录页直接显示
  if (pathname === '/admin/login') {
    return <div className="admin-layout">{children}</div>;
  }

  // 加载时不显示任何内容
  if (isLoading) {
    return (
      <div className="admin-layout">
        <div className="admin-loading">
          <div className="loading-spinner" />
          <p>加载中...</p>
        </div>
        <style jsx>{`
          .admin-loading {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
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
          p {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  // 已登录显示内容和底部导航
  if (isLoggedIn) {
    return (
      <div className="admin-layout">
        <div className="admin-content">{children}</div>
        <nav className="admin-bottom-nav">
          <a href="/admin" className="admin-nav-item">
            <span className="nav-icon">📊</span>
            <span className="nav-label">概览</span>
          </a>
          <a href="/admin/messages" className="admin-nav-item">
            <span className="nav-icon">💬</span>
            <span className="nav-label">留言</span>
          </a>
          <a href="/admin/visitors" className="admin-nav-item">
            <span className="nav-icon">👥</span>
            <span className="nav-label">访客</span>
          </a>
          <a href="/admin/content" className="admin-nav-item">
            <span className="nav-icon">📝</span>
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

  // 未登录不显示任何内容（会被重定向）
  return null;
}
