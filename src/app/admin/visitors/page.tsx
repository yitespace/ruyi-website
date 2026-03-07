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
          padding: 20px 16px;
          padding-bottom: calc(84px + env(safe-area-inset-bottom));
        }

        .page-header {
          margin-bottom: 24px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .page-header h1 {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 18px;
          padding: 22px 16px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
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
          background: linear-gradient(90deg, transparent, #667eea, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-card:active {
          transform: scale(0.97);
          background: rgba(255, 255, 255, 0.04);
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #f093fb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.45);
          font-weight: 500;
        }

        .loading {
          text-align: center;
          padding: 100px 20px;
          color: rgba(255, 255, 255, 0.4);
        }

        .loading p {
          font-size: 14px;
          margin-top: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 100px 20px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .empty-icon {
          font-size: 64px;
          display: block;
          margin-bottom: 20px;
          opacity: 0.5;
          filter: grayscale(0.5);
        }

        .empty-state p {
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
          font-size: 15px;
        }

        .visitors-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .visitor-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 18px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .visitor-card:active {
          transform: scale(0.985);
          background: rgba(255, 255, 255, 0.04);
        }

        .visitor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .visitor-time {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.45);
          font-weight: 500;
        }

        .score-badge {
          font-size: 12px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 10px;
          font-variant-numeric: tabular-nums;
        }

        .score-badge.high {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }

        .score-badge.medium {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.25);
        }

        .score-badge.low {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        .visitor-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .visitor-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .visitor-row:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.45);
          font-weight: 500;
        }

        .value {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .value.ip {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
          font-size: 12px;
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 12px;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 0.3px;
        }

        .visitor-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
      `}</style>
    </div>
  );
}
