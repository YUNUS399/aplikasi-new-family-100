import React, { useState, useEffect } from 'react';
import { Team, SurveyQuestion } from '../types';
import { sound } from '../utils/audio';
import { Bell, Flame, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { findMatchingAnswer } from '../utils/fuzzyMatch';

interface FaceOffBuzzerProps {
  teamA: Team;
  teamB: Team;
  question: SurveyQuestion;
  roundNumber: number;
  onFaceOffComplete: (winningTeamId: 'A' | 'B', choice: 'play' | 'pass') => void;
}

export const FaceOffBuzzer: React.FC<FaceOffBuzzerProps> = ({
  teamA,
  teamB,
  question,
  roundNumber,
  onFaceOffComplete,
}) => {
  const [buzzedTeam, setBuzzedTeam] = useState<'A' | 'B' | null>(null);
  const [answerInput, setAnswerInput] = useState('');
  const [attemptResult, setAttemptResult] = useState<{
    text: string;
    rank?: number;
    points?: number;
    isTopAnswer?: boolean;
    isCorrect: boolean;
  } | null>(null);
  const [decisionStage, setDecisionStage] = useState(false);
  const [winningTeam, setWinningTeam] = useState<'A' | 'B' | null>(null);

  // Keyboard shortcut listener: 'A' for Team A, 'L' for Team B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (buzzedTeam || decisionStage) return;
      if (e.key === 'a' || e.key === 'A') {
        handlePressBuzzer('A');
      } else if (e.key === 'l' || e.key === 'L') {
        handlePressBuzzer('B');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buzzedTeam, decisionStage]);

  const handlePressBuzzer = (teamId: 'A' | 'B') => {
    if (buzzedTeam || decisionStage) return;
    sound.playBuzzer();
    setBuzzedTeam(teamId);
    setAttemptResult(null);
    setAnswerInput('');
  };

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || !buzzedTeam) return;

    const matched = findMatchingAnswer(answerInput.trim(), question.answers);
    if (matched) {
      sound.playCorrect();
      const isTop = matched.rank === 1;
      setAttemptResult({
        text: matched.answer,
        rank: matched.rank,
        points: matched.points,
        isTopAnswer: isTop,
        isCorrect: true,
      });

      // If top answer (#1 rank), team automatically wins face-off and chooses play or pass!
      setWinningTeam(buzzedTeam);
      setDecisionStage(true);
    } else {
      sound.playStrike();
      setAttemptResult({
        text: `"${answerInput}" TIDAK ADA DI SURVEI!`,
        isCorrect: false,
      });

      // Opponent gets the chance!
      const opponentId: 'A' | 'B' = buzzedTeam === 'A' ? 'B' : 'A';
      setTimeout(() => {
        setBuzzedTeam(opponentId);
        setAttemptResult(null);
        setAnswerInput('');
      }, 1400);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 border-2 sm:border-4 border-amber-500/50 p-4 sm:p-8 shadow-2xl shadow-blue-950/60 text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Phase Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">
          <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          BABAK {roundNumber} • REBUTAN BEL (FACE-OFF)
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white px-4 mb-2 tracking-tight">
          &ldquo;{question.question}&rdquo;
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          Adu cepat tekan bel! Jawaban tertinggi (Top Answer) berhak memilih Main atau Lempar.
        </p>

        {!decisionStage ? (
          <div>
            {/* Buzzer Arena */}
            <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-xl mx-auto my-6">
              {/* Team A Buzzer */}
              <div className="flex flex-col items-center">
                <button
                  id="btn-buzzer-team-a"
                  onClick={() => handlePressBuzzer('A')}
                  disabled={buzzedTeam !== null}
                  className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all transform shadow-2xl ${
                    buzzedTeam === 'A'
                      ? 'bg-gradient-to-b from-blue-400 to-blue-600 border-white ring-8 ring-blue-500/50 scale-105'
                      : 'bg-gradient-to-b from-blue-600 to-blue-800 border-blue-400/80 hover:brightness-110 active:scale-95 shadow-blue-900/60'
                  } disabled:cursor-not-allowed`}
                >
                  <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-1 drop-shadow" />
                  <span className="font-game font-black text-white text-base sm:text-lg">
                    {teamA.name}
                  </span>
                  <span className="text-[10px] text-blue-200 uppercase tracking-widest font-mono">
                    Tekan [A]
                  </span>
                </button>
              </div>

              {/* Team B Buzzer */}
              <div className="flex flex-col items-center">
                <button
                  id="btn-buzzer-team-b"
                  onClick={() => handlePressBuzzer('B')}
                  disabled={buzzedTeam !== null}
                  className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all transform shadow-2xl ${
                    buzzedTeam === 'B'
                      ? 'bg-gradient-to-b from-purple-400 to-purple-600 border-white ring-8 ring-purple-500/50 scale-105'
                      : 'bg-gradient-to-b from-purple-600 to-purple-800 border-purple-400/80 hover:brightness-110 active:scale-95 shadow-purple-900/60'
                  } disabled:cursor-not-allowed`}
                >
                  <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-1 drop-shadow" />
                  <span className="font-game font-black text-white text-base sm:text-lg">
                    {teamB.name}
                  </span>
                  <span className="text-[10px] text-purple-200 uppercase tracking-widest font-mono">
                    Tekan [L]
                  </span>
                </button>
              </div>
            </div>

            {/* If a team hit the buzzer first */}
            {buzzedTeam && (
              <div className="max-w-md mx-auto mt-4 bg-slate-900/90 border border-amber-500/40 p-4 rounded-2xl shadow-xl">
                <div className="text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">
                  🔔 {buzzedTeam === 'A' ? teamA.name : teamB.name} MENEKAN BEL LEBIH DULU!
                </div>

                <form onSubmit={handleCheckAnswer} className="flex gap-2">
                  <input
                    type="text"
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Sebutkan jawaban survei..."
                    className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-400 px-3.5 py-2 rounded-xl text-white text-sm focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                  >
                    Cek
                  </button>
                </form>

                {attemptResult && (
                  <div
                    className={`mt-3 p-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 ${
                      attemptResult.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {attemptResult.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          BENAR! &ldquo;{attemptResult.text}&rdquo; (Peringkat #{attemptResult.rank} - {attemptResult.points} Poin)
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>{attemptResult.text}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Decision Stage: Play or Pass (Main atau Lempar) */
          <div className="max-w-md mx-auto my-6 bg-slate-900/95 border-2 border-amber-400 p-6 rounded-2xl shadow-2xl animate-fade-in">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-widest block mb-1">
              🎉 Pemenang Face-Off
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              {winningTeam === 'A' ? teamA.name : teamB.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6">
              Apakah tim Anda ingin <strong>MAIN</strong> (kuasai papan) atau <strong>LEMPAR</strong> ke tim lawan?
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                id="btn-choice-play"
                onClick={() => onFaceOffComplete(winningTeam!, 'play')}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm sm:text-base shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>MAIN</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-choice-pass"
                onClick={() => onFaceOffComplete(winningTeam!, 'pass')}
                className="bg-gradient-to-r from-slate-800 to-slate-700 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold py-3 px-4 rounded-xl text-sm sm:text-base shadow active:scale-95 transition-all"
              >
                <span>LEMPAR</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
