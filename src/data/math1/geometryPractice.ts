import { Frac, randInt } from '../../lib/linalg';
import { GeometryTrainerKind, L, T } from './types';

export const GEOMETRY_TRAINER_LABELS: Record<GeometryTrainerKind, L> = {
  'vector-components': T('Координаталар мен ұзындық', 'Координаты и длина', 'Components and length'),
  'vector-products': T('Векторлардың көбейтінділері', 'Произведения векторов', 'Vector products'),
  'line-distance': T('Нүктеден түзуге дейін', 'Расстояние до прямой', 'Distance to a line'),
  'plane-intersection': T('Түзу мен жазықтықтың қиылысуы', 'Пересечение с плоскостью', 'Line–plane intersection'),
  'conic-parameters': T('Фокустар мен жарты осьтер', 'Фокусы и полуоси', 'Foci and semiaxes'),
};

const tex = String.raw;
const sign = () => randInt(0, 1) ? 1 : -1;
const tuple = (coords: number[]) => `(${coords.join(',')})`;
const signed = (n: number) => n < 0 ? String(n) : `+${n}`;
const squared = (n: number) => `(${n})^2`;

function problem(task: L, given: string, fields: [string, number][], solutions: string[]) {
  return {
    task,
    given,
    answer: { kind: 'fields' as const, fields: fields.map(([tex, value]) => ({ tex, value: new Frac(value) })) },
    solution: solutions.map(tex => ({ tex })),
  };
}

export function generateGeometryProblem(kind: GeometryTrainerKind) {
  switch (kind) {
    case 'vector-components': {
      const k = randInt(1, 3);
      const a = Array.from({ length: 3 }, () => randInt(-5, 5));
      const d = [3 * k * sign(), 4 * k * sign(), 0];
      const z = randInt(0, 2);
      [d[z], d[2]] = [d[2], d[z]];
      const b = a.map((x, i) => x + d[i]);
      return problem(
        T('$\\overrightarrow{AB}$ векторының үш координатасы мен ұзындығын табыңыз.', 'Найдите три координаты и длину вектора $\\overrightarrow{AB}$.', 'Find the three components and length of $\\overrightarrow{AB}$.'),
        tex`A=${tuple(a)},\qquad B=${tuple(b)}`,
        [['a_x', d[0]], ['a_y', d[1]], ['a_z', d[2]], ['|\\overrightarrow{AB}|', 5 * k]],
        [tex`\overrightarrow{AB}=B-A=${tuple(b)}-${tuple(a)}=${tuple(d)}`, tex`|\overrightarrow{AB}|=\sqrt{${d.map(squared).join('+')}}=${5 * k}`],
      );
    }
    case 'vector-products': {
      const a = randInt(1, 5) * sign();
      const b = randInt(-4, 4);
      const c = randInt(1, 5) * sign();
      const h = randInt(1, 5) * sign();
      return problem(
        T('Скаляр көбейтіндіні, $\\mathbf a\\times\\mathbf b$ векторының $z$ координатасын және параллелепипед көлемін табыңыз.', 'Найдите скалярное произведение, координату $z$ вектора $\\mathbf a\\times\\mathbf b$ и объём параллелепипеда.', 'Find the dot product, the $z$ component of $\\mathbf a\\times\\mathbf b$, and the parallelepiped volume.'),
        tex`\mathbf a=(${a},0,0),\quad\mathbf b=(${b},${c},0),\quad\mathbf c=(1,-2,${h})`,
        [['\\mathbf a\\cdot\\mathbf b', a * b], ['(\\mathbf a\\times\\mathbf b)_z', a * c], ['V', Math.abs(a * c * h)]],
        [tex`\mathbf a\cdot\mathbf b=(${a})(${b})=${a * b}`, tex`\mathbf a\times\mathbf b=(0,0,(${a})(${c}))=(0,0,${a * c})`, tex`V=|(${a * c})(${h})|=${Math.abs(a * c * h)}`],
      );
    }
    case 'line-distance': {
      const x = randInt(-4, 4);
      const y = randInt(-4, 4);
      const a = 3 * sign();
      const b = 4 * sign();
      const k = randInt(1, 6) * sign();
      const c = 5 * k - a * x - b * y;
      return problem(
        T('$P$ нүктесінен түзуге дейінгі қашықтықты табыңыз.', 'Найдите расстояние от точки $P$ до прямой.', 'Find the distance from point $P$ to the line.'),
        tex`P=(${x},${y}),\qquad ${a}x${signed(b)}y${c ? signed(c) : ''}=0`,
        [['d', Math.abs(k)]],
        [tex`d=\frac{|(${a})(${x})+(${b})(${y})+(${c})|}{\sqrt{${squared(a)}+${squared(b)}}}=\frac{|${5 * k}|}{5}=${Math.abs(k)}`],
      );
    }
    case 'plane-intersection': {
      const a = Array.from({ length: 3 }, () => randInt(-4, 4));
      const v = [randInt(-3, 3), randInt(-3, 3), randInt(1, 3) * sign()];
      const t = randInt(1, 4) * sign();
      const b = a.map((x, i) => x + t * v[i]);
      return problem(
        T('Қиылысу параметрі мен нүктесін табыңыз.', 'Найдите параметр и точку пересечения.', 'Find the parameter and the intersection point.'),
        tex`(x,y,z)=${tuple(a)}+t${tuple(v)},\qquad z=${b[2]}`,
        [['t', t], ['x', b[0]], ['y', b[1]], ['z', b[2]]],
        [tex`${a[2]}${signed(v[2])}t=${b[2]}\quad\Rightarrow\quad t=${t}`, tex`P=${tuple(a)}+(${t})\cdot${tuple(v)}=${tuple(b)}`],
      );
    }
    case 'conic-parameters': {
      const k = randInt(1, 4);
      const hyperbola = randInt(0, 1) === 1;
      const a = (hyperbola ? 4 : 5) * k;
      const b = 3 * k;
      const c = (hyperbola ? 5 : 4) * k;
      const op = hyperbola ? '-' : '+';
      return problem(
        T('Екі жарты осьті және центрден фокусқа дейінгі қашықтықты табыңыз.', 'Найдите полуоси и расстояние от центра до фокуса.', 'Find both semiaxes and the center-to-focus distance.'),
        tex`\frac{x^2}{${a * a}}${op}\frac{y^2}{${b * b}}=1`,
        [['a', a], ['b', b], ['c', c]],
        [tex`a=\sqrt{${a * a}}=${a},\qquad b=\sqrt{${b * b}}=${b}`, tex`c=\sqrt{a^2${hyperbola ? '+' : '-'}b^2}=${c}`],
      );
    }
  }
}
