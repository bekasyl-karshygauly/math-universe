import { T, type Lecture } from './types';

export const LECTURE_9: Lecture = {
  id: "m1-l9",
  number: 9,
  title: T("Нақты сандар, тізбектер және функциялар", "Действительные числа, последовательности и функции", "Real numbers, sequences and functions"),
  summary: T("Сандарды жіктеп, тізбек мүшелерін табамыз және формула қай мәндерде мағыналы екенін анықтаймыз.", "Разберём числовые множества, способы задания последовательностей и область определения функции.", "Classify numbers, describe sequences and determine where a function is defined."),
  topics: [
    T("сан жиындары", "числовые множества", "number sets"),
    T("анықталу облысы", "область определения", "domain"),
    T("элементар функциялар", "элементарные функции", "elementary functions"),
  ],
  blocks: [
    {
      kind: "h",
      text: T("Нақты сандар", "Действительные числа", "Real numbers"),
    },
    {
      kind: "p",
      text: T("Натурал сандар санауға, бүтін сандар таңбалы шамаларға қолданылады. Рационал сан бүтін алым мен нөлден өзге бүтін бөлімнің қатынасы ретінде жазылады. Оның ондық жазылуы ақырлы немесе периодты. Иррационал санның ондық жазылуы шексіз әрі периодсыз.", "Натуральные числа служат для счёта, целые описывают в том числе отрицательные величины. Рациональное число записывается дробью с целыми числителем и ненулевым знаменателем. Его десятичная запись конечна или периодична. У иррационального числа она бесконечна и непериодична.", "Natural numbers count objects, and integers include negative quantities. A rational number is a ratio of integers with a nonzero denominator. Its decimal expansion terminates or repeats. An irrational decimal neither terminates nor repeats."),
    },
    {
      kind: "formula",
      tex: "\\mathbb N=\\{1,2,\\dots\\}\\subset\\mathbb Z\\subset\\mathbb Q\\subset\\mathbb R,\\qquad |\\!x-a\\!|=d(x,a)",
    },
    {
      kind: "h",
      text: T("Тізбекті қалай береміз", "Как задать последовательность", "How to define a sequence"),
    },
    {
      kind: "p",
      text: T("Тізбек натурал индекске сан сәйкестендіреді. Айқын формула кез келген мүшені бірден береді. Рекурсия келесі мүшені алдыңғысынан есептейді, сондықтан бастапқы мән қажет. Бірсарынды тізбекті көршілес мүшелерін салыстырып тексереміз.", "Последовательность сопоставляет натуральному индексу число. Явная формула сразу даёт любой член, а рекурсия вычисляет следующий по предыдущему и требует начального значения. Для проверки монотонности сравниваем соседние члены.", "A sequence assigns a number to each natural index. An explicit formula gives any term directly. A recurrence uses earlier terms and needs initial data. Compare consecutive terms to test monotonicity."),
    },
    {
      kind: "formula",
      tex: "a_n=a_1+(n-1)d\\quad\\Longleftrightarrow\\quad a_{n+1}=a_n+d\\quad(n\\ge1)",
    },
    {
      kind: "h",
      text: T("Функция, облыс және мәндер жиыны", "Функция, область определения и множество значений", "Functions, domain and range"),
    },
    {
      kind: "p",
      text: T("Функция әр рұқсат етілген кіріске бір ғана шығыс береді. Оны формуламен, кестемен, графикпен не бөліктеп беруге болады. Анықталу облысы — барлық рұқсат етілген кірістер, мәндер жиыны — іс жүзінде алынатын шығыстар. Вертикаль түзу графикті екі нүктеде қиып өтсе, ол график функцияны бермейді.", "Функция каждому допустимому входу сопоставляет ровно один выход. Её можно задать формулой, таблицей, графиком или несколькими правилами на разных интервалах. Область определения содержит допустимые входы, множество значений — получающиеся выходы. Вертикальная прямая пересекает график функции максимум в одной точке.", "A function assigns exactly one output to each allowed input. A formula, table, graph or piecewise rule can define it. The domain lists allowed inputs and the range lists outputs attained. A vertical line meets a function graph at most once."),
    },
    {
      kind: "list",
      items: [
        T("Бөлшектің бөлімі нөлден өзгеше, жұп дәрежелі түбірдің ішіндегі өрнек теріс емес, логарифм аргументі оң болуы керек. Барлық шартты қиылыстырыңыз.", "У дроби знаменатель ненулевой, под корнем чётной степени выражение неотрицательное, аргумент логарифма положительный. Пересеките все условия.", "A denominator must be nonzero, an even root needs a nonnegative radicand and a logarithm needs a positive argument. Intersect the restrictions."),
        T("Жұптық пен тақтықты тек симметриялы облыста тексеріңіз. Период үшін аргументті оң T санына жылжытқанда мән қайталанады.", "Чётность и нечётность проверяют на области, симметричной относительно нуля. Для периодичности значение повторяется при сдвиге аргумента на положительное T.", "Evenness and oddness require a domain symmetric about zero. A periodic function repeats after a positive shift T."),
      ],
    },
    {
      kind: "formula",
      tex: "f(-x)=f(x)\\quad\\text{or}\\quad f(-x)=-f(x),\\qquad f(x+T)=f(x)",
    },
    {
      kind: "h",
      text: T("Негізгі элементар функциялар", "Основные элементарные функции", "Elementary functions"),
    },
    {
      kind: "p",
      text: T("Дәрежелік, көрсеткіштік, логарифмдік, тригонометриялық және кері тригонометриялық функциялар негізгі үлгілерді береді. Көрсеткіштік функцияның мәні оң. Логарифм оның кері функциясы. Кері тригонометриялық функциялар бірмәнді болу үшін бастапқы функцияны тиісті аралықпен шектейміз.", "Степенные, показательные, логарифмические, тригонометрические и обратные тригонометрические функции дают основные формы графиков. Показательная функция принимает положительные значения, логарифм обращает её действие. Для обратных тригонометрических функций исходный график ограничивают интервалом, на котором каждое значение получается один раз.", "Power, exponential, logarithmic, trigonometric and inverse trigonometric functions give the basic graph families. Exponential outputs are positive and logarithms reverse the exponential. Inverse trigonometric functions use a restricted interval so every output has a unique input."),
    },
    {
      kind: "formula",
      tex: "a^x>0\\ (a>0),\\qquad \\log_a(a^x)=x\\ (a>0,\\ a\\ne1),\\qquad \\arcsin x\\in[-\\pi/2,\\pi/2]\\ (|x|\\le1)",
    },
  ],
  deepDive: [
    {
      id: "sqrt-two-proof",
      title: T("Неліктен √2 иррационал", "Почему √2 иррационально", "Why √2 is irrational"),
      summary: T("Қысқартылмайтын бөлшек арқылы қайшылыққа келеміз.", "Доказательство от противного через несократимую дробь.", "A contradiction using a fraction in lowest terms."),
      blocks: [
        {
          kind: "p",
          text: T("√2 санын қысқартылмайтын m/n бөлшегі деп алайық. Квадраттасақ, m² жұп, демек m жұп. m = 2k деп қойғанда n² де жұп шығады. Екі сан да 2-ге бөлінеді, бұл бөлшектің қысқартылмайтынына қайшы.", "Предположим, что √2 равно несократимой дроби m/n. Тогда m² чётно, значит, m чётно. Подстановка m = 2k показывает, что n² и n тоже чётны. Числитель и знаменатель имеют общий делитель 2, что противоречит выбору дроби.", "Suppose √2 is a reduced fraction m/n. Then m² is even, so m is even. Substituting m = 2k shows n² and n are also even. The common factor 2 contradicts the fraction being reduced."),
        },
        {
          kind: "formula",
          tex: "m^2=2n^2,\\quad m=2k\\quad\\Longrightarrow\\quad n^2=2k^2",
        },
      ],
    },
    {
      id: "restricted-inverse",
      title: T("Кері функцияға облысты шектеу", "Ограничение области для обратной функции", "Restricting a domain to invert a function"),
      summary: T("Квадраттық функцияның екі тармағын салыстырамыз.", "Сравним две ветви квадратичной функции.", "Compare the two branches of a quadratic."),
      blocks: [
        {
          kind: "p",
          text: T("y = x² формуласы бүкіл нақты осьте кері функция бермейді, себебі 2 және −2 бірдей 4 береді. x ≥ 0 тармағын таңдасақ, кері функция √y; x ≤ 0 тармағын таңдасақ, −√y. Кері функцияның анықталу облысы бастапқы функцияның мәндер жиынына тең.", "Функция y = x² на всей оси не имеет обратной функции: входы 2 и −2 дают 4. На ветви x ≥ 0 обратная функция равна √y, на ветви x ≤ 0 — −√y. Область определения обратной функции совпадает с множеством значений исходной.", "The function y = x² on the full line has no inverse because 2 and −2 both give 4. Restrict to x ≥ 0 for √y or to x ≤ 0 for −√y. The inverse’s domain is the original function’s range."),
        },
      ],
    },
  ],
  practice: {
    sessions: "18–22",
    goal: T("Шарттарды құрып, облысты және тізбек мүшелерін табу.", "Составить ограничения и найти область определения и члены последовательности.", "Set restrictions and find domains and sequence terms."),
    questions: [
      T("Неліктен түбір астындағы нөл рұқсат етіледі, ал бөлімдегі нөл рұқсат етілмейді?", "Почему ноль под корнем допустим, а в знаменателе нет?", "Why can the radicand be zero when the denominator cannot?"),
    ],
    examples: [
      {
        title: T("Түбір мен бөлшек бірге", "Корень и дробь в одной формуле", "A root and a fraction together"),
        task: T("Анықталу облысын табыңыз.", "Найдите область определения.", "Find the domain."),
        given: "f(x)=\\frac{\\sqrt{2x-1}}{x-3}",
        steps: [
          {
            tex: "2x-1\\ge0\\ \\Longrightarrow\\ x\\ge\\tfrac12",
          },
          {
            tex: "x-3\\ne0\\ \\Longrightarrow\\ x\\ne3",
          },
          {
            tex: "D_f=[\\tfrac12,3)\\cup(3,+\\infty)",
          },
        ],
        added: true,
      },
      {
        title: T("Рекурсияның алғашқы мүшелері", "Первые члены рекурсии", "First terms of a recurrence"),
        task: T("Алғашқы төрт мүшені табыңыз.", "Найдите первые четыре члена.", "Find the first four terms."),
        given: "a_1=2,\\qquad a_{n+1}=2a_n-1",
        steps: [
          {
            tex: "a_2=2\\cdot2-1=3",
          },
          {
            tex: "a_3=2\\cdot3-1=5",
          },
          {
            tex: "a_4=2\\cdot5-1=9",
          },
        ],
        added: true,
      },
    ],
  },
  selfCheck: [
    {
      q: T("sin x графигінің симметриясы қандай?", "Какая симметрия у графика sin x?", "What symmetry does sin x have?"),
      a: T("sin(−x) = −sin x, сондықтан график координаталар басына қатысты симметриялы.", "sin(−x) = −sin x, поэтому график симметричен относительно начала координат.", "Since sin(−x) = −sin x, the graph is symmetric about the origin."),
    },
  ],
  test: [
    {
      q: T("Қай сан иррационал?", "Какое число иррационально?", "Which number is irrational?"),
      options: [
        T("$\\sqrt2$", "$\\sqrt2$", "$\\sqrt2$"),
        T("$-3/4$", "$-3/4$", "$-3/4$"),
        T("$0.125$", "$0.125$", "$0.125$"),
      ],
      correct: 0,
      explain: T("√2 бүтін сандардың қатынасы ретінде жазылмайды.", "√2 не представляется отношением целых чисел.", "√2 cannot be written as a ratio of integers."),
    },
    {
      q: T("ln(3−x) функциясының анықталу облысы қандай?", "Какова область определения ln(3−x)?", "What is the domain of ln(3−x)?"),
      options: [
        T("$(-\\infty,3)$", "$(-\\infty,3)$", "$(-\\infty,3)$"),
        T("$(-\\infty,3]$", "$(-\\infty,3]$", "$(-\\infty,3]$"),
        T("$(3,+\\infty)$", "$(3,+\\infty)$", "$(3,+\\infty)$"),
      ],
      correct: 0,
      explain: T("Логарифм аргументі қатаң оң: 3−x > 0.", "Аргумент логарифма должен быть строго положительным: 3−x > 0.", "The log argument must be strictly positive: 3−x > 0."),
    },
    {
      q: T("x² + 1 функциясының мәндер жиыны қандай?", "Каково множество значений x² + 1?", "What is the range of x² + 1?"),
      options: [
        T("$[1,+\\infty)$", "$[1,+\\infty)$", "$[1,+\\infty)$"),
        T("$(1,+\\infty)$", "$(1,+\\infty)$", "$(1,+\\infty)$"),
        T("$\\mathbb R$", "$\\mathbb R$", "$\\mathbb R$"),
      ],
      correct: 0,
      explain: T("x² ≥ 0, ал 1 мәні x = 0 кезінде алынады.", "x² ≥ 0, а значение 1 достигается при x = 0.", "x² ≥ 0 and x = 0 attains 1."),
    },
    {
      q: T("a₁ = 4, aₙ₊₁ = aₙ + 3. a₄ нешеге тең?", "a₁ = 4, aₙ₊₁ = aₙ + 3. Чему равно a₄?", "If a₁ = 4 and aₙ₊₁ = aₙ + 3, what is a₄?"),
      options: [
        T("13", "13", "13"),
        T("16", "16", "16"),
        T("7", "7", "7"),
      ],
      correct: 0,
      explain: T("$a_4=4+3\\cdot3=13$", "$a_4=4+3\\cdot3=13$", "$a_4=4+3\\cdot3=13$"),
    },
  ],
  trainers: [
    "sequence-term",
  ],
  related: [
    {
      courseId: "basics",
      lessonId: "numbers",
    },
    {
      courseId: "basics",
      lessonId: "functions",
    },
  ],
};

export const LECTURE_10: Lecture = {
  id: "m1-l10",
  number: 10,
  title: T("Тізбек пен функцияның шегі", "Предел последовательности и функции", "Limits of sequences and functions"),
  summary: T("Жинақталудың анықтамасын қолданып, шектерді алгебра арқылы есептейміз.", "Разберём точный смысл сходимости и способы вычисления пределов.", "Understand convergence precisely and compute limits by algebra."),
  topics: [
    T("ε–δ анықтамасы", "определение ε–δ", "epsilon–delta definition"),
    T("шек ережелері", "свойства пределов", "limit laws"),
    T("анықталмағандық", "неопределённость", "indeterminate form"),
  ],
  blocks: [
    {
      kind: "h",
      text: T("Жинақталудың мағынасы", "Что означает сходимость", "What convergence means"),
    },
    {
      kind: "p",
      text: T("Кез келген оң ε дәлдігі үшін тізбектің белгілі бір нөмірден кейінгі барлық мүшесі L-ден ε-ге қарағанда жақын болуы керек. Функция шегінде индекстің орнына x-тің a нүктесіне жақындығын бақылаймыз. Шек x = a нүктесіндегі функция мәніне тәуелді емес.", "Для любой точности ε > 0 все члены последовательности начиная с некоторого номера должны отличаться от L меньше чем на ε. Для функции контролируем, насколько x близок к a. Значение функции в самой точке a на предел не влияет.", "For every tolerance ε > 0, all sufficiently late sequence terms must lie within ε of L. For a function, control how close x lies to a. The value at x = a does not affect the limit."),
    },
    {
      kind: "formula",
      tex: "a_n\\to L\\iff\\forall\\varepsilon>0\\ \\exists N\\ \\forall n\\ge N:\\ |a_n-L|<\\varepsilon",
    },
    {
      kind: "formula",
      tex: "\\lim_{x\\to a}f(x)=L\\iff\\forall\\varepsilon>0\\ \\exists\\delta>0:\\ 0<|x-a|<\\delta\\Rightarrow|f(x)-L|<\\varepsilon",
    },
    {
      kind: "h",
      text: T("Шек ережелері және қыспақ теоремасы", "Свойства пределов и теорема о зажатой функции", "Limit laws and the squeeze theorem"),
    },
    {
      kind: "p",
      text: T("Ақырлы шектері бар функциялардың қосындысы мен көбейтіндісінің шегі сәйкес шектерден табылады. Бөлінді ережесі бөлім шегі нөлден өзгеше болғанда ғана жарайды. Егер функция екі бірдей шегі бар функцияның арасында жатса, оның да шегі сол сан.", "Для функций с конечными пределами предел суммы и произведения получают из пределов слагаемых и множителей. В правиле частного предел знаменателя должен быть ненулевым. Если функция зажата между двумя функциями с одним и тем же пределом, она имеет этот предел.", "For finite limits, sums and products commute with taking limits. The quotient law requires a nonzero denominator limit. A function trapped between two functions with the same limit shares that limit."),
    },
    {
      kind: "formula",
      tex: "g(x)\\le f(x)\\le h(x),\\quad g(x)\\to L,\\ h(x)\\to L\\quad\\Longrightarrow\\quad f(x)\\to L",
    },
    {
      kind: "h",
      text: T("Шексіз аз, шексіз үлкен және шектелген шамалар", "Бесконечно малые, бесконечно большие и ограниченные величины", "Infinitesimal, unbounded and bounded behavior"),
    },
    {
      kind: "p",
      text: T("Шексіз аз шаманың шегі нөл. Оны шектелген функцияға көбейтсек, нәтиже де нөлге ұмтылады. f → +∞ дегеніміз f кез келген оң шектен асып кетеді. Шектелмеу бұдан әлсіз: мысалы, таңбасы кезектесіп өсетін тізбектің +∞ шегі жоқ.", "Бесконечно малая стремится к нулю. Её произведение с ограниченной функцией тоже стремится к нулю. Предел +∞ означает, что функция в итоге превосходит любую заданную границу. Неограниченность сама по себе этого не гарантирует: растущие по модулю члены могут менять знак.", "An infinitesimal tends to zero, as does its product with a bounded function. A limit of +∞ means eventually exceeding every threshold. Unboundedness alone does not imply that limit: growing magnitudes can alternate in sign."),
    },
    {
      kind: "h",
      text: T("Анықталмағандықты ашу", "Как раскрывать неопределённость", "Resolving indeterminate forms"),
    },
    {
      kind: "p",
      text: T("0/0 және ∞/∞ нәтиже емес, түрлендіру қажет екенін білдіреді. Ортақ көбейткішті қысқартыңыз, түбірлер үшін түйіндес өрнекке көбейтіңіз, шексіздіктегі рационал функция үшін алым мен бөлімді ең үлкен дәрежеге бөліңіз. Қысқарту шекке қатысты тесілген маңайда орындалады.", "Формы 0/0 и ∞/∞ указывают, что нужна дополнительная работа. Разложите на множители, умножьте на сопряжённое выражение для корней или разделите числитель и знаменатель на старшую степень при x → ∞. При сокращении достаточно равенства в проколотой окрестности.", "The forms 0/0 and ∞/∞ call for further work. Factor, multiply by a conjugate when roots occur, or divide numerator and denominator by the leading power at infinity. Cancellation only needs to hold in a punctured neighborhood."),
    },
  ],
  deepDive: [
    {
      id: "epsilon-delta-example",
      title: T("ε–δ дәлелі", "Доказательство по ε–δ", "An epsilon–delta proof"),
      summary: T("Қажетті дәлдікке δ таңдаймыз.", "Выбираем δ под заданную точность.", "Choose δ for a requested tolerance."),
      blocks: [
        {
          kind: "p",
          text: T("3x−1 функциясының x → 2 шегі 5. Қате 3|x−2|. Оны ε-нен кіші ету үшін δ = ε/3 таңдаймыз. Бұл таңдау барлық оң ε үшін жұмыс істейді.", "Предел 3x−1 при x → 2 равен 5. Ошибка составляет 3|x−2|. Чтобы она была меньше ε, выбираем δ = ε/3. Это работает при любом положительном ε.", "The limit of 3x−1 at x = 2 is 5. The error is 3|x−2|. Taking δ = ε/3 makes it less than ε for every positive ε."),
        },
        {
          kind: "formula",
          tex: "0<|x-2|<\\varepsilon/3\\quad\\Longrightarrow\\quad |(3x-1)-5|=3|x-2|<\\varepsilon",
        },
      ],
    },
    {
      id: "sequence-and-squeeze",
      title: T("Тізбек үшін N таңдау", "Как выбрать N для последовательности", "Choosing N for a sequence"),
      summary: T("Дәлдікке қажет ең кіші индексті бағалаймыз.", "Оценим, с какого номера выполняется точность.", "Find a threshold for the requested accuracy."),
      blocks: [
        {
          kind: "p",
          text: T("aₙ = 1 + 2/n үшін 1-ден қашықтық 2/n. Кез келген N > 2/ε алсақ, барлық n ≥ N үшін дәлдік сақталады. Мысалы, ε = 0,01 болса, N = 201 жарайды, себебі теңдік рұқсат етілмейді.", "У aₙ = 1 + 2/n расстояние до 1 равно 2/n. Любое целое N > 2/ε обеспечивает нужную точность для всех n ≥ N. При ε = 0,01 подходит N = 201, потому что неравенство строгое.", "For aₙ = 1 + 2/n the distance to 1 is 2/n. Any integer N > 2/ε works for every n ≥ N. For ε = 0.01, use N = 201 because the inequality is strict."),
        },
      ],
    },
  ],
  practice: {
    sessions: "18–22",
    goal: T("Өрнекке сәйкес түрлендіруді таңдау.", "Подобрать преобразование под форму предела.", "Choose the transformation that fits the limit."),
    questions: [
      T("Нөлге бөлмей ортақ көбейткішті қалай қысқартамыз?", "Почему при вычислении предела можно сократить общий множитель?", "Why can a common factor be cancelled when computing a limit?"),
    ],
    examples: [
      {
        title: T("Түйіндес өрнек", "Сопряжённое выражение", "Using a conjugate"),
        task: T("Шекті есептеңіз.", "Вычислите предел.", "Evaluate the limit."),
        given: "\\lim_{x\\to0}\\frac{\\sqrt{4+x}-2}{x}",
        steps: [
          {
            tex: "\\frac{\\sqrt{4+x}-2}{x}\\cdot\\frac{\\sqrt{4+x}+2}{\\sqrt{4+x}+2}=\\frac{x}{x(\\sqrt{4+x}+2)}",
          },
          {
            tex: "x\\ne0:\\quad \\frac{x}{x(\\sqrt{4+x}+2)}=\\frac1{\\sqrt{4+x}+2}",
          },
          {
            tex: "\\lim_{x\\to0}\\frac1{\\sqrt{4+x}+2}=\\tfrac14",
          },
        ],
        added: true,
      },
      {
        title: T("Шексіздіктегі бөлшек", "Дробь при x → ∞", "A quotient at infinity"),
        task: T("Алым мен бөлімді ең үлкен дәрежеге бөліңіз.", "Разделите числитель и знаменатель на старшую степень.", "Divide numerator and denominator by the leading power."),
        given: "\\lim_{x\\to+\\infty}\\frac{3x^2-x}{2x^2+5}",
        steps: [
          {
            tex: "\\frac{3x^2-x}{2x^2+5}=\\frac{3-1/x}{2+5/x^2}",
          },
          {
            tex: "1/x\\to0,\\quad 5/x^2\\to0",
          },
          {
            tex: "\\lim_{x\\to+\\infty}\\frac{3-1/x}{2+5/x^2}=\\tfrac32",
          },
        ],
        added: true,
      },
    ],
  },
  selfCheck: [
    {
      q: T("Шек бар болса, функция сол нүктеде анықталған ба?", "Должна ли функция быть определена в точке, если предел существует?", "Must a function be defined at the point for its limit to exist?"),
      a: T("Жоқ. Шек нүктеге жақын аргументтерге қатысты.", "Нет. Предел определяется по значениям вблизи точки.", "No. The limit depends on values near the point."),
    },
  ],
  test: [
    {
      q: T("$\\lim_{x\\to2}(x^2-4)/(x-2)$", "$\\lim_{x\\to2}(x^2-4)/(x-2)$", "$\\lim_{x\\to2}(x^2-4)/(x-2)$"),
      options: [
        T("4", "4", "4"),
        T("0", "0", "0"),
        T("2", "2", "2"),
      ],
      correct: 0,
      explain: T("$x^2-4=(x-2)(x+2)$", "$x^2-4=(x-2)(x+2)$", "$x^2-4=(x-2)(x+2)$"),
    },
    {
      q: T("$\\lim_{n\\to\\infty}(1+3/n)$", "$\\lim_{n\\to\\infty}(1+3/n)$", "$\\lim_{n\\to\\infty}(1+3/n)$"),
      options: [
        T("1", "1", "1"),
        T("3", "3", "3"),
        T("4", "4", "4"),
      ],
      correct: 0,
      explain: T("$3/n\\to0$", "$3/n\\to0$", "$3/n\\to0$"),
    },
    {
      q: T("$\\lim_{x\\to+\\infty}(2x+1)/(x^2+1)$", "$\\lim_{x\\to+\\infty}(2x+1)/(x^2+1)$", "$\\lim_{x\\to+\\infty}(2x+1)/(x^2+1)$"),
      options: [
        T("0", "0", "0"),
        T("2", "2", "2"),
        T("1", "1", "1"),
      ],
      correct: 0,
      explain: T("Бөлімнің дәрежесі үлкен. Екі бөлікті x²-қа бөліңіз.", "Степень знаменателя выше. Делим обе части на x².", "The denominator has higher degree. Divide both by x²."),
    },
    {
      q: T("g шектелген және f → 0. fg шегі қандай?", "g ограничена, f → 0. Каков предел fg?", "If g is bounded and f → 0, what is the limit of fg?"),
      options: [
        T("0", "0", "0"),
        T("1", "1", "1"),
        T("Анықталмайды", "Определить нельзя", "Cannot be determined"),
      ],
      correct: 0,
      explain: T("$|fg|\\le M|f|\\to0$", "$|fg|\\le M|f|\\to0$", "$|fg|\\le M|f|\\to0$"),
    },
  ],
  trainers: [
    "rational-limit",
  ],
  related: [
    {
      courseId: "calc",
      lessonId: "limits",
    },
  ],
};

export const LECTURE_11: Lecture = {
  id: "m1-l11",
  number: 11,
  title: T("Тамаша шектер және үзіліссіздік", "Замечательные пределы и непрерывность", "Standard limits and continuity"),
  summary: T("Тамаша шектерді қолданып, үзіліс нүктелерін жіктейміз.", "Применим замечательные пределы и научимся различать типы разрывов.", "Apply standard limits and distinguish types of discontinuity."),
  topics: [
    T("тамаша шектер", "замечательные пределы", "standard limits"),
    T("эквиваленттік", "эквивалентность", "equivalence"),
    T("біржақты шек", "односторонний предел", "one-sided limit"),
  ],
  blocks: [
    {
      kind: "h",
      text: T("Екі тамаша шек", "Два замечательных предела", "Two standard limits"),
    },
    {
      kind: "p",
      text: T("Бірінші шекте бұрыш радианмен өлшенеді. Екіншісі кіші салыстырмалы өсімнің көп рет қайталануын сипаттайды. x нөлге ұмтылғанда 1+x оң болады, сондықтан дәреже анықталған.", "В первом пределе угол измеряется в радианах. Второй описывает многократное накопление малого относительного прироста. При x → 0 основание 1+x положительно.", "The first limit measures angles in radians. The second describes repeated accumulation of a small proportional increase. As x → 0, the base 1+x is positive."),
    },
    {
      kind: "formula",
      tex: "\\lim_{x\\to0}\\frac{\\sin x}{x}=1,\\qquad \\lim_{x\\to0}(1+x)^{1/x}=e,\\qquad \\lim_{n\\to\\infty}(1+1/n)^n=e",
    },
    {
      kind: "h",
      text: T("Шексіз аздарды салыстыру", "Сравнение бесконечно малых", "Comparing infinitesimals"),
    },
    {
      kind: "p",
      text: T("f/g → 1 болса, f пен g эквивалент. f/g → 0 болса, f — g-ге қарағанда жоғары ретті шексіз аз. Эквиваленттерді көбейтінді мен бөліндіде алмастыруға болады. Айырмада жетекші мүшелер қысқаруы мүмкін, сондықтан жоғары ретті жіктеу қажет.", "Если f/g → 1, величины эквивалентны. Если f/g → 0, то f — бесконечно малая более высокого порядка, чем g. Эквиваленты можно подставлять в произведения и частные. В разности главные члены могут сократиться, тогда нужен следующий член разложения.", "When f/g → 1, the functions are asymptotically equivalent. When f/g → 0, f is of smaller order than g. Equivalent factors can replace each other in products and quotients. In a difference the leading terms can cancel, requiring a higher-order term."),
    },
    {
      kind: "formula",
      tex: "x\\to0:\\quad \\sin x\\sim x,\\quad \\tan x\\sim x,\\quad 1-\\cos x=2\\sin^2(x/2)\\sim x^2/2",
    },
    {
      kind: "h",
      text: T("Үзіліссіздік және үзіліс түрлері", "Непрерывность и виды разрывов", "Continuity and types of discontinuity"),
    },
    {
      kind: "p",
      text: T("Екі біржақты шек бар және тең болса, екіжақты шек бар. Функция нүктеде үзіліссіз болуы үшін ол сол нүктеде анықталып, мәні шегіне тең болуы керек. Бірдей ақырлы шектер және сәйкес емес мән — жойылатын үзіліс. Әртүрлі ақырлы шектер — секіріс. Бір шек шексіз не жоқ болса, үзіліс екінші текті.", "Двусторонний предел существует, когда оба односторонних предела существуют и равны. Для непрерывности значение в точке должно совпадать с пределом. Равные конечные пределы при отсутствующем или другом значении дают устранимый разрыв. Разные конечные пределы дают скачок. Бесконечный или несуществующий односторонний предел даёт разрыв второго рода.", "A two-sided limit exists when both one-sided limits exist and agree. Continuity requires the function value to equal that limit. Equal finite limits with a missing or different value give a removable discontinuity. Distinct finite limits give a jump. An infinite or nonexistent one-sided limit gives a discontinuity of the second kind."),
    },
    {
      kind: "formula",
      tex: "\\lim_{x\\to a^-}f(x)=\\lim_{x\\to a^+}f(x)=f(a)\\quad\\Longleftrightarrow\\quad f\\text{ continuous at }a",
    },
  ],
  deepDive: [
    {
      id: "sine-squeeze",
      title: T("Синустың шегі неге бірге тең", "Почему sin x / x стремится к единице", "Why sin x / x tends to one"),
      summary: T("Бірлік шеңбердегі аудандар арқылы қыспақ теоремасын қолданамыз.", "Применим теорему о зажатой функции через площади в единичной окружности.", "Use the squeeze theorem with areas in a unit circle."),
      blocks: [
        {
          kind: "p",
          text: T("0 < x < π/2 кезінде іштей сызылған үшбұрыш, сектор және сыртқы үшбұрыш аудандары sin x < x < tan x береді. Бөлгеннен кейін sin x/x екі жағы да 1-ге ұмтылатын шамалардың арасында жатады. Қатынас жұп, сондықтан сол жақтағы шек те 1.", "При 0 < x < π/2 площади внутреннего треугольника, сектора и внешнего треугольника дают sin x < x < tan x. После деления получаем зажатие между cos x и 1. Отношение чётное, поэтому слева предел тоже равен 1.", "For 0 < x < π/2, comparing the inner triangle, sector and outer triangle gives sin x < x < tan x. Dividing gives bounds cos x and 1. The quotient is even, so the left-hand limit is also one."),
        },
        {
          kind: "formula",
          tex: "\\cos x<\\frac{\\sin x}{x}<1,\\qquad \\cos x\\to1",
        },
      ],
    },
    {
      id: "intermediate-value",
      title: T("Аралық мән туралы теорема", "Теорема о промежуточном значении", "Intermediate value theorem"),
      summary: T("Теңдеуді шешпей түбірдің бар екенін көрсетеміз.", "Докажем существование корня без вычисления самого корня.", "Prove that a root exists without computing it."),
      blocks: [
        {
          kind: "p",
          text: T("Кесіндідегі үзіліссіз функция шеткі мәндерінің арасындағы әр мәнді қабылдайды. x³+x−1 функциясы [0,1] кесіндісінде үзіліссіз, шеттеріндегі мәндері −1 және 1. Демек, (0,1) ішінде кемінде бір түбір бар. Теорема түбірдің жалғыз екенін өздігінен айтпайды.", "Непрерывная на отрезке функция принимает каждое значение между значениями на концах. Для x³+x−1 на [0,1] получаем −1 и 1. Значит, внутри (0,1) есть корень. Для единственности нужен дополнительный аргумент, например строгая монотонность.", "A continuous function on an interval attains every value between its endpoint values. For x³+x−1 on [0,1] these are −1 and 1, so there is a root in (0,1). Uniqueness requires an additional argument, such as strict monotonicity."),
        },
      ],
    },
  ],
  practice: {
    sessions: "18–22",
    goal: T("Біржақты шектерді және эквиваленттерді қолдану.", "Работать с односторонними пределами и эквивалентностями.", "Use one-sided limits and asymptotic equivalences."),
    questions: [
      T("Секірісті бір нүктенің мәнін өзгертіп жоюға бола ма?", "Можно ли устранить скачок изменением значения в одной точке?", "Can changing a single point’s value remove a jump?"),
    ],
    examples: [
      {
        title: T("Синус пен тангенс қатынасы", "Отношение синуса и тангенса", "A sine–tangent quotient"),
        task: T("Шекті тамаша шек арқылы табыңыз.", "Найдите предел через замечательные пределы.", "Use standard limits to evaluate the quotient."),
        given: "\\lim_{x\\to0}\\frac{\\sin(5x)}{\\tan(2x)}",
        steps: [
          {
            tex: "\\frac{\\sin(5x)}{\\tan(2x)}=\\frac52\\cdot\\frac{\\sin(5x)}{5x}\\cdot\\frac{2x}{\\sin(2x)}\\cdot\\cos(2x)",
          },
          {
            tex: "\\frac{\\sin(5x)}{5x}\\to1,\\quad\\frac{2x}{\\sin(2x)}\\to1,\\quad\\cos(2x)\\to1",
          },
          {
            tex: "\\lim_{x\\to0}\\frac{\\sin(5x)}{\\tan(2x)}=\\tfrac52",
          },
        ],
        added: true,
      },
      {
        title: T("Үзілісті жою", "Устранение разрыва", "Removing a discontinuity"),
        task: T("Үзіліссіз болатындай k мәнін табыңыз.", "Подберите k для непрерывности.", "Choose k to make the function continuous."),
        given: "f(x)=\\begin{cases}(x^2-9)/(x-3)&x\\ne3\\\\k&x=3\\end{cases}",
        steps: [
          {
            tex: "x^2-9=(x-3)(x+3)",
          },
          {
            tex: "\\lim_{x\\to3}f(x)=\\lim_{x\\to3}(x+3)=6",
          },
          {
            tex: "f(3)=k=6",
          },
        ],
        added: true,
      },
    ],
  },
  selfCheck: [
    {
      q: T("Сол шек 2, оң шек 3. Қандай үзіліс?", "Левый предел 2, правый 3. Какой разрыв?", "Left limit 2 and right limit 3. What type?"),
      a: T("Екі шек ақырлы, бірақ тең емес. Бұл секіріс.", "Оба предела конечны, но различны. Это скачок.", "The finite limits differ, giving a jump."),
    },
  ],
  test: [
    {
      q: T("$\\lim_{x\\to0}\\sin(3x)/x$", "$\\lim_{x\\to0}\\sin(3x)/x$", "$\\lim_{x\\to0}\\sin(3x)/x$"),
      options: [
        T("3", "3", "3"),
        T("1", "1", "1"),
        T("0", "0", "0"),
      ],
      correct: 0,
      explain: T("$3\\sin(3x)/(3x)\\to3$", "$3\\sin(3x)/(3x)\\to3$", "$3\\sin(3x)/(3x)\\to3$"),
    },
    {
      q: T("$\\lim_{n\\to\\infty}(1+2/n)^n$", "$\\lim_{n\\to\\infty}(1+2/n)^n$", "$\\lim_{n\\to\\infty}(1+2/n)^n$"),
      options: [
        T("$e^2$", "$e^2$", "$e^2$"),
        T("$e$", "$e$", "$e$"),
        T("2", "2", "2"),
      ],
      correct: 0,
      explain: T("$(1+2/n)^n=\\big((1+2/n)^{n/2}\\big)^2\\to e^2$", "$(1+2/n)^n=\\big((1+2/n)^{n/2}\\big)^2\\to e^2$", "$(1+2/n)^n=\\big((1+2/n)^{n/2}\\big)^2\\to e^2$"),
    },
    {
      q: T("$\\lim_{x\\to0}(1-\\cos x)/x^2$", "$\\lim_{x\\to0}(1-\\cos x)/x^2$", "$\\lim_{x\\to0}(1-\\cos x)/x^2$"),
      options: [
        T("$1/2$", "$1/2$", "$1/2$"),
        T("1", "1", "1"),
        T("0", "0", "0"),
      ],
      correct: 0,
      explain: T("$1-\\cos x=2\\sin^2(x/2)\\sim x^2/2$", "$1-\\cos x=2\\sin^2(x/2)\\sim x^2/2$", "$1-\\cos x=2\\sin^2(x/2)\\sim x^2/2$"),
    },
    {
      q: T("Екі біржақты шек 4, ал f(a)=0. Қандай үзіліс?", "Оба односторонних предела равны 4, а f(a)=0. Какой разрыв?", "Both one-sided limits are 4, but f(a)=0. What type?"),
      options: [
        T("Жойылатын", "Устранимый", "Removable"),
        T("Секіріс", "Скачок", "Jump"),
        T("Екінші текті", "Второго рода", "Second kind"),
      ],
      correct: 0,
      explain: T("f(a)=4 деп қойғанда үзіліс жойылады.", "Если положить f(a)=4, разрыв исчезнет.", "Setting f(a)=4 restores continuity."),
    },
  ],
  trainers: [
    "continuity-parameter",
  ],
  related: [
    {
      courseId: "calc",
      lessonId: "limits",
    },
  ],
};
