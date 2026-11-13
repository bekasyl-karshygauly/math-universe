import { T, type Lecture } from './types';

export const LECTURE_12: Lecture = {
  id: "m1-l12",
  number: 12,
  title: T("Туынды және дифференциалдау ережелері", "Производная и правила дифференцирования", "Derivatives and differentiation rules"),
  summary: T("Лездік өзгеріс жылдамдығын анықтап, күрделі өрнектердің туындысын табамыз.", "Свяжем производную со скоростью и наклоном и научимся дифференцировать составные выражения.", "Connect derivatives to speed and slope and differentiate composite expressions."),
  topics: [
    T("жанама", "касательная", "tangent"),
    T("тізбекті ереже", "правило цепочки", "chain rule"),
    T("кері функция", "обратная функция", "inverse function"),
  ],
  blocks: [
    {
      kind: "h",
      text: T("Қиюшыдан жанамаға", "От секущей к касательной", "From secant to tangent"),
    },
    {
      kind: "p",
      text: T("Орташа өзгеріс жылдамдығы — екі нүктенің өсімдерінің қатынасы. Қадам нөлге ұмтылғанда осы қатынастың ақырлы шегі болса, ол туынды. Графикте бұл жанаманың көлбеулігі, қозғалыста координатаның уақыт бойынша туындысы — лездік жылдамдық.", "Средняя скорость изменения равна отношению приращений. Если при стремлении шага к нулю это отношение имеет конечный предел, получаем производную. На графике это наклон касательной, а для координаты как функции времени — мгновенная скорость.", "The average rate of change is the quotient of two increments. Its finite limit as the step tends to zero is the derivative. Geometrically it is tangent slope, and the time derivative of position is instantaneous velocity."),
    },
    {
      kind: "formula",
      tex: "f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h},\\qquad v(t)=s'(t)",
    },
    {
      kind: "h",
      text: T("Қосынды, көбейтінді және бөлінді", "Сумма, произведение и частное", "Sums, products and quotients"),
    },
    {
      kind: "formula",
      tex: "(c)'=0,\\quad (cu+v)'=cu'+v',\\quad (uv)'=u'v+uv',\\quad \\left(\\frac uv\\right)'=\\frac{u'v-uv'}{v^2}\\ (v\\ne0)",
    },
    {
      kind: "p",
      text: T("Көбейтіндіде екі көбейткіш те өзгеретіндіктен екі қосылғыш бар. Бөліндіні туындылардың бөліндісімен алмастыруға болмайды. Туындының формуласымен бірге бастапқы функцияның облысын сақтаңыз.", "В произведении меняются оба множителя, поэтому возникают два слагаемых. Для частного используют специальное правило со знаменателем v². При вычислениях сохраняйте исходную область определения.", "Both factors change in a product, giving two terms. A quotient uses its own rule with denominator v². Preserve the original domain when differentiating."),
    },
    {
      kind: "h",
      text: T("Тізбекті ереже және кері функция", "Правило цепочки и обратная функция", "Chain rule and inverse functions"),
    },
    {
      kind: "p",
      text: T("Құрамада алдымен сыртқы функцияны туындыландырып, ішкі аргументті сақтаңыз. Содан кейін ішкі функцияның туындысына көбейтіңіз. Кері функцияның туындысы үшін сәйкес нүктеде бастапқы туынды нөлден өзгеше болуы керек.", "У композиции сначала дифференцируем внешнюю функцию с сохранением внутреннего аргумента, затем умножаем на производную внутренней. Для формулы производной обратной функции исходная производная в соответствующей точке должна быть ненулевой.", "Differentiate the outer function at the inner argument, then multiply by the inner derivative. For the inverse derivative formula, the original derivative at the corresponding point must be nonzero."),
    },
    {
      kind: "formula",
      tex: "(g\\circ u)'(x)=g'(u(x))u'(x),\\qquad (f^{-1})'(y)=\\frac1{f'(f^{-1}(y))}",
    },
    {
      kind: "h",
      text: T("Негізгі туындылар кестесі", "Основные производные", "Table of basic derivatives"),
    },
    {
      kind: "formula",
      tex: "\\begin{aligned}\n(x^n)'&=nx^{n-1}\\quad(n\\in\\mathbb N), &(e^x)'&=e^x, &(a^x)'&=a^x\\ln a\\ (a>0),\\\\\n(\\ln x)'&=1/x\\ (x>0), &(\\sin x)'&=\\cos x, &(\\cos x)'&=-\\sin x,\\\\\n(\\tan x)'&=1/\\cos^2x\\ (\\cos x\\ne0), &(\\arcsin x)'&=1/\\sqrt{1-x^2}\\ (|x|<1).\n\\end{aligned}",
    },
    {
      kind: "p",
      text: T("Кез келген нақты α үшін x > 0 облысында (xᵅ)′ = αxᵅ⁻¹. Түбір функциясы нөлде анықталғанымен, онда ақырлы туындысы болмауы мүмкін. Дифференциалдану үзіліссіздікті береді; кері тұжырымға |x| нөлдегі қарсы мысал.", "Для любого действительного α на x > 0 верно (xᵅ)′ = αxᵅ⁻¹. Функция может быть определена в граничной точке без конечной производной там. Дифференцируемость влечёт непрерывность. Непрерывный |x| при x = 0 даёт контрпример к обратному утверждению.", "For any real α on x > 0, (xᵅ)′ = αxᵅ⁻¹. A function can be defined at an endpoint without a finite derivative there. Differentiability implies continuity. The continuous |x| at zero is a counterexample to the converse."),
    },
  ],
  deepDive: [
    {
      id: "difference-quotient",
      title: T("x² туындысын анықтамадан шығару", "Вывод производной x² по определению", "Deriving the derivative of x²"),
      summary: T("Өсімдер қатынасын ықшамдаймыз.", "Упростим разностное отношение.", "Simplify the difference quotient."),
      blocks: [
        {
          kind: "formula",
          tex: "\\frac{(x+h)^2-x^2}{h}=2x+h\\quad(h\\ne0),\\qquad \\lim_{h\\to0}(2x+h)=2x",
        },
        {
          kind: "p",
          text: T("Қиюшының көлбеулігі 2x+h, жанаманікі 2x. h таңбасы ауысса да, шек сол күйінде. Ал |x| үшін нөлде сол жақ қатынас −1, оң жақ +1, сондықтан туынды жоқ.", "Секущая имеет наклон 2x+h, касательная — 2x. Знак h на предел не влияет. Для |x| в нуле левая разностная дробь равна −1, правая равна +1, поэтому производной нет.", "The secant slope is 2x+h and the tangent slope is 2x. The sign of h does not change the limit. For |x| at zero the left quotient is −1 and the right quotient is +1, so the derivative does not exist."),
        },
      ],
    },
    {
      id: "chain-local-change",
      title: T("Тізбекті ереженің мағынасы", "Почему в правиле цепочки множители перемножаются", "Why the chain rule multiplies rates"),
      summary: T("Ішкі және сыртқы шағын өзгерістерді байланыстырамыз.", "Свяжем малые изменения на двух этапах.", "Connect small changes through two stages."),
      blocks: [
        {
          kind: "p",
          text: T("u ішкі функциясы x өсімін шамамен u′(x) есе өзгертеді. g сыртқы функциясы алынған өсімді тағы g′(u) есе өзгертеді. Мысалы, sin(3x) ішінде бұрыш x-тен үш есе жылдам өзгереді.", "Внутренняя функция u масштабирует малое приращение примерно в u′(x) раз. Внешняя g масштабирует получившееся приращение ещё в g′(u) раз. В sin(3x) аргумент синуса меняется втрое быстрее x.", "The inner function u scales a small increment by roughly u′(x). The outer function g scales that increment by g′(u). In sin(3x) the sine argument changes three times as fast as x."),
        },
        {
          kind: "formula",
          tex: "(\\sin(3x))'=3\\cos(3x),\\qquad (\\ln(1+x^2))'=\\frac{2x}{1+x^2}",
        },
      ],
    },
  ],
  practice: {
    sessions: "23–25",
    goal: T("Өрнек құрылымына сай ереже таңдап, нүктедегі туындыны есептеу.", "Выбрать правило по структуре выражения и вычислить производную в точке.", "Choose rules based on expression structure and evaluate at a point."),
    questions: [
      T("Неліктен sin(x²) туындысында 2x бар?", "Почему в производной sin(x²) возникает множитель 2x?", "Why does the derivative of sin(x²) contain a factor 2x?"),
    ],
    examples: [
      {
        title: T("Бөлінді мен құрама функция", "Частное и композиция", "Quotient and composition"),
        task: T("Туындыны және оның x = 1 нүктесіндегі мәнін табыңыз.", "Найдите производную и её значение при x = 1.", "Find the derivative and its value at x = 1."),
        given: "f(x)=\\frac{(2x+1)^2}{x+1}",
        steps: [
          {
            tex: "u'=(2x+1)\\cdot4,\\quad v'=1",
          },
          {
            tex: "f'(x)=\\frac{4(2x+1)(x+1)-(2x+1)^2}{(x+1)^2}",
          },
          {
            tex: "f'(1)=\\frac{24-9}{4}=\\tfrac{15}{4}",
          },
        ],
        added: true,
      },
      {
        title: T("Лездік жылдамдық", "Мгновенная скорость", "Instantaneous velocity"),
        task: T("Екі секундтағы жылдамдықты табыңыз.", "Найдите скорость через две секунды.", "Find the velocity after two seconds."),
        given: "s(t)=3t^2-2t+5",
        steps: [
          {
            tex: "v(t)=s'(t)=6t-2",
          },
          {
            tex: "v(2)=6\\cdot2-2=10",
          },
        ],
        added: true,
      },
    ],
  },
  selfCheck: [
    {
      q: T("f′(a) = 0 болса, жанама қандай?", "Какова касательная при f′(a) = 0?", "What is the tangent when f′(a) = 0?"),
      a: T("Көлденең, себебі көлбеулігі нөл.", "Горизонтальная, поскольку её наклон равен нулю.", "Horizontal, because its slope is zero."),
    },
  ],
  test: [
    {
      q: T("$(\\sin(2x))'=?$", "$(\\sin(2x))'=?$", "$(\\sin(2x))'=?$"),
      options: [
        T("$2\\cos(2x)$", "$2\\cos(2x)$", "$2\\cos(2x)$"),
        T("$\\cos(2x)$", "$\\cos(2x)$", "$\\cos(2x)$"),
        T("$-2\\sin(2x)$", "$-2\\sin(2x)$", "$-2\\sin(2x)$"),
      ],
      correct: 0,
      explain: T("$(\\sin(2x))'=\\cos(2x)\\cdot2$", "$(\\sin(2x))'=\\cos(2x)\\cdot2$", "$(\\sin(2x))'=\\cos(2x)\\cdot2$"),
    },
    {
      q: T("$(x e^x)'=?$", "$(x e^x)'=?$", "$(x e^x)'=?$"),
      options: [
        T("$(1+x)e^x$", "$(1+x)e^x$", "$(1+x)e^x$"),
        T("$xe^x$", "$xe^x$", "$xe^x$"),
        T("$e^x$", "$e^x$", "$e^x$"),
      ],
      correct: 0,
      explain: T("$1\\cdot e^x+x e^x=(1+x)e^x$", "$1\\cdot e^x+x e^x=(1+x)e^x$", "$1\\cdot e^x+x e^x=(1+x)e^x$"),
    },
    {
      q: T("|x| нөлде дифференциалдана ма?", "Дифференцируем ли |x| в нуле?", "Is |x| differentiable at zero?"),
      options: [
        T("Жоқ", "Нет", "No"),
        T("0", "0", "0"),
        T("1", "1", "1"),
      ],
      correct: 0,
      explain: T("Сол және оң разностық қатынастар −1 және 1.", "Односторонние разностные отношения равны −1 и 1.", "The one-sided difference quotients are −1 and 1."),
    },
    {
      q: T("f(2)=5 және f′(2)=4. Кері функцияның 5-тегі туындысы қандай?", "f(2)=5 и f′(2)=4. Какова производная обратной в точке 5?", "f(2)=5 and f′(2)=4. What is the inverse derivative at 5?"),
      options: [
        T("$1/4$", "$1/4$", "$1/4$"),
        T("4", "4", "4"),
        T("$1/5$", "$1/5$", "$1/5$"),
      ],
      correct: 0,
      explain: T("$(f^{-1})'(5)=1/f'(2)=1/4$", "$(f^{-1})'(5)=1/f'(2)=1/4$", "$(f^{-1})'(5)=1/f'(2)=1/4$"),
    },
  ],
  trainers: [
    "derivative-value",
  ],
  related: [
    {
      courseId: "calc",
      lessonId: "derivative",
    },
  ],
};

export const LECTURE_13: Lecture = {
  id: "m1-l13",
  number: 13,
  title: T("Айқындалмаған туынды және дифференциал", "Неявные и параметрические производные. Дифференциал", "Implicit and parametric derivatives. Differentials"),
  summary: T("Теңдеумен не параметрмен берілген қисықты дифференциалдап, сызықтық жуықтау жасаймыз.", "Найдём производные кривых, заданных уравнением или параметром, и применим линейное приближение.", "Differentiate curves defined by equations or parameters and apply linear approximation."),
  topics: [
    T("айқындалмаған функция", "неявная функция", "implicit function"),
    T("параметр", "параметр", "parameter"),
    T("дифференциал", "дифференциал", "differential"),
  ],
  blocks: [
    {
      kind: "h",
      text: T("Айқындалмаған дифференциалдау", "Неявное дифференцирование", "Implicit differentiation"),
    },
    {
      kind: "p",
      text: T("F(x,y)=0 теңдеуінде y-ті x-ке тәуелді деп қараймыз. y бар әр мүшені туындыландырғанда тізбекті ережені қолданамыз. Fᵧ нөлден өзгеше болса, y′-ті бірмәнді табамыз. Fᵧ = 0 болса, бұл формула жарамсыз: жанаманы бөлек тексеру керек.", "В уравнении F(x,y)=0 считаем y функцией x. При дифференцировании слагаемых с y применяем правило цепочки. При Fᵧ ≠ 0 можно выразить y′. Если Fᵧ = 0, формула не применима, и касательную нужно исследовать отдельно.", "In F(x,y)=0, treat y as a function of x and apply the chain rule to terms containing it. If Fᵧ ≠ 0, solve for y′. When Fᵧ = 0 the formula fails and the tangent needs separate analysis."),
    },
    {
      kind: "formula",
      tex: "F_x+F_y y'=0,\\qquad y'=-F_x/F_y\\quad(F_y\\ne0)",
    },
    {
      kind: "h",
      text: T("Параметрлік туынды және үдеу", "Параметрическая производная и ускорение", "Parametric derivatives and acceleration"),
    },
    {
      kind: "p",
      text: T("x(t) пен y(t) бір параметрмен берілсе, олардың t бойынша туындыларының қатынасы график көлбеулігін береді. Екінші туынды үшін бірінші нәтижені t бойынша туындыландырып, қайтадан x′(t)-ге бөлеміз. Орынның уақыт бойынша екінші туындысы — үдеу.", "Если x(t) и y(t) заданы одним параметром, наклон равен отношению их производных по t. Для второй производной дифференцируем первый результат по t и снова делим на x′(t). Вторая производная координаты по времени — ускорение.", "For x(t) and y(t), the slope is the ratio of their t derivatives. For the second derivative, differentiate that ratio in t and divide again by x′(t). The second time derivative of position is acceleration."),
    },
    {
      kind: "formula",
      tex: "\\frac{dy}{dx}=\\frac{y'(t)}{x'(t)},\\qquad \\frac{d^2y}{dx^2}=\\frac{1}{x'(t)}\\frac{d}{dt}\\left(\\frac{y'(t)}{x'(t)}\\right)\\quad(x'(t)\\ne0)",
    },
    {
      kind: "h",
      text: T("Логарифмдік дифференциалдау", "Логарифмическое дифференцирование", "Logarithmic differentiation"),
    },
    {
      kind: "p",
      text: T("Функция оң болған аралықта екі жақтан логарифм аламыз. Бұл көбейтіндіні қосындыға, дәрежені көбейтіндіге айналдырады. Одан кейін (ln y)′ = y′/y формуласын қолданамыз.", "На интервале, где функция положительна, логарифмируем обе части. Логарифм превращает произведение в сумму, а степень в произведение. Затем используем (ln y)′ = y′/y.", "On an interval where the function is positive, take logs. This turns products into sums and powers into products. Then use (ln y)′ = y′/y."),
    },
    {
      kind: "formula",
      tex: "y=x^x,\\ x>0:\\qquad \\ln y=x\\ln x,\\qquad y'=x^x(\\ln x+1)",
    },
    {
      kind: "h",
      text: T("Дифференциал, жанама және нормаль", "Дифференциал, касательная и нормаль", "Differential, tangent and normal"),
    },
    {
      kind: "p",
      text: T("Дифференциал dy = f′(a) dx — өсімнің сызықтық бөлігі. Шағын dx үшін f(a+dx) жуық мәнін береді. Жанаманың көлбеулігі m = f′(a). m ≠ 0 болса, нормаль көлбеулігі −1/m; m = 0 болса, нормаль тік. Жоғары ретті туындылар алдыңғы туындыны қайта дифференциалдау арқылы табылады.", "Дифференциал dy = f′(a) dx — линейная часть приращения. При малом dx он даёт приближение для f(a+dx). Наклон касательной равен m = f′(a). При m ≠ 0 нормаль имеет наклон −1/m, а при m = 0 она вертикальна. Производные высших порядков получаются повторным дифференцированием.", "The differential dy = f′(a) dx is the linear part of the increment, giving an approximation for small dx. The tangent slope is m = f′(a). The normal has slope −1/m for m ≠ 0 and is vertical when m = 0. Higher derivatives come from repeated differentiation."),
    },
    {
      kind: "formula",
      tex: "f(a+h)=f(a)+f'(a)h+o(h),\\qquad y-f(a)=f'(a)(x-a)",
    },
  ],
  deepDive: [
    {
      id: "implicit-circle-curvature",
      title: T("Шеңбердің екінші туындысы", "Вторая производная окружности", "Second derivative of a circle"),
      summary: T("y-ті ашпай көлбеуліктің өзгерісін табамыз.", "Найдём изменение наклона без явного выражения y.", "Find how the slope changes without solving for y."),
      blocks: [
        {
          kind: "formula",
          tex: "x^2+y^2=R^2\\quad\\Longrightarrow\\quad x+yy'=0",
        },
        {
          kind: "formula",
          tex: "1+(y')^2+yy''=0\\quad\\Longrightarrow\\quad y''=-\\frac{1+(y')^2}{y}=-\\frac{R^2}{y^3}\\quad(y\\ne0)",
        },
        {
          kind: "p",
          text: T("Жоғарғы тармақта y > 0, сондықтан y″ < 0. Төменгі тармақта белгі керісінше. y = 0 кезінде x-ке тәуелді тармақтың жанамасы тік.", "На верхней ветви y > 0, поэтому y″ < 0. На нижней знак противоположный. При y = 0 касательная к окружности вертикальна.", "On the upper branch y > 0, so y″ < 0. The lower branch has the opposite sign. At y = 0 the tangent is vertical."),
        },
      ],
    },
    {
      id: "linearization-error",
      title: T("Жуықтаудың қатесі", "Как оценить качество линеаризации", "Checking a linear approximation"),
      summary: T("Квадраттық функцияда қалдықты тура есептейміз.", "Для квадратной функции найдём остаток точно.", "Compute the error exactly for a quadratic."),
      blocks: [
        {
          kind: "formula",
          tex: "(a+h)^2=a^2+2ah+h^2,\\qquad \\Delta y-dy=h^2",
        },
        {
          kind: "p",
          text: T("Қадам екі есе кішірейсе, осы мысалда қате төрт есе азаяды. Жалпы дифференциалданатын функцияда қате h-қа бөлгенде нөлге ұмтылады; нақты сандық шек үшін қосымша бағалау қажет.", "При уменьшении шага вдвое ошибка здесь становится вчетверо меньше. У произвольной дифференцируемой функции ошибка, делённая на h, стремится к нулю. Для конкретной оценки ошибки нужны дополнительные сведения.", "Halving the step makes this error one quarter as large. For a general differentiable function, error divided by h tends to zero. A numerical bound needs additional information."),
        },
      ],
    },
  ],
  practice: {
    sessions: "23–25",
    goal: T("Көлбеулікті және жуық мәнді есептеу.", "Находить наклон кривой и приближённое значение функции.", "Compute curve slopes and approximate function values."),
    questions: [
      T("Параметрлік қисықта x′(t)=0 болса, неге бірден бөлуге болмайды?", "Почему нельзя делить на x′(t), если она равна нулю?", "Why can we not divide by x′(t) when it is zero?"),
    ],
    examples: [
      {
        title: T("Шеңберге жанама", "Касательная к окружности", "Tangent to a circle"),
        task: T("Берілген нүктедегі жанама теңдеуін табыңыз.", "Запишите касательную в заданной точке.", "Find the tangent equation at the given point."),
        given: "x^2+y^2=25,\\qquad P=(3,4)",
        steps: [
          {
            tex: "2x+2yy'=0",
          },
          {
            tex: "y'(3)=-3/4",
          },
          {
            tex: "y-4=-\\tfrac34(x-3)",
          },
        ],
        added: true,
      },
      {
        title: T("Дифференциалмен түбірді жуықтау", "Приближение корня дифференциалом", "Approximating a root with a differential"),
        task: T("√4,1 мәнін жуықтаңыз.", "Приблизьте √4,1.", "Approximate √4.1."),
        given: "f(x)=\\sqrt x,\\qquad a=4,\\quad h=0.1",
        steps: [
          {
            tex: "f'(4)=1/(2\\sqrt4)=1/4",
          },
          {
            tex: "dy=\\tfrac14\\cdot0.1=0.025",
          },
          {
            tex: "\\sqrt{4.1}\\approx 2+0.025=2.025",
          },
        ],
        added: true,
      },
    ],
  },
  selfCheck: [
    {
      q: T("s(t) координата болса, s″(t) нені білдіреді?", "Что означает s″(t), если s(t) — координата?", "What does s″(t) mean if s(t) is position?"),
      a: T("Жылдамдықтың өзгеру қарқыны, яғни үдеу.", "Скорость изменения скорости, то есть ускорение.", "The rate of change of velocity, or acceleration."),
    },
  ],
  test: [
    {
      q: T("$x(t)=t^2,\\ y(t)=t^3,\\ t=2:\\ dy/dx=?$", "$x(t)=t^2,\\ y(t)=t^3,\\ t=2:\\ dy/dx=?$", "$x(t)=t^2,\\ y(t)=t^3,\\ t=2:\\ dy/dx=?$"),
      options: [
        T("3", "3", "3"),
        T("6", "6", "6"),
        T("12", "12", "12"),
      ],
      correct: 0,
      explain: T("$3t^2/(2t)=3t/2=3$", "$3t^2/(2t)=3t/2=3$", "$3t^2/(2t)=3t/2=3$"),
    },
    {
      q: T("$x^2+y^2=25,\\ (x,y)=(4,3):\\ y'=?$", "$x^2+y^2=25,\\ (x,y)=(4,3):\\ y'=?$", "$x^2+y^2=25,\\ (x,y)=(4,3):\\ y'=?$"),
      options: [
        T("$-4/3$", "$-4/3$", "$-4/3$"),
        T("$4/3$", "$4/3$", "$4/3$"),
        T("$-3/4$", "$-3/4$", "$-3/4$"),
      ],
      correct: 0,
      explain: T("$y'=-x/y=-4/3$", "$y'=-x/y=-4/3$", "$y'=-x/y=-4/3$"),
    },
    {
      q: T("$f'(2)=5,\\ dx=0.02:\\ dy=?$", "$f'(2)=5,\\ dx=0.02:\\ dy=?$", "$f'(2)=5,\\ dx=0.02:\\ dy=?$"),
      options: [
        T("0.1", "0.1", "0.1"),
        T("0.02", "0.02", "0.02"),
        T("5", "5", "5"),
      ],
      correct: 0,
      explain: T("$dy=f'(2)dx=0.1$", "$dy=f'(2)dx=0.1$", "$dy=f'(2)dx=0.1$"),
    },
    {
      q: T("$y=x^x,\\ x>0:\\ y'=?$", "$y=x^x,\\ x>0:\\ y'=?$", "$y=x^x,\\ x>0:\\ y'=?$"),
      options: [
        T("$x^x(\\ln x+1)$", "$x^x(\\ln x+1)$", "$x^x(\\ln x+1)$"),
        T("$x\\cdot x^{x-1}$", "$x\\cdot x^{x-1}$", "$x\\cdot x^{x-1}$"),
        T("$x^x\\ln x$", "$x^x\\ln x$", "$x^x\\ln x$"),
      ],
      correct: 0,
      explain: T("$\\ln y=x\\ln x\\ \\Rightarrow\\ y'/y=\\ln x+1$", "$\\ln y=x\\ln x\\ \\Rightarrow\\ y'/y=\\ln x+1$", "$\\ln y=x\\ln x\\ \\Rightarrow\\ y'/y=\\ln x+1$"),
    },
  ],
  trainers: [
    "implicit-slope",
  ],
  related: [
    {
      courseId: "calc",
      lessonId: "derivative",
    },
  ],
};

export const LECTURE_14: Lecture = {
  id: "m1-l14",
  number: 14,
  title: T("Дифференциалданатын функциялар туралы теоремалар", "Теоремы о дифференцируемых функциях", "Theorems on differentiable functions"),
  summary: T("Теоремалардың шарттарын тексеріп, туынды арқылы бағалау мен жуықтау жасаймыз.", "Проверим условия теорем о среднем и применим производные для оценок и приближений.", "Check mean value hypotheses and use derivatives for bounds and approximations."),
  topics: [
    T("Ферма, Ролль, Лагранж, Коши", "Ферма, Ролль, Лагранж, Коши", "Fermat, Rolle, Lagrange, Cauchy"),
    T("Тейлор формуласы", "формула Тейлора", "Taylor’s theorem"),
    T("гиперболалық функциялар", "гиперболические функции", "hyperbolic functions"),
  ],
  blocks: [
    {
      kind: "h",
      text: T("Ферма және Ролль теоремалары", "Теоремы Ферма и Ролля", "Fermat’s and Rolle’s theorems"),
    },
    {
      kind: "p",
      text: T("Ферма теоремасы бойынша ішкі экстремумда туынды бар болса, ол нөлге тең. Кері тұжырым орындалмайды, мысалы x³ нөлде өсе береді. Ролль үшін функция [a,b]-де үзіліссіз, (a,b)-де дифференциалданатын және f(a)=f(b) болуы керек. Сонда (a,b)-де туындысы нөл болатын нүкте бар.", "По теореме Ферма, если во внутренней точке экстремума существует производная, она равна нулю. Обратное неверно, например x³ продолжает расти в нуле. Для Ролля нужны непрерывность на [a,b], дифференцируемость на (a,b) и равенство значений на концах. Тогда внутри есть точка с нулевой производной.", "Fermat’s theorem gives zero derivative at an interior extremum when the derivative exists. The converse fails, for instance x³ still increases at zero. Rolle requires continuity on [a,b], differentiability on (a,b) and equal endpoints, and guarantees a zero derivative inside."),
    },
    {
      kind: "h",
      text: T("Лагранж және Коши теоремалары", "Теоремы Лагранжа и Коши", "Lagrange’s and Cauchy’s mean value theorems"),
    },
    {
      kind: "p",
      text: T("Лагранж теоремасында шеткі мәндердің теңдігі талап етілмейді. Ішкі бір нүктедегі туынды бүкіл кесіндідегі орташа өзгеріске тең. Коши теоремасы үздіксіз әрі іште дифференциалданатын екі функцияның өсімдерін салыстырады. Көбейтінді түрі нөлге бөлуден сақтайды.", "Для Лагранжа равенство значений на концах не нужно. Внутри найдётся точка, где производная равна наклону секущей. Теорема Коши сравнивает приращения двух непрерывных на отрезке и дифференцируемых внутри функций. Запись через произведения не требует деления на ноль.", "Lagrange’s theorem does not require equal endpoints. At some interior point the derivative equals the secant slope. Cauchy’s theorem compares increments of two functions continuous on the interval and differentiable inside it. The product form avoids division by zero."),
    },
    {
      kind: "formula",
      tex: "f'(c)=\\frac{f(b)-f(a)}{b-a},\\qquad [f(b)-f(a)]g'(c)=[g(b)-g(a)]f'(c),\\quad a<c<b",
    },
    {
      kind: "h",
      text: T("Тейлор формуласы және қалдық", "Формула Тейлора и остаток", "Taylor’s theorem and the remainder"),
    },
    {
      kind: "p",
      text: T("Тейлор көпмүшесі a нүктесіндегі функция мәні мен алғашқы туындыларды сәйкестендіреді. f-тің n+1 ретті туындысы a мен x арасын қамтитын аралықта үзіліссіз болса, Лагранж қалдығы қателікті бағалайды. Туындының модулі M-нен аспаса, төмендегі шекті қолданамыз.", "Многочлен Тейлора совпадает с функцией и её первыми n производными в точке a. Если производная порядка n+1 непрерывна на интервале, содержащем a и x, остаток Лагранжа оценивает ошибку. При верхней границе M для модуля этой производной получаем указанную оценку.", "A Taylor polynomial matches the value and first n derivatives at a. If the derivative of order n+1 is continuous on an interval containing a and x, the Lagrange remainder bounds the error. A bound M on that derivative’s magnitude gives the inequality below."),
    },
    {
      kind: "formula",
      tex: "f(x)=\\sum_{k=0}^n\\frac{f^{(k)}(a)}{k!}(x-a)^k+R_n,\\qquad R_n=\\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-a)^{n+1}",
    },
    {
      kind: "formula",
      tex: "|R_n|\\le \\frac{M|x-a|^{n+1}}{(n+1)!}",
    },
    {
      kind: "h",
      text: T("Гиперболалық функциялар", "Гиперболические функции", "Hyperbolic functions"),
    },
    {
      kind: "p",
      text: T("sinh — тақ және өспелі, координаталар басы арқылы өтеді. cosh — жұп, минимумы x = 0-де 1. tanh тақ, мәндері −1 мен 1 арасында және сол шектерге шексіздіктерде жақындайды. Формулаларды экспоненталарды дифференциалдау арқылы тексереміз.", "sinh нечётна, возрастает и проходит через начало координат. cosh чётна и имеет минимум 1 при x = 0. tanh нечётна, принимает значения между −1 и 1 и приближается к ним на бесконечностях. Формулы производных следуют из производной экспоненты.", "sinh is odd, increasing and passes through the origin. cosh is even with minimum 1 at zero. tanh is odd with range (−1,1) and approaches those endpoints at the respective infinities. Differentiate the exponentials to obtain the derivatives."),
    },
    {
      kind: "formula",
      tex: "\\sinh x=\\frac{e^x-e^{-x}}2,\\quad\\cosh x=\\frac{e^x+e^{-x}}2,\\quad\\tanh x=\\frac{\\sinh x}{\\cosh x}",
    },
    {
      kind: "formula",
      tex: "\\cosh^2x-\\sinh^2x=1,\\quad(\\sinh x)'=\\cosh x,\\quad(\\cosh x)'=\\sinh x,\\quad(\\tanh x)'=\\frac1{\\cosh^2x}",
    },
  ],
  deepDive: [
    {
      id: "mean-value-proof",
      title: T("Лагранж теоремасы Ролльден қалай шығады", "Как теорема Лагранжа следует из теоремы Ролля", "How Rolle implies the mean value theorem"),
      summary: T("Графиктен қиюшының теңдеуін азайтамыз.", "Вычтем из функции уравнение секущей.", "Subtract the secant line from the function."),
      blocks: [
        {
          kind: "formula",
          tex: "m=\\frac{f(b)-f(a)}{b-a},\\qquad F(x)=f(x)-[f(a)+m(x-a)]",
        },
        {
          kind: "p",
          text: T("F(a)=F(b)=0. F функциясы бастапқы үздіксіздік пен дифференциалдануды сақтайды, сондықтан Ролль бойынша F′(c)=0. Демек, f′(c)=m. Егер |f′|≤M болса, бұдан |f(b)−f(a)|≤M(b−a) шығады.", "F(a)=F(b)=0. Функция F наследует непрерывность и дифференцируемость, так что по Роллю F′(c)=0. Отсюда f′(c)=m. Если |f′|≤M, получаем оценку |f(b)−f(a)|≤M(b−a).", "F(a)=F(b)=0. The transformed function preserves continuity and differentiability, so Rolle gives F′(c)=0 and f′(c)=m. If |f′|≤M, this gives |f(b)−f(a)|≤M(b−a)."),
        },
      ],
    },
    {
      id: "lhopital-conditions",
      title: T("Лопиталь ережесінің шарттары", "Когда применимо правило Лопиталя", "When l’Hôpital’s rule applies"),
      summary: T("Алдымен анықталмағандық пен туындылар шартын тексереміз.", "Сначала проверим неопределённость и условия на производные.", "First check the indeterminate form and derivative conditions."),
      blocks: [
        {
          kind: "p",
          text: T("0/0 не ∞/∞ түрінде екі функция тесілген маңайда дифференциалданса, бөлімнің туындысы нөлден өзгеше болса және туындылар қатынасының шегі бар болса, бастапқы қатынас сол шекке ұмтылады. Алым мен бөлімді бөлек туындыландырамыз. Қайта қолданарда шарттарды қайта тексеріңіз.", "Для формы 0/0 или ∞/∞ нужны дифференцируемость обеих функций в проколотой окрестности, ненулевая производная знаменателя и существование предела отношения производных. Тогда исходное отношение имеет тот же предел. При повторном применении проверяйте условия снова.", "For 0/0 or ∞/∞, both functions must be differentiable on the punctured neighborhood, the denominator derivative must be nonzero and the derivative quotient must have a limit. Then the original quotient has that limit. Recheck the conditions before applying again."),
        },
        {
          kind: "formula",
          tex: "\\lim_{x\\to0}\\frac{e^x-1}{x}=\\lim_{x\\to0}\\frac{e^x}{1}=1",
        },
      ],
    },
  ],
  practice: {
    sessions: "23–25",
    goal: T("Теорема шарттарын жазып, нүкте не қате бағасын табу.", "Проверить условия теорем и найти искомую точку или оценку ошибки.", "Check the hypotheses and find a guaranteed point or error bound."),
    questions: [
      T("Кесіндінің ішінде бұрышы бар графикке Лагранж теоремасы міндетті түрде қолданыла ма?", "Можно ли гарантированно применить теорему Лагранжа к графику с изломом внутри отрезка?", "Can the mean value theorem be guaranteed for a graph with a corner inside the interval?"),
    ],
    examples: [
      {
        title: T("Қиюшыға параллель жанама", "Касательная, параллельная секущей", "A tangent parallel to a secant"),
        task: T("Лагранж нүктесін табыңыз.", "Найдите точку из теоремы Лагранжа.", "Find the point guaranteed by the mean value theorem."),
        given: "f(x)=x^2,\\qquad [a,b]=[1,5]",
        steps: [
          {
            text: T("Көпмүше кесіндіде үздіксіз және ішінде дифференциалданады.", "Многочлен непрерывен на отрезке и дифференцируем внутри.", "A polynomial is continuous on the interval and differentiable inside it."),
            tex: "m=(25-1)/(5-1)=6",
          },
          {
            tex: "f'(c)=2c=6",
          },
          {
            tex: "c=3\\in(1,5)",
          },
        ],
        added: true,
      },
      {
        title: T("Экспонентаны Тейлормен жуықтау", "Приближение экспоненты по Тейлору", "Approximating the exponential by Taylor’s theorem"),
        task: T("Екінші дәрежелі көпмүшемен e⁰·¹ мәнін жуықтап, қателікті бағалаңыз.", "Приблизьте e в степени 0,1 многочленом второй степени и оцените ошибку.", "Approximate e to the power 0.1 by a quadratic and bound the error."),
        given: "f(x)=e^x,\\quad a=0,\\quad x=0.1",
        steps: [
          {
            tex: "P_2(x)=1+x+x^2/2",
          },
          {
            tex: "P_2(0.1)=1+0.1+0.005=1.105",
          },
          {
            tex: "0<\\xi<0.1:\\quad |R_2|=e^\\xi(0.1)^3/6<3(0.1)^3/6=0.0005",
          },
        ],
        added: true,
      },
    ],
  },
  selfCheck: [
    {
      q: T("f′(c)=0 болса, c міндетті түрде экстремум ба?", "Гарантирует ли f′(c)=0 экстремум в c?", "Does f′(c)=0 guarantee an extremum?"),
      a: T("Жоқ. f(x)=x³ нөлде өсуді жалғастырады.", "Нет. f(x)=x³ возрастает по обе стороны от нуля.", "No. f(x)=x³ increases on both sides of zero."),
    },
  ],
  test: [
    {
      q: T("Ролль теоремасына Лагранжға қарағанда қандай қосымша шарт керек?", "Какое дополнительное условие нужно в теореме Ролля по сравнению с теоремой Лагранжа?", "Which extra hypothesis does Rolle’s theorem need compared with Lagrange’s?"),
      options: [
        T("$f(a)=f(b)$", "$f(a)=f(b)$", "$f(a)=f(b)$"),
        T("$f(a)=0$", "$f(a)=0$", "$f(a)=0$"),
        T("$f'(a)=f'(b)$", "$f'(a)=f'(b)$", "$f'(a)=f'(b)$"),
      ],
      correct: 0,
      explain: T("$f(a)=f(b)$", "$f(a)=f(b)$", "$f(a)=f(b)$"),
    },
    {
      q: T("$f(x)=x^2,\\ [0,6]:\\ f'(c)=(f(6)-f(0))/6.\\ c=?$", "$f(x)=x^2,\\ [0,6]:\\ f'(c)=(f(6)-f(0))/6.\\ c=?$", "$f(x)=x^2,\\ [0,6]:\\ f'(c)=(f(6)-f(0))/6.\\ c=?$"),
      options: [
        T("3", "3", "3"),
        T("6", "6", "6"),
        T("0", "0", "0"),
      ],
      correct: 0,
      explain: T("$2c=36/6=6$", "$2c=36/6=6$", "$2c=36/6=6$"),
    },
    {
      q: T("$(\\cosh x)'=?$", "$(\\cosh x)'=?$", "$(\\cosh x)'=?$"),
      options: [
        T("$\\sinh x$", "$\\sinh x$", "$\\sinh x$"),
        T("$\\cosh x$", "$\\cosh x$", "$\\cosh x$"),
        T("$\\tanh x$", "$\\tanh x$", "$\\tanh x$"),
      ],
      correct: 0,
      explain: T("$(e^x+e^{-x})'/2=(e^x-e^{-x})/2$", "$(e^x+e^{-x})'/2=(e^x-e^{-x})/2$", "$(e^x+e^{-x})'/2=(e^x-e^{-x})/2$"),
    },
    {
      q: T("eˣ функциясының a=0 нүктесіндегі екінші дәрежелі Тейлор көпмүшесі?", "Каков многочлен Тейлора второго порядка для eˣ в a=0?", "What is the second-order Taylor polynomial of eˣ at a=0?"),
      options: [
        T("$1+x+x^2/2$", "$1+x+x^2/2$", "$1+x+x^2/2$"),
        T("$1+x+x^2$", "$1+x+x^2$", "$1+x+x^2$"),
        T("$1+x^2/2$", "$1+x^2/2$", "$1+x^2/2$"),
      ],
      correct: 0,
      explain: T("Нөлде барлық туынды бірге тең.", "В нуле все производные экспоненты равны единице.", "Every derivative of the exponential is one at zero."),
    },
  ],
  trainers: [
    "mean-value-point",
  ],
  related: [
    {
      courseId: "calc",
      lessonId: "limits",
    },
    {
      courseId: "calc",
      lessonId: "derivative",
    },
  ],
};

export const LECTURE_15: Lecture = {
  id: "m1-l15",
  number: 15,
  title: T("Функцияны туынды арқылы зерттеу", "Исследование функции с помощью производной", "Investigating a function with derivatives"),
  summary: T("Өсу мен кемуді, экстремумдарды, иілу нүктелері мен асимптоталарды бір сызбаға жинаймыз.", "Составим полную схему исследования: монотонность, экстремумы, выпуклость и асимптоты.", "Build a complete analysis of monotonicity, extrema, concavity and asymptotes."),
  topics: [
    T("монотондық", "монотонность", "monotonicity"),
    T("экстремум", "экстремум", "extremum"),
    T("иілу және асимптота", "перегиб и асимптота", "inflection and asymptotes"),
  ],
  blocks: [
    {
      kind: "h",
      text: T("Өсу, кему және сындық нүктелер", "Возрастание, убывание и критические точки", "Increasing, decreasing and critical points"),
    },
    {
      kind: "p",
      text: T("Алдымен анықталу облысын табыңыз. Оны f′=0 болатын және функция анықталғанымен f′ жоқ болатын нүктелер арқылы аралықтарға бөліңіз. f′>0 болса функция өседі, f′<0 болса кемиді. + белгісі −-ке ауысса жергілікті максимум, − белгісі +-ке ауысса жергілікті минимум.", "Сначала найдите область определения. Разбейте её точками, где f′=0 или производная не существует при определённой функции. На интервале f′>0 функция возрастает, при f′<0 убывает. Смена знака с плюса на минус даёт локальный максимум, с минуса на плюс — минимум.", "Find the domain first. Split it at points where f′=0 or f′ does not exist while the function does. The function increases where f′>0 and decreases where f′<0. A change from positive to negative gives a local maximum, the reverse a local minimum."),
    },
    {
      kind: "h",
      text: T("Кесіндідегі ең үлкен және ең кіші мәндер", "Наибольшее и наименьшее значения на отрезке", "Absolute extrema on a closed interval"),
    },
    {
      kind: "p",
      text: T("Үзіліссіз функция жабық кесіндіде екі шеткі мәнге де жетеді. Сындық нүктелердегі мәндерді кесіндінің шеттерімен салыстырыңыз. Жергілікті максимум бүкіл кесіндідегі ең үлкен мән болуы шарт емес. Ашық аралықта шекаралық мәнге функция жетпеуі мүмкін.", "Непрерывная функция на замкнутом отрезке достигает обоих абсолютных экстремумов. Сравните значения во внутренних критических точках и на концах. Локальный максимум может быть меньше значения на конце. На открытом интервале предельное значение может не достигаться.", "A continuous function on a closed interval attains both absolute extrema. Compare values at interior critical points and endpoints. A local maximum can be below an endpoint value. On an open interval a limiting value may not be attained."),
    },
    {
      kind: "h",
      text: T("Қисықтың дөңестігі және иілу", "Выпуклость и точки перегиба", "Concavity and inflection points"),
    },
    {
      kind: "p",
      text: T("f″>0 болса график ойыс жоғары, f″<0 болса ойыс төмен. Иілу нүктесінде осы қасиет өзгереді және нүкте графикке тиесілі. f″=0 теңдеуі үміткерлерді ғана береді: f(x)=x⁴ үшін нөлдің екі жағында да f″ оң.", "При f″>0 график изгибается вверх, при f″<0 вниз. В точке перегиба направление изгиба меняется, а сама точка принадлежит графику. Уравнение f″=0 даёт лишь кандидатов: у x⁴ по обе стороны нуля f″ положительна.", "If f″>0 the graph is concave up, and if f″<0 it is concave down. At an inflection point concavity changes and the point belongs to the graph. Solving f″=0 only gives candidates: for x⁴ the second derivative is positive on both sides of zero."),
    },
    {
      kind: "h",
      text: T("Тік, көлденең және көлбеу асимптоталар", "Вертикальные, горизонтальные и наклонные асимптоты", "Vertical, horizontal and oblique asymptotes"),
    },
    {
      kind: "p",
      text: T("x=a тік асимптота болуы үшін кемінде бір біржақты шек шексіз болуы керек. y=L көлденең асимптота үшін тиісті шексіздіктегі шек L-ге тең. Көлбеу асимптотаны әр бағытта бөлек тексеріңіз: f(x)−(kx+b) нөлге ұмтылуы керек.", "Для вертикальной асимптоты x=a хотя бы один односторонний предел должен быть бесконечным. Горизонтальная y=L получается из конечного предела на бесконечности. Наклонную проверяют отдельно при x → +∞ и x → −∞: разность f(x)−(kx+b) должна стремиться к нулю.", "A vertical asymptote x=a requires at least one infinite one-sided limit. A horizontal asymptote y=L comes from a finite limit at infinity. Check slant asymptotes separately at +∞ and −∞ by verifying that f(x)−(kx+b) tends to zero."),
    },
    {
      kind: "formula",
      tex: "k=\\lim_{x\\to\\pm\\infty}\\frac{f(x)}{x},\\qquad b=\\lim_{x\\to\\pm\\infty}(f(x)-kx)",
    },
    {
      kind: "p",
      text: T("Толық схема: облыс, осьтермен қиылысу, симметрия, шектер мен асимптоталар, f′ белгілері, f″ белгілері, эскиз. Соңында эскизді бірнеше есептелген нүктемен тексеріңіз.", "Полная схема: область определения, пересечения с осями, симметрия, пределы и асимптоты, знаки f′ и f″, эскиз. В конце проверьте эскиз несколькими вычисленными точками.", "The full workflow is domain, intercepts, symmetry, limits and asymptotes, signs of f′ and f″, then a sketch. Check the sketch with a few computed points."),
    },
  ],
  deepDive: [
    {
      id: "second-derivative-test",
      title: T("Екінші туынды белгісі нені білдіреді", "Почему знак второй производной помогает классифицировать экстремум", "Why the second derivative classifies an extremum"),
      summary: T("Жанама көлбеулігінің өзгеруін бақылаймыз.", "Проследим за изменением наклона касательной.", "Track how the tangent slope changes."),
      blocks: [
        {
          kind: "p",
          text: T("f′(c)=0 және f″(c)>0 болса, f′ нөлдің маңында терістен оңға ауысады. Бұл минимум. f″(c)<0 болса, максимум. f″(c)=0 кезінде қорытынды жоқ: x⁴ минимумға ие, −x⁴ максимумға, x³ экстремумға ие емес.", "При f′(c)=0 и f″(c)>0 производная меняет знак с минуса на плюс вблизи c, значит, это минимум. При f″(c)<0 получаем максимум. Нулевая вторая производная ничего не решает: у x⁴ минимум, у −x⁴ максимум, у x³ экстремума нет.", "If f′(c)=0 and f″(c)>0, the first derivative changes from negative to positive near c, giving a minimum. A negative second derivative gives a maximum. Zero is inconclusive: x⁴ has a minimum, −x⁴ a maximum and x³ neither."),
        },
      ],
    },
    {
      id: "slope-asymptote-derivation",
      title: T("Көлбеу асимптотаның коэффициенттері", "Откуда берутся коэффициенты наклонной асимптоты", "Deriving slant asymptote coefficients"),
      summary: T("Қалдықты x-ке бөлу арқылы k формуласын шығарамыз.", "Выведем формулу для k из стремящегося к нулю остатка.", "Derive k using the vanishing remainder."),
      blocks: [
        {
          kind: "p",
          text: T("f(x)=kx+b+r(x) және r→0 болса, x-ке бөлгенде b/x пен r/x нөлге ұмтылады, сондықтан f(x)/x→k. k белгілі болса, b — f(x)−kx шегі. k табылғанымен b шексіз болса, көлбеу асимптота жоқ.", "Если f(x)=kx+b+r(x) и r→0, то после деления на x члены b/x и r/x стремятся к нулю, поэтому f(x)/x→k. Затем b равен пределу f(x)−kx. Конечного k недостаточно, если остаток после вычитания kx не имеет конечного предела.", "If f(x)=kx+b+r(x) with r→0, division by x makes b/x and r/x tend to zero, giving f(x)/x→k. Then b is the limit of f(x)−kx. A finite k is insufficient if the remainder after subtracting kx has no finite limit."),
        },
        {
          kind: "formula",
          tex: "f(x)=2x+\\sqrt{x}\\quad(x>0):\\quad f(x)/x\\to2,\\quad f(x)-2x=\\sqrt{x}\\to+\\infty",
        },
      ],
    },
  ],
  practice: {
    sessions: "23–25",
    goal: T("Графиктің құрылымын есептеулермен негіздеу және оңтайландыру есебін шешу.", "Обосновать форму графика и решить задачу на оптимизацию.", "Justify the shape of a graph and solve an optimization problem."),
    questions: [
      T("Анықталмаған нүкте неге графиктің иілу нүктесі болмайды?", "Почему точка вне области определения не может быть точкой перегиба?", "Why can a point outside the domain not be an inflection point?"),
    ],
    examples: [
      {
        title: T("Рационал функцияны зерттеу", "Исследование рациональной функции", "Analyze a rational function"),
        task: T("Асимптоталарды, өсу және кему аралықтарын, экстремумдарды және иілуді анықтаңыз.", "Найдите асимптоты, интервалы монотонности, экстремумы и точки перегиба.", "Find asymptotes, monotonic intervals, extrema and inflection points."),
        given: "f(x)=x+\\frac1x",
        steps: [
          {
            tex: "D_f=\\mathbb R\\setminus\\{0\\},\\quad x=0:\\ \\lim_{x\\to0^\\pm}f(x)=\\pm\\infty,\\quad f(x)-x\\to0\\ (x\\to\\pm\\infty)",
          },
          {
            tex: "f'(x)=1-1/x^2=\\frac{(x-1)(x+1)}{x^2}",
          },
          {
            text: T("Функция (−∞,−1) және (1,+∞) аралықтарында өседі, (−1,0) және (0,1) аралықтарында кемиді. −1 нүктесінде жергілікті максимум, 1 нүктесінде жергілікті минимум бар.", "Функция возрастает на (−∞,−1) и (1,+∞), убывает на (−1,0) и (0,1). В −1 находится локальный максимум, в 1 — локальный минимум.", "It increases on (−∞,−1) and (1,+∞) and decreases on (−1,0) and (0,1). It has a local maximum at −1 and a local minimum at 1."),
            tex: "f(-1)=-2,\\qquad f(1)=2",
          },
          {
            text: T("f″ таңбасы нөлде ауысады, бірақ нөл облысқа кірмейді. Иілу нүктесі жоқ.", "Знак f″ меняется при переходе через ноль, но ноль вне области определения. Точек перегиба нет.", "The sign of f″ changes across zero, but zero is outside the domain. There is no inflection point."),
            tex: "f''(x)=2/x^3",
          },
        ],
        added: true,
      },
      {
        title: T("Тіктөртбұрыш ауданының максимумы", "Максимальная площадь прямоугольника", "Maximum area of a rectangle"),
        task: T("Периметрі 24 болатын тіктөртбұрыштың ең үлкен ауданын табыңыз.", "Найдите максимальную площадь прямоугольника периметра 24.", "Find the largest area of a rectangle with perimeter 24."),
        given: "x+y=12,\\qquad S(x)=x(12-x),\\quad 0<x<12",
        steps: [
          {
            tex: "S'(x)=12-2x=0\\quad\\Longrightarrow\\quad x=6",
          },
          {
            tex: "S(0)=S(12)=0,\\qquad S(6)=36",
          },
          {
            text: T("Шеткі нүктелер ауданы нөл болатын азғындаған жағдайлар. Максимум ішкі нүктеде алынады.", "Концы соответствуют вырожденным случаям с нулевой площадью. Максимум достигается внутри.", "The endpoints are degenerate zero-area cases. The maximum occurs in the interior."),
            tex: "x=y=6,\\qquad S_{\\max}=36",
          },
        ],
        added: true,
      },
    ],
  },
  selfCheck: [
    {
      q: T("f′ нөл бола алмайтын нүктеде экстремум болуы мүмкін бе?", "Может ли быть экстремум там, где производная не существует?", "Can an extremum occur where the derivative does not exist?"),
      a: T("Иә. |x| нөлде минимумға ие, бірақ туындысы жоқ.", "Да. У |x| в нуле минимум, хотя производной там нет.", "Yes. |x| has a minimum at zero, where its derivative does not exist."),
    },
  ],
  test: [
    {
      q: T("$f(x)=(x-2)^2+1:\\ \\arg\\min f=?$", "$f(x)=(x-2)^2+1:\\ \\arg\\min f=?$", "$f(x)=(x-2)^2+1:\\ \\arg\\min f=?$"),
      options: [
        T("2", "2", "2"),
        T("1", "1", "1"),
        T("0", "0", "0"),
      ],
      correct: 0,
      explain: T("(x−2)² теріс емес және x=2 кезінде нөлге тең.", "Квадрат (x−2)² неотрицателен и равен нулю при x=2.", "The square (x−2)² is nonnegative and vanishes at x=2."),
    },
    {
      q: T("f′ таңбасы −-тен +-ке ауысса, қандай экстремум?", "Какой экстремум при смене знака f′ с минуса на плюс?", "What extremum occurs when f′ changes from negative to positive?"),
      options: [
        T("Минимум", "Минимум", "Minimum"),
        T("Максимум", "Максимум", "Maximum"),
        T("Экстремум жоқ", "Экстремума нет", "No extremum"),
      ],
      correct: 0,
      explain: T("Функция кемуден өсуге ауысады.", "Функция переходит от убывания к возрастанию.", "The function changes from decreasing to increasing."),
    },
    {
      q: T("x⁴ графигінде x=0 иілу нүктесі ме?", "Является ли x=0 точкой перегиба x⁴?", "Is x=0 an inflection point of x⁴?"),
      options: [
        T("Жоқ", "Нет", "No"),
        T("Иә", "Да", "Yes"),
        T("Мәлімет жеткіліксіз", "Недостаточно данных", "Insufficient information"),
      ],
      correct: 0,
      explain: T("$f''(x)=12x^2$ нөлдің екі жағында да оң, сондықтан қисықтың дөңестігі өзгермейді.", "$f''(x)=12x^2$ положительна по обе стороны от нуля, поэтому направление изгиба сохраняется.", "$f''(x)=12x^2$ is positive on both sides of zero, so concavity stays the same."),
    },
    {
      q: T("f(x)=2x+1+1/x функциясының көлбеу асимптотасы?", "Какова наклонная асимптота f(x)=2x+1+1/x?", "What is the slant asymptote of f(x)=2x+1+1/x?"),
      options: [
        T("$y=2x+1$", "$y=2x+1$", "$y=2x+1$"),
        T("$y=2x$", "$y=2x$", "$y=2x$"),
        T("$y=1$", "$y=1$", "$y=1$"),
      ],
      correct: 0,
      explain: T("$f(x)-(2x+1)=1/x\\to0$", "$f(x)-(2x+1)=1/x\\to0$", "$f(x)-(2x+1)=1/x\\to0$"),
    },
  ],
  trainers: [
    "quadratic-vertex",
  ],
  related: [
    {
      courseId: "calc",
      lessonId: "derivative",
    },
  ],
};
