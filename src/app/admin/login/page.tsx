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
      {/* 背景动画 */}
      <div className="login-background">
        <div className="bg-gradient-orb orb-1" />
        <div className="bg-gradient-orb orb-2" />
        <div className="bg-gradient-orb orb-3" />
        <div className="bg-grid" />
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-ring" />
            <div className="logo-icon">🔐</div>
          </div>
          <h1 className="login-title">管理端登录</h1>
          <p className="login-subtitle">请输入管理员密码继续</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-wrapper">
              <input
                type="password"
                className="form-input"
                placeholder="输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                autoComplete="current-password"
              />
              <div className="input-border" />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">!</span>
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="btn-spinner" />
                <span>登录中...</span>
              </>
            ) : (
              <>
                <span>登录</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </>
            )}
          </button>
        </form>

        <a href="/" className="back-home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>返回首页</span>
        </a>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(180deg, #050508 0%, #0a0a12 50%, #080810 100%);
          position: relative;
          overflow: hidden;
        }

        .login-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .bg-gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
          animation: float 10s ease-in-out infinite;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          top: -200px;
          right: -150px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #f093fb, #f59e0b);
          bottom: 10%;
          left: -100px;
          animation-delay: -5s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #06b6d4, #0ea5e9);
          bottom: 30%;
          right: 10%;
          animation-delay: -7s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }

        .bg-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-radius: 28px;
          padding: 48px 36px;
          text-align: center;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.06) inset;
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
          z-index: 1;
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-header {
          margin-bottom: 36px;
        }

        .logo-container {
          width: 88px;
          height: 88px;
          margin: 0 auto 24px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid rgba(102, 126, 234, 0.3);
          animation: rotate 8s linear infinite;
        }

        .logo-ring::before {
          content: '';
          position: absolute;
          top: -2px;
          left: 50%;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #667eea, #f093fb);
          border-radius: 50%;
          filter: blur(4px);
        }

        @keyframes rotate {
          to { transform: rotate(360deg); }
        }

        .logo-icon {
          font-size: 40px;
          filter: drop-shadow(0 4px 12px rgba(102, 126, 234, 0.5));
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .login-title {
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .login-subtitle {
          color: rgba(255, 255, 255, 0.4);
          font-size: 14px;
          margin: 0;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          width: 100%;
        }

        .input-wrapper {
          position: relative;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-wrapper:focus-within {
          background: rgba(255, 255, 255, 0.06);
          transform: scale(1.02);
        }

        .form-input {
          width: 100%;
          padding: 18px 20px;
          border: none;
          background: transparent;
          color: #fff;
          font-size: 16px;
          outline: none;
          font-weight: 500;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .input-border {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 60%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #667eea, transparent);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-wrapper:focus-within .input-border {
          transform: translateX(-50%) scaleX(1);
        }

        .error-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          color: #f87171;
          font-size: 14px;
          font-weight: 500;
          animation: shake 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        .error-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          background: #ef4444;
          color: #fff;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 700;
        }

        .login-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 18px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow:
            0 4px 20px rgba(102, 126, 234, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          overflow: hidden;
        }

        .login-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .login-btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .login-btn:active:not(:disabled) {
          transform: scale(0.97);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-btn svg {
          width: 18px;
          height: 18px;
        }

        .back-home {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 28px;
          color: rgba(255, 255, 255, 0.35);
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 20px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 14px;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .back-home:hover {
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.55);
        }

        .back-home:active {
          transform: scale(0.95);
        }

        .back-home svg {
          width: 16px;
          height: 16px;
        }
      `}</style>
    </div>
  );
}
