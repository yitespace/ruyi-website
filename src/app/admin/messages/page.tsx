'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  name: string;
  content: string;
  ip: string;
  avatar?: string;
  createdAt: number;
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('approved');
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const [approvedMessages, setApprovedMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLock, setActionLock] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchMessages();
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

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const [approvedRes, pendingRes] = await Promise.all([
        fetch('/api/messages'),
        fetch('/api/messages/pending'),
      ]);

      const approvedData = await approvedRes.json();
      const pendingData = await pendingRes.json();

      if (approvedData.success) {
        setApprovedMessages(approvedData.messages || []);
      }
      if (pendingData.success) {
        setPendingMessages(pendingData.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (id: string, action: 'approve' | 'reject') => {
    setActionLock(id);
    try {
      const res = await fetch('/api/messages/[id]', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      const data = await res.json();

      if (data.success) {
        setPendingMessages((prev) => prev.filter((m) => m.id !== id));
        if (action === 'approve') {
          fetchMessages();
        }
        alert(action === 'approve' ? '已通过' : '已拒绝');
      } else {
        alert(data.error || '操作失败');
      }
    } catch (error) {
      console.error('Failed to review message:', error);
      alert('操作失败，请重试');
    } finally {
      setActionLock(null);
    }
  };

  const handleBanIp = async (ip: string) => {
    if (!confirm(`确定要封禁 IP ${ip} 吗？`)) return;

    try {
      const res = await fetch('/api/messages/ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, action: 'ban' }),
      });

      const data = await res.json();

      if (data.success) {
        alert('IP 已封禁');
      } else {
        alert(data.error || '操作失败');
      }
    } catch (error) {
      console.error('Failed to ban IP:', error);
      alert('操作失败，请重试');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条留言吗？')) return;

    try {
      const res = await fetch(`/api/messages/[id]?id=${id}&list=approved`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setApprovedMessages((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(data.error || '删除失败');
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('删除失败，请重试');
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

  return (
    <div className="admin-messages">
      <header className="page-header">
        <h1>💬 留言审核</h1>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          待审核 {pendingMessages.length > 0 && <span className="badge">{pendingMessages.length}</span>}
        </button>
        <button
          className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          已通过
        </button>
      </div>

      {isLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <>
          {activeTab === 'pending' ? (
            pendingMessages.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🎉</span>
                <p>暂无待审核留言</p>
              </div>
            ) : (
              <div className="messages-list">
                {pendingMessages.map((msg) => (
                  <div key={msg.id} className="message-card">
                    <div className="message-header">
                      <div className="message-avatar">
                        {msg.avatar ? (
                          <img src={msg.avatar} alt={msg.name} />
                        ) : (
                          <span>{msg.name[0]}</span>
                        )}
                      </div>
                      <div className="message-info">
                        <div className="message-name">{msg.name}</div>
                        <div className="message-meta">
                          <span>{formatTime(msg.createdAt)}</span>
                          <span className="ip-tag">IP: {msg.ip}</span>
                        </div>
                      </div>
                    </div>
                    <p className="message-content">{msg.content}</p>
                    <div className="message-actions">
                      <button
                        className="btn-approve"
                        onClick={() => handleReview(msg.id, 'approve')}
                        disabled={actionLock === msg.id}
                      >
                        ✓ 通过
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleReview(msg.id, 'reject')}
                        disabled={actionLock === msg.id}
                      >
                        ✕ 拒绝
                      </button>
                      <button
                        className="btn-ban"
                        onClick={() => handleBanIp(msg.ip)}
                        disabled={actionLock === msg.id}
                      >
                        🚫
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            approvedMessages.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>暂无已审核留言</p>
              </div>
            ) : (
              <div className="messages-list">
                {approvedMessages.map((msg) => (
                  <div key={msg.id} className="message-card approved">
                    <div className="message-header">
                      <div className="message-avatar">
                        {msg.avatar ? (
                          <img src={msg.avatar} alt={msg.name} />
                        ) : (
                          <span>{msg.name[0]}</span>
                        )}
                      </div>
                      <div className="message-info">
                        <div className="message-name">{msg.name}</div>
                        <div className="message-meta">
                          <span>{formatTime(msg.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="message-content">{msg.content}</p>
                    <div className="message-actions">
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(msg.id)}
                      >
                        🗑️ 删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}

      <style jsx>{`
        .admin-messages {
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

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.04);
          padding: 6px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .tab {
          flex: 1;
          padding: 12px 20px;
          background: transparent;
          color: rgba(255, 255, 255, 0.45);
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }

        .tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tab.active::before {
          opacity: 1;
        }

        .tab.active {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.15));
          color: #fff;
          box-shadow: 0 2px 12px rgba(102, 126, 234, 0.2);
        }

        .badge {
          background: linear-gradient(135deg, #ff6b9d, #f093fb);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(255, 107, 157, 0.4);
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

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 18px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .message-card:active {
          transform: scale(0.985);
          background: rgba(255, 255, 255, 0.04);
        }

        .message-card.approved {
          border-color: rgba(76, 175, 80, 0.15);
          background: rgba(76, 175, 80, 0.03);
        }

        .message-header {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 14px;
        }

        .message-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b9d, #f093fb);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
        }

        .message-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .message-info {
          flex: 1;
          min-width: 0;
        }

        .message-name {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          font-size: 15px;
          margin-bottom: 4px;
        }

        .message-meta {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .ip-tag {
          font-family: 'SF Mono', 'Monaco', monospace;
          background: rgba(255, 255, 255, 0.06);
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.3px;
        }

        .message-content {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          margin-bottom: 16px;
          word-wrap: break-word;
          font-size: 14px;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .message-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .message-actions button {
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .message-actions button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-approve {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
        }

        .btn-approve:hover:not(:disabled) {
          box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
        }

        .btn-reject {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #fff;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .btn-reject:hover:not(:disabled) {
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
        }

        .btn-ban {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-ban:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .btn-delete {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }

        .btn-delete:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.15);
        }

        .message-actions button:active:not(:disabled) {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
