'use client';

interface HeroProps {
  avatar?: string;
  title?: string;
  subtitle?: string;
  onLearnMore?: () => void;
}

export default function Hero({
  avatar = '👸',
  title = '欢迎来到\n我的世界 🌸',
  subtitle = '你好呀！我是 ruyi！一个热爱生活、充满好奇心的女孩。这里是我分享生活的小天地～',
  onLearnMore,
}: HeroProps) {
  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore();
    } else {
      const section = document.getElementById('about');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section className="hero" id="home">
      <div className="avatar-container">
        <div className="avatar-ring" />
        <div className="avatar">{avatar}</div>
      </div>
      <h1 className="hero-title">{title}</h1>
      <p className="hero-subtitle">{subtitle}</p>
      <button className="btn" onClick={handleLearnMore}>
        了解更多 ↓
      </button>

      <style jsx>{`
        .hero {
          text-align: center;
          padding: 40px 20px 60px;
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .avatar-container {
          width: 140px;
          height: 140px;
          margin: 0 auto 25px;
          position: relative;
        }

        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(45deg, #ff6b9d, #c44569, #f093fb);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 60px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          animation: pulse 2s infinite;
          border: 4px solid rgba(255, 255, 255, 0.3);
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          }
          50% {
            box-shadow: 0 8px 45px rgba(255, 107, 157, 0.5);
          }
        }

        .avatar-ring {
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          animation: rotate 10s linear infinite;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .hero-title {
          font-size: 28px;
          margin-bottom: 15px;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
          line-height: 1.3;
          white-space: pre-line;
        }

        .hero-subtitle {
          font-size: 16px;
          max-width: 400px;
          margin: 0 auto 30px;
          opacity: 0.95;
          padding: 0 10px;
        }

        .btn {
          display: inline-block;
          padding: 14px 35px;
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          color: #fff;
          text-decoration: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 5px 20px rgba(255, 107, 157, 0.4);
          border: none;
          cursor: pointer;
          -webkit-appearance: none;
        }

        .btn:active {
          transform: scale(0.95);
          box-shadow: 0 3px 15px rgba(255, 107, 157, 0.4);
        }

        @media (min-width: 768px) {
          .hero {
            padding: 60px 40px 80px;
          }

          .avatar-container {
            width: 180px;
            height: 180px;
          }

          .avatar {
            font-size: 80px;
          }

          .hero-title {
            font-size: 40px;
          }

          .hero-subtitle {
            font-size: 18px;
          }
        }
      `}</style>
    </section>
  );
}
