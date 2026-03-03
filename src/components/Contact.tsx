'use client';

interface ContactProps {
  title?: string;
  subtitle?: string;
  socialLinks?: Array<{
    icon: string;
    label: string;
    href?: string;
  }>;
}

export default function Contact({
  title = '联系我 💌',
  subtitle = '欢迎和我交朋友！期待与你相遇～',
  socialLinks = [
    { icon: '💬', label: '微信' },
    { icon: '📱', label: '微博' },
    { icon: '📧', label: '邮箱' },
    { icon: '📕', label: '小红书' },
    { icon: '🎵', label: '抖音' },
  ],
}: ContactProps) {
  return (
    <section className="contact" id="contact">
      <h2 className="section-title">{title}</h2>
      <p className="contact-subtitle">{subtitle}</p>
      <div className="social-links">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            className="social-link"
            href={social.href || '#'}
            title={social.label}
          >
            {social.icon}
          </a>
        ))}
      </div>

      <style jsx>{`
        .contact {
          text-align: center;
          padding: 40px 20px;
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

        .contact-subtitle {
          font-size: 16px;
          opacity: 0.95;
          margin-bottom: 25px;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .social-link {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          transition: all 0.3s ease;
          text-decoration: none;
          border: 2px solid rgba(255, 255, 255, 0.3);
          -webkit-appearance: none;
          color: #fff;
          cursor: pointer;
        }

        .social-link:active {
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          transform: scale(0.9);
          border-color: transparent;
        }
      `}</style>
    </section>
  );
}
