import React from 'react';
import { X, HelpCircle, Flame, Shield, Award, Sparkles, Bell } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base sm:text-lg">
                Aturan Main New Famili 100
              </h3>
              <p className="text-[11px] text-amber-400">Panduan Resmi Game Show Televisi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 text-slate-300 text-xs sm:text-sm">
          {/* Rule 1: Rebutan Bel */}
          <div className="flex gap-3.5 items-start bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1">
                1. Babak Rebutan Bel (Face-Off)
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Dua kapten berhadapan di meja bel (Tombol [A] untuk Tim 1, Tombol [L] untuk Tim 2). Siapa yang memencet bel lebih cepat dan menjawab dengan nilai survei tertinggi (Top Answer) berhak memilih <strong>MAIN</strong> (kuasai papan) atau <strong>LEMPAR</strong> ke tim lawan.
              </p>
            </div>
          </div>

          {/* Rule 2: Papan Survei & 3 Strikes */}
          <div className="flex gap-3.5 items-start bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1">
                2. Menjawab Papan Survei & 3 Strike (❌❌❌)
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Tim yang menguasai papan menebak jawaban satu per satu. Setiap jawaban benar akan membuka kartu dan poinnya masuk ke Bank Skor. Jika tebakan salah, tim mendapat <strong>1 tanda silang (Strike)</strong>. Jika sudah mencapai 3 kali salah (3 Strikes), giliran akan terancam dicuri!
              </p>
            </div>
          </div>

          {/* Rule 3: Curi Poin */}
          <div className="flex gap-3.5 items-start bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1">
                3. Babak Curi Poin (Steal)
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Setelah 3 strike terjadi, tim lawan berunding dan diberi <strong>SATU KESEMPATAN</strong> untuk menebak salah satu jawaban yang tersisa. Jika tebakan mereka benar, <strong>seluruh poin di babak tersebut langsung dicuri</strong> oleh tim lawan! Jika salah, poin tetap menjadi milik tim pemegang papan.
              </p>
            </div>
          </div>

          {/* Rule 4: Multiplier Poin */}
          <div className="flex gap-3.5 items-start bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1">
                4. Pengali Poin (Multiplier)
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Babak 1 dihitung <strong>Poin Tunggal (1x)</strong>, Babak 2 dihitung <strong>Poin Ganda (2x)</strong>, dan Babak 3 dihitung <strong>Poin Tiga Kali Lipat (3x)</strong> untuk membalikkan keadaan!
              </p>
            </div>
          </div>

          {/* Rule 5: Babak Bonus */}
          <div className="flex gap-3.5 items-start bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1">
                5. Babak Bonus: Top Survey (Fast Money)
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Tim dengan total poin tertinggi melaju ke babak bonus. Dua perwakilan menjawab 5 pertanyaan kilat (20 detik untuk Pemain 1, 25 detik untuk Pemain 2). Jika total akumulasi skor kedua pemain mencapai <strong>200 Poin</strong>, mereka memenangkan <strong>Hadiah Utama Jackpot Rp 100.000.000!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-right bg-slate-900/90">
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2 rounded-xl text-sm transition-colors"
          >
            Mengerti, Ayo Main!
          </button>
        </div>
      </div>
    </div>
  );
};
