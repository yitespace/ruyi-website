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
      const [visitorsRes, messagesRes] = await Promise.all([
        fetch('/api/visitors'),
        fetch('/api/messages'),
      ]);

      const visitorsData = await visitorsRes.json();
      const messagesData = await messagesRes.json();

      setStats({
        totalVisitors: visitorsData.stats?.total || 0,
        todayVisitors: visitorsData.stats?.today || 0,
        pendingMessages: 0,
        approvedMessages: messagesData.messages?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="admin-home">
      <header className="admin-header">
        <div>
          <h1>管理后台</h1>
          <p className="header-subtitle">欢迎回来，汝意 👋</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          退出
        </button>
      </header>

      {isLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <>
          <div className="stats-section">
            <h2>实时数据</h2>
            <div className="stats-grid">
              <StatCard
                icon="👥"
                label="总访客"
                value={stats.totalVisitors}
                color="#667eea"
              />
              <StatCard
                icon="🌟"
                label="今日"
                value={stats.todayVisitors}
                color="#ff6b9d"
              />
              <StatCard
                icon="💬"
                label="留言"
                value={stats.approvedMessages}
                color="#f093fb"
              />
              <StatCard
                icon="⏳"
                label="待审核"
                value={stats.pendingMessages}
                color="#ffd700"
              />
            </div>
          </div>

          <div className="quick-actions">
            <h2>快捷操作</h2>
            <div className="actions-list">
              <Link href="/admin/messages" className="action-item">
                <span className="action-icon">💬</span>
                <div className="action-info">
                  <span className="action-title">留言审核</span>
                  <span className="action-desc">审核访客留言</span>
                </div>
                <span className="action-arrow">›</span>
              </Link>
              <Link href="/admin/visitors" className="action-item">
                <span className="action-icon">👥</span>
                <div className="action-info">
                  <span className="action-title">访客数据</span>
                  <span className="action-desc">查看访问统计</span>
                </div>
                <span className="action-arrow">›</span>
              </Link>
              <Link href="/admin/content" className="action-item">
                <span className="action-icon">📝</span>
                <div className="action-info">
                  <span className="action-title">内容编辑</span>
                  <span className="action-desc">修改页面内容</span>
                </div>
                <span className="action-arrow">›</span>
              </Link>
              <Link href="/admin/settings" className="action-item">
                <span className="action-icon">⚙️</span>
                <div className="action-info">
                  <span className="action-title">设置</span>
                  <span className="action-desc">IP 封禁、密码修改</span>
                </div>
                <span className="action-arrow">›</span>
              </Link>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .admin-home {
          padding: 20px;
          padding-bottom: 100px;
          min-height: 100vh;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 25px;
          padding-top: 10px;
        }

        .admin-header h1 {
          font-size: 24px;
          color: #fff;
          margin: 0;
        }

        .header-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin: 5px 0 0 0;
        }

        .logout-btn {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          border: none;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:active {
          transform: scale(0.95);
          background: rgba(255, 255, 255, 0.2);
        }

        .loading {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.7);
        }

        .stats-section {
          margin-bottom: 25px;
        }

        .stats-section h2 {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 15px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 18px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .quick-actions {
          margin-top: 10px;
        }

        .quick-actions h2 {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 15px;
        }

        .actions-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .action-item {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 16px;
          text-decoration: none;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }

        .action-item:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.15);
        }

        .action-icon {
          font-size: 28px;
          flex-shrink: 0;
        }

        .action-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .action-title {
          font-size: 16px;
          font-weight: 500;
        }

        .action-desc {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .action-arrow {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.4);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value" style={{ color }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
