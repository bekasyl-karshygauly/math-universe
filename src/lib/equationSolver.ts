import { compileFunction, ExprError } from './mathExpr';

export interface SolverStep {
  action: string;
  result: string;
  explanation: string;
}

export interface SolverSolution {
  title: string;
  steps: SolverStep[];
  answer: string;
}

export type SolverResult = { ok: true; solution: SolverSolution } | { ok: false; error: string };

// Strips float noise like 2.9999999999 -> 3
function clean(v: number): number {
  const r = Math.round(v * 1e10) / 1e10;
  return Math.abs(r) < 1e-10 ? 0 : r;
}

function fmt(v: number): string {
  return String(parseFloat(clean(v).toFixed(6)));
}

// Negative numbers get parentheses when substituted into a formula
function p(v: number): string {
  return clean(v) < 0 ? `(${fmt(v)})` : fmt(v);
}

// "=" for exact values, "≈" when fmt() had to round
function eq(v: number): string {
  return Math.abs(parseFloat(fmt(v)) - v) > 1e-9 ? '≈' : '=';
}

function formatPoly(terms: [number, string][]): string {
  let out = '';
  for (const [coef, suffix] of terms) {
    const c = clean(coef);
    if (c === 0) continue;
    const abs = Math.abs(c);
    const body = abs === 1 && suffix ? suffix : `${fmt(abs)}${suffix}`;
    if (!out) out = c < 0 ? `-${body}` : body;
    else out += c < 0 ? ` - ${body}` : ` + ${body}`;
  }
  return out || '0';
}

/**
 * Solves linear and quadratic equations in x, e.g. "x^2-5x=-6", "2(x-1)=x+3", "(x-2)(x+3)=0".
 * Both sides are moved to the left and the coefficients of a·x² + b·x + c are recovered by sampling.
 */
export function solveEquation(input: string): SolverResult {
  const parts = input.split('=');
  if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
    return { ok: false, error: 'Уравнение должно содержать ровно один знак «=», например: x^2-5x+6=0' };
  }

  let left: (x: number) => number;
  let right: (x: number) => number;
  try {
    left = compileFunction(parts[0]);
    right = compileFunction(parts[1]);
  } catch (e) {
    return { ok: false, error: e instanceof ExprError ? e.message : 'Не удалось разобрать уравнение' };
  }

  const f = (x: number) => left(x) - right(x);
  const c = clean(f(0));
  const f1 = f(1);
  const fm1 = f(-1);
  const a = clean((f1 + fm1) / 2 - c);
  const b = clean((f1 - fm1) / 2);

  // Make sure f really is a polynomial of degree <= 2 (rejects sin(x), 1/x, x^3, ...)
  const isQuadratic = [2, -3, 0.5, 7].every((x) => {
    const actual = f(x);
    const expected = a * x * x + b * x + c;
    return Number.isFinite(actual) && Math.abs(actual - expected) <= 1e-7 * Math.max(1, Math.abs(actual));
  });
  if (![a, b, c].every(Number.isFinite) || !isQuadratic) {
    return { ok: false, error: 'Решатель поддерживает только линейные и квадратные уравнения относительно x' };
  }

  const steps: SolverStep[] = [
    {
      action: 'Исходное уравнение',
      result: `${parts[0].trim()} = ${parts[1].trim()}`,
      explanation: 'Нужно найти все x, при которых левая часть равна правой',
    },
    {
      action: 'Переносим всё в левую часть и приводим подобные',
      result: `${formatPoly([[a, 'x²'], [b, 'x'], [c, '']])} = 0`,
      explanation: a !== 0 ? `Стандартный вид ax² + bx + c = 0: a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}` : `Вид bx + c = 0: b = ${fmt(b)}, c = ${fmt(c)}`,
    },
  ];

  if (a !== 0) {
    const D = clean(b * b - 4 * a * c);
    steps.push({
      action: 'Вычисляем дискриминант',
      result: `D = b² - 4ac = ${p(b)}² - 4·${p(a)}·${p(c)} = ${fmt(D)}`,
      explanation: D > 0 ? 'D > 0 → два различных корня' : D === 0 ? 'D = 0 → один корень (кратный)' : 'D < 0 → вещественных корней нет',
    });

    if (D > 0) {
      const sqrtD = Math.sqrt(D);
      const x1 = (-b + sqrtD) / (2 * a);
      const x2 = (-b - sqrtD) / (2 * a);
      steps.push({
        action: 'Первый корень',
        result: `x₁ = (-b + √D) / 2a = (${fmt(-b)} + √${fmt(D)}) / ${p(2 * a)} ${eq(x1)} ${fmt(x1)}`,
        explanation: 'Берём знак «+» в формуле корней',
      });
      steps.push({
        action: 'Второй корень',
        result: `x₂ = (-b - √D) / 2a = (${fmt(-b)} - √${fmt(D)}) / ${p(2 * a)} ${eq(x2)} ${fmt(x2)}`,
        explanation: 'Берём знак «−» в формуле корней',
      });
      steps.push({
        action: 'Проверка по теореме Виета',
        result: `x₁ + x₂ = ${fmt(x1 + x2)} = -b/a,  x₁·x₂ = ${fmt(x1 * x2)} = c/a`,
        explanation: `-b/a = ${fmt(-b / a)}, c/a = ${fmt(c / a)} — совпадает`,
      });
      return { ok: true, solution: { title: 'Квадратное уравнение', steps, answer: `x₁ ${eq(x1)} ${fmt(x1)}, x₂ ${eq(x2)} ${fmt(x2)}` } };
    }

    if (D === 0) {
      const x0 = -b / (2 * a);
      steps.push({
        action: 'Находим единственный корень',
        result: `x = -b / 2a = ${fmt(-b)} / ${p(2 * a)} ${eq(x0)} ${fmt(x0)}`,
        explanation: 'При D = 0 оба корня совпадают',
      });
      return { ok: true, solution: { title: 'Квадратное уравнение', steps, answer: `x ${eq(x0)} ${fmt(x0)}` } };
    }

    const re = -b / (2 * a);
    const im = Math.sqrt(-D) / Math.abs(2 * a);
    steps.push({
      action: 'Комплексные корни (для справки)',
      result: `x = (-b ± i√|D|) / 2a ${eq(im)} ${fmt(re)} ± ${fmt(im)}i`,
      explanation: 'В множестве вещественных чисел решений нет, но в комплексных — есть',
    });
    return { ok: true, solution: { title: 'Квадратное уравнение', steps, answer: 'Нет вещественных корней (D < 0)' } };
  }

  if (b !== 0) {
    const x = -c / b;
    steps.push({
      action: 'Переносим свободный член вправо',
      result: `${formatPoly([[b, 'x']])} = ${fmt(-c)}`,
      explanation: 'При переносе через знак «=» слагаемое меняет знак',
    });
    steps.push({
      action: 'Делим обе части на коэффициент при x',
      result: `x = ${fmt(-c)} / ${p(b)} ${eq(x)} ${fmt(x)}`,
      explanation: `Делим на ${fmt(b)}`,
    });
    return { ok: true, solution: { title: 'Линейное уравнение', steps, answer: `x ${eq(x)} ${fmt(x)}` } };
  }

  if (c === 0) {
    return {
      ok: true,
      solution: { title: 'Тождество', steps: [...steps, { action: 'Получили 0 = 0', result: '0 = 0', explanation: 'Равенство верно при любом x' }], answer: 'x — любое число' },
    };
  }
  return {
    ok: true,
    solution: {
      title: 'Противоречие',
      steps: [...steps, { action: `Получили ${fmt(c)} = 0`, result: `${fmt(c)} ≠ 0`, explanation: 'Числовое равенство неверно ни при каком x' }],
      answer: 'Нет решений',
    },
  };
}
