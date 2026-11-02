'use client';

import React, { useId, useState } from 'react';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { fmt } from '../data/i18n-lab';

// Plot geometry: x ∈ [-2.5, 2.5] at 80 px per unit, 32 px per unit of y
const W = 400;
const H = 300;
const OX = 200;
const UX = 80;
const UY = 32;

function parabolaPath(a: number, oy: number): string {
  let d = '';
  for (let i = 0; i <= 200; i++) {
    const x = (i - 100) / 40;
    const px = OX + x * UX;
    // Clamp far outside the viewport so huge values do not break the path
    const py = Math.max(-1000, Math.min(1300, oy - a * x * x * UY));
    d += `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  return d;
}

/** The home-page experiment: y = ax² with a native range input and a written observation. */
export function LabExperiment({ lang }: { lang: Language }) {
  const t = (k: string) => I18N[lang][k] || k;
  const [a, setA] = useState(1);
  const sliderId = useId();
  const noteId = useId();
  const patternId = useId().replace(/:/g, '');

  // Keep the vertex visible: origin near the bottom for a ≥ 0, near the top for a < 0
  const oy = a < 0 ? 40 : 260;
  const aLabel = a.toFixed(1);

  const notes: string[] = [];
  if (a === 0) notes.push(t('exp_note_zero'));
  else {
    if (a < 0) notes.push(t('exp_note_down'));
    const abs = Math.abs(a);
    notes.push(abs > 1 ? t('exp_note_narrow') : abs < 1 ? t('exp_note_wide') : t('exp_note_same'));
    notes.push(t('exp_note_vertex'));
  }

  return (
    <figure className="panel panel--instrument lab-experiment" aria-labelledby={`${noteId}-cap`}>
      <div className="panel__top">
        <span id={`${noteId}-cap`}>{t('exp_label')}</span>
        <span className="mono" style={{ textTransform: 'none', letterSpacing: 0 }}>
          f(x) = {aLabel}x²
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={fmt(t('exp_aria'), { a: aLabel })} className="lab-experiment__plot">
        <defs>
          <pattern id={patternId} width="40" height="32" patternUnits="userSpaceOnUse" y={oy % 32}>
            <path d="M40 0H0V32" fill="none" style={{ stroke: 'var(--plot-grid)' }} />
          </pattern>
        </defs>
        <rect width={W} height={H} style={{ fill: 'var(--plot-bg)' }} />
        <rect width={W} height={H} fill={`url(#${patternId})`} />
        <g style={{ stroke: 'var(--plot-axis)' }} fill="none">
          <path d={`M${OX} 0V${H}`} />
          <path d={`M0 ${oy}H${W}`} />
        </g>
        {/* Reference curve y = x² */}
        <path d={parabolaPath(1, oy)} fill="none" strokeWidth="1.5" strokeDasharray="5 5" style={{ stroke: 'var(--plot-axis)' }} opacity={a === 1 ? 0 : 0.9} />
        <path d={parabolaPath(a, oy)} fill="none" strokeWidth="3" strokeLinejoin="round" style={{ stroke: 'var(--chart-1)' }} />
        <g fontSize="12" style={{ fill: 'var(--plot-label)' }} fontFamily="var(--font-ui)">
          <text x={OX + 8} y={a < 0 ? oy - 8 : oy + 18}>0</text>
          <text x={W - 16} y={a < 0 ? oy - 8 : oy + 18}>x</text>
          <text x={OX + 10} y={17}>y</text>
          {a !== 1 && (
            <text x={OX + 1.55 * UX + 6} y={oy - 1.55 * 1.55 * UY - 4}>
              y = x²
            </text>
          )}
        </g>
      </svg>

      <div className="lab-experiment__control">
        <label htmlFor={sliderId}>{t('exp_coef')}</label>
        <output htmlFor={sliderId} className="mono">
          {aLabel}
        </output>
        <input
          id={sliderId}
          type="range"
          min={-2}
          max={2}
          step={0.1}
          value={a}
          aria-describedby={noteId}
          aria-valuetext={`a = ${aLabel}`}
          onChange={(e) => setA(Math.round(Number(e.target.value) * 10) / 10)}
        />
      </div>
      <figcaption id={noteId} className="lab-experiment__note" aria-live="polite">
        {notes.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </figcaption>
    </figure>
  );
}
