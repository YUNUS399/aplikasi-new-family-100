import React from 'react';
import { Team } from '../types';
import { Trophy, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameOverModalProps {
  isOpen: boolean;
  teamA: Team;
  teamB: Team;
  onStartBonusRound: () => void;
  onRestartGame: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  teamA,
  teamB,
  onStartBonusRound,
  onRestartGame,
}) => {
  if (!isOpen) return null;

  const winner = teamA.score >= teamB.score ? teamA : teamB;
  const isDraw = teamA.score === teamB.score;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 border-4 border-amber-400 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse" />

        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block mb-1">
          {isDraw ? 'HASIL IMBANG!' : 'BABAK UTAMA SELESAI!'}
        </span>

        <h3 className="text-2xl sm:text-4xl font-black text-white mb-2">
          {isDraw ? 'Skor Seri!' : `Tim ${winner.name} Menang!`}
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          {isDraw
            ? 'Kedua tim memiliki skor yang sama. Silakan lanjutkan ke Babak Bonus atau mulai tanding ulang!'
            : `Selamat kepada Tim ${winner.name} yang berhasil mengumpulkan total poin tertinggi dan berhak melaju ke Babak Bonus Top Survey!`}
        </p>

        {/* Scores summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div
            className={`p-3.5 rounded-2xl border ${
              teamA.score > teamB.score
                ? 'border-blue-400 bg-blue-950/60 shadow-lg shadow-blue-500/20'
                : 'border-slate-800 bg-slate-900/80'
            }`}
          >
            <span className="text-xs font-bold text-blue-400 block truncate">{teamA.name}</span>
            <span className="font-game font-black text-3xl text-white">{teamA.score}</span>
            <span className="text-[10px] text-slate-400 block uppercase">Poin</span>
          </div>

          <div
            className={`p-3.5 rounded-2xl border ${
              teamB.score > teamA.score
                ? 'border-purple-400 bg-purple-950/60 shadow-lg shadow-purple-500/20'
                : 'border-slate-800 bg-slate-900/80'
            }`}
          >
            <span className="text-xs font-bold text-purple-400 block truncate">{teamB.name}</span>
            <span className="font-game font-black text-3xl text-white">{teamB.score}</span>
            <span className="text-[10px] text-slate-400 block uppercase">Poin</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2.5">
          <button
            id="btn-modal-start-bonus"
            onClick={onStartBonusRound}
            className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3.5 px-4 rounded-xl text-sm sm:text-base shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            <span>Lanjut ke Babak Bonus Top Survey!</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onRestartGame}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mulai Permainan Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
