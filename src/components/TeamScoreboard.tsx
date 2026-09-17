import React, { useState } from 'react';
import { Team } from '../types';
import { Shield, XCircle, Edit2, Check, Flame } from 'lucide-react';

interface TeamScoreboardProps {
  teamA: Team;
  teamB: Team;
  activeTeamId: 'A' | 'B' | null;
  roundScore: number;
  multiplier: number;
  isStealRound: boolean;
  onUpdateTeamName: (id: 'A' | 'B', newName: string) => void;
}

export const TeamScoreboard: React.FC<TeamScoreboardProps> = ({
  teamA,
  teamB,
  activeTeamId,
  roundScore,
  multiplier,
  isStealRound,
  onUpdateTeamName,
}) => {
  const [editingA, setEditingA] = useState(false);
  const [editingB, setEditingB] = useState(false);
  const [nameA, setNameA] = useState(teamA.name);
  const [nameB, setNameB] = useState(teamB.name);

  const saveNameA = () => {
    if (nameA.trim()) onUpdateTeamName('A', nameA.trim());
    setEditingA(false);
  };

  const saveNameB = () => {
    if (nameB.trim()) onUpdateTeamName('B', nameB.trim());
    setEditingB(false);
  };

  const renderStrikes = (count: number) => {
    return (
      <div className="flex items-center gap-1.5 justify-center py-1">
        {[1, 2, 3].map((slot) => {
          const isStrike = slot <= count;
          return (
            <div
              key={slot}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-game font-extrabold text-lg border transition-all duration-300 ${
                isStrike
                  ? 'bg-rose-600/90 text-white border-rose-400 shadow-md shadow-rose-900/50 scale-105'
                  : 'bg-slate-900/60 text-slate-700 border-slate-800'
              }`}
            >
              {isStrike ? '✕' : ''}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-12 gap-2 sm:gap-4 items-center px-2 sm:px-4 py-2">
      {/* Team A Podium */}
      <div
        className={`col-span-4 sm:col-span-4 p-3 sm:p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
          activeTeamId === 'A'
            ? 'bg-gradient-to-b from-blue-900/50 to-slate-900 border-blue-400 shadow-xl shadow-blue-500/20 ring-2 ring-blue-500/40'
            : 'bg-slate-900/80 border-slate-800/80 opacity-90'
        }`}
      >
        {activeTeamId === 'A' && (
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400" />
        )}
        
        {/* Team Header & Name */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0 animate-pulse" />
            {editingA ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={nameA}
                  onChange={(e) => setNameA(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveNameA()}
                  className="bg-slate-800 border border-blue-500 text-xs text-white px-2 py-0.5 rounded w-24 sm:w-32 focus:outline-none"
                  autoFocus
                />
                <button onClick={saveNameA} className="text-blue-400 hover:text-white p-0.5">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 group truncate">
                <h3 className="font-bold text-xs sm:text-base text-slate-100 truncate">
                  {teamA.name}
                </h3>
                <button
                  onClick={() => setEditingA(true)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-300 p-0.5 transition-opacity"
                  title="Ubah nama tim"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          {activeTeamId === 'A' && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 shrink-0">
              {isStealRound ? 'Mencuri!' : 'Main'}
            </span>
          )}
        </div>

        {/* Score Display */}
        <div className="text-center my-1.5 sm:my-2">
          <div className="font-game font-extrabold text-2xl sm:text-4xl lg:text-5xl text-blue-400 tracking-tight drop-shadow-md">
            {teamA.score}
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
            Total Poin
          </span>
        </div>

        {/* Strikes indicator */}
        <div className="mt-1 border-t border-slate-800/80 pt-1">
          {renderStrikes(teamA.strikes)}
        </div>
      </div>

      {/* Center Bank Pot / Current Round Points */}
      <div className="col-span-4 sm:col-span-4 flex flex-col items-center justify-center p-2 text-center">
        <div className="relative group">
          <div className="w-24 sm:w-36 lg:w-44 py-2 sm:py-3 px-2 rounded-2xl bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-900 border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 flex flex-col items-center justify-center">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-400/90 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
              POIN RONDE
            </span>
            <div className="font-game font-extrabold text-2xl sm:text-4xl lg:text-5xl text-amber-300 tracking-tight drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
              {roundScore * multiplier}
            </div>
            {multiplier > 1 && (
              <span className="text-[9px] sm:text-[11px] font-semibold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 mt-0.5">
                ({roundScore} × {multiplier})
              </span>
            )}
          </div>
        </div>

        {isStealRound && (
          <div className="mt-2 bg-rose-500/20 border border-rose-500/60 text-rose-300 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold animate-bounce flex items-center gap-1 shadow-md">
            <Shield className="w-3 h-3" />
            <span>BABAK CURI POIN!</span>
          </div>
        )}
      </div>

      {/* Team B Podium */}
      <div
        className={`col-span-4 sm:col-span-4 p-3 sm:p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
          activeTeamId === 'B'
            ? 'bg-gradient-to-b from-purple-900/50 to-slate-900 border-purple-400 shadow-xl shadow-purple-500/20 ring-2 ring-purple-500/40'
            : 'bg-slate-900/80 border-slate-800/80 opacity-90'
        }`}
      >
        {activeTeamId === 'B' && (
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400" />
        )}

        {/* Team Header & Name */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0 animate-pulse" />
            {editingB ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={nameB}
                  onChange={(e) => setNameB(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveNameB()}
                  className="bg-slate-800 border border-purple-500 text-xs text-white px-2 py-0.5 rounded w-24 sm:w-32 focus:outline-none"
                  autoFocus
                />
                <button onClick={saveNameB} className="text-purple-400 hover:text-white p-0.5">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 group truncate">
                <h3 className="font-bold text-xs sm:text-base text-slate-100 truncate">
                  {teamB.name}
                </h3>
                <button
                  onClick={() => setEditingB(true)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-purple-300 p-0.5 transition-opacity"
                  title="Ubah nama tim"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          {activeTeamId === 'B' && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 shrink-0">
              {isStealRound ? 'Mencuri!' : 'Main'}
            </span>
          )}
        </div>

        {/* Score Display */}
        <div className="text-center my-1.5 sm:my-2">
          <div className="font-game font-extrabold text-2xl sm:text-4xl lg:text-5xl text-purple-400 tracking-tight drop-shadow-md">
            {teamB.score}
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
            Total Poin
          </span>
        </div>

        {/* Strikes indicator */}
        <div className="mt-1 border-t border-slate-800/80 pt-1">
          {renderStrikes(teamB.strikes)}
        </div>
      </div>
    </div>
  );
};
