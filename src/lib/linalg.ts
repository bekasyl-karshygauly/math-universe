/**
 * Exact linear algebra on small integer/rational matrices.
 * Used by the «Математика 1» course: answer checking, trainers, Gauss stepper.
 */

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** Rational number n/d, always normalized (d > 0, gcd = 1). */
export class Frac {
  readonly n: number;
  readonly d: number;

  constructor(n: number, d = 1) {
    if (d === 0) throw new Error('division by zero');
    if (d < 0) {
      n = -n;
      d = -d;
    }
    const g = gcd(n, d);
    this.n = n / g || 0; // avoid -0
    this.d = d / g;
  }

  static of(x: number | Frac): Frac {
    return x instanceof Frac ? x : new Frac(x);
  }

  add(o: Frac | number): Frac {
    const b = Frac.of(o);
    return new Frac(this.n * b.d + b.n * this.d, this.d * b.d);
  }
  sub(o: Frac | number): Frac {
    const b = Frac.of(o);
    return new Frac(this.n * b.d - b.n * this.d, this.d * b.d);
  }
  mul(o: Frac | number): Frac {
    const b = Frac.of(o);
    return new Frac(this.n * b.n, this.d * b.d);
  }
  div(o: Frac | number): Frac {
    const b = Frac.of(o);
    return new Frac(this.n * b.d, this.d * b.n);
  }
  neg(): Frac {
    return new Frac(-this.n, this.d);
  }
  isZero(): boolean {
    return this.n === 0;
  }
  isInt(): boolean {
    return this.d === 1;
  }
  eq(o: Frac | number): boolean {
    const b = Frac.of(o);
    return this.n === b.n && this.d === b.d;
  }
  toNumber(): number {
    return this.n / this.d;
  }
  toString(): string {
    return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`;
  }
  toTex(): string {
    if (this.d === 1) return String(this.n);
    return `${this.n < 0 ? '-' : ''}\\frac{${Math.abs(this.n)}}{${this.d}}`;
  }
}

export type FMatrix = Frac[][];

export const toF = (m: number[][]): FMatrix => m.map((r) => r.map((x) => new Frac(x)));
export const cloneM = (m: FMatrix): FMatrix => m.map((r) => r.slice());

export function minorMatrix(m: FMatrix, i: number, j: number): FMatrix {
  return m.filter((_, r) => r !== i).map((row) => row.filter((_, c) => c !== j));
}

/** Determinant by cofactor expansion along the first row (n ≤ 5 in this course). */
export function det(m: FMatrix): Frac {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0].mul(m[1][1]).sub(m[0][1].mul(m[1][0]));
  let s = new Frac(0);
  for (let j = 0; j < n; j++) {
    if (m[0][j].isZero()) continue;
    const term = m[0][j].mul(det(minorMatrix(m, 0, j)));
    s = j % 2 ? s.sub(term) : s.add(term);
  }
  return s;
}

export function minor(m: FMatrix, i: number, j: number): Frac {
  return det(minorMatrix(m, i, j));
}

/** Algebraic complement A_ij = (−1)^(i+j) · M_ij (0-based indices). */
export function cofactor(m: FMatrix, i: number, j: number): Frac {
  const v = minor(m, i, j);
  return (i + j) % 2 ? v.neg() : v;
}

export function add(a: FMatrix, b: FMatrix): FMatrix {
  return a.map((r, i) => r.map((x, j) => x.add(b[i][j])));
}

export function scale(k: Frac | number, a: FMatrix): FMatrix {
  return a.map((r) => r.map((x) => x.mul(k)));
}

export function mul(a: FMatrix, b: FMatrix): FMatrix {
  return a.map((row) => b[0].map((_, j) => row.reduce((s, x, k) => s.add(x.mul(b[k][j])), new Frac(0))));
}

export function transpose(a: FMatrix): FMatrix {
  return a[0].map((_, j) => a.map((r) => r[j]));
}

export function identity(n: number): FMatrix {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => new Frac(i === j ? 1 : 0)));
}

/** A⁻¹ = (1/Δ)·(A_ji), or null for a singular matrix. */
export function inverse(a: FMatrix): FMatrix | null {
  const d = det(a);
  if (d.isZero()) return null;
  const n = a.length;
  if (n === 1) return [[new Frac(1).div(d)]];
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => cofactor(a, j, i).div(d)));
}

export function rank(a: FMatrix): number {
  const m = cloneM(a);
  let r = 0;
  const cols = m[0]?.length ?? 0;
  for (let c = 0; c < cols && r < m.length; c++) {
    const p = m.findIndex((row, i) => i >= r && !row[c].isZero());
    if (p < 0) continue;
    [m[r], m[p]] = [m[p], m[r]];
    for (let i = 0; i < m.length; i++) {
      if (i === r || m[i][c].isZero()) continue;
      const k = m[i][c].div(m[r][c]);
      m[i] = m[i].map((x, j) => x.sub(k.mul(m[r][j])));
    }
    r++;
  }
  return r;
}

/** Cramer's rule: [Δ, Δ1..Δn, solution | null]. */
export function cramer(a: FMatrix, b: Frac[]): { d: Frac; dk: Frac[]; x: Frac[] | null } {
  const d = det(a);
  const dk = a.map((_, k) => det(a.map((row, i) => row.map((v, j) => (j === k ? b[i] : v)))));
  return { d, dk, x: d.isZero() ? null : dk.map((v) => v.div(d)) };
}

// ───────────────────────── Gaussian elimination, step by step ─────────────────────────

export type GaussOp =
  | { type: 'swap'; i: number; j: number }
  | { type: 'scale'; i: number; k: Frac }
  | { type: 'add'; target: number; src: number; k: Frac }
  | { type: 'drop'; i: number };

export interface GaussStep {
  op: GaussOp;
  /** Matrix after the operation */
  m: FMatrix;
  /** Rows changed by the operation (in the resulting matrix) */
  rows: number[];
  /** 1 = forward pass (echelon form), 2 = backward pass */
  stage: 1 | 2;
}

export interface GaussResult {
  steps: GaussStep[];
  status: 'unique' | 'none' | 'infinite';
  solution: Frac[] | null;
}

/**
 * Reduces an augmented matrix [A | b] (last column = b) to reduced row echelon form,
 * recording each elementary operation. Zero rows are dropped, like in the lecture.
 */
export function gaussSteps(aug: FMatrix): GaussResult {
  let m = cloneM(aug);
  const nVars = m[0].length - 1;
  const steps: GaussStep[] = [];
  const push = (op: GaussOp, rows: number[], stage: 1 | 2) => steps.push({ op, m: cloneM(m), rows, stage });
  const pivots: number[] = [];
  let r = 0;

  for (let c = 0; c < nVars && r < m.length; c++) {
    // Prefer a pivot equal to ±1 to keep numbers small, as done by hand
    let p = m.findIndex((row, i) => i >= r && (row[c].eq(1) || row[c].eq(-1)));
    if (p < 0) p = m.findIndex((row, i) => i >= r && !row[c].isZero());
    if (p < 0) continue;
    if (p !== r) {
      [m[r], m[p]] = [m[p], m[r]];
      push({ type: 'swap', i: r, j: p }, [r, p], 1);
    }
    for (let i = r + 1; i < m.length; i++) {
      if (m[i][c].isZero()) continue;
      const k = m[i][c].div(m[r][c]).neg();
      m[i] = m[i].map((x, j) => x.add(k.mul(m[r][j])));
      push({ type: 'add', target: i, src: r, k }, [i], 1);
    }
    pivots.push(c);
    r++;
  }

  // Drop zero rows (0 = 0); a row 0 … 0 | b ≠ 0 means no solution
  for (let i = m.length - 1; i >= 0; i--) {
    const allZero = m[i].slice(0, nVars).every((x) => x.isZero());
    if (!allZero) continue;
    if (!m[i][nVars].isZero()) return { steps, status: 'none', solution: null };
    m.splice(i, 1);
    push({ type: 'drop', i }, [], 1);
  }

  if (pivots.length < nVars) return { steps, status: 'infinite', solution: null };

  // Backward pass: make pivots 1 and clear entries above them
  for (let i = m.length - 1; i >= 0; i--) {
    const c = pivots[i];
    if (!m[i][c].eq(1)) {
      const k = new Frac(1).div(m[i][c]);
      m[i] = m[i].map((x) => x.mul(k));
      push({ type: 'scale', i, k }, [i], 2);
    }
    for (let t = i - 1; t >= 0; t--) {
      if (m[t][c].isZero()) continue;
      const k = m[t][c].neg();
      m[t] = m[t].map((x, j) => x.add(k.mul(m[i][j])));
      push({ type: 'add', target: t, src: i, k }, [t], 2);
    }
  }
  m = m.slice(0, nVars);
  return { steps, status: 'unique', solution: m.map((row) => row[nVars]) };
}

/** LaTeX for a row operation, e.g. R_2 \to R_2 - 2R_1 (language-independent). */
export function opTex(op: GaussOp): string {
  const R = (i: number) => `R_{${i + 1}}`;
  if (op.type === 'swap') return `${R(op.i)} \\leftrightarrow ${R(op.j)}`;
  if (op.type === 'drop') return `${R(op.i)}:\\ 0 = 0`;
  if (op.type === 'scale') return `${R(op.i)} \\to ${coefTex(op.k)}${R(op.i)}`;
  const k = op.k;
  const sign = k.n < 0 ? '-' : '+';
  const abs = new Frac(Math.abs(k.n), k.d);
  return `${R(op.target)} \\to ${R(op.target)} ${sign} ${coefTex(abs)}${R(op.src)}`;
}

function coefTex(k: Frac): string {
  if (k.eq(1)) return '';
  if (k.eq(-1)) return '-';
  return k.toTex() + '\\,';
}

// ───────────────────────── Formatting ─────────────────────────

export function matTex(m: (Frac | number | string)[][], env: 'pmatrix' | 'vmatrix' | 'matrix' = 'pmatrix'): string {
  const cell = (x: Frac | number | string) => (x instanceof Frac ? x.toTex() : String(x));
  return `\\begin{${env}}${m.map((r) => r.map(cell).join(' & ')).join(' \\\\ ')}\\end{${env}}`;
}

/** Augmented matrix with a vertical bar before the last column. */
export function augTex(m: FMatrix): string {
  const n = m[0].length;
  const spec = 'r'.repeat(n - 1) + '|r';
  return `\\left(\\begin{array}{${spec}}${m.map((r) => r.map((x) => x.toTex()).join(' & ')).join(' \\\\ ')}\\end{array}\\right)`;
}

/** Linear equation a1 x1 + a2 x2 + … = b as LaTeX. */
export function equationTex(coefs: (Frac | number)[], rhs: Frac | number, vars?: string[]): string {
  const names = vars ?? coefs.map((_, i) => `x_{${i + 1}}`);
  let s = '';
  coefs.forEach((c0, i) => {
    const c = Frac.of(c0);
    if (c.isZero()) return;
    const abs = new Frac(Math.abs(c.n), c.d);
    const coef = abs.eq(1) ? '' : abs.toTex();
    if (!s) s = (c.n < 0 ? '-' : '') + coef + names[i];
    else s += (c.n < 0 ? ' - ' : ' + ') + coef + names[i];
  });
  return `${s || '0'} = ${Frac.of(rhs).toTex()}`;
}

export function systemTex(a: (Frac | number)[][], b: (Frac | number)[], vars?: string[]): string {
  return `\\begin{cases} ${a.map((row, i) => equationTex(row, b[i], vars)).join(' \\\\ ')} \\end{cases}`;
}

// ───────────────────────── Parsing student answers ─────────────────────────

/** Parses "3", "-2", "−2/5", "0.5", "1,5", "-3 / 4". Returns null for anything else. */
export function parseAnswer(raw: string): Frac | null {
  const s = raw.trim().replace(/[−–—]/g, '-').replace(',', '.');
  if (!s) return null;
  let m = s.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
  if (m) {
    const n = Number(m[1]);
    const d = Number(m[2]);
    return Number.isSafeInteger(n) && Number.isSafeInteger(d) && d !== 0 ? new Frac(n, d) : null;
  }
  m = s.match(/^([+-]?)(\d*)\.(\d+)$/);
  if (m) {
    const digits = m[3].length;
    const n = parseInt((m[2] || '0') + m[3], 10) * (m[1] === '-' ? -1 : 1);
    const d = 10 ** digits;
    return Number.isSafeInteger(n) && Number.isSafeInteger(d) ? new Frac(n, d) : null;
  }
  if (/^[+-]?\d+$/.test(s) && Number.isSafeInteger(Number(s))) return new Frac(Number(s));
  return null;
}

/** True when the typed answer equals the exact value (decimals accepted within 1e-3). */
export function answerMatches(raw: string, exact: Frac): boolean {
  const v = parseAnswer(raw);
  if (!v) return false;
  if (v.eq(exact)) return true;
  // Rounded decimals for fractions such as 1/3 ≈ 0.333
  return !raw.includes('/') && /[.,]/.test(raw) && Math.abs(v.toNumber() - exact.toNumber()) < 1e-3 && !exact.isInt();
}

// ───────────────────────── Random generators for trainers ─────────────────────────

export function randInt(a: number, b: number): number {
  return a + Math.floor(Math.random() * (b - a + 1));
}

export function randMatrix(rows: number, cols: number, lo = -5, hi = 6): FMatrix {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => new Frac(randInt(lo, hi))));
}

/** Square matrix with a non-zero, small determinant. */
export function randInvertible(n: number, lo = -4, hi = 5, maxDet = 30): FMatrix {
  for (let t = 0; t < 500; t++) {
    const m = randMatrix(n, n, lo, hi);
    const d = Math.abs(det(m).toNumber());
    if (d !== 0 && d <= maxDet) return m;
  }
  return identity(n);
}

/** Matrix with determinant ±1 (integer inverse), built from elementary operations. */
export function randUnimodular(n: number): FMatrix {
  for (let t = 0; t < 200; t++) {
    let m = identity(n);
    for (let s = 0; s < n + 2; s++) {
      const i = randInt(0, n - 1);
      let j = randInt(0, n - 1);
      if (i === j) j = (j + 1) % n;
      const k = randInt(-2, 2) || 1;
      m = m.map((row, r) => (r === i ? row.map((x, c) => x.add(m[j][c].mul(k))) : row));
    }
    if (m.flat().every((x) => Math.abs(x.toNumber()) <= 9)) return m;
  }
  return identity(n);
}

/** System A·x = b with an integer solution. */
export function randSystem(n: number): { a: FMatrix; b: Frac[]; x: Frac[] } {
  const a = randInvertible(n, -3, 4, 40);
  const x = Array.from({ length: n }, () => new Frac(randInt(-4, 5)));
  const b = a.map((row) => row.reduce((s, v, j) => s.add(v.mul(x[j])), new Frac(0)));
  return { a, b, x };
}
