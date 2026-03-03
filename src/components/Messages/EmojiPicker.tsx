'use client';

import { useState } from 'react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
  '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
  '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
  '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
  '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
  '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
  '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥',
  '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧',
  '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
  '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑',
  '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻',
  '💕', '💖', '💗', '💓', '💞', '💘', '💝', '💌',
  '🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '🍀', '🌟',
  '✨', '⭐', '🌙', '☀️', '🌈', '❄️', '🔥', '💫',
];

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  return (
    <>
      <div className="emoji-overlay" onClick={onClose} />
      <div className="emoji-picker">
        <div className="emoji-header">
          <span>选择表情</span>
          <button className="emoji-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="emoji-grid">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              className="emoji-btn"
              onClick={() => onSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .emoji-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .emoji-picker {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #fff;
          border-radius: 20px 20px 0 0;
          padding: 20px;
          z-index: 1000;
          max-height: 50vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .emoji-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
          color: #333;
          font-size: 16px;
          font-weight: 600;
        }

        .emoji-close {
          background: #f5f5f5;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .emoji-close:active {
          background: #e5e5e5;
        }

        .emoji-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 8px;
        }

        .emoji-btn {
          width: 100%;
          aspect-ratio: 1;
          background: #f5f5f5;
          border: none;
          border-radius: 8px;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .emoji-btn:active {
          background: #e5e5e5;
          transform: scale(0.9);
        }

        @media (min-width: 768px) {
          .emoji-picker {
            position: absolute;
            bottom: 100%;
            left: 0;
            width: 320px;
            border-radius: 15px;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
          }

          .emoji-overlay {
            display: none;
          }

          .emoji-grid {
            grid-template-columns: repeat(8, 1fr);
          }
        }
      `}</style>
    </>
  );
}
