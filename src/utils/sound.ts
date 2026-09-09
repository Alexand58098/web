/**
 * High quality kitchen bell chime synthesized using Web Audio API
 */
export function playKitchenChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play a dual-tone gentle Tibetan kitchen singing bell
    const now = ctx.currentTime;

    const playTone = (freq: number, delay: number, duration: number, gainVal: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(gainVal, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + duration);
    };

    // Resonant harmonic chime sequence
    playTone(880, 0, 1.2, 0.25);      // A5
    playTone(1320, 0.05, 1.4, 0.18);  // E6
    playTone(1760, 0.12, 1.6, 0.12);  // A6
    playTone(1046.5, 0.4, 1.5, 0.22); // C6
    playTone(1567.98, 0.45, 1.8, 0.15);// G6
  } catch (err) {
    console.warn('Audio playback not supported or user has not interacted yet', err);
  }
}
