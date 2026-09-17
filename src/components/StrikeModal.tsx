import React, { useEffect } from 'react';

interface StrikeModalProps {
  strikeCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export const StrikeModal: React.FC<StrikeModalProps> = ({
  strikeCount,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 1700);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm cursor-pointer animate-in fade-in duration-200"
    >
      <div className="flex items-center justify-center gap-4 sm:gap-8 p-6 animate-bounce">
        {Array.from({ length: Math.min(3, Math.max(1, strikeCount)) }).map((_, idx) => (
          <div
            key={idx}
            className="w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-3xl bg-gradient-to-b from-rose-600 via-rose-700 to-red-900 border-4 sm:border-8 border-rose-300 flex items-center justify-center shadow-[0_0_60px_rgba(225,29,72,0.8)] transform scale-100 hover:scale-105 transition-transform"
          >
            <span className="font-game font-black text-6xl sm:text-9xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              ✕
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
