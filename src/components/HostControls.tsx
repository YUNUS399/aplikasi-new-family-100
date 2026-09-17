import React from 'react';
import { SurveyQuestion, Team } from '../types';
import { sound } from '../utils/audio';
import {
  X,
  Volume2,
  Trophy,
  ArrowRightLeft,
  RotateCcw,
  CheckCircle,
  Eye,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';

interface HostControlsProps {
  question: SurveyQuestion;
  teamA: Team;
  teamB: Team;
  activeTeamId: 'A' | 'B' | null;
  roundScore: number;
  onRevealAnswer: (answerId: number) => void;
  onAddStrike: (teamId: 'A' | 'B') => void;
  onResetStrikes: () => void;
  onSwitchActiveTeam: () => void;
  onAwardRoundPoints: (teamId: 'A' | 'B') => void;
  onNextRound: () => void;
  onStartBonusRound: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export const HostControls: React.FC<HostControlsProps> = ({
  question,
  teamA,
  teamB,
  activeTeamId,
  roundScore,
  onRevealAnswer,
  onAddStrike,
  onResetStrikes,
  onSwitchActiveTeam,
  onAwardRoundPoints,
  onNextRound,
  onStartBonusRound,
  onClose,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-slate-950/95 border-l border-amber-500/30 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            MC
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Panel Kontrol Pembawa Acara</h3>
            <p className="text-[11px] text-amber-400">Host / Game Master Dashboard</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-300">
        {/* Survey Answers Peek & Manual Reveal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Kunci Jawaban & Poin Survei
            </span>
            <span className="text-[10px] text-slate-500">Klik untuk buka kartu</span>
          </div>

          <div className="space-y-1.5">
            {question.answers.map((ans) => (
              <div
                key={ans.id}
                className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                  ans.isRevealed
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                    #{ans.rank}
                  </span>
                  <div className="truncate">
                    <span className="font-semibold text-slate-200 truncate block">
                      {ans.answer}
                    </span>
                    {ans.aliases && ans.aliases.length > 0 && (
                      <span className="text-[9px] text-slate-500 truncate block">
                        Alias: {ans.aliases.slice(0, 3).join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-game font-bold text-amber-400 text-sm">
                    {ans.points} pt
                  </span>
                  {!ans.isRevealed ? (
                    <button
                      onClick={() => onRevealAnswer(ans.id)}
                      className="px-2 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px] hover:bg-amber-400 active:scale-95 transition-transform"
                    >
                      Buka
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Terbuka
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Turn & Strike Management */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Kendali Giliran & Strike
            </span>
            <button
              onClick={onResetStrikes}
              className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Strike
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Team A quick action */}
            <div className={`p-2.5 rounded-xl border ${activeTeamId === 'A' ? 'border-blue-500 bg-blue-950/40' : 'border-slate-800 bg-slate-950'}`}>
              <div className="font-bold text-blue-400 truncate mb-1">{teamA.name}</div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onAddStrike('A')}
                  className="flex-1 bg-rose-600/80 hover:bg-rose-500 text-white font-bold py-1 rounded-lg text-[10px] transition-colors"
                >
                  + Strike (❌)
                </button>
              </div>
            </div>

            {/* Team B quick action */}
            <div className={`p-2.5 rounded-xl border ${activeTeamId === 'B' ? 'border-purple-500 bg-purple-950/40' : 'border-slate-800 bg-slate-950'}`}>
              <div className="font-bold text-purple-400 truncate mb-1">{teamB.name}</div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onAddStrike('B')}
                  className="flex-1 bg-rose-600/80 hover:bg-rose-500 text-white font-bold py-1 rounded-lg text-[10px] transition-colors"
                >
                  + Strike (❌)
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onSwitchActiveTeam}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 text-[11px] transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
            Pindahkan Giliran ke {activeTeamId === 'A' ? teamB.name : teamA.name}
          </button>
        </div>

        {/* Award Points & End Round */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2.5">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block">
            Beri Poin Ronde ({roundScore * (question.multiplier || 1)} Poin)
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAwardRoundPoints('A')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-2 rounded-xl text-xs transition-colors"
            >
              Menangkan {teamA.name}
            </button>
            <button
              onClick={() => onAwardRoundPoints('B')}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-2 rounded-xl text-xs transition-colors"
            >
              Menangkan {teamB.name}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={onNextRound}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition-colors"
            >
              Lanjut Babak Baru
            </button>
            <button
              onClick={onStartBonusRound}
              className="flex-1 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Babak Bonus
            </button>
          </div>
        </div>

        {/* Sound Effects Board */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            Papan Efek Suara Studio
          </span>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => sound.playCorrect()}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold py-1.5 rounded-lg text-[10px]"
            >
              🔔 Ting-Nong
            </button>
            <button
              onClick={() => sound.playStrike()}
              className="bg-slate-800 hover:bg-slate-700 text-rose-400 font-semibold py-1.5 rounded-lg text-[10px]"
            >
              ❌ Strike
            </button>
            <button
              onClick={() => sound.playTripleStrike()}
              className="bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold py-1.5 rounded-lg text-[10px]"
            >
              🎺 Triple Strike
            </button>
            <button
              onClick={() => sound.playBuzzer()}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold py-1.5 rounded-lg text-[10px]"
            >
              🚨 Bel Rebutan
            </button>
            <button
              onClick={() => sound.playGong()}
              className="bg-slate-800 hover:bg-slate-700 text-purple-400 font-semibold py-1.5 rounded-lg text-[10px]"
            >
              🥁 Gong Selesai
            </button>
            <button
              onClick={() => sound.playFanfare()}
              className="bg-slate-800 hover:bg-slate-700 text-yellow-300 font-semibold py-1.5 rounded-lg text-[10px]"
            >
              🎉 Fanfare Juara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
