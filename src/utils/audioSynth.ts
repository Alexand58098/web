// Web Audio API Synthesizer for 80s Synthwave Radio & Vice City Sound Effects

class ViceAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private radioOsc: OscillatorNode | null = null;
  private radioGain: GainNode | null = null;
  private radioPlaying: boolean = false;
  private radioInterval: number | null = null;
  private currentStationId: string = 'flash-fm';

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.radioGain) {
      this.radioGain.gain.value = muted ? 0 : 0.22;
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Gunshot Sound
  public playGunshot(type: 'pistol' | 'uzi' | 'shotgun' | 'rpg' = 'pistol') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Noise buffer for blast punch
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'rpg' ? 800 : 2500, t);
    filter.frequency.exponentialRampToValueAtTime(100, t + 0.15);

    noise.connect(filter);
    filter.connect(gain);

    // Sub thump
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(type === 'rpg' ? 120 : 220, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
    osc.connect(gain);

    gain.connect(this.ctx.destination);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + (type === 'rpg' ? 0.35 : 0.15));

    osc.start(t);
    noise.start(t);
    osc.stop(t + 0.2);
    noise.stop(t + 0.2);
  }

  // Explosion
  public playExplosion() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(80, t + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.6);
  }

  // Police Siren
  public playSiren(durationMs: number = 2000) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // Classic wail
    const duration = durationMs / 1000;
    for (let i = 0; i < duration; i += 0.8) {
      osc.frequency.setValueAtTime(650, t + i);
      osc.frequency.linearRampToValueAtTime(950, t + i + 0.4);
      osc.frequency.linearRampToValueAtTime(650, t + i + 0.8);
    }

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + duration);
  }

  // Car Engine rev
  public playEngineRev(speedRatio: number = 0.5) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const baseFreq = 65 + speedRatio * 180;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 40, t + 0.1);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  // Skid / Drift screeeeech
  public playTireSkid() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.linearRampToValueAtTime(700, t + 0.15);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Retro Cheat Activation Chime (Iconic GTA sound)
  public playCheatActivated() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  // Mission Completed Jingle
  public playMissionPass() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const chords = [
      { notes: [440, 554.37, 659.25], time: 0 },
      { notes: [493.88, 622.25, 739.99], time: 0.2 },
      { notes: [554.37, 698.46, 830.61], time: 0.4 },
      { notes: [659.25, 830.61, 987.77], time: 0.7 },
    ];

    chords.forEach(({ notes, time }) => {
      notes.forEach((freq) => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime + time;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.4);
      });
    });
  }

  // Vice City 80s Synth Radio Loop
  public startRadio(stationId: string = 'flash-fm') {
    this.init();
    if (!this.ctx) return;
    this.stopRadio();
    this.currentStationId = stationId;
    this.radioPlaying = true;

    // Station sound profiles:
    // flash-fm: Upbeat 80s pop synth
    // v-rock: Distorted bassline guitar riffs
    // wave-103: New wave dark synth chords
    // emotion: Melodic slow synth ballad
    // wildstyle: Electro funky groove bass

    const stationChords: Record<string, number[][]> = {
      'flash-fm': [
        [261.63, 329.63, 392.00], // C
        [349.23, 440.00, 523.25], // F
        [392.00, 493.88, 587.33], // G
        [440.00, 523.25, 659.25], // Am
      ],
      'wave-103': [
        [220.00, 261.63, 329.63], // Am
        [174.61, 220.00, 261.63], // F
        [196.00, 246.94, 293.66], // G
        [164.81, 196.00, 246.94], // Em
      ],
      'v-rock': [
        [146.83, 220.00, 293.66], // D5 power chord
        [130.81, 196.00, 261.63], // C5
        [174.61, 261.63, 349.23], // F5
        [196.00, 293.66, 392.00], // G5
      ],
      'emotion-98': [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ],
    };

    const chords = stationChords[stationId] || stationChords['flash-fm'];
    let chordIdx = 0;

    const playChordStep = () => {
      if (!this.radioPlaying || !this.ctx) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      const t = this.ctx.currentTime;
      currentChord.forEach((freq, noteIdx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = stationId === 'v-rock' ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, t + noteIdx * 0.05);

        const volume = this.isMuted ? 0 : 0.06;
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + noteIdx * 0.05);
        osc.stop(t + 0.9);
      });

      // Bass punch
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(currentChord[0] / 2, t);
      bassGain.gain.setValueAtTime(this.isMuted ? 0 : 0.1, t);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);

      bassOsc.start(t);
      bassOsc.stop(t + 0.45);
    };

    playChordStep();
    this.radioInterval = window.setInterval(playChordStep, 950);
  }

  public stopRadio() {
    this.radioPlaying = false;
    if (this.radioInterval) {
      clearInterval(this.radioInterval);
      this.radioInterval = null;
    }
  }

  public isRadioPlaying() {
    return this.radioPlaying;
  }
}

export const viceAudio = new ViceAudioEngine();
