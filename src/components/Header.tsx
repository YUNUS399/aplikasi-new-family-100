import React from 'react';
import { Volume2, VolumeX, BookOpen, Settings, RotateCcw, Sparkles, UserCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  round: number;
  multiplier: number;
  isHostMode: boolean;
  onToggleHostMode: () => void;
  onOpenRules: () => void;
  onOpenQuestions: () => void;
  onResetGame: () => void;
  isBonusRound?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  round,
  multiplier,
  isHostMode,
  onToggleHostMode,
  onOpenRules,
  onOpenQuestions,
  onResetGame,
  isBonusRound,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.getIsMuted());

  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  return (
    <header className="w-full bg-slate-900/90 border-b border-amber-500/30 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 py-2.5 shadow-lg shadow-amber-950/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group flex items-center">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/30 border border-amber-300">
              <span className="font-game font-extrabold text-slate-950 text-base sm:text-xl tracking-tighter">
                100
              </span>
            </div>
            <div className="ml-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                  NEW
                </span>
                <span className="font-game text-sm sm:text-lg font-bold text-slate-100 tracking-wide">
                  FAMILI <span className="text-amber-400 font-extrabold">100</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Survei Membuktikan! 100 Orang Indonesia
              </p>
            </div>
          </div>
        </div>

        {/* Round Badge */}
        <div className="flex items-center gap-2">
          {isBonusRound ? (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold px-3 py-1 rounded-full text-xs sm:text-sm shadow-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BABAK BONUS: TOP SURVEY</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
              <span className="text-xs sm:text-sm font-bold text-amber-400 font-game">
                BABAK {round}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-300">
                {multiplier === 1 ? 'Poin Tunggal (1x)' : multiplier === 2 ? 'Poin Ganda (2x)' : 'Poin 3x Lipat'}
              </span>
            </div>
          )}
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Host Mode Indicator Button */}
          <button
            id="btn-toggle-host-mode"
            onClick={onToggleHostMode}
            title={isHostMode ? 'Mode Host Aktif (Klik untuk ubah)' : 'Mode Pemain Aktif'}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isHostMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{isHostMode ? 'Panel Host' : 'Mode Host'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={handleToggleMute}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-amber-400 hover:bg-slate-700/80 border border-slate-700 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Rules Modal */}
          <button
            id="btn-open-rules"
            onClick={onOpenRules}
            title="Cara Bermain & Aturan"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-amber-400 hover:bg-slate-700/80 border border-slate-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Manage Questions Modal */}
          <button
            id="btn-open-questions"
            onClick={onOpenQuestions}
            title="Daftar & Buat Soal Survei"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-amber-400 hover:bg-slate-700/80 border border-slate-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Reset Game */}
          <button
            id="btn-reset-game"
            onClick={onResetGame}
            title="Ulangi Permainan dari Awal"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-rose-400 hover:bg-slate-700/80 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
