import { Frac, randInt } from '../../lib/linalg';
import { T, type CalculusTrainerKind, type L } from './types';

export const CALCULUS_TRAINER_LABELS: Record<CalculusTrainerKind, L> = {
  'sequence-term': T('Арифметикалық прогрессия', 'Арифметическая прогрессия', 'Arithmetic sequence'),
  'rational-limit': T('Қысқарту арқылы шек', 'Предел с сокращением', 'Limit by cancellation'),
  'continuity-parameter': T('Үзілісті жою', 'Устранение разрыва', 'Removing a discontinuity'),
  'derivative-value': T('Нүктедегі туынды', 'Производная в точке', 'Derivative at a point'),
  'implicit-slope': T('Айқындалмаған туынды', 'Неявная производная', 'Implicit derivative'),
  'mean-value-point': T('Лагранж нүктесі', 'Точка теоремы Лагранжа', 'Mean value point'),
  'quadratic-vertex': T('Квадраттық функцияның минимумы', 'Минимум квадратичной функции', 'Minimum of a quadratic'),
};

const r = String.raw;

function problem(task: L, given: string, fields: [string, number | Frac][], solutions: string[]) {
  return {
    task,
    given,
    answer: {
      kind: 'fields' as const,
      fields: fields.map(([tex, value]) => ({ tex, value: typeof value === 'number' ? new Frac(value) : value })),
    },
    solution: solutions.map(tex => ({ tex })),
  };
}

export function generateCalculusProblem(kind: CalculusTrainerKind) {
  const a = randInt(2, 8);
  const b = randInt(2, 9);
  switch (kind) {
    case 'sequence-term': {
      const step = randInt(1, 6) * (randInt(0, 1) ? 1 : -1);
      const term = a + (b - 1) * step;
      return problem(
        T('Көрсетілген мүшені табыңыз.', 'Найдите указанный член последовательности.', 'Find the indicated term.'),
        r`a_1=${a},\quad a_{n+1}=a_n${step > 0 ? '+' : ''}${step},\quad n=${b}`,
        [[r`a_{${b}}`, term]],
        [r`a_n=a_1+(n-1)d,\quad d=${step}`, r`a_{${b}}=${a}+(${b}-1)(${step})=${term}`],
      );
    }
    case 'rational-limit':
      return problem(
        T('Шекті есептеңіз.', 'Вычислите предел.', 'Evaluate the limit.'),
        r`L=\lim_{x\to${a}}\frac{x^2-${a*a}}{x-${a}}`,
        [['L', 2*a]],
        [r`x^2-${a*a}=(x-${a})(x+${a})`, r`L=\lim_{x\to${a}}(x+${a})=${2*a}`],
      );
    case 'continuity-parameter':
      return problem(
        T('Функция үзіліссіз болу үшін k мәнін табыңыз.', 'Найдите k, при котором функция непрерывна.', 'Find k that makes the function continuous.'),
        r`f(x)=\begin{cases}${b}x+1 & x\ne${a}\\ k & x=${a}\end{cases}`,
        [['k', a*b+1]],
        [r`\lim_{x\to${a}}f(x)=${b}\cdot${a}+1=${a*b+1}`, r`k=f(${a})=${a*b+1}`],
      );
    case 'derivative-value':
      return problem(
        T('Берілген нүктедегі туындыны табыңыз.', 'Найдите производную в указанной точке.', 'Find the derivative at the indicated point.'),
        r`f(x)=(${a}x+1)^2,\qquad x=${b}`,
        [[r`f'(${b})`, 2*a*(a*b+1)]],
        [r`f'(x)=2(${a}x+1)\cdot${a}`, r`f'(${b})=2(${a}\cdot${b}+1)\cdot${a}=${2*a*(a*b+1)}`],
      );
    case 'implicit-slope': {
      const slope = new Frac(-a, b);
      return problem(
        T('Нүктедегі жанаманың көлбеулігін табыңыз.', 'Найдите наклон касательной в заданной точке.', 'Find the tangent slope at the given point.'),
        r`x^2+y^2=${a*a+b*b},\qquad P=(${a},${b})`,
        [[r`y'`, slope]],
        [r`2x+2yy'=0`, r`y'=-x/y=-\frac{${a}}{${b}}=${slope.toTex()}`],
      );
    }
    case 'mean-value-point': {
      const right = a+b;
      const c = new Frac(a+right, 2);
      return problem(
        T('Лагранж теоремасындағы c нүктесін табыңыз.', 'Найдите точку c из теоремы Лагранжа.', 'Find the point c guaranteed by the mean value theorem.'),
        r`f(x)=x^2,\qquad [${a},${right}]`,
        [['c', c]],
        [r`\frac{f(${right})-f(${a})}{${right}-${a}}=\frac{${right*right-a*a}}{${b}}=${a+right}`, r`f'(c)=2c=${a+right}\quad\Longrightarrow\quad c=${c.toTex()}`],
      );
    }
    case 'quadratic-vertex':
      return problem(
        T('Минимум нүктесі мен функцияның ең кіші мәнін табыңыз.', 'Найдите точку минимума и наименьшее значение функции.', 'Find the minimizer and the minimum value.'),
        r`f(x)=x^2-${2*a}x+${b+a*a}`,
        [['x', a], [r`f_{\min}`, b]],
        [r`f'(x)=2x-${2*a}=0\quad\Longrightarrow\quad x=${a}`, r`f''(x)=2>0,\qquad f(x)=(x-${a})^2+${b}`, r`f(${a})=${b}`],
      );
  }
}
