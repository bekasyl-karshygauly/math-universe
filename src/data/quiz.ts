import { Language } from '../lib/storage';

export interface QuizItem {
  id?: string;
  topic: string;
  q: Record<Language, string>;
  a: Record<Language, string[]>;
  c: number; // index of correct answer in a
  explanation?: Record<Language, string>;
}

export const QUIZ_BANK: Record<string, QuizItem[]> = {
  basics: [
    {
      topic: 'basics',
      q: { ru: 'К какому типу чисел относится √2?', kz: '√2 санның қай түріне жатады?', en: 'What type of number is √2?' },
      a: {
        ru: ['Иррациональное', 'Рациональное', 'Целое', 'Натуральное'],
        kz: ['Иррационал', 'Рационал', 'Бүтін', 'Натурал'],
        en: ['Irrational', 'Rational', 'Integer', 'Natural']
      },
      c: 0,
      explanation: {
        ru: '√2 нельзя представить в виде несократимой дроби p/q, его десятичная запись бесконечна и непериодична.',
        kz: '√2 санын p/q бөлшегі түрінде жазу мүмкін емес, оның ондық үтірі шексіз және периодсыз.',
        en: '√2 cannot be expressed as an exact fraction p/q; its decimal expansion never repeats or terminates.'
      }
    },
    {
      topic: 'basics',
      q: { ru: 'Какое из следующих чисел является комплексным?', kz: 'Төмендегілердің қайсысы кешен сан?', en: 'Which of the following is a complex number?' },
      a: {
        ru: ['3 + 2i', '5', '1/3', '√7'],
        kz: ['3 + 2i', '5', '1/3', '√7'],
        en: ['3 + 2i', '5', '1/3', '√7']
      },
      c: 0,
      explanation: {
        ru: '3 + 2i содержит мнимую единицу i, где i² = -1.',
        kz: '3 + 2i құрамында жорамал бірлік i бар (i² = -1).',
        en: '3 + 2i contains the imaginary unit i, where i² = -1.'
      }
    },
    {
      topic: 'basics',
      q: { ru: 'Функция f(x) называется чётной, если...', kz: 'f(x) функциясы жұп деп аталады, егер...', en: 'A function f(x) is even if...' },
      a: {
        ru: ['f(-x) = f(x)', 'f(-x) = -f(x)', 'f(x+T) = f(x)', 'f(x) > 0'],
        kz: ['f(-x) = f(x)', 'f(-x) = -f(x)', 'f(x+T) = f(x)', 'f(x) > 0'],
        en: ['f(-x) = f(x)', 'f(-x) = -f(x)', 'f(x+T) = f(x)', 'f(x) > 0']
      },
      c: 0,
      explanation: {
        ru: 'График чётной функции симметричен относительно оси Y: f(-x) = f(x).',
        kz: 'Жұп функцияның графигі Y осіне қатысты симметриялы: f(-x) = f(x).',
        en: 'An even function is symmetric across the vertical y-axis: f(-x) = f(x).'
      }
    },
    {
      topic: 'basics',
      q: { ru: 'Чему равен наименьший положительный период функции sin(x)?', kz: 'sin(x) функциясының ең кіші оң периоды неге тең?', en: 'What is the fundamental period of sin(x)?' },
      a: {
        ru: ['2π', 'π', 'π/2', '4π'],
        kz: ['2π', 'π', 'π/2', '4π'],
        en: ['2π', 'π', 'π/2', '4π']
      },
      c: 0,
      explanation: {
        ru: 'Один полный оборот по единичной окружности равен 360° или 2π радиан.',
        kz: 'Бірлік шеңбер бойынша толық бір айналым 360° немесе 2π радианға тең.',
        en: 'One complete revolution around the unit circle is 360° or 2π radians.'
      }
    },
    {
      topic: 'basics',
      q: { ru: 'Чему всегда равно выражение sin²α + cos²α?', kz: 'sin²α + cos²α өрнегі әрқашан неге тең?', en: 'What does sin²α + cos²α always equal?' },
      a: {
        ru: ['1', '0', '2', 'sin 2α'],
        kz: ['1', '0', '2', 'sin 2α'],
        en: ['1', '0', '2', 'sin 2α']
      },
      c: 0,
      explanation: {
        ru: 'Основное тригонометрическое тождество вытекает из теоремы Пифагора на единичном круге.',
        kz: 'Негізгі тригонометриялық тепе-теңдік бірлік шеңбердегі Пифагор теоремасынан шығады.',
        en: 'Fundamental Pythagorean identity on the unit circle with hypotenuse 1.'
      }
    },
    {
      topic: 'basics',
      q: { ru: 'Вычислите log₂(8):', kz: 'log₂(8) есептеңіз:', en: 'Calculate log₂(8):' },
      a: {
        ru: ['3', '2', '4', '8'],
        kz: ['3', '2', '4', '8'],
        en: ['3', '2', '4', '8']
      },
      c: 0,
      explanation: {
        ru: '2³ = 8, следовательно, показатель степени равен 3.',
        kz: '2³ = 8 болғандықтан, дәреже көрсеткіші 3-ке тең.',
        en: '2³ = 8, therefore the logarithm exponent is 3.'
      }
    },
    {
      topic: 'basics',
      q: { ru: 'Чему равен натуральный логарифм ln(e)?', kz: 'Натурал логарифм ln(e) неге тең?', en: 'What is the natural logarithm ln(e)?' },
      a: {
        ru: ['1', '0', 'e', '∞'],
        kz: ['1', '0', 'e', '∞'],
        en: ['1', '0', 'e', '∞']
      },
      c: 0,
      explanation: {
        ru: 'Основание натурального логарифма равно e, а log_e(e) = 1.',
        kz: 'Натурал логарифмнің негізі e саны, ал log_e(e) = 1.',
        en: 'The base of the natural log is e, so log_e(e) = 1.'
      }
    }
  ],
  algebra: [
    {
      topic: 'algebra',
      q: { ru: 'По какой формуле вычисляется дискриминант квадратного уравнения?', kz: 'Квадрат теңдеудің дискриминанты қай формуламен есептеледі?', en: 'What is the quadratic equation discriminant formula?' },
      a: {
        ru: ['b² - 4ac', '4ac - b²', 'b² + 4ac', 'a² - 4bc'],
        kz: ['b² - 4ac', '4ac - b²', 'b² + 4ac', 'a² - 4bc'],
        en: ['b² - 4ac', '4ac - b²', 'b² + 4ac', 'a² - 4bc']
      },
      c: 0
    },
    {
      topic: 'algebra',
      q: { ru: 'Сколько действительных корней имеет уравнение, если D < 0?', kz: 'Егер D < 0 болса, теңдеудің қанша нақты түбірі болады?', en: 'How many real roots exist if D < 0?' },
      a: {
        ru: ['0', '1', '2', 'Бесконечно много'],
        kz: ['0', '1', '2', 'Шексіз көп'],
        en: ['0', '1', '2', 'Infinitely many']
      },
      c: 0
    },
    {
      topic: 'algebra',
      q: { ru: 'По теореме Виета сумма корней x₁ + x₂ равна:', kz: 'Виет теоремасы бойынша түбірлер қосындысы x₁ + x₂ неге тең:', en: "According to Vieta's theorem, sum of roots x₁ + x₂ equals:" },
      a: {
        ru: ['-b / a', 'b / a', 'c / a', '-c / a'],
        kz: ['-b / a', 'b / a', 'c / a', '-c / a'],
        en: ['-b / a', 'b / a', 'c / a', '-c / a']
      },
      c: 0
    },
    {
      topic: 'algebra',
      q: { ru: 'По теореме Виета произведение корней x₁ · x₂ равно:', kz: 'Виет теоремасы бойынша түбірлер көбейтіндісі x₁ · x₂ неге тең:', en: "According to Vieta's theorem, product of roots x₁ · x₂ equals:" },
      a: {
        ru: ['c / a', '-c / a', 'b / a', '-b / a'],
        kz: ['c / a', '-c / a', 'b / a', '-b / a'],
        en: ['c / a', '-c / a', 'b / a', '-b / a']
      },
      c: 0
    },
    {
      topic: 'algebra',
      q: { ru: 'Что происходит со знаком неравенства при умножении обеих частей на отрицательное число?', kz: 'Теңсіздіктің екі жағын да теріс санға көбейткенде таңба не болады?', en: 'What happens to the inequality sign when multiplied by a negative number?' },
      a: {
        ru: ['Знак меняется на противоположный', 'Знак остаётся прежним', 'Неравенство теряет смысл', 'Ничего не меняется'],
        kz: ['Таңба қарама-қарсыға өзгереді', 'Таңба өзгермейді', 'Мағынасын жоғалтады', 'Ештеңе өзгермейді'],
        en: ['The sign flips to the opposite', 'The sign stays unchanged', 'It becomes undefined', 'Nothing changes']
      },
      c: 0
    }
  ],
  calc: [
    {
      topic: 'calc',
      q: { ru: 'Чему равен первый замечательный предел lim(x→0) sin(x)/x?', kz: 'Бірінші тамаша шек lim(x→0) sin(x)/x неге тең?', en: 'What does the first remarkable limit lim(x→0) sin(x)/x equal?' },
      a: {
        ru: ['1', '0', 'e', '∞'],
        kz: ['1', '0', 'e', '∞'],
        en: ['1', '0', 'e', '∞']
      },
      c: 0
    },
    {
      topic: 'calc',
      q: { ru: 'Чему равна производная функции (xⁿ)′?', kz: '(xⁿ)′ функциясының туындысы неге тең?', en: 'What is the derivative of (xⁿ)′?' },
      a: {
        ru: ['n · xⁿ⁻¹', 'xⁿ⁻¹', 'n · xⁿ', 'xⁿ / n'],
        kz: ['n · xⁿ⁻¹', 'xⁿ⁻¹', 'n · xⁿ', 'xⁿ / n'],
        en: ['n · xⁿ⁻¹', 'xⁿ⁻¹', 'n · xⁿ', 'xⁿ / n']
      },
      c: 0
    },
    {
      topic: 'calc',
      q: { ru: 'Чему равна производная функции (sin x)′?', kz: '(sin x)′ туындысы неге тең?', en: 'What is the derivative of (sin x)′?' },
      a: {
        ru: ['cos x', '-cos x', '-sin x', 'sin x'],
        kz: ['cos x', '-cos x', '-sin x', 'sin x'],
        en: ['cos x', '-cos x', '-sin x', 'sin x']
      },
      c: 0
    },
    {
      topic: 'calc',
      q: { ru: 'Чему равна производная экспоненты (eˣ)′?', kz: 'Экспонентаның туындысы (eˣ)′ неге тең?', en: 'What is the derivative of (eˣ)′?' },
      a: {
        ru: ['eˣ', 'x · eˣ⁻¹', '1 / eˣ', '0'],
        kz: ['eˣ', 'x · eˣ⁻¹', '1 / eˣ', '0'],
        en: ['eˣ', 'x · eˣ⁻¹', '1 / eˣ', '0']
      },
      c: 0
    },
    {
      topic: 'calc',
      q: { ru: 'Формула Ньютона-Лейбница для определённого интеграла:', kz: 'Анықталған интегралға арналған Ньютон-Лейбниц формуласы:', en: 'The Newton-Leibniz formula for definite integrals:' },
      a: {
        ru: ['F(b) - F(a)', 'F(a) - F(b)', 'f(b) - f(a)', 'F(b) + F(a)'],
        kz: ['F(b) - F(a)', 'F(a) - F(b)', 'f(b) - f(a)', 'F(b) + F(a)'],
        en: ['F(b) - F(a)', 'F(a) - F(b)', 'f(b) - f(a)', 'F(b) + F(a)']
      },
      c: 0
    },
    {
      topic: 'calc',
      q: { ru: 'Чему равен неопределённый интеграл ∫sin(x) dx?', kz: '∫sin(x) dx анықталмаған интегралы неге тең?', en: 'What is the indefinite integral ∫sin(x) dx?' },
      a: {
        ru: ['-cos(x) + C', 'cos(x) + C', 'sin(x) + C', '-sin(x) + C'],
        kz: ['-cos(x) + C', 'cos(x) + C', 'sin(x) + C', '-sin(x) + C'],
        en: ['-cos(x) + C', 'cos(x) + C', 'sin(x) + C', '-sin(x) + C']
      },
      c: 0
    },
    {
      topic: 'calc',
      q: { ru: 'Куда указывает вектор градиента ∇f?', kz: 'Градиент векторы ∇f қайда бағытталған?', en: 'Where does the gradient vector ∇f point?' },
      a: {
        ru: ['В сторону наибольшего роста функции', 'В сторону наибольшего убывания', 'В начало координат', 'Перпендикулярно изолиниям в сторону минимума'],
        kz: ['Функцияның ең жылдам өсу бағытына', 'Ең жылдам кему бағытына', 'Координат басына', 'Кездейсоқ жаққа'],
        en: ['Direction of steepest ascent', 'Direction of steepest descent', 'Towards the origin', 'Randomly']
      },
      c: 0
    }
  ],
  linal: [
    {
      topic: 'linal',
      q: { ru: 'Определитель матрицы 2x2 [[a,b],[c,d]] равен:', kz: '2x2 матрицаның анықтауышы неге тең:', en: 'The determinant of 2x2 matrix [[a,b],[c,d]] is:' },
      a: {
        ru: ['ad - bc', 'ac - bd', 'ab - cd', 'ad + bc'],
        kz: ['ad - bc', 'ac - bd', 'ab - cd', 'ad + bc'],
        en: ['ad - bc', 'ac - bd', 'ab - cd', 'ad + bc']
      },
      c: 0
    },
    {
      topic: 'linal',
      q: { ru: 'Если определитель матрицы det(A) = 0, то:', kz: 'Егер матрицаның анықтауышы det(A) = 0 болса, онда:', en: 'If matrix determinant det(A) = 0, then:' },
      a: {
        ru: ['Обратной матрицы не существует', 'A — единичная матрица', 'A — нулевая матрица', 'Матрица симметрична'],
        kz: ['Кері матрица табылмайды', 'A — бірлік матрица', 'A — нөлдік матрица', 'Матрица симметриялы'],
        en: ['No inverse matrix exists', 'A is identity matrix', 'A is zero matrix', 'Matrix is symmetric']
      },
      c: 0
    },
    {
      topic: 'linal',
      q: { ru: 'Верно ли в общем случае, что AB = BA для матриц?', kz: 'Матрицалар үшін жалпы жағдайда AB = BA орындала ма?', en: 'Does AB = BA hold in general for matrix multiplication?' },
      a: {
        ru: ['Нет, порядок сомножителей важен', 'Да, всегда верно', 'Только для квадратных матриц', 'Только если матрицы нулевые'],
        kz: ['Жоқ, көбейткіштер реті маңызды', 'Иә, әрқашан дұрыс', 'Тек квадрат матрицалар үшін', 'Тек нөлдіктер үшін'],
        en: ['No, multiplication order matters (non-commutative)', 'Yes, always commutative', 'Only for square matrices', 'Only for identity matrices']
      },
      c: 0
    },
    {
      topic: 'linal',
      q: { ru: 'Скалярное произведение взаимно перпендикулярных векторов равно:', kz: 'Өзара перпендикуляр векторлардың скаляр көбейтіндісі неге тең:', en: 'The dot product of perpendicular vectors equals:' },
      a: {
        ru: ['0', '1', '∞', '-1'],
        kz: ['0', '1', '∞', '-1'],
        en: ['0', '1', '∞', '-1']
      },
      c: 0
    }
  ],
  prob: [
    {
      topic: 'prob',
      q: { ru: 'В каких пределах может лежать вероятность любого события P(A)?', kz: 'Кез келген оқиғаның ықтималдығы P(A) қай аралықта болады?', en: 'In what range does event probability P(A) lie?' },
      a: {
        ru: ['[0, 1]', '(-∞, ∞)', '[0, ∞)', '[-1, 1]'],
        kz: ['[0, 1]', '(-∞, ∞)', '[0, ∞)', '[-1, 1]'],
        en: ['[0, 1]', '(-∞, ∞)', '[0, ∞)', '[-1, 1]']
      },
      c: 0
    },
    {
      topic: 'prob',
      q: { ru: 'Для чего в первую очередь применяется формула Байеса?', kz: 'Байес формуласы негізінен не үшін қолданылады?', en: "What is Bayes' formula primarily used for?" },
      a: {
        ru: ['Для обновления вероятностей гипотез при получении новых фактов', 'Для сложения независимых вероятностей', 'Для расчёта факториала', 'Для интегрирования распределений'],
        kz: ['Жаңа деректер келгенде ықтималдықтарды қайта бағалау үшін', 'Ықтималдықтарды қосу үшін', 'Факториалды есептеу үшін', 'Интегралдау үшін'],
        en: ['Updating hypothesis probabilities when new empirical evidence arrives', 'Summing independent chances', 'Computing factorials', 'Integrating continuous curves']
      },
      c: 0
    },
    {
      topic: 'prob',
      q: { ru: 'Число C(n, k) обозначает:', kz: 'C(n, k) саны нені білдіреді:', en: 'The notation C(n, k) denotes:' },
      a: {
        ru: ['Число сочетаний (порядок не важен)', 'Число размещений (порядок важен)', 'Число перестановок', 'Факториал разности'],
        kz: ['Терулер саны (реті маңызды емес)', 'Орналастырулар саны (реті маңызды)', 'Орын ауыстырулар', 'Айырманың факториалы'],
        en: ['Combinations (order does not matter)', 'Arrangements (order matters)', 'Permutations', 'Factorial difference']
      },
      c: 0
    },
    {
      topic: 'prob',
      q: { ru: 'Математическое ожидание M(X) — это:', kz: 'Математикалық күту M(X) — бұл:', en: 'Expected value M(X) is:' },
      a: {
        ru: ['Средневзвешенное теоретическое значение случайной величины', 'Мера разброса данных', 'Наиболее частое значение (мода)', 'Квадратный корень из дисперсии'],
        kz: ['Кездейсоқ шаманың салмақталған орташа теориялық мәні', 'Шашырау өлшемі', 'Ең жиі мән (мода)', 'Дисперсияның түбірі'],
        en: ['Weighted theoretical mean value of a random variable', 'Measure of variance scatter', 'Most frequent observation (mode)', 'Standard deviation square root']
      },
      c: 0
    },
    {
      topic: 'prob',
      q: { ru: 'Вычислите факториал 5! :', kz: '5! факториалын есептеңіз:', en: 'Calculate factorial 5! :' },
      a: {
        ru: ['120', '24', '60', '720'],
        kz: ['120', '24', '60', '720'],
        en: ['120', '24', '60', '720']
      },
      c: 0
    }
  ]
};
