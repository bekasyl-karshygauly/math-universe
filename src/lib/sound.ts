// Procedural Web Audio API sound effects (no external audio files required)

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('mu_sound_enabled');
  return stored !== null ? stored === 'true' : true;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('mu_sound_enabled', String(enabled));
  }
}

// Gentle UI click sound
export function playClickSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // Ignore audio restrictions
  }
}

// Dynamic snappy sound for fast transitions and tactile buttons
export function playDynamicSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (e) {
    // Ignore
  }
}

// Smooth resonant sound for fluid animations, tabs, and step transitions
export function playSmoothSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle upward swell
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.14);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (e) {
    // Ignore
  }
}

// Ascending musical tones as the user advances through mathematical derivation steps
const STEP_FREQUENCIES = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]; // C5, D5, E5, G5, A5, C6
export function playStepSound(stepIndex: number = 0) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const freq = STEP_FREQUENCIES[stepIndex % STEP_FREQUENCIES.length];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (e) {
    // Ignore
  }
}

// Modal open sound — two-tone smooth chord swell
export function playModalOpenSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    [440, 659.25].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.04);

      gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.04 + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.04);
      osc.stop(ctx.currentTime + i * 0.04 + 0.22);
    });
  } catch (e) {
    // Ignore
  }
}

// Modal close sound — soft descending tone
export function playModalCloseSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    // Ignore
  }
}

// Visual experiment morph shimmer
export function playVisualMorphSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(780, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore
  }
}

// Pleasant chord success sound
export function playSuccessSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.06);

      gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.06 + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.06);
      osc.stop(ctx.currentTime + i * 0.06 + 0.28);
    });
  } catch (e) {
    // Ignore
  }
}

// Fanfare / victory sound for high score or course completion
export function playFanfareSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [
      { f: 523.25, t: 0, d: 0.12 },    // C5
      { f: 659.25, t: 0.12, d: 0.12 }, // E5
      { f: 783.99, t: 0.24, d: 0.12 }, // G5
      { f: 1046.5, t: 0.36, d: 0.35 }, // C6
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.t);

      gain.gain.setValueAtTime(0.12, ctx.currentTime + n.t);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + n.t + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + n.t);
      osc.stop(ctx.currentTime + n.t + n.d);
    });
  } catch (e) {
    // Ignore
  }
}
