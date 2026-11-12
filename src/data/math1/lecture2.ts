import { Lecture, T, X } from './types';

const r = String.raw;

const DET3_GENERAL = r`\begin{vmatrix}a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33}\end{vmatrix}`;

export const LECTURE_2: Lecture = {
  id: 'm1-l2',
  number: 2,
  title: T(
    'Екінші және үшінші ретті анықтауыштар. Минорлар және алгебралық толықтауыштар. Кері матрица',
    'Определители второго и третьего порядка. Миноры и алгебраические дополнения. Обратная матрица',
    'Second- and third-order determinants. Minors and cofactors. Inverse matrix'
  ),
  summary: T(
    'Анықтауыш — квадрат матрицаға сәйкес келетін сан. Ол арқылы матрицаның кері матрицасы бар-жоғын анықтаймыз және оны табамыз.',
    'Определитель — число, сопоставленное квадратной матрице. С его помощью узнают, есть ли у матрицы обратная, и находят её.',
    'A determinant is a number assigned to a square matrix. It tells whether the matrix has an inverse and helps to find it.'
  ),
  topics: [
    T('2 және 3-ретті анықтауыш', 'определители 2 и 3 порядка', '2×2 and 3×3 determinants'),
    T('үшбұрыштар ережесі', 'правило треугольников', 'rule of triangles'),
    T('анықтауыш қасиеттері', 'свойства определителей', 'properties'),
    T('минор, алгебралық толықтауыш', 'минор, алгебраическое дополнение', 'minor, cofactor'),
    T('кері матрица', 'обратная матрица', 'inverse matrix'),
  ],
  blocks: [
    { kind: 'h', text: T('Анықтауыштар', 'Определители', 'Determinants') },
    { kind: 'p', text: T('Анықтауыштар тек квадрат матрицалар үшін ғана енгізіледі.', 'Определители вводятся только для квадратных матриц.', 'Determinants are defined only for square matrices.') },
    {
      kind: 'def',
      term: T('Екінші ретті анықтауыш', 'Определитель второго порядка', 'Second-order determinant'),
      text: T(
        r`$A=\begin{pmatrix}a_{11} & a_{12} \\ a_{21} & a_{22}\end{pmatrix}$ матрицасының элементтері арқылы анықталған келесі сан екінші ретті анықтауыш деп аталады:`,
        r`Число, определяемое элементами матрицы $A=\begin{pmatrix}a_{11} & a_{12} \\ a_{21} & a_{22}\end{pmatrix}$ по формуле ниже, называется определителем второго порядка:`,
        r`The following number built from the entries of $A=\begin{pmatrix}a_{11} & a_{12} \\ a_{21} & a_{22}\end{pmatrix}$ is called a second-order determinant:`
      ),
      tex: r`\det A=\Delta_{A}=\begin{vmatrix}a_{11} & a_{12} \\ a_{21} & a_{22}\end{vmatrix}=a_{11}a_{22}-a_{12}a_{21}`,
    },
    {
      kind: 'def',
      term: T('Үшінші ретті анықтауыш', 'Определитель третьего порядка', 'Third-order determinant'),
      text: T(
        'Дәл осы сияқты, $3\\times 3$ матрицаға сәйкес келетін келесі сан үшінші ретті анықтауыш деп аталады:',
        'Аналогично число, сопоставленное матрице $3\\times 3$ по формуле ниже, называется определителем третьего порядка:',
        'Similarly, the following number assigned to a $3\\times 3$ matrix is called a third-order determinant:'
      ),
      tex: r`\Delta_{A}=${DET3_GENERAL}=a_{11}a_{22}a_{33}+a_{12}a_{23}a_{31}+a_{13}a_{21}a_{32}-a_{13}a_{22}a_{31}-a_{12}a_{21}a_{33}-a_{11}a_{23}a_{32}`,
    },
    {
      kind: 'p',
      text: T(
        'Үшінші ретті анықтауышты есептеу үшін үшбұрыштар тәсілін (Саррюс ережесін) қолдануға болады: «+» таңбалы үш көбейтінді бас диагональ мен оған параллель үшбұрыштардан, «−» таңбалы үш көбейтінді қосалқы диагональ мен оған параллель үшбұрыштардан алынады.',
        'Для вычисления определителя третьего порядка удобно правило треугольников (правило Саррюса): три произведения со знаком «+» берутся по главной диагонали и параллельным ей треугольникам, три со знаком «−» — по побочной диагонали и её треугольникам.',
        'A third-order determinant is conveniently computed by the rule of triangles (Sarrus’ rule): three “+” products follow the main diagonal and its parallel triangles, three “−” products follow the secondary diagonal and its triangles.'
      ),
    },
    { kind: 'visual', id: 'sarrus' },

    { kind: 'h', text: T('Анықтауыштың қасиеттері', 'Свойства определителей', 'Properties of determinants') },
    {
      kind: 'p',
      text: T(
        'Кез келген ретті анықтауыштардың қасиеттері бірдей, сондықтан үшінші ретті анықтауыштың қасиеттерін қарастыру жеткілікті. $A$ матрицасын транспонирлеу ($A^{T}$) деп оның жолдарын бағандармен ауыстыруды айтамыз:',
        'Свойства определителей любого порядка одинаковы, поэтому достаточно рассмотреть определитель третьего порядка. Транспонированием матрицы $A$ (обозначение $A^{T}$) называют замену её строк столбцами:',
        'Determinants of any order share the same properties, so it is enough to look at third order. Transposing $A$ (written $A^{T}$) means swapping its rows and columns:'
      ),
    },
    { kind: 'formula', tex: r`A=\begin{pmatrix}a_{11} & a_{12} \\ a_{21} & a_{22}\end{pmatrix}\quad\Rightarrow\quad A^{T}=\begin{pmatrix}a_{11} & a_{21} \\ a_{12} & a_{22}\end{pmatrix}` },
    {
      kind: 'list',
      ordered: true,
      items: [
        T(r`Матрицаны транспонирлегеннен анықтауыштың мәні өзгермейді: $|A|=|A^{T}|$.`, r`При транспонировании значение определителя не меняется: $|A|=|A^{T}|$.`, r`Transposition does not change the determinant: $|A|=|A^{T}|$.`),
        T('Егер матрицаның нөлдік жолы (бағаны) болса, оның анықтауышы 0-ге тең.', 'Если у матрицы есть нулевая строка (столбец), её определитель равен 0.', 'If a matrix has a zero row (column), its determinant is 0.'),
        T('Анықтауыштың кез келген екі жолын (бағанын) ауыстырғанда оның таңбасы қарама-қарсыға өзгереді.', 'При перестановке двух строк (столбцов) определитель меняет знак.', 'Swapping two rows (columns) changes the sign of the determinant.'),
        T('Анықтауыштың кез келген екі жолының (бағанының) сәйкес элементтері өзара тең немесе пропорционал болса, оның мәні 0-ге тең.', 'Если соответствующие элементы двух строк (столбцов) равны или пропорциональны, определитель равен 0.', 'If two rows (columns) are equal or proportional, the determinant is 0.'),
        T('Кез келген бір жолдың (бағанның) ортақ көбейткішін анықтауыш алдына шығаруға болады.', 'Общий множитель строки (столбца) можно вынести за знак определителя.', 'A common factor of a row (column) can be taken out of the determinant.'),
        T('Бір жолдың (бағанның) барлық элементтері екі қосылғыштан тұрса, анықтауыш екі анықтауыштың қосындысына тең:', 'Если все элементы строки (столбца) — суммы двух слагаемых, определитель равен сумме двух определителей:', 'If every entry of a row (column) is a sum of two terms, the determinant splits into a sum of two determinants:'),
        T('Бір жолдың (бағанның) элементтерін бірдей санға көбейтіп, басқа жолдың (бағанның) сәйкес элементтеріне қосқанда анықтауыштың мәні өзгермейді:', 'Если к элементам строки (столбца) прибавить элементы другой строки (столбца), умноженные на одно число, определитель не изменится:', 'Adding a multiple of one row (column) to another does not change the determinant:'),
      ],
    },
    {
      kind: 'formula',
      tex: r`\begin{vmatrix}a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31}+b_{31} & a_{32}+b_{32} & a_{33}+b_{33}\end{vmatrix}=\begin{vmatrix}a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33}\end{vmatrix}+\begin{vmatrix}a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ b_{31} & b_{32} & b_{33}\end{vmatrix}`,
      note: T('6-қасиет', 'Свойство 6', 'Property 6'),
    },
    {
      kind: 'formula',
      tex: r`\begin{vmatrix}a_{11}+ka_{31} & a_{12}+ka_{32} & a_{13}+ka_{33} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33}\end{vmatrix}=|A|+k\begin{vmatrix}a_{31} & a_{32} & a_{33} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33}\end{vmatrix}=|A|+k\cdot 0=|A|`,
      note: T('7-қасиет', 'Свойство 7', 'Property 7'),
    },
    {
      kind: 'note',
      tone: 'tip',
      text: T(
        '7-қасиет — анықтауышты жеңіл есептеудің негізгі құралы: жолдарды қосу арқылы бір бағанда нөлдер жасап, содан кейін жіктейміз.',
        'Свойство 7 — главный инструмент быстрого счёта: складывая строки, получаем нули в одном столбце, а затем раскладываем определитель.',
        'Property 7 is the main tool for fast computation: create zeros in one column by adding rows, then expand.'
      ),
    },

    { kind: 'h', text: T('Минорлар және алгебралық толықтауыштар', 'Миноры и алгебраические дополнения', 'Minors and cofactors') },
    {
      kind: 'def',
      term: T('Минор', 'Минор', 'Minor'),
      text: T(
        r`Анықтауыштың $a_{ij}$ элементі орналасқан жол мен бағанды сызып тастағаннан кейін қалған элементтерден құрылған анықтауыш осы элементтің миноры $M_{ij}$ деп аталады. Мысалы, 2-жол мен 3-бағанды сызсақ:`,
        r`Определитель, полученный вычёркиванием строки и столбца, в которых стоит элемент $a_{ij}$, называется минором $M_{ij}$ этого элемента. Например, вычеркнув 2-ю строку и 3-й столбец:`,
        r`The determinant left after deleting the row and column of the entry $a_{ij}$ is called the minor $M_{ij}$ of that entry. For example, deleting row 2 and column 3:`
      ),
      tex: r`M_{23}=\begin{vmatrix}a_{11} & a_{12} \\ a_{31} & a_{32}\end{vmatrix}`,
    },
    {
      kind: 'def',
      term: T('Алгебралық толықтауыш', 'Алгебраическое дополнение', 'Cofactor'),
      text: T(r`$a_{ij}$ элементінің алгебралық толықтауышы деп келесі санды айтамыз:`, r`Алгебраическим дополнением элемента $a_{ij}$ называется число`, r`The cofactor of the entry $a_{ij}$ is the number`),
      tex: r`A_{ij}=(-1)^{i+j}M_{ij} \qquad (3)`,
    },
    {
      kind: 'p',
      text: T(
        r`Мысалы, $A_{23}=(-1)^{2+3}M_{23}=-\begin{vmatrix}a_{11} & a_{12} \\ a_{31} & a_{32}\end{vmatrix}$. Таңбаны «шахмат тақтасы» бойынша есте сақтау ыңғайлы: $\begin{smallmatrix}+ & - & + \\ - & + & - \\ + & - & +\end{smallmatrix}$.`,
        r`Например, $A_{23}=(-1)^{2+3}M_{23}=-\begin{vmatrix}a_{11} & a_{12} \\ a_{31} & a_{32}\end{vmatrix}$. Знак удобно запоминать по «шахматной доске»: $\begin{smallmatrix}+ & - & + \\ - & + & - \\ + & - & +\end{smallmatrix}$.`,
        r`For example, $A_{23}=(-1)^{2+3}M_{23}=-\begin{vmatrix}a_{11} & a_{12} \\ a_{31} & a_{32}\end{vmatrix}$. The sign follows a chessboard pattern: $\begin{smallmatrix}+ & - & + \\ - & + & - \\ + & - & +\end{smallmatrix}$.`
      ),
    },
    {
      kind: 'thm',
      title: T('Теорема (алгебралық толықтауыш туралы)', 'Теорема (об алгебраических дополнениях)', 'Theorem (cofactor expansion)'),
      text: T(
        'Кез келген жолдың (бағанның) элементтері мен олардың алгебралық толықтауыштары көбейтінділерінің қосындысы анықтауыштың мәніне тең. Мысалы, 1-жол бойынша жіктеу:',
        'Сумма произведений элементов любой строки (столбца) на их алгебраические дополнения равна определителю. Например, разложение по 1-й строке:',
        'The sum of products of the entries of any row (column) with their cofactors equals the determinant. For example, expansion along row 1:'
      ),
      tex: r`\Delta_{A}=${DET3_GENERAL}=a_{11}A_{11}+a_{12}A_{12}+a_{13}A_{13} \qquad (4)`,
    },
    {
      kind: 'p',
      text: T(
        r`Дәл осылай $n$-ші ретті анықтауыш та кез келген $i$-жол немесе $j$-баған бойынша жіктеледі:`,
        r`Точно так же определитель $n$-го порядка раскладывается по любой $i$-й строке или $j$-му столбцу:`,
        r`In the same way an $n$-th order determinant is expanded along any row $i$ or column $j$:`
      ),
    },
    { kind: 'formula', tex: r`\Delta_{A}=a_{i1}A_{i1}+a_{i2}A_{i2}+\ldots+a_{in}A_{in}=a_{1j}A_{1j}+a_{2j}A_{2j}+\ldots+a_{nj}A_{nj}` },

    { kind: 'h', text: T('Кері матрица', 'Обратная матрица', 'Inverse matrix') },
    {
      kind: 'def',
      term: T('Ерекше және ерекше емес матрица', 'Вырожденная и невырожденная матрица', 'Singular and non-singular matrix'),
      text: T(
        'Квадрат матрицаның анықтауышы 0-ге тең болса, ол ерекше (азғындалған) матрица, ал 0-ден өзгеше болса, ерекше емес матрица деп аталады.',
        'Квадратная матрица с определителем, равным 0, называется вырожденной (особой), а с ненулевым определителем — невырожденной.',
        'A square matrix with zero determinant is called singular; with a non-zero determinant — non-singular.'
      ),
    },
    {
      kind: 'def',
      term: T('Кері матрица', 'Обратная матрица', 'Inverse matrix'),
      text: T(r`$A$ матрицасының кері матрицасы деп келесі теңдікті қанағаттандыратын $A^{-1}$ матрицасын айтады:`, r`Обратной к матрице $A$ называется матрица $A^{-1}$, для которой`, r`The inverse of $A$ is the matrix $A^{-1}$ such that`),
      tex: r`A\cdot A^{-1}=A^{-1}\cdot A=E \qquad (5)`,
    },
    {
      kind: 'p',
      text: T(
        'Тек ерекше емес матрицаның ғана кері матрицасы болады. Ол келесі формуламен табылады (алгебралық толықтауыштар транспонирленіп жазылады!):',
        'Обратная матрица существует только у невырожденной матрицы. Она находится по формуле (алгебраические дополнения записываются транспонированно!):',
        'Only a non-singular matrix has an inverse. It is given by the formula (note the cofactors are transposed!):'
      ),
    },
    { kind: 'formula', tex: r`A^{-1}=\frac{1}{\Delta_{A}}\begin{pmatrix}A_{11} & A_{21} & A_{31} \\ A_{12} & A_{22} & A_{32} \\ A_{13} & A_{23} & A_{33}\end{pmatrix}`, tag: '6' },
    {
      kind: 'note',
      tone: 'tip',
      text: T(
        r`$2\times 2$ матрица үшін: $\begin{pmatrix}a & b \\ c & d\end{pmatrix}^{-1}=\dfrac{1}{ad-bc}\begin{pmatrix}d & -b \\ -c & a\end{pmatrix}$ — бас диагональ элементтерінің орнын ауыстырып, қалғандарының таңбасын өзгертеміз.`,
        r`Для матрицы $2\times 2$: $\begin{pmatrix}a & b \\ c & d\end{pmatrix}^{-1}=\dfrac{1}{ad-bc}\begin{pmatrix}d & -b \\ -c & a\end{pmatrix}$ — элементы главной диагонали меняем местами, у остальных меняем знак.`,
        r`For a $2\times 2$ matrix: $\begin{pmatrix}a & b \\ c & d\end{pmatrix}^{-1}=\dfrac{1}{ad-bc}\begin{pmatrix}d & -b \\ -c & a\end{pmatrix}$ — swap the main diagonal, change the sign of the other two.`
      ),
    },
    {
      kind: 'example',
      example: {
        title: T('Мысал', 'Пример', 'Example'),
        task: T('$A$ матрицасына кері матрицаны табу керек.', 'Найти матрицу, обратную к $A$.', 'Find the inverse of $A$.'),
        given: r`A=\begin{pmatrix}1 & 2 & -1 \\ 0 & -1 & 1 \\ 2 & 0 & 1\end{pmatrix}`,
        steps: [
          {
            text: T('1. Анықтауышты табамыз (3-жолдан 1-жолдың екі еселенгенін азайтып):', '1. Находим определитель (из 3-й строки вычли удвоенную 1-ю):', '1. Find the determinant (subtract twice row 1 from row 3):'),
            tex: r`\Delta_{A}=\begin{vmatrix}1 & 2 & -1 \\ 0 & -1 & 1 \\ 2 & 0 & 1\end{vmatrix}=\begin{vmatrix}1 & 2 & -1 \\ 0 & -1 & 1 \\ 0 & -4 & 3\end{vmatrix}=-3+4=1\ne 0`,
          },
          {
            text: T('2. Барлық алгебралық толықтауыштарды табамыз:', '2. Находим все алгебраические дополнения:', '2. Find all cofactors:'),
            tex: r`\begin{aligned}A_{11}&=\begin{vmatrix}-1 & 1 \\ 0 & 1\end{vmatrix}=-1, & A_{12}&=-\begin{vmatrix}0 & 1 \\ 2 & 1\end{vmatrix}=2, & A_{13}&=\begin{vmatrix}0 & -1 \\ 2 & 0\end{vmatrix}=2,\\ A_{21}&=-\begin{vmatrix}2 & -1 \\ 0 & 1\end{vmatrix}=-2, & A_{22}&=\begin{vmatrix}1 & -1 \\ 2 & 1\end{vmatrix}=3, & A_{23}&=-\begin{vmatrix}1 & 2 \\ 2 & 0\end{vmatrix}=4,\\ A_{31}&=\begin{vmatrix}2 & -1 \\ -1 & 1\end{vmatrix}=1, & A_{32}&=-\begin{vmatrix}1 & -1 \\ 0 & 1\end{vmatrix}=-1, & A_{33}&=\begin{vmatrix}1 & 2 \\ 0 & -1\end{vmatrix}=-1.\end{aligned}`,
          },
          {
            text: T('3. (6) формула бойынша:', '3. По формуле (6):', '3. By formula (6):'),
            tex: r`A^{-1}=\frac{1}{1}\begin{pmatrix}-1 & -2 & 1 \\ 2 & 3 & -1 \\ 2 & 4 & -1\end{pmatrix}`,
          },
          {
            text: T('4. Тексеру: (5) шарт орындалады.', '4. Проверка: условие (5) выполняется.', '4. Check: condition (5) holds.'),
            tex: r`A\cdot A^{-1}=\begin{pmatrix}1 & 2 & -1 \\ 0 & -1 & 1 \\ 2 & 0 & 1\end{pmatrix}\begin{pmatrix}-1 & -2 & 1 \\ 2 & 3 & -1 \\ 2 & 4 & -1\end{pmatrix}=\begin{pmatrix}1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1\end{pmatrix}=E`,
          },
        ],
        answer: X(r`$A^{-1}=\begin{pmatrix}-1 & -2 & 1 \\ 2 & 3 & -1 \\ 2 & 4 & -1\end{pmatrix}$`),
      },
    },
  ],
  practice: {
    sessions: '1–4',
    goal: T(
      'Екінші, үшінші ретті анықтауыштарды есептей білу, минорлар мен алгебралық толықтауыштарды табу, кері матрицаны құру.',
      'Уметь вычислять определители второго и третьего порядка, находить миноры и алгебраические дополнения, строить обратную матрицу.',
      'Compute second- and third-order determinants, find minors and cofactors, build the inverse matrix.'
    ),
    questions: [
      T('Анықтауыштарды қалай есептейді?', 'Как вычисляют определители?', 'How are determinants computed?'),
      T('Алгебралық толықтауыштар және минорлар.', 'Алгебраические дополнения и миноры.', 'Cofactors and minors.'),
      T('Кері матрица қалай табылады?', 'Как находится обратная матрица?', 'How is the inverse matrix found?'),
    ],
    examples: [
      {
        title: T('1-мысал', 'Пример 1', 'Example 1'),
        task: T('Анықтауышты 1-жол элементтері бойынша жіктеп есептеңіз.', 'Вычислите определитель разложением по элементам 1-й строки.', 'Compute the determinant by expanding along row 1.'),
        given: r`\Delta=\begin{vmatrix}1 & 2 & 1 \\ 3 & 2 & 1 \\ 4 & 3 & -2\end{vmatrix}`,
        steps: [
          { tex: r`\Delta=1\cdot\begin{vmatrix}2 & 1 \\ 3 & -2\end{vmatrix}-2\cdot\begin{vmatrix}3 & 1 \\ 4 & -2\end{vmatrix}+1\cdot\begin{vmatrix}3 & 2 \\ 4 & 3\end{vmatrix}` },
          { tex: r`=1\cdot(-4-3)-2\cdot(-6-4)+1\cdot(9-8)=-7+20+1=14` },
        ],
        answer: X('$\\Delta=14$'),
      },
      {
        title: T('2-мысал', 'Пример 2', 'Example 2'),
        task: T(
          r`Сол анықтауыштың $a_{12}$ элементінің минорын және алгебралық толықтауышын табыңыз.`,
          r`Найдите минор и алгебраическое дополнение элемента $a_{12}$ того же определителя.`,
          r`Find the minor and the cofactor of the entry $a_{12}$ of the same determinant.`
        ),
        given: r`\Delta=\begin{vmatrix}1 & 2 & 1 \\ 3 & 2 & 1 \\ 4 & 3 & -2\end{vmatrix}`,
        steps: [
          { text: T('1-жол мен 2-бағанды сызамыз:', 'Вычёркиваем 1-ю строку и 2-й столбец:', 'Delete row 1 and column 2:'), tex: r`M_{12}=\begin{vmatrix}3 & 1 \\ 4 & -2\end{vmatrix}=-6-4=-10` },
          { tex: r`A_{12}=(-1)^{1+2}M_{12}=-(-10)=10` },
        ],
        answer: X('$M_{12}=-10,\\; A_{12}=10$'),
        added: true,
      },
      {
        title: T('3-мысал', 'Пример 3', 'Example 3'),
        task: T('Кері матрицаны табыңыз және тексеріңіз.', 'Найдите обратную матрицу и выполните проверку.', 'Find the inverse matrix and check it.'),
        given: r`A=\begin{pmatrix}2 & 1 \\ 5 & 3\end{pmatrix}`,
        steps: [
          { tex: r`\Delta_{A}=2\cdot 3-1\cdot 5=1\ne 0` },
          { tex: r`A^{-1}=\frac{1}{1}\begin{pmatrix}3 & -1 \\ -5 & 2\end{pmatrix}=\begin{pmatrix}3 & -1 \\ -5 & 2\end{pmatrix}` },
          { tex: r`A\cdot A^{-1}=\begin{pmatrix}2\cdot 3+1\cdot(-5) & 2\cdot(-1)+1\cdot 2 \\ 5\cdot 3+3\cdot(-5) & 5\cdot(-1)+3\cdot 2\end{pmatrix}=\begin{pmatrix}1 & 0 \\ 0 & 1\end{pmatrix}` },
        ],
        answer: X(r`$A^{-1}=\begin{pmatrix}3 & -1 \\ -5 & 2\end{pmatrix}$`),
        added: true,
      },
    ],
  },
  selfCheck: [
    {
      q: T('Анықтауыштың анықтамасы және қасиеттері қандай?', 'Каковы определение и свойства определителя?', 'What are the definition and properties of a determinant?'),
      a: T(
        'Анықтауыш — квадрат матрицаға сәйкес сан. Негізгі қасиеттері: транспонирлегенде өзгермейді; екі жолды ауыстырғанда таңбасы өзгереді; нөлдік немесе пропорционал жолдар болса 0-ге тең; ортақ көбейткішті шығаруға болады; бір жолға басқа жолдың еселігін қосқанда өзгермейді.',
        'Определитель — число, сопоставленное квадратной матрице. Свойства: не меняется при транспонировании; меняет знак при перестановке строк; равен 0 при нулевой или пропорциональных строках; общий множитель выносится; не меняется, если к строке прибавить кратное другой строки.',
        'A determinant is a number assigned to a square matrix. It is unchanged by transposition, changes sign when two rows are swapped, is 0 with a zero or proportional rows, allows taking out a common factor, and is unchanged when a multiple of one row is added to another.'
      ),
    },
    {
      q: T('Екінші және үшінші ретті анықтауыштар қалай есептеледі?', 'Как вычисляются определители второго и третьего порядка?', 'How are second- and third-order determinants computed?'),
      a: T(
        r`Екінші ретті: $a_{11}a_{22}-a_{12}a_{21}$. Үшінші ретті: үшбұрыштар ережесі бойынша (үш «+» және үш «−» көбейтінді) немесе жол/баған бойынша жіктеу арқылы.`,
        r`Второго порядка: $a_{11}a_{22}-a_{12}a_{21}$. Третьего порядка: по правилу треугольников (три произведения «+» и три «−») или разложением по строке/столбцу.`,
        r`Second order: $a_{11}a_{22}-a_{12}a_{21}$. Third order: by the rule of triangles (three “+” and three “−” products) or by expansion along a row/column.`
      ),
    },
    {
      q: T('Минор мен алгебралық толықтауыштың айырмашылығы неде?', 'Чем минор отличается от алгебраического дополнения?', 'How does a minor differ from a cofactor?'),
      a: T(
        r`Минор $M_{ij}$ — жол мен бағанды сызғаннан қалған анықтауыш. Алгебралық толықтауыш $A_{ij}=(-1)^{i+j}M_{ij}$ — таңбасы ескерілген минор.`,
        r`Минор $M_{ij}$ — определитель, оставшийся после вычёркивания строки и столбца. Алгебраическое дополнение $A_{ij}=(-1)^{i+j}M_{ij}$ — минор с учётом знака.`,
        r`The minor $M_{ij}$ is the determinant left after deleting a row and a column. The cofactor $A_{ij}=(-1)^{i+j}M_{ij}$ is the minor with a sign.`
      ),
    },
    {
      q: T('Кері матрица қашан бар және қалай табылады?', 'Когда существует обратная матрица и как её найти?', 'When does the inverse exist and how is it found?'),
      a: T(
        r`Тек $\det A\ne 0$ болғанда. $A^{-1}=\frac{1}{\Delta_A}(A_{ji})$: алгебралық толықтауыштардан матрица құрып, оны транспонирлейміз және анықтауышқа бөлеміз. Тексеру: $A\cdot A^{-1}=E$.`,
        r`Только при $\det A\ne 0$. $A^{-1}=\frac{1}{\Delta_A}(A_{ji})$: составляем матрицу из алгебраических дополнений, транспонируем её и делим на определитель. Проверка: $A\cdot A^{-1}=E$.`,
        r`Only when $\det A\ne 0$. $A^{-1}=\frac{1}{\Delta_A}(A_{ji})$: build the matrix of cofactors, transpose it and divide by the determinant. Check: $A\cdot A^{-1}=E$.`
      ),
    },
  ],
  test: [
    {
      q: T(r`$\begin{vmatrix}2 & 3 \\ 1 & 4\end{vmatrix}$ неге тең?`, r`Чему равен $\begin{vmatrix}2 & 3 \\ 1 & 4\end{vmatrix}$?`, r`What is $\begin{vmatrix}2 & 3 \\ 1 & 4\end{vmatrix}$?`),
      options: [X('5'), X('11'), X('-5'), X('8')],
      correct: 0,
      explain: X(r`$2\cdot 4-3\cdot 1=5$`),
    },
    {
      q: T('Екі жолды ауыстырғанда анықтауыш қалай өзгереді?', 'Как меняется определитель при перестановке двух строк?', 'What happens to a determinant when two rows are swapped?'),
      options: [T('Таңбасы өзгереді', 'Меняет знак', 'It changes sign'), T('Өзгермейді', 'Не меняется', 'It does not change'), T('0-ге тең болады', 'Становится 0', 'It becomes 0'), T('Екі есе өседі', 'Удваивается', 'It doubles')],
      correct: 0,
      explain: T('3-қасиет.', 'Свойство 3.', 'Property 3.'),
    },
    {
      q: T(r`$A_{12}$ мен $M_{12}$ қалай байланысты?`, r`Как связаны $A_{12}$ и $M_{12}$?`, r`How are $A_{12}$ and $M_{12}$ related?`),
      options: [X('$A_{12}=-M_{12}$'), X('$A_{12}=M_{12}$'), X('$A_{12}=2M_{12}$'), X('$A_{12}=M_{21}$')],
      correct: 0,
      explain: X(r`$(-1)^{1+2}=-1$`),
    },
    {
      q: T('Кері матрица қашан бар?', 'Когда существует обратная матрица?', 'When does the inverse matrix exist?'),
      options: [X(r`$\det A\ne 0$`), X(r`$\det A=0$`), T('Әрқашан', 'Всегда', 'Always'), T('Тек $2\\times 2$ үшін', 'Только для $2\\times 2$', 'Only for $2\\times 2$')],
      correct: 0,
      explain: T('Тек ерекше емес матрицаның кері матрицасы болады.', 'Обратная есть только у невырожденной матрицы.', 'Only non-singular matrices are invertible.'),
    },
    {
      q: T(r`$\begin{vmatrix}1 & 2 & 3 \\ 2 & 4 & 6 \\ 7 & 1 & 5\end{vmatrix}$ неге тең?`, r`Чему равен $\begin{vmatrix}1 & 2 & 3 \\ 2 & 4 & 6 \\ 7 & 1 & 5\end{vmatrix}$?`, r`What is $\begin{vmatrix}1 & 2 & 3 \\ 2 & 4 & 6 \\ 7 & 1 & 5\end{vmatrix}$?`),
      options: [X('0'), X('12'), X('-12'), X('36')],
      correct: 0,
      explain: T('1 және 2-жолдар пропорционал (4-қасиет).', '1-я и 2-я строки пропорциональны (свойство 4).', 'Rows 1 and 2 are proportional (property 4).'),
    },
    {
      q: T(r`$\begin{pmatrix}3 & 1 \\ 5 & 2\end{pmatrix}^{-1}$ неге тең?`, r`Чему равна $\begin{pmatrix}3 & 1 \\ 5 & 2\end{pmatrix}^{-1}$?`, r`What is $\begin{pmatrix}3 & 1 \\ 5 & 2\end{pmatrix}^{-1}$?`),
      options: [X(r`$\begin{pmatrix}2 & -1 \\ -5 & 3\end{pmatrix}$`), X(r`$\begin{pmatrix}2 & 1 \\ 5 & 3\end{pmatrix}$`), X(r`$\begin{pmatrix}3 & -1 \\ -5 & 2\end{pmatrix}$`), X(r`$\begin{pmatrix}-2 & 1 \\ 5 & -3\end{pmatrix}$`)],
      correct: 0,
      explain: X(r`$\Delta=6-5=1,\; A^{-1}=\begin{pmatrix}2 & -1 \\ -5 & 3\end{pmatrix}$`),
    },
  ],
  trainers: ['det2', 'det3', 'cofactor', 'transpose', 'inverse2'],
  related: [{ courseId: 'linal', lessonId: 'determinant' }],
  editorNotes: [
    'Дәріс 2: A₂₃ = (−1)²⁺³·M₂₃ мысалында минус таңбасы қосылды.',
    'Дәріс 2: n-ші ретті анықтауыштың жіктелуі 3-дәрістің басынан осы дәріске көшірілді (тақырыпта бар).',
    'Дәріс 2: 2×2 кері матрицаның қысқа формуласы мен практикадағы 2, 3-мысалдар қосылды.',
  ],
};
