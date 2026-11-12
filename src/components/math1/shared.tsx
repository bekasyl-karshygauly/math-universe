'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import { Check, X as XIcon } from 'lucide-react';
import { renderLatexInHtml } from '../MathRenderer';
import { I18N } from '../../data/i18n';
import { Language } from '../../lib/storage';
import { Frac, answerMatches } from '../../lib/linalg';

export const useT = (lang: Language) => (k: string) => I18N[lang][k] || k;

/** Inline text with $…$ formulas (trusted static course content). */
export function MathText({ text, as: Tag = 'span', className }: { text: string; as?: 'span' | 'p' | 'div'; className?: string }) {
  const html = useMemo(() => renderLatexInHtml(text), [text]);
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Display formula; wide formulas scroll horizontally instead of overflowing the page. */
export function TexBlock({ tex, className = '' }: { tex: string; className?: string }) {
  const html = useMemo(() => katex.renderToString(tex, { displayMode: true, throwOnError: false }), [tex]);
  return <div className={`scroll-x m1-tex ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Inline formula. */
export function Tex({ tex }: { tex: string }) {
  const html = useMemo(() => katex.renderToString(tex, { displayMode: false, throwOnError: false }), [tex]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export type CellStatus = boolean | null;

export const emptyGrid = (rows: number, cols: number): string[][] => Array.from({ length: rows }, () => Array(cols).fill(''));

/** Compares typed matrix cells with the exact answer. */
export function checkGrid(values: string[][], expected: Frac[][]): { status: CellStatus[][]; ok: boolean; complete: boolean } {
  let ok = true;
  let complete = true;
  const status = expected.map((row, i) =>
    row.map((v, j) => {
      const raw = values[i]?.[j] ?? '';
      if (!raw.trim()) {
        complete = false;
        ok = false;
        return null;
      }
      const good = answerMatches(raw, v);
      if (!good) ok = false;
      return good;
    })
  );
  return { status, ok, complete };
}

interface MatrixInputProps {
  values: string[][];
  onChange: (values: string[][]) => void;
  status?: CellStatus[][] | null;
  label: string;
  /** Prefix shown before the matrix, e.g. "AB =" */
  prefix?: string;
}

/** Grid of answer cells between round brackets. Accepts integers, fractions (−2/5) and decimals. */
export function MatrixInput({ values, onChange, status, label, prefix }: MatrixInputProps) {
  const cols = values[0]?.length ?? 0;
  return (
    <div className="m1-matrix" role="group" aria-label={label}>
      {prefix && (
        <span className="m1-matrix__prefix">
          <Tex tex={prefix} />
        </span>
      )}
      <span className="m1-matrix__bracket m1-matrix__bracket--l" aria-hidden="true" />
      <div className="m1-matrix__grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(52px, 72px))` }}>
        {values.map((row, i) =>
          row.map((v, j) => {
            const st = status?.[i]?.[j];
            return (
              <input
                key={`${i}-${j}`}
                className={`field-input field-input--mono m1-cell${st === true ? ' m1-cell--ok' : ''}`}
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                aria-label={`${label}: ${i + 1}, ${j + 1}`}
                aria-invalid={st === false ? true : undefined}
                value={v}
                onChange={(e) => {
                  const next = values.map((r) => r.slice());
                  next[i][j] = e.target.value;
                  onChange(next);
                }}
              />
            );
          })
        )}
      </div>
      <span className="m1-matrix__bracket m1-matrix__bracket--r" aria-hidden="true" />
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  /** LaTeX label, e.g. "M_{42}" */
  tex?: string;
  value: string;
  onChange: (v: string) => void;
  status?: CellStatus;
}

export function NumberField({ label, tex, value, onChange, status }: NumberFieldProps) {
  return (
    <label className="m1-num">
      <span className="m1-num__label">{tex ? <Tex tex={tex + ' ='} /> : label}</span>
      <input
        className={`field-input field-input--mono m1-cell${status === true ? ' m1-cell--ok' : ''}`}
        aria-label={label}
        aria-invalid={status === false ? true : undefined}
        inputMode="text"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {status === true && <Check size={16} className="m1-num__mark m1-num__mark--ok" aria-hidden="true" />}
      {status === false && <XIcon size={16} className="m1-num__mark m1-num__mark--bad" aria-hidden="true" />}
    </label>
  );
}

/** Result line under a checked answer: text + icon, never colour alone. */
export function Verdict({ ok, complete, lang }: { ok: boolean; complete: boolean; lang: Language }) {
  const t = useT(lang);
  if (!complete && !ok) return <p role="status" className="status status--warning m1-verdict">{t('m1_fill_all')}</p>;
  return ok ? (
    <p role="status" className="status status--success m1-verdict">
      <Check size={16} aria-hidden="true" /> {t('m1_correct')}
    </p>
  ) : (
    <p role="status" className="status status--danger m1-verdict">
      <XIcon size={16} aria-hidden="true" /> {t('m1_wrong_cells')}
    </p>
  );
}

/** Deterministic-per-mount shuffle of option indices. */
export function shuffledIndices(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
