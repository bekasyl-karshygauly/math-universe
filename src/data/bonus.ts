import { Language } from '../lib/storage';

export interface BonusCard {
  icon: string;
  t: Record<Language, string>;
  d: Record<Language, string>;
  f?: string;
}

export const BONUS: BonusCard[] = [
  {
    icon: '🌀',
    t: {
      ru: 'Ряды Тейлора',
      kz: 'Тейлор қатарлары',
      en: 'Taylor series'
    },
    d: {
      ru: 'Любую гладкую функцию можно представить в виде бесконечной суммы степеней x. Это позволяет компьютерам вычислять sin(x), e^x и ln(x) с помощью обычных сложений и умножений!',
      kz: 'Кез келген тегіс функцияны x дәрежелерінің шексіз қосындысы ретінде жазуға болады. Компьютерлер синус пен экспонентаны осылай есептейді!',
      en: 'Any smooth curve can be represented as an infinite sum of powers of x. This is how processors compute trigonometric and exponential values using basic additions.'
    },
    f: 'e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\dots = \\sum_{n=0}^\\infty \\frac{x^n}{n!}'
  },
  {
    icon: '∞',
    t: {
      ru: 'Числа π и e',
      kz: 'π және e сандары',
      en: 'Numbers π and e'
    },
    d: {
      ru: 'π — фундаментальная константа окружностей и периодичности. e — универсальная база любого непрерывного органического роста и распада во Вселенной.',
      kz: 'π — шеңбер ұзындығының диаметрге қатынасы. e — табиғаттағы үздіксіз өсу процестерінің әмбебап негізі.',
      en: 'π governs spatial geometry, circular rotation, and periodicity. e governs continuous organic exponential growth and decay in the cosmos.'
    },
    f: 'e = \\lim_{n\\to\\infty}\\left(1+\\frac{1}{n}\\right)^n, \\qquad \\pi = 4 \\sum_{k=0}^\\infty \\frac{(-1)^k}{2k+1}'
  },
  {
    icon: '🎪',
    t: {
      ru: 'Парадокс дня рождения',
      kz: 'Туған күн парадоксы',
      en: 'Birthday paradox'
    },
    d: {
      ru: 'В комнате, где собралось всего 23 случайных человека, вероятность того, что хотя бы у двоих совпадёт день рождения, превышает 50%! А при 70 людях вероятность равна 99.9%.',
      kz: 'Кездейсоқ 23 адам жиналған бөлмеде кем дегенде екеуінің туған күні сәйкес келу ықтималдығы 50%-дан асады! 70 адам болса — 99.9%.',
      en: 'In a room of just 23 people, the probability that at least two share a birthday exceeds 50%! At 70 people, it reaches 99.9% due to combinatoric pair growth.'
    },
    f: 'P(\\text{совпадение}) = 1 - \\prod_{k=1}^{n-1} \\left(1 - \\frac{k}{365}\\right) > 0.507 \\quad (n=23)'
  },
  {
    icon: '🌿',
    t: {
      ru: 'Золотое сечение',
      kz: 'Алтын қатынас',
      en: 'Golden ratio'
    },
    d: {
      ru: 'φ ≈ 1.618033… — число эстетической гармонии, спиралей галактик, раковин моллюсков, лепестков подсолнуха и архитектуры античного Парфенона.',
      kz: 'φ ≈ 1.618… — галактикалар спиральдарында, өсімдіктерде және сәулет өнерінде кездесетін үйлесімділік саны.',
      en: 'φ ≈ 1.618033… — the divine proportion appearing in galactic spirals, nautilus shells, sunflower seeds, and classical Parthenon architecture.'
    },
    f: '\\varphi = \\frac{1 + \\sqrt{5}}{2} = 1 + \\frac{1}{1 + \\frac{1}{1 + \\dots}}'
  },
  {
    icon: '🔢',
    t: {
      ru: 'Гипотеза Римана',
      kz: 'Риман гипотезасы',
      en: 'Riemann hypothesis'
    },
    d: {
      ru: 'Величайшая нерешённая задача математики: все нетривиальные нули дзета-функции ζ(s) лежат на критической прямой Re(s) = 1/2. Решение раскроет тайну распределения простых чисел. Награда — $1 000 000.',
      kz: 'Математиканың ең үлкен ашылмаған құпиясы. Дзета-функцияның барлық маңызды нөлдері Re(s) = 1/2 түзуінде жатыр. Сыйақы — $1 000 000.',
      en: 'The holy grail of number theory: all non-trivial zeros of the Riemann zeta function lie on the critical line Re(s) = 1/2, unlocking the distribution of primes.'
    },
    f: '\\zeta(s) = \\sum_{n=1}^\\infty \\frac{1}{n^s} = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}'
  },
  {
    icon: '🎭',
    t: {
      ru: '0.999… = 1',
      kz: '0.999… = 1',
      en: '0.999… = 1'
    },
    d: {
      ru: 'Бесконечная девятка в периоде строго и абсолютно равна единице. Доказательство: пусть x = 0.999…, тогда 10x = 9.999… Вычитаем: 9x = 9 ⇒ x = 1. Также: 1/3 = 0.333…, умножаем на 3: 1 = 0.999…!',
      kz: 'Үтірден кейінгі шексіз тоғыз нақты түрде бірге тең. x = 0.999... болса, 10x = 9.999... Шегерсек: 9x = 9, олай болса x = 1!',
      en: 'The infinite repeating decimal 0.999… is identically equal to 1. Proof: let x = 0.999…, then 10x = 9.999… Subtracting gives 9x = 9, so x = 1.'
    },
    f: '0.999\\dots = \\sum_{n=1}^\\infty \\frac{9}{10^n} = \\frac{9/10}{1 - 1/10} = 1'
  }
];
