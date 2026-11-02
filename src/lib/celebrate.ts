import confetti from 'canvas-confetti';
import { getLabPalette } from './labPalette';

/** Short, restrained celebration in laboratory colors; skipped when the user prefers reduced motion. */
export function labConfetti(particleCount = 70) {
  try {
    confetti({
      particleCount,
      spread: 60,
      origin: { y: 0.65 },
      colors: getLabPalette().series.slice(0, 4),
      disableForReducedMotion: true,
      ticks: 120,
    });
  } catch (e) {}
}
