import { Language } from '../lib/storage';

export interface WhyItWorksStep {
  stepNumber: number;
  title: Record<Language, string>;
  formula: string;
  explanation: Record<Language, string>;
  annotation?: Record<Language, string>;
}

export interface WhyItWorksTopic {
  id: string;
  badge: string;
  title: Record<Language, string>;
  origin: {
    author: string;
    era: string;
    story: Record<Language, string>;
  };
  visualProofDescription: Record<Language, string>;
  visualProofType: 'square_completion' | 'unit_circle' | 'secant_to_tangent' | 'parallelogram_area' | 'euler_spiral' | 'bayes_venn';
  steps: WhyItWorksStep[];
  practicalApplication: Record<Language, string>;
}

export const WHY_IT_WORKS_DATA: Record<string, WhyItWorksTopic> = {
  quadratic: {
    id: 'quadratic',
    badge: 'Алгебра',
    title: {
      ru: 'Вывод формулы корней: метод дополнения до полного квадрата',
      kz: 'Түбірлер формуласын қорыту: толық квадратқа дейін толықтыру әдісі',
      en: 'Deduction of the Quadratic Formula: Completing the Square'
    },
    origin: {
      author: 'Аль-Хорезми (Багдад) и Франсуа Виет',
      era: 'IX – XVI века н.э.',
      story: {
        ru: 'В 820 году Мухаммад аль-Хорезми в трактате «Аль-Китаб аль-мухтасар» показал геометрический способ решения: брался физический квадрат со стороной x, к нему пристраивались прямоугольники площади (b/2)x, а пустующий уголок (b/2)² заполнялся для получения идеального квадрата. Позже Франсуа Виет обобщил метод для произвольных коэффициентов a, b, c.',
        kz: '820 жылы Мұхаммед әл-Хорезми өзінің «Әл-Китаб әл-мұхтасар» трактатында геометриялық шешу әдісін көрсетті: қабырғасы x болатын квадрат алынып, оған ауданы (b/2)x тіктөртбұрыштар жалғанды, ал бос бұрышы толық квадрат құру үшін (b/2)² көлемінде толтырылды.',
        en: 'In 820 CE, Muhammad ibn Musa al-Khwarizmi published a geometric method in Baghdad: taking a square of side x, adding rectangles of area (b/2)x, and completing the missing corner with area (b/2)². Later, François Viète formalized it algebraically for any coefficients a, b, c.'
      }
    },
    visualProofDescription: {
      ru: 'Геометрически уравнение ax² + bx + c = 0 сводится к перестройке площади. Мы берём квадрат x² и две половинки полосы шириной b/(2a). Чтобы собрать большой квадрат со стороной (x + b/(2a)), не хватает маленького квадратика площади (b/(2a))². Добавляя его к обеим частям, мы «сворачиваем» формулу в точный квадрат.',
      kz: 'Геометриялық түрде ax² + bx + c = 0 теңдеуі ауданды қайта құруға келеді. (x + b/(2a)) үлкен квадратын жинау үшін жетпей тұрған (b/(2a))² бұрышын екі жаққа да қосамыз.',
      en: 'Geometrically, completing the square transforms area. We take square x² and two side strips of width b/(2a). To assemble a larger square of side (x + b/(2a)), we add the missing corner (b/(2a))² to both sides.'
    },
    visualProofType: 'square_completion',
    steps: [
      {
        stepNumber: 1,
        title: {
          ru: 'Исходный вид и нормировка',
          kz: 'Бастапқы түр және нормалау',
          en: 'Initial Equation & Normalization'
        },
        formula: 'ax^2 + bx + c = 0 \\quad \\xrightarrow{\\div a} \\quad x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0',
        explanation: {
          ru: 'Делим всё уравнение на старший коэффициент a (где a ≠ 0), чтобы коэффициент при x² стал равен 1.',
          kz: 'x² алдындағы коэффициент 1-ге тең болуы үшін барлық теңдеуді a-ға бөлеміз (a ≠ 0).',
          en: 'Divide by the leading coefficient a (where a ≠ 0) so the leading term becomes monic x².'
        }
      },
      {
        stepNumber: 2,
        title: {
          ru: 'Перенос свободного члена',
          kz: 'Бос мүшені көшіру',
          en: 'Isolate the Linear & Quadratic Terms'
        },
        formula: 'x^2 + \\frac{b}{a}x = -\\frac{c}{a}',
        explanation: {
          ru: 'Переносим свободный член c/a в правую часть уравнения с противоположным знаком.',
          kz: 'Бос мүше c/a-ны оң жаққа қарама-қарсы таңбамен көшіреміз.',
          en: 'Move the constant term c/a to the right side with inverted sign.'
        }
      },
      {
        stepNumber: 3,
        title: {
          ru: 'Ключевой трюк: выделение квадрата суммы',
          kz: 'Басты тәсіл: қосынды квадратын бөліп алу',
          en: 'The Golden Trick: Completing the Square'
        },
        formula: 'x^2 + 2 \\cdot \\left(\\frac{b}{2a}\\right)x + \\left(\\frac{b}{2a}\\right)^2 = -\\frac{c}{a} + \\frac{b^2}{4a^2}',
        explanation: {
          ru: 'Представляем (b/a)x как удвоенное произведение 2·x·(b/(2a)). Чтобы получить формулу (x + b/(2a))², прибавляем (b/(2a))² к обеим частям!',
          kz: '(x + b/(2a))² формуласын алу үшін екі жаққа да (b/(2a))² қосамыз!',
          en: 'Represent (b/a)x as 2·x·(b/(2a)). Add (b/(2a))² to both sides to complete the perfect square binom (u + v)².'
        }
      },
      {
        stepNumber: 4,
        title: {
          ru: 'Сворачивание и общий знаменатель',
          kz: 'Жию және ортақ бөлім',
          en: 'Factor the Left & Common Denominator'
        },
        formula: '\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}',
        explanation: {
          ru: 'Левая часть сворачивается в квадрат двучлена, а в правой части приводим дроби к общему знаменателю 4a². Разность b² - 4ac и есть дискриминант D!',
          kz: 'Сол жағы екімүшенің квадратына жиналады, ал оң жағы 4a² ортақ бөліміне келеді. b² - 4ac — бұл дискриминант D!',
          en: 'The left side collapses to (x + b/(2a))², while the right side unifies over 4a². The numerator b² - 4ac is exactly the discriminant D!'
        }
      },
      {
        stepNumber: 5,
        title: {
          ru: 'Извлечение квадратного корня и финал',
          kz: 'Түбір алу және қорытынды',
          en: 'Square Root & Final Resolution'
        },
        formula: 'x + \\frac{b}{2a} = \\pm \\frac{\\sqrt{b^2 - 4ac}}{2a} \\implies x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        explanation: {
          ru: 'Извлекаем квадратный корень с учётом знака ± и вычитаем b/(2a). Получаем каноническую формулу корней!',
          kz: '± таңбасымен түбір алып, b/(2a)-ны азайтамыз. Канондық формула шықты!',
          en: 'Take square root with ± and subtract b/(2a). The universal quadratic formula is proven!'
        }
      }
    ],
    practicalApplication: {
      ru: 'Траектории полёта космических ракет и спутников (баллистика), расчёт параболических зеркал и антенн связи, оптимизация прибыли в микроэкономике (поиск вершины параболы выручки).',
      kz: 'Зымырандар мен спутниктердің баллистикалық траекториясы, параболалық антенналар, экономикадағы кірісті максималдау.',
      en: 'Orbital trajectories in astrophysics, parabolic antenna mirrors, beam reflection optics, and profit maximization parabolas in economics.'
    }
  },
  pythagoras_trig: {
    id: 'pythagoras_trig',
    badge: 'Тригонометрия',
    title: {
      ru: 'Основное тригонометрическое тождество: sin²α + cos²α = 1',
      kz: 'Негізгі тригонометриялық тепе-теңдік: sin²α + cos²α = 1',
      en: 'Fundamental Trigonometric Identity: sin²α + cos²α = 1'
    },
    origin: {
      author: 'Гиппарх Никейский и Птолемей (Александрия)',
      era: 'II век до н.э. — II век н.э.',
      story: {
        ru: 'Древнегреческие астрономы измеряли хорды в окружностях для предсказания затмений и движения планет. Позже индийские и арабские математики перешли к половинным хордам — синусу. Единичный круг связал геометрию треугольника с декартовыми координатами.',
        kz: 'Ежелгі грек астрономдары планеталар қозғалысын болжау үшін шеңбердегі хордаларды өлшеген. Кейін синус пен косинус бірлік шеңбермен байланыстырылды.',
        en: 'Ancient Greek astronomers measured chords in celestial circles to predict planetary orbits. Later, Indian and Arabic mathematicians defined half-chords, yielding modern sine and cosine on the Cartesian unit circle.'
      }
    },
    visualProofDescription: {
      ru: 'На единичной окружности радиуса R = 1 любая точка имеет координаты (cos α, sin α). Расстояние от начала координат (0,0) до точки по теореме Пифагора равно √(x² + y²) = 1. Возводя в квадрат, получаем тождество, верное для абсолютно любого угла α.',
      kz: 'Радиусы R = 1 бірлік шеңберде кез келген нүктенің координаты (cos α, sin α). Пифагор теоремасы бойынша қашықтық 1-ге тең.',
      en: 'On the unit circle with radius R = 1, any point at angle α has coordinates (cos α, sin α). The Pythagorean distance from the origin is x² + y² = R² = 1.'
    },
    visualProofType: 'unit_circle',
    steps: [
      {
        stepNumber: 1,
        title: {
          ru: 'Построение единичной окружности',
          kz: 'Бірлік шеңберді тұрғызу',
          en: 'Construct the Unit Circle'
        },
        formula: 'x^2 + y^2 = R^2, \\quad \\text{где } R = 1',
        explanation: {
          ru: 'Задаём окружность с центром в начале координат (0,0) и единичным радиусом.',
          kz: 'Координат басында центрі бар және радиусы 1-ге тең шеңбер қарастырамыз.',
          en: 'Define a circle centered at (0,0) with fixed unit radius R = 1.'
        }
      },
      {
        stepNumber: 2,
        title: {
          ru: 'Определение тригонометрических проекций',
          kz: 'Тригонометриялық проекциялар анықтамасы',
          en: 'Parametric Projections'
        },
        formula: 'x = \\cos \\alpha, \\qquad y = \\sin \\alpha',
        explanation: {
          ru: 'По определению, абсцисса точки поворота на угол α равна косинусу, а ордината — синусу.',
          kz: 'Анықтама бойынша, бұрышқа бұрылған нүктенің абсциссасы — косинус, ал ординатасы — синус.',
          en: 'By definition of the unit circle, the horizontal coordinate is cos α, and the vertical coordinate is sin α.'
        }
      },
      {
        stepNumber: 3,
        title: {
          ru: 'Подстановка в уравнение окружности',
          kz: 'Шеңбер теңдеуіне қою',
          en: 'Substitution & Pythagorean Identity'
        },
        formula: '(\\cos \\alpha)^2 + (\\sin \\alpha)^2 = 1^2 \\implies \\sin^2 \\alpha + \\cos^2 \\alpha = 1',
        explanation: {
          ru: 'Так как точка (cos α, sin α) обязана лежать на окружности радиуса 1, сумма квадратов её координат всегда равна 1.',
          kz: 'Нүкте шеңберде жатқандықтан, оның координаттарының квадраттарының қосындысы әрқашан 1-ге тең.',
          en: 'Since point (cos α, sin α) strictly lies on the circle of radius 1, the sum of their squares is invariant for all α.'
        }
      }
    ],
    practicalApplication: {
      ru: 'Компьютерная графика и разработка видеоигр (вращение 3D-моделей и кватернионы), квантовая физика (вероятность нахождения частицы в состоянии суперпозиции), цифровая обработка звука и радиосигналов (DSP).',
      kz: '3D ойындар мен компьютерлік графика, кванттық механикадағы суперпозиция, дыбысты цифрлық өңдеу.',
      en: '3D rotations and quaternion math in gaming engines, quantum mechanics superposition probabilities, and audio/signal Fast Fourier Transforms.'
    }
  },
  derivative: {
    id: 'derivative',
    badge: 'Матанализ',
    title: {
      ru: 'Геометрический смысл производной: предел секущей при Δx → 0',
      kz: 'Туындының геометриялық мағынасы: Δx → 0 кезіндегі қиюшының шегі',
      en: 'Geometric Meaning of the Derivative: Limit of Secant Lines as Δx → 0'
    },
    origin: {
      author: 'Исаак Ньютон и Готфрид Вильгельм Лейбниц',
      era: 'XVII век (1665–1684 гг.)',
      story: {
        ru: 'Ньютон искал способ рассчитать мгновенную скорость падающего яблока или планеты («флюксии»). Лейбниц исследовал геометрическую задачу: как провести касательную к произвольной гладкой кривой. Оба пришли к концепции бесконечно малых приращений.',
        kz: 'Ньютон лездік жылдамдықты есептеуді іздеді, ал Лейбниц қисыққа жанама жүргізу геометриялық есебін зерттеді.',
        en: 'Newton formulated fluxions to compute instantaneous velocity of falling bodies, while Leibniz sought the exact tangent line to curves. Both unified the concept of infinitesimal increments.'
      }
    },
    visualProofDescription: {
      ru: 'Проведём секущую прямую через точки (x, f(x)) и (x + Δx, f(x + Δx)). Её угловой коэффициент k = Δy / Δx. При приближении второй точки к первой (Δx → 0) секущая поворачивается и в пределе совпадает с касательной прямой. Тангенс её угла наклона — это в точности производная f\'(x).',
      kz: 'Екі нүкте арқылы қиюшы түзу жүргіземіз. Δx → 0 кезінде қиюшы жанамаға айналады. Оның еңіс бұрышының тангенсі — дәл туынды.',
      en: 'Draw a secant line through (x, f(x)) and (x + Δx, f(x + Δx)). Its slope is Δy / Δx. As Δx shrinks to 0, the secant pivots smoothly into the tangent line. Its slope is the exact derivative f\'(x).'
    },
    visualProofType: 'secant_to_tangent',
    steps: [
      {
        stepNumber: 1,
        title: {
          ru: 'Средняя скорость изменения (уклон секущей)',
          kz: 'Өзгерістің орташа жылдамдығы (қиюшының еңісі)',
          en: 'Average Rate of Change (Secant Slope)'
        },
        formula: 'k_{\\text{сек}} = \\frac{\\Delta y}{\\Delta x} = \\frac{f(x + \\Delta x) - f(x)}{\\Delta x}',
        explanation: {
          ru: 'Это отношение изменения функции к величине шага аргумента — средняя скорость на отрезке [x, x + Δx].',
          kz: 'Бұл функция өсімшесінің аргумент өсімшесіне қатынасы — кесіндідегі орташа жылдамдық.',
          en: 'The ratio of vertical displacement to horizontal step: the average speed over [x, x + Δx].'
        }
      },
      {
        stepNumber: 2,
        title: {
          ru: 'Предельный переход при стягивании интервала',
          kz: 'Интервалды тарылтқандағы шектік көшу',
          en: 'Infinitesimal Limit Transition'
        },
        formula: 'f\'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x + \\Delta x) - f(x)}{\\Delta x}',
        explanation: {
          ru: 'Стягиваем шаг Δx к нулю. Неопределённость 0/0 раскрывается через формулу функции.',
          kz: 'Δx қадамын нөлге ұмтылдырамыз. 0/0 анықталмағандығы ашылады.',
          en: 'Shrink step Δx towards zero. The apparent 0/0 form resolves into a finite instantaneous rate.'
        }
      },
      {
        stepNumber: 3,
        title: {
          ru: 'Уравнение касательной прямой',
          kz: 'Жанама түзудің теңдеуі',
          en: 'Equation of the Tangent Line'
        },
        formula: 'y - f(x_0) = f\'(x_0) \\cdot (x - x_0)',
        explanation: {
          ru: 'Производная задаёт точный наклон касательной: k = tan(θ) = f\'(x₀).',
          kz: 'Туынды жанаманың еңісін анықтайды: k = tan(θ) = f\'(x₀).',
          en: 'The derivative defines the exact tangent line slope: k = tan(θ) = f\'(x₀).'
        }
      }
    ],
    practicalApplication: {
      ru: 'Обучение нейросетей (градиентный спуск Backpropagation), автопилоты Tesla и дроны (расчёт ускорений и тормозных путей), моделирование эпидемий и финансовых рынков.',
      kz: 'Нейрожелілерді оқыту (кері таралу градиенттік түсуі), дрондар мен автопилоттар, қаржылық модельдеу.',
      en: 'Deep learning neural network backpropagation, autonomous drone kinematics, aerodynamic drag calculations, and quantitative finance derivative pricing.'
    }
  },
  euler: {
    id: 'euler',
    badge: 'Высшая математика',
    title: {
      ru: 'Формула Эйлера: e^(iθ) = cos θ + i sin θ и тождество e^(iπ) + 1 = 0',
      kz: 'Эйлер формуласы: e^(iθ) = cos θ + i sin θ және e^(iπ) + 1 = 0 теңдігі',
      en: "Euler's Formula: e^(iθ) = cos θ + i sin θ and identity e^(iπ) + 1 = 0"
    },
    origin: {
      author: 'Леонард Эйлер (Санкт-Петербургская академия наук)',
      era: '1748 год',
      story: {
        ru: 'В труде «Введение в анализ бесконечно малых» Эйлер связал экспоненциальную функцию с тригонометрией через комплексные числа. Тождество e^(iπ) + 1 = 0 объединяет пять фундаментальных констант математики: 0, 1, e, π, i и три базовые арифметические операции: сложение, умножение, возведение в степень.',
        kz: '1748 жылы Леонард Эйлер экспонента мен тригонометрияны кешен сандар арқылы байланыстырды. Бұл формула математиканың 5 негізгі константасын (0, 1, e, π, i) біріктіреді.',
        en: 'In 1748, Leonhard Euler unified exponentials with trigonometry using imaginary numbers. The identity e^(iπ) + 1 = 0 combines the 5 fundamental constants: 0, 1, e, π, i with addition, multiplication, and exponentiation.'
      }
    },
    visualProofDescription: {
      ru: 'На комплексной плоскости умножение на i означает поворот на 90° против часовой стрелки. При непрерывном умножении на дифференциал i·dθ точка движется по единичной окружности со скоростью 1. Интегрируя движение, получаем, что e^(iθ) — это точка на окружности с координатами (cos θ, sin θ). При θ = π мы попадаем ровно в точку -1!',
      kz: 'Кешен жазықтықта i-ге көбейту — 90°-қа бұру. Үздіксіз айналу нәтижесінде e^(iθ) нүктесі (cos θ, sin θ) бойынша шеңбер жасайды. θ = π кезінде ол дәл -1 нүктесіне келеді!',
      en: 'In the complex plane, multiplying by i is a 90° rotation. Continuous rotation at speed 1 produces the unit circle. At angle θ = π, the journey reaches exactly -1, hence e^(iπ) + 1 = 0.'
    },
    visualProofType: 'euler_spiral',
    steps: [
      {
        stepNumber: 1,
        title: {
          ru: 'Разложение экспоненты в ряд Тейлора',
          kz: 'Экспонентаны Тейлор қатарына жіктеу',
          en: 'Taylor Expansion of Exponential'
        },
        formula: 'e^z = 1 + z + \\frac{z^2}{2!} + \\frac{z^3}{3!} + \\frac{z^4}{4!} + \\frac{z^5}{5!} + \\dots',
        explanation: {
          ru: 'Ряд абсолютно сходится для любого комплексного числа z.',
          kz: 'Қатар кез келген кешен z үшін абсолютті жинақталады.',
          en: 'The series converges everywhere for any complex number z.'
        }
      },
      {
        stepNumber: 2,
        title: {
          ru: 'Подстановка мнимого аргумента z = iθ',
          kz: 'Жорамал аргументті z = iθ қою',
          en: 'Substitute Pure Imaginary z = iθ'
        },
        formula: 'e^{i\\theta} = 1 + i\\theta + \\frac{(i\\theta)^2}{2!} + \\frac{(i\\theta)^3}{3!} + \\frac{(i\\theta)^4}{4!} + \\dots',
        explanation: {
          ru: 'Используем степени мнимой единицы: i² = -1, i³ = -i, i⁴ = 1, i⁵ = i.',
          kz: 'i дәрежелерін қолданамыз: i² = -1, i³ = -i, i⁴ = 1, i⁵ = i.',
          en: 'Evaluate powers of i: i² = -1, i³ = -i, i⁴ = 1, i⁵ = i.'
        }
      },
      {
        stepNumber: 3,
        title: {
          ru: 'Группировка вещественной и мнимой частей',
          kz: 'Нақты және жорамал бөліктерді топтастыру',
          en: 'Group Real and Imaginary Components'
        },
        formula: 'e^{i\\theta} = \\underbrace{\\left(1 - \\frac{\\theta^2}{2!} + \\frac{\\theta^4}{4!} - \\dots\\right)}_{\\cos \\theta} + i \\underbrace{\\left(\\theta - \\frac{\\theta^3}{3!} + \\frac{\\theta^5}{5!} - \\dots\\right)}_{\\sin \\theta}',
        explanation: {
          ru: 'Чётные степени дают в точности ряд для cos θ, а нечётные — ряд для sin θ! Получаем e^(iθ) = cos θ + i sin θ.',
          kz: 'Жұп дәрежелер cos θ қатарын, ал тақ дәрежелер sin θ қатарын береді!',
          en: 'Even powers match the Taylor series for cos θ, odd powers match sin θ! Yielding e^(iθ) = cos θ + i sin θ.'
        }
      },
      {
        stepNumber: 4,
        title: {
          ru: 'Подстановка θ = π',
          kz: 'θ = π қою',
          en: 'Evaluate at θ = π'
        },
        formula: 'e^{i\\pi} = \\cos(\\pi) + i \\sin(\\pi) = -1 + 0 = -1 \\implies e^{i\\pi} + 1 = 0',
        explanation: {
          ru: 'Поскольку cos(π) = -1, а sin(π) = 0, получаем самое прекрасное математическое тождество в истории.',
          kz: 'cos(π) = -1 және sin(π) = 0 болғандықтан, тарихтағы ең әдемі математикалық теңдік шығады.',
          en: 'Since cos(π) = -1 and sin(π) = 0, we arrive at the most beautiful identity in science.'
        }
      }
    ],
    practicalApplication: {
      ru: 'Квантовая электродинамика (волновая функция Шрёдингера Ψ), электротехника переменного тока (метод комплексных амплитуд импеданса Z), преобразования Фурье для сжатия MP3, JPEG и 5G связи.',
      kz: 'Кванттық физикадағы Шредингер толқындық функциясы, айнымалы ток электротехникасы, 5G және JPEG қысу алгоритмдері.',
      en: 'Schrödinger wave mechanics in quantum physics, AC circuit impedance analysis, MRI scanners, and Fast Fourier transform audio/video compression.'
    }
  },
  determinant: {
    id: 'determinant',
    badge: 'Линейная алгебра',
    title: {
      ru: 'Определитель матрицы как ориентированная площадь и объём',
      kz: 'Матрица анықтауышы бағытталған аудан мен көлем ретінде',
      en: 'The Determinant as Oriented Area and Scaling Factor'
    },
    origin: {
      author: 'Габриэль Крамер и Карл Фридрих Гаусс',
      era: 'XVIII – XIX века',
      story: {
        ru: 'Изначально определитель появился как удобная комбинация коэффициентов для решения систем линейных уравнений. Однако геометрический прорыв случился, когда математики осознали: определитель — это коэффициент изменения объёма пространства при линейном преобразовании!',
        kz: 'Бастапқыда анықтауыш жүйелерді шешу үшін ойлап табылған, бірақ кейін оның сызықтық түрлендіру кезіндегі аудан немесе көлем өзгерісінің коэффициенті екені дәлелденді.',
        en: 'Originally computed as an algebraic shortcut to solve linear systems, Gauss and Cauchy discovered its true nature: the determinant measures how a linear transformation scales spatial volume.'
      }
    },
    visualProofDescription: {
      ru: 'Векторы (a, c) и (b, d) на плоскости натягивают параллелограмм. Его площадь равна разности площади большого описанного прямоугольника и нескольких отсекаемых треугольников. Алгебраический итог этой разности равен точно ad - bc. Если det = 0, параллелограмм сплющивается в прямую линию, а площадь становится нулевой (пространство схлопывается).',
      kz: '(a, c) және (b, d) векторлары параллелограмм құрайды. Оның ауданы ad - bc-ге тең. Егер det = 0 болса, параллелограмм түзуге айналып сығылады.',
      en: 'Vectors (a, c) and (b, d) define a 2D parallelogram. Subtracting outer bounding triangles leaves an exact net area of ad - bc. If det = 0, the parallelogram collapses into a 1D line.'
    },
    visualProofType: 'parallelogram_area',
    steps: [
      {
        stepNumber: 1,
        title: {
          ru: 'Базисные векторы и их преобразование',
          kz: 'Базистік векторлар және олардың түрленуі',
          en: 'Transformation of Unit Basis Vectors'
        },
        formula: 'A \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} a \\\\ c \\end{pmatrix} = \\vec{u}, \\qquad A \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} b \\\\ d \\end{pmatrix} = \\vec{v}',
        explanation: {
          ru: 'Матрица A переводит единичный квадрат единичной площади (1×1 = 1) в параллелограмм, натянутый на векторы u и v.',
          kz: 'A матрицасы ауданы 1 болатын бірлік квадратты u және v векторларындағы параллелограммға ауыстырады.',
          en: 'Matrix A transforms the unit square of area 1 into a parallelogram spanned by vectors u and v.'
        }
      },
      {
        stepNumber: 2,
        title: {
          ru: 'Вычисление площади параллелограмма',
          kz: 'Параллелограмм ауданын есептеу',
          en: 'Area Calculation via Cross Geometry'
        },
        formula: 'S = |\\vec{u}| |\\vec{v}| \\sin \\theta = ad - bc',
        explanation: {
          ru: 'Разница произведений диагоналей прямоугольника и вырезанных уголков даёт формулу ad - bc.',
          kz: 'Сыртқы тіктөртбұрыштан бұрыштарды алып тастағанда нақты ad - bc қалады.',
          en: 'Decomposing the outer bounding box and subtracting complementary triangles proves Area = ad - bc.'
        }
      },
      {
        stepNumber: 3,
        title: {
          ru: 'Смысл det = 0 и обратимости',
          kz: 'det = 0 және кері матрицаның болу мағынасы',
          en: 'Singularity and Spatial Collapse'
        },
        formula: '\\det(A) = 0 \\iff \\vec{u} \\parallel \\vec{v} \\iff \\text{Площадь схлопнулась в 0}',
        explanation: {
          ru: 'Если определитель равен 0, векторы коллинеарны, двумерная плоскость сжата в одномерную линию. Вернуть назад сжатую в 0 размерность невозможно — поэтому обратной матрицы A⁻¹ не существует!',
          kz: 'Егер det = 0 болса, векторлар параллель және жазықтық түзуге сығылады. Нольге айналған кеңістікті қайтару мүмкін емес, сондықтан кері матрица жоқ!',
          en: 'If det = 0, vectors are collinear and the 2D plane collapses into a 1D line. Information is irreversibly crushed, which is why no inverse matrix A⁻¹ exists.'
        }
      }
    ],
    practicalApplication: {
      ru: '3D-движки Unreal Engine и Blender (масштабирование и деформация полигональных сеток), расчёт устойчивости строительных мостов и конструкций, фильтрация шума в сенсорах (фильтр Калмана).',
      kz: '3D ойын қозғалтқыштары, робототехникадағы Калман сүзгісі, көпірлер мен құрылыстардың төзімділігін есептеу.',
      en: 'Mesh deformation and scaling in Unreal Engine / Blender, structural integrity of bridges in CAD, and sensory state tracking with Kalman filters.'
    }
  }
};
