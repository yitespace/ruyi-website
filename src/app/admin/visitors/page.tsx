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
    return date.toLocaleString('zh-CN');
  };

  const getBrowserName = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getDeviceName = (userAgent: string) => {
    if (userAgent.includes('Mobile')) return 'Mobile';
    if (userAgent.includes('Tablet')) return 'Tablet';
    return 'Desktop';
  };

  return (
    <div className="admin-visitors">
      <h1>👥 访客数据</h1>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">总访客数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.today}</div>
          <div className="stat-label">今日访客</div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">加载中...</div>
      ) : visitors.length === 0 ? (
        <div className="empty-state">暂无访客记录</div>
      ) : (
        <div className="visitors-table">
          <div className="table-header">
            <div>时间</div>
            <div>IP 地址</div>
            <div>设备</div>
            <div>浏览器</div>
            <div>契合度</div>
          </div>
          {visitors.map((visitor) => (
            <div key={visitor.id} className="table-row">
              <div>{formatTime(visitor.visitedAt)}</div>
              <div className="ip-address">{visitor.ip}</div>
              <div>{getDeviceName(visitor.userAgent)}</div>
              <div>{getBrowserName(visitor.userAgent)}</div>
              <div>
                {visitor.compatibilityScore !== undefined ? (
                  <span className={`score ${getScoreClass(visitor.compatibilityScore)}`}>
                    {visitor.compatibilityScore}%
                  </span>
                ) : (
                  '-'
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .admin-visitors {
          padding: 20px;
        }

        h1 {
          font-size: 24px;
          color: #fff;
          margin-bottom: 20px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
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
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 5px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: rgba(255, 255, 255, 0.7);
        }

        .empty-state {
          padding: 40px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
        }

        .visitors-table {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr;
          gap: 10px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.1);
          font-weight: 600;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }

        .table-row {
          display: grid;
          grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr;
          gap: 10px;
          padding: 12px 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .table-row:nth-child(even) {
          background: rgba(255, 255, 255, 0.02);
        }

        .ip-address {
          font-family: monospace;
          font-size: 13px;
        }

        .score {
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .score.high {
          background: rgba(76, 175, 80, 0.3);
          color: #81c784;
        }

        .score.medium {
          background: rgba(255, 193, 7, 0.3);
          color: #ffd54f;
        }

        .score.low {
          background: rgba(244, 67, 54, 0.3);
          color: #e57373;
        }

        @media (max-width: 768px) {
          .table-header {
            display: none;
          }

          .table-row {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}

function getScoreClass(score: number): string {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}
