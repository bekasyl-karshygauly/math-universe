'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { KaTeXMath } from './KaTeXMath';
import { playClickSound, playSuccessSound } from '../lib/sound';

const QUICK_CHIPS = [
  { label: 'a/b', insert: '\\frac{a}{b}' },
  { label: '√x', insert: '\\sqrt{x}' },
  { label: 'xⁿ', insert: 'x^{n}' },
  { label: '∫ f(x)dx', insert: '\\int_{a}^{b} f(x) \\, dx' },
  { label: '∑ aₙ', insert: '\\sum_{i=1}^{n} a_i' },
  { label: 'lim', insert: '\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1' },
  { label: 'Матрица 2×2', insert: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { label: 'Система {', insert: '\\begin{cases} 2x + y = 5 \\\\ x - 3y = 6 \\end{cases}' },
  { label: 'α', insert: '\\alpha' },
  { label: 'β', insert: '\\beta' },
  { label: 'π', insert: '\\pi' },
  { label: 'θ', insert: '\\theta' },
  { label: '∞', insert: '\\infty' },
  { label: '±', insert: '\\pm' },
  { label: '≠', insert: '\\neq' },
  { label: '≤', insert: '\\le' },
  { label: '≥', insert: '\\ge' },
];

export function LaTeXPlayground() {
  const [latex, setLatex] = useState<string>('f(x) = \\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}');
  const [copied, setCopied] = useState<boolean>(false);

  const handleInsert = (txt: string) => {
    setLatex((prev) => (prev ? `${prev} + ${txt}` : txt));
    playClickSound();
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(latex);
      setCopied(true);
      playSuccessSound();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <h2 className="calc-panel__title" style={{ marginBottom: 0 }}>
          Песочница LaTeX
        </h2>
        <button type="button" className="btn btn--secondary btn--sm" onClick={handleCopy} aria-live="polite">
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copied ? 'Скопировано' : 'Копировать код'}
        </button>
      </div>

      {/* Quick insertion chips */}
      <div className="solver-examples" style={{ marginBottom: '16px', marginTop: 0 }}>
        {QUICK_CHIPS.map((chip) => (
          <button key={chip.label} type="button" className="chip mono" onClick={() => handleInsert(chip.insert)}>
            + {chip.label}
          </button>
        ))}
      </div>

      <label className="field-label" htmlFor="latex-source" style={{ marginBottom: '6px' }}>
        LaTeX
      </label>
      <textarea
        id="latex-source"
        className="field-input field-input--mono"
        value={latex}
        onChange={(e) => setLatex(e.target.value)}
        placeholder="\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
        rows={3}
        spellCheck={false}
        style={{ minHeight: '96px', marginBottom: '20px' }}
      />

      <p className="eyebrow eyebrow--muted" style={{ marginBottom: '8px' }}>
        KaTeX
      </p>
      <div className="latex-preview" aria-live="polite">
        <KaTeXMath math={latex || 'y = f(x)'} block />
      </div>
    </div>
  );
}
