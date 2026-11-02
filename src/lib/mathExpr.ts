// Safe math expression compiler: parses user input like "2x^2 + sin(x) - ln(x)"
// into a JS closure without eval/Function. Supports implicit multiplication
// (2x, 3(x+1), 2sin x), |x|, unary minus, right-associative ^ and the
// functions/constants listed below.

export class ExprError extends Error {}

const FUNCTIONS: Record<string, (v: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  cot: (v) => 1 / Math.tan(v),
  sec: (v) => 1 / Math.cos(v),
  csc: (v) => 1 / Math.sin(v),
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  arcsin: Math.asin,
  arccos: Math.acos,
  arctan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  exp: Math.exp,
  ln: Math.log,
  log: Math.log10,
  lg: Math.log10,
  log2: Math.log2,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  sign: Math.sign,
};

const CONSTANTS: Record<string, number> = { pi: Math.PI, 'π': Math.PI, e: Math.E };

// Longest names first so "asin" wins over "sin" and "log2" over "log"
const NAMES = [...Object.keys(FUNCTIONS), ...Object.keys(CONSTANTS)].sort((a, b) => b.length - a.length);

type Token =
  | { type: 'num'; value: number }
  | { type: 'var'; name: string }
  | { type: 'const'; value: number }
  | { type: 'func'; name: string }
  | { type: 'op'; value: '+' | '-' | '*' | '/' | '^' | '(' | ')' | '|' };

function tokenize(src: string, vars: string[]): Token[] {
  const s = src
    .toLowerCase()
    .replace(/\*\*/g, '^')
    .replace(/[·×]/g, '*')
    .replace(/[÷]/g, '/')
    .replace(/[−–]/g, '-')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/√/g, 'sqrt');
  const tokens: Token[] = [];
  let i = 0;

  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      const m = s.slice(i).match(/^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/);
      if (!m) throw new ExprError(`Неверное число в позиции ${i + 1}`);
      tokens.push({ type: 'num', value: parseFloat(m[0]) });
      i += m[0].length;
      continue;
    }
    if ('+-*/^()|'.includes(ch)) {
      tokens.push({ type: 'op', value: ch as '+' });
      i++;
      continue;
    }
    if (/[a-zπ]/.test(ch)) {
      const name = NAMES.find((n) => s.startsWith(n, i));
      if (name && name in FUNCTIONS) {
        tokens.push({ type: 'func', name });
        i += name.length;
        continue;
      }
      if (vars.includes(ch)) {
        tokens.push({ type: 'var', name: ch });
        i++;
        continue;
      }
      if (name) {
        tokens.push({ type: 'const', value: CONSTANTS[name] });
        i += name.length;
        continue;
      }
      throw new ExprError(`Неизвестный символ «${ch}»`);
    }
    throw new ExprError(`Недопустимый символ «${ch}»`);
  }
  return tokens;
}

type Fn = (scope: Record<string, number>) => number;

class Parser {
  private pos = 0;
  private absDepth = 0;
  private tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): Fn {
    if (this.tokens.length === 0) throw new ExprError('Пустое выражение');
    const fn = this.expr();
    if (this.pos < this.tokens.length) throw new ExprError('Лишние символы в конце выражения');
    return fn;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private isOp(v: string): boolean {
    const t = this.peek();
    return t?.type === 'op' && t.value === v;
  }

  private expect(v: string) {
    if (!this.isOp(v)) throw new ExprError(`Ожидалось «${v}»`);
    this.pos++;
  }

  // expr := term (('+' | '-') term)*
  private expr(): Fn {
    let left = this.term();
    while (this.isOp('+') || this.isOp('-')) {
      const op = (this.tokens[this.pos++] as { value: string }).value;
      const l = left;
      const r = this.term();
      left = op === '+' ? (s) => l(s) + r(s) : (s) => l(s) - r(s);
    }
    return left;
  }

  // An implicit multiplication may follow when the next token starts an operand
  private startsOperand(): boolean {
    const t = this.peek();
    if (!t) return false;
    if (t.type !== 'op') return true;
    // A "|" closes the current absolute value rather than opening a new one
    return t.value === '(' || (t.value === '|' && this.absDepth === 0);
  }

  // term := unary (('*' | '/' | implicit) unary)*
  private term(): Fn {
    let left = this.unary();
    for (;;) {
      if (this.isOp('*') || this.isOp('/')) {
        const op = (this.tokens[this.pos++] as { value: string }).value;
        const l = left;
        const r = this.unary();
        left = op === '*' ? (s) => l(s) * r(s) : (s) => l(s) / r(s);
      } else if (this.startsOperand()) {
        const l = left;
        const r = this.power();
        left = (s) => l(s) * r(s);
      } else {
        return left;
      }
    }
  }

  // unary := ('-' | '+') unary | power   (so -x^2 = -(x^2))
  private unary(): Fn {
    if (this.isOp('-')) {
      this.pos++;
      const v = this.unary();
      return (s) => -v(s);
    }
    if (this.isOp('+')) {
      this.pos++;
      return this.unary();
    }
    return this.power();
  }

  // power := primary ('^' unary)?   (right-associative: 2^3^2 = 2^9)
  private power(): Fn {
    const base = this.primary();
    if (this.isOp('^')) {
      this.pos++;
      const exp = this.unary();
      return (s) => Math.pow(base(s), exp(s));
    }
    return base;
  }

  private primary(): Fn {
    const t = this.peek();
    if (!t) throw new ExprError('Выражение обрывается');
    this.pos++;

    switch (t.type) {
      case 'num': {
        const v = t.value;
        return () => v;
      }
      case 'const': {
        const v = t.value;
        return () => v;
      }
      case 'var': {
        const name = t.name;
        return (s) => s[name];
      }
      case 'func': {
        const f = FUNCTIONS[t.name];
        // sin(x)^2 -> (sin x)^2, while sin x^2 -> sin(x^2)
        if (this.isOp('(')) {
          this.pos++;
          const arg = this.expr();
          this.expect(')');
          return (s) => f(arg(s));
        }
        const arg = this.power();
        return (s) => f(arg(s));
      }
      case 'op': {
        if (t.value === '(') {
          const inner = this.expr();
          this.expect(')');
          return inner;
        }
        if (t.value === '|') {
          this.absDepth++;
          const inner = this.expr();
          this.absDepth--;
          this.expect('|');
          return (s) => Math.abs(inner(s));
        }
        throw new ExprError(`Неожиданный оператор «${t.value}»`);
      }
    }
  }
}

/** Compiles an expression of the given variables; throws ExprError on bad syntax. */
export function compileExpression(src: string, vars: string[] = ['x']): (scope: Record<string, number>) => number {
  return new Parser(tokenize(src, vars)).parse();
}

/** Compiles f(x); throws ExprError on bad syntax. */
export function compileFunction(src: string): (x: number) => number {
  const fn = compileExpression(src, ['x']);
  return (x) => fn({ x });
}

/** Like compileFunction, but returns a function yielding NaN when the input is invalid. */
export function parseFunctionOrNaN(src: string): (x: number) => number {
  try {
    return compileFunction(src);
  } catch {
    return () => NaN;
  }
}
