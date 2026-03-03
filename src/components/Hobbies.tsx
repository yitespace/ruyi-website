'use client';

interface HobbiesProps {
  title?: string;
  hobbies?: string[];
}

export default function Hobbies({
  title = '兴趣爱好 🎨',
  hobbies = [
    '📸 摄影',
    '🎨 绘画',
    '📚 阅读',
    '🎵 音乐',
    '✈️ 旅行',
    '🍰 美食',
    '🌸 花艺',
    '💄 美妆',
    '🎬 电影',
    '🧘 瑜伽',
  ],
}: HobbiesProps) {
  return (
    <section className="section" id="hobbies">
      <h2 className="section-title">{title}</h2>
      <div className="hobbies-container">
        <div className="hobbies">
          {hobbies.map((hobby, index) => (
            <div key={index} className="hobby-tag">
              {hobby}
            </div>
          ))}
        </div>
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

        .hobbies-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding: 10px 0;
          margin: 20px -20px 0;
        }

        .hobbies {
          display: flex;
          gap: 12px;
          padding: 0 20px;
          scrollbar-width: none;
        }

        .hobbies::-webkit-scrollbar {
          display: none;
        }

        .hobby-tag {
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 14px;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 3px 15px rgba(255, 107, 157, 0.3);
          transition: all 0.3s ease;
        }

        .hobby-tag:active {
          transform: scale(0.95);
        }

        @media (min-width: 768px) {
          .hobbies-container {
            overflow-x: visible;
            margin: 20px 0 0;
          }

          .hobbies {
            flex-wrap: wrap;
            justify-content: center;
            padding: 0;
          }
        }
      `}</style>
    </section>
  );
}
