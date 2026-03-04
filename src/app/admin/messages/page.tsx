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
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.success) {
        setApprovedMessages(data.messages || []);
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

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.08);
          padding: 5px;
          border-radius: 12px;
        }

        .tab {
          flex: 1;
          padding: 12px 20px;
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .tab.active {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }

        .badge {
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          color: #fff;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
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

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .message-card.approved {
          border-color: rgba(76, 175, 80, 0.3);
        }

        .message-header {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 12px;
        }

        .message-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          overflow: hidden;
          flex-shrink: 0;
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
          color: #fff;
          font-size: 15px;
          margin-bottom: 4px;
        }

        .message-meta {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .ip-tag {
          font-family: monospace;
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
        }

        .message-content {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          margin-bottom: 15px;
          word-wrap: break-word;
          font-size: 14px;
        }

        .message-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .message-actions button {
          padding: 8px 14px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .message-actions button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-approve {
          background: linear-gradient(45deg, #4caf50, #8bc34a);
          color: #fff;
        }

        .btn-reject {
          background: linear-gradient(45deg, #f44336, #e91e63);
          color: #fff;
        }

        .btn-ban {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }

        .btn-delete {
          background: rgba(244, 67, 54, 0.2);
          color: #fff;
          border: 1px solid rgba(244, 67, 54, 0.3);
        }

        .message-actions button:active:not(:disabled) {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
