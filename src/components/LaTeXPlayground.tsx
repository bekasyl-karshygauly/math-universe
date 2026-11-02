'use client';

import React, { useState } from 'react';
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
    <div style={{ padding: '24px', borderRadius: '20px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '19px', fontWeight: 800 }}>⚡ Интерактивная песочница LaTeX</h3>
        <button
          onClick={handleCopy}
          style={{
            padding: '7px 16px',
            borderRadius: '9px',
            background: copied ? 'var(--accent-emerald)' : 'var(--surface-secondary)',
            color: copied ? '#fff' : 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {copied ? '✓ Скопировано!' : '📋 Копировать код'}
        </button>
      </div>

      {/* Quick insertion chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip.label}
            onClick={() => handleInsert(chip.insert)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
          >
            + {chip.label}
          </button>
        ))}
      </div>

      {/* Input textarea */}
      <textarea
        value={latex}
        onChange={(e) => setLatex(e.target.value)}
        placeholder="Введите код формулы в формате LaTeX (например, \frac{-b \pm \sqrt{b^2 - 4ac}}{2a})..."
        rows={3}
        style={{
          width: '100%',
          padding: '14px 18px',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          background: 'var(--surface-secondary)',
          color: 'var(--text-primary)',
          fontSize: '14.5px',
          fontFamily: 'var(--font-mono)',
          outline: 'none',
          resize: 'vertical',
          marginBottom: '20px',
        }}
      />

      {/* Live Preview Box */}
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px' }}>
        ЖИВОЙ ПРЕДПРОСМОТР (KaTeX):
      </div>
      <div
        style={{
          padding: '28px',
          borderRadius: '14px',
          background: 'var(--surface-secondary)',
          border: '1px solid var(--border)',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)',
          overflowX: 'auto',
        }}
      >
        <KaTeXMath math={latex || 'y = f(x)'} block />
      </div>
    </div>
  );
}
