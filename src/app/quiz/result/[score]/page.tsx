'use client';

import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Particles from '@/components/Particles';
import { getScoreMessage } from '@/lib/quiz';

export default function QuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const score = parseInt(params.score as string, 10) || 0;
  const message = getScoreMessage(score);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#ffd700';
    if (score >= 70) return '#ff6b9d';
    if (score >= 50) return '#f093fb';
    if (score >= 30) return '#667eea';
    return '#764ba2';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '💕';
    if (score >= 70) return '🌸';
    if (score >= 50) return '✨';
    if (score >= 30) return '🎨';
    return '🌟';
  };

  const handleRetake = () => {
    router.push('/quiz');
  };

  const handleShare = () => {
    const shareText = `我和汝意的契合度是 ${score}%！${message}`;
    if (navigator.share) {
      navigator.share({
        title: '契合度测试',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n快来测测你和汝意的契合度吧！`);
      alert('已复制结果，快去分享吧～');
    }
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <main>
      <Navigation />
      <Particles />

      <div className="result-container">
        <div className="result-card">
          <div className="result-emoji">{getScoreEmoji(score)}</div>
          <h1 className="result-title">契合度结果</h1>

          <div className="score-circle" style={{ borderColor: getScoreColor(score) }}>
            <div className="score-value" style={{ color: getScoreColor(score) }}>
              {score}%
            </div>
          </div>

          <p className="result-message">{message}</p>

          <div className="result-actions">
            <button className="result-btn result-btn-secondary" onClick={handleRetake}>
              再测一次
            </button>
            <button className="result-btn result-btn-primary" onClick={handleShare}>
              分享结果
            </button>
          </div>

          <button className="result-home" onClick={handleHome}>
            🏠 返回首页
          </button>
        </div>
      </div>

      <style jsx>{`
        main {
          min-height: 100vh;
          padding: 20px;
        }

        .result-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 30px;
          padding: 40px 30px;
          text-align: center;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.6s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .result-emoji {
          font-size: 64px;
          margin-bottom: 10px;
          animation: bounce 1s ease infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .result-title {
          font-size: 24px;
          margin-bottom: 30px;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
        }

        .score-circle {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          border: 6px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
          background: rgba(255, 255, 255, 0.1);
          transition: border-color 0.3s ease;
        }

        .score-value {
          font-size: 48px;
          font-weight: 700;
          transition: color 0.3s ease;
        }

        .result-message {
          font-size: 18px;
          margin-bottom: 40px;
          opacity: 0.95;
          line-height: 1.6;
        }

        .result-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .result-btn {
          padding: 14px 30px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .result-btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        .result-btn-primary {
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          color: #fff;
          box-shadow: 0 5px 20px rgba(255, 107, 157, 0.4);
        }

        .result-btn:active {
          transform: scale(0.95);
        }

        .result-home {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          cursor: pointer;
          padding: 10px 20px;
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .result-home:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @media (min-width: 768px) {
          .result-card {
            padding: 50px 40px;
          }

          .result-emoji {
            font-size: 80px;
          }

          .result-title {
            font-size: 28px;
          }

          .score-circle {
            width: 220px;
            height: 220px;
          }

          .score-value {
            font-size: 56px;
          }
        }
      `}</style>
    </main>
  );
}
