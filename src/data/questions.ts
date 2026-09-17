import { SurveyQuestion, BonusQuestionSet } from '../types';

export const INITIAL_QUESTIONS: SurveyQuestion[] = [
  // --- BABAK 1 (POIN TUNGGAL) ---
  {
    id: 'q1',
    multiplier: 1,
    category: 'Kebiasaan Bangun Pagi',
    question: 'Apa yang biasa dicari orang saat pertama kali bangun tidur di pagi hari?',
    answers: [
      { id: 1, rank: 1, answer: 'Handphone / HP', points: 42, aliases: ['hp', 'ponsel', 'smartphone', 'gadget', 'telepon'], isRevealed: false },
      { id: 2, rank: 2, answer: 'Kacamata', points: 19, aliases: ['kaca mata', 'soflens', 'softlens'], isRevealed: false },
      { id: 3, rank: 3, answer: 'Air Minum', points: 15, aliases: ['air', 'minuman', 'air putih', 'gelas'], isRevealed: false },
      { id: 4, rank: 4, answer: 'Jam Dinding / Alarm', points: 11, aliases: ['jam', 'alarm', 'waktu'], isRevealed: false },
      { id: 5, rank: 5, answer: 'Sandal', points: 7, aliases: ['sandal jepit', 'alas kaki'], isRevealed: false },
      { id: 6, rank: 6, answer: 'Kamar Mandi / Toilet', points: 6, aliases: ['toilet', 'wc', 'kamar mandi'], isRevealed: false },
    ],
  },
  {
    id: 'q2',
    multiplier: 1,
    category: 'Kehidupan Sehari-hari',
    question: 'Alasan apa yang paling sering diucapkan orang ketika terlambat datang?',
    answers: [
      { id: 1, rank: 1, answer: 'Macet di Jalan', points: 45, aliases: ['macet', 'jalan macet', 'kemacetan'], isRevealed: false },
      { id: 2, rank: 2, answer: 'Bangun Kesiangan', points: 26, aliases: ['kesiangan', 'telat bangun', 'ketiduran'], isRevealed: false },
      { id: 3, rank: 3, answer: 'Ban Bocor / Kendaraan Rusak', points: 12, aliases: ['ban bocor', 'motor mogok', 'mobil mogok', 'rusak'], isRevealed: false },
      { id: 4, rank: 4, answer: 'Hujan Lebat / Cuaca', points: 8, aliases: ['hujan', 'kehujanan', 'banjir'], isRevealed: false },
      { id: 5, rank: 5, answer: 'Menunggu Angkutan Umum', points: 5, aliases: ['nunggu ojol', 'ojol lama', 'nunggu angkot', 'kereta telat'], isRevealed: false },
      { id: 6, rank: 6, answer: 'Ada Urusan Keluarga', points: 4, aliases: ['urusan keluarga', 'ada keperluan', 'acara keluarga'], isRevealed: false },
    ],
  },
  {
    id: 'q3',
    multiplier: 1,
    category: 'Kuliner Indonesia',
    question: 'Selain nasi goreng, makanan apa yang sering dijadikan sarapan oleh orang Indonesia?',
    answers: [
      { id: 1, rank: 1, answer: 'Bubur Ayam', points: 38, aliases: ['bubur', 'buryam'], isRevealed: false },
      { id: 2, rank: 2, answer: 'Lontong Sayur / Ketupat', points: 24, aliases: ['lontong', 'ketupat sayur', 'lontong sayur'], isRevealed: false },
      { id: 3, rank: 3, answer: 'Nasi Uduk', points: 18, aliases: ['uduk'], isRevealed: false },
      { id: 4, rank: 4, answer: 'Roti Panggang / Selai', points: 9, aliases: ['roti', 'roti tawar', 'roti bakar'], isRevealed: false },
      { id: 5, rank: 5, answer: 'Nasi Kuning', points: 6, aliases: ['naskun'], isRevealed: false },
      { id: 6, rank: 6, answer: 'Mie Instan', points: 5, aliases: ['indomie', 'mie', 'mi instan'], isRevealed: false },
    ],
  },
  {
    id: 'q4',
    multiplier: 1,
    category: 'Hubungan & Pertemanan',
    question: 'Barang apa milik kita yang sering dipinjam teman tapi paling sering lupa dikembalikan?',
    answers: [
      { id: 1, rank: 1, answer: 'Korek Api / Korek Gas', points: 39, aliases: ['korek', 'korek api', 'matches'], isRevealed: false },
      { id: 2, rank: 2, answer: 'Pulpen / Alat Tulis', points: 28, aliases: ['pena', 'pulpen', 'pensil'], isRevealed: false },
      { id: 3, rank: 3, answer: 'Uang / Duit', points: 15, aliases: ['duit', 'uang', 'pinjaman'], isRevealed: false },
      { id: 4, rank: 4, answer: 'Charger HP / Kabel Data', points: 10, aliases: ['casan', 'charger', 'kabel data'], isRevealed: false },
      { id: 5, rank: 5, answer: 'Buku / Catatan', points: 5, aliases: ['buku', 'novel', 'komik', 'catatan'], isRevealed: false },
      { id: 6, rank: 6, answer: 'Jaket / Baju', points: 3, aliases: ['jaket', 'pakaian', 'kaos'], isRevealed: false },
    ],
  },
  {
    id: 'q5',
    multiplier: 1,
    category: 'Gaya Hidup & Dompet',
    question: 'Benda apa yang hampir selalu ada di dalam dompet pria?',
    answers: [
      { id: 1, rank: 1, answer: 'KTP / Identitas', points: 35, aliases: ['ktp', 'kartu identitas', 'id card'], isRevealed: false },
      { id: 2, rank: 2, answer: 'Uang Tunai / Kertas', points: 29, aliases: ['uang', 'duit', 'cash'], isRevealed: false },
      { id: 3, rank: 3, answer: 'SIM / Surat Mengemudi', points: 16, aliases: ['sim', 'sim a', 'sim c'], isRevealed: false },
      { id: 4, rank: 4, answer: 'Kartu ATM / Debit', points: 12, aliases: ['atm', 'kartu debit', 'kartu kredit'], isRevealed: false },
      { id: 5, rank: 5, answer: 'Struk Belanja / Kertas Bon', points: 5, aliases: ['struk', 'bon', 'nota'], isRevealed: false },
      { id: 6, rank: 6, answer: 'Foto Pacar / Keluarga', points: 3, aliases: ['foto', 'pas foto'], isRevealed: false },
    ],
  },

  // --- BABAK 2 (POIN GANDA) ---
  {
    id: 'q6',
    multiplier: 2,
    category: 'Tempat Kencan & Percintaan',
    question: 'Di mana tempat yang paling umum dikunjungi saat kencan pertama?',
    answers: [
      { id: 1, rank: 1, answer: 'Kafe / Warkop', points: 36, aliases: ['kafe', 'cafe', 'coffee shop', 'warkop'], isRevealed: false },
      { id: 2, rank: 2, answer: 'Bioskop / Nonton Film', points: 31, aliases: ['bioskop', 'nonton', 'cinema'], isRevealed: false },
      { id: 3, rank: 3, answer: 'Restoran / Tempat Makan', points: 18, aliases: ['restoran', 'resto', 'rumah makan', 'mall'], isRevealed: false },
      { id: 4, rank: 4, answer: 'Taman Kota', points: 9, aliases: ['taman', 'taman kota', 'ruang terbuka'], isRevealed: false },
      { id: 5, rank: 5, answer: 'Pantai / Wisata Alam', points: 6, aliases: ['pantai', 'danau', 'alam'], isRevealed: false },
    ],
  },
  {
    id: 'q7',
    multiplier: 2,
    category: 'Kebiasaan Warga',
    question: 'Apa yang biasa dilakukan orang Indonesia ketika sedang mati lampu (padam listrik)?',
    answers: [
      { id: 1, rank: 1, answer: 'Menyalakan Lilin / Senter', points: 41, aliases: ['nyalain lilin', 'lilin', 'senter', 'lampu darurat'], isRevealed: false },
      { id: 2, rank: 2, answer: 'Main Handphone / Sosmed', points: 27, aliases: ['main hp', 'buka hp', 'scroll tiktok', 'sosmed'], isRevealed: false },
      { id: 3, rank: 3, answer: 'Keluar Rumah / Nongkrong Tetangga', points: 16, aliases: ['keluar rumah', 'nongkrong', 'ngobrol sama tetangga', 'teras'], isRevealed: false },
      { id: 4, rank: 4, answer: 'Tidur', points: 11, aliases: ['tidur', 'rebahan', 'merem'], isRevealed: false },
      { id: 5, rank: 5, answer: 'Kipas-Kipas Manual', points: 5, aliases: ['kipasan', 'kipas manual', 'kepanasan'], isRevealed: false },
    ],
  },
  {
    id: 'q8',
    multiplier: 2,
    category: 'Dunia Kerja & Kantor',
    question: 'Hal apa yang paling ditunggu-tunggu oleh karyawan di tempat kerja?',
    answers: [
      { id: 1, rank: 1, answer: 'Hari Gajian / Tanggal Tua Berakhir', points: 48, aliases: ['gajian', 'gaji', 'payday'], isRevealed: false },
      { id: 2, rank: 2, answer: 'Jam Pulang Kantor', points: 26, aliases: ['jam pulang', 'pulang', 'tenggo'], isRevealed: false },
      { id: 3, rank: 3, answer: 'Jam Istirahat / Makan Siang', points: 13, aliases: ['istirahat', 'makan siang', 'ishoma'], isRevealed: false },
      { id: 4, rank: 4, answer: 'THR / Bonus Tahunan', points: 8, aliases: ['thr', 'bonus', 'tunjangan'], isRevealed: false },
      { id: 5, rank: 5, answer: 'Hari Libur / Cuti Bersama', points: 5, aliases: ['libur', 'weekend', 'cuti'], isRevealed: false },
    ],
  },

  // --- BABAK 3 (POIN TIGA KALI LIPAT) ---
  {
    id: 'q9',
    multiplier: 3,
    category: 'Ketakutan & Kejutan',
    question: 'Hewan apa yang paling bikin heboh atau ditakuti jika tiba-tiba masuk ke dalam rumah?',
    answers: [
      { id: 1, rank: 1, answer: 'Ular', points: 43, aliases: ['ular', 'anak ular', 'kobra'], isRevealed: false },
      { id: 2, rank: 2, answer: 'Kecoak Terbang', points: 34, aliases: ['kecoak', 'kecoa', 'coro', 'kecoa terbang'], isRevealed: false },
      { id: 3, rank: 3, answer: 'Tikus', points: 14, aliases: ['tikus', 'curut'], isRevealed: false },
      { id: 4, rank: 4, answer: 'Kelelawar / Burung Hantu', points: 9, aliases: ['kelelawar', 'kalong'], isRevealed: false },
    ],
  },
  {
    id: 'q10',
    multiplier: 3,
    category: 'Kebiasaan Mandi',
    question: 'Apa alasan seseorang malas mandi di hari Minggu atau hari libur?',
    answers: [
      { id: 1, rank: 1, answer: 'Airnya Dingin / Cuaca Mendung', points: 40, aliases: ['dingin', 'air dingin', 'kedinginan'], isRevealed: false },
      { id: 2, rank: 2, answer: 'Tidak Ada Acara Keluar Rumah', points: 32, aliases: ['di rumah aja', 'ga kemana-mana', 'rebahan', 'tidak keluar'], isRevealed: false },
      { id: 3, rank: 3, answer: 'Masih Mengantuk / Ingin Tidur Lagi', points: 19, aliases: ['ngantuk', 'pengen tidur', 'mager'], isRevealed: false },
      { id: 4, rank: 4, answer: 'Asyik Nonton Film / Main Game', points: 9, aliases: ['nonton film', 'main game', 'maraton drakor'], isRevealed: false },
    ],
  },
  {
    id: 'q11',
    multiplier: 3,
    category: 'Pesta & Undangan Pernikahan',
    question: 'Hal apa yang paling dinantikan orang saat datang ke pesta resepsi pernikahan?',
    answers: [
      { id: 1, rank: 1, answer: 'Makan Gratis / Menu Prasmanan', points: 52, aliases: ['makanan', 'makan', 'prasmanan', 'kambing guling', 'es podeng'], isRevealed: false },
      { id: 2, rank: 2, answer: 'Ketemu Teman Lama / Reuni', points: 25, aliases: ['reuni', 'ketemu kawan', 'ngobrol'], isRevealed: false },
      { id: 3, rank: 3, answer: 'Melihat Gaun Pengantin & Foto', points: 14, aliases: ['foto', 'lihat pengantin', 'selfie', 'baju pengantin'], isRevealed: false },
      { id: 4, rank: 4, answer: 'Souvenir Pernikahan', points: 9, aliases: ['souvenir', 'oleh-oleh', 'hadiah tamu'], isRevealed: false },
    ],
  },
];

// Curated sets for BABAK BONUS / TOP SURVEY (FAST MONEY)
export const BONUS_SETS: BonusQuestionSet[] = [
  {
    id: 'bonus_1',
    title: 'Paket Top Survey 1',
    questions: [
      {
        id: 'bq1',
        question: 'Berapa cangkir kopi yang biasa diminum orang dalam sehari?',
        options: [
          { text: '1 Cangkir', points: 46, aliases: ['1', 'satu'] },
          { text: '2 Cangkir', points: 34, aliases: ['2', 'dua'] },
          { text: '3 Cangkir', points: 12, aliases: ['3', 'tiga'] },
          { text: 'Tidak minum kopi', points: 8, aliases: ['0', 'nol', 'tidak ada'] },
        ],
      },
      {
        id: 'bq2',
        question: 'Sebutkan makanan pelengkap yang wajib ada saat makan bakso!',
        options: [
          { text: 'Sambal', points: 48, aliases: ['cabe', 'saus sambal'] },
          { text: 'Kerupuk / Pangsit', points: 26, aliases: ['pangsit', 'kerupuk', 'pangsit goreng'] },
          { text: 'Kecap Manis', points: 16, aliases: ['kecap'] },
          { text: 'Cuka', points: 10, aliases: ['cuka makan'] },
        ],
      },
      {
        id: 'bq3',
        question: 'Pada usia berapa orang Indonesia biasanya mulai memikirkan pernikahan?',
        options: [
          { text: '25 Tahun', points: 51, aliases: ['25', 'dua puluh lima'] },
          { text: '27 Tahun', points: 24, aliases: ['27', 'dua puluh tujuh'] },
          { text: '23 Tahun', points: 15, aliases: ['23', 'dua puluh tiga'] },
          { text: '30 Tahun', points: 10, aliases: ['30', 'tiga puluh'] },
        ],
      },
      {
        id: 'bq4',
        question: 'Benda apa yang paling sering tertinggal di kamar hotel saat check-out?',
        options: [
          { text: 'Charger HP', points: 53, aliases: ['casan', 'kabel charger'] },
          { text: 'Pakaian Dalam / Baju', points: 22, aliases: ['baju', 'celana', 'pakaian'] },
          { text: 'Handuk / Alat Mandi', points: 14, aliases: ['sabun', 'sikat gigi'] },
          { text: 'Kacamata / Jam Tangan', points: 11, aliases: ['jam', 'kacamata'] },
        ],
      },
      {
        id: 'bq5',
        question: 'Sebutkan suara hewan yang paling sering mengganggu tidur malam!',
        options: [
          { text: 'Nyamuk', points: 55, aliases: ['suara nyamuk'] },
          { text: 'Kucing Kawin / Berantem', points: 28, aliases: ['kucing', 'suara kucing'] },
          { text: 'Anjing Menggonggong', points: 11, aliases: ['anjing'] },
          { text: 'Katak / Kodok', points: 6, aliases: ['kodok', 'katak'] },
        ],
      },
    ],
  },
  {
    id: 'bonus_2',
    title: 'Paket Top Survey 2',
    questions: [
      {
        id: 'bq2_1',
        question: 'Sebutkan buah yang sering dijadikan bahan rujak buah!',
        options: [
          { text: 'Mangga Muda', points: 47, aliases: ['mangga'] },
          { text: 'Bengkuang', points: 28, aliases: ['bengkoang'] },
          { text: 'Nanas', points: 15, aliases: ['nanas madu'] },
          { text: 'Kedondong', points: 10, aliases: ['kedondong'] },
        ],
      },
      {
        id: 'bq2_2',
        question: 'Berapa menit waktu rata-rata yang dihabiskan seseorang untuk mandi?',
        options: [
          { text: '15 Menit', points: 44, aliases: ['15'] },
          { text: '10 Menit', points: 32, aliases: ['10'] },
          { text: '20 Menit', points: 16, aliases: ['20'] },
          { text: '30 Menit', points: 8, aliases: ['30'] },
        ],
      },
      {
        id: 'bq2_3',
        question: 'Sebutkan kendaraan umum yang paling sering dinaiki saat bepergian di kota!',
        options: [
          { text: 'Ojek Online / Motor', points: 49, aliases: ['ojol', 'motor', 'ojek'] },
          { text: 'Kereta KRL / MRT', points: 25, aliases: ['krl', 'kereta', 'mrt'] },
          { text: 'Busway / Transjakarta', points: 17, aliases: ['bus', 'transjakarta', 'busway'] },
          { text: 'Angkot', points: 9, aliases: ['angkot', 'mikrolet'] },
        ],
      },
      {
        id: 'bq2_4',
        question: 'Selain rasa manis, rasa apa yang paling disukai pada makanan ringan?',
        options: [
          { text: 'Asin / Gurih', points: 58, aliases: ['gurih', 'asin'] },
          { text: 'Pedas', points: 30, aliases: ['pedas manis', 'hot'] },
          { text: 'Asam / Keju', points: 12, aliases: ['keju', 'asam'] },
        ],
      },
      {
        id: 'bq2_5',
        question: 'Sebutkan warna baju yang paling banyak dimiliki di dalam lemari!',
        options: [
          { text: 'Hitam', points: 56, aliases: ['warna hitam', 'black'] },
          { text: 'Putih', points: 27, aliases: ['warna putih', 'white'] },
          { text: 'Biru / Navy', points: 12, aliases: ['biru', 'navy'] },
          { text: 'Abu-abu', points: 5, aliases: ['abu', 'grey'] },
        ],
      },
    ],
  },
];

export function getCustomQuestions(): SurveyQuestion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('famili100_custom_questions');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveCustomQuestion(q: SurveyQuestion): SurveyQuestion[] {
  const existing = getCustomQuestions();
  const updated = [q, ...existing];
  if (typeof window !== 'undefined') {
    localStorage.setItem('famili100_custom_questions', JSON.stringify(updated));
  }
  return updated;
}
