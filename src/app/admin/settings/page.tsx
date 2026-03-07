'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [bannedIps, setBannedIps] = useState<string[]>([]);
  const [newIp, setNewIp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchBannedIps();
  }, []);

  const fetchBannedIps = async () => {
    try {
      const res = await fetch('/api/messages/ip');
      const data = await res.json();
      if (data.success) {
        setBannedIps(data.ips || []);
      }
    } catch (error) {
      console.error('Failed to fetch banned IPs:', error);
    }
  };

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

  const handleBanIp = async () => {
    if (!newIp.trim()) {
      alert('请输入 IP 地址');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/messages/ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: newIp.trim(), action: 'ban' }),
      });

      const data = await res.json();

      if (data.success) {
        alert('IP 已封禁');
        setNewIp('');
        fetchBannedIps();
      } else {
        alert(data.error || '操作失败');
      }
    } catch (error) {
      console.error('Failed to ban IP:', error);
      alert('操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnbanIp = async (ip: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/messages/ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, action: 'unban' }),
      });

      const data = await res.json();

      if (data.success) {
        alert('IP 已解封');
        fetchBannedIps();
      } else {
        alert(data.error || '操作失败');
      }
    } catch (error) {
      console.error('Failed to unban IP:', error);
      alert('操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert('密码至少需要 6 位');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }

    setIsLoading(true);
    try {
      alert('密码修改功能开发中...');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('修改失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-settings">
      <header className="page-header">
        <h1>⚙️ 设置</h1>
      </header>

      {/* IP 封禁管理 */}
      <section className="settings-section">
        <h2 className="section-title">🚫 IP 封禁管理</h2>
        <div className="ip-form">
          <input
            type="text"
            placeholder="输入要封禁的 IP 地址"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            className="form-input"
          />
          <button onClick={handleBanIp} disabled={isLoading} className="ban-btn">
            封禁
          </button>
        </div>

        {bannedIps.length > 0 ? (
          <div className="banned-list">
            <h3 className="list-title">已封禁列表</h3>
            {bannedIps.map((ip) => (
              <div key={ip} className="banned-item">
                <span className="ip-text">{ip}</span>
                <button onClick={() => handleUnbanIp(ip)} className="unban-btn">
                  解封
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">暂无封禁的 IP</div>
        )}
      </section>

      {/* 修改密码 */}
      <section className="settings-section">
        <h2 className="section-title">🔐 修改密码</h2>
        <div className="form-group">
          <label>新密码</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="至少 6 位"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>确认密码</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="再次输入新密码"
            className="form-input"
          />
        </div>
        <button className="change-password-btn" onClick={handleChangePassword} disabled={isLoading}>
          {isLoading ? '修改中...' : '修改密码'}
        </button>
      </section>

      {/* 关于 */}
      <section className="settings-section">
        <h2 className="section-title">ℹ️ 关于</h2>
        <div className="about-info">
          <p>汝意个人网站管理系统</p>
          <p>版本：1.0.0</p>
          <p>技术栈：Next.js 14 + Vercel KV</p>
        </div>
      </section>

      <style jsx>{`
        .admin-settings {
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

        .settings-section {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ip-form {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .ip-form .form-input {
          flex: 1;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: all 0.25s ease;
        }

        .ip-form .form-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .ip-form .form-input:focus {
          border-color: rgba(102, 126, 234, 0.4);
          background: rgba(255, 255, 255, 0.06);
        }

        .ban-btn {
          padding: 14px 22px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          white-space: nowrap;
        }

        .ban-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ban-btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .banned-list {
          margin-top: 14px;
        }

        .list-title {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.45);
          margin-bottom: 12px;
          font-weight: 500;
        }

        .banned-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          margin-bottom: 8px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          transition: all 0.2s ease;
        }

        .banned-item:active {
          background: rgba(255, 255, 255, 0.04);
        }

        .ip-text {
          font-family: 'SF Mono', 'Monaco', monospace;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 0.3px;
        }

        .unban-btn {
          padding: 7px 14px;
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.25);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .unban-btn:active {
          transform: scale(0.95);
          background: rgba(34, 197, 94, 0.2);
        }

        .empty-state {
          padding: 28px;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          font-size: 14px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 14px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 10px;
          font-weight: 500;
        }

        .form-group .form-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          transition: all 0.25s ease;
        }

        .form-group .form-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .form-group .form-input:focus {
          border-color: rgba(102, 126, 234, 0.4);
          background: rgba(255, 255, 255, 0.06);
        }

        .change-password-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          border-radius: 13px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .change-password-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .change-password-btn:active:not(:disabled) {
          transform: scale(0.97);
        }

        .about-info {
          color: rgba(255, 255, 255, 0.45);
          line-height: 2;
          font-size: 14px;
        }

        .about-info p {
          margin: 0;
        }
      `}</style>
    </div>
  );
}
