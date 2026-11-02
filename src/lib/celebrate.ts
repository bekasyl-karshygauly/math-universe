import confetti from 'canvas-confetti';
import { getLabPalette, prefersReducedMotion } from './labPalette';

/** Short, restrained celebration in laboratory colors; skipped when animations are reduced. */
export function labConfetti(particleCount = 70) {
  if (prefersReducedMotion()) return;
  try {
    confetti({
      particleCount,
      spread: 60,
      origin: { y: 0.65 },
      colors: getLabPalette().series.slice(0, 4),
      ticks: 120,
    });
  } catch (e) {}
}
