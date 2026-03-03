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
      // 注意：待审核留言需要单独的 API
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
        // 从待审核列表移除
        setPendingMessages((prev) => prev.filter((m) => m.id !== id));
        if (action === 'approve') {
          fetchMessages(); // 重新获取已审核列表
        }
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
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  return (
    <div className="admin-messages">
      <h1>💬 留言审核</h1>

      {isLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <>
          {/* 待审核留言 */}
          <section className="messages-section">
            <h2>⏳ 待审核 ({pendingMessages.length})</h2>
            {pendingMessages.length === 0 ? (
              <div className="empty-state">暂无待审核留言</div>
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
                          <span className="message-ip">IP: {msg.ip}</span>
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
                        🚫 封禁 IP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 已审核留言 */}
          <section className="messages-section">
            <h2>✅ 已审核 ({approvedMessages.length})</h2>
            {approvedMessages.length === 0 ? (
              <div className="empty-state">暂无已审核留言</div>
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
            )}
          </section>
        </>
      )}

      <style jsx>{`
        .admin-messages {
          padding: 20px;
        }

        h1 {
          font-size: 24px;
          color: #fff;
          margin-bottom: 20px;
        }

        h2 {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 15px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: rgba(255, 255, 255, 0.7);
        }

        .messages-section {
          margin-bottom: 30px;
        }

        .empty-state {
          padding: 30px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .message-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .message-card.approved {
          border-color: rgba(76, 175, 80, 0.3);
        }

        .message-header {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 15px;
        }

        .message-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
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
        }

        .message-name {
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }

        .message-meta {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          gap: 10px;
        }

        .message-ip {
          font-family: monospace;
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .message-content {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          margin-bottom: 15px;
          word-wrap: break-word;
        }

        .message-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .message-actions button {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
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
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        .btn-delete {
          background: rgba(244, 67, 54, 0.3);
          color: #fff;
        }

        .message-actions button:active:not(:disabled) {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
