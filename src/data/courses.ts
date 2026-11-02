import { Language } from '../lib/storage';

export interface LessonTier {
  summary: Record<Language, string>;
  formulas: string[];
  contentHtml: Record<Language, string>;
  interactiveHint?: Record<Language, string>;
}

export interface Lesson {
  id: string;
  icon: string;
  title: Record<Language, string>;
  whyItWorksId?: string;
  level1: LessonTier;
  level2: LessonTier;
  level3: LessonTier;
}

export interface Course {
  id: string;
  icon: string;
  title: Record<Language, string>;
  desc: Record<Language, string>;
  lessons: Lesson[];
}

export const COURSES: Course[] = [
  {
    id: 'basics',
    icon: '🧱',
    title: { ru: 'Основы', kz: 'Негіздер', en: 'Basics' },
    desc: {
      ru: 'Числа, функции, тригонометрия, логарифмы',
      kz: 'Сандар, функциялар, тригонометрия, логарифмдер',
      en: 'Numbers, functions, trig, logarithms'
    },
    lessons: [
      {
        id: 'numbers',
        icon: '📏',
        title: { ru: 'Числа и их множества', kz: 'Сандар және олардың жиындары', en: 'Numbers and their sets' },
        level1: {
          summary: {
            ru: 'Числа — фундамент математики. От простого счёта предметов до комплексных чисел.',
            kz: 'Сандар — математиканың іргетасы. Заттарды санаудан бастап кешен сандарға дейін.',
            en: 'Numbers form the foundation of math, from counting objects to complex planes.'
          },
          formulas: ['\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}'],
          contentHtml: {
            ru: `<p><b>Интуиция:</b> Числа — язык математики. Каждое расширение числового множества открывало человечеству решение новых физических задач.</p>
<div class="formula-box">$$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$$</div>
<h4>Наглядные примеры и назначение каждого множества</h4>
<div class="example-box"><b>🍎 Натуральные числа (\\(\\mathbb{N}\\)):</b> 1, 2, 3, 4, 42...<br><i>Для чего нужны:</i> счёт физических дискретных предметов (яблоки, люди, шаги). Наименьшее число — 1.</div>
<div class="example-box"><b>🌡️ Целые числа (\\(\\mathbb{Z}\\)):</b> ..., -3, -2, -1, 0, 1, 2, 3...<br><i>Для чего нужны:</i> учёт отрицательных величин (температура ниже нуля, баланс долгов, координата времени до начала эксперимента).</div>
<div class="example-box"><b>🍰 Рациональные числа (\\(\\mathbb{Q}\\)):</b> 1/2, -3/4, 0.25, 7/3...<br><i>Для чего нужны:</i> измерение долей целого (деление пиццы, взвешивание 0.5 кг, расчёт процентов). Представимы дробью p/q.</div>
<div class="example-box"><b>📐 Вещественные числа (\\(\\mathbb{R}\\)):</b> вся непрерывная прямая, включая \\(\\sqrt{2} \\approx 1.414\\), \\(\\pi \\approx 3.1415\\), \\(e \\approx 2.718\\)...<br><i>Для чего нужны:</i> измерение точных расстояний (диагональ квадрата со стороной 1 равна строго \\(\\sqrt{2}\\)).</div>
<div class="example-box"><b>⚡ Комплексные числа (\\(\\mathbb{C}\\)):</b> \\(3 + 2i\\), где \\(i^2 = -1\\).<br><i>Для чего нужны:</i> расчет фазы переменного тока в розетке, квантовая волновая функция Шрёдингера, 2D-вращения.</div>
<div class="tip-box">💡 Нажмите на кнопки множеств на карте выше или введите любое число в строку поиска, чтобы увидеть живую анимацию вхождения!</div>`,
            kz: `<p><b>Түсінік:</b> Сандар — математиканың тілі. Әрбір сан жиыны белгілі бір практикалық мәселені шешу үшін ашылған.</p>
<div class="formula-box">$$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$$</div>
<div class="example-box"><b>🍎 Натурал сандар (\\(\\mathbb{N}\\)):</b> 1, 2, 3, 4... Заттарды санау.</div>
<div class="example-box"><b>🌡️ Бүтін сандар (\\(\\mathbb{Z}\\)):</b> ..., -2, -1, 0, 1, 2... Температура мен баланс.</div>
<div class="example-box"><b>🍰 Рационал сандар (\\(\\mathbb{Q}\\)):</b> 1/2, -3/4, 0.25... Бөлшектер.</div>
<div class="example-box"><b>📐 Нақты сандар (\\(\\mathbb{R}\\)):</b> \\(\\sqrt{2}\\), \\(\\pi\\), \\(e\\)... Бүкіл сан түзуі.</div>
<div class="example-box"><b>⚡ Кешен сандар (\\(\\mathbb{C}\\)):</b> \\(a + bi\\), мұндағы \\(i^2 = -1\\). Тербелістер мен толқындар.</div>`,
            en: `<p><b>Intuition:</b> Numbers are the vocabulary of mathematics. Each set expanded human capacity to solve new physical problems.</p>
<div class="formula-box">$$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$$</div>
<div class="example-box"><b>🍎 Natural Numbers (\\(\\mathbb{N}\\)):</b> 1, 2, 3, 4... Counting discrete objects.</div>
<div class="example-box"><b>🌡️ Integers (\\(\\mathbb{Z}\\)):</b> ..., -2, -1, 0, 1, 2... Debts and temperatures.</div>
<div class="example-box"><b>🍰 Rational Numbers (\\(\\mathbb{Q}\\)):</b> 1/2, -3/4, 0.25... Exact fractional shares.</div>
<div class="example-box"><b>📐 Real Numbers (\\(\\mathbb{R}\\)):</b> \\(\\sqrt{2}\\), \\(\\pi\\), \\(e\\)... Continuous spatial measurements.</div>
<div class="example-box"><b>⚡ Complex Numbers (\\(\\mathbb{C}\\)):</b> \\(a + bi\\) where \\(i^2 = -1\\). AC circuits & quantum waves.</div>`
          }
        },
        level2: {
          summary: {
            ru: 'Теорема о несоизмеримости диагонали квадрата и строгое доказательство иррациональности √2.',
            kz: 'Квадрат диагоналының өлшенбейтіндігі және √2 иррационалдығының қатаң дәлелі.',
            en: 'Incommensurability of unit diagonals and proof of irrationality for √2.'
          },
          formulas: ['\\sqrt{2} = \\frac{p}{q} \\implies 2q^2 = p^2 \\implies p = 2k'],
          contentHtml: {
            ru: `<h4>Строгое доказательство иррациональности √2 (от противного)</h4>
<p>Предположим, что √2 рационален, то есть представим в виде несократимой дроби: \\(\\sqrt{2} = \\frac{p}{q}\\), где \\(\\gcd(p, q) = 1\\).</p>
<ol>
<li>Возводим в квадрат: \\(2 = \\frac{p^2}{q^2} \\implies p^2 = 2q^2\\).</li>
<li>Отсюда \\(p^2\\) чётно. Так как квадрат нечётного числа нечётен, само \\(p\\) обязано быть чётным: \\(p = 2k\\).</li>
<li>Подставляем: \\((2k)^2 = 2q^2 \\implies 4k^2 = 2q^2 \\implies q^2 = 2k^2\\).</li>
<li>Значит, \\(q^2\\) тоже чётно, а следовательно, и \\(q\\) чётно!</li>
<li>Противоречие: оба числа \\(p\\) и \\(q\\) чётны, то есть дробь сократима на 2. Значит, предположение неверно: \\(\\sqrt{2} \\notin \\mathbb{Q}\\).</li>
</ol>`,
            kz: `<h4>√2 иррационалдығын қарсы жору арқылы дәлелдеу</h4>
<p>√2 қысқармайтын p/q бөлшегі түрінде жазылады деп ұйғарайық: \\(\\gcd(p, q) = 1\\).</p>
<ol>
<li>Квадраттаймыз: \\(p^2 = 2q^2\\). Демек \\(p^2\\) жұп, яғни \\(p\\) жұп сан: \\(p = 2k\\).</li>
<li>Орнына қоямыз: \\(4k^2 = 2q^2 \\implies q^2 = 2k^2\\). Демек \\(q\\) да жұп сан.</li>
<li>Қайшылық: бөлшек 2-ге қысқарады, бұл шартқа қайшы. Олай болса \\(\\sqrt{2} \\notin \\mathbb{Q}\\).</li>
</ol>`,
            en: `<h4>Formal Proof by Contradiction that √2 is Irrational</h4>
<p>Assume √2 is rational: \\(\\sqrt{2} = \\frac{p}{q}\\) with \\(\\gcd(p, q) = 1\\).</p>
<ol>
<li>Square both sides: \\(p^2 = 2q^2\\). Hence \\(p^2\\) is even, so \\(p\\) is even: \\(p = 2k\\).</li>
<li>Substitute back: \\(4k^2 = 2q^2 \\implies q^2 = 2k^2\\). Thus \\(q\\) is also even.</li>
<li>Contradiction: both p and q share factor 2. Hence \\(\\sqrt{2} \\notin \\mathbb{Q}\\).</li>
</ol>`
          }
        },
        level3: {
          summary: {
            ru: 'Университетский уровень: Сечения Дедекинда, полнота поля вещественных чисел и мощность множеств (Георг Кантор).',
            kz: 'Университет деңгейі: Дедекинд қималары, нақты сандар өрісінің толықтығы және жиындар қуаты.',
            en: 'University Level: Dedekind Cuts, completeness axiom of ℝ, and Cantor diagonal argument.'
          },
          formulas: ['A \\cup B = \\mathbb{Q}, \\quad \\forall a \\in A, b \\in B: a < b', '|\\mathbb{R}| = 2^{\\aleph_0} > \\aleph_0 = |\\mathbb{N}|'],
          contentHtml: {
            ru: `<h4>Аксиоматика вещественных чисел и полнота</h4>
<p>Поле вещественных чисел \\(\\mathbb{R}\\) определяется как полное линейно упорядоченное архимедово поле. В отличие от \\(\\mathbb{Q}\\), в \\(\\mathbb{R}\\) нет «дырок».</p>
<h4>Сечение Дедекинда</h4>
<p>Вещественное число задаётся разбиением множества \\(\\mathbb{Q}\\) на два непустых класса \\((A, B)\\), где всякое число из \\(A\\) меньше всякого числа из \\(B\\), и в \\(A\\) нет наибольшего элемента.</p>
<h4>Теорема Кантора о несчётности континуума</h4>
<p>Множество вещественных чисел \\(\\mathbb{R}\\) несчётно. Доказательство через диагональный метод Кантора показывает, что мощность \\(|\\mathbb{R}| = \\mathfrak{c} = 2^{\\aleph_0}\\) строго больше мощности натуральных чисел \\(\\aleph_0\\).</p>`,
            kz: `<h4>Дедекинд қимасы және сандардың толықтығы</h4>
<p>Нақты сандар өрісі \\(\\mathbb{R}\\) толық реттелген архимедтік өріс. Рационал сандардан айырмашылығы — онда бос саңылаулар жоқ.</p>
<p>Кантордың диагональдық әдісі нақты сандар жиынының санаусыз екенін және қуаты континуум \\(2^{\\aleph_0}\\) болатынын дәлелдейді.</p>`,
            en: `<h4>Dedekind Cuts & The Completeness Axiom</h4>
<p>The real field ℝ is the unique complete ordered Archimedean field. A Dedekind cut partitions ℚ into disjoint subsets (A, B) with no supremum in A.</p>
<p>Cantor's diagonal argument proves that ℝ is uncountably infinite: \\(|\\mathbb{R}| = 2^{\\aleph_0} > \\aleph_0\\).</p>`
          }
        }
      },
      {
        id: 'functions',
        icon: '📐',
        title: { ru: 'Функции и их свойства', kz: 'Функциялар және олардың қасиеттері', en: 'Functions and their properties' },
        level1: {
          summary: {
            ru: 'Функция — однозначное соответствие между аргументом x и результатом y.',
            kz: 'Функция — x аргументі мен y нәтижесі арасындағы бірмәнді сәйкестік.',
            en: 'A function maps each input x to exactly one output y.'
          },
          formulas: ['y = f(x), \\quad D(f) \\to E(f)'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Функция — как автомат: кидаешь x, получаешь ровно один y.</p>
<div class="formula-box">$$y=f(x),\\quad D(f)\\to E(f)$$</div>
<h4>Ключевые свойства</h4><ol>
<li><b>Чётность:</b> f(−x)=f(x) — симметрия графика относительно оси Y (x², cos x).</li>
<li><b>Нечётность:</b> f(−x)=−f(x) — симметрия относительно начала координат (x³, sin x).</li>
<li><b>Монотонность:</b> строгое возрастание или убывание на интервале.</li>
<li><b>Периодичность:</b> f(x+T)=f(x); у sin x и cos x наименьший период T=2π.</li></ol>`,
            kz: `<p><b>Қарапайым тілмен:</b> Функция — бір мәнді машина: x бересің, тек бір y аласың.</p>
<div class="formula-box">$$y=f(x),\\quad D(f)\\to E(f)$$</div>
<h4>Негізгі қасиеттері</h4><ol>
<li><b>Жұптық:</b> f(−x)=f(x) — Y осіне қатысты симметриялы.</li>
<li><b>Тақтық:</b> f(−x)=−f(x) — координат басына қатысты симметриялы.</li>
<li><b>Периодтылық:</b> f(x+T)=f(x).</li></ol>`,
            en: `<p><b>In simple terms:</b> A mathematical machine mapping each input x to a unique output y.</p>
<div class="formula-box">$$y=f(x),\\quad D(f)\\to E(f)$$</div>
<h4>Properties</h4><ol>
<li><b>Even:</b> f(−x) = f(x) — symmetric across the y-axis.</li>
<li><b>Odd:</b> f(−x) = −f(x) — rotational symmetry about the origin.</li>
<li><b>Periodicity:</b> f(x+T) = f(x).</li></ol>`
          }
        },
        level2: {
          summary: {
            ru: 'Геометрические преобразования графиков, композиция функций и обратимость (инъекция, сюръекция, биекция).',
            kz: 'Графиктердің түрленуі, функциялар композициясы және биекция.',
            en: 'Graph transformations, compositions, and bijective invertibility.'
          },
          formulas: ['y = A f(k(x - a)) + b', 'f(f^{-1}(y)) = y'],
          contentHtml: {
            ru: `<h4>Универсальные аффинные преобразования графика</h4>
<p>В выражении \\(y = A f(k(x - a)) + b\\):</p>
<ul>
<li>\\(A\\) — вертикальное растяжение в \\(|A|\\) раз (если \\(A < 0\\) — отражение по горизонтали).</li>
<li>\\(k\\) — горизонтальное сжатие к оси Y в \\(|k|\\) раз.</li>
<li>\\(a\\) — горизонтальный сдвиг вправо на \\(a\\).</li>
<li>\\(b\\) — вертикальный сдвиг вверх на \\(b\\).</li>
</ul>
<h4>Биекция и обратная функция</h4>
<p>Функция обратима тогда и только тогда, когда она биективна (инъективна: \\(f(x_1) = f(x_2) \\implies x_1 = x_2\\) и сюръективна: покрывает всю область значений).</p>`,
            kz: `<h4>Графикті түрлендіру ережелері</h4>
<p>\\(y = A f(k(x - a)) + b\\) теңдеуінде A тігінен созады, k көлденеңінен сығады, a оңға жылжытады, b жоғары жылжытады.</p>`,
            en: `<h4>Affine Graph Transformations</h4>
<p>In \\(y = A f(k(x - a)) + b\\), A scales amplitude, k contracts domain frequency, a shifts phase, and b shifts baseline.</p>`
          }
        },
        level3: {
          summary: {
            ru: 'Топологические свойства: непрерывность по Коши и Гейне, теоремы Вейерштрасса и Больцано-Коши.',
            kz: 'Топологиялық қасиеттер: Коши және Гейне бойынша үзіліссіздік.',
            en: 'Cauchy & Heine continuity, Extreme Value Theorem, and Intermediate Value Theorem.'
          },
          formulas: ['\\forall \\varepsilon > 0 \\; \\exists \\delta > 0: |x - x_0| < \\delta \\implies |f(x) - f(x_0)| < \\varepsilon'],
          contentHtml: {
            ru: `<h4>Строгое определение непрерывности (язык ε-δ)</h4>
<p>Функция непрерывна в точке \\(x_0\\), если для любого сколь угодно малого \\(\\varepsilon > 0\\) существует такое \\(\\delta > 0\\), что из \\(|x - x_0| < \\delta\\) следует \\(|f(x) - f(x_0)| < \\varepsilon\\).</p>
<h4>Теорема Больцано-Коши о промежуточном значении</h4>
<p>Если функция непрерывна на отрезке \\([a, b]\\) и принимает на его концах значения разных знаков (\\(f(a) \\cdot f(b) < 0\\)), то внутри отрезка существует хотя бы одна точка \\(c \\in (a, b)\\), где \\(f(c) = 0\\). На этом основан численный метод дихотомии (бисекции).</p>`,
            kz: `<h4>ε-δ тіліндегі үзіліссіздік анықтамасы</h4>
<p>f(x) нүктеде үзіліссіз, егер кез келген \\(\\varepsilon > 0\\) үшін \\(\\delta > 0\\) табылып, аргумент жақын болғанда мәндер де \\(\\varepsilon\\)-нен жақын болса.</p>`,
            en: `<h4>Epsilon-Delta Rigorous Continuity</h4>
<p>f is continuous at x₀ if \\(\\forall \\varepsilon > 0, \\exists \\delta > 0\\) such that \\(|x - x_0| < \\delta \\implies |f(x) - f(x_0)| < \\varepsilon\\).</p>`
          }
        }
      },
      {
        id: 'trigonometry',
        icon: '📊',
        title: { ru: 'Тригонометрия', kz: 'Тригонометрия', en: 'Trigonometry' },
        whyItWorksId: 'pythagoras_trig',
        level1: {
          summary: {
            ru: 'Углы, единичный круг, синус, косинус и тангенс.',
            kz: 'Бұрыштар, бірлік шеңбер, синус, косинус және тангенс.',
            en: 'Angles, the unit circle, sine, cosine, and tangent.'
          },
          formulas: ['\\sin^2\\alpha + \\cos^2\\alpha = 1', '\\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha}', '\\sin(2\\alpha) = 2\\sin\\alpha\\cos\\alpha'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Тригонометрия связывает углы поворота с длинами отрезков.</p>
<div class="formula-box">$$\\sin^2\\alpha+\\cos^2\\alpha=1\\qquad\\tan\\alpha=\\frac{\\sin\\alpha}{\\cos\\alpha}$$<br>$$\\sin 2\\alpha=2\\sin\\alpha\\cos\\alpha$$</div>
<div class="tip-box">💡 Нажмите кнопку <b>«Почему это работает?»</b>, чтобы увидеть интерактивный визуальный вывод основного тригонометрического тождества!</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Тригонометрия бұрыштар мен қабырғалар қатынасын зерттейді.</p>
<div class="formula-box">$$\\sin^2\\alpha+\\cos^2\\alpha=1$$</div>`,
            en: `<p><b>In simple terms:</b> Trigonometry maps circular rotation to periodic waves.</p>
<div class="formula-box">$$\\sin^2\\alpha+\\cos^2\\alpha=1$$</div>`
          }
        },
        level2: {
          summary: {
            ru: 'Формулы сложения углов, преобразование суммы тригонометрических функций в произведение.',
            kz: 'Бұрыштарды қосу формулалары және көбейтіндіге түрлендіру.',
            en: 'Angle sum identities and product-to-sum transformations.'
          },
          formulas: [
            '\\sin(\\alpha \\pm \\beta) = \\sin\\alpha\\cos\\beta \\pm \\cos\\alpha\\sin\\beta',
            '\\cos(\\alpha \\pm \\beta) = \\cos\\alpha\\cos\\beta \\mp \\sin\\alpha\\sin\\beta'
          ],
          contentHtml: {
            ru: `<h4>Формулы сложения и их следствия</h4>
<div class="formula-box">$$\\sin(\\alpha\\pm\\beta)=\\sin\\alpha\\cos\\beta\\pm\\cos\\alpha\\sin\\beta$$<br>$$\\cos(\\alpha\\pm\\beta)=\\cos\\alpha\\cos\\beta\\mp\\sin\\alpha\\sin\\beta$$</div>
<h4>Половинные углы</h4>
<div class="formula-box">$$\\sin^2\\frac{\\alpha}{2} = \\frac{1 - \\cos\\alpha}{2}, \\qquad \\cos^2\\frac{\\alpha}{2} = \\frac{1 + \\cos\\alpha}{2}$$</div>`,
            kz: `<h4>Қосу формулалары</h4>
<div class="formula-box">$$\\sin(\\alpha\\pm\\beta)=\\sin\\alpha\\cos\\beta\\pm\\cos\\alpha\\sin\\beta$$</div>`,
            en: `<h4>Sum and Difference Identities</h4>
<div class="formula-box">$$\\sin(\\alpha\\pm\\beta)=\\sin\\alpha\\cos\\beta\\pm\\cos\\alpha\\sin\\beta$$</div>`
          }
        },
        level3: {
          summary: {
            ru: 'Формула Муавра, комплексные экспоненты, корни из единицы и ряды Фурье.',
            kz: 'Муавр формуласы, бірліктің кешен түбірлері және Фурье қатарлары.',
            en: "De Moivre's theorem, complex roots of unity, and harmonic Fourier series."
          },
          formulas: ['(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)', '\\omega_k = e^{i \\frac{2\\pi k}{n}}'],
          contentHtml: {
            ru: `<h4>Формула Муавра и n-е корни из комплексного числа</h4>
<p>Для любого целого n:</p>
<div class="formula-box">$$(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)$$</div>
<p>Корни n-й степени из единицы образуют вершины правильного n-угольника, вписанного в единичную окружность на комплексной плоскости.</p>`,
            kz: `<h4>Муавр формуласы</h4>
<div class="formula-box">$$(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)$$</div>`,
            en: `<h4>De Moivre's Formula & Roots of Unity</h4>
<div class="formula-box">$$(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)$$</div>`
          }
        }
      },
      {
        id: 'logarithms',
        icon: '🔢',
        title: { ru: 'Логарифмы и экспоненты', kz: 'Логарифмдер және экспонента', en: 'Logarithms and exponentials' },
        level1: {
          summary: {
            ru: 'Логарифм — операция поиска показателя степени.',
            kz: 'Логарифм — дәреже көрсеткішін табу амалы.',
            en: 'A logarithm answers: what power produces this number?'
          },
          formulas: ['\\log_a b = c \\iff a^c = b', '\\log_a(xy) = \\log_a x + \\log_a y'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Логарифм — «обратная степень». log₂(8) = 3, потому что 2³ = 8.</p>
<div class="formula-box">$$\\log_a b=c\\iff a^c=b$$<br>$$\\log(ab)=\\log a+\\log b\\qquad\\log\\frac{a}{b}=\\log a-\\log b$$</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Логарифм дәрежеге шығаруға кері амал.</p>`,
            en: `<p><b>In simple terms:</b> Inverse of exponentiation: log₂(8) = 3 because 2³ = 8.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Число e как предел непрерывного сложного процента, натуральный логарифм ln(x).',
            kz: 'e саны үздіксіз пайыз өсімінің шегі ретінде.',
            en: 'Euler constant e as the limit of continuous compound interest.'
          },
          formulas: ['e = \\lim_{n\\to\\infty}\\left(1 + \\frac{1}{n}\\right)^n \\approx 2.71828...', '\\log_a b = \\frac{\\ln b}{\\ln a}'],
          contentHtml: {
            ru: `<h4>Происхождение числа e</h4>
<p>Число e возникает естественным образом при непрерывном росте:</p>
<div class="formula-box">$$e = \\lim_{n\\to\\infty}\\left(1 + \\frac{1}{n}\\right)^n = 2.718281828...$$</div>
<p>Экспоненциальная функция \\(e^x\\) уникальна: её скорость роста в каждой точке в точности равна её текущему значению: \\((e^x)' = e^x\\).</p>`,
            kz: `<h4>e санының шығуы</h4>
<div class="formula-box">$$e = \\lim_{n\\to\\infty}\\left(1 + \\frac{1}{n}\\right)^n$$</div>`,
            en: `<h4>Origin of Euler's Number e</h4>
<div class="formula-box">$$e = \\lim_{n\\to\\infty}\\left(1 + \\frac{1}{n}\\right)^n$$</div>`
          }
        },
        level3: {
          summary: {
            ru: 'Комплексный логарифм Ln(z), ветвление и Римановы поверхности.',
            kz: 'Кешен логарифм және Риман беттері.',
            en: 'Complex logarithm, multiple branches, and Riemann surfaces.'
          },
          formulas: ['\\operatorname{Ln}(z) = \\ln|z| + i(\\operatorname{Arg}(z) + 2\\pi k)'],
          contentHtml: {
            ru: `<h4>Многозначность комплексного логарифма</h4>
<p>Для любого комплексного числа \\(z = r e^{i\\varphi}\\):</p>
<div class="formula-box">$$\\operatorname{Ln}(z) = \\ln|z| + i(\\varphi + 2\\pi k), \\quad k \\in \\mathbb{Z}$$</div>
<p>Комплексный логарифм имеет бесконечно много ветвей. Чтобы сделать его однозначной функцией, строят многолистную <b>Риманову поверхность</b>, похожую на винтовую лестницу.</p>`,
            kz: `<h4>Кешен логарифмнің көпмәнділігі</h4>
<div class="formula-box">$$\\operatorname{Ln}(z) = \\ln|z| + i(\\varphi + 2\\pi k)$$</div>`,
            en: `<h4>Multi-valued Complex Logarithms</h4>
<div class="formula-box">$$\\operatorname{Ln}(z) = \\ln|z| + i(\\varphi + 2\\pi k)$$</div>`
          }
        }
      }
    ]
  },
  {
    id: 'algebra',
    icon: '🔢',
    title: { ru: 'Алгебра', kz: 'Алгебра', en: 'Algebra' },
    desc: {
      ru: 'Уравнения, системы, неравенства',
      kz: 'Теңдеулер, жүйелер, теңсіздіктер',
      en: 'Equations, systems, inequalities'
    },
    lessons: [
      {
        id: 'quadratic',
        icon: '📉',
        title: { ru: 'Квадратные уравнения', kz: 'Квадрат теңдеулер', en: 'Quadratic equations' },
        whyItWorksId: 'quadratic',
        level1: {
          summary: {
            ru: 'Формула дискриминанта, количество корней и теорема Виета.',
            kz: 'Дискриминант, түбірлер саны және Виет теоремасы.',
            en: 'Discriminant, number of roots, and Vieta formulas.'
          },
          formulas: ['ax^2+bx+c=0', 'D=b^2-4ac', 'x_{1,2}=\\frac{-b\\pm\\sqrt{D}}{2a}'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Уравнение второй степени. Корней может быть 0, 1 или 2.</p>
<div class="formula-box">$$ax^2+bx+c=0,\\quad D=b^2-4ac,\\quad x_{1,2}=\\frac{-b\\pm\\sqrt{D}}{2a}$$</div>
<h4>Теорема Виета</h4>
<div class="formula-box">$$x_1+x_2 = -\\frac{b}{a}, \\qquad x_1 x_2 = \\frac{c}{a}$$</div>
<div class="tip-box">💡 Нажмите <b>«Почему это работает?»</b>, чтобы изучить пошаговый геометрический вывод Аль-Хорезми!</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Екінші дәрежелі теңдеу. Дискриминант түбірлер санын анықтайды.</p>
<div class="formula-box">$$D=b^2-4ac,\\quad x_{1,2}=\\frac{-b\\pm\\sqrt{D}}{2a}$$</div>`,
            en: `<p><b>In simple terms:</b> Polynomial of degree 2. Discriminant decides roots.</p>
<div class="formula-box">$$D=b^2-4ac,\\quad x_{1,2}=\\frac{-b\\pm\\sqrt{D}}{2a}$$</div>`
          }
        },
        level2: {
          summary: {
            ru: 'Разложение на множители, расположение корней квадратного трехчлена относительно точки и комплексные корни при D < 0.',
            kz: 'Көбейткіштерге жіктеу және D < 0 кезіндегі кешен түбірлер.',
            en: 'Factorization, parabolic vertex optimization, and conjugate complex roots.'
          },
          formulas: ['ax^2+bx+c = a(x - x_1)(x - x_2)', 'x_{1,2} = -\\frac{b}{2a} \\pm i\\frac{\\sqrt{|D|}}{2a}'],
          contentHtml: {
            ru: `<h4>Комплексно-сопряжённые корни</h4>
<p>Если дискриминант отрицателен (\\(D < 0\\)), парабола не пересекает ось X. Однако на комплексной плоскости уравнение всегда имеет ровно два сопряжённых корня:</p>
<div class="formula-box">$$x_{1,2} = -\\frac{b}{2a} \\pm i \\frac{\\sqrt{4ac - b^2}}{2a}$$</div>
<h4>Вершина параболы и экстремум</h4>
<p>Координаты вершины: \\(x_v = -\\frac{b}{2a}\\), \\(y_v = -\\frac{D}{4a}\\). При \\(a > 0\\) функция достигает в ней глобального минимума.</p>`,
            kz: `<h4>Кешен түйіндес түбірлер</h4>
<p>D < 0 болғанда парабола X осімен қиылыспайды, бірақ екі кешен түбір бар.</p>`,
            en: `<h4>Complex Conjugate Roots</h4>
<p>When D < 0, roots live in the complex plane as conjugate pairs.</p>`
          }
        },
        level3: {
          summary: {
            ru: 'Университетский уровень: Основная теорема алгебры Гаусса, метод Феррари и Кардано для степеней 3 и 4, теория Галуа о неразрешимости степени 5 в радикалах.',
            kz: 'Алгебраның негізгі теоремасы және 5-дәрежелі теңдеулердің радикалдарда шешілмейтіндігі туралы Галуа теориясы.',
            en: "Fundamental Theorem of Algebra, Cardano-Ferrari cubic/quartic methods, and Galois insolvability of quintics."
          },
          formulas: ['P_n(z) = a_n z^n + \\dots + a_0 = 0 \\text{ has exactly } n \\text{ complex roots}'],
          contentHtml: {
            ru: `<h4>Основная теорема алгебры (Теорема Даламбера-Гаусса)</h4>
<p>Всякий многочлен степени \\(n \\ge 1\\) с комплексными коэффициентами имеет ровно \\(n\\) комплексных корней (с учётом их кратностей). Поле \\(\\mathbb{C}\\) алгебраически замкнуто.</p>
<h4>Теория Галуа и уравнения выше 4-й степени</h4>
<p>Нильс Абель и Эварист Галуа доказали, что для полиномов степени 5 и выше общей формулы через радикалы (корни) не существует, так как симметрическая группа \\(S_5\\) не является разрешимой.</p>`,
            kz: `<h4>Алгебраның негізгі теоремасы және Галуа теориясы</h4>
<p>Кез келген n-дәрежелі көпмүшенің кешен сандарда дәл n түбірі бар. 5-ші дәрежеден бастап түбірлерді радикалдар арқылы табатын жалпы формула жоқ (Абель-Галуа теоремасы).</p>`,
            en: `<h4>Fundamental Theorem of Algebra & Galois Theory</h4>
<p>Every non-zero polynomial of degree n over ℂ has exactly n roots. By the Abel-Ruffini theorem and Galois theory, general polynomial equations of degree 5 or higher cannot be solved in radicals.</p>`
          }
        }
      },
      {
        id: 'systems',
        icon: '📋',
        title: { ru: 'Системы уравнений', kz: 'Теңдеулер жүйелері', en: 'Systems of equations' },
        level1: {
          summary: {
            ru: 'Методы подстановки, сложения и графическое решение систем уравнений.',
            kz: 'Алмастыру, қосу және графиктік шешу әдістері.',
            en: 'Substitution, elimination, and graphical solutions of linear systems.'
          },
          formulas: ['\\begin{cases} a_1 x + b_1 y = c_1 \\\\ a_2 x + b_2 y = c_2 \\end{cases}'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Ищем точку, где прямые пересекаются одновременно.</p>
<div class="formula-box">$$\\begin{cases}2x+y=5\\\\x-y=1\\end{cases}\\implies x=2,\\;y=1$$</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Түзулердің қиылысу нүктесін табамыз.</p>`,
            en: `<p><b>In simple terms:</b> Finding the common intersection point of geometric equations.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Правило Крамера через определители 2x2 и метод исключения Гаусса.',
            kz: 'Крамер ережесі және Гаусс әдісі.',
            en: "Cramer's rule with 2x2 determinants and Gaussian elimination."
          },
          formulas: ['x = \\frac{\\Delta_x}{\\Delta}, \\qquad y = \\frac{\\Delta_y}{\\Delta}'],
          contentHtml: {
            ru: `<h4>Правило Крамера</h4>
<div class="formula-box">$$\\Delta = \\begin{vmatrix} a_1 & b_1 \\\\ a_2 & b_2 \\end{vmatrix}, \\quad \\Delta_x = \\begin{vmatrix} c_1 & b_1 \\\\ c_2 & b_2 \\end{vmatrix}, \\quad \\Delta_y = \\begin{vmatrix} a_1 & c_1 \\\\ a_2 & c_2 \\end{vmatrix}$$<br>$$x = \\frac{\\Delta_x}{\\Delta}, \\qquad y = \\frac{\\Delta_y}{\\Delta} \\quad (\\text{при } \\Delta \\neq 0)$$</div>`,
            kz: `<h4>Крамер ережесі</h4>
<div class="formula-box">$$x = \\frac{\\Delta_x}{\\Delta}, \\qquad y = \\frac{\\Delta_y}{\\Delta}$$</div>`,
            en: `<h4>Cramer's Rule</h4>
<div class="formula-box">$$x = \\frac{\\Delta_x}{\\Delta}, \\qquad y = \\frac{\\Delta_y}{\\Delta}$$</div>`
          }
        },
        level3: {
          summary: {
            ru: 'Теорема Кронекера-Капелли, ранги матриц и фундаментальная система решений.',
            kz: 'Кронекер-Капелли теоремасы және матрица рангісі.',
            en: 'Rouché-Capelli (Kronecker-Capelli) theorem and vector kernel subspaces.'
          },
          formulas: ['\\operatorname{rank}(A) = \\operatorname{rank}(A|B) \\iff \\text{система совместна}'],
          contentHtml: {
            ru: `<h4>Теорема Кронекера-Капелли</h4>
<p>Система линейных алгебраических уравнений \\(Ax = B\\) совместна тогда и только тогда, когда ранг основной матрицы равен рангу расширенной матрицы: \\(\\operatorname{rank}(A) = \\operatorname{rank}(A|B)\\).</p>
<p>Если ранг равен числу переменных, решение единственно. Если ранг меньше числа переменных, решение образует аффинное подпространство размерности \\(n - r\\).</p>`,
            kz: `<h4>Кронекер-Капелли теоремасы</h4>
<p>Сызықтық жүйе үйлесімді болады тек және тек сонда, егер негізгі матрица рангі кеңейтілген матрица рангіне тең болса.</p>`,
            en: `<h4>Rouché-Capelli Theorem & Nullspaces</h4>
<p>A linear system Ax = b has solutions iff rank(A) = rank(A|b). If rank equals variables, solution is unique; otherwise, dimension of affine solution space is n - rank(A).</p>`
          }
        }
      },
      {
        id: 'inequalities',
        icon: '🎯',
        title: { ru: 'Неравенства', kz: 'Теңсіздіктер', en: 'Inequalities' },
        level1: {
          summary: {
            ru: 'Метод интервалов, смена знака при умножении на отрицательное число.',
            kz: 'Интервалдар әдісі және теріс санға көбейткенде таңбаның ауысуы.',
            en: 'Interval sign analysis and sign flipping under negative scaling.'
          },
          formulas: ['x^2 - 5x + 6 > 0 \\implies (x - 2)(x - 3) > 0'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Решаем как уравнение, но следим за знаками. При умножении на отрицательное знак ОБЯЗАТЕЛЬНО меняется!</p>
<div class="formula-box">$$x^2-5x+6>0\\implies(x-2)(x-3)>0\\implies x\\in(-\\infty;2)\\cup(3;+\\infty)$$</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Теріс санға көбейткенде немесе бөлгенде таңба ауысады!</p>`,
            en: `<p><b>In simple terms:</b> Factoring into zero intervals; multiplying by a negative flips the sign.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Дробно-рациональные неравенства, кратные корни и учёт выколотых точек ОДЗ.',
            kz: 'Бөлшек-рационал теңсіздіктер және анықталу облысы.',
            en: 'Rational inequalities, multiplicities of roots, and domain boundary holes.'
          },
          formulas: ['\\frac{P(x)}{Q(x)} \\ge 0, \\quad Q(x) \\neq 0'],
          contentHtml: {
            ru: `<h4>Правило чётных и нечётных степеней корней</h4>
<p>При переходе через корень нечётной кратности знак функции меняется на противоположный (+ на -). При переходе через корень чётной кратности (например, \\((x - 2)^2\\)) знак сохраняется!</p>`,
            kz: `<h4>Түбірлердің жұп және тақ дәрежелері</h4>
<p>Жұп дәрежелі түбірден өткенде таңба сақталады, тақ дәрежеден өткенде таңба қарама-қарсыға ауысады.</p>`,
            en: `<h4>Multiplicity Rule</h4>
<p>Root with odd multiplicity flips sign across boundary; root with even multiplicity preserves sign.</p>`
          }
        },
        level3: {
          summary: {
            ru: 'Классические фундаментальные неравенства: Коши-Буняковского, Йенсена для выпуклых функций, среднее арифметическое и геометрическое (AM-GM).',
            kz: 'Коши-Буняковский, Йенсен және AM-GM теңсіздіктері.',
            en: 'Cauchy-Schwarz, Jensen inequality for convex functions, and AM-GM inequality.'
          },
          formulas: ['\\left(\\sum a_i b_i\\right)^2 \\le \\left(\\sum a_i^2\\right)\\left(\\sum b_i^2\\right)', '\\frac{x_1 + \\dots + x_n}{n} \\ge \\sqrt[n]{x_1 \\dots x_n}'],
          contentHtml: {
            ru: `<h4>Неравенство Коши-Буняковского-Шварца</h4>
<p>В любом гильбертовом пространстве со скалярным произведением:</p>
<div class="formula-box">$$|\\langle x, y \\rangle|^2 \\le \\langle x, x \\rangle \\cdot \\langle y, y \\rangle$$</div>
<h4>Неравенство Йенсена</h4>
<p>Для любой строго выпуклой функции \\(f\\): \\(f\\left(\\sum \\lambda_i x_i\\right) \\le \\sum \\lambda_i f(x_i)\\). Это фундамент теории информации (энтропия Шеннона).</p>`,
            kz: `<h4>Коши-Буняковский және Йенсен теңсіздіктері</h4>
<p>Векторлық кеңістікте скаляр көбейтінді үшін орындалады. Ақпарат теориясында кеңінен қолданылады.</p>`,
            en: `<h4>Cauchy-Schwarz & Jensen Inequalities</h4>
<p>For any inner product space, \\(|\\langle x, y \\rangle|^2 \\le \\|x\\|^2 \\|y\\|^2\\). Jensen's inequality forms the mathematical bedrock of machine learning loss functions and Shannon entropy.</p>`
          }
        }
      }
    ]
  },
  {
    id: 'calc',
    icon: '∫',
    title: { ru: 'Матанализ', kz: 'Матанализ', en: 'Calculus' },
    desc: {
      ru: 'Пределы, производные, интегралы, ДУ',
      kz: 'Шектер, туындылар, интегралдар, ДТ',
      en: 'Limits, derivatives, integrals, DE'
    },
    lessons: [
      {
        id: 'limits',
        icon: '🔭',
        title: { ru: 'Пределы функций', kz: 'Функция шектері', en: 'Limits of functions' },
        level1: {
          summary: {
            ru: 'Понятие предела, первый и второй замечательные пределы, правило Лопиталя.',
            kz: 'Шек түсінігі, тамаша шектер және Лопиталь ережесі.',
            en: "Concept of limit, first/second remarkable limits, and L'Hôpital's rule."
          },
          formulas: [
            '\\lim_{x\\to 0}\\frac{\\sin x}{x} = 1',
            '\\lim_{x\\to\\infty}\\left(1 + \\frac{1}{x}\\right)^x = e'
          ],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Предел — значение, к которому бесконечно приближается функция.</p>
<div class="formula-box">$$\\lim_{x\\to 0}\\frac{\\sin x}{x}=1\\quad(\\text{Первый замечательный})$$<br>$$\\lim_{x\\to\\infty}\\left(1+\\frac{1}{x}\\right)^x=e\\quad(\\text{Второй замечательный})$$</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Функцияның аргумент белгілі бір санға ұмтылғандағы шектік мәні.</p>`,
            en: `<p><b>In simple terms:</b> The value a curve converges to as input approaches a destination point.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Эквивалентные бесконечно малые при x → 0 и раскрытие неопределенностей 0/0, ∞/∞, 0·∞, 1^∞.',
            kz: 'Шексіз аз шамалар және анықталмағандықтарды ашу.',
            en: 'Asymptotic equivalences and indeterminate form resolutions.'
          },
          formulas: ['\\sin x \\sim x, \\quad \\ln(1+x) \\sim x, \\quad e^x - 1 \\sim x, \\quad 1 - \\cos x \\sim \\frac{x^2}{2}'],
          contentHtml: {
            ru: `<h4>Таблица эквивалентных бесконечно малых при x → 0</h4>
<p>Замена выражений на эквивалентные позволяет мгновенно раскрывать сложные пределы:</p>
<div class="formula-box">$$\\sin x \\sim x, \\quad \\tan x \\sim x, \\quad \\arcsin x \\sim x, \\quad \\ln(1+x) \\sim x, \\quad 1-\\cos x \\sim \\frac{x^2}{2}$$</div>`,
            kz: `<h4>Шексіз аз шамалар кестесі</h4>
<div class="formula-box">$$\\sin x \\sim x, \\quad \\ln(1+x) \\sim x, \\quad e^x - 1 \\sim x$$</div>`,
            en: `<h4>Asymptotic Equivalences at x → 0</h4>
<div class="formula-box">$$\\sin x \\sim x, \\quad \\tan x \\sim x, \\quad \\ln(1+x) \\sim x, \\quad 1-\\cos x \\sim \\frac{x^2}{2}$$</div>`
          }
        },
        level3: {
          summary: {
            ru: 'Формула Тейлора с остаточным членом в форме Пеано и Лагранжа, O-большое и o-малое.',
            kz: 'Тейлор формуласы және Пеано қалдық мүшесі.',
            en: 'Taylor polynomials with Peano and Lagrange remainders, Landau big-O notation.'
          },
          formulas: ['f(x) = \\sum_{k=0}^n \\frac{f^{(k)}(x_0)}{k!}(x - x_0)^k + o((x - x_0)^n)'],
          contentHtml: {
            ru: `<h4>Локальная аппроксимация полиномами Тейлора</h4>
<p>Формула Тейлора приближает любую гладкую функцию полиномом с контролируемой погрешностью. Предел отношения функций сводится к вычислению отношения первых ненулевых коэффициентов их разложений Тейлора.</p>`,
            kz: `<h4>Тейлор қатарына жіктеу</h4>
<p>Кез келген дифференциалданатын функцияны көпмүшемен жуықтау әдісі.</p>`,
            en: `<h4>Taylor Series Expansion & Asymptotics</h4>
<p>Taylor series decomposes non-linear functions into locally polynomial approximations with formal Landau order terms.</p>`
          }
        }
      },
      {
        id: 'derivative',
        icon: '📈',
        title: { ru: 'Производная', kz: 'Туынды', en: 'Derivative' },
        whyItWorksId: 'derivative',
        level1: {
          summary: {
            ru: 'Мгновенная скорость изменения функции и геометрический наклон касательной.',
            kz: 'Өзгерістің лездік жылдамдығы және жанаманың көлбеулігі.',
            en: 'Instantaneous rate of change and slope of the tangent line.'
          },
          formulas: ['f\'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x) - f(x)}{\\Delta x}', '(x^n)\' = n x^{n-1}, \\quad (e^x)\' = e^x'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Производная — спидометр функции. Показывает, с какой скоростью растёт или падает график в данной точке.</p>
<div class="formula-box">$$f'(x)=\\lim_{\\Delta x\\to 0}\\frac{f(x+\\Delta x)-f(x)}{\\Delta x}$$</div>
<div class="tip-box">💡 Нажмите <b>«Почему это работает?»</b>, чтобы увидеть, как секущая превращается в касательную!</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Туынды — функцияның лездік жылдамдығын көрсететін спидометр.</p>`,
            en: `<p><b>In simple terms:</b> The speedometer of a function curve at a precise point.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Правила дифференцирования сложной функции (Chain rule), произведения и частного.',
            kz: 'Күрделі функцияны дифференциалдау ережесі.',
            en: 'Chain rule, product rule, and quotient rule.'
          },
          formulas: ['(f(g(x)))\' = f\'(g(x)) \\cdot g\'(x)', '(uv)\' = u\'v + uv\'', '\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}'],
          contentHtml: {
            ru: `<h4>Правила дифференцирования</h4>
<div class="formula-box">$$\\text{Произведение: } (uv)' = u'v + uv'$$<br>$$\\text{Сложная функция: } (f(g(x)))' = f'(g(x)) \\cdot g'(x)$$</div>
<h4>Исследование функции</h4>
<p>Критические точки: \\(f'(x) = 0\\). Если \\(f''(x) > 0\\) — локальный минимум (чаша вверх). Если \\(f''(x) < 0\\) — максимум.</p>`,
            kz: `<h4>Дифференциалдау ережелері</h4>
<div class="formula-box">$$(uv)' = u'v + uv', \\qquad (f(g(x)))' = f'(g(x)) \\cdot g'(x)$$</div>`,
            en: `<h4>Differentiation Rules</h4>
<div class="formula-box">$$(uv)' = u'v + uv', \\qquad (f(g(x)))' = f'(g(x)) \\cdot g'(x)$$</div>`
          }
        },
        level3: {
          summary: {
            ru: 'Теоремы Ролля, Лагранжа о среднем значении и дифференциалы высших порядков во фреше-пространствах.',
            kz: 'Ролль және Лагранж теоремалары.',
            en: 'Rolle, Mean Value Theorem (Lagrange), and Fréchet derivatives in Banach spaces.'
          },
          formulas: ['f(b) - f(a) = f\'(c)(b - a), \\quad c \\in (a, b)'],
          contentHtml: {
            ru: `<h4>Теорема Лагранжа о среднем значении</h4>
<p>Если функция непрерывна на \\([a, b]\\) и дифференцируема на \\((a, b)\\), то существует хотя бы одна промежуточная точка \\(c \\in (a, b)\\), где касательная параллельна секущей, соединяющей концы графика.</p>`,
            kz: `<h4>Лагранж теоремасы</h4>
<p>Жанама кесіндінің ұштарын қосатын қиюшыға параллель болатын аралық нүкте табылады.</p>`,
            en: `<h4>Mean Value Theorem</h4>
<p>States that somewhere between a and b, the instantaneous derivative equals the average slope.</p>`
          }
        }
      },
      {
        id: 'integrals',
        icon: '∫',
        title: { ru: 'Интегралы', kz: 'Интегралдар', en: 'Integrals' },
        level1: {
          summary: {
            ru: 'Интеграл — площадь под кривой и обратная операция к производной.',
            kz: 'Интеграл — қисық астындағы аудан және туындыға кері амал.',
            en: 'The definite integral accumulates area under a curve.'
          },
          formulas: ['\\int_a^b f(x) dx = F(b) - F(a)', '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Если производная находит скорость по пройденному пути, то интеграл находит пройденный путь по скорости!</p>
<div class="formula-box">$$\\int_a^b f(x)dx = F(b) - F(a) \\quad (\\text{Формула Ньютона-Лейбница})$$</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Анықталған интеграл қисық сызықты трапецияның ауданын береді.</p>`,
            en: `<p><b>In simple terms:</b> Definite integration sums infinitesimal slices to find total area.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Замена переменной, интегрирование по частям (метод LIATE) и несобственные интегралы.',
            kz: 'Айнымалыны алмастыру және бөліктеп интегралдау.',
            en: 'Integration by parts (LIATE heuristic) and substitution.'
          },
          formulas: ['\\int u \\, dv = uv - \\int v \\, du'],
          contentHtml: {
            ru: `<h4>Интегрирование по частям</h4>
<div class="formula-box">$$\\int u\\,dv = uv - \\int v\\,du$$</div>
<p>Мнемоника <b>LIATE</b> для выбора \\(u\\): <b>L</b>ogarithm → <b>I</b>nverse trig → <b>A</b>lgebraic → <b>T</b>rigonometric → <b>E</b>xponential.</p>`,
            kz: `<h4>Бөліктеп интегралдау</h4>
<div class="formula-box">$$\\int u\\,dv = uv - \\int v\\,du$$</div>`,
            en: `<h4>Integration by Parts</h4>
<div class="formula-box">$$\\int u\\,dv = uv - \\int v\\,du$$</div>`
          }
        },
        level3: {
          summary: {
            ru: 'Интеграл Римана и интеграл Лебега, критерий интегрируемости Лебега и мера множеств.',
            kz: 'Риман және Лебег интегралдары.',
            en: 'Riemann vs. Lebesgue integration, measure theory, and dominated convergence theorem.'
          },
          formulas: ['\\int_E f \\, d\\mu = \\sup \\left\\{ \\int_E s \\, d\\mu : 0 \\le s \\le f \\right\\}'],
          contentHtml: {
            ru: `<h4>Преимущество интеграла Лебега над интегралом Римана</h4>
<p>Риман режет область определения (ось X) на вертикальные полоски. Анри Лебег предложил резать область значений (ось Y) на горизонтальные слои и измерять меру прообразов. Это позволило интегрировать разрывные функции (например, функцию Дирихле).</p>`,
            kz: `<h4>Лебег интегралы</h4>
<p>Функцияның мәндер облысын өлшеу арқылы анықталады.</p>`,
            en: `<h4>Lebesgue Measure & Integration</h4>
<p>Lebesgue partitions the range rather than the domain, enabling integration of discontinuous indicator functions.</p>`
          }
        }
      },
      {
        id: 'partial',
        icon: '🌐',
        title: { ru: 'Частные производные', kz: 'Дербес туындылар', en: 'Partial derivatives' },
        level1: {
          summary: {
            ru: 'Функции многих переменных, наклон поверхности вдоль осей и вектор градиента.',
            kz: 'Көп айнымалы функциялар, градиент векторы.',
            en: 'Multivariable functions, spatial slopes along coordinate axes, and gradient.'
          },
          formulas: ['\\frac{\\partial z}{\\partial x} = f\'_x, \\qquad \\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Частная производная по x показывает, как меняется высота холма, если идти строго на восток, не сворачивая.</p>
<div class="formula-box">$$\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)$$</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Градиент функцияның ең жылдам өсу бағытын көрсетеді.</p>`,
            en: `<p><b>In simple terms:</b> Slope along a single axis while holding other variables constant.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Градиентный спуск, касательная плоскость к 3D-поверхности и матрица Гессе.',
            kz: 'Градиенттік түсу және бетке жүргізілген жанама жазықтық.',
            en: 'Gradient descent optimization, tangent planes, and Hessian curvature matrix.'
          },
          formulas: ['z - z_0 = f_x(x_0, y_0)(x - x_0) + f_y(x_0, y_0)(y - y_0)', 'H = \\begin{pmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{pmatrix}'],
          contentHtml: {
            ru: `<h4>Уравнение касательной плоскости</h4>
<div class="formula-box">$$z - z_0 = f'_x(x_0, y_0)(x - x_0) + f'_y(x_0, y_0)(y - y_0)$$</div>
<p>Градиентный спуск в машинном обучении делает шаг в сторону \\(-\\nabla f\\) для минимизации ошибки нейросети.</p>`,
            kz: `<h4>Жанама жазықтық</h4>
<div class="formula-box">$$z - z_0 = f'_x(x_0, y_0)(x - x_0) + f'_y(x_0, y_0)(y - y_0)$$</div>`,
            en: `<h4>Tangent Plane & Gradient Descent</h4>
<div class="formula-box">$$z - z_0 = f'_x(x_0, y_0)(x - x_0) + f'_y(x_0, y_0)(y - y_0)$$</div>`
          }
        },
        level3: {
          summary: {
            ru: 'Множители Лагранжа для условной оптимизации, дифференциальные формы и теорема Стокса.',
            kz: 'Лагранж көбейткіштері және Стокс теоремасы.',
            en: 'Lagrange multipliers for constrained optimization and generalized Stokes theorem.'
          },
          formulas: ['\\nabla f(x) = \\lambda \\nabla g(x), \\qquad \\int_{\\partial \\Omega} \\omega = \\int_\\Omega d\\omega'],
          contentHtml: {
            ru: `<h4>Метод множителей Лагранжа</h4>
<p>Для поиска экстремума функции \\(f(x, y)\\) при условии связи \\(g(x, y) = 0\\) строим функцию \\(L(x, y, \\lambda) = f - \\lambda g\\). Экстремум достигается там, где градиент целевой функции сонаправлен с градиентом ограничения.</p>`,
            kz: `<h4>Лагранж көбейткіштері әдісі</h4>
<p>Шартты экстремумды табу үшін қолданылады.</p>`,
            en: `<h4>Lagrange Multipliers & Differential Forms</h4>
<p>Finds constrained extrema where gradients of objective and constraint become collinear.</p>`
          }
        }
      },
      {
        id: 'differential',
        icon: '〰️',
        title: { ru: 'Дифференциальные уравнения', kz: 'Дифференциалдық теңдеулер', en: 'Differential equations' },
        level1: {
          summary: {
            ru: 'Уравнения, где неизвестным является функция, связывающая её с её производными.',
            kz: 'Белгісізі функция болатын теңдеулер.',
            en: 'Equations relating an unknown function to its rates of change.'
          },
          formulas: ['\\frac{dy}{dx} = k y \\implies y(t) = y_0 e^{kt}'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Мы ищем не число, а закон изменения (функцию), описывающий динамику системы.</p>
<div class="formula-box">$$\\frac{dy}{dt} = ky \\implies y(t) = y_0 e^{kt} \\quad (\\text{Экспоненциальный рост/распад})$$</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Физикалық жүйенің уақыт бойынша қалай өзгеретінін сипаттайды.</p>`,
            en: `<p><b>In simple terms:</b> Solving for a function trajectory rather than a static number.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Разделение переменных, линейные уравнения 1-го порядка (метод интегрирующего множителя Бернулли).',
            kz: 'Айнымалылары ажыратылатын теңдеулер.',
            en: 'Separable equations and first-order integrating factor techniques.'
          },
          formulas: ['y\' + P(x)y = Q(x), \\qquad \\mu(x) = e^{\\int P(x)dx}'],
          contentHtml: {
            ru: `<h4>Интегрирующий множитель</h4>
<p>Умножение обеих частей на \\(\\mu(x) = e^{\\int P(x)dx}\\) сводит левую часть к производной произведения \\((\\mu(x) y)' = \\mu(x) Q(x)\\).</p>`,
            kz: `<h4>Интегралдаушы көбейткіш</h4>
<div class="formula-box">$$\\mu(x) = e^{\\int P(x)dx}$$</div>`,
            en: `<h4>Integrating Factor</h4>
<div class="formula-box">$$\\mu(x) = e^{\\int P(x)dx}$$</div>`
          }
        },
        level3: {
          summary: {
            ru: 'Фазовое пространство, автономные нелинейные системы, аттракторы Лоренца и теория хаоса.',
            kz: 'Фазалық кеңістік, Лоренц аттракторы және хаос теориясы.',
            en: 'Phase space dynamics, Lorenz strange attractors, and deterministic chaos.'
          },
          formulas: ['\\dot{x} = \\sigma(y - x), \\quad \\dot{y} = x(\\rho - z) - y, \\quad \\dot{z} = xy - \\beta z'],
          contentHtml: {
            ru: `<h4>Аттрактор Лоренца и детерминированный хаос</h4>
<p>Простая система трёх нелинейных ОДУ порождает странный фрактальный аттрактор («эффект бабочки»), где микроскопическое изменение начальных условий экспоненциально разводит траектории во времени (показатель Ляпунова \\(\\lambda > 0\\)).</p>`,
            kz: `<h4>Лоренц аттракторы және хаос теориясы</h4>
<p>Көбелек эффектісі: бастапқы шарттардың аз ғана өзгеруі уақыт өте келе жүйенің күйін түбегейлі өзгертеді.</p>`,
            en: `<h4>Lorenz Attractor & Deterministic Chaos</h4>
<p>A system of 3 ODEs producing a fractal strange attractor with sensitive dependence on initial conditions.</p>`
          }
        }
      }
    ]
  },
  {
    id: 'linal',
    icon: '🔷',
    title: { ru: 'Линейная алгебра', kz: 'Сызықтық алгебра', en: 'Linear Algebra' },
    desc: {
      ru: 'Матрицы, векторы, собственные значения',
      kz: 'Матрицалар, векторлар, меншікті мәндер',
      en: 'Matrices, vectors, eigenvalues'
    },
    lessons: [
      {
        id: 'matrices',
        icon: '📊',
        title: { ru: 'Матрицы и операции', kz: 'Матрицалар және амалдар', en: 'Matrices and operations' },
        level1: {
          summary: {
            ru: 'Матрица как компактная таблица коэффициентов и линейное преобразование пространства.',
            kz: 'Матрица — сандар кестесі және кеңістікті түрлендіруші.',
            en: 'A matrix acts as a table of numbers and a linear spatial transform.'
          },
          formulas: ['(AB)_{ij} = \\sum_{k} a_{ik} b_{kj}, \\quad AB \\neq BA'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Матрица сжимает, растягивает и вращает пространство вокруг начала координат.</p>
<div class="formula-box">$$A = \\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix}$$</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Матрицаларды көбейту кезінде реті маңызды: AB ≠ BA.</p>`,
            en: `<p><b>In simple terms:</b> Matrices rotate, shear, and scale dimensional grids.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Ранг матрицы, транспонирование, ортогональные матрицы и след матрицы (Trace).',
            kz: 'Матрица рангісі, транспонирлеу және матрица ізі.',
            en: 'Matrix rank, transpose, trace, and orthogonal rotation matrices.'
          },
          formulas: ['\\operatorname{tr}(A) = \\sum_{i} a_{ii}, \\qquad A^T A = I \\implies A^{-1} = A^T'],
          contentHtml: {
            ru: `<h4>Ортогональные матрицы</h4>
<p>Матрица ортогональна, если её столбцы образуют ортонормированный базис. Ортогональная матрица сохраняет длины векторов и углы между ними (чистый поворот или отражение).</p>`,
            kz: `<h4>Ортогонал матрицалар</h4>
<p>Векторлардың ұзындығы мен бұрыштарын сақтайтын таза айналу түрлендіруі.</p>`,
            en: `<h4>Orthogonal Transformations</h4>
<p>Preserves vector lengths and dot-product angles: pure Euclidean rotations and reflections.</p>`
          }
        },
        level3: {
          summary: {
            ru: 'Сингулярное разложение (SVD), псевдообратная матрица Мура-Пенроуза и сжатие данных (PCA).',
            kz: 'Сингулярлық жіктеу (SVD) және негізгі компоненттер әдісі (PCA).',
            en: 'Singular Value Decomposition (SVD) and Principal Component Analysis.'
          },
          formulas: ['A = U \\Sigma V^T, \\qquad A^+ = V \\Sigma^+ U^T'],
          contentHtml: {
            ru: `<h4>Сингулярное разложение (SVD)</h4>
<p>Любая матрица любого размера \\(m \\times n\\) раскладывается в произведение: поворот \\(V^T\\), масштабирование \\(\\Sigma\\) и поворот \\(U\\). SVD лежит в основе сжатия картинок, рекомендательных систем Netflix и алгоритмов поиска в Google.</p>`,
            kz: `<h4>Сингулярлық жіктеу (SVD)</h4>
<p>Кез келген матрица екі айналу мен созылу көбейтіндісіне жіктеледі. Жасанды интеллекттің негізгі құралы.</p>`,
            en: `<h4>Singular Value Decomposition (SVD)</h4>
<p>Decomposes any matrix into rotation, scaling, and second rotation. Foundational to modern recommender systems and image compression.</p>`
          }
        }
      },
      {
        id: 'determinant',
        icon: '🔲',
        title: { ru: 'Определитель и обратная матрица', kz: 'Анықтауыш және кері матрица', en: 'Determinant and inverse matrix' },
        whyItWorksId: 'determinant',
        level1: {
          summary: {
            ru: 'Определитель 2х2, условие обратимости (det != 0) и правило Саррюса для 3х3.',
            kz: '2х2 анықтауышы және кері матрицаның табылу шарты.',
            en: '2x2 determinant, invertibility condition, and Sarrus rule for 3x3.'
          },
          formulas: ['\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix} = ad-bc', 'A^{-1} = \\frac{1}{\\det A} A^*'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Определитель — число, показывающее, во сколько раз изменилась площадь фигуры при сжатии/растяжении матрицей.</p>
<div class="formula-box">$$\\det A = ad - bc$$</div>
<div class="tip-box">💡 Нажмите <b>«Почему это работает?»</b>, чтобы увидеть геометрическое доказательство площади параллелограмма!</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> det = 0 болса, кері матрица болмайды.</p>`,
            en: `<p><b>In simple terms:</b> The spatial volume scaling coefficient; det = 0 implies collapse.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Разложение Лапласа по строке/столбцу, алгебраические дополнения и алгоритм Гаусса-Жордана.',
            kz: 'Лаплас жіктелуі және Гаусс-Жордан алгоритмі.',
            en: 'Laplace cofactor expansions and Gauss-Jordan row reduction for matrix inversion.'
          },
          formulas: ['\\det(A) = \\sum_{j=1}^n (-1)^{i+j} a_{ij} M_{ij}'],
          contentHtml: {
            ru: `<h4>Разложение Лапласа</h4>
<div class="formula-box">$$\\det(A) = \\sum_{j=1}^n a_{ij} C_{ij}, \\quad C_{ij} = (-1)^{i+j} M_{ij}$$</div>`,
            kz: `<h4>Лаплас жіктелуі</h4>
<div class="formula-box">$$\\det(A) = \\sum_{j=1}^n a_{ij} (-1)^{i+j} M_{ij}$$</div>`,
            en: `<h4>Laplace Expansion</h4>
<div class="formula-box">$$\\det(A) = \\sum_{j=1}^n a_{ij} (-1)^{i+j} M_{ij}$$</div>`
          }
        },
        level3: {
          summary: {
            ru: 'Формула Лейбница через перестановки Sn, знакопеременные полилинейные формы и связь с якобианом замены переменных.',
            kz: 'Лейбниц формуласы және алмастыру якобианы.',
            en: 'Leibniz permutation formula for determinants and Jacobian volume changes.'
          },
          formulas: ['\\det(A) = \\sum_{\\sigma \\in S_n} \\operatorname{sgn}(\\sigma) \\prod_{i=1}^n a_{i, \\sigma(i)}', 'dx_1 \\dots dx_n = |\\det(J)| \\, du_1 \\dots du_n'],
          contentHtml: {
            ru: `<h4>Якобиан в многомерном анализе</h4>
<p>При замене переменных в кратном интеграле элемент объёма масштабируется в точности на модуль определителя матрицы Якоби: \\(dV_x = |\\det(J)| dV_u\\).</p>`,
            kz: `<h4>Якобиан</h4>
<p>Көптік интегралдардағы айнымалыларды ауыстырғанда көлемнің өзгеріс коэффициентін анықтайды.</p>`,
            en: `<h4>The Jacobian Determinant</h4>
<p>Calculates the local volume dilation factor during multidimensional coordinate transformations.</p>`
          }
        }
      },
      {
        id: 'vectors',
        icon: '➡️',
        title: { ru: 'Векторы', kz: 'Векторлар', en: 'Vectors' },
        level1: {
          summary: {
            ru: 'Вектор как направленный отрезок, скалярное и векторное произведение.',
            kz: 'Вектор, скаляр және векторлық көбейтінді.',
            en: 'Vector magnitude, direction, dot product, and cross product.'
          },
          formulas: ['\\vec a \\cdot \\vec b = |\\vec a||\\vec b|\\cos\\theta', '|\\vec a \\times \\vec b| = |\\vec a||\\vec b|\\sin\\theta'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Скалярное произведение даёт число (проекцию). Векторное даёт новый перпендикулярный вектор.</p>
<div class="formula-box">$$\\vec a\\cdot\\vec b = a_x b_x + a_y b_y + a_z b_z$$</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Скаляр көбейтінді перпендикуляр болғанда 0-ге тең.</p>`,
            en: `<p><b>In simple terms:</b> Dot product measures directional alignment; cross product measures orthogonal area.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Смешанное произведение трёх векторов, объём параллелепипеда и ориентация тройки (правая/левая).',
            kz: 'Аралас көбейтінді және параллелепипед көлемі.',
            en: 'Scalar triple product and oriented parallelepiped volume.'
          },
          formulas: ['(\\vec a, \\vec b, \\vec c) = \\vec a \\cdot (\\vec b \\times \\vec c) = \\det\\begin{pmatrix} a_x & a_y & a_z \\\\ b_x & b_y & b_z \\\\ c_x & c_y & c_z \\end{pmatrix}'],
          contentHtml: {
            ru: `<h4>Смешанное произведение</h4>
<p>Модуль смешанного произведения \\(|(\\vec a, \\vec b, \\vec c)|\\) равен геометрическому объёму параллелепипеда, построенного на этих трёх векторах в трёхмерном пространстве.</p>`,
            kz: `<h4>Аралас көбейтінді</h4>
<p>Үш вектордан құралған параллелепипедтің көлемін береді.</p>`,
            en: `<h4>Scalar Triple Product</h4>
<p>The magnitude equals the geometric 3D volume spanned by vectors a, b, and c.</p>`
          }
        },
        level3: {
          summary: {
            ru: 'Абстрактные линейные векторные пространства, процесс ортогонализации Грама-Шмидта, неравенство Бесселя.',
            kz: 'Грам-Шмидт ортогоналдау процесі.',
            en: 'Gram-Schmidt orthogonalization process and Hilbert space projections.'
          },
          formulas: ['\\vec u_k = \\vec v_k - \\sum_{j=1}^{k-1} \\frac{\\langle \\vec v_k, \\vec u_j \\rangle}{\\|\\vec u_j\\|^2} \\vec u_j'],
          contentHtml: {
            ru: `<h4>Ортогонализация Грама-Шмидта</h4>
<p>Алгоритм превращает любой произвольный линейно независимый базис в систему взаимно перпендикулярных векторов единичной длины.</p>`,
            kz: `<h4>Грам-Шмидт алгоритмі</h4>
<p>Кез келген базисті ортонормаланған базиске айналдырады.</p>`,
            en: `<h4>Gram-Schmidt Orthogonalization</h4>
<p>Converts an arbitrary linearly independent basis into an orthonormal system.</p>`
          }
        }
      },
      {
        id: 'eigenvalues',
        icon: '🔑',
        title: { ru: 'Собственные значения', kz: 'Меншікті мәндер', en: 'Eigenvalues' },
        level1: {
          summary: {
            ru: 'Собственный вектор — вектор, направление которого не меняется матрицей, а меняется лишь масштаб.',
            kz: 'Меншікті вектор бағытын өзгертпейді, тек созылады немесе сығылады.',
            en: 'An eigenvector retains its spatial direction, being only scaled by its eigenvalue.'
          },
          formulas: ['A \\vec v = \\lambda \\vec v, \\qquad \\det(A - \\lambda I) = 0'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Матрица обычно поворачивает векторы. Но для некоторых избранных векторов (собственных) она действует просто как умножение на число λ.</p>
<div class="formula-box">$$A\\vec v = \\lambda \\vec v$$</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Матрица меншікті векторды бұрмайды, тек λ есе созады.</p>`,
            en: `<p><b>In simple terms:</b> Directions along which matrix action reduces to pure scalar multiplication.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Характеристический многочлен, спектр матрицы, диагонализация матрицы (A = PDP^-1).',
            kz: 'Сипаттамалық көпмүше және матрицаны диагональдау.',
            en: 'Characteristic polynomial, spectrum, and diagonal matrix factorization.'
          },
          formulas: ['p(\\lambda) = \\det(A - \\lambda I) = 0, \\qquad A = P D P^{-1} \\implies A^k = P D^k P^{-1}'],
          contentHtml: {
            ru: `<h4>Диагонализация и быстрое возведение матрицы в степень</h4>
<p>Если у матрицы \\(n\\) различных собственных значений, её можно диагонализовать: \\(A = P D P^{-1}\\). Тогда вычисление сотой степени матрицы \\(A^{100} = P D^{100} P^{-1}\\) делается мгновенно!</p>`,
            kz: `<h4>Матрицаны дәрежеге шығару</h4>
<div class="formula-box">$$A^k = P D^k P^{-1}$$</div>`,
            en: `<h4>Diagonalization & Matrix Powers</h4>
<div class="formula-box">$$A^k = P D^k P^{-1}$$</div>`
          }
        },
        level3: {
          summary: {
            ru: 'Спектральная теорема для самосопряжённых операторов, алгоритм PageRank Ларри Пейджа и квантовые наблюдаемые.',
            kz: 'Спектрлік теорема және Google PageRank алгоритмі.',
            en: "Spectral theorem for Hermitian operators, Google's PageRank stationary distribution."
          },
          formulas: ['\\hat{H} |\\psi\\rangle = E |\\psi\\rangle, \\qquad \\pi P = \\pi'],
          contentHtml: {
            ru: `<h4>Алгоритм Google PageRank</h4>
<p>Рейтинг страниц интернета — это собственный вектор огромной стохастической матрицы переходов между веб-сайтами, соответствующий собственному значению \\(\\lambda = 1\\). Стационарное распределение вычисляется степенным методом.</p>`,
            kz: `<h4>Google PageRank алгоритмі</h4>
<p>Интернет сайттарының маңыздылығы — өтпелі ықтималдықтар матрицасының меншікті векторы.</p>`,
            en: `<h4>Google PageRank & Quantum Mechanics</h4>
<p>PageRank is the stationary eigenvector of the hyperlink transition probability matrix for λ = 1.</p>`
          }
        }
      }
    ]
  },
  {
    id: 'prob',
    icon: '🎲',
    title: { ru: 'Теория вероятностей', kz: 'Ықтималдық теориясы', en: 'Probability' },
    desc: {
      ru: 'Вероятность, комбинаторика, статистика',
      kz: 'Ықтималдық, комбинаторика, статистика',
      en: 'Probability, combinatorics, statistics'
    },
    lessons: [
      {
        id: 'probability',
        icon: '🎰',
        title: { ru: 'Основы теории вероятностей', kz: 'Ықтималдық теориясының негіздері', en: 'Probability basics' },
        level1: {
          summary: {
            ru: 'Классическое определение вероятности, сложение и умножение независимых событий.',
            kz: 'Ықтималдықтың классикалық анықтамасы.',
            en: 'Classical probability definition, independent event laws, and odds.'
          },
          formulas: ['P(A) = \\frac{m}{n}, \\quad 0 \\le P(A) \\le 1', 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Вероятность — доля благоприятных исходов от общего числа всех возможных вариантов.</p>
<div class="formula-box">$$P(A)=\\frac{m}{n}$$</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Ықтималдық — қолайлы жағдайлардың барлық жағдайларға қатынасы.</p>`,
            en: `<p><b>In simple terms:</b> The fraction of favorable outcomes divided by total sample space.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Условная вероятность, формула полной вероятности и теорема Байеса.',
            kz: 'Шартты ықтималдық және Байес формуласы.',
            en: 'Conditional probability, law of total probability, and Bayes rule.'
          },
          formulas: ['P(A|B) = \\frac{P(B|A) P(A)}{P(B)}'],
          contentHtml: {
            ru: `<h4>Формула Байеса</h4>
<div class="formula-box">$$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$$</div>
<p>Позволяет скорректировать априорную вероятность гипотезы \\(A\\) при поступлении нового наблюдаемого свидетельства \\(B\\).</p>`,
            kz: `<h4>Байес формуласы</h4>
<div class="formula-box">$$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$$</div>`,
            en: `<h4>Bayes' Theorem</h4>
<div class="formula-box">$$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$$</div>`
          }
        },
        level3: {
          summary: {
            ru: 'Аксиоматика Колмогорова, вероятностное пространство (Ω, F, P), борелевские сигма-алгебры и случайные процессы.',
            kz: 'Колмогоров аксиоматикасы және ықтималдық кеңістігі.',
            en: 'Kolmogorov probability triple (Ω, F, P), sigma-algebras, and martingales.'
          },
          formulas: ['(\\Omega, \\mathcal{F}, P), \\qquad P\\left(\\bigcup_{i=1}^\\infty A_i\\right) = \\sum_{i=1}^\\infty P(A_i)'],
          contentHtml: {
            ru: `<h4>Аксиоматика Андрея Колмогорова (1933 г.)</h4>
<p>Превратила теорию вероятностей в строгую ветвь теории меры. Вероятностное пространство задаётся тройкой: множество элементарных исходов \\(\\Omega\\), \\(\\sigma\\)-алгебра событий \\(\\mathcal{F}\\) и счётное-аддитивная мера \\(P\\), нормированная \\(P(\\Omega) = 1\\).</p>`,
            kz: `<h4>Колмогоров аксиоматикасы</h4>
<p>Ықтималдықтар теориясын қатаң өлшемдер теориясы негізінде құрды.</p>`,
            en: `<h4>Kolmogorov Axiomatic Bedrock</h4>
<p>Defines probability rigorously via measure theory on a measurable space with countable additivity.</p>`
          }
        }
      },
      {
        id: 'combinatorics',
        icon: '📉',
        title: { ru: 'Комбинаторика', kz: 'Комбинаторика', en: 'Combinatorics' },
        level1: {
          summary: {
            ru: 'Перестановки P_n, размещения A_n^k и сочетания C_n^k.',
            kz: 'Орын алмастырулар, орналастырулар және терулер.',
            en: 'Permutations, arrangements, and binomial combinations.'
          },
          formulas: ['P_n = n!', 'A_n^k = \\frac{n!}{(n-k)!}', 'C_n^k = \\frac{n!}{k!(n-k)!}'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Сколькими способами можно выбрать или переставить объекты? Важен порядок — размещение; не важен порядок — сочетание.</p>
<div class="formula-box">$$C_n^k = \\frac{n!}{k!(n-k)!}$$</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Реті маңызды болса — орналастыру, маңызды емес болса — теру.</p>`,
            en: `<p><b>In simple terms:</b> Order matters: permutation/arrangement; order irrelevant: combination.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Бином Ньютона, треугольник Паскаля и сочетания с повторениями.',
            kz: 'Ньютон биномы және Паскаль үшбұрышы.',
            en: 'Binomial expansion theorem and combinations with replacement.'
          },
          formulas: ['(a+b)^n = \\sum_{k=0}^n C_n^k a^{n-k} b^k', '\\bar{C}_n^k = C_{n+k-1}^k'],
          contentHtml: {
            ru: `<h4>Бином Ньютона</h4>
<div class="formula-box">$$(a+b)^n = \\sum_{k=0}^n C_n^k a^{n-k}b^k$$</div>
<p>Коэффициенты легко находятся по треугольнику Паскаля, где каждое число равно сумме двух стоящих над ним.</p>`,
            kz: `<h4>Ньютон биномы</h4>
<div class="formula-box">$$(a+b)^n = \\sum_{k=0}^n C_n^k a^{n-k}b^k$$</div>`,
            en: `<h4>Binomial Theorem</h4>
<div class="formula-box">$$(a+b)^n = \\sum_{k=0}^n C_n^k a^{n-k}b^k$$</div>`
          }
        },
        level3: {
          summary: {
            ru: 'Производящие функции (методы Эйлера), числа Каталана и формула включений-исключений.',
            kz: 'Туындатушы функциялар және Каталан сандары.',
            en: 'Generating functions, Catalan numbers, and principle of inclusion-exclusion.'
          },
          formulas: ['C_n = \\frac{1}{n+1} C_{2n}^n, \\qquad G(x) = \\sum_{n=0}^\\infty a_n x^n'],
          contentHtml: {
            ru: `<h4>Метод производящих функций</h4>
<p>Превращает комбинаторную последовательность в коэффициенты степенного ряда. Сложение и умножение рядов моделирует комбинирование структур.</p>`,
            kz: `<h4>Туындатушы функциялар</h4>
<p>Комбинаторикалық есептерді шешудің алгебралық әдісі.</p>`,
            en: `<h4>Ordinary Generating Functions</h4>
<p>Encodes combinatorial sequences as power series coefficients, turning counting problems into polynomial algebra.</p>`
          }
        }
      },
      {
        id: 'statistics',
        icon: '📊',
        title: { ru: 'Математическая статистика', kz: 'Математикалық статистика', en: 'Mathematical statistics' },
        level1: {
          summary: {
            ru: 'Среднее арифметическое, медиана, дисперсия и стандартное отклонение.',
            kz: 'Орташа мән, медиана, дисперсия және стандартты ауытқу.',
            en: 'Sample mean, median, variance, and standard deviation.'
          },
          formulas: ['\\bar x = \\frac{1}{n}\\sum x_i', '\\sigma = \\sqrt{\\frac{1}{n}\\sum (x_i - \\bar x)^2}'],
          contentHtml: {
            ru: `<p><b>На пальцах:</b> Среднее — баланс выборки, а стандартное отклонение σ — разброс данных вокруг среднего.</p>
<div class="formula-box">$$\\sigma = \\sqrt{D(X)}$$</div>`,
            kz: `<p><b>Қарапайым тілмен:</b> Деректердің шашырау дәрежесін өлшейді.</p>`,
            en: `<p><b>In simple terms:</b> Mean locates the center; variance and σ measure scatter.</p>`
          }
        },
        level2: {
          summary: {
            ru: 'Нормальное распределение Гаусса, правило трёх сигм (68-95-99.7) и доверительные интервалы.',
            kz: 'Гаусс қалыпты үлестірімі және 3 сигма ережесі.',
            en: 'Gaussian normal distribution bell curve and 68-95-99.7 empirical rule.'
          },
          formulas: ['f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}'],
          contentHtml: {
            ru: `<h4>Правило 3σ</h4>
<ul>
<li>В пределах \\([\\mu - \\sigma, \\mu + \\sigma]\\) лежит <b>68.27%</b> всех наблюдений.</li>
<li>В пределах \\([\\mu - 2\\sigma, \\mu + 2\\sigma]\\) лежит <b>95.45%</b>.</li>
<li>В пределах \\([\\mu - 3\\sigma, \\mu + 3\\sigma]\\) лежит <b>99.73%</b>.</li>
</ul>`,
            kz: `<h4>3 сигма ережесі</h4>
<p>Бақылаулардың 99.73%-ы үш сигма аралығында орналасады.</p>`,
            en: `<h4>The 3-Sigma Rule</h4>
<p>68% within 1σ, 95% within 2σ, and 99.7% within 3σ in normal distributions.</p>`
          }
        },
        level3: {
          summary: {
            ru: 'Центральная предельная теорема (ЦПТ), метод максимального правдоподобия (MLE) и проверка статистических гипотез (p-value).',
            kz: 'Орталық шектік теорема және p-value гипотезаларды тексеру.',
            en: 'Central Limit Theorem (CLT), Maximum Likelihood Estimation (MLE), and p-value hypothesis testing.'
          },
          formulas: ['\\sqrt{n}\\left(\\frac{\\bar X_n - \\mu}{\\sigma}\\right) \\xrightarrow{d} \\mathcal{N}(0, 1)'],
          contentHtml: {
            ru: `<h4>Центральная предельная теорема</h4>
<p>Сумма большого числа независимых одинаково распределённых случайных величин с конечной дисперсией имеет распределение, близкое к нормальному, независимо от того, каково исходное распределение слагаемых!</p>`,
            kz: `<h4>Орталық шектік теорема</h4>
<p>Кез келген тәуелсіз кездейсоқ шамалардың қосындысы үлкен n кезінде қалыпты үлестірімге ұмтылады.</p>`,
            en: `<h4>Central Limit Theorem</h4>
<p>Normalized sum of independent identically distributed variables converges in law to Gaussian N(0,1).</p>`
          }
        }
      }
    ]
  }
];
