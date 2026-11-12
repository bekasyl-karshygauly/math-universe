'use client';

import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, SkipForward } from 'lucide-react';
import { Language } from '../../lib/storage';
import { Frac, FMatrix, toF, mul, det, gaussSteps, opTex, randMatrix, randSystem } from '../../lib/linalg';
import { Tex, TexBlock, useT } from './shared';
import { VisualId } from '../../data/math1';
import { GeometryLab } from './GeometryLab';

function Panel({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <section className="panel panel--instrument m1-visual" aria-label={title}>
      <div className="panel__top">
        <span>{sub}</span>
        <span>{title}</span>
      </div>
      {children}
    </section>
  );
}

/** Plain numeric grid with highlight classes per cell. */
function Grid({ m, cellClass, onCell, label }: { m: FMatrix; cellClass: (i: number, j: number) => string; onCell?: (i: number, j: number) => void; label: string }) {
  return (
    <div className="m1-grid" role={onCell ? 'group' : undefined} aria-label={label}>
      <span className="m1-matrix__bracket m1-matrix__bracket--l" aria-hidden="true" />
      <div className="m1-grid__cells" style={{ gridTemplateColumns: `repeat(${m[0].length}, minmax(40px, auto))` }}>
        {m.map((row, i) =>
          row.map((x, j) =>
            onCell ? (
              <button
                key={`${i}-${j}`}
                type="button"
                className={`m1-grid__cell m1-grid__cell--btn ${cellClass(i, j)}`}
                onClick={() => onCell(i, j)}
                onMouseEnter={() => onCell(i, j)}
                onFocus={() => onCell(i, j)}
                aria-label={`c${i + 1}${j + 1} = ${x.toString()}`}
              >
                <Tex tex={x.toTex()} />
              </button>
            ) : (
              <span key={`${i}-${j}`} className={`m1-grid__cell ${cellClass(i, j)}`}>
                <Tex tex={x.toTex()} />
              </span>
            )
          )
        )}
      </div>
      <span className="m1-matrix__bracket m1-matrix__bracket--r" aria-hidden="true" />
    </div>
  );
}

// ───────────────────────── Row × column ─────────────────────────

export function MatrixProductVisual({ lang }: { lang: Language }) {
  const t = useT(lang);
  const [A, setA] = useState<FMatrix>(() => toF([[3, 5, 7], [-4, 2, 3]]));
  const [B, setB] = useState<FMatrix>(() => toF([[3, 2], [5, 3], [-1, 4]]));
  const [sel, setSel] = useState<[number, number]>([0, 0]);
  const C = useMemo(() => mul(A, B), [A, B]);
  const [i, j] = sel;

  const expr = A[i].map((a, k) => `${paren(a)}\\cdot ${paren(B[k][j])}`).join(' + ');

  return (
    <Panel title={t('m1_vis_product')} sub={t('lesson_interactive')}>
      <p className="field-help">{t('m1_vis_product_help')}</p>
      <div className="m1-product">
        <div className="m1-product__item">
          <span className="m1-product__name">A</span>
          <Grid m={A} label="A" cellClass={(r) => (r === i ? 'is-row' : '')} />
        </div>
        <span className="m1-product__op" aria-hidden="true">·</span>
        <div className="m1-product__item">
          <span className="m1-product__name">B</span>
          <Grid m={B} label="B" cellClass={(_, c) => (c === j ? 'is-col' : '')} />
        </div>
        <span className="m1-product__op" aria-hidden="true">=</span>
        <div className="m1-product__item">
          <span className="m1-product__name">C</span>
          <Grid m={C} label="C = A·B" cellClass={(r, c) => (r === i && c === j ? 'is-target' : '')} onCell={(r, c) => setSel([r, c])} />
        </div>
      </div>
      <TexBlock tex={`c_{${i + 1}${j + 1}} = ${expr} = ${C[i][j].toTex()}`} />
      <div className="m1-visual__controls">
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          onClick={() => {
            const rows = 2 + Math.round(Math.random());
            const inner = 2 + Math.round(Math.random());
            const cols = 2 + Math.round(Math.random());
            setA(randMatrix(rows, inner, -4, 6));
            setB(randMatrix(inner, cols, -4, 6));
            setSel([0, 0]);
          }}
        >
          <Shuffle size={15} aria-hidden="true" /> {t('m1_new_matrices')}
        </button>
      </div>
    </Panel>
  );
}

const paren = (x: Frac) => (x.n < 0 ? `(${x.toTex()})` : x.toTex());

// ───────────────────────── Rule of triangles (Sarrus) ─────────────────────────

const SARRUS_TERMS: { cells: [number, number][]; sign: 1 | -1 }[] = [
  { cells: [[0, 0], [1, 1], [2, 2]], sign: 1 },
  { cells: [[0, 1], [1, 2], [2, 0]], sign: 1 },
  { cells: [[0, 2], [1, 0], [2, 1]], sign: 1 },
  { cells: [[0, 2], [1, 1], [2, 0]], sign: -1 },
  { cells: [[0, 1], [1, 0], [2, 2]], sign: -1 },
  { cells: [[0, 0], [1, 2], [2, 1]], sign: -1 },
];

export function SarrusVisual({ lang }: { lang: Language }) {
  const t = useT(lang);
  const [M, setM] = useState<FMatrix>(() => toF([[1, 2, -1], [0, -1, 1], [2, 0, 1]]));
  const [step, setStep] = useState(1);

  const values = SARRUS_TERMS.map((term) => term.cells.reduce((p, [r, c]) => p.mul(M[r][c]), new Frac(term.sign)));
  const shown = values.slice(0, step);
  const running = shown.reduce((s, v) => s.add(v), new Frac(0));
  const cur = SARRUS_TERMS[step - 1];

  const cellClass = (r: number, c: number) => {
    if (!cur) return '';
    const k = cur.cells.findIndex(([a, b]) => a === r && b === c);
    if (k < 0) return '';
    return cur.sign > 0 ? 'is-plus' : 'is-minus';
  };

  const termTex = (k: number) => {
    const term = SARRUS_TERMS[k];
    const prod = term.cells.map(([r, c]) => paren(M[r][c])).join('\\cdot ');
    return `${term.sign > 0 ? '+' : '-'}\\,${prod}`;
  };

  return (
    <Panel title={t('m1_vis_sarrus')} sub={t('lesson_interactive')}>
      <p className="field-help">{t('m1_vis_sarrus_help')}</p>
      <div className="m1-sarrus">
        <Grid m={M} label="A" cellClass={cellClass} />
        <ol className="m1-sarrus__terms">
          {SARRUS_TERMS.map((term, k) => (
            <li key={k} className={`m1-sarrus__term${k < step ? ' is-shown' : ''}${k === step - 1 ? ' is-current' : ''} ${term.sign > 0 ? 'is-plus' : 'is-minus'}`}>
              <span className="mono">{k + 1}</span>
              <Tex tex={`${termTex(k)} = ${values[k].toTex()}`} />
            </li>
          ))}
        </ol>
      </div>
      <p className="m1-sarrus__total" aria-live="polite">
        {step < 6 ? t('m1_running_sum') : t('m1_determinant')}: <Tex tex={`${step < 6 ? '' : '\\Delta = '}${running.toTex()}`} />
      </p>
      <div className="m1-visual__controls">
        <button type="button" className="btn btn--secondary btn--sm" disabled={step <= 1} onClick={() => setStep(step - 1)}>
          <ChevronLeft size={15} aria-hidden="true" /> {t('m1_prev')}
        </button>
        <button type="button" className="btn btn--primary btn--sm" disabled={step >= 6} onClick={() => setStep(step + 1)}>
          {t('m1_next')} <ChevronRight size={15} aria-hidden="true" />
        </button>
        <button type="button" className="btn btn--ghost btn--sm" disabled={step >= 6} onClick={() => setStep(6)}>
          <SkipForward size={15} aria-hidden="true" /> {t('m1_all_steps')}
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => {
            setM(randMatrix(3, 3, -4, 6));
            setStep(1);
          }}
        >
          <Shuffle size={15} aria-hidden="true" /> {t('m1_new_matrix')}
        </button>
      </div>
      {step >= 6 && (
        <p className="field-help">
          {t('m1_check_det')} <Tex tex={`\\det A = ${det(M).toTex()}`} />
        </p>
      )}
    </Panel>
  );
}

// ───────────────────────── Gaussian elimination stepper ─────────────────────────

const LECTURE_GAUSS = toF([
  [1, 1, 1, 3],
  [2, 3, 2, 7],
  [3, 1, 1, 5],
  [5, -1, -1, 3],
]);

export function GaussVisual({ lang }: { lang: Language }) {
  const t = useT(lang);
  const [start, setStart] = useState<FMatrix>(LECTURE_GAUSS);
  const [step, setStep] = useState(0);
  const result = useMemo(() => gaussSteps(start), [start]);
  const total = result.steps.length;
  const cur = step === 0 ? null : result.steps[step - 1];
  const m = cur ? cur.m : start;
  const nVars = start[0].length - 1;

  const random = () => {
    const s = randSystem(3);
    setStart(s.a.map((row, i) => [...row, s.b[i]]));
    setStep(0);
  };

  return (
    <Panel title={t('m1_vis_gauss')} sub={t('lesson_interactive')}>
      <p className="field-help">{t('m1_vis_gauss_help')}</p>
      <div className="m1-gauss">
        <div className="m1-gauss__op" aria-live="polite">
          {cur ? (
            <>
              <span className="chip chip--accent">{cur.stage === 1 ? t('m1_stage1') : t('m1_stage2')}</span>
              <Tex tex={opTex(cur.op)} />
            </>
          ) : (
            <span className="chip">{t('m1_start_matrix')}</span>
          )}
          <span className="mono m1-gauss__count">
            {step} / {total}
          </span>
        </div>
        <div className="m1-grid m1-grid--aug" aria-label={t('m1_aug_matrix')}>
          <span className="m1-matrix__bracket m1-matrix__bracket--l" aria-hidden="true" />
          <div className="m1-grid__cells" style={{ gridTemplateColumns: `repeat(${nVars + 1}, minmax(44px, auto))` }}>
            {m.map((row, i) =>
              row.map((x, j) => (
                <span key={`${i}-${j}-${step}`} className={`m1-grid__cell${cur?.rows.includes(i) ? ' is-changed' : ''}${j === nVars ? ' is-rhs' : ''}`}>
                  <Tex tex={x.toTex()} />
                </span>
              ))
            )}
          </div>
          <span className="m1-matrix__bracket m1-matrix__bracket--r" aria-hidden="true" />
        </div>
        {step === total && (
          <p className="m1-gauss__result" aria-live="polite">
            {result.status === 'unique' && result.solution ? (
              <>
                {t('m1_solution')}: <Tex tex={result.solution.map((v, k) => `x_{${k + 1}} = ${v.toTex()}`).join(',\\; ')} />
              </>
            ) : result.status === 'none' ? (
              t('m1_no_solution')
            ) : (
              t('m1_infinite')
            )}
          </p>
        )}
      </div>
      <div className="m1-visual__controls">
        <button type="button" className="btn btn--secondary btn--sm" disabled={step === 0} onClick={() => setStep(step - 1)}>
          <ChevronLeft size={15} aria-hidden="true" /> {t('m1_prev')}
        </button>
        <button type="button" className="btn btn--primary btn--sm" disabled={step >= total} onClick={() => setStep(step + 1)}>
          {t('m1_next')} <ChevronRight size={15} aria-hidden="true" />
        </button>
        <button type="button" className="btn btn--ghost btn--sm" disabled={step === 0} onClick={() => setStep(0)}>
          <RotateCcw size={15} aria-hidden="true" /> {t('m1_restart')}
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={random}>
          <Shuffle size={15} aria-hidden="true" /> {t('m1_new_system')}
        </button>
        {start !== LECTURE_GAUSS && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              setStart(LECTURE_GAUSS);
              setStep(0);
            }}
          >
            {t('m1_lecture_example')}
          </button>
        )}
      </div>
    </Panel>
  );
}

export function LectureVisual({ id, lang }: { id: VisualId; lang: Language }) {
  if (id === 'matrix-product') return <MatrixProductVisual lang={lang} />;
  if (id === 'sarrus') return <SarrusVisual lang={lang} />;
  if (id === 'gauss') return <GaussVisual lang={lang} />;
  return <GeometryLab id={id} lang={lang} />;
}
