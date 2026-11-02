import type { Language } from '../lib/storage';

// Prepared reference answers for the help chat, in all three interface languages.
// **text** marks bold; the chat renders it.

interface Topic {
  id: string;
  /** Lower-case fragments matched against the question, any language */
  keywords: string[];
  answer: Record<Language, string>;
}

const TOPICS: Topic[] = [
  {
    id: 'quadratic',
    keywords: ['квадратн', 'уравнен', 'дискриминант', 'ax²', 'ax^2', 'квадрат', 'теңдеу', 'quadratic', 'equation', 'discriminant'],
    answer: {
      ru: `**Квадратное уравнение** ax² + bx + c = 0\n\n**Шаги решения:**\n1. Вычисли дискриминант: D = b² - 4ac\n2. Если D > 0 → два корня: x = (-b ± √D) / 2a\n3. Если D = 0 → один корень: x = -b / 2a\n4. Если D < 0 → нет вещественных корней\n\n**Пример:** x² - 5x + 6 = 0\nD = 25 - 24 = 1\nx₁ = (5+1)/2 = 3, x₂ = (5-1)/2 = 2 ✓`,
      kz: `**Квадрат теңдеу** ax² + bx + c = 0\n\n**Шешу қадамдары:**\n1. Дискриминантты есепте: D = b² - 4ac\n2. Егер D > 0 → екі түбір: x = (-b ± √D) / 2a\n3. Егер D = 0 → бір түбір: x = -b / 2a\n4. Егер D < 0 → нақты түбірлер жоқ\n\n**Мысал:** x² - 5x + 6 = 0\nD = 25 - 24 = 1\nx₁ = (5+1)/2 = 3, x₂ = (5-1)/2 = 2 ✓`,
      en: `**Quadratic equation** ax² + bx + c = 0\n\n**Steps:**\n1. Compute the discriminant: D = b² - 4ac\n2. If D > 0 → two roots: x = (-b ± √D) / 2a\n3. If D = 0 → one root: x = -b / 2a\n4. If D < 0 → no real roots\n\n**Example:** x² - 5x + 6 = 0\nD = 25 - 24 = 1\nx₁ = (5+1)/2 = 3, x₂ = (5-1)/2 = 2 ✓`,
    },
  },
  {
    id: 'derivative',
    keywords: ['производн', 'дифференц', 'туынды', 'derivative', 'differentiat'],
    answer: {
      ru: `**Производная** — скорость изменения функции\n\n**Основные правила:**\n- (xⁿ)' = n·xⁿ⁻¹\n- (sin x)' = cos x\n- (cos x)' = -sin x\n- (eˣ)' = eˣ\n- (ln x)' = 1/x\n\n**Правило произведения:** (uv)' = u'v + uv'\n**Правило частного:** (u/v)' = (u'v - uv') / v²\n**Цепное правило:** (f(g(x)))' = f'(g(x))·g'(x)`,
      kz: `**Туынды** — функцияның өзгеру жылдамдығы\n\n**Негізгі ережелер:**\n- (xⁿ)' = n·xⁿ⁻¹\n- (sin x)' = cos x\n- (cos x)' = -sin x\n- (eˣ)' = eˣ\n- (ln x)' = 1/x\n\n**Көбейтінді ережесі:** (uv)' = u'v + uv'\n**Бөлінді ережесі:** (u/v)' = (u'v - uv') / v²\n**Күрделі функция ережесі:** (f(g(x)))' = f'(g(x))·g'(x)`,
      en: `**Derivative** — the rate of change of a function\n\n**Basic rules:**\n- (xⁿ)' = n·xⁿ⁻¹\n- (sin x)' = cos x\n- (cos x)' = -sin x\n- (eˣ)' = eˣ\n- (ln x)' = 1/x\n\n**Product rule:** (uv)' = u'v + uv'\n**Quotient rule:** (u/v)' = (u'v - uv') / v²\n**Chain rule:** (f(g(x)))' = f'(g(x))·g'(x)`,
    },
  },
  {
    id: 'integral',
    keywords: ['интеграл', 'integral', 'antiderivative'],
    answer: {
      ru: `**Интегрирование** — обратная операция к дифференцированию\n\n**Основные интегралы:**\n- ∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n- ∫sin x dx = -cos x + C\n- ∫cos x dx = sin x + C\n- ∫eˣ dx = eˣ + C\n- ∫(1/x) dx = ln|x| + C\n\n**Метод подстановки:** если есть f(g(x))·g'(x), делаем u = g(x)`,
      kz: `**Интегралдау** — дифференциалдауға кері амал\n\n**Негізгі интегралдар:**\n- ∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n- ∫sin x dx = -cos x + C\n- ∫cos x dx = sin x + C\n- ∫eˣ dx = eˣ + C\n- ∫(1/x) dx = ln|x| + C\n\n**Алмастыру әдісі:** f(g(x))·g'(x) болса, u = g(x) деп аламыз`,
      en: `**Integration** — the inverse of differentiation\n\n**Basic integrals:**\n- ∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n- ∫sin x dx = -cos x + C\n- ∫cos x dx = sin x + C\n- ∫eˣ dx = eˣ + C\n- ∫(1/x) dx = ln|x| + C\n\n**Substitution:** if you see f(g(x))·g'(x), set u = g(x)`,
    },
  },
  {
    id: 'matrix',
    keywords: ['матриц', 'определитель', 'анықтауыш', 'matrix', 'matrices', 'determinant'],
    answer: {
      ru: `**Матрицы**\n\n**Определитель 2×2:**\n|a b|\n|c d| = ad - bc\n\n**Умножение матриц:** строка × столбец, результат [i][j] = сумма строки i на столбец j\n\n**Обратная матрица:** A⁻¹ существует если det(A) ≠ 0\n\n**Транспонирование:** строки и столбцы меняются местами`,
      kz: `**Матрицалар**\n\n**2×2 анықтауышы:**\n|a b|\n|c d| = ad - bc\n\n**Матрицаларды көбейту:** жол × баған, нәтиже [i][j] = i-жол мен j-бағанның көбейтінділерінің қосындысы\n\n**Кері матрица:** det(A) ≠ 0 болса, A⁻¹ бар\n\n**Транспонирлеу:** жолдар мен бағандар орын ауыстырады`,
      en: `**Matrices**\n\n**2×2 determinant:**\n|a b|\n|c d| = ad - bc\n\n**Matrix multiplication:** row × column, entry [i][j] = sum of row i times column j\n\n**Inverse matrix:** A⁻¹ exists if det(A) ≠ 0\n\n**Transpose:** rows and columns swap places`,
    },
  },
  {
    id: 'log',
    keywords: ['логарифм', 'logarithm', 'log'],
    answer: {
      ru: `**Логарифмы**\n\nlogₐ(x) = y ⟺ aʸ = x\n\n**Свойства:**\n- log(ab) = log(a) + log(b)\n- log(a/b) = log(a) - log(b)\n- log(aⁿ) = n·log(a)\n- logₐ(b) = log(b)/log(a)\n\n**Особые значения:**\n- log₁₀(10) = 1\n- ln(e) = 1\n- log(1) = 0`,
      kz: `**Логарифмдер**\n\nlogₐ(x) = y ⟺ aʸ = x\n\n**Қасиеттері:**\n- log(ab) = log(a) + log(b)\n- log(a/b) = log(a) - log(b)\n- log(aⁿ) = n·log(a)\n- logₐ(b) = log(b)/log(a)\n\n**Ерекше мәндер:**\n- log₁₀(10) = 1\n- ln(e) = 1\n- log(1) = 0`,
      en: `**Logarithms**\n\nlogₐ(x) = y ⟺ aʸ = x\n\n**Properties:**\n- log(ab) = log(a) + log(b)\n- log(a/b) = log(a) - log(b)\n- log(aⁿ) = n·log(a)\n- logₐ(b) = log(b)/log(a)\n\n**Special values:**\n- log₁₀(10) = 1\n- ln(e) = 1\n- log(1) = 0`,
    },
  },
  {
    id: 'trig',
    keywords: ['тригоном', 'синус', 'косинус', 'trigonom', 'sin', 'cos', 'tan'],
    answer: {
      ru: `**Тригонометрия**\n\n**Основные тождества:**\n- sin²x + cos²x = 1\n- tan x = sin x / cos x\n- sin(2x) = 2·sin x·cos x\n- cos(2x) = cos²x - sin²x\n\n**Единичная окружность:**\n- 0° → (1, 0)\n- 90° → (0, 1)\n- 180° → (-1, 0)\n- 270° → (0, -1)`,
      kz: `**Тригонометрия**\n\n**Негізгі тепе-теңдіктер:**\n- sin²x + cos²x = 1\n- tan x = sin x / cos x\n- sin(2x) = 2·sin x·cos x\n- cos(2x) = cos²x - sin²x\n\n**Бірлік шеңбер:**\n- 0° → (1, 0)\n- 90° → (0, 1)\n- 180° → (-1, 0)\n- 270° → (0, -1)`,
      en: `**Trigonometry**\n\n**Core identities:**\n- sin²x + cos²x = 1\n- tan x = sin x / cos x\n- sin(2x) = 2·sin x·cos x\n- cos(2x) = cos²x - sin²x\n\n**Unit circle:**\n- 0° → (1, 0)\n- 90° → (0, 1)\n- 180° → (-1, 0)\n- 270° → (0, -1)`,
    },
  },
  {
    id: 'limit',
    keywords: ['предел', 'шек', 'limit', 'lim'],
    answer: {
      ru: `**Пределы**\n\nПредел — значение, к которому стремится функция\n\n**Основные правила:**\n- lim[f(x)+g(x)] = lim f(x) + lim g(x)\n- lim[f(x)·g(x)] = lim f(x) · lim g(x)\n- lim[sin(x)/x] = 1 при x→0 (1-й замечательный предел)\n- lim[(1+1/n)ⁿ] = e при n→∞ (2-й замечательный предел)\n\n**Неопределённости:** 0/0, ∞/∞ → используй правило Лопиталя`,
      kz: `**Шектер**\n\nШек — функция ұмтылатын мән\n\n**Негізгі ережелер:**\n- lim[f(x)+g(x)] = lim f(x) + lim g(x)\n- lim[f(x)·g(x)] = lim f(x) · lim g(x)\n- x→0 болғанда lim[sin(x)/x] = 1 (1-тамаша шек)\n- n→∞ болғанда lim[(1+1/n)ⁿ] = e (2-тамаша шек)\n\n**Анықталмағандықтар:** 0/0, ∞/∞ → Лопиталь ережесін қолдан`,
      en: `**Limits**\n\nA limit is the value a function approaches\n\n**Basic rules:**\n- lim[f(x)+g(x)] = lim f(x) + lim g(x)\n- lim[f(x)·g(x)] = lim f(x) · lim g(x)\n- lim[sin(x)/x] = 1 as x→0 (first remarkable limit)\n- lim[(1+1/n)ⁿ] = e as n→∞ (second remarkable limit)\n\n**Indeterminate forms:** 0/0, ∞/∞ → use L'Hôpital's rule`,
    },
  },
  {
    id: 'probability',
    keywords: ['вероятност', 'байес', 'ықтималд', 'probabilit', 'bayes'],
    answer: {
      ru: `**Теория вероятностей**\n\n**Основные понятия:**\n- P(A) = число благоприятных / общее число\n- 0 ≤ P(A) ≤ 1\n- P(Ā) = 1 - P(A)\n\n**Формулы:**\n- P(A∪B) = P(A) + P(B) - P(A∩B)\n- P(A|B) = P(A∩B) / P(B)\n- **Теорема Байеса:** P(A|B) = P(B|A)·P(A) / P(B)`,
      kz: `**Ықтималдық теориясы**\n\n**Негізгі ұғымдар:**\n- P(A) = қолайлы жағдайлар саны / барлық жағдайлар саны\n- 0 ≤ P(A) ≤ 1\n- P(Ā) = 1 - P(A)\n\n**Формулалар:**\n- P(A∪B) = P(A) + P(B) - P(A∩B)\n- P(A|B) = P(A∩B) / P(B)\n- **Байес теоремасы:** P(A|B) = P(B|A)·P(A) / P(B)`,
      en: `**Probability theory**\n\n**Basic ideas:**\n- P(A) = favourable outcomes / all outcomes\n- 0 ≤ P(A) ≤ 1\n- P(Ā) = 1 - P(A)\n\n**Formulas:**\n- P(A∪B) = P(A) + P(B) - P(A∩B)\n- P(A|B) = P(A∩B) / P(B)\n- **Bayes' theorem:** P(A|B) = P(B|A)·P(A) / P(B)`,
    },
  },
];

const FALLBACKS: Record<Language, string[]> = {
  ru: [
    `Попробуй сформулировать вопрос конкретнее. Например:\n- «Как решить квадратное уравнение?»\n- «Объясни производную»\n- «Что такое интеграл?»\n- «Как умножать матрицы?»\n\nЕсть ответы по алгебре, тригонометрии, анализу, матрицам и вероятности.`,
    `Здесь есть готовые ответы по темам:\n\n✓ Квадратные уравнения\n✓ Производные и интегралы\n✓ Тригонометрия\n✓ Матрицы и определители\n✓ Логарифмы\n✓ Теория вероятностей\n✓ Пределы\n\nКакая тема интересует?`,
  ],
  kz: [
    `Сұрақты нақтырақ қойып көр. Мысалы:\n- «Квадрат теңдеуді қалай шешеді?»\n- «Туындыны түсіндір»\n- «Интеграл деген не?»\n- «Матрицаларды қалай көбейтеді?»\n\nАлгебра, тригонометрия, анализ, матрицалар және ықтималдық бойынша жауаптар бар.`,
    `Мұнда келесі тақырыптар бойынша дайын жауаптар бар:\n\n✓ Квадрат теңдеулер\n✓ Туындылар мен интегралдар\n✓ Тригонометрия\n✓ Матрицалар мен анықтауыштар\n✓ Логарифмдер\n✓ Ықтималдық теориясы\n✓ Шектер\n\nҚай тақырып қызықтырады?`,
  ],
  en: [
    `Try asking more specifically. For example:\n- "How do I solve a quadratic equation?"\n- "Explain the derivative"\n- "What is an integral?"\n- "How do I multiply matrices?"\n\nThere are answers on algebra, trigonometry, calculus, matrices and probability.`,
    `Prepared answers are available on:\n\n✓ Quadratic equations\n✓ Derivatives and integrals\n✓ Trigonometry\n✓ Matrices and determinants\n✓ Logarithms\n✓ Probability theory\n✓ Limits\n\nWhich topic do you need?`,
  ],
};

export const CHAT_GREETING: Record<Language, string> = {
  ru: 'Здесь собраны готовые справочные ответы по основным темам: уравнения, производные, интегралы, матрицы, логарифмы, тригонометрия, пределы и вероятность. Напиши тему или выбери пример ниже.',
  kz: 'Мұнда негізгі тақырыптар бойынша дайын анықтамалық жауаптар жиналған: теңдеулер, туындылар, интегралдар, матрицалар, логарифмдер, тригонометрия, шектер және ықтималдық. Тақырыпты жаз немесе төмендегі мысалды таңда.',
  en: 'This chat holds prepared reference answers on core topics: equations, derivatives, integrals, matrices, logarithms, trigonometry, limits and probability. Type a topic or pick an example below.',
};

export const CHAT_SUGGESTIONS: Record<Language, string[]> = {
  ru: ['Как решить квадратное уравнение?', 'Объясни производную', 'Что такое интеграл?', 'Как умножать матрицы?'],
  kz: ['Квадрат теңдеуді қалай шешеді?', 'Туындыны түсіндір', 'Интеграл деген не?', 'Матрицаларды қалай көбейтеді?'],
  en: ['How do I solve a quadratic equation?', 'Explain the derivative', 'What is an integral?', 'How do I multiply matrices?'],
};

// Letters that exist in Kazakh but not in Russian, plus frequent Kazakh question words
const KAZAKH_LETTERS = /[әғқңөұүһі]/i;
const KAZAKH_WORDS = /(^|\s)(қалай|деген|неге|туралы|түсіндір|шешу|шешеді|қандай|не\s|мен\s)/i;

/** Language of the question; formula-only input falls back to the interface language. */
export function detectQuestionLang(question: string, uiLang: Language): Language {
  if (KAZAKH_LETTERS.test(question) || KAZAKH_WORDS.test(question)) return 'kz';
  if (/[а-яё]/i.test(question)) return 'ru';
  if (/[a-z]{3,}/i.test(question)) return 'en';
  return uiLang;
}

/** Picks the prepared answer for the question, written in the question's language. */
export function getChatAnswer(question: string, uiLang: Language): string {
  const q = question.toLowerCase();
  const lang = detectQuestionLang(question, uiLang);
  const topic = TOPICS.find((tp) => tp.keywords.some((k) => q.includes(k)));
  if (topic) return topic.answer[lang];
  const options = FALLBACKS[lang];
  return options[Math.floor(Math.random() * options.length)];
}
