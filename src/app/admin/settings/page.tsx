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

  const fetchBannedIps = async () => {
    // 注意：需要创建新的 API 端点来获取封禁 IP 列表
    // 这里暂时显示为空
    setBannedIps([]);
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
      // 注意：需要创建新的 API 端点来修改密码
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
      <h1>⚙️ 设置</h1>

      {/* IP 封禁管理 */}
      <section className="settings-section">
        <h2>🚫 IP 封禁管理</h2>
        <div className="ip-ban-form">
          <input
            type="text"
            placeholder="输入要封禁的 IP 地址"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
          />
          <button onClick={handleBanIp} disabled={isLoading}>
            封禁
          </button>
        </div>

        {bannedIps.length > 0 ? (
          <div className="banned-ips">
            <h3>已封禁 IP 列表</h3>
            {bannedIps.map((ip) => (
              <div key={ip} className="banned-ip-item">
                <span>{ip}</span>
                <button onClick={() => handleUnbanIp(ip)}>解封</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">暂无封禁的 IP</div>
        )}
      </section>

      {/* 修改密码 */}
      <section className="settings-section">
        <h2>🔐 修改密码</h2>
        <div className="form-group">
          <label>新密码</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="至少 6 位"
          />
        </div>
        <div className="form-group">
          <label>确认密码</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="再次输入新密码"
          />
        </div>
        <button className="change-password-btn" onClick={handleChangePassword} disabled={isLoading}>
          {isLoading ? '修改中...' : '修改密码'}
        </button>
      </section>

      {/* 关于 */}
      <section className="settings-section">
        <h2>ℹ️ 关于</h2>
        <div className="about-info">
          <p>汝意个人网站管理系统</p>
          <p>版本：1.0.0</p>
          <p>技术栈：Next.js 14 + Vercel KV</p>
        </div>
      </section>

      <style jsx>{`
        .admin-settings {
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

        h3 {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 10px;
        }

        .settings-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .ip-ban-form {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .ip-ban-form input {
          flex: 1;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 15px;
          outline: none;
        }

        .ip-ban-form input:focus {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .ip-ban-form button {
          padding: 12px 20px;
          background: linear-gradient(45deg, #f44336, #e91e63);
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .ip-ban-form button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .banned-ips {
          margin-top: 15px;
        }

        .banned-ip-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .banned-ip-item span {
          font-family: monospace;
          color: rgba(255, 255, 255, 0.8);
        }

        .banned-ip-item button {
          padding: 6px 12px;
          background: rgba(76, 175, 80, 0.3);
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }

        .empty-state {
          padding: 20px;
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 15px;
          outline: none;
          box-sizing: border-box;
        }

        .form-group input:focus {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .change-password-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .change-password-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .about-info {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.8;
        }
      `}</style>
    </div>
  );
}
