import { Language } from '../lib/storage';

export interface HackCard {
  icon: string;
  t: Record<Language, string>;
  d: Record<Language, string>;
  f?: string;
}

export const HACKS: HackCard[] = [
  {
    icon: '🎯',
    t: {
      ru: 'Сумма коэффициентов',
      kz: 'Коэффициенттер қосындысы',
      en: 'Sum of coefficients'
    },
    d: {
      ru: 'В ax²+bx+c=0: если a+b+c=0, то x₁=1, x₂=c/a. Если a-b+c=0, то x₁=-1, x₂=-c/a. Дискриминант не нужен!',
      kz: 'ax²+bx+c=0-де: егер a+b+c=0 болса, x₁=1, x₂=c/a. Егер a-b+c=0 болса, x₁=-1, x₂=-c/a. Дискриминант керек емес!',
      en: 'In ax²+bx+c=0: if a+b+c=0, then x₁=1, x₂=c/a. If a-b+c=0, then x₁=-1, x₂=-c/a. No discriminant needed!'
    },
    f: 'a+b+c=0 \\implies x_1=1,\\;x_2=\\tfrac{c}{a}'
  },
  {
    icon: '🦊',
    t: {
      ru: 'Правило Лопиталя',
      kz: 'Лопиталь ережесі',
      en: "L'Hôpital's rule"
    },
    d: {
      ru: 'Предел 0/0 или ∞/∞? Дифференцируй числитель и знаменатель отдельно. Повторяй до раскрытия неопределённости!',
      kz: 'Шек 0/0 немесе ∞/∞ пе? Алым мен бөлімді бөлек дифференциалда. Анықталмағандық ашылғанша қайтала!',
      en: 'Limit 0/0 or ∞/∞? Differentiate numerator and denominator separately until the form clears!'
    },
    f: "\\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\lim_{x\\to a}\\frac{f'(x)}{g'(x)}"
  },
  {
    icon: '🔄',
    t: {
      ru: 'Чётность тригонометрии',
      kz: 'Тригонометрия жұптығы',
      en: 'Trig parity'
    },
    d: {
      ru: 'cos(-x) = cos x (чётный, «ест» минус). sin(-x) = -sin x и tan(-x) = -tan x (нечётные, «выплёвывают» минус).',
      kz: 'cos(-x) = cos x (жұп, минусты «жұтады»). sin(-x) = -sin x және tan(-x) = -tan x (тақ, минусты «шығарады»).',
      en: 'cos(-x) = cos x (even, absorbs minus). sin(-x) = -sin x and tan(-x) = -tan x (odd, expels minus outside).'
    },
    f: '\\cos(-x)=\\cos x, \\quad \\sin(-x)=-\\sin x'
  },
  {
    icon: '📚',
    t: {
      ru: 'Приоритет LIATE в интегралах',
      kz: 'LIATE ережесі',
      en: 'LIATE Integration Priority'
    },
    d: {
      ru: '∫u dv: выбирай u по списку: Логарифм → Арктригонометрия → Многочлен → Тригонометрия → Экспонента.',
      kz: '∫u dv: u-ны тізім бойынша таңда: Логарифм → Арктриг → Көпмүше → Триг → Экспонента.',
      en: 'In ∫u dv: choose u by priority: Logarithmic → Inverse trig → Algebraic polynomial → Trig → Exponential.'
    },
    f: '\\int u\\,dv = uv - \\int v\\,du'
  },
  {
    icon: '⚡',
    t: {
      ru: 'Быстрые производные',
      kz: 'Жылдам туындылар',
      en: 'Fast derivatives'
    },
    d: {
      ru: '(xⁿ)′ = n xⁿ⁻¹. Производная константы всегда 0. А (eˣ)′ = eˣ — функция в точности равна своей производной!',
      kz: '(xⁿ)′ = n xⁿ⁻¹. Тұрақтының туындысы 0. Ал (eˣ)′ = eˣ — өз туындысына тең жалғыз функция!',
      en: '(xⁿ)′ = n xⁿ⁻¹. Derivative of any constant is zero. And (eˣ)′ = eˣ — perfectly self-derivative!'
    },
    f: '(x^n)\' = n x^{n-1}, \\quad (e^x)\' = e^x'
  },
  {
    icon: '🎲',
    t: {
      ru: 'Геометрический смысл операций',
      kz: 'Геометриялық мағына',
      en: 'Geometric meaning'
    },
    d: {
      ru: 'Производная = угол наклона касательной. Интеграл = площадь под графиком. Определитель матрицы = коэффициент масштабирования площади или объёма.',
      kz: 'Туынды = жанама бұрышы. Интеграл = аудан. Анықтауыш = аудан немесе көлемнің масштабы.',
      en: 'Derivative = slope of tangent. Integral = area under curve. Matrix determinant = spatial area/volume scaling factor.'
    },
    f: 'f\'(x) = \\tan\\theta, \\quad \\int f dx = \\text{Area}, \\quad \\det A = \\frac{V_{\\text{final}}}{V_{\\text{initial}}}'
  },
  {
    icon: '🌀',
    t: {
      ru: 'Формула Эйлера',
      kz: 'Эйлер формуласы',
      en: "Euler's formula"
    },
    d: {
      ru: 'e^(iπ) + 1 = 0 — самая красивая формула в науке. Вращение в комплексной плоскости = тригонометрия!',
      kz: 'e^(iπ) + 1 = 0 — ғылымдағы ең әдемі формула. Кешен жазықтықтағы айналу тригонометрияға тең!',
      en: 'e^(iπ) + 1 = 0 — the most elegant formula in math. Complex rotation maps directly to sine and cosine!'
    },
    f: 'e^{i\\pi} + 1 = 0'
  },
  {
    icon: '🧮',
    t: {
      ru: 'Метод интервалов без вычислений',
      kz: 'Интервалдар әдісі',
      en: 'Instant interval signs'
    },
    d: {
      ru: 'Найди нули числителя и знаменателя → отметь на оси → если перед всеми x стоят плюсы, самый правый интервал всегда плюс (+) → знаки чередуются (если нет чётных степеней)!',
      kz: 'Нөлдерін тап → оське белгіле → егер x оң болса, ең оң жақ интервал әрқашан плюс (+) → таңбалар ауысады!',
      en: 'Find zeros → mark on axis → if leading coefficients of x are positive, rightmost interval is (+) → signs alternate for odd powers!'
    },
    f: '(x-a)(x-b) > 0 \\implies x \\in (-\\infty, a) \\cup (b, +\\infty)'
  }
];
