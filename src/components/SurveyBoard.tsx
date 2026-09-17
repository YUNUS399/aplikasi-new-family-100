import React, { useState } from 'react';
import { SurveyAnswer, SurveyQuestion } from '../types';
import { Send, Eye, Sparkles, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface SurveyBoardProps {
  currentQuestion: SurveyQuestion;
  onAnswerSubmit: (answerText: string) => void;
  onRevealAnswer: (answerId: number) => void;
  isHostMode: boolean;
  disabledInput?: boolean;
}

export const SurveyBoard: React.FC<SurveyBoardProps> = ({
  currentQuestion,
  onAnswerSubmit,
  onRevealAnswer,
  isHostMode,
  disabledInput = false,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || disabledInput) return;
    onAnswerSubmit(inputValue.trim());
    setInputValue('');
  };

  // Split answers into 2 columns
  const totalAnswers = currentQuestion.answers.length;
  const midPoint = Math.ceil(totalAnswers / 2);
  const leftCol = currentQuestion.answers.slice(0, midPoint);
  const rightCol = currentQuestion.answers.slice(midPoint);

  const renderSlat = (item: SurveyAnswer) => {
    return (
      <div
        key={item.id}
        onClick={() => {
          if (!item.isRevealed) {
            onRevealAnswer(item.id);
          }
        }}
        className={`relative h-14 sm:h-16 w-full cursor-pointer perspective-1000 group select-none transition-transform active:scale-[0.99]`}
      >
        <div
          className={`w-full h-full duration-500 transform-style-3d relative rounded-xl shadow-lg border transition-all ${
            item.isRevealed
              ? 'rotate-y-180 border-amber-400/80 shadow-amber-500/20'
              : 'border-blue-700/60 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 hover:border-amber-400/50 shadow-blue-950/50'
          }`}
        >
          {/* BACK OF CARD: Unrevealed state (Shows number) */}
          <div className="absolute inset-0 backface-hidden rounded-xl flex items-center justify-between px-3 sm:px-4 bg-gradient-to-b from-blue-950/90 via-slate-900 to-blue-950 border border-blue-600/40">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-game font-extrabold text-sm sm:text-base flex items-center justify-center shadow-inner border border-amber-200">
              {item.rank}
            </div>
            
            {/* Host sneak peek if host mode enabled */}
            {isHostMode && (
              <div className="flex items-center gap-1.5 text-xs text-amber-300/60 font-mono italic truncate max-w-[180px] sm:max-w-[220px]">
                <Eye className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.answer} ({item.points})</span>
              </div>
            )}

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-600 font-game font-bold text-xs">
              •••
            </div>
          </div>

          {/* FRONT OF CARD: Revealed state (Shows Answer & Points) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl flex items-center justify-between px-2 sm:px-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-amber-400/90 overflow-hidden">
            {/* Left rank badge */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400 text-slate-950 font-game font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow">
              {item.rank}
            </div>

            {/* Answer Title */}
            <div className="flex-1 mx-2 sm:mx-3 text-center truncate">
              <span className="font-extrabold text-xs sm:text-base lg:text-lg uppercase tracking-wide text-white drop-shadow-sm truncate block">
                {item.answer}
              </span>
            </div>

            {/* Score points box */}
            <div className="w-10 sm:w-14 h-9 sm:h-10 rounded-lg bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 font-game font-black text-base sm:text-xl flex items-center justify-center shrink-0 shadow-md border border-amber-200">
              {item.points}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2">
      {/* Studio Survey Display Board Frame */}
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 p-3 sm:p-6 border-2 sm:border-4 border-amber-500/40 shadow-2xl shadow-blue-900/40 relative">
        {/* Board Top Header Plate */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3 h-3" />
            100 Orang Ditanya • {currentQuestion.category}
          </div>
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-100 px-2 tracking-tight leading-snug drop-shadow-md">
            &ldquo;{currentQuestion.question}&rdquo;
          </h2>
        </div>

        {/* Survey Slat Grid (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5 mb-5 sm:mb-6">
          {/* Left Column */}
          <div className="flex flex-col gap-2.5 sm:gap-3.5">
            {leftCol.map((item) => renderSlat(item))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-2.5 sm:gap-3.5">
            {rightCol.map((item) => renderSlat(item))}
          </div>
        </div>

        {/* Answer Input Bar */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              id="input-survey-answer"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={disabledInput}
              placeholder={disabledInput ? 'Papan sedang terkunci...' : 'Ketik tebakan jawaban survei lalu tekan Enter...'}
              className="w-full bg-slate-950/90 border-2 border-slate-700 hover:border-amber-500/60 focus:border-amber-400 text-slate-100 placeholder-slate-500 px-4 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold focus:outline-none transition-all shadow-inner disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            id="btn-submit-answer"
            disabled={disabledInput || !inputValue.trim()}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 text-sm sm:text-base shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Jawab</span>
          </button>
        </form>

        {isHostMode && (
          <div className="mt-3 text-center">
            <span className="text-[11px] text-amber-300/80 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Tip Host: Anda dapat mengklik langsung kartu nomor untuk membuka jawaban!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
