'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      if (data.isLoggedIn) {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Failed to check login status:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin');
      } else {
        setError(data.error || '密码错误');
      }
    } catch (error) {
      setError('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">🔐</div>
        <h1 className="login-title">管理端登录</h1>
        <p className="login-subtitle">请输入管理员密码</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>

        <a href="/" className="back-home">
          ← 返回首页
        </a>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        }

        .login-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 40px 30px;
          width: 100%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .login-icon {
          font-size: 56px;
          margin-bottom: 10px;
        }

        .login-title {
          font-size: 24px;
          color: #fff;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .login-subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin-bottom: 30px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          width: 100%;
        }

        .form-input {
          width: 100%;
          padding: 16px 18px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-input:focus {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.12);
        }

        .form-error {
          color: #ff6b6b;
          font-size: 14px;
          padding: 12px;
          background: rgba(255, 107, 107, 0.1);
          border-radius: 10px;
          border: 1px solid rgba(255, 107, 107, 0.2);
        }

        .login-btn {
          padding: 16px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .back-home {
          display: inline-block;
          margin-top: 24px;
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 20px;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .back-home:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
}
