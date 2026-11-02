// Motion tokens shared by Motion components, canvases and tweens (CSS mirrors them as --dur-*).

export const EASE = [0.2, 0, 0, 1] as const;

export const DUR = {
  press: 0.1,
  hover: 0.16,
  state: 0.22,
  reveal: 0.28,
  draw: 0.55,
} as const;

/** Standard view/panel transition: short rise + fade, used for sections and tab panels. */
export const panelVariants = (reduce: boolean) => ({
  initial: { opacity: 0, y: reduce ? 0 : 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: reduce ? 0 : -6 },
  transition: { duration: reduce ? 0 : DUR.state, ease: EASE },
});

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Time-based tween driven by requestAnimationFrame. Returns a cancel function;
 * starting a new tween should cancel the previous one so the latest input wins.
 */
export function tween(duration: number, onFrame: (t: number) => void, onDone?: () => void): () => void {
  let id = 0;
  let cancelled = false;
  const start = performance.now();
  const step = (now: number) => {
    if (cancelled) return;
    const t = Math.min(1, (now - start) / (duration * 1000));
    onFrame(t);
    if (t < 1) id = requestAnimationFrame(step);
    else onDone?.();
  };
  id = requestAnimationFrame(step);
  return () => {
    cancelled = true;
    cancelAnimationFrame(id);
  };
}
