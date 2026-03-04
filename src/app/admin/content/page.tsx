'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminContentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('hero');
  const [isLoading, setIsLoading] = useState(false);

  const [heroData, setHeroData] = useState({
    avatar: '👸',
    title: '欢迎来到\n我的世界 🌸',
    subtitle: '你好呀！我是 ruyi！一个热爱生活、充满好奇心的女孩。这里是我分享生活的小天地～',
  });

  const [aboutData, setAboutData] = useState([
    { icon: '🎀', title: '我是谁', content: '一个温柔善良、乐观向上的女生。喜欢探索新事物，享受生活中的每一个小确幸。' },
    { icon: '🌟', title: '我的特点', content: '细心、有耐心、富有创造力。对待朋友真诚，对待生活热情满满！' },
    { icon: '💫', title: '我的梦想', content: '成为更好的自己，去更多地方，见更多人，体验更精彩的人生！' },
  ]);

  const [hobbiesData, setHobbiesData] = useState([
    '📸 摄影', '🎨 绘画', '📚 阅读', '🎵 音乐',
    '✈️ 旅行', '🍰 美食', '🌸 花艺', '💄 美妆',
    '🎬 电影', '🧘 瑜伽',
  ]);

  const [newHobby, setNewHobby] = useState('');

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

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            hero: heroData,
            about: aboutData,
            hobbies: hobbiesData,
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('保存成功！');
      } else {
        alert(data.error || '保存失败');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      alert('保存失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAboutCard = (index: number, field: string, value: string) => {
    const newData = [...aboutData];
    newData[index] = { ...newData[index], [field]: value };
    setAboutData(newData);
  };

  const addHobby = () => {
    if (newHobby.trim()) {
      setHobbiesData([...hobbiesData, newHobby.trim()]);
      setNewHobby('');
    }
  };

  const removeHobby = (index: number) => {
    const newData = hobbiesData.filter((_, i) => i !== index);
    setHobbiesData(newData);
  };

  return (
    <div className="admin-content">
      <header className="page-header">
        <h1>📝 内容编辑</h1>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          首页
        </button>
        <button
          className={`tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          关于我
        </button>
        <button
          className={`tab ${activeTab === 'hobbies' ? 'active' : ''}`}
          onClick={() => setActiveTab('hobbies')}
        >
          兴趣爱好
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'hero' && (
          <div className="form-section">
            <div className="form-group">
              <label>头像表情</label>
              <input
                type="text"
                value={heroData.avatar}
                onChange={(e) => setHeroData({ ...heroData, avatar: e.target.value })}
                maxLength={10}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>标题</label>
              <textarea
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                rows={2}
                className="form-textarea"
              />
            </div>
            <div className="form-group">
              <label>副标题</label>
              <textarea
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                rows={4}
                className="form-textarea"
              />
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="form-section">
            {aboutData.map((card, index) => (
              <div key={index} className="card-editor">
                <div className="card-header">卡片 {index + 1}</div>
                <div className="form-group">
                  <label>图标</label>
                  <input
                    type="text"
                    value={card.icon}
                    onChange={(e) => updateAboutCard(index, 'icon', e.target.value)}
                    maxLength={10}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>标题</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => updateAboutCard(index, 'title', e.target.value)}
                    maxLength={20}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>内容</label>
                  <textarea
                    value={card.content}
                    onChange={(e) => updateAboutCard(index, 'content', e.target.value)}
                    rows={3}
                    className="form-textarea"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hobbies' && (
          <div className="form-section">
            <div className="hobby-input-wrapper">
              <input
                type="text"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                placeholder="输入新的兴趣爱好，如：🎸 吉他"
                onKeyPress={(e) => e.key === 'Enter' && addHobby()}
                className="form-input"
              />
              <button className="add-btn" onClick={addHobby}>添加</button>
            </div>
            <div className="hobbies-list">
              {hobbiesData.map((hobby, index) => (
                <div key={index} className="hobby-item">
                  <span>{hobby}</span>
                  <button onClick={() => removeHobby(index)}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="save-btn" onClick={handleSave} disabled={isLoading}>
        {isLoading ? '保存中...' : '💾 保存更改'}
      </button>

      <style jsx>{`
        .admin-content {
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
          gap: 8px;
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.08);
          padding: 5px;
          border-radius: 12px;
          overflow-x: auto;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .tab.active {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }

        .tab-content {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .form-input,
        .form-textarea {
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.12);
        }

        .card-editor {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .card-header {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 12px;
          font-weight: 500;
        }

        .hobby-input-wrapper {
          display: flex;
          gap: 10px;
        }

        .hobby-input-wrapper .form-input {
          flex: 1;
        }

        .add-btn {
          padding: 12px 20px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-btn:active {
          transform: scale(0.95);
        }

        .hobbies-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 16px;
        }

        .hobby-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .hobby-item span {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }

        .hobby-item button {
          padding: 6px 10px;
          background: rgba(244, 67, 54, 0.2);
          color: #ff6b6b;
          border: 1px solid rgba(244, 67, 54, 0.3);
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .hobby-item button:active {
          transform: scale(0.95);
          background: rgba(244, 67, 54, 0.3);
        }

        .save-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(45deg, #4caf50, #8bc34a);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .save-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
