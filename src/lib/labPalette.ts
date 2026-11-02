// Colors for Canvas, JSXGraph and Three.js, which cannot use CSS variables directly.
// Reads the laboratory tokens from globals.css so every renderer follows the active theme.

export interface LabPalette {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  border: string;
  grid: string;
  axis: string;
  label: string;
  accent: string;
  danger: string;
  success: string;
  series: string[];
}

const LIGHT: LabPalette = {
  bg: '#f5f7f7',
  surface: '#ffffff',
  ink: '#243c40',
  muted: '#536b6f',
  border: '#c7d3d5',
  grid: '#dce3e5',
  axis: '#819398',
  label: '#536b6f',
  accent: '#176668',
  danger: '#b0302a',
  success: '#2e7350',
  series: ['#176668', '#b5562f', '#3f5fa8', '#8a6a10', '#7a4e8c', '#2e7350'],
};

function readVar(styles: CSSStyleDeclaration, name: string, fallback: string): string {
  const value = styles.getPropertyValue(name).trim();
  return value || fallback;
}

export function getLabPalette(): LabPalette {
  if (typeof window === 'undefined') return LIGHT;
  const s = getComputedStyle(document.documentElement);
  return {
    bg: readVar(s, '--bg', LIGHT.bg),
    surface: readVar(s, '--plot-bg', LIGHT.surface),
    ink: readVar(s, '--text-primary', LIGHT.ink),
    muted: readVar(s, '--text-secondary', LIGHT.muted),
    border: readVar(s, '--border', LIGHT.border),
    grid: readVar(s, '--plot-grid', LIGHT.grid),
    axis: readVar(s, '--plot-axis', LIGHT.axis),
    label: readVar(s, '--plot-label', LIGHT.label),
    accent: readVar(s, '--primary', LIGHT.accent),
    danger: readVar(s, '--accent-rose', LIGHT.danger),
    success: readVar(s, '--accent-emerald', LIGHT.success),
    series: [1, 2, 3, 4, 5, 6].map((i) => readVar(s, `--chart-${i}`, LIGHT.series[i - 1])),
  };
}

/** '#176668' -> 0x176668 for Three.js */
export function hexToNumber(hex: string): number {
  return parseInt(hex.replace('#', '').slice(0, 6), 16);
}

/** Adds alpha to a #rrggbb color for Canvas fills. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Honours the in-app Animations setting (data-motion on <html>), falling back to the OS preference. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  const attr = document.documentElement.getAttribute('data-motion');
  return attr ? attr === 'reduce' : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
