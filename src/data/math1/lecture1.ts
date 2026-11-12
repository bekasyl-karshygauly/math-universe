import { Lecture, T, X } from './types';

const r = String.raw;

export const LECTURE_1: Lecture = {
  id: 'm1-l1',
  number: 1,
  title: T('Матрицалар. Матрица түрлері. Матрицаларға амалдар қолдану', 'Матрицы. Виды матриц. Действия над матрицами', 'Matrices. Types of matrices. Matrix operations'),
  summary: T(
    'Матрица — сандардың тікбұрышты кестесі. Бұл дәрісте матрицалардың түрлерін және оларды қосу, санға көбейту, бір-біріне көбейту ережелерін үйренесіз.',
    'Матрица — прямоугольная таблица чисел. В этой лекции вы узнаете виды матриц и научитесь складывать матрицы, умножать их на число и друг на друга.',
    'A matrix is a rectangular table of numbers. In this lecture you will learn the types of matrices and how to add them, multiply them by a number and by each other.'
  ),
  topics: [
    T('m×n өлшемі', 'размер m×n', 'size m×n'),
    T('квадрат, бірлік, нөлдік матрица', 'квадратная, единичная, нулевая', 'square, identity, zero'),
    T('қосу және санға көбейту', 'сложение и умножение на число', 'addition and scaling'),
    T('матрицаларды көбейту', 'умножение матриц', 'matrix multiplication'),
  ],
  blocks: [
    { kind: 'h', text: T('Матрицалар және олардың түрлері', 'Матрицы и их виды', 'Matrices and their types') },
    {
      kind: 'def',
      term: T('Матрица', 'Матрица', 'Matrix'),
      text: T(
        r`$m$ жолдан және $n$ бағаннан тұратын кесте түрінде жазылған сандар жиынтығы $m \times n$ өлшемді матрица деп аталады.`,
        r`Совокупность чисел, записанная в виде таблицы из $m$ строк и $n$ столбцов, называется матрицей размера $m \times n$.`,
        r`A set of numbers written as a table of $m$ rows and $n$ columns is called an $m \times n$ matrix.`
      ),
    },
    {
      kind: 'formula',
      tex: r`A=\begin{pmatrix}a_{11} & a_{12} & \ldots & a_{1n} \\ a_{21} & a_{22} & \ldots & a_{2n} \\ \ldots & \ldots & \ldots & \ldots \\ a_{m1} & a_{m2} & \ldots & a_{mn}\end{pmatrix}=\left\| a_{ij} \right\|,\quad i=1,2,\ldots,m,\; j=1,2,\ldots,n`,
      tag: '1',
    },
    {
      kind: 'p',
      text: T(
        r`Мұндағы $a_{11}, a_{12}, \ldots, a_{mn}$ — матрица элементтері. $a_{ij}$ элементінің бірінші индексі $i$ — жол нөмірі, екіншісі $j$ — баған нөмірі.`,
        r`Здесь $a_{11}, a_{12}, \ldots, a_{mn}$ — элементы матрицы. Первый индекс элемента $a_{ij}$ — номер строки $i$, второй — номер столбца $j$.`,
        r`Here $a_{11}, a_{12}, \ldots, a_{mn}$ are the matrix entries. In $a_{ij}$ the first index $i$ is the row number and the second index $j$ is the column number.`
      ),
    },
    {
      kind: 'def',
      term: T('Тікбұрышты және квадрат матрица', 'Прямоугольная и квадратная матрица', 'Rectangular and square matrix'),
      text: T(
        r`Матрицаның жолдар саны мен бағандар саны әртүрлі болса, ол тікбұрышты, ал олар тең, яғни $m = n$ болса, квадрат матрица деп аталады.`,
        r`Если число строк и число столбцов матрицы различны, она называется прямоугольной, а если они равны, т. е. $m = n$, — квадратной.`,
        r`If the numbers of rows and columns differ, the matrix is rectangular; if they are equal, $m = n$, it is a square matrix.`
      ),
    },
    {
      kind: 'p',
      text: T(
        r`Квадрат матрицаның $a_{11}, a_{22}, \ldots, a_{nn}$ элементтері бас диагональ, ал $a_{1n}, a_{2,n-1}, \ldots, a_{n1}$ элементтері қосалқы диагональ құрайды.`,
        r`Элементы $a_{11}, a_{22}, \ldots, a_{nn}$ квадратной матрицы образуют главную диагональ, а элементы $a_{1n}, a_{2,n-1}, \ldots, a_{n1}$ — побочную диагональ.`,
        r`The entries $a_{11}, a_{22}, \ldots, a_{nn}$ of a square matrix form the main diagonal, and $a_{1n}, a_{2,n-1}, \ldots, a_{n1}$ form the secondary diagonal.`
      ),
    },
    {
      kind: 'def',
      term: T('Жол матрица және баған матрица', 'Матрица-строка и матрица-столбец', 'Row matrix and column matrix'),
      text: T(
        r`Егер $m = 1$ болса, матрица жол матрица, ал $n = 1$ болса, баған матрица деп аталады:`,
        r`Если $m = 1$, матрица называется матрицей-строкой, а если $n = 1$ — матрицей-столбцом:`,
        r`If $m = 1$ the matrix is called a row matrix, and if $n = 1$ — a column matrix:`
      ),
      tex: r`A=\begin{pmatrix} a_{1} & a_{2} & \ldots & a_{n}\end{pmatrix}, \qquad A=\begin{pmatrix} a_{1} \\ a_{2} \\ \vdots \\ a_{m}\end{pmatrix}`,
    },
    {
      kind: 'def',
      term: T('Тең матрицалар', 'Равные матрицы', 'Equal matrices'),
      text: T(
        'Өлшемдері бірдей екі матрицаның сәйкес элементтері тең болса, олар тең матрицалар деп аталады.',
        'Две матрицы одинакового размера называются равными, если равны их соответствующие элементы.',
        'Two matrices of the same size are equal if their corresponding entries are equal.'
      ),
    },
    {
      kind: 'def',
      term: T('Нөлдік матрица', 'Нулевая матрица', 'Zero matrix'),
      text: T('Матрицаның барлық элементтері 0-ге тең болса, ол нөлдік матрица деп аталады.', 'Матрица, все элементы которой равны 0, называется нулевой.', 'A matrix whose entries are all 0 is called the zero matrix.'),
    },
    {
      kind: 'def',
      term: T('Диагональ матрица', 'Диагональная матрица', 'Diagonal matrix'),
      text: T(
        'Бас диагональдан тыс барлық элементтері 0-ге тең квадрат матрица диагональ матрица деп аталады.',
        'Квадратная матрица, у которой все элементы вне главной диагонали равны 0, называется диагональной.',
        'A square matrix whose entries outside the main diagonal are all 0 is called a diagonal matrix.'
      ),
    },
    {
      kind: 'def',
      term: T('Бірлік матрица', 'Единичная матрица', 'Identity matrix'),
      text: T(
        'Квадрат матрицаның бас диагональ элементтері 1-ге тең болып, қалған элементтері 0-ге тең болса, ол бірлік матрица деп аталады және $E$ әрпімен белгіленеді.',
        'Квадратная матрица, у которой элементы главной диагонали равны 1, а остальные равны 0, называется единичной и обозначается $E$.',
        'A square matrix with 1 on the main diagonal and 0 elsewhere is called the identity matrix and is denoted $E$.'
      ),
      tex: r`E=\begin{pmatrix}1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1\end{pmatrix}`,
    },

    { kind: 'h', text: T('Матрицаларға амалдар қолдану', 'Действия над матрицами', 'Matrix operations') },
    { kind: 'h', text: T('Матрицаларды қосу', 'Сложение матриц', 'Addition') },
    {
      kind: 'p',
      text: T(
        'Өлшемдері бірдей матрицаларды ғана қосуға болады: олардың сәйкес элементтері қосылады.',
        'Складывать можно только матрицы одинакового размера: складываются их соответствующие элементы.',
        'Only matrices of the same size can be added: corresponding entries are added.'
      ),
    },
    {
      kind: 'example',
      example: {
        title: T('Мысал 1', 'Пример 1', 'Example 1'),
        task: T('Матрицалардың қосындысын табу керек.', 'Найти сумму матриц.', 'Find the sum of the matrices.'),
        given: r`A=\begin{pmatrix}2 & 1 & 5 \\ 3 & 0 & 1\end{pmatrix},\quad B=\begin{pmatrix}-1 & 3 & 4 \\ 0 & 2 & -5\end{pmatrix}`,
        steps: [
          {
            text: T('Сәйкес элементтерді қосамыз:', 'Складываем соответствующие элементы:', 'Add the corresponding entries:'),
            tex: r`C=A+B=\begin{pmatrix}2+(-1) & 1+3 & 5+4 \\ 3+0 & 0+2 & 1+(-5)\end{pmatrix}=\begin{pmatrix}1 & 4 & 9 \\ 3 & 2 & -4\end{pmatrix}`,
          },
        ],
        answer: X(r`$C=\begin{pmatrix}1 & 4 & 9 \\ 3 & 2 & -4\end{pmatrix}$`),
      },
    },
    { kind: 'p', text: T('Матрицаларды қосу келесі заңдарға бағынады:', 'Сложение матриц подчиняется законам:', 'Matrix addition obeys the laws:') },
    {
      kind: 'list',
      items: [
        T(r`$A+B=B+A$ — орын ауыстыру заңы;`, r`$A+B=B+A$ — переместительный закон;`, r`$A+B=B+A$ — commutative law;`),
        T(r`$(A+B)+C=A+(B+C)$ — терімділік заңы.`, r`$(A+B)+C=A+(B+C)$ — сочетательный закон.`, r`$(A+B)+C=A+(B+C)$ — associative law.`),
      ],
    },
    {
      kind: 'p',
      text: T(
        r`Өлшемдері бірдей матрицалар үшін азайту амалы да орындалады: $A-B=A+(-1)\cdot B$.`,
        r`Для матриц одинакового размера определено и вычитание: $A-B=A+(-1)\cdot B$.`,
        r`Subtraction is defined for matrices of the same size too: $A-B=A+(-1)\cdot B$.`
      ),
    },
    { kind: 'h', text: T('Матрицаны санға көбейту', 'Умножение матрицы на число', 'Multiplying a matrix by a number') },
    {
      kind: 'p',
      text: T(
        'Матрицаны кез келген $k$ санына көбейтуге болады: матрицаның барлық элементтері осы санға көбейтіледі.',
        'Матрицу можно умножить на любое число $k$: все элементы матрицы умножаются на это число.',
        'A matrix can be multiplied by any number $k$: every entry is multiplied by that number.'
      ),
    },
    { kind: 'formula', tex: r`k\cdot A=\begin{pmatrix}ka_{11} & ka_{12} \\ ka_{21} & ka_{22}\end{pmatrix}`, tag: '2' },

    { kind: 'h', text: T('Матрицаларды көбейту', 'Умножение матриц', 'Matrix multiplication') },
    {
      kind: 'p',
      text: T(
        'Егер бірінші матрицаның бағандар саны екінші матрицаның жолдар санына тең болса, бұл матрицаларды көбейтуге болады. $A_{m\\times k}\\cdot B_{k\\times n}$ көбейтіндісі — $m\\times n$ өлшемді $C$ матрицасы, оның әр элементі $A$-ның $i$-жолы мен $B$-ның $j$-бағанының сәйкес элементтері көбейтінділерінің қосындысына тең:',
        'Матрицы можно перемножить, если число столбцов первой матрицы равно числу строк второй. Произведение $A_{m\\times k}\\cdot B_{k\\times n}$ — матрица $C$ размера $m\\times n$, каждый элемент которой равен сумме произведений элементов $i$-й строки $A$ на соответствующие элементы $j$-го столбца $B$:',
        'Two matrices can be multiplied when the number of columns of the first equals the number of rows of the second. The product $A_{m\\times k}\\cdot B_{k\\times n}$ is an $m\\times n$ matrix $C$; each entry is the sum of products of row $i$ of $A$ with column $j$ of $B$:'
      ),
    },
    { kind: 'formula', tex: r`c_{ij}=a_{i1}b_{1j}+a_{i2}b_{2j}+\ldots+a_{ik}b_{kj}=\sum_{s=1}^{k} a_{is}b_{sj}` },
    { kind: 'visual', id: 'matrix-product' },
    {
      kind: 'example',
      example: {
        title: T('Мысал 2', 'Пример 2', 'Example 2'),
        task: T('$A$ және $B$ матрицаларының көбейтіндісін табу керек.', 'Найти произведение матриц $A$ и $B$.', 'Find the product of $A$ and $B$.'),
        given: r`A=\begin{pmatrix}3 & 5 & 7 \\ -4 & 2 & 3\end{pmatrix},\quad B=\begin{pmatrix}3 & 2 \\ 5 & 3 \\ -1 & 4\end{pmatrix}`,
        steps: [
          {
            text: T(
              r`$A$ өлшемі $2\times 3$, $B$ өлшемі $3\times 2$, сондықтан $A\cdot B$ өлшемі $2\times 2$ болады. Жолды бағанға көбейтеміз:`,
              r`Размер $A$ — $2\times 3$, размер $B$ — $3\times 2$, значит $A\cdot B$ имеет размер $2\times 2$. Умножаем строку на столбец:`,
              r`$A$ is $2\times 3$ and $B$ is $3\times 2$, so $A\cdot B$ is $2\times 2$. Multiply row by column:`
            ),
            tex: r`A\cdot B=\begin{pmatrix}3\cdot 3+5\cdot 5+7\cdot(-1) & 3\cdot 2+5\cdot 3+7\cdot 4 \\ -4\cdot 3+2\cdot 5+3\cdot(-1) & -4\cdot 2+2\cdot 3+3\cdot 4\end{pmatrix}=\begin{pmatrix}27 & 49 \\ -5 & 10\end{pmatrix}`,
          },
        ],
        answer: X(r`$A\cdot B=\begin{pmatrix}27 & 49 \\ -5 & 10\end{pmatrix}$`),
      },
    },
    {
      kind: 'note',
      tone: 'warn',
      text: T(
        r`Матрицаларды көбейтуде орын ауыстыру заңы орындала бермейді: жалпы жағдайда $A\cdot B\ne B\cdot A$, ал кейде $B\cdot A$ көбейтіндісі мүлдем анықталмайды. Матрицаны матрицаға бөлуге болмайды.`,
        r`Для умножения матриц переместительный закон в общем случае не выполняется: $A\cdot B\ne B\cdot A$, а произведение $B\cdot A$ может вообще не существовать. Делить матрицу на матрицу нельзя.`,
        r`Matrix multiplication is not commutative in general: $A\cdot B\ne B\cdot A$, and $B\cdot A$ may not even exist. A matrix cannot be divided by a matrix.`
      ),
    },
    { kind: 'p', text: T('Матрицаларды көбейтудің қасиеттері:', 'Свойства умножения матриц:', 'Properties of matrix multiplication:') },
    {
      kind: 'list',
      items: [
        T(r`$(AB)C=A(BC)$ — терімділік заңы;`, r`$(AB)C=A(BC)$ — сочетательный закон;`, r`$(AB)C=A(BC)$ — associative law;`),
        T(r`$(A+B)C=AC+BC,\; A(B+C)=AB+AC$ — үлестірімділік заңы;`, r`$(A+B)C=AC+BC,\; A(B+C)=AB+AC$ — распределительный закон;`, r`$(A+B)C=AC+BC,\; A(B+C)=AB+AC$ — distributive law;`),
        T(r`$A\cdot E=E\cdot A=A$ — бірлік матрица көбейтуде «бір» санының рөлін атқарады.`, r`$A\cdot E=E\cdot A=A$ — единичная матрица играет роль числа «один».`, r`$A\cdot E=E\cdot A=A$ — the identity matrix plays the role of the number one.`),
      ],
    },
  ],
  practice: {
    sessions: '1–4',
    goal: T(
      'Студент матрицаларға амалдар қолдана білуі керек.',
      'Студент должен уметь выполнять действия над матрицами.',
      'The student should be able to perform operations on matrices.'
    ),
    questions: [
      T('Матрицаның анықтамасы, оларға қолданылатын амалдар қандай?', 'Определение матрицы. Какие действия над ними выполняются?', 'Definition of a matrix. Which operations can be performed on matrices?'),
      T('Қандай матрицаларды қосуға және көбейтуге болады?', 'Какие матрицы можно складывать и перемножать?', 'Which matrices can be added and multiplied?'),
    ],
    examples: [
      {
        title: T('1-мысал', 'Пример 1', 'Example 1'),
        task: T('Матрицалардың қосындысын табыңыз.', 'Найдите сумму матриц.', 'Find the sum of the matrices.'),
        given: r`A=\begin{pmatrix}3 & 5 & 7 \\ 2 & -1 & 0 \\ 4 & 3 & 2\end{pmatrix},\quad B=\begin{pmatrix}1 & 2 & 4 \\ 2 & 3 & -2 \\ -1 & 0 & 1\end{pmatrix}`,
        steps: [
          { tex: r`A+B=\begin{pmatrix}3+1 & 5+2 & 7+4 \\ 2+2 & -1+3 & 0+(-2) \\ 4+(-1) & 3+0 & 2+1\end{pmatrix}=\begin{pmatrix}4 & 7 & 11 \\ 4 & 2 & -2 \\ 3 & 3 & 3\end{pmatrix}` },
        ],
        answer: X(r`$\begin{pmatrix}4 & 7 & 11 \\ 4 & 2 & -2 \\ 3 & 3 & 3\end{pmatrix}$`),
      },
      {
        title: T('2-мысал', 'Пример 2', 'Example 2'),
        task: T('$2A+5B$ матрицасын табу керек.', 'Найти матрицу $2A+5B$.', 'Find the matrix $2A+5B$.'),
        given: r`A=\begin{pmatrix}3 & 5 \\ 4 & 1\end{pmatrix},\quad B=\begin{pmatrix}2 & 3 \\ 1 & -2\end{pmatrix}`,
        steps: [
          { text: T('Алдымен әр матрицаны санға көбейтеміз:', 'Сначала умножаем каждую матрицу на число:', 'First multiply each matrix by its number:'), tex: r`2A=\begin{pmatrix}6 & 10 \\ 8 & 2\end{pmatrix},\qquad 5B=\begin{pmatrix}10 & 15 \\ 5 & -10\end{pmatrix}` },
          { text: T('Енді қосамыз:', 'Теперь складываем:', 'Now add:'), tex: r`2A+5B=\begin{pmatrix}6+10 & 10+15 \\ 8+5 & 2+(-10)\end{pmatrix}=\begin{pmatrix}16 & 25 \\ 13 & -8\end{pmatrix}` },
        ],
        answer: X(r`$\begin{pmatrix}16 & 25 \\ 13 & -8\end{pmatrix}$`),
      },
      {
        title: T('3-мысал', 'Пример 3', 'Example 3'),
        task: T('$A$ және $B$ матрицаларының көбейтіндісін табу керек.', 'Найти произведение матриц $A$ и $B$.', 'Find the product of $A$ and $B$.'),
        given: r`A=\begin{pmatrix}2 & -1 & 0 \\ 3 & 4 & -2 \\ -3 & 1 & 5\end{pmatrix},\quad B=\begin{pmatrix}3 & 1 & 2 \\ -2 & 1 & 3 \\ 0 & 2 & -4\end{pmatrix}`,
        steps: [
          {
            text: T('Әр элемент — жол мен бағанның «скаляр көбейтіндісі»:', 'Каждый элемент — «скалярное произведение» строки на столбец:', 'Each entry is the “dot product” of a row and a column:'),
            tex: r`A\cdot B=\begin{pmatrix}2\cdot 3+(-1)(-2)+0\cdot 0 & 2\cdot 1+(-1)\cdot 1+0\cdot 2 & 2\cdot 2+(-1)\cdot 3+0\cdot(-4) \\ 3\cdot 3+4(-2)+(-2)\cdot 0 & 3\cdot 1+4\cdot 1+(-2)\cdot 2 & 3\cdot 2+4\cdot 3+(-2)(-4) \\ -3\cdot 3+1\cdot(-2)+5\cdot 0 & -3\cdot 1+1\cdot 1+5\cdot 2 & -3\cdot 2+1\cdot 3+5\cdot(-4)\end{pmatrix}`,
          },
          { tex: r`A\cdot B=\begin{pmatrix}8 & 1 & 1 \\ 1 & 3 & 26 \\ -11 & 8 & -23\end{pmatrix}` },
        ],
        answer: X(r`$\begin{pmatrix}8 & 1 & 1 \\ 1 & 3 & 26 \\ -11 & 8 & -23\end{pmatrix}$`),
      },
    ],
  },
  selfCheck: [
    {
      q: T('Матрицаға қандай амалдар қолдануға болады?', 'Какие действия можно выполнять над матрицами?', 'Which operations can be performed on matrices?'),
      a: T(
        'Қосу және азайту (өлшемдері бірдей болса), санға көбейту, матрицаны матрицаға көбейту (бірінші матрицаның бағандар саны екіншісінің жолдар санына тең болса), транспонирлеу. Матрицаны матрицаға бөлуге болмайды.',
        'Сложение и вычитание (для матриц одного размера), умножение на число, умножение матриц (если число столбцов первой равно числу строк второй), транспонирование. Делить матрицу на матрицу нельзя.',
        'Addition and subtraction (same size), multiplication by a number, matrix multiplication (columns of the first = rows of the second), transposition. Division by a matrix is not defined.'
      ),
    },
    {
      q: T('Бірлік матрица дегеніміз не?', 'Что такое единичная матрица?', 'What is the identity matrix?'),
      a: T(
        r`Бас диагоналінде 1, қалған орындарында 0 тұрған квадрат матрица $E$. Кез келген $A$ үшін $AE=EA=A$.`,
        r`Квадратная матрица $E$ с единицами на главной диагонали и нулями в остальных местах. Для любой $A$: $AE=EA=A$.`,
        r`The square matrix $E$ with ones on the main diagonal and zeros elsewhere. For any $A$: $AE=EA=A$.`
      ),
    },
    {
      q: T('Диагональ матрица дегеніміз не?', 'Что такое диагональная матрица?', 'What is a diagonal matrix?'),
      a: T(
        'Бас диагональдан тыс барлық элементтері нөлге тең квадрат матрица. Бірлік матрица — диагональ матрицаның дербес жағдайы.',
        'Квадратная матрица, у которой все элементы вне главной диагонали равны нулю. Единичная матрица — частный случай диагональной.',
        'A square matrix whose entries off the main diagonal are zero. The identity matrix is a special diagonal matrix.'
      ),
    },
    {
      q: T('Матрицаларды қосудың және көбейтудің қасиеттері қандай?', 'Каковы свойства сложения и умножения матриц?', 'What are the properties of matrix addition and multiplication?'),
      a: T(
        r`Қосу: $A+B=B+A$, $(A+B)+C=A+(B+C)$. Көбейту: $(AB)C=A(BC)$, $(A+B)C=AC+BC$, бірақ жалпы жағдайда $AB\ne BA$.`,
        r`Сложение: $A+B=B+A$, $(A+B)+C=A+(B+C)$. Умножение: $(AB)C=A(BC)$, $(A+B)C=AC+BC$, но в общем случае $AB\ne BA$.`,
        r`Addition: $A+B=B+A$, $(A+B)+C=A+(B+C)$. Multiplication: $(AB)C=A(BC)$, $(A+B)C=AC+BC$, but in general $AB\ne BA$.`
      ),
    },
  ],
  test: [
    {
      q: T(r`$A$ өлшемі $2\times 3$, $B$ өлшемі $3\times 4$. $A\cdot B$ өлшемі қандай?`, r`Размер $A$ — $2\times 3$, размер $B$ — $3\times 4$. Каков размер $A\cdot B$?`, r`$A$ is $2\times 3$ and $B$ is $3\times 4$. What is the size of $A\cdot B$?`),
      options: [X(r`$2\times 4$`), X(r`$3\times 3$`), X(r`$4\times 2$`), T('Көбейтуге болмайды', 'Перемножить нельзя', 'Not defined')],
      correct: 0,
      explain: T('Жолдар саны $A$-дан, бағандар саны $B$-дан алынады: $2\\times 4$.', 'Число строк берётся у $A$, число столбцов — у $B$: $2\\times 4$.', 'Rows come from $A$, columns from $B$: $2\\times 4$.'),
    },
    {
      q: T(r`$A$ өлшемі $2\times 3$, $B$ өлшемі $2\times 3$. Қай амал анықталған?`, r`$A$ и $B$ имеют размер $2\times 3$. Какое действие определено?`, r`$A$ and $B$ are both $2\times 3$. Which operation is defined?`),
      options: [X(r`$A+B$`), X(r`$A\cdot B$`), X(r`$B\cdot A$`), T('Ешқайсысы', 'Никакое', 'None')],
      correct: 0,
      explain: T('Қосу үшін өлшемдер бірдей болуы жеткілікті; көбейту үшін $3\\ne 2$.', 'Для сложения достаточно одинакового размера; для умножения $3\\ne 2$.', 'Addition needs equal sizes; multiplication fails since $3\\ne 2$.'),
    },
    {
      q: T(r`$3\cdot\begin{pmatrix}1 & -2 \\ 0 & 4\end{pmatrix}$ неге тең?`, r`Чему равно $3\cdot\begin{pmatrix}1 & -2 \\ 0 & 4\end{pmatrix}$?`, r`What is $3\cdot\begin{pmatrix}1 & -2 \\ 0 & 4\end{pmatrix}$?`),
      options: [X(r`$\begin{pmatrix}3 & -6 \\ 0 & 12\end{pmatrix}$`), X(r`$\begin{pmatrix}3 & -2 \\ 0 & 4\end{pmatrix}$`), X(r`$\begin{pmatrix}4 & 1 \\ 3 & 7\end{pmatrix}$`), X(r`$\begin{pmatrix}3 & -6 \\ 0 & 4\end{pmatrix}$`)],
      correct: 0,
      explain: T('Барлық элементтер 3-ке көбейтіледі.', 'Все элементы умножаются на 3.', 'Every entry is multiplied by 3.'),
    },
    {
      q: T(r`$\begin{pmatrix}1 & 2\end{pmatrix}\cdot\begin{pmatrix}3 \\ 4\end{pmatrix}$ неге тең?`, r`Чему равно $\begin{pmatrix}1 & 2\end{pmatrix}\cdot\begin{pmatrix}3 \\ 4\end{pmatrix}$?`, r`What is $\begin{pmatrix}1 & 2\end{pmatrix}\cdot\begin{pmatrix}3 \\ 4\end{pmatrix}$?`),
      options: [X('$(11)$'), X(r`$\begin{pmatrix}3 & 8\end{pmatrix}$`), X(r`$\begin{pmatrix}3 & 6 \\ 4 & 8\end{pmatrix}$`), X('$(10)$')],
      correct: 0,
      explain: X(r`$1\cdot 3+2\cdot 4=11$`),
    },
    {
      q: T('Қай тұжырым әрқашан дұрыс?', 'Какое утверждение верно всегда?', 'Which statement is always true?'),
      options: [X(r`$A+B=B+A$`), X(r`$AB=BA$`), X(r`$A\cdot A=A$`), X(r`$AB=0 \Rightarrow A=0$`)],
      correct: 0,
      explain: T('Қосу коммутативті, ал көбейту — жоқ.', 'Сложение коммутативно, а умножение — нет.', 'Addition is commutative, multiplication is not.'),
    },
    {
      q: T('Бірлік матрица $E$-нің бас диагоналінде қандай сандар тұрады?', 'Какие числа стоят на главной диагонали единичной матрицы $E$?', 'Which numbers are on the main diagonal of the identity matrix $E$?'),
      options: [T('Тек 1', 'Только 1', 'Only 1'), T('Тек 0', 'Только 0', 'Only 0'), T('Кез келген', 'Любые', 'Any'), X('1, 2, 3, …')],
      correct: 0,
      explain: T('Бас диагональда 1, қалған жерде 0.', 'На главной диагонали 1, в остальных местах 0.', 'Ones on the main diagonal, zeros elsewhere.'),
    },
  ],
  trainers: ['mat-add', 'mat-scalar', 'mat-mul'],
  related: [{ courseId: 'linal', lessonId: 'matrices' }],
  editorNotes: [
    'Дәріс 1: қосалқы диагональ элементтері a₁ₙ, a₂,ₙ₋₁, …, aₙ₁ деп түзетілді (түпнұсқада aₙ₁ екі рет жазылған).',
    'Дәріс 1: диагональ матрица анықтамасы және cᵢⱼ көбейту формуласы қосылды (өзін-өзі тексеру сұрағы бар, бірақ мәтінде анықтамасы жоқ).',
  ],
};
