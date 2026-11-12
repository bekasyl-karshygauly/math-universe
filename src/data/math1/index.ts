import { L, Lecture, LectureStub, T } from './types';
import { LECTURE_1 } from './lecture1';
import { LECTURE_2 } from './lecture2';
import { LECTURE_3 } from './lecture3';
import { LECTURE_4, LECTURE_5, LECTURE_6, LECTURE_7, LECTURE_8 } from './geometry';
import { MATH1_DEPTH, MATH1_DEPTH_TESTS } from './depth';
import { ADDITIONAL_DEPTH, UMKD_PRACTICE } from './additionalStudy';

export * from './types';
export * from './constants';

export const MATH1_META = {
  title: T('Математика 1', 'Математика 1', 'Mathematics 1'),
  author: T('Марданова Л.О.', 'Марданова Л.О.', 'L.O. Mardanova'),
  university: T(
    'Сафи Өтебаев атындағы Атырау мұнай және газ университеті',
    'Атырауский университет нефти и газа им. С. Утебаева',
    'Safi Utebayev Atyrau Oil and Gas University'
  ),
  year: '2026–2027',
};

export const MATH1_LECTURES: Lecture[] = [LECTURE_1, LECTURE_2, LECTURE_3, LECTURE_4, LECTURE_5, LECTURE_6, LECTURE_7, LECTURE_8]
  .map(lecture => ({
    ...lecture,
    deepDive: [...MATH1_DEPTH[lecture.number], ADDITIONAL_DEPTH[lecture.number]],
    practice: {
      ...lecture.practice,
      examples: [...lecture.practice.examples, ...(UMKD_PRACTICE[lecture.number] ?? [])],
    },
    test: [...lecture.test, MATH1_DEPTH_TESTS[lecture.number]],
  }));

/** Full syllabus, including upcoming lectures. */
export const MATH1_SYLLABUS: LectureStub[] = [
  ...MATH1_LECTURES.map(({ number, title }) => ({ number, title })),
  { number: 9, title: T('Нақты сандар. Сан тізбегі. Функция. Негізгі элементар функциялар', 'Действительные числа. Числовая последовательность. Функция. Основные элементарные функции', 'Real numbers. Sequences. Functions. Basic elementary functions') },
  { number: 10, title: T('Шектер теориясы: тізбектің және функцияның шегі', 'Теория пределов: предел последовательности и функции', 'Limits of sequences and functions') },
  { number: 11, title: T('Тамаша шектер. Шексіз аздарды салыстыру. Үзіліссіздік', 'Замечательные пределы. Сравнение бесконечно малых. Непрерывность', 'Remarkable limits. Infinitesimals. Continuity') },
  { number: 12, title: T('Функцияның туындысы. Дифференциалдау ережелері', 'Производная функции. Правила дифференцирования', 'The derivative. Differentiation rules') },
  { number: 13, title: T('Айқындалмаған және параметрлік функциялардың туындылары. Дифференциал', 'Производные неявных и параметрических функций. Дифференциал', 'Implicit and parametric derivatives. The differential') },
  { number: 14, title: T('Дифференциалданатын функциялар туралы теоремалар', 'Теоремы о дифференцируемых функциях', 'Theorems on differentiable functions') },
  { number: 15, title: T('Функцияны туынды арқылы зерттеу', 'Исследование функции с помощью производной', 'Investigating a function with derivatives') },
];

export interface GlossaryTerm {
  term: L;
  /** Lecture number where the term is introduced */
  lecture: number;
  /** Optional formula illustrating the term */
  tex?: string;
}

const r = String.raw;

export const MATH1_GLOSSARY: GlossaryTerm[] = [
  { term: T('матрица', 'матрица', 'matrix'), lecture: 1, tex: r`A=\left\|a_{ij}\right\|` },
  { term: T('матрица элементі', 'элемент матрицы', 'matrix entry'), lecture: 1, tex: r`a_{ij}` },
  { term: T('жол', 'строка', 'row'), lecture: 1 },
  { term: T('баған', 'столбец', 'column'), lecture: 1 },
  { term: T('өлшем', 'размер', 'size'), lecture: 1, tex: r`m\times n` },
  { term: T('квадрат матрица', 'квадратная матрица', 'square matrix'), lecture: 1, tex: r`m=n` },
  { term: T('тікбұрышты матрица', 'прямоугольная матрица', 'rectangular matrix'), lecture: 1 },
  { term: T('бас диагональ', 'главная диагональ', 'main diagonal'), lecture: 1, tex: r`a_{11},a_{22},\ldots,a_{nn}` },
  { term: T('қосалқы диагональ', 'побочная диагональ', 'secondary diagonal'), lecture: 1 },
  { term: T('жол матрица', 'матрица-строка', 'row matrix'), lecture: 1 },
  { term: T('баған матрица', 'матрица-столбец', 'column matrix'), lecture: 1 },
  { term: T('нөлдік матрица', 'нулевая матрица', 'zero matrix'), lecture: 1, tex: 'O' },
  { term: T('диагональ матрица', 'диагональная матрица', 'diagonal matrix'), lecture: 1 },
  { term: T('бірлік матрица', 'единичная матрица', 'identity matrix'), lecture: 1, tex: 'E' },
  { term: T('матрицаларды көбейту', 'умножение матриц', 'matrix multiplication'), lecture: 1, tex: r`c_{ij}=\sum_s a_{is}b_{sj}` },
  { term: T('транспонирлеу', 'транспонирование', 'transpose'), lecture: 2, tex: r`A^{T}` },
  { term: T('анықтауыш', 'определитель', 'determinant'), lecture: 2, tex: r`\det A=\Delta_A` },
  { term: T('үшбұрыштар ережесі', 'правило треугольников', 'rule of triangles (Sarrus)'), lecture: 2 },
  { term: T('минор', 'минор', 'minor'), lecture: 2, tex: r`M_{ij}` },
  { term: T('алгебралық толықтауыш', 'алгебраическое дополнение', 'cofactor'), lecture: 2, tex: r`A_{ij}=(-1)^{i+j}M_{ij}` },
  { term: T('жол бойынша жіктеу', 'разложение по строке', 'cofactor expansion'), lecture: 2 },
  { term: T('ерекше матрица', 'вырожденная матрица', 'singular matrix'), lecture: 2, tex: r`\det A=0` },
  { term: T('ерекше емес матрица', 'невырожденная матрица', 'non-singular matrix'), lecture: 2, tex: r`\det A\ne 0` },
  { term: T('кері матрица', 'обратная матрица', 'inverse matrix'), lecture: 2, tex: r`A^{-1}` },
  { term: T('матрица рангі', 'ранг матрицы', 'rank'), lecture: 3, tex: r`\operatorname{rang}A` },
  { term: T('элементар түрлендірулер', 'элементарные преобразования', 'elementary row operations'), lecture: 3 },
  { term: T('эквивалентті матрицалар', 'эквивалентные матрицы', 'equivalent matrices'), lecture: 3, tex: r`A\sim B` },
  { term: T('сызықтық теңдеулер жүйесі', 'система линейных уравнений', 'system of linear equations'), lecture: 3, tex: r`AX=B` },
  { term: T('бос мүшелер', 'свободные члены', 'constant terms'), lecture: 3, tex: r`b_i` },
  { term: T('үйлесімді жүйе', 'совместная система', 'consistent system'), lecture: 3 },
  { term: T('үйлесімсіз жүйе', 'несовместная система', 'inconsistent system'), lecture: 3 },
  { term: T('бас анықтауыш', 'главный определитель', 'main determinant'), lecture: 3, tex: r`\Delta` },
  { term: T('қосымша анықтауыштар', 'вспомогательные определители', 'auxiliary determinants'), lecture: 3, tex: r`\Delta_{x_k}` },
  { term: T('Крамер ережесі', 'правило Крамера', 'Cramer’s rule'), lecture: 3, tex: r`x_k=\Delta_{x_k}/\Delta` },
  { term: T('матрицалық әдіс', 'матричный метод', 'matrix method'), lecture: 3, tex: r`X=A^{-1}B` },
  { term: T('кеңейтілген матрица', 'расширенная матрица', 'augmented matrix'), lecture: 3, tex: r`(A|B)` },
  { term: T('Гаусс әдісі', 'метод Гаусса', 'Gaussian elimination'), lecture: 3 },
  { term: T('баспалдақты түр', 'ступенчатый вид', 'row echelon form'), lecture: 3 },
  { term: T('Кронекер–Капелли теоремасы', 'теорема Кронекера–Капелли', 'Kronecker–Capelli theorem'), lecture: 3 },
  { term: T('біртекті жүйе', 'однородная система', 'homogeneous system'), lecture: 3 },
  { term: T('вектор ұзындығы', 'длина вектора', 'vector length'), lecture: 4, tex: r`|\mathbf a|` },
  { term: T('скаляр көбейтінді', 'скалярное произведение', 'dot product'), lecture: 5, tex: r`\mathbf a\cdot\mathbf b` },
  { term: T('бағыттаушы вектор', 'направляющий вектор', 'direction vector'), lecture: 6 },
  { term: T('нормаль вектор', 'нормальный вектор', 'normal vector'), lecture: 7 },
  { term: T('фокус', 'фокус', 'focus'), lecture: 8 },
];
