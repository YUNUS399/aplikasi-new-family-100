// Web Audio API sound synthesizer for authentic game show audio effects

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;

  constructor() {
    // Check localStorage for mute preference
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('famili100_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('famili100_muted', String(this.isMuted));
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // 1. Correct Answer Ding-Dong Chime (Ting-nong!)
  public playCorrect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const gainNode = this.ctx.createGain();
    gainNode.connect(this.ctx.destination);
    gainNode.gain.setValueAtTime(this.volume * 0.4, now);

    // First note: High chime (C6 = 1046.5Hz)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1046.5, now);
    osc1.connect(gainNode);

    // Second note: Higher chime (G6 = 1567.98Hz)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1567.98, now + 0.12);
    osc2.connect(gainNode);

    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.exponentialRampToValueAtTime(this.volume * 0.5, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.1, now + 0.12);
    gainNode.gain.exponentialRampToValueAtTime(this.volume * 0.6, now + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc1.start(now);
    osc1.stop(now + 0.3);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.7);
  }

  // 2. Strike Buzzer (Iconic harsh buzz "BZZZT!")
  public playStrike() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sawtooth';
    // Classic harsh game show frequency pair
    osc.frequency.setValueAtTime(130.81, now); // C3
    osc.frequency.linearRampToValueAtTime(116.54, now + 0.35); // Bb2 drop

    gainNode.gain.setValueAtTime(this.volume * 0.45, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // 3. Triple Strike ("Wah-wah-wah" fail sequence)
  public playTripleStrike() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const tones = [164.81, 155.56, 146.83, 130.81]; // E3, Eb3, D3, C3
    tones.forEach((freq, index) => {
      const startTime = this.ctx!.currentTime + index * 0.22;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      if (index === 3) {
        osc.frequency.linearRampToValueAtTime(freq - 15, startTime + 0.6);
      }

      gain.gain.setValueAtTime(this.volume * 0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + (index === 3 ? 0.7 : 0.2));

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + (index === 3 ? 0.7 : 0.2));
    });
  }

  // 4. Face-off Buzzer Press (Bel Rebutan)
  public playBuzzer() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now); // A4
    osc.frequency.linearRampToValueAtTime(880, now + 0.05);

    gainNode.gain.setValueAtTime(this.volume * 0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 5. Timer Tick for Fast Money / Bonus Round
  public playTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gainNode.gain.setValueAtTime(this.volume * 0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // 6. Time's Up Gong
  public playGong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 1.2);

    gainNode.gain.setValueAtTime(this.volume * 0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.5);
  }

  // 7. Slat Flip (Mechanical click)
  public playFlip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // 8. Winning Fanfare / Crowd Applause Synth
  public playFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.15 }, // G5
      { f: 1046.5, d: 0.5 },  // C6
    ];

    let offset = 0;
    notes.forEach((note) => {
      const startTime = this.ctx!.currentTime + offset;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, startTime);

      gain.gain.setValueAtTime(this.volume * 0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + note.d);

      offset += note.d * 0.9;
    });
  }
}

export const sound = new SoundManager();
