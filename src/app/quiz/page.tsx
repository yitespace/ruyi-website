'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Particles from '@/components/Particles';

interface Question {
  id: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/quiz')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setQuestions(data.questions);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const handleAnswer = (value: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/quiz/result/${data.score}`);
      } else {
        alert(data.error || '提交失败，请重试');
      }
    } catch (error) {
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const canProceed = currentQuestion && answers[currentQuestion.id];

  if (isLoading) {
    return (
      <main>
        <Navigation />
        <Particles />
        <div className="quiz-loading">加载中...</div>
        <style jsx>{`
          .quiz-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main>
      <Navigation />
      <Particles />

      <div className="quiz-container">
        <div className="quiz-header">
          <div className="quiz-progress">
            <div className="quiz-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="quiz-question-count">
            第 {currentQuestionIndex + 1} / {questions.length} 题
          </div>
        </div>

        <div className="quiz-question">
          <h2 className="quiz-question-text">{currentQuestion?.question}</h2>

          <div className="quiz-options">
            {currentQuestion?.options.map((option) => (
              <button
                key={option.value}
                className={`quiz-option ${
                  answers[currentQuestion.id] === option.value ? 'selected' : ''
                }`}
                onClick={() => handleAnswer(option.value)}
              >
                <span className="quiz-option-icon">{option.value.toUpperCase()}</span>
                <span className="quiz-option-label">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-footer">
          <button
            className="quiz-btn quiz-btn-prev"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
          >
            上一题
          </button>

          <button
            className="quiz-btn quiz-btn-next"
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
          >
            {currentQuestionIndex === questions.length - 1
              ? isSubmitting
                ? '提交中...'
                : '查看结果'
              : '下一题'}
          </button>
        </div>
      </div>

      <style jsx>{`
        main {
          min-height: 100vh;
          padding: 20px;
        }

        .quiz-container {
          max-width: 600px;
          margin: 0 auto;
          padding-top: 40px;
        }

        .quiz-header {
          margin-bottom: 30px;
        }

        .quiz-progress {
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .quiz-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ff6b9d, #f093fb);
          transition: width 0.3s ease;
        }

        .quiz-question-count {
          text-align: center;
          font-size: 14px;
          opacity: 0.8;
        }

        .quiz-question {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px 25px;
          margin-bottom: 30px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .quiz-question-text {
          font-size: 22px;
          text-align: center;
          margin-bottom: 30px;
          line-height: 1.5;
        }

        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .quiz-option {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 18px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
          font-size: 16px;
          color: #fff;
        }

        .quiz-option:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .quiz-option.selected {
          background: linear-gradient(45deg, rgba(255, 107, 157, 0.3), rgba(240, 147, 251, 0.3));
          border-color: #ff6b9d;
        }

        .quiz-option:active {
          transform: scale(0.98);
        }

        .quiz-option-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          border-radius: 50%;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .quiz-option-label {
          flex: 1;
        }

        .quiz-footer {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .quiz-btn {
          padding: 14px 40px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quiz-btn-prev {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        .quiz-btn-next {
          background: linear-gradient(45deg, #ff6b9d, #f093fb);
          color: #fff;
          box-shadow: 0 5px 20px rgba(255, 107, 157, 0.4);
        }

        .quiz-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quiz-btn:not(:disabled):active {
          transform: scale(0.95);
        }

        @media (min-width: 768px) {
          .quiz-container {
            padding-top: 60px;
          }

          .quiz-question-text {
            font-size: 26px;
          }

          .quiz-option {
            padding: 20px 25px;
            font-size: 17px;
          }
        }
      `}</style>
    </main>
  );
}
