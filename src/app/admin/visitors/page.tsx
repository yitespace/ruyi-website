'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Visitor {
  id: string;
  ip: string;
  userAgent: string;
  visitedAt: number;
  compatibilityScore?: number;
}

export default function AdminVisitorsPage() {
  const router = useRouter();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchVisitors();
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

  const fetchVisitors = async () => {
    try {
      const res = await fetch('/api/visitors?limit=100');
      const data = await res.json();
      if (data.success) {
        setVisitors(data.visitors || []);
        setStats(data.stats || { total: 0, today: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch visitors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) return '刚刚';
    if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
    if (diff < day) return `${Math.floor(diff / hour)}小时前`;
    return date.toLocaleDateString('zh-CN');
  };

  const getBrowserName = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return '其他';
  };

  const getDeviceName = (userAgent: string) => {
    if (userAgent.includes('Mobile')) return '📱 手机';
    if (userAgent.includes('Tablet')) return '📱 平板';
    return '💻 电脑';
  };

  const getScoreClass = (score: number) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  return (
    <div className="admin-visitors">
      <header className="page-header">
        <h1>👥 访客数据</h1>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">总访客</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.today}</div>
          <div className="stat-label">今日</div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">加载中...</div>
      ) : visitors.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>暂无访客记录</p>
        </div>
      ) : (
        <div className="visitors-list">
          {visitors.map((visitor) => (
            <div key={visitor.id} className="visitor-card">
              <div className="visitor-header">
                <div className="visitor-time">{formatTime(visitor.visitedAt)}</div>
                {visitor.compatibilityScore !== undefined && (
                  <span className={`score-badge ${getScoreClass(visitor.compatibilityScore)}`}>
                    {visitor.compatibilityScore}%
                  </span>
                )}
              </div>
              <div className="visitor-info">
                <div className="visitor-row">
                  <span className="label">IP 地址</span>
                  <span className="value ip">{visitor.ip}</span>
                </div>
                <div className="visitor-row">
                  <span className="label">设备</span>
                  <span className="value">{getDeviceName(visitor.userAgent)}</span>
                </div>
                <div className="visitor-row">
                  <span className="label">浏览器</span>
                  <span className="value">{getBrowserName(visitor.userAgent)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .admin-visitors {
          padding: 20px;
          padding-bottom: 100px;
        }

        .page-header {
          margin-bottom: 20px;
          padding-top: 10px;
        }

        .page-header h1 {
          font-size: 24px;
          color: #fff;
          margin: 0;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(45deg, #667eea, #f093fb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 5px;
        }

        .loading {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.7);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
        }

        .empty-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 15px;
        }

        .empty-state p {
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        .visitors-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .visitor-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .visitor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .visitor-time {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .score-badge {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 12px;
        }

        .score-badge.high {
          background: rgba(76, 175, 80, 0.25);
          color: #81c784;
        }

        .score-badge.medium {
          background: rgba(255, 193, 7, 0.25);
          color: #ffd54f;
        }

        .score-badge.low {
          background: rgba(244, 67, 54, 0.25);
          color: #e57373;
        }

        .visitor-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .visitor-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .visitor-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        .value {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }

        .value.ip {
          font-family: monospace;
          font-size: 12px;
          background: rgba(255, 255, 255, 0.08);
          padding: 3px 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
