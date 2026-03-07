'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminHomePage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    pendingMessages: 0,
    approvedMessages: 0,
  });
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      if (!data.isLoggedIn) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to check auth:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [visitorsRes, messagesRes, pendingRes] = await Promise.all([
        fetch('/api/visitors'),
        fetch('/api/messages'),
        fetch('/api/messages/pending'),
      ]);

      const visitorsData = await visitorsRes.json();
      const messagesData = await messagesRes.json();
      const pendingData = await pendingRes.json();

      setStats({
        totalVisitors: visitorsData.stats?.total || 0,
        todayVisitors: visitorsData.stats?.today || 0,
        pendingMessages: pendingData.messages?.length || 0,
        approvedMessages: messagesData.messages?.length || 0,
      });
      setPendingMessages(pendingData.messages || []);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' });
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="admin-home">
      {/* 背景装饰 */}
      <div className="bg-decoration">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
      </div>

      <header className="admin-header">
        <div className="header-content">
          <div className="welcome-badge">
            <span className="welcome-icon">👋</span>
            <span className="welcome-text">欢迎回来</span>
          </div>
          <h1>汝意 · 管理系统</h1>
          <p className="header-date">{new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="退出登录">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </header>

      {isLoading ? (
        <div className="loading">
          <div className="spinner" />
          <p>加载数据中...</p>
        </div>
      ) : (
        <>
          {/* 数据统计卡片 */}
          <section className="stats-section">
            <div className="section-header">
              <h2>数据概览</h2>
              <span className="live-indicator">
                <span className="live-dot" />
                实时
              </span>
            </div>
            <div className="stats-grid">
              <StatCard
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
                label="总访客"
                value={stats.totalVisitors}
                gradient="from-violet-500 to-purple-600"
                accentColor="#8b5cf6"
              />
              <StatCard
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                }
                label="今日访客"
                value={stats.todayVisitors}
                gradient="from-pink-500 to-rose-600"
                accentColor="#f43f5e"
              />
              <StatCard
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                }
                label="已发布留言"
                value={stats.approvedMessages}
                gradient="from-cyan-500 to-blue-600"
                accentColor="#06b6d4"
              />
              <StatCard
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                }
                label="待审核"
                value={stats.pendingMessages}
                gradient="from-amber-500 to-orange-600"
                accentColor="#f59e0b"
              />
            </div>
          </section>

          {/* 快捷操作 */}
          <section className="quick-actions">
            <div className="section-header">
              <h2>快捷操作</h2>
            </div>
            <div className="actions-list">
              {pendingMessages.length > 0 && (
                <Link href="/admin/messages" className="action-item highlight">
                  <div className="action-icon-wrapper urgent">
                    <span className="icon-emoji">⏳</span>
                    <span className="notification-badge">{pendingMessages.length}</span>
                  </div>
                  <div className="action-info">
                    <span className="action-title">待审核留言</span>
                    <span className="action-desc">有 {pendingMessages.length} 条留言等待审核</span>
                  </div>
                  <svg className="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              )}
              <Link href="/admin/messages" className="action-item">
                <div className="action-icon-wrapper">
                  <span className="icon-emoji">💬</span>
                </div>
                <div className="action-info">
                  <span className="action-title">留言管理</span>
                  <span className="action-desc">审核、删除访客留言</span>
                </div>
                <svg className="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
              <Link href="/admin/visitors" className="action-item">
                <div className="action-icon-wrapper">
                  <span className="icon-emoji">📊</span>
                </div>
                <div className="action-info">
                  <span className="action-title">访客分析</span>
                  <span className="action-desc">查看访问数据和趋势</span>
                </div>
                <svg className="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
              <Link href="/admin/content" className="action-item">
                <div className="action-icon-wrapper">
                  <span className="icon-emoji">✏️</span>
                </div>
                <div className="action-info">
                  <span className="action-title">内容管理</span>
                  <span className="action-desc">编辑页面内容和配置</span>
                </div>
                <svg className="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
              <Link href="/admin/settings" className="action-item">
                <div className="action-icon-wrapper">
                  <span className="icon-emoji">⚙️</span>
                </div>
                <div className="action-info">
                  <span className="action-title">系统设置</span>
                  <span className="action-desc">IP 封禁、密码修改</span>
                </div>
                <svg className="action-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          </section>
        </>
      )}

      <style jsx>{`
        .admin-home {
          padding: 20px 16px;
          padding-bottom: calc(80px + env(safe-area-inset-bottom));
          min-height: 100vh;
          position: relative;
        }

        .bg-decoration {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 8s ease-in-out infinite;
        }

        .orb-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #f093fb, #f59e0b);
          bottom: 20%;
          left: -80px;
          animation-delay: -4s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.05); }
          66% { transform: translate(-15px, 20px) scale(0.95); }
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          position: relative;
          z-index: 1;
        }

        .header-content {
          flex: 1;
        }

        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.15));
          border-radius: 20px;
          border: 1px solid rgba(102, 126, 234, 0.2);
          margin-bottom: 10px;
        }

        .welcome-icon {
          font-size: 14px;
        }

        .welcome-text {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .admin-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px 0;
          background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .header-date {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
        }

        .logout-btn {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          color: rgba(255, 255, 255, 0.6);
        }

        .logout-btn:hover {
          background: rgba(255, 59, 48, 0.15);
          border-color: rgba(255, 59, 48, 0.3);
          color: #ff3b30;
        }

        .logout-btn:active {
          transform: scale(0.92);
        }

        .logout-btn svg {
          width: 20px;
          height: 20px;
        }

        .loading {
          text-align: center;
          padding: 100px 20px;
          color: rgba(255, 255, 255, 0.5);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(102, 126, 234, 0.2);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading p {
          font-size: 14px;
          margin: 0;
        }

        .stats-section {
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding: 0 4px;
        }

        .section-header h2 {
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          padding: 3px 8px;
          background: rgba(76, 175, 80, 0.1);
          border-radius: 10px;
          border: 1px solid rgba(76, 175, 80, 0.2);
        }

        .live-dot {
          width: 6px;
          height: 6px;
          background: #4caf50;
          border-radius: 50%;
          animation: pulse-live 2s ease-in-out infinite;
        }

        @keyframes pulse-live {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .action-item {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 16px;
          text-decoration: none;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .action-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          transition: left 0.5s ease;
        }

        .action-item:hover::before {
          left: 100%;
        }

        .action-item:active {
          transform: scale(0.98);
        }

        .action-item.highlight {
          background: linear-gradient(135deg, rgba(255, 107, 157, 0.12), rgba(240, 147, 251, 0.08));
          border-color: rgba(255, 107, 157, 0.25);
        }

        .action-icon-wrapper {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
        }

        .action-icon-wrapper.urgent {
          background: linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(240, 147, 251, 0.15));
          border-color: rgba(255, 107, 157, 0.3);
        }

        .icon-emoji {
          font-size: 24px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #ff6b9d, #f093fb);
          border-radius: 10px;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
          box-shadow: 0 2px 8px rgba(255, 107, 157, 0.4);
        }

        .action-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .action-title {
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
        }

        .action-desc {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.45);
        }

        .action-arrow {
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .action-item:active .action-arrow {
          transform: translateX(4px);
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  gradient,
  accentColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  gradient: string;
  accentColor: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-inner">
        <div className={`stat-icon-gradient ${gradient}`}>
          {icon}
        </div>
        <div className="stat-value" style={{ color: accentColor }}>
          {value.toLocaleString()}
        </div>
        <div className="stat-label">{label}</div>
      </div>
      <style jsx>{`
        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 18px;
          padding: 4px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, ${accentColor}, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-card:active {
          transform: scale(0.97);
          background: rgba(255, 255, 255, 0.05);
        }

        .stat-card-inner {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          padding: 18px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .stat-icon-gradient {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to));
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .stat-icon-gradient svg {
          width: 22px;
          height: 22px;
          color: #fff;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          line-height: 1;
          text-shadow: 0 0 20px ${accentColor}40;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.45);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
