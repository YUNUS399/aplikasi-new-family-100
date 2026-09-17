import React, { useState, useEffect, useRef } from 'react';
import { BonusQuestionSet, Team } from '../types';
import { sound } from '../utils/audio';
import { Sparkles, Timer, Award, ArrowRight, RotateCcw, Check, Zap } from 'lucide-react';
import { normalizeText } from '../utils/fuzzyMatch';

interface BonusRoundProps {
  winningTeam: Team;
  bonusSet: BonusQuestionSet;
  onExitBonus: () => void;
}

export const BonusRound: React.FC<BonusRoundProps> = ({
  winningTeam,
  bonusSet,
  onExitBonus,
}) => {
  // Stages: 'intro' | 'player1' | 'break' | 'player2' | 'reveal' | 'result'
  const [stage, setStage] = useState<'intro' | 'player1' | 'break' | 'player2' | 'reveal' | 'result'>('intro');

  // Player answers & score calculations
  const [p1Answers, setP1Answers] = useState<string[]>(['', '', '', '', '']);
  const [p2Answers, setP2Answers] = useState<string[]>(['', '', '', '', '']);
  const [p1Scores, setP1Scores] = useState<number[]>([0, 0, 0, 0, 0]);
  const [p2Scores, setP2Scores] = useState<number[]>([0, 0, 0, 0, 0]);

  // Active question index during timer mode (0..4)
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Reveal step counter (0..9: 5 for P1, 5 for P2)
  const [revealStep, setRevealStep] = useState<number>(0);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          sound.playGong();
          handleTimeUp();
          return 0;
        }
        if (prev <= 6) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, stage]);

  const handleTimeUp = () => {
    setIsTimerRunning(false);
    if (stage === 'player1') {
      setStage('break');
    } else if (stage === 'player2') {
      calculateScores();
      setStage('reveal');
    }
  };

  const startPlayer1 = () => {
    setStage('player1');
    setCurrentQIndex(0);
    setCurrentInput('');
    setTimeLeft(20);
    setIsTimerRunning(true);
  };

  const startPlayer2 = () => {
    setStage('player2');
    setCurrentQIndex(0);
    setCurrentInput('');
    setTimeLeft(25);
    setIsTimerRunning(true);
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = currentInput.trim();
    if (!clean) return;

    sound.playFlip();

    if (stage === 'player1') {
      const nextP1 = [...p1Answers];
      nextP1[currentQIndex] = clean;
      setP1Answers(nextP1);

      if (currentQIndex < 4) {
        setCurrentQIndex(currentQIndex + 1);
        setCurrentInput('');
      } else {
        // Player 1 finished all 5 questions
        setIsTimerRunning(false);
        sound.playGong();
        setStage('break');
      }
    } else if (stage === 'player2') {
      // Check if duplicate answer with player 1
      const p1Answer = p1Answers[currentQIndex];
      if (p1Answer && normalizeText(clean) === normalizeText(p1Answer)) {
        sound.playStrike();
        setCurrentInput('');
        return; // reject duplicate answer in game show style
      }

      const nextP2 = [...p2Answers];
      nextP2[currentQIndex] = clean;
      setP2Answers(nextP2);

      if (currentQIndex < 4) {
        setCurrentQIndex(currentQIndex + 1);
        setCurrentInput('');
      } else {
        // Player 2 finished all 5 questions
        setIsTimerRunning(false);
        sound.playGong();
        calculateScores(nextP2);
        setStage('reveal');
      }
    }
  };

  // Match input with options
  const getPointsForAnswer = (qIndex: number, answerText: string): number => {
    if (!answerText) return 0;
    const q = bonusSet.questions[qIndex];
    if (!q) return 0;

    const norm = normalizeText(answerText);
    for (const opt of q.options) {
      if (normalizeText(opt.text) === norm || (opt.aliases && opt.aliases.some((a) => normalizeText(a) === norm))) {
        return opt.points;
      }
    }
    // partial check
    for (const opt of q.options) {
      if (norm.length >= 3 && normalizeText(opt.text).includes(norm)) {
        return opt.points;
      }
    }
    return 0;
  };

  const calculateScores = (latestP2?: string[]) => {
    const scores1 = p1Answers.map((ans, idx) => getPointsForAnswer(idx, ans));
    const targetP2 = latestP2 || p2Answers;
    const scores2 = targetP2.map((ans, idx) => getPointsForAnswer(idx, ans));
    setP1Scores(scores1);
    setP2Scores(scores2);
  };

  // Step-by-step dramatic reveal
  const handleNextReveal = () => {
    if (revealStep < 10) {
      sound.playCorrect();
      setRevealStep((prev) => prev + 1);

      // check if final step
      if (revealStep === 9) {
        setTimeout(() => {
          const total = [...p1Scores, ...p2Scores].reduce((a, b) => a + b, 0);
          if (total >= 200) {
            sound.playFanfare();
          }
          setStage('result');
        }, 1200);
      }
    }
  };

  const totalScoreRevealed = () => {
    let sum = 0;
    // Reveal steps 0..4 are P1 answers (1 to 5)
    // Reveal steps 5..9 are P2 answers (1 to 5)
    for (let i = 0; i < 5; i++) {
      if (revealStep > i) {
        sum += p1Scores[i];
      }
    }
    for (let i = 0; i < 5; i++) {
      if (revealStep > i + 5) {
        sum += p2Scores[i];
      }
    }
    return sum;
  };

  const grandTotal = [...p1Scores, ...p2Scores].reduce((a, b) => a + b, 0);

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 border-2 sm:border-4 border-amber-400 p-4 sm:p-8 shadow-2xl shadow-blue-950/60 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse" />

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-game font-black text-xl shadow-lg shadow-amber-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-amber-400">
                BABAK BONUS • TOP SURVEY
              </span>
              <h2 className="text-base sm:text-xl font-black text-white">
                Tim {winningTeam.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-950/80 border border-amber-500/40 px-3 py-1.5 rounded-xl text-center">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                Target Poin
              </span>
              <span className="font-game font-black text-xl text-amber-400">
                200
              </span>
            </div>
          </div>
        </div>

        {/* 1. INTRO STAGE */}
        {stage === 'intro' && (
          <div className="max-w-xl mx-auto text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20 animate-pulse">
              <Sparkles className="w-10 h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Selamat Melaju ke Babak Top Survey!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Dua perwakilan dari tim <strong>{winningTeam.name}</strong> akan menjawab 5 pertanyaan survei cepat. Kumpulkan akumulasi minimal <strong>200 Poin</strong> untuk membawa pulang <strong>Grand Jackpot Emas Rp 100.000.000!</strong>
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-8 text-left">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-amber-400 font-bold block text-xs">Pemain 1</span>
                <span className="text-slate-200 text-sm font-semibold">Waktu: 20 Detik</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-amber-400 font-bold block text-xs">Pemain 2</span>
                <span className="text-slate-200 text-sm font-semibold">Waktu: 25 Detik</span>
              </div>
            </div>

            <button
              id="btn-start-player1"
              onClick={startPlayer1}
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-base shadow-xl shadow-amber-500/30 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span>Mulai Pemain 1 (20 Detik)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 2. PLAYER 1 PLAYING STAGE */}
        {stage === 'player1' && (
          <div className="max-w-2xl mx-auto py-2">
            <div className="flex items-center justify-between mb-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white text-sm">Pemain 1 Sedang Menjawab</span>
              </div>
              <div className="flex items-center gap-1.5 font-game font-black text-2xl text-amber-400">
                <Timer className="w-5 h-5 text-amber-400" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-900/90 border-2 border-amber-500/40 p-6 rounded-2xl text-center mb-6 shadow-xl">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-widest block mb-1">
                Pertanyaan {currentQIndex + 1} dari 5
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white">
                &ldquo;{bonusSet.questions[currentQIndex]?.question}&rdquo;
              </h3>
            </div>

            <form onSubmit={handleAnswerSubmit} className="flex gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Ketik jawaban cepat lalu tekan Enter..."
                className="flex-1 bg-slate-950 border-2 border-amber-500/60 px-4 py-3 rounded-xl text-white font-semibold focus:outline-none focus:border-amber-400"
                autoFocus
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-colors shrink-0"
              >
                Kirim
              </button>
            </form>

            <div className="mt-4 flex justify-between text-xs text-slate-400">
              <span>Pertanyaan ke-{currentQIndex + 1}</span>
              <button
                type="button"
                onClick={() => {
                  if (currentQIndex < 4) setCurrentQIndex(currentQIndex + 1);
                }}
                className="text-amber-400 hover:underline"
              >
                Lewati pertanyaan ini
              </button>
            </div>
          </div>
        )}

        {/* 3. BREAK / TRANSITION TO PLAYER 2 */}
        {stage === 'break' && (
          <div className="max-w-md mx-auto text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-400">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Pemain 1 Selesai!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6">
              Pemain 2 dipersilakan masuk. Pemain 2 memiliki waktu <strong>25 detik</strong>. Jawaban tidak boleh sama dengan jawaban Pemain 1!
            </p>
            <button
              id="btn-start-player2"
              onClick={startPlayer2}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-8 py-3 rounded-2xl text-base shadow-xl shadow-amber-500/30 transition-all inline-flex items-center gap-2"
            >
              <span>Mulai Pemain 2 (25 Detik)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 4. PLAYER 2 PLAYING STAGE */}
        {stage === 'player2' && (
          <div className="max-w-2xl mx-auto py-2">
            <div className="flex items-center justify-between mb-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                <span className="font-bold text-white text-sm">Pemain 2 Sedang Menjawab</span>
              </div>
              <div className="flex items-center gap-1.5 font-game font-black text-2xl text-amber-400">
                <Timer className="w-5 h-5 text-amber-400" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-900/90 border-2 border-purple-500/40 p-6 rounded-2xl text-center mb-6 shadow-xl">
              <span className="text-xs uppercase font-bold text-purple-400 tracking-widest block mb-1">
                Pertanyaan {currentQIndex + 1} dari 5
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white">
                &ldquo;{bonusSet.questions[currentQIndex]?.question}&rdquo;
              </h3>
            </div>

            <form onSubmit={handleAnswerSubmit} className="flex gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Ketik jawaban (tidak boleh sama dgn Pemain 1)..."
                className="flex-1 bg-slate-950 border-2 border-purple-500/60 px-4 py-3 rounded-xl text-white font-semibold focus:outline-none focus:border-purple-400"
                autoFocus
              />
              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-6 py-3 rounded-xl transition-colors shrink-0"
              >
                Kirim
              </button>
            </form>

            <div className="mt-4 flex justify-between text-xs text-slate-400">
              <span>Pertanyaan ke-{currentQIndex + 1}</span>
              <button
                type="button"
                onClick={() => {
                  if (currentQIndex < 4) setCurrentQIndex(currentQIndex + 1);
                }}
                className="text-purple-400 hover:underline"
              >
                Lewati pertanyaan ini
              </button>
            </div>
          </div>
        )}

        {/* 5. REVEAL STAGE & 6. FINAL RESULT */}
        {(stage === 'reveal' || stage === 'result') && (
          <div>
            {/* Top Score Tracker */}
            <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-2 border-amber-500/50 p-4 rounded-2xl flex items-center justify-between mb-6 shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Total Skor Sementara
                </span>
                <span className="text-xs text-slate-400">
                  {revealStep < 10 ? `Membuka poin ke-${revealStep} dari 10` : 'Semua jawaban telah dibuka!'}
                </span>
              </div>
              <div className="font-game font-black text-4xl sm:text-5xl text-amber-300 drop-shadow">
                {stage === 'result' ? grandTotal : totalScoreRevealed()}
                <span className="text-sm font-normal text-slate-400 ml-1">/ 200</span>
              </div>
            </div>

            {/* Dramatic Top Survey Board Grid */}
            <div className="space-y-2 mb-6">
              {bonusSet.questions.map((q, idx) => {
                const isP1Revealed = revealStep > idx;
                const isP2Revealed = revealStep > idx + 5;

                return (
                  <div
                    key={q.id}
                    className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2"
                  >
                    {/* Question Column */}
                    <div className="md:w-5/12 text-xs font-semibold text-slate-200">
                      <span className="text-amber-400 mr-1.5 font-bold">#{idx + 1}</span>
                      {q.question}
                    </div>

                    {/* Answers Grid */}
                    <div className="md:w-7/12 grid grid-cols-2 gap-2">
                      {/* Player 1 Slot */}
                      <div className="bg-slate-950 border border-blue-900/50 p-2 rounded-lg flex items-center justify-between">
                        <span className="text-xs text-blue-200 uppercase font-bold truncate mr-2">
                          {p1Answers[idx] || '—'}
                        </span>
                        <span
                          className={`font-game font-black text-sm px-2 py-0.5 rounded transition-all ${
                            isP1Revealed
                              ? 'bg-blue-600 text-white shadow'
                              : 'bg-slate-800 text-slate-600'
                          }`}
                        >
                          {isP1Revealed ? p1Scores[idx] : '••'}
                        </span>
                      </div>

                      {/* Player 2 Slot */}
                      <div className="bg-slate-950 border border-purple-900/50 p-2 rounded-lg flex items-center justify-between">
                        <span className="text-xs text-purple-200 uppercase font-bold truncate mr-2">
                          {p2Answers[idx] || '—'}
                        </span>
                        <span
                          className={`font-game font-black text-sm px-2 py-0.5 rounded transition-all ${
                            isP2Revealed
                              ? 'bg-purple-600 text-white shadow'
                              : 'bg-slate-800 text-slate-600'
                          }`}
                        >
                          {isP2Revealed ? p2Scores[idx] : '••'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reveal Controls or Victory Announcement */}
            {stage === 'reveal' && (
              <div className="text-center">
                <button
                  id="btn-reveal-next-point"
                  onClick={handleNextReveal}
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-base shadow-xl shadow-amber-500/30 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  <span>Survei Membuktikan! (Buka Skor Berikutnya)</span>
                </button>
              </div>
            )}

            {stage === 'result' && (
              <div className="text-center p-6 bg-slate-900/90 border-2 border-amber-400 rounded-2xl shadow-2xl animate-fade-in">
                {grandTotal >= 200 ? (
                  <div>
                    <span className="text-amber-400 text-xs sm:text-sm uppercase font-black tracking-widest block mb-2 animate-bounce">
                      🏆 SELAMAT! ANDA MENCAPAI 200 POIN! 🏆
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-black text-white mb-2">
                      GRAND JACKPOT RP 100.000.000!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mb-6">
                      Tim <strong>{winningTeam.name}</strong> berhasil menyapu bersih Babak Top Survey dengan skor spektakuler <strong>{grandTotal} Poin</strong>!
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="text-slate-400 text-xs sm:text-sm uppercase font-bold tracking-widest block mb-2">
                      Babak Bonus Selesai
                    </span>
                    <h3 className="text-xl sm:text-3xl font-black text-white mb-2">
                      Total {grandTotal} Poin (Hadiah: Rp {(grandTotal * 10000).toLocaleString('id-ID')})
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mb-6">
                      Belum mencapai target 200 poin untuk Grand Prize, tapi permainan yang luar biasa dari Tim {winningTeam.name}!
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  <button
                    onClick={onExitBonus}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Kembali ke Permainan</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
