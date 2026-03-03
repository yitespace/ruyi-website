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
      <h1>📝 内容编辑</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          首页区域
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
              />
            </div>
            <div className="form-group">
              <label>标题</label>
              <textarea
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                rows={2}
              />
            </div>
            <div className="form-group">
              <label>副标题/介绍</label>
              <textarea
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                rows={4}
              />
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="form-section">
            {aboutData.map((card, index) => (
              <div key={index} className="card-editor">
                <div className="card-header">
                  <span>卡片 {index + 1}</span>
                </div>
                <div className="form-group">
                  <label>图标</label>
                  <input
                    type="text"
                    value={card.icon}
                    onChange={(e) => updateAboutCard(index, 'icon', e.target.value)}
                    maxLength={10}
                  />
                </div>
                <div className="form-group">
                  <label>标题</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => updateAboutCard(index, 'title', e.target.value)}
                    maxLength={20}
                  />
                </div>
                <div className="form-group">
                  <label>内容</label>
                  <textarea
                    value={card.content}
                    onChange={(e) => updateAboutCard(index, 'content', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hobbies' && (
          <div className="form-section">
            <div className="hobby-input">
              <input
                type="text"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                placeholder="输入新的兴趣爱好，如：🎸 吉他"
                onKeyPress={(e) => e.key === 'Enter' && addHobby()}
              />
              <button onClick={addHobby}>添加</button>
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
        }

        h1 {
          font-size: 24px;
          color: #fff;
          margin-bottom: 20px;
        }

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          overflow-x: auto;
        }

        .tab {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .tab.active {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: #fff;
          border-color: transparent;
        }

        .tab-content {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
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
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .form-group input,
        .form-group textarea {
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.15);
        }

        .card-editor {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        }

        .card-header {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 10px;
        }

        .hobby-input {
          display: flex;
          gap: 10px;
        }

        .hobby-input input {
          flex: 1;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 15px;
          outline: none;
        }

        .hobby-input button {
          padding: 12px 20px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .hobbies-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 15px;
        }

        .hobby-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .hobby-item button {
          padding: 5px 10px;
          background: rgba(244, 67, 54, 0.3);
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .save-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(45deg, #4caf50, #8bc34a);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
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
