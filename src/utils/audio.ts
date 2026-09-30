/**
 * Procedural Web Audio Synthesizer for Fantasy Match-3 Game
 * Zero external audio dependencies - 100% synthesized chimes, spells, and blasts.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private bgOsc1: OscillatorNode | null = null;
  private bgOsc2: OscillatorNode | null = null;
  private bgGain: GainNode | null = null;
  private bgInterval: number | null = null;

  constructor() {
    const savedSound = localStorage.getItem('runeveil_sound_fx');
    const savedMusic = localStorage.getItem('runeveil_music');
    if (savedSound !== null) this.soundEnabled = savedSound === 'true';
    if (savedMusic !== null) this.musicEnabled = savedMusic === 'true';
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(val?: boolean): boolean {
    this.soundEnabled = val !== undefined ? val : !this.soundEnabled;
    localStorage.setItem('runeveil_sound_fx', String(this.soundEnabled));
    return this.soundEnabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleMusic(val?: boolean): boolean {
    this.musicEnabled = val !== undefined ? val : !this.musicEnabled;
    localStorage.setItem('runeveil_music', String(this.musicEnabled));
    if (this.musicEnabled) {
      this.startAmbientMusic();
    } else {
      this.stopAmbientMusic();
    }
    return this.musicEnabled;
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  // --- Sound Effects ---

  public playGemSelect() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playGemSwap() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Arcane Progressive Lydian Scale (C5 to E6)
  private readonly ARCANE_SCALE = [
    523.25, // C5  (1.0x Base)
    587.33, // D5  (1.5x)
    659.25, // E5  (2.0x)
    739.99, // F#5 (2.5x Lydian arcane spark)
    783.99, // G5  (3.0x Fifth celestial)
    880.00, // A5  (3.5x Major 6th)
    987.77, // B5  (4.0x Major 7th astral)
    1046.50, // C6  (4.5x High octave)
    1174.66, // D6  (5.0x Godlike overdrive)
    1318.51  // E6  (Peak ascension)
  ];

  /**
   * Progressive Arcane Sound Trigger System:
   * Plays increasingly higher-pitched musical notes and harmonic arpeggios
   * as the combo multiplier increases, enhancing arcane acoustic feedback.
   */
  public playArcaneComboNote(multiplier: number = 1.0, cascadeCount: number = 1) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Calculate progressive scale index based on multiplier (1.0x to 5.0x+)
    // Each 0.5x multiplier advancement steps up 1 full scale degree
    const multStep = Math.max(0, Math.round((multiplier - 1.0) / 0.5));
    const cascadeOffset = Math.max(0, cascadeCount - 1);
    const scaleIndex = Math.min(this.ARCANE_SCALE.length - 1, multStep + cascadeOffset);
    const baseFreq = this.ARCANE_SCALE[scaleIndex];

    // Master gain for this note
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.24, now);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + (multiplier >= 3.0 ? 0.42 : 0.32));
    masterGain.connect(this.ctx.destination);

    // Filter to give that warm, magical acoustic resonance
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(baseFreq * 4, now);
    filter.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.3);
    filter.Q.setValueAtTime(3.5, now);
    filter.connect(masterGain);

    // Voice 1: Primary Pure Crystal Tone (Sine with micro pitch-glide down for sparkly strike)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq * 1.04, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.05);

    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.7, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(filter);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Voice 2: Arcane Fifth Harmonic (Triangle for warm bell chime)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now); // Perfect 5th

    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.4, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc2.connect(gain2);
    gain2.connect(filter);
    osc2.start(now);
    osc2.stop(now + 0.34);

    // Voice 3: Ethereal Shimmer Bell (High Octave Sparkle)
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(baseFreq * 2, now); // Octave

    const gain3 = this.ctx.createGain();
    gain3.gain.setValueAtTime(0.25, now);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc3.connect(gain3);
    gain3.connect(filter);
    osc3.start(now);
    osc3.stop(now + 0.24);

    // For High Multipliers (>= 2.5x), trigger an ascending second starlight chime note!
    if (multiplier >= 2.5) {
      const arpeggioTime = now + 0.07;
      const nextNoteFreq = this.ARCANE_SCALE[Math.min(this.ARCANE_SCALE.length - 1, scaleIndex + 1)];

      const arpOsc = this.ctx.createOscillator();
      arpOsc.type = 'sine';
      arpOsc.frequency.setValueAtTime(nextNoteFreq, arpeggioTime);

      const arpGain = this.ctx.createGain();
      arpGain.gain.setValueAtTime(0.18, arpeggioTime);
      arpGain.gain.exponentialRampToValueAtTime(0.001, arpeggioTime + 0.25);

      arpOsc.connect(arpGain);
      arpGain.connect(masterGain);
      arpOsc.start(arpeggioTime);
      arpOsc.stop(arpeggioTime + 0.26);
    }

    // For Ultra Multipliers (>= 4.0x Godlike Overdrive), trigger a third celestial chime note!
    if (multiplier >= 4.0) {
      const arpTime2 = now + 0.13;
      const thirdNoteFreq = this.ARCANE_SCALE[Math.min(this.ARCANE_SCALE.length - 1, scaleIndex + 2)];

      const arpOsc2 = this.ctx.createOscillator();
      arpOsc2.type = 'sine';
      arpOsc2.frequency.setValueAtTime(thirdNoteFreq, arpTime2);

      const arpGain2 = this.ctx.createGain();
      arpGain2.gain.setValueAtTime(0.15, arpTime2);
      arpGain2.gain.exponentialRampToValueAtTime(0.001, arpTime2 + 0.28);

      arpOsc2.connect(arpGain2);
      arpGain2.connect(masterGain);
      arpOsc2.start(arpTime2);
      arpOsc2.stop(arpTime2 + 0.3);
    }
  }

  public playMatch(comboCount: number = 1, multiplier: number = 1.0) {
    this.playArcaneComboNote(multiplier, comboCount);
  }

  public playComboEscalation(multiplier: number, cascadeCount: number = 1) {
    this.playArcaneComboNote(multiplier, cascadeCount);
  }

  public playCleaverBeam() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.35);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  public playBombExplosion() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sub rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.46);

    // Noise blast
    this.playNoiseBlast(0.3, 0.2);
  }

  public playSingularity() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  }

  public playBooster(type: 'meteor' | 'arcane_bolt' | 'chrono' | 'wand' | 'shuffle') {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (type) {
      case 'meteor':
        this.playBombExplosion();
        break;
      case 'arcane_bolt':
        this.playCleaverBeam();
        break;
      case 'chrono': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.41);
        break;
      }
      case 'wand':
      case 'shuffle': {
        this.playSingularity();
        break;
      }
    }
  }

  public playVictory() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [
      { freq: 523.25, time: 0.0 }, // C5
      { freq: 659.25, time: 0.12 }, // E5
      { freq: 783.99, time: 0.24 }, // G5
      { freq: 1046.5, time: 0.36 }, // C6
    ];

    chords.forEach(({ freq, time }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const start = now + time;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(start);
      osc.stop(start + 0.61);
    });
  }

  public playDefeat() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [
      { freq: 440, time: 0.0 }, // A4
      { freq: 415.3, time: 0.18 }, // G#4
      { freq: 392.0, time: 0.36 }, // G4
      { freq: 349.23, time: 0.54 }, // F4
    ];

    chords.forEach(({ freq, time }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const start = now + time;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(start);
      osc.stop(start + 0.41);
    });
  }

  private playNoiseBlast(duration: number, volume: number) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(this.ctx.currentTime);
  }

  // --- Ambient Music Loop ---

  private startAmbientMusic() {
    this.initCtx();
    if (!this.ctx) return;

    if (this.bgInterval) {
      clearInterval(this.bgInterval);
      this.bgInterval = null;
    }

    const chords = [
      [220, 261.63, 329.63, 392], // Am7
      [174.61, 220, 261.63, 329.63], // Fmaj7
      [261.63, 329.63, 392, 493.88], // Cmaj7
      [196, 246.94, 293.66, 392], // G
    ];
    let chordIdx = 0;

    const playChordStep = () => {
      if (!this.musicEnabled || !this.ctx) return;
      const currentChord = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      const now = this.ctx.currentTime;
      currentChord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 0.5, now); // low octave pad

        gain.gain.setValueAtTime(0.015, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + 4.0);
      });
    };

    playChordStep();
    this.bgInterval = window.setInterval(playChordStep, 4000);
  }

  private stopAmbientMusic() {
    if (this.bgInterval) {
      clearInterval(this.bgInterval);
      this.bgInterval = null;
    }
  }
}

export const soundEngine = new SoundEngine();
