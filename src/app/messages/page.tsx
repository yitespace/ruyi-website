'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import EmojiPicker from '@/components/Messages/EmojiPicker';
import Navigation from '@/components/Navigation';
import Particles from '@/components/Particles';

interface Message {
  id: string;
  name: string;
  content: string;
  avatar?: string;
  createdAt: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !content.trim()) {
      alert('请填写昵称和留言内容');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content }),
      });

      const data = await res.json();

      if (data.success) {
        alert('留言已提交，请等待审核～');
        setName('');
        setContent('');
        if (contentRef.current) {
          contentRef.current.style.height = 'auto';
        }
      } else {
        alert(data.error || '提交失败，请重试');
      }
    } catch (error) {
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji);
    setShowEmoji(false);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;

    if (diff < minute) return '刚刚';
    if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
    if (diff < day) return `${Math.floor(diff / hour)}小时前`;
    if (diff < month) return `${Math.floor(diff / day)}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <main>
      <Navigation />
      <Particles />

      <div className="messages-container">
        <div className="messages-header">
          <h1 className="page-title">留言墙 💌</h1>
          <p className="page-subtitle">留下你的足迹，和大家打个招呼吧～</p>
        </div>

        {/* 留言表单 */}
        <form className="message-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="你的昵称 *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <div className="textarea-wrapper">
              <textarea
                ref={contentRef}
                className="form-textarea"
                placeholder="写下你的留言...（支持表情）"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  const target = e.target;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
                }}
                maxLength={500}
                rows={1}
              />
              <button
                type="button"
                className="emoji-btn"
                onClick={() => setShowEmoji(true)}
              >
                😊
              </button>
            </div>
            <div className="char-count">{content.length}/500</div>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? '提交中...' : '提交留言 ✨'}
          </button>
        </form>

        {/* 留言列表 */}
        <div className="messages-list">
          {isLoading ? (
            <div className="loading-messages">加载中...</div>
          ) : messages.length === 0 ? (
            <div className="empty-messages">
              <p>还没有留言，快来抢沙发吧～</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="message-item">
                <div className="message-avatar">
                  {msg.avatar ? (
                    <img src={msg.avatar} alt={msg.name} />
                  ) : (
                    <span>{msg.name[0]}</span>
                  )}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-name">{msg.name}</span>
                    <span className="message-time">{formatTime(msg.createdAt)}</span>
                  </div>
                  <p className="message-text">{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 返回首页按钮 */}
      <button className="home-btn" onClick={() => router.push('/')}>
        <span>🏠</span>
        <span>返回首页</span>
      </button>

      {showEmoji && (
        <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />
      )}

      <style jsx>{`
        main {
          min-height: 100vh;
          padding: 20px;
          padding-bottom: 100px;
        }

        .messages-container {
          max-width: 800px;
          margin: 0 auto;
          padding-top: 20px;
        }

        .messages-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .page-title {
          font-size: 28px;
          margin-bottom: 10px;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
        }

        .page-subtitle {
          font-size: 15px;
          opacity: 0.9;
        }

        .message-form {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-input {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-input:focus {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.15);
        }

        .textarea-wrapper {
          position: relative;
          display: flex;
          align-items: flex-end;
        }

        .form-textarea {
          flex: 1;
          padding: 15px 20px;
          padding-right: 50px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 16px;
          outline: none;
          resize: none;
          font-family: inherit;
          transition: all 0.3s ease;
          max-height: 200px;
        }

        .form-textarea::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-textarea:focus {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.15);
        }

        .emoji-btn {
          position: absolute;
          right: 10px;
          bottom: 10px;
          width: 36px;
          height: 36px;
          border: none;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .emoji-btn:active {
          transform: scale(0.9);
          background: rgba(255, 255, 255, 0.3);
        }

        .char-count {
          text-align: right;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 5px;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          color: #fff;
          border: none;
          border-radius: 15px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 20px rgba(255, 107, 157, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-btn:not(:disabled):active {
          transform: scale(0.98);
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .loading-messages,
        .empty-messages {
          text-align: center;
          padding: 40px 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          opacity: 0.8;
        }

        .message-item {
          display: flex;
          gap: 15px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .message-item:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.2);
        }

        .message-avatar {
          flex-shrink: 0;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          overflow: hidden;
        }

        .message-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .message-avatar span {
          color: #fff;
          font-weight: 600;
        }

        .message-content {
          flex: 1;
          min-width: 0;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          gap: 10px;
        }

        .message-name {
          font-weight: 600;
          font-size: 16px;
        }

        .message-time {
          font-size: 12px;
          opacity: 0.7;
        }

        .message-text {
          line-height: 1.6;
          word-wrap: break-word;
          font-size: 15px;
        }

        @media (min-width: 768px) {
          main {
            padding: 30px;
          }

          .page-title {
            font-size: 32px;
          }
        }

        .home-btn {
          position: fixed;
          bottom: 100px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          z-index: 90;
        }

        .home-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .home-btn:active {
          transform: scale(0.95);
        }

        @media (min-width: 768px) {
          .home-btn {
            right: 40px;
            bottom: 120px;
          }
        }
      `}</style>
    </main>
  );
}
