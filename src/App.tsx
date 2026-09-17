import React, { useState, useEffect } from 'react';
import {
  SurveyQuestion,
  Team,
  GamePhase,
  BonusQuestionSet,
} from './types';
import { INITIAL_QUESTIONS, BONUS_SETS, getCustomQuestions } from './data/questions';
import { Header } from './components/Header';
import { TeamScoreboard } from './components/TeamScoreboard';
import { SurveyBoard } from './components/SurveyBoard';
import { FaceOffBuzzer } from './components/FaceOffBuzzer';
import { StrikeModal } from './components/StrikeModal';
import { HostControls } from './components/HostControls';
import { BonusRound } from './components/BonusRound';
import { RulesModal } from './components/RulesModal';
import { QuestionManagerModal } from './components/QuestionManagerModal';
import { GameOverModal } from './components/GameOverModal';
import { sound } from './utils/audio';
import { findMatchingAnswer } from './utils/fuzzyMatch';
import {
  ArrowRight,
  Sparkles,
  Trophy,
  AlertTriangle,
  RotateCcw,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  // Questions pool
  const [questions, setQuestions] = useState<SurveyQuestion[]>(() => {
    const custom = getCustomQuestions();
    return [...custom, ...INITIAL_QUESTIONS];
  });

  // Current round index (0: Babak 1, 1: Babak 2, 2: Babak 3)
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);

  // Teams state
  const [teamA, setTeamA] = useState<Team>({
    id: 'A',
    name: 'Tim Garuda',
    score: 0,
    color: 'blue',
    strikes: 0,
  });

  const [teamB, setTeamB] = useState<Team>({
    id: 'B',
    name: 'Tim Rajawali',
    score: 0,
    color: 'purple',
    strikes: 0,
  });

  // Active question with revealed slats state
  const [currentQuestion, setCurrentQuestion] = useState<SurveyQuestion>(() => {
    const q = questions[0] || INITIAL_QUESTIONS[0];
    return {
      ...q,
      answers: q.answers.map((a) => ({ ...a, isRevealed: false })),
    };
  });

  // Game flow states
  const [gamePhase, setGamePhase] = useState<GamePhase>('faceoff');
  const [activeTeamId, setActiveTeamId] = useState<'A' | 'B' | null>(null);
  const [roundScore, setRoundScore] = useState<number>(0);
  const [isStealRound, setIsStealRound] = useState<boolean>(false);
  const [roundWinnerId, setRoundWinnerId] = useState<'A' | 'B' | null>(null);

  // Modals & Drawers
  const [strikeModal, setStrikeModal] = useState<{ isOpen: boolean; count: number }>({
    isOpen: false,
    count: 0,
  });
  const [isHostMode, setIsHostMode] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState<boolean>(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState<boolean>(false);

  // Notifications / feedback banners
  const [statusBanner, setStatusBanner] = useState<{
    type: 'info' | 'success' | 'danger';
    message: string;
  } | null>(null);

  // Helper: multiplier based on round (1x, 2x, 3x)
  const multiplier = roundNumber === 1 ? 1 : roundNumber === 2 ? 2 : 3;

  const showBanner = (message: string, type: 'info' | 'success' | 'danger' = 'info') => {
    setStatusBanner({ message, type });
    setTimeout(() => {
      setStatusBanner((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Switch / load next question for the specified round
  const loadQuestionForRound = (round: number, qIdx?: number) => {
    const targetIdx = qIdx !== undefined ? qIdx : (round - 1) % questions.length;
    const baseQ = questions[targetIdx] || INITIAL_QUESTIONS[0];

    setCurrentQIndex(targetIdx);
    setCurrentQuestion({
      ...baseQ,
      multiplier: round === 1 ? 1 : round === 2 ? 2 : 3,
      answers: baseQ.answers.map((a) => ({ ...a, isRevealed: false })),
    });

    setRoundScore(0);
    setIsStealRound(false);
    setRoundWinnerId(null);
    setActiveTeamId(null);
    setTeamA((prev) => ({ ...prev, strikes: 0 }));
    setTeamB((prev) => ({ ...prev, strikes: 0 }));
    setGamePhase('faceoff');
  };

  // 1. FACEOFF COMPLETE HANDLER
  const handleFaceOffComplete = (winningTeamId: 'A' | 'B', choice: 'play' | 'pass') => {
    const controllingTeamId: 'A' | 'B' =
      choice === 'play' ? winningTeamId : winningTeamId === 'A' ? 'B' : 'A';

    setActiveTeamId(controllingTeamId);
    setGamePhase('main_round');

    const controllingTeamName = controllingTeamId === 'A' ? teamA.name : teamB.name;
    showBanner(`Tim ${controllingTeamName} menguasai papan permainan!`, 'info');
  };

  // 2. REVEAL ANSWER (Manual by Host or Auto by Game)
  const handleRevealAnswer = (answerId: number) => {
    let pointsToAdd = 0;
    let found = false;

    setCurrentQuestion((prev) => {
      const updatedAnswers = prev.answers.map((a) => {
        if (a.id === answerId && !a.isRevealed) {
          pointsToAdd = a.points;
          found = true;
          return { ...a, isRevealed: true };
        }
        return a;
      });
      return { ...prev, answers: updatedAnswers };
    });

    if (found) {
      sound.playCorrect();
      setRoundScore((prev) => prev + pointsToAdd);

      // Check if all answers are revealed
      const allRevealed = currentQuestion.answers.every((a) =>
        a.id === answerId ? true : a.isRevealed
      );

      if (allRevealed && gamePhase === 'main_round' && activeTeamId) {
        // Active team cleared all answers!
        handleRoundEnd(activeTeamId, roundScore + pointsToAdd);
      }
    }
  };

  // 3. ANSWER SUBMITTED FROM INPUT
  const handleAnswerSubmit = (input: string) => {
    if (!activeTeamId) return;

    const matched = findMatchingAnswer(input, currentQuestion.answers);

    if (matched) {
      if (matched.isRevealed) {
        showBanner(`Jawaban "${matched.answer}" sudah pernah dibuka!`, 'danger');
        return;
      }

      // Valid correct answer!
      handleRevealAnswer(matched.id);

      if (isStealRound) {
        // STEAL SUCCESSFUL! Opponent team steals all points!
        sound.playFanfare();
        showBanner(
          `CURI POIN BERHASIL! Tim ${activeTeamId === 'A' ? teamA.name : teamB.name} berhasil mencuri seluruh poin!`,
          'success'
        );
        handleRoundEnd(activeTeamId, roundScore + matched.points);
      } else {
        showBanner(`BENAR! "${matched.answer}" bernilai ${matched.points} Poin!`, 'success');
      }
    } else {
      // WRONG ANSWER / STRIKE!
      handleWrongAnswer();
    }
  };

  const handleWrongAnswer = () => {
    if (!activeTeamId) return;

    if (isStealRound) {
      // Steal failed! The original team keeps the points!
      sound.playStrike();
      const originalTeamId: 'A' | 'B' = activeTeamId === 'A' ? 'B' : 'A';
      showBanner(
        `CURI POIN GAGAL! Poin tetap milik Tim ${originalTeamId === 'A' ? teamA.name : teamB.name}!`,
        'danger'
      );
      handleRoundEnd(originalTeamId, roundScore);
      return;
    }

    // Normal main round strike
    const currentStrikes = (activeTeamId === 'A' ? teamA.strikes : teamB.strikes) + 1;

    if (activeTeamId === 'A') {
      setTeamA((prev) => ({ ...prev, strikes: currentStrikes }));
    } else {
      setTeamB((prev) => ({ ...prev, strikes: currentStrikes }));
    }

    if (currentStrikes >= 3) {
      // 3 STRIKES! Trigger triple strike and steal opportunity
      sound.playTripleStrike();
      setStrikeModal({ isOpen: true, count: 3 });

      const stealingTeamId: 'A' | 'B' = activeTeamId === 'A' ? 'B' : 'A';
      setIsStealRound(true);
      setActiveTeamId(stealingTeamId);

      showBanner(
        `3 STRIKE! Kesempatan CURI POIN untuk Tim ${stealingTeamId === 'A' ? teamA.name : teamB.name}!`,
        'danger'
      );
    } else {
      sound.playStrike();
      setStrikeModal({ isOpen: true, count: currentStrikes });
      showBanner(`SALAH! Strike ke-${currentStrikes}`, 'danger');
    }
  };

  // 4. ROUND CONCLUSION
  const handleRoundEnd = (winningTeamId: 'A' | 'B', finalPoints: number) => {
    const totalAwarded = finalPoints * multiplier;

    if (winningTeamId === 'A') {
      setTeamA((prev) => ({ ...prev, score: prev.score + totalAwarded }));
    } else {
      setTeamB((prev) => ({ ...prev, score: prev.score + totalAwarded }));
    }

    setRoundWinnerId(winningTeamId);
    setGamePhase('round_end');
  };

  // 5. NEXT ROUND TRANSITION
  const handleNextRound = () => {
    if (roundNumber < 3) {
      const nextRound = roundNumber + 1;
      setRoundNumber(nextRound);
      loadQuestionForRound(nextRound);
    } else {
      // Round 3 finished -> open Game Over / Bonus Round modal!
      sound.playFanfare();
      setIsGameOverOpen(true);
    }
  };

  // 6. START BONUS ROUND
  const handleStartBonusRound = () => {
    setIsGameOverOpen(false);
    setGamePhase('bonus_round');
  };

  // 7. RESET GAME
  const handleResetGame = () => {
    setTeamA({
      id: 'A',
      name: 'Tim Garuda',
      score: 0,
      color: 'blue',
      strikes: 0,
    });
    setTeamB({
      id: 'B',
      name: 'Tim Rajawali',
      score: 0,
      color: 'purple',
      strikes: 0,
    });
    setRoundNumber(1);
    loadQuestionForRound(1, 0);
    setIsGameOverOpen(false);
  };

  // Reveal remaining hidden answers when round ends
  const handleRevealAllAnswers = () => {
    sound.playFlip();
    setCurrentQuestion((prev) => ({
      ...prev,
      answers: prev.answers.map((a) => ({ ...a, isRevealed: true })),
    }));
  };

  const leadingTeam = teamA.score >= teamB.score ? teamA : teamB;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col bg-studio-grid selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Studio stage ambient glow lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Header */}
      <Header
        round={roundNumber}
        multiplier={multiplier}
        isHostMode={isHostMode}
        onToggleHostMode={() => setIsHostMode((prev) => !prev)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenQuestions={() => setIsQuestionsOpen(true)}
        onResetGame={handleResetGame}
        isBonusRound={gamePhase === 'bonus_round'}
      />

      {/* Notification / Status Banner */}
      {statusBanner && (
        <div
          className={`w-full py-2 px-4 text-center font-bold text-xs sm:text-sm animate-in fade-in transition-all z-20 shadow-md ${
            statusBanner.type === 'success'
              ? 'bg-emerald-600 text-white'
              : statusBanner.type === 'danger'
              ? 'bg-rose-600 text-white'
              : 'bg-amber-500 text-slate-950'
          }`}
        >
          {statusBanner.message}
        </div>
      )}

      {/* Main Game Stage Area */}
      <main className="flex-1 flex flex-col justify-start py-2 sm:py-4 px-2 sm:px-4 max-w-7xl mx-auto w-full">
        {gamePhase === 'bonus_round' ? (
          /* BABAK BONUS: TOP SURVEY */
          <BonusRound
            winningTeam={leadingTeam}
            bonusSet={BONUS_SETS[0]}
            onExitBonus={() => {
              setGamePhase('round_end');
              setIsGameOverOpen(true);
            }}
          />
        ) : (
          /* REGULAR ROUNDS (BABAK 1, 2, 3) */
          <>
            {/* Team Podiums & Round Score Center */}
            <TeamScoreboard
              teamA={teamA}
              teamB={teamB}
              activeTeamId={activeTeamId}
              roundScore={roundScore}
              multiplier={multiplier}
              isStealRound={isStealRound}
              onUpdateTeamName={(id, name) => {
                if (id === 'A') setTeamA((prev) => ({ ...prev, name }));
                else setTeamB((prev) => ({ ...prev, name }));
              }}
            />

            {/* Stage Body depending on Phase */}
            {gamePhase === 'faceoff' ? (
              /* Phase 1: Adu Cepat Bel (Face-Off) */
              <FaceOffBuzzer
                teamA={teamA}
                teamB={teamB}
                question={currentQuestion}
                roundNumber={roundNumber}
                onFaceOffComplete={handleFaceOffComplete}
              />
            ) : gamePhase === 'round_end' ? (
              /* Phase 3: Round Summary / Win Screen */
              <div className="w-full max-w-3xl mx-auto my-4 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-amber-500/50 shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto mb-3 text-amber-400 animate-bounce">
                  <Trophy className="w-8 h-8" />
                </div>
                <span className="text-xs uppercase font-bold text-amber-400 tracking-widest block mb-1">
                  Babak {roundNumber} Selesai!
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                  Tim {roundWinnerId === 'A' ? teamA.name : teamB.name} Memenangkan Babak Ini!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6">
                  Mendapatkan <strong>{roundScore * multiplier} Poin</strong> ({roundScore} × {multiplier}x multiplier).
                </p>

                {/* Unrevealed answers button */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleRevealAllAnswers}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>Buka Sisa Jawaban</span>
                  </button>

                  <button
                    id="btn-next-round"
                    onClick={handleNextRound}
                    className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>{roundNumber < 3 ? `Lanjut ke Babak ${roundNumber + 1}` : 'Menuju Babak Bonus'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Survey Board Preview below summary so players can see all answers */}
                <div className="mt-8 pt-6 border-t border-slate-800 text-left">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3 text-center">
                    Tinjauan Papan Survei
                  </span>
                  <SurveyBoard
                    currentQuestion={currentQuestion}
                    onAnswerSubmit={() => {}}
                    onRevealAnswer={handleRevealAnswer}
                    isHostMode={isHostMode}
                    disabledInput={true}
                  />
                </div>
              </div>
            ) : (
              /* Phase 2: Main Round or Steal Round Survey Board */
              <SurveyBoard
                currentQuestion={currentQuestion}
                onAnswerSubmit={handleAnswerSubmit}
                onRevealAnswer={handleRevealAnswer}
                isHostMode={isHostMode}
                disabledInput={false}
              />
            )}
          </>
        )}
      </main>

      {/* Footer Branding & Copyright */}
      <footer className="w-full border-t border-slate-800/80 py-3 px-4 text-center text-[11px] text-slate-500">
        <p>
          New Famili 100 • Dibuat untuk keseruan bersama keluarga & sahabat • &ldquo;Survei Membuktikan!&rdquo;
        </p>
      </footer>

      {/* Strike Overlay Modal */}
      <StrikeModal
        isOpen={strikeModal.isOpen}
        strikeCount={strikeModal.count}
        onClose={() => setStrikeModal({ isOpen: false, count: 0 })}
      />

      {/* Host Controls Drawer */}
      <HostControls
        question={currentQuestion}
        teamA={teamA}
        teamB={teamB}
        activeTeamId={activeTeamId}
        roundScore={roundScore}
        onRevealAnswer={handleRevealAnswer}
        onAddStrike={(teamId) => {
          if (teamId === 'A') {
            setTeamA((prev) => ({ ...prev, strikes: Math.min(3, prev.strikes + 1) }));
          } else {
            setTeamB((prev) => ({ ...prev, strikes: Math.min(3, prev.strikes + 1) }));
          }
          sound.playStrike();
          setStrikeModal({
            isOpen: true,
            count: teamId === 'A' ? teamA.strikes + 1 : teamB.strikes + 1,
          });
        }}
        onResetStrikes={() => {
          setTeamA((prev) => ({ ...prev, strikes: 0 }));
          setTeamB((prev) => ({ ...prev, strikes: 0 }));
          setIsStealRound(false);
        }}
        onSwitchActiveTeam={() => {
          setActiveTeamId((prev) => (prev === 'A' ? 'B' : 'A'));
        }}
        onAwardRoundPoints={(teamId) => {
          handleRoundEnd(teamId, roundScore);
        }}
        onNextRound={handleNextRound}
        onStartBonusRound={handleStartBonusRound}
        isOpen={isHostMode}
        onClose={() => setIsHostMode(false)}
      />

      {/* Rules Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      {/* Question Manager & Custom Question Modal */}
      <QuestionManagerModal
        isOpen={isQuestionsOpen}
        onClose={() => setIsQuestionsOpen(false)}
        questions={questions}
        onAddQuestion={(newQ) => {
          setQuestions((prev) => [newQ, ...prev]);
          showBanner(`Pertanyaan baru berhasil ditambahkan ke database!`, 'success');
        }}
      />

      {/* Game Over Celebration Modal */}
      <GameOverModal
        isOpen={isGameOverOpen}
        teamA={teamA}
        teamB={teamB}
        onStartBonusRound={handleStartBonusRound}
        onRestartGame={handleResetGame}
      />
    </div>
  );
}
