'use client';

interface AboutCard {
  icon: string;
  title: string;
  content: string;
}

interface AboutProps {
  title?: string;
  cards?: AboutCard[];
}

export default function About({
  title = '关于我 💕',
  cards = [
    {
      icon: '🎀',
      title: '我是谁',
      content: '一个温柔善良、乐观向上的女生。喜欢探索新事物，享受生活中的每一个小确幸。',
    },
    {
      icon: '🌟',
      title: '我的特点',
      content: '细心、有耐心、富有创造力。对待朋友真诚，对待生活热情满满！',
    },
    {
      icon: '💫',
      title: '我的梦想',
      content: '成为更好的自己，去更多地方，见更多人，体验更精彩的人生！',
    },
  ],
}: AboutProps) {
  return (
    <section className="section" id="about">
      <h2 className="section-title">{title}</h2>
      <div className="about-grid">
        {cards.map((card, index) => (
          <div key={index} className="about-card">
            <h3>
              {card.icon} {card.title}
            </h3>
            <p>{card.content}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .section {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 35px 20px;
          margin: 20px 0;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 24px;
          text-align: center;
          margin-bottom: 30px;
          position: relative;
          font-weight: 600;
        }

        .section-title::after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #ff6b9d, #f093fb);
          margin: 12px auto 0;
          border-radius: 2px;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }

        .about-card {
          background: rgba(255, 255, 255, 0.18);
          padding: 25px 20px;
          border-radius: 15px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
          opacity: 0;
          transform: translateY(30px);
          animation: cardEnter 0.5s ease forwards;
        }

        .about-card:nth-child(1) {
          animation-delay: 0.1s;
        }
        .about-card:nth-child(2) {
          animation-delay: 0.2s;
        }
        .about-card:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes cardEnter {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .about-card:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.25);
        }

        .about-card h3 {
          font-size: 18px;
          margin-bottom: 12px;
          color: #ffd700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .about-card p {
          line-height: 1.7;
          opacity: 0.95;
          font-size: 15px;
        }

        @media (min-width: 768px) {
          .about-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
