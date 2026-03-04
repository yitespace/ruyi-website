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
        setBannedIps((prev) => prev.filter((i) => i !== ip));
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

        .settings-section {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .section-title {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 16px;
          font-weight: 600;
        }

        .ip-form {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .ip-form .form-input {
          flex: 1;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          outline: none;
        }

        .ip-form .form-input:focus {
          border-color: rgba(255, 255, 255, 0.3);
        }

        .ban-btn {
          padding: 12px 20px;
          background: linear-gradient(45deg, #f44336, #e91e63);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ban-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ban-btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .banned-list {
          margin-top: 16px;
        }

        .list-title {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 12px;
        }

        .banned-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          margin-bottom: 8px;
        }

        .ip-text {
          font-family: monospace;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
        }

        .unban-btn {
          padding: 6px 12px;
          background: rgba(76, 175, 80, 0.2);
          color: #81c784;
          border: 1px solid rgba(76, 175, 80, 0.3);
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .unban-btn:active {
          transform: scale(0.95);
        }

        .empty-state {
          padding: 20px;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }

        .form-group .form-input {
          width: 100%;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }

        .form-group .form-input:focus {
          border-color: rgba(255, 255, 255, 0.3);
        }

        .change-password-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .change-password-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .about-info {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.8;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
