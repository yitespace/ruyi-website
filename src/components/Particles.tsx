'use client';

import { useEffect, useState } from 'react';

export default function Particles() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    size: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 40;

    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: Math.random() * 12 + 4,
      left: Math.random() * 100,
      top: Math.random() * 100 + 100, // 从视口下方开始
      delay: Math.random() * 15,
      duration: Math.random() * 10 + 10,
    }));

    setParticles(newParticles);
  }, []);

  return (
    <div className="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
      <style jsx>{`
        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: float 15s infinite;
          will-change: transform;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
