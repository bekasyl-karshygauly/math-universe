'use client';

import React, { useMemo, useState } from 'react';
import { Eye, RefreshCw, Check } from 'lucide-react';
import { Language } from '../../lib/storage';
import { L, MATH1_LECTURES, T, TrainerKind } from '../../data/math1';
import { GEOMETRY_TRAINER_LABELS, generateGeometryProblem } from '../../data/math1/geometryPractice';
import { CALCULUS_TRAINER_LABELS, generateCalculusProblem } from '../../data/math1/calculusPractice';
import {
  Frac,
  FMatrix,
  add,
  scale,
  mul,
  det,
  minor,
  cofactor,
  minorMatrix,
  transpose,
  inverse,
  rank,
  cramer,
  gaussSteps,
  opTex,
  matTex,
  augTex,
  systemTex,
  randInt,
  randMatrix,
  randUnimodular,
  randSystem,
  answerMatches,
} from '../../lib/linalg';
import { MatrixInput, NumberField, TexBlock, MathText, Verdict, checkGrid, emptyGrid, useT, CellStatus } from './shared';

interface Problem {
  task: L;
  given: string;
  answer: { kind: 'matrix'; value: FMatrix; prefix: string } | { kind: 'fields'; fields: { tex: string; value: Frac }[] };
  solution: { text?: L; tex: string }[];
}

export const TRAINER_LABELS: Record<TrainerKind, L> = {
  'mat-add': T('Матрицаларды қосу', 'Сложение матриц', 'Matrix addition'),
  'mat-scalar': T('pA + qB', 'pA + qB', 'pA + qB'),
  'mat-mul': T('Матрицаларды көбейту', 'Умножение матриц', 'Matrix product'),
  transpose: T('Транспонирлеу', 'Транспонирование', 'Transpose'),
  det2: T('2-ретті анықтауыш', 'Определитель 2×2', '2×2 determinant'),
  det3: T('3-ретті анықтауыш', 'Определитель 3×3', '3×3 determinant'),
  cofactor: T('Минор және толықтауыш', 'Минор и дополнение', 'Minor and cofactor'),
  inverse2: T('Кері матрица 2×2', 'Обратная 2×2', 'Inverse 2×2'),
  rank: T('Матрица рангі', 'Ранг матрицы', 'Rank'),
  cramer2: T('Крамер 2×2', 'Крамер 2×2', 'Cramer 2×2'),
  system3: T('Жүйе 3×3 (Гаусс)', 'Система 3×3 (Гаусс)', 'System 3×3 (Gauss)'),
  ...GEOMETRY_TRAINER_LABELS,
  ...CALCULUS_TRAINER_LABELS,
};

const p = (x: Frac) => (x.n < 0 ? `(${x.toTex()})` : x.toTex());

function generate(kind: TrainerKind): Problem {
  switch (kind) {
    case 'mat-add': {
      const A = randMatrix(2, 3, -6, 7);
      const B = randMatrix(2, 3, -6, 7);
      const C = add(A, B);
      return {
        task: T('$A+B$ матрицасын табыңыз.', 'Найдите матрицу $A+B$.', 'Find $A+B$.'),
        given: `A=${matTex(A)},\\quad B=${matTex(B)}`,
        answer: { kind: 'matrix', value: C, prefix: 'A+B=' },
        solution: [{ tex: `A+B=${matTex(A.map((row, i) => row.map((a, j) => `${a.toTex()}+${p(B[i][j])}`)))}=${matTex(C)}` }],
      };
    }
    case 'mat-scalar': {
      const choices = [-2, -1, 2, 3];
      const pk = choices[randInt(0, 3)];
      let qk = choices[randInt(0, 3)];
      if (qk === pk) qk = 1;
      const A = randMatrix(2, 2, -5, 6);
      const B = randMatrix(2, 2, -5, 6);
      const pa = scale(pk, A);
      const qb = scale(qk, B);
      const C = add(pa, qb);
      const lab = `${pk === -1 ? '-' : pk}A${qk < 0 ? (qk === -1 ? '-' : qk) : '+' + (qk === 1 ? '' : qk)}B`;
      return {
        task: T(`$${lab}$ матрицасын табыңыз.`, `Найдите матрицу $${lab}$.`, `Find $${lab}$.`),
        given: `A=${matTex(A)},\\quad B=${matTex(B)}`,
        answer: { kind: 'matrix', value: C, prefix: `${lab}=` },
        solution: [{ tex: `${pk}A=${matTex(pa)},\\quad ${qk}B=${matTex(qb)}` }, { tex: `${lab}=${matTex(C)}` }],
      };
    }
    case 'mat-mul': {
      const square = Math.random() < 0.5;
      const A = square ? randMatrix(2, 2, -4, 5) : randMatrix(2, 3, -3, 4);
      const B = square ? randMatrix(2, 2, -4, 5) : randMatrix(3, 2, -3, 4);
      const C = mul(A, B);
      const expr = C.map((row, i) => row.map((_, j) => A[i].map((a, k) => `${p(a)}\\cdot ${p(B[k][j])}`).join('+')));
      return {
        task: T('$A\\cdot B$ көбейтіндісін табыңыз.', 'Найдите произведение $A\\cdot B$.', 'Find the product $A\\cdot B$.'),
        given: `A=${matTex(A)},\\quad B=${matTex(B)}`,
        answer: { kind: 'matrix', value: C, prefix: 'A\\cdot B=' },
        solution: [{ tex: `A\\cdot B=${matTex(expr)}` }, { tex: `=${matTex(C)}` }],
      };
    }
    case 'transpose': {
      const A = randMatrix(2, 3, -6, 7);
      return {
        task: T('$A^{T}$ матрицасын табыңыз.', 'Найдите транспонированную матрицу $A^{T}$.', 'Find the transpose $A^{T}$.'),
        given: `A=${matTex(A)}`,
        answer: { kind: 'matrix', value: transpose(A), prefix: 'A^{T}=' },
        solution: [
          { text: T('Жолдар бағандарға айналады:', 'Строки становятся столбцами:', 'Rows become columns:'), tex: `A^{T}=${matTex(transpose(A))}` },
        ],
      };
    }
    case 'det2': {
      const A = randMatrix(2, 2, -7, 8);
      const d = det(A);
      return {
        task: T('Анықтауышты есептеңіз.', 'Вычислите определитель.', 'Compute the determinant.'),
        given: `\\Delta=${matTex(A, 'vmatrix')}`,
        answer: { kind: 'fields', fields: [{ tex: '\\Delta', value: d }] },
        solution: [{ tex: `\\Delta=${p(A[0][0])}\\cdot ${p(A[1][1])}-${p(A[0][1])}\\cdot ${p(A[1][0])}=${d.toTex()}` }],
      };
    }
    case 'det3': {
      const A = randMatrix(3, 3, -4, 5);
      const d = det(A);
      const terms = [0, 1, 2].map((j) => {
        const sign = j % 2 ? '-' : '+';
        return `${j === 0 ? '' : sign}${p(A[0][j])}${matTex(minorMatrix(A, 0, j), 'vmatrix')}`;
      });
      const vals = [0, 1, 2].map((j) => `${j === 0 ? '' : j % 2 ? '-' : '+'}${p(A[0][j])}\\cdot ${p(minor(A, 0, j))}`);
      return {
        task: T('Анықтауышты есептеңіз.', 'Вычислите определитель.', 'Compute the determinant.'),
        given: `\\Delta=${matTex(A, 'vmatrix')}`,
        answer: { kind: 'fields', fields: [{ tex: '\\Delta', value: d }] },
        solution: [
          { text: T('1-жол бойынша жіктейміз:', 'Раскладываем по 1-й строке:', 'Expand along row 1:'), tex: `\\Delta=${terms.join('')}` },
          { tex: `=${vals.join('')}=${d.toTex()}` },
        ],
      };
    }
    case 'cofactor': {
      const A = randMatrix(3, 3, -5, 6);
      const i = randInt(0, 2);
      const j = randInt(0, 2);
      const M = minor(A, i, j);
      const C = cofactor(A, i, j);
      const ij = `${i + 1}${j + 1}`;
      return {
        task: T(
          `$a_{${ij}}$ элементінің минорын және алгебралық толықтауышын табыңыз.`,
          `Найдите минор и алгебраическое дополнение элемента $a_{${ij}}$.`,
          `Find the minor and the cofactor of $a_{${ij}}$.`
        ),
        given: `\\Delta=${matTex(A, 'vmatrix')}`,
        answer: { kind: 'fields', fields: [{ tex: `M_{${ij}}`, value: M }, { tex: `A_{${ij}}`, value: C }] },
        solution: [
          {
            text: T(`${i + 1}-жол мен ${j + 1}-бағанды сызамыз:`, `Вычёркиваем ${i + 1}-ю строку и ${j + 1}-й столбец:`, `Delete row ${i + 1} and column ${j + 1}:`),
            tex: `M_{${ij}}=${matTex(minorMatrix(A, i, j), 'vmatrix')}=${M.toTex()}`,
          },
          { tex: `A_{${ij}}=(-1)^{${i + 1}+${j + 1}}M_{${ij}}=${C.toTex()}` },
        ],
      };
    }
    case 'inverse2': {
      const A = randUnimodular(2);
      const inv = inverse(A)!;
      const d = det(A);
      return {
        task: T('$A^{-1}$ кері матрицасын табыңыз.', 'Найдите обратную матрицу $A^{-1}$.', 'Find the inverse $A^{-1}$.'),
        given: `A=${matTex(A)}`,
        answer: { kind: 'matrix', value: inv, prefix: 'A^{-1}=' },
        solution: [
          { tex: `\\Delta_A=${p(A[0][0])}\\cdot ${p(A[1][1])}-${p(A[0][1])}\\cdot ${p(A[1][0])}=${d.toTex()}` },
          {
            text: T('Бас диагональды ауыстырып, қалғандарының таңбасын өзгертеміз:', 'Меняем местами главную диагональ, у остальных меняем знак:', 'Swap the main diagonal, negate the others:'),
            tex: `A^{-1}=\\frac{1}{${d.toTex()}}${matTex([[A[1][1], A[0][1].neg()], [A[1][0].neg(), A[0][0]]])}=${matTex(inv)}`,
          },
        ],
      };
    }
    case 'rank': {
      const target = randInt(1, 3);
      const base = randMatrix(target, 4, -3, 4);
      const rows: FMatrix = [...base];
      while (rows.length < 3) {
        const k1 = randInt(-2, 2) || 1;
        const k2 = target > 1 ? randInt(-1, 1) : 0;
        rows.push(base[0].map((x, j) => x.mul(k1).add(target > 1 ? base[1][j].mul(k2) : new Frac(0))));
      }
      const A = rows.sort(() => Math.random() - 0.5);
      const rk = rank(A);
      const g = gaussSteps(A.map((row) => [...row, new Frac(0)]));
      const last = g.steps.filter((s) => s.stage === 1).pop();
      const ech = last ? last.m.map((row) => row.slice(0, 4)) : A;
      return {
        task: T('Матрицаның рангін табыңыз.', 'Найдите ранг матрицы.', 'Find the rank of the matrix.'),
        given: `A=${matTex(A)}`,
        answer: { kind: 'fields', fields: [{ tex: '\\operatorname{rang}A', value: new Frac(rk) }] },
        solution: [
          {
            text: T('Гаусс әдісімен баспалдақты түрге келтіреміз:', 'Приводим к ступенчатому виду методом Гаусса:', 'Reduce to echelon form:'),
            tex: `A\\sim ${matTex(ech)}`,
          },
          { text: T('Нөлдік емес жолдар саны:', 'Число ненулевых строк:', 'Number of non-zero rows:'), tex: `\\operatorname{rang}A=${rk}` },
        ],
      };
    }
    case 'cramer2': {
      const { a, b, x } = randSystem(2);
      const c = cramer(a, b);
      return {
        task: T('Жүйені Крамер ережесімен шешіңіз.', 'Решите систему по правилу Крамера.', 'Solve by Cramer’s rule.'),
        given: systemTex(a, b),
        answer: {
          kind: 'fields',
          fields: [
            { tex: '\\Delta', value: c.d },
            { tex: 'x_1', value: x[0] },
            { tex: 'x_2', value: x[1] },
          ],
        },
        solution: [
          { tex: `\\Delta=${matTex(a, 'vmatrix')}=${c.d.toTex()}` },
          { tex: `\\Delta_{x_1}=${matTex(a.map((row, i) => [b[i], row[1]]), 'vmatrix')}=${c.dk[0].toTex()},\\quad x_1=\\frac{${c.dk[0].toTex()}}{${c.d.toTex()}}=${x[0].toTex()}` },
          { tex: `\\Delta_{x_2}=${matTex(a.map((row, i) => [row[0], b[i]]), 'vmatrix')}=${c.dk[1].toTex()},\\quad x_2=\\frac{${c.dk[1].toTex()}}{${c.d.toTex()}}=${x[1].toTex()}` },
        ],
      };
    }
    case 'system3': {
      const { a, b, x } = randSystem(3);
      const g = gaussSteps(a.map((row, i) => [...row, b[i]]));
      const steps = g.steps.filter((s) => s.op.type !== 'drop');
      return {
        task: T('Жүйені Гаусс әдісімен шешіңіз.', 'Решите систему методом Гаусса.', 'Solve the system by Gaussian elimination.'),
        given: systemTex(a, b),
        answer: { kind: 'fields', fields: x.map((v, k) => ({ tex: `x_${k + 1}`, value: v })) },
        solution: [
          { tex: augTex(a.map((row, i) => [...row, b[i]])) },
          ...steps.map((s) => ({ tex: `\\xrightarrow{${opTex(s.op)}}\\; ${augTex(s.m)}` })),
          { tex: x.map((v, k) => `x_{${k + 1}}=${v.toTex()}`).join(',\\quad ') },
        ],
      };
    }
    case 'vector-components':
    case 'vector-products':
    case 'line-distance':
    case 'plane-intersection':
    case 'conic-parameters':
      return generateGeometryProblem(kind);
    default:
      return generateCalculusProblem(kind);
  }
}

interface TrainerProps {
  lang: Language;
  kinds: TrainerKind[];
  /** Compact mode inside a lecture (no heading) */
  compact?: boolean;
}

export function Trainer({ lang, kinds, compact = false }: TrainerProps) {
  const t = useT(lang);
  const [kind, setKind] = useState<TrainerKind>(kinds[0]);
  const [seed, setSeed] = useState(0);
  const problem = useMemo(() => generate(kind), [kind, seed]); // eslint-disable-line react-hooks/exhaustive-deps
  const [grid, setGrid] = useState<string[][]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [checked, setChecked] = useState<{ ok: boolean; complete: boolean; status: CellStatus[][] | CellStatus[] } | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState({ solved: 0, streak: 0 });
  // A problem counts once, and only if solved before the solution was opened
  const [countedSeed, setCountedSeed] = useState(-1);

  const reset = (nextKind: TrainerKind = kind) => {
    setKind(nextKind);
    setSeed((s) => s + 1);
    setChecked(null);
    setShowSolution(false);
    setFields([]);
    setGrid([]);
  };

  // Answer grid follows the current problem's size
  const ans = problem.answer;
  const gridValues = ans.kind === 'matrix' && grid.length === ans.value.length && grid[0]?.length === ans.value[0].length ? grid : ans.kind === 'matrix' ? emptyGrid(ans.value.length, ans.value[0].length) : [];

  const check = () => {
    let res: { ok: boolean; complete: boolean; status: CellStatus[][] | CellStatus[] };
    if (ans.kind === 'matrix') {
      res = checkGrid(gridValues, ans.value);
    } else {
      const status = ans.fields.map((f, i) => ((fields[i] ?? '').trim() ? answerMatches(fields[i], f.value) : null));
      res = { status, ok: status.every((s) => s === true), complete: status.every((s) => s !== null) };
    }
    setChecked(res);
    if (!res.complete || countedSeed === seed) return;
    if (res.ok && !showSolution) {
      setScore((s) => ({ solved: s.solved + 1, streak: s.streak + 1 }));
      setCountedSeed(seed);
    } else if (!res.ok) {
      setScore((s) => ({ ...s, streak: 0 }));
    }
  };

  return (
    <section className={compact ? 'm1-trainer m1-trainer--compact' : 'panel panel--instrument m1-trainer'} aria-label={t('m1_trainer')}>
      {!compact && (
        <div className="panel__top">
          <span>{t('m1_trainer')}</span>
          <span className="mono">
            {t('m1_solved')}: {score.solved} · {t('m1_streak')}: {score.streak}
          </span>
        </div>
      )}
      <div className="m1-trainer__kinds" role="group" aria-label={t('m1_task_type')}>
        {kinds.map((k) => (
          <button key={k} type="button" className={`chip m1-chip-btn${k === kind ? ' chip--accent' : ''}`} aria-pressed={k === kind} onClick={() => reset(k)}>
            {TRAINER_LABELS[k][lang]}
          </button>
        ))}
      </div>

      <MathText as="p" className="m1-trainer__task" text={problem.task[lang]} />
      <TexBlock tex={problem.given} />

      <form
        className="m1-trainer__answer"
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        {ans.kind === 'matrix' ? (
          <MatrixInput
            values={gridValues}
            onChange={(v) => {
              setGrid(v);
              setChecked(null);
            }}
            status={checked ? (checked.status as CellStatus[][]) : null}
            label={t('m1_your_answer')}
            prefix={ans.prefix}
          />
        ) : (
          <div className="m1-fields">
            {ans.fields.map((f, i) => (
              <NumberField
                key={f.tex}
                label={f.tex}
                tex={f.tex}
                value={fields[i] ?? ''}
                status={checked ? (checked.status as CellStatus[])[i] : null}
                onChange={(v) => {
                  const next = [...fields];
                  next[i] = v;
                  setFields(next);
                  setChecked(null);
                }}
              />
            ))}
          </div>
        )}
        <p className="field-help">{t('m1_input_help')}</p>
        <div className="m1-visual__controls">
          <button type="submit" className="btn btn--primary btn--sm">
            <Check size={15} aria-hidden="true" /> {t('m1_check')}
          </button>
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => setShowSolution(true)} disabled={showSolution}>
            <Eye size={15} aria-hidden="true" /> {t('m1_show_solution')}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => reset()}>
            <RefreshCw size={15} aria-hidden="true" /> {t('m1_new_problem')}
          </button>
        </div>
      </form>

      {checked && <Verdict ok={checked.ok} complete={checked.complete} lang={lang} />}

      {showSolution && (
        <div className="result-panel m1-solution">
          <p className="eyebrow eyebrow--muted">{t('m1_solution')}</p>
          {problem.solution.map((s, i) => (
            <div key={i}>
              {s.text && <MathText as="p" text={s.text[lang]} />}
              <TexBlock tex={s.tex} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Re-exported for the hub's "all trainers" tab
export const ALL_TRAINER_GROUPS = MATH1_LECTURES.map(({ number, trainers }) => ({ lecture: number, kinds: trainers }));
