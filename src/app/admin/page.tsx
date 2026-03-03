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

      // 获取待审核留言数量（需要管理权限，这里只是估算）
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
        <h1>📊 数据概览</h1>
        <button className="logout-btn" onClick={handleLogout}>
          退出登录
        </button>
      </header>

      {isLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="stats-grid">
          <StatCard
            icon="👥"
            label="总访客数"
            value={stats.totalVisitors}
            color="#667eea"
          />
          <StatCard
            icon="🌟"
            label="今日访客"
            value={stats.todayVisitors}
            color="#ff6b9d"
          />
          <StatCard
            icon="💬"
            label="已审核留言"
            value={stats.approvedMessages}
            color="#f093fb"
          />
          <StatCard
            icon="⏳"
            label="待审核留言"
            value={stats.pendingMessages}
            color="#ffd700"
          />
        </div>
      )}

      <div className="quick-actions">
        <h2>快捷操作</h2>
        <div className="actions-grid">
          <Link href="/admin/messages" className="action-card">
            <span className="action-icon">💬</span>
            <span>留言审核</span>
          </Link>
          <Link href="/admin/visitors" className="action-card">
            <span className="action-icon">👥</span>
            <span>访客数据</span>
          </Link>
          <Link href="/admin/content" className="action-card">
            <span className="action-icon">📝</span>
            <span>内容编辑</span>
          </Link>
          <Link href="/admin/settings" className="action-card">
            <span className="action-icon">⚙️</span>
            <span>设置</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .admin-home {
          padding: 20px;
          min-height: 100vh;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .admin-header h1 {
          font-size: 28px;
          color: #fff;
        }

        .logout-btn {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:active {
          transform: scale(0.95);
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: rgba(255, 255, 255, 0.7);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.15);
        }

        .stat-icon {
          font-size: 36px;
          margin-bottom: 10px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .quick-actions {
          margin-top: 30px;
        }

        .quick-actions h2 {
          font-size: 20px;
          color: #fff;
          margin-bottom: 15px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .action-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 25px 20px;
          text-align: center;
          text-decoration: none;
          color: #fff;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .action-card:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.15);
        }

        .action-icon {
          font-size: 32px;
        }

        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .actions-grid {
            grid-template-columns: repeat(4, 1fr);
          }
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
      <div className="stat-icon" style={{ filter: `drop-shadow(0 2px 4px ${color}40)` }}>
        {icon}
      </div>
      <div className="stat-value" style={{ color }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
