'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { Language } from '../../lib/storage';
import { TASK1, TASK2, TASK3 } from '../../data/math1/variants';
import { Frac, FMatrix, toF, mul, inverse, identity, det, minor, cofactor, cramer, matTex, systemTex, answerMatches } from '../../lib/linalg';
import { fmt } from '../../data/i18n-lab';
import { MatrixInput, NumberField, TexBlock, Tex, Verdict, checkGrid, emptyGrid, useT, CellStatus } from './shared';

const VARIANTS = TASK1.length;
const STORAGE_KEY = 'm1_variant';

function readStoredVariant(): number {
  try {
    const v = parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10);
    return v >= 1 && v <= VARIANTS ? v : 1;
  } catch {
    return 1;
  }
}

/** One matrix part of task 1 with its own check button. */
function MatrixPart({ lang, label, prefix, expected, hint }: { lang: Language; label: string; prefix: string; expected: FMatrix; hint?: string }) {
  const t = useT(lang);
  const [values, setValues] = useState(() => emptyGrid(expected.length, expected[0].length));
  const [res, setRes] = useState<ReturnType<typeof checkGrid> | null>(null);
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="m1-part">
      <p className="m1-part__label">{label}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setRes(checkGrid(values, expected));
        }}
      >
        <MatrixInput
          values={values}
          onChange={(v) => {
            setValues(v);
            setRes(null);
          }}
          status={res?.status}
          label={label}
          prefix={prefix}
        />
        <div className="m1-visual__controls">
          <button type="submit" className="btn btn--primary btn--sm">
            <Check size={15} aria-hidden="true" /> {t('m1_check')}
          </button>
          {hint && (
            <button type="button" className="btn btn--ghost btn--sm" aria-expanded={showHint} onClick={() => setShowHint(!showHint)}>
              <Lightbulb size={15} aria-hidden="true" /> {t('m1_hint')}
            </button>
          )}
        </div>
      </form>
      {showHint && hint && (
        <div className="tip-box">
          <Tex tex={hint} />
        </div>
      )}
      {res && <Verdict ok={res.ok} complete={res.complete} lang={lang} />}
    </div>
  );
}

/** A group of numeric answers checked together. */
function FieldsPart({ lang, items }: { lang: Language; items: { tex: string; value: Frac }[] }) {
  const t = useT(lang);
  const [values, setValues] = useState<string[]>(() => items.map(() => ''));
  const [status, setStatus] = useState<CellStatus[] | null>(null);
  const ok = !!status && status.every((s) => s === true);
  const complete = !!status && status.every((s) => s !== null);

  return (
    <form
      className="m1-part"
      onSubmit={(e) => {
        e.preventDefault();
        setStatus(items.map((it, i) => (values[i].trim() ? answerMatches(values[i], it.value) : null)));
      }}
    >
      <div className="m1-fields">
        {items.map((it, i) => (
          <NumberField
            key={it.tex}
            label={it.tex}
            tex={it.tex}
            value={values[i]}
            status={status?.[i] ?? null}
            onChange={(v) => {
              const next = [...values];
              next[i] = v;
              setValues(next);
              setStatus(null);
            }}
          />
        ))}
      </div>
      <div className="m1-visual__controls">
        <button type="submit" className="btn btn--primary btn--sm">
          <Check size={15} aria-hidden="true" /> {t('m1_check')}
        </button>
      </div>
      {status && <Verdict ok={ok} complete={complete} lang={lang} />}
    </form>
  );
}

export function VariantWork({ lang }: { lang: Language }) {
  const t = useT(lang);
  const [variant, setVariant] = useState(1);

  useEffect(() => {
    setVariant(readStoredVariant());
  }, []);

  const choose = (v: number) => {
    const next = Math.min(VARIANTS, Math.max(1, v));
    setVariant(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* storage unavailable: the choice just isn't remembered */
    }
  };

  const data = useMemo(() => {
    const k = variant - 1;
    const A = toF(TASK1[k].A);
    const B = toF(TASK1[k].B);
    const t2 = TASK2[k];
    const D = toF(t2.d);
    const sys = TASK3[k];
    const sa = toF(sys.map((row) => row.slice(0, 3)));
    const sb = sys.map((row) => new Frac(row[3]));
    return { A, B, dA: det(A), inv: inverse(A), D, i: t2.i, j: t2.j, sa, sb, cr: cramer(sa, sb) };
  }, [variant]);

  const { A, B, dA, inv, D, i, j, sa, sb, cr } = data;
  const E = identity(3);

  return (
    <div className="m1-variant">
      <div className="panel m1-variant__picker">
        <p className="m1-variant__lead">{t('m1_variant_lead')}</p>
        <div className="m1-variant__select">
          <button type="button" className="icon-btn" aria-label={t('m1_prev')} disabled={variant <= 1} onClick={() => choose(variant - 1)}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <label className="m1-variant__label">
            <span>{t('m1_variant')}</span>
            <select className="field-input field-input--mono" value={variant} onChange={(e) => choose(parseInt(e.target.value, 10))}>
              {Array.from({ length: VARIANTS }, (_, k) => (
                <option key={k + 1} value={k + 1}>
                  {k + 1}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="icon-btn" aria-label={t('m1_next')} disabled={variant >= VARIANTS} onClick={() => choose(variant + 1)}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
        <p className="field-help">{t('m1_variant_note')}</p>
      </div>

      {/* key={variant}: every variant starts with empty answers */}
      <div key={variant} className="m1-variant__tasks">
        <section className="panel m1-task" aria-labelledby="m1-task1">
          <p className="eyebrow eyebrow--muted">{fmt(t('m1_task_n'), { n: 1 })}</p>
          <h3 id="m1-task1" className="m1-task__title">
            {t('m1_task1_title')}
          </h3>
          <TexBlock tex={`A=${matTex(A)},\\qquad B=${matTex(B)}`} />
          <MatrixPart lang={lang} label="1) AB" prefix="AB=" expected={mul(A, B)} />
          <MatrixPart lang={lang} label="2) BA" prefix="BA=" expected={mul(B, A)} />
          {inv ? (
            <>
              <MatrixPart lang={lang} label={`3) A⁻¹`} prefix="A^{-1}=" expected={inv} hint={`\\Delta_A=${dA.toTex()}`} />
              <MatrixPart lang={lang} label="4) A·A⁻¹" prefix={'A\\cdot A^{-1}='} expected={E} />
              <MatrixPart lang={lang} label="5) A⁻¹·A" prefix={'A^{-1}\\cdot A='} expected={E} />
            </>
          ) : (
            <p className="status status--warning">{t('m1_singular')}</p>
          )}
        </section>

        <section className="panel m1-task" aria-labelledby="m1-task2">
          <p className="eyebrow eyebrow--muted">{fmt(t('m1_task_n'), { n: 2 })}</p>
          <h3 id="m1-task2" className="m1-task__title">
            {t('m1_task2_title')}
          </h3>
          <TexBlock tex={`\\Delta=${matTex(D, 'vmatrix')},\\qquad i=${i},\\; j=${j}`} />
          <p className="field-help">
            {fmt(t('m1_task2_help'), { i, j })} <Tex tex={`a_{${i}2},\\; a_{3${j}}`} />
          </p>
          <FieldsPart
            lang={lang}
            items={[
              { tex: `M_{${i}2}`, value: minor(D, i - 1, 1) },
              { tex: `A_{${i}2}`, value: cofactor(D, i - 1, 1) },
              ...(i === 3 && j === 2 ? [] : [
                { tex: `M_{3${j}}`, value: minor(D, 2, j - 1) },
                { tex: `A_{3${j}}`, value: cofactor(D, 2, j - 1) },
              ]),
              { tex: '\\Delta', value: det(D) },
            ]}
          />
        </section>

        <section className="panel m1-task" aria-labelledby="m1-task3">
          <p className="eyebrow eyebrow--muted">{fmt(t('m1_task_n'), { n: 3 })}</p>
          <h3 id="m1-task3" className="m1-task__title">
            {t('m1_task3_title')}
          </h3>
          <TexBlock tex={systemTex(sa, sb)} />
          <p className="m1-part__label">{t('m1_task3_dets')}</p>
          <FieldsPart
            lang={lang}
            items={[
              { tex: '\\Delta', value: cr.d },
              { tex: '\\Delta_{x_1}', value: cr.dk[0] },
              { tex: '\\Delta_{x_2}', value: cr.dk[1] },
              { tex: '\\Delta_{x_3}', value: cr.dk[2] },
            ]}
          />
          {cr.x ? (
            <>
              <p className="m1-part__label">{t('m1_task3_solution')}</p>
              <FieldsPart lang={lang} items={cr.x.map((v, k) => ({ tex: `x_${k + 1}`, value: v }))} />
            </>
          ) : (
            <p className="status status--warning">{t('m1_task3_singular')}</p>
          )}
        </section>
      </div>
    </div>
  );
}
