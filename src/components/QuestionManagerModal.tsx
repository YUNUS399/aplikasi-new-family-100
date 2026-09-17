import React, { useState } from 'react';
import { SurveyQuestion, SurveyAnswer } from '../types';
import { X, Plus, Trash2, Check, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { saveCustomQuestion } from '../data/questions';

interface QuestionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: SurveyQuestion[];
  onAddQuestion: (newQ: SurveyQuestion) => void;
}

export const QuestionManagerModal: React.FC<QuestionManagerModalProps> = ({
  isOpen,
  onClose,
  questions,
  onAddQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');

  // Form states for custom question
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('Keluarga & Sahabat');
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
  const [answersList, setAnswersList] = useState<
    { answer: string; points: number; aliases: string }[]
  >([
    { answer: '', points: 40, aliases: '' },
    { answer: '', points: 25, aliases: '' },
    { answer: '', points: 15, aliases: '' },
    { answer: '', points: 10, aliases: '' },
  ]);

  if (!isOpen) return null;

  const handleAnswerChange = (index: number, field: string, val: string | number) => {
    const next = [...answersList];
    next[index] = { ...next[index], [field]: val };
    setAnswersList(next);
  };

  const handleAddAnswerRow = () => {
    if (answersList.length < 8) {
      setAnswersList([...answersList, { answer: '', points: 5, aliases: '' }]);
    }
  };

  const handleRemoveAnswerRow = (idx: number) => {
    if (answersList.length > 2) {
      setAnswersList(answersList.filter((_, i) => i !== idx));
    }
  };

  const totalPointsEntered = answersList.reduce((acc, curr) => acc + (Number(curr.points) || 0), 0);

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const validAnswers: SurveyAnswer[] = answersList
      .filter((a) => a.answer.trim())
      .map((a, idx) => ({
        id: idx + 1,
        rank: idx + 1,
        answer: a.answer.trim(),
        points: Number(a.points) || 1,
        aliases: a.aliases
          ? a.aliases.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
          : [],
        isRevealed: false,
      }));

    if (validAnswers.length < 2) return;

    // sort answers by points descending
    validAnswers.sort((a, b) => b.points - a.points);
    validAnswers.forEach((a, idx) => {
      a.rank = idx + 1;
    });

    const newQ: SurveyQuestion = {
      id: `custom_${Date.now()}`,
      question: questionText.trim(),
      category: category.trim() || 'Umum',
      multiplier,
      answers: validAnswers,
    };

    saveCustomQuestion(newQ);
    onAddQuestion(newQ);

    // reset form
    setQuestionText('');
    setActiveTab('browse');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base sm:text-lg">
                Koleksi & Pembuat Soal Survei
              </h3>
              <p className="text-[11px] text-amber-400">Database Pertanyaan New Famili 100</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('browse')}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'browse'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Daftar Soal ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'create'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Soal Sendiri</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {activeTab === 'browse' ? (
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {q.category} • Babak {q.multiplier}x Poin
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      #{idx + 1} ({q.answers.length} Jawaban)
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-xs sm:text-sm mb-2">
                    &ldquo;{q.question}&rdquo;
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {q.answers.map((a) => (
                      <div
                        key={a.id}
                        className="bg-slate-900 border border-slate-800/80 px-2 py-1 rounded-lg flex items-center justify-between text-[11px]"
                      >
                        <span className="truncate text-slate-300 mr-1">{a.answer}</span>
                        <span className="text-amber-400 font-game font-bold shrink-0">
                          {a.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Create Custom Question Form */
            <form onSubmit={handleSaveCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Pertanyaan Survei
                </label>
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Contoh: Apa yang biasa dibawa orang saat pergi piknik ke pantai?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Contoh: Liburan & Hobi"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Babak / Pengali Poin
                  </label>
                  <select
                    value={multiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value={1}>Babak 1 (Poin Tunggal 1x)</option>
                    <option value={2}>Babak 2 (Poin Ganda 2x)</option>
                    <option value={3}>Babak 3 (Poin Tiga Kali 3x)</option>
                  </select>
                </div>
              </div>

              {/* Answers Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Daftar Jawaban & Poin Survei
                  </label>
                  <span className="text-[11px] text-amber-400 font-semibold">
                    Total Poin: {totalPointsEntered} / 100
                  </span>
                </div>

                <div className="space-y-2">
                  {answersList.map((row, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="w-5 text-center text-xs font-bold text-slate-500">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={row.answer}
                        onChange={(e) => handleAnswerChange(idx, 'answer', e.target.value)}
                        placeholder="Jawaban (misal: Tikar)"
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                        required={idx < 2}
                      />
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={row.points}
                        onChange={(e) => handleAnswerChange(idx, 'points', Number(e.target.value))}
                        placeholder="Poin"
                        className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-amber-400 font-bold text-center focus:border-amber-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={row.aliases}
                        onChange={(e) => handleAnswerChange(idx, 'aliases', e.target.value)}
                        placeholder="Sinonim (pisah koma)"
                        className="w-32 hidden sm:block bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] text-slate-400 focus:border-amber-400 focus:outline-none"
                      />
                      {answersList.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAnswerRow(idx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {answersList.length < 8 && (
                  <button
                    type="button"
                    onClick={handleAddAnswerRow}
                    className="mt-2 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Baris Jawaban
                  </button>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Soal</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
