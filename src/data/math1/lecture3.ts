import { Lecture, T, X } from './types';

const r = String.raw;

const SYS_GENERAL = r`\begin{cases}a_{11}x_{1}+a_{12}x_{2}+\ldots+a_{1n}x_{n}=b_{1} \\ a_{21}x_{1}+a_{22}x_{2}+\ldots+a_{2n}x_{n}=b_{2} \\ \quad\ldots\ldots\ldots\ldots\ldots\ldots\ldots\ldots \\ a_{m1}x_{1}+a_{m2}x_{2}+\ldots+a_{mn}x_{n}=b_{m}\end{cases}`;

export const LECTURE_3: Lecture = {
  id: 'm1-l3',
  number: 3,
  title: T(
    'Матрица рангі. Сызықтық теңдеулер жүйелері: Крамер, матрицалық және Гаусс әдістері',
    'Ранг матрицы. Системы линейных уравнений: методы Крамера, матричный и Гаусса',
    'Matrix rank. Systems of linear equations: Cramer’s, matrix and Gaussian methods'
  ),
  summary: T(
    'Сызықтық теңдеулер жүйесін шешудің үш негізгі әдісі: Крамер формулалары, кері матрица және Гаусс әдісі. Жүйенің шешімі бар-жоғын матрица рангі арқылы анықтаймыз.',
    'Три основных метода решения систем линейных уравнений: формулы Крамера, обратная матрица и метод Гаусса. Есть ли у системы решение, определяют по рангу матрицы.',
    'Three main methods for systems of linear equations: Cramer’s formulas, the inverse matrix and Gaussian elimination. Whether a solution exists is decided by matrix rank.'
  ),
  topics: [
    T('матрица рангі', 'ранг матрицы', 'rank'),
    T('Крамер ережесі', 'правило Крамера', 'Cramer’s rule'),
    T('матрицалық әдіс', 'матричный метод', 'matrix method'),
    T('Гаусс әдісі', 'метод Гаусса', 'Gaussian elimination'),
    T('Кронекер–Капелли теоремасы', 'теорема Кронекера–Капелли', 'Kronecker–Capelli theorem'),
  ],
  blocks: [
    { kind: 'h', text: T('Матрицаның рангі', 'Ранг матрицы', 'Rank of a matrix') },
    {
      kind: 'def',
      term: T('Ранг', 'Ранг', 'Rank'),
      text: T(
        r`Матрицаның рангі деп оның 0-ден өзгеше минорларының ең үлкен ретін айтады. Белгіленуі: $\operatorname{rang}A=r(A)$.`,
        r`Рангом матрицы называется наибольший порядок её миноров, отличных от нуля. Обозначение: $\operatorname{rang}A=r(A)$.`,
        r`The rank of a matrix is the largest order of its non-zero minors. Notation: $\operatorname{rang}A=r(A)$.`
      ),
    },
    {
      kind: 'example',
      example: {
        title: T('Мысал', 'Пример', 'Example'),
        task: T('Матрицаның рангін табыңыз.', 'Найдите ранг матрицы.', 'Find the rank of the matrix.'),
        given: r`A=\begin{pmatrix}2 & 3 & 1 & 2 \\ 0 & 2 & -1 & 1 \\ 4 & 0 & 5 & 1\end{pmatrix}`,
        steps: [
          {
            text: T('Үшінші ретті минорлардың барлығы нөлге тең:', 'Все миноры третьего порядка равны нулю:', 'All third-order minors are zero:'),
            tex: r`\begin{vmatrix}2 & 3 & 1 \\ 0 & 2 & -1 \\ 4 & 0 & 5\end{vmatrix}=\begin{vmatrix}2 & 3 & 1 \\ 0 & 2 & -1 \\ 0 & -6 & 3\end{vmatrix}=\begin{vmatrix}2 & 3 & 1 \\ 0 & 2 & -1 \\ 0 & 0 & 0\end{vmatrix}=0,\quad \begin{vmatrix}2 & 3 & 2 \\ 0 & 2 & 1 \\ 4 & 0 & 1\end{vmatrix}=\ldots=0`,
          },
          {
            text: T('Ал нөлден өзгеше екінші ретті минор бар:', 'А ненулевой минор второго порядка есть:', 'But there is a non-zero second-order minor:'),
            tex: r`\begin{vmatrix}2 & 3 \\ 0 & 2\end{vmatrix}=4\ne 0 \quad\Rightarrow\quad \operatorname{rang}A=2`,
          },
        ],
        answer: X(r`$\operatorname{rang}A=2$`),
      },
    },
    {
      kind: 'p',
      text: T(
        'Нөлдік матрицаның рангі 0-ге тең. Егер матрицаның барлық екінші ретті минорлары 0-ге тең болып, кемінде бір элементі нөлден өзгеше болса, оның рангі 1-ге тең. Рангтері тең $A$ және $B$ матрицалары эквивалентті деп аталады: $A\\sim B$.',
        'Ранг нулевой матрицы равен 0. Если все миноры второго порядка равны 0, а хотя бы один элемент не равен нулю, ранг равен 1. Матрицы $A$ и $B$ одинакового ранга называются эквивалентными: $A\\sim B$.',
        'The zero matrix has rank 0. If all second-order minors are zero but some entry is not, the rank is 1. Matrices $A$ and $B$ of equal rank are called equivalent: $A\\sim B$.'
      ),
    },
    {
      kind: 'p',
      text: T(
        'Рангті табу үшін Гаусс әдісін қолданамыз. Ол келесі элементар түрлендірулерде ранг өзгермейтініне негізделген:',
        'Для нахождения ранга применяют метод Гаусса. Он основан на том, что при следующих элементарных преобразованиях ранг не меняется:',
        'The rank is found by Gaussian elimination, based on the fact that these elementary operations do not change the rank:'
      ),
    },
    {
      kind: 'list',
      items: [
        T('матрицаны транспонирлеу;', 'транспонирование матрицы;', 'transposing the matrix;'),
        T('екі жолды (бағанды) ауыстыру;', 'перестановка двух строк (столбцов);', 'swapping two rows (columns);'),
        T('жолдың (бағанның) барлық элементтерін нөлден өзгеше бірдей санға көбейту;', 'умножение всех элементов строки (столбца) на одно и то же ненулевое число;', 'multiplying a row (column) by a non-zero number;'),
        T('бір жолға басқа жолдың бірдей санға көбейтілген элементтерін қосу;', 'прибавление к строке другой строки, умноженной на число;', 'adding a multiple of one row to another;'),
        T('барлық элементтері нөлге тең жолды (бағанды) алып тастау.', 'вычёркивание строки (столбца), состоящей из нулей.', 'deleting a zero row (column).'),
      ],
    },

    { kind: 'h', text: T('Сызықтық теңдеулер жүйелері', 'Системы линейных уравнений', 'Systems of linear equations') },
    {
      kind: 'p',
      text: T(
        r`$n$ белгісізді $m$ теңдеуден тұратын сызықтық алгебралық теңдеулер жүйесі деп келесі жүйені айтады:`,
        r`Системой $m$ линейных алгебраических уравнений с $n$ неизвестными называется система`,
        r`A system of $m$ linear algebraic equations in $n$ unknowns is`
      ),
    },
    { kind: 'formula', tex: SYS_GENERAL, tag: '2' },
    {
      kind: 'p',
      text: T(
        r`мұндағы $a_{ij}$ — жүйе коэффициенттері, $b_{i}$ — бос мүшелер.`,
        r`где $a_{ij}$ — коэффициенты системы, $b_{i}$ — свободные члены.`,
        r`where $a_{ij}$ are the coefficients and $b_{i}$ the constant terms.`
      ),
    },
    {
      kind: 'def',
      term: T('Үйлесімді және үйлесімсіз жүйе', 'Совместная и несовместная система', 'Consistent and inconsistent system'),
      text: T(
        'Теңдеулер жүйесінің кемінде бір шешімі болса, ол үйлесімді, ал бірде-бір шешімі болмаса, үйлесімсіз деп аталады.',
        'Система, имеющая хотя бы одно решение, называется совместной, а не имеющая решений — несовместной.',
        'A system with at least one solution is consistent; a system without solutions is inconsistent.'
      ),
    },

    { kind: 'h', text: T('Крамер әдісі', 'Метод Крамера', 'Cramer’s rule') },
    {
      kind: 'p',
      text: T('Екі белгісізді екі сызықтық теңдеу жүйесін қарастырамыз:', 'Рассмотрим систему двух линейных уравнений с двумя неизвестными:', 'Consider a system of two linear equations in two unknowns:'),
    },
    { kind: 'formula', tex: r`\begin{cases}a_{11}x_{1}+a_{12}x_{2}=b_{1} \\ a_{21}x_{1}+a_{22}x_{2}=b_{2}\end{cases}`, tag: '3' },
    {
      kind: 'p',
      text: T(
        r`Оның бас анықтауышы $\Delta_{A}=\begin{vmatrix}a_{11} & a_{12} \\ a_{21} & a_{22}\end{vmatrix}=a_{11}a_{22}-a_{12}a_{21}$. Егер $\Delta_{A}\ne 0$ болса, белгісіздер Крамер формулаларымен табылады:`,
        r`Её главный определитель $\Delta_{A}=\begin{vmatrix}a_{11} & a_{12} \\ a_{21} & a_{22}\end{vmatrix}=a_{11}a_{22}-a_{12}a_{21}$. Если $\Delta_{A}\ne 0$, неизвестные находятся по формулам Крамера:`,
        r`Its main determinant is $\Delta_{A}=\begin{vmatrix}a_{11} & a_{12} \\ a_{21} & a_{22}\end{vmatrix}=a_{11}a_{22}-a_{12}a_{21}$. If $\Delta_{A}\ne 0$, the unknowns are given by Cramer’s formulas:`
      ),
    },
    {
      kind: 'formula',
      tex: r`x_{1}=\frac{\Delta_{x_1}}{\Delta_{A}}=\frac{\begin{vmatrix}b_{1} & a_{12} \\ b_{2} & a_{22}\end{vmatrix}}{\begin{vmatrix}a_{11} & a_{12} \\ a_{21} & a_{22}\end{vmatrix}},\qquad x_{2}=\frac{\Delta_{x_2}}{\Delta_{A}}=\frac{\begin{vmatrix}a_{11} & b_{1} \\ a_{21} & b_{2}\end{vmatrix}}{\begin{vmatrix}a_{11} & a_{12} \\ a_{21} & a_{22}\end{vmatrix}}`,
      tag: '4',
    },
    {
      kind: 'p',
      text: T(
        r`$\Delta_{A}$ — жүйенің бас анықтауышы, ал бас анықтауыштың бірінші немесе екінші бағанын бос мүшелермен алмастырғаннан шыққан $\Delta_{x_1}$, $\Delta_{x_2}$ — қосымша анықтауыштар. Үш белгісізді үш теңдеу жүйесі де дәл осылай шешіледі.`,
        r`$\Delta_{A}$ — главный определитель системы, а $\Delta_{x_1}$, $\Delta_{x_2}$, полученные заменой первого или второго столбца столбцом свободных членов, — вспомогательные определители. Система трёх уравнений с тремя неизвестными решается так же.`,
        r`$\Delta_{A}$ is the main determinant; $\Delta_{x_1}$, $\Delta_{x_2}$, obtained by replacing the first or second column with the constant terms, are the auxiliary determinants. Three equations in three unknowns are solved the same way.`
      ),
    },
    {
      kind: 'example',
      example: {
        title: T('Мысал', 'Пример', 'Example'),
        task: T('Жүйені Крамер ережесімен шешіңіз.', 'Решите систему по правилу Крамера.', 'Solve the system by Cramer’s rule.'),
        given: r`\begin{cases}2x_{1}-3x_{2}=-4 \\ x_{1}+4x_{2}=9\end{cases}`,
        steps: [
          { tex: r`\Delta_{A}=\begin{vmatrix}2 & -3 \\ 1 & 4\end{vmatrix}=2\cdot 4-(-3)\cdot 1=11` },
          { tex: r`\Delta_{x_1}=\begin{vmatrix}-4 & -3 \\ 9 & 4\end{vmatrix}=-16+27=11,\qquad x_{1}=\frac{11}{11}=1` },
          { tex: r`\Delta_{x_2}=\begin{vmatrix}2 & -4 \\ 1 & 9\end{vmatrix}=18+4=22,\qquad x_{2}=\frac{22}{11}=2` },
        ],
        answer: X('$(1;\\,2)$'),
      },
    },

    { kind: 'h', text: T('Матрицалық әдіс', 'Матричный метод', 'Matrix method') },
    {
      kind: 'p',
      text: T(
        r`Матрицалық әдіс белгісіздер саны теңдеулер санына тең болғанда ($m=n$) қолданылады. Негізгі матрицаны $A$, белгісіздер бағанын $X$, бос мүшелер бағанын $B$ деп белгілейміз:`,
        r`Матричный метод применяется, когда число неизвестных равно числу уравнений ($m=n$). Обозначим основную матрицу $A$, столбец неизвестных $X$ и столбец свободных членов $B$:`,
        r`The matrix method works when the number of unknowns equals the number of equations ($m=n$). Denote the main matrix $A$, the column of unknowns $X$ and the column of constants $B$:`
      ),
    },
    {
      kind: 'formula',
      tex: r`A=\begin{pmatrix}a_{11} & \ldots & a_{1n} \\ \vdots & \ddots & \vdots \\ a_{n1} & \ldots & a_{nn}\end{pmatrix},\quad X=\begin{pmatrix}x_{1} \\ \vdots \\ x_{n}\end{pmatrix},\quad B=\begin{pmatrix}b_{1} \\ \vdots \\ b_{n}\end{pmatrix}\qquad\Rightarrow\qquad A\cdot X=B`,
    },
    {
      kind: 'p',
      text: T(
        r`Теңдіктің екі жағын да сол жағынан $A^{-1}$-ге көбейтеміз. $A^{-1}\cdot A=E$ болғандықтан:`,
        r`Умножим обе части слева на $A^{-1}$. Так как $A^{-1}\cdot A=E$:`,
        r`Multiply both sides on the left by $A^{-1}$. Since $A^{-1}\cdot A=E$:`
      ),
    },
    { kind: 'formula', tex: r`X=A^{-1}\cdot B`, tag: '6' },
    {
      kind: 'list',
      ordered: true,
      items: [
        T(r`$\Delta_{A}=\det A\ne 0$ екенін тексереміз;`, r`проверяем, что $\Delta_{A}=\det A\ne 0$;`, r`check that $\Delta_{A}=\det A\ne 0$;`),
        T(r`кері матрица $A^{-1}$-ді табамыз;`, r`находим обратную матрицу $A^{-1}$;`, r`find the inverse matrix $A^{-1}$;`),
        T(r`$X=A^{-1}B$ формуласы бойынша белгісіздерді табамыз.`, r`находим неизвестные по формуле $X=A^{-1}B$.`, r`compute the unknowns as $X=A^{-1}B$.`),
      ],
    },
    {
      kind: 'example',
      example: {
        title: T('Мысал', 'Пример', 'Example'),
        task: T('Жүйені матрицалық әдіспен шешіңіз.', 'Решите систему матричным методом.', 'Solve the system by the matrix method.'),
        given: r`\begin{cases}x_{1}+x_{2}+2x_{3}=-1 \\ 2x_{1}-x_{2}+2x_{3}=-4 \\ 4x_{1}+x_{2}+4x_{3}=-2\end{cases}`,
        steps: [
          {
            text: T('Анықтауыш (1-баған бойынша жіктеу):', 'Определитель (разложение по 1-му столбцу):', 'Determinant (expansion along column 1):'),
            tex: r`\Delta_{A}=\begin{vmatrix}1 & 1 & 2 \\ 2 & -1 & 2 \\ 4 & 1 & 4\end{vmatrix}=1\begin{vmatrix}-1 & 2 \\ 1 & 4\end{vmatrix}-2\begin{vmatrix}1 & 2 \\ 1 & 4\end{vmatrix}+4\begin{vmatrix}1 & 2 \\ -1 & 2\end{vmatrix}=-6-4+16=6\ne 0`,
          },
          {
            text: T('Алгебралық толықтауыштар:', 'Алгебраические дополнения:', 'Cofactors:'),
            tex: r`\begin{aligned}A_{11}&=-6, & A_{21}&=-2, & A_{31}&=4,\\ A_{12}&=0, & A_{22}&=-4, & A_{32}&=2,\\ A_{13}&=6, & A_{23}&=3, & A_{33}&=-3\end{aligned}\quad\Rightarrow\quad A^{-1}=\frac{1}{6}\begin{pmatrix}-6 & -2 & 4 \\ 0 & -4 & 2 \\ 6 & 3 & -3\end{pmatrix}`,
          },
          {
            text: T('Белгісіздер:', 'Неизвестные:', 'Unknowns:'),
            tex: r`X=\frac{1}{6}\begin{pmatrix}-6 & -2 & 4 \\ 0 & -4 & 2 \\ 6 & 3 & -3\end{pmatrix}\begin{pmatrix}-1 \\ -4 \\ -2\end{pmatrix}=\frac{1}{6}\begin{pmatrix}6+8-8 \\ 0+16-4 \\ -6-12+6\end{pmatrix}=\frac{1}{6}\begin{pmatrix}6 \\ 12 \\ -12\end{pmatrix}=\begin{pmatrix}1 \\ 2 \\ -2\end{pmatrix}`,
          },
        ],
        answer: X('$x_1=1,\\; x_2=2,\\; x_3=-2$'),
      },
    },

    { kind: 'h', text: T('Гаусс әдісі', 'Метод Гаусса', 'Gaussian elimination') },
    {
      kind: 'p',
      text: T(
        'Гаусс әдісі 2 кезеңнен тұрады. 1-кезеңде кеңейтілген матрица (коэффициенттер мен бос мүшелер) элементар түрлендірулер арқылы баспалдақты үшбұрышты түрге келтіріледі. 2-кезеңде баспалдақты жүйеден белгісіздер біртіндеп анықталады. Әдіс кез келген жүйеге — квадрат емес және анықтауышы нөлге тең жүйелерге де қолданылады.',
        'Метод Гаусса состоит из 2 этапов. На 1-м этапе расширенная матрица (коэффициенты и свободные члены) элементарными преобразованиями приводится к ступенчатому треугольному виду. На 2-м этапе неизвестные последовательно находятся из ступенчатой системы. Метод применим к любой системе — даже неквадратной или с нулевым определителем.',
        'Gaussian elimination has 2 stages. Stage 1 brings the augmented matrix (coefficients and constants) to a triangular row-echelon form using elementary row operations. Stage 2 finds the unknowns one by one from the echelon system. The method works for any system, even non-square or with zero determinant.'
      ),
    },
    {
      kind: 'example',
      example: {
        title: T('Мысал', 'Пример', 'Example'),
        task: T('Жүйені Гаусс әдісімен шешіңіз.', 'Решите систему методом Гаусса.', 'Solve the system by Gaussian elimination.'),
        given: r`\begin{cases}x_{1}+x_{2}+x_{3}=3 \\ 2x_{1}+3x_{2}+2x_{3}=7 \\ 3x_{1}+x_{2}+x_{3}=5 \\ 5x_{1}-x_{2}-x_{3}=3\end{cases}`,
        steps: [
          {
            text: T('1-кезең: кеңейтілген матрицаны баспалдақты түрге келтіреміз.', '1-й этап: приводим расширенную матрицу к ступенчатому виду.', 'Stage 1: bring the augmented matrix to echelon form.'),
            tex: r`\left(\begin{array}{rrr|r}1 & 1 & 1 & 3 \\ 2 & 3 & 2 & 7 \\ 3 & 1 & 1 & 5 \\ 5 & -1 & -1 & 3\end{array}\right)\sim\left(\begin{array}{rrr|r}1 & 1 & 1 & 3 \\ 0 & 1 & 0 & 1 \\ 0 & -2 & -2 & -4 \\ 0 & -6 & -6 & -12\end{array}\right)\sim\left(\begin{array}{rrr|r}1 & 1 & 1 & 3 \\ 0 & 1 & 0 & 1 \\ 0 & 1 & 1 & 2 \\ 0 & 1 & 1 & 2\end{array}\right)\sim\left(\begin{array}{rrr|r}1 & 1 & 1 & 3 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1\end{array}\right)`,
          },
          {
            text: T('2-кезең: төменнен жоғары қарай белгісіздерді анықтаймыз.', '2-й этап: находим неизвестные снизу вверх.', 'Stage 2: find the unknowns from the bottom up.'),
            tex: r`\left(\begin{array}{rrr|r}1 & 1 & 1 & 3 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1\end{array}\right)\sim\left(\begin{array}{rrr|r}1 & 0 & 1 & 2 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1\end{array}\right)\sim\left(\begin{array}{rrr|r}1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1\end{array}\right)\;\Rightarrow\;\begin{cases}x_{1}=1 \\ x_{2}=1 \\ x_{3}=1\end{cases}`,
          },
        ],
        answer: X('$(1;\\,1;\\,1)$'),
      },
    },
    { kind: 'visual', id: 'gauss' },

    { kind: 'h', text: T('Кронекер–Капелли теоремасы. Біртекті жүйелер', 'Теорема Кронекера–Капелли. Однородные системы', 'Kronecker–Capelli theorem. Homogeneous systems') },
    {
      kind: 'thm',
      title: T('Кронекер–Капелли теоремасы', 'Теорема Кронекера–Капелли', 'Kronecker–Capelli theorem'),
      text: T(
        r`Сызықтық теңдеулер жүйесі үйлесімді болуы үшін негізгі матрицаның рангі кеңейтілген матрицаның рангіне тең болуы қажетті және жеткілікті: $\operatorname{rang}A=\operatorname{rang}(A|B)$. Егер бұл ранг белгісіздер санына тең болса ($r=n$), жүйенің жалғыз шешімі бар, ал $r<n$ болса — шексіз көп шешімі бар.`,
        r`Система линейных уравнений совместна тогда и только тогда, когда ранг основной матрицы равен рангу расширенной: $\operatorname{rang}A=\operatorname{rang}(A|B)$. Если этот ранг равен числу неизвестных ($r=n$), решение единственно, а при $r<n$ решений бесконечно много.`,
        r`A linear system is consistent if and only if the rank of the main matrix equals the rank of the augmented matrix: $\operatorname{rang}A=\operatorname{rang}(A|B)$. If this rank equals the number of unknowns ($r=n$) the solution is unique; if $r<n$ there are infinitely many.`
      ),
    },
    {
      kind: 'def',
      term: T('Біртекті жүйе', 'Однородная система', 'Homogeneous system'),
      text: T(
        r`Барлық бос мүшелері нөлге тең ($b_1=b_2=\ldots=b_m=0$) жүйе біртекті деп аталады. Біртекті жүйе әрқашан үйлесімді: оның нөлдік шешімі бар. Квадрат біртекті жүйенің нөлдік емес шешімі болуы үшін $\det A=0$ болуы қажетті және жеткілікті.`,
        r`Система, все свободные члены которой равны нулю ($b_1=b_2=\ldots=b_m=0$), называется однородной. Однородная система всегда совместна: у неё есть нулевое решение. Квадратная однородная система имеет ненулевые решения тогда и только тогда, когда $\det A=0$.`,
        r`A system whose constant terms are all zero ($b_1=b_2=\ldots=b_m=0$) is homogeneous. It is always consistent: the zero solution works. A square homogeneous system has non-zero solutions if and only if $\det A=0$.`
      ),
    },
  ],
  practice: {
    sessions: '5–7',
    goal: T(
      'Екі және үш айнымалысы бар сызықтық теңдеулер жүйелерін Крамер ережесімен, матрицалық әдіспен және Гаусс әдісімен шешуге үйрету.',
      'Научить решать системы линейных уравнений с двумя и тремя переменными по правилу Крамера, матричным методом и методом Гаусса.',
      'Learn to solve linear systems in two and three variables by Cramer’s rule, the matrix method and Gaussian elimination.'
    ),
    questions: [
      T('Теңдеулер жүйесін Крамер ережесімен шешу формуласы.', 'Формулы решения системы по правилу Крамера.', 'Cramer’s formulas for a system.'),
      T('Кері матрица қалай табылады?', 'Как находится обратная матрица?', 'How is the inverse matrix found?'),
      T('Матрицалық әдіспен қалай шешіледі?', 'Как решать систему матричным методом?', 'How is a system solved by the matrix method?'),
      T('Гаусс әдісінің мақсаты қандай?', 'В чём идея метода Гаусса?', 'What is the idea of Gaussian elimination?'),
      T('Кеңейтілген матрица дегеніміз не?', 'Что такое расширенная матрица?', 'What is the augmented matrix?'),
      T('Матрицаның рангі.', 'Ранг матрицы.', 'Rank of a matrix.'),
    ],
    examples: [
      {
        title: T('1-мысал', 'Пример 1', 'Example 1'),
        task: T('Теңдеулер жүйесін Крамер ережесімен шешу керек.', 'Решить систему по правилу Крамера.', 'Solve the system by Cramer’s rule.'),
        given: r`\begin{cases}x+2y+z=8 \\ 3x+2y+z=10 \\ 4x+3y-2z=4\end{cases}`,
        steps: [
          { tex: r`\Delta=\begin{vmatrix}1 & 2 & 1 \\ 3 & 2 & 1 \\ 4 & 3 & -2\end{vmatrix}=1\cdot(-7)-2\cdot(-10)+1\cdot 1=14` },
          { tex: r`\Delta_{x}=\begin{vmatrix}8 & 2 & 1 \\ 10 & 2 & 1 \\ 4 & 3 & -2\end{vmatrix}=8(-4-3)-2(-20-4)+1(30-8)=-56+48+22=14` },
          { tex: r`\Delta_{y}=\begin{vmatrix}1 & 8 & 1 \\ 3 & 10 & 1 \\ 4 & 4 & -2\end{vmatrix}=1(-20-4)-8(-6-4)+1(12-40)=-24+80-28=28` },
          { tex: r`\Delta_{z}=\begin{vmatrix}1 & 2 & 8 \\ 3 & 2 & 10 \\ 4 & 3 & 4\end{vmatrix}=1(8-30)-2(12-40)+8(9-8)=-22+56+8=42` },
          { tex: r`x=\frac{14}{14}=1,\qquad y=\frac{28}{14}=2,\qquad z=\frac{42}{14}=3` },
        ],
        answer: X('$x=1,\\; y=2,\\; z=3$'),
      },
      {
        title: T('2-мысал', 'Пример 2', 'Example 2'),
        task: T('Теңдеулер жүйесін Гаусс әдісімен шешу керек.', 'Решить систему методом Гаусса.', 'Solve the system by Gaussian elimination.'),
        given: r`\begin{cases}3x+2y+z=5 \\ x+y-z=0 \\ 4x-y+5z=3\end{cases}`,
        steps: [
          {
            text: T('1 және 2-жолдардың орнын ауыстырып, бірінші бағанда нөлдер жасаймыз:', 'Меняем местами 1-ю и 2-ю строки и получаем нули в первом столбце:', 'Swap rows 1 and 2 and create zeros in the first column:'),
            tex: r`\left(\begin{array}{rrr|r}3 & 2 & 1 & 5 \\ 1 & 1 & -1 & 0 \\ 4 & -1 & 5 & 3\end{array}\right)\sim\left(\begin{array}{rrr|r}1 & 1 & -1 & 0 \\ 3 & 2 & 1 & 5 \\ 4 & -1 & 5 & 3\end{array}\right)\sim\left(\begin{array}{rrr|r}1 & 1 & -1 & 0 \\ 0 & -1 & 4 & 5 \\ 0 & -5 & 9 & 3\end{array}\right)`,
          },
          {
            text: T('Екінші бағанда нөл жасаймыз:', 'Получаем ноль во втором столбце:', 'Create a zero in the second column:'),
            tex: r`\sim\left(\begin{array}{rrr|r}1 & 1 & -1 & 0 \\ 0 & -1 & 4 & 5 \\ 0 & 0 & -11 & -22\end{array}\right)\;\Rightarrow\;\begin{cases}x+y-z=0 \\ -y+4z=5 \\ z=2\end{cases}`,
          },
          { text: T('Төменнен жоғары:', 'Снизу вверх:', 'Bottom-up:'), tex: r`z=2,\quad -y+8=5\Rightarrow y=3,\quad x+3-2=0\Rightarrow x=-1` },
        ],
        answer: X('$x=-1,\\; y=3,\\; z=2$'),
      },
      {
        title: T('3-мысал', 'Пример 3', 'Example 3'),
        task: T('Матрицаның рангін Гаусс әдісімен табыңыз.', 'Найдите ранг матрицы методом Гаусса.', 'Find the rank by Gaussian elimination.'),
        given: r`A=\begin{pmatrix}1 & 2 & 3 \\ 2 & 4 & 6 \\ 1 & 0 & 1\end{pmatrix}`,
        steps: [
          { tex: r`\begin{pmatrix}1 & 2 & 3 \\ 2 & 4 & 6 \\ 1 & 0 & 1\end{pmatrix}\sim\begin{pmatrix}1 & 2 & 3 \\ 0 & 0 & 0 \\ 0 & -2 & -2\end{pmatrix}\sim\begin{pmatrix}1 & 2 & 3 \\ 0 & -2 & -2\end{pmatrix}` },
          { text: T('Нөлдік емес екі жол қалды:', 'Осталось две ненулевые строки:', 'Two non-zero rows remain:'), tex: r`\operatorname{rang}A=2` },
        ],
        answer: X(r`$\operatorname{rang}A=2$`),
        added: true,
      },
    ],
  },
  selfCheck: [
    {
      q: T('Сызықтық теңдеулер жүйесін шешудің Крамер ережесі қандай?', 'В чём состоит правило Крамера?', 'What is Cramer’s rule?'),
      a: T(
        r`Егер $\Delta\ne 0$ болса, $x_k=\Delta_{x_k}/\Delta$, мұндағы $\Delta_{x_k}$ — $k$-бағанды бос мүшелер бағанымен алмастырғаннан шыққан анықтауыш.`,
        r`Если $\Delta\ne 0$, то $x_k=\Delta_{x_k}/\Delta$, где $\Delta_{x_k}$ — определитель, в котором $k$-й столбец заменён столбцом свободных членов.`,
        r`If $\Delta\ne 0$, then $x_k=\Delta_{x_k}/\Delta$, where $\Delta_{x_k}$ is the determinant with column $k$ replaced by the constants.`
      ),
    },
    {
      q: T('Жүйенің матрицалық түрі және оны шешу формуласы қандай?', 'Как записывается система в матричном виде и как её решить?', 'What is the matrix form of a system and how is it solved?'),
      a: T(r`$AX=B$, мұндағы $A$ — коэффициенттер матрицасы. $\det A\ne 0$ болса, $X=A^{-1}B$.`, r`$AX=B$, где $A$ — матрица коэффициентов. При $\det A\ne 0$: $X=A^{-1}B$.`, r`$AX=B$ with $A$ the coefficient matrix. If $\det A\ne 0$: $X=A^{-1}B$.`),
    },
    {
      q: T('Гаусс әдісінің идеясы неде?', 'В чём идея метода Гаусса?', 'What is the idea of Gaussian elimination?'),
      a: T(
        'Элементар түрлендірулер арқылы белгісіздерді біртіндеп жойып, кеңейтілген матрицаны баспалдақты түрге келтіру, содан кейін белгісіздерді төменнен жоғары қарай табу.',
        'Элементарными преобразованиями последовательно исключить неизвестные, привести расширенную матрицу к ступенчатому виду, затем найти неизвестные снизу вверх.',
        'Eliminate unknowns one by one with elementary row operations, reach echelon form, then find the unknowns from the bottom up.'
      ),
    },
    {
      q: T('Жүйенің шешімі бар-жоғын қалай білуге болады?', 'Как узнать, есть ли у системы решение?', 'How do you know whether a system has a solution?'),
      a: T(
        r`Кронекер–Капелли теоремасы бойынша: $\operatorname{rang}A=\operatorname{rang}(A|B)$ болса, жүйе үйлесімді. Гаусс әдісінде $0=b\ne 0$ түріндегі жол шықса, шешім жоқ.`,
        r`По теореме Кронекера–Капелли: система совместна, если $\operatorname{rang}A=\operatorname{rang}(A|B)$. В методе Гаусса строка вида $0=b\ne 0$ означает, что решений нет.`,
        r`By the Kronecker–Capelli theorem: the system is consistent if $\operatorname{rang}A=\operatorname{rang}(A|B)$. In Gaussian elimination a row $0=b\ne 0$ means no solution.`
      ),
    },
  ],
  test: [
    {
      q: T('Крамер ережесін қашан қолдануға болады?', 'Когда применимо правило Крамера?', 'When can Cramer’s rule be used?'),
      options: [T('Жүйе квадрат және $\\Delta\\ne 0$', 'Система квадратная и $\\Delta\\ne 0$', 'The system is square and $\\Delta\\ne 0$'), T('Кез келген жүйеге', 'Для любой системы', 'For any system'), T('Тек $\\Delta=0$ болғанда', 'Только при $\\Delta=0$', 'Only when $\\Delta=0$'), T('Тек біртекті жүйеге', 'Только для однородных', 'Only for homogeneous systems')],
      correct: 0,
      explain: T('Формула $\\Delta$-ға бөлуді қажет етеді.', 'Формулы требуют деления на $\\Delta$.', 'The formulas divide by $\\Delta$.'),
    },
    {
      q: T(r`$\Delta=4$, $\Delta_{x_1}=-8$ болса, $x_1$ неге тең?`, r`Если $\Delta=4$, $\Delta_{x_1}=-8$, чему равно $x_1$?`, r`If $\Delta=4$ and $\Delta_{x_1}=-8$, what is $x_1$?`),
      options: [X('-2'), X('2'), X('-32'), X('-1/2')],
      correct: 0,
      explain: X(r`$x_1=-8/4=-2$`),
    },
    {
      q: T(r`$\begin{pmatrix}1 & 2 \\ 2 & 4\end{pmatrix}$ матрицасының рангі неге тең?`, r`Чему равен ранг матрицы $\begin{pmatrix}1 & 2 \\ 2 & 4\end{pmatrix}$?`, r`What is the rank of $\begin{pmatrix}1 & 2 \\ 2 & 4\end{pmatrix}$?`),
      options: [X('1'), X('2'), X('0'), X('4')],
      correct: 0,
      explain: T('Анықтауыш 0, бірақ нөлдік емес элементтер бар.', 'Определитель равен 0, но есть ненулевые элементы.', 'The determinant is 0 but there are non-zero entries.'),
    },
    {
      q: T('Жүйе үйлесімді болуының шарты (Кронекер–Капелли):', 'Условие совместности системы (Кронекер–Капелли):', 'Consistency condition (Kronecker–Capelli):'),
      options: [X(r`$\operatorname{rang}A=\operatorname{rang}(A|B)$`), X(r`$\det A=0$`), X(r`$\operatorname{rang}A<\operatorname{rang}(A|B)$`), X(r`$m=n$`)],
      correct: 0,
      explain: T('Негізгі және кеңейтілген матрицалардың рангтері тең.', 'Ранги основной и расширенной матриц равны.', 'The ranks of the main and augmented matrices are equal.'),
    },
    {
      q: T('Гаусс әдісінің 1-кезеңінде не істейміз?', 'Что делают на 1-м этапе метода Гаусса?', 'What happens in stage 1 of Gaussian elimination?'),
      options: [T('Матрицаны баспалдақты түрге келтіреміз', 'Приводим матрицу к ступенчатому виду', 'Bring the matrix to echelon form'), T('Кері матрицаны табамыз', 'Находим обратную матрицу', 'Find the inverse matrix'), T('Анықтауыштарды есептейміз', 'Считаем определители', 'Compute determinants'), T('Матрицаны транспонирлейміз', 'Транспонируем матрицу', 'Transpose the matrix')],
      correct: 0,
      explain: T('Баспалдақты (үшбұрышты) түрге келтіру.', 'Приведение к ступенчатому (треугольному) виду.', 'Reduction to echelon (triangular) form.'),
    },
    {
      q: T('Біртекті жүйенің әрқашан қандай шешімі бар?', 'Какое решение всегда есть у однородной системы?', 'Which solution does a homogeneous system always have?'),
      options: [T('Нөлдік шешім', 'Нулевое', 'The zero solution'), T('Шешімі жоқ', 'Решений нет', 'None'), T('Бірлік шешім', 'Единичное', 'All ones'), T('Тек $\\det A=0$ болса', 'Только при $\\det A=0$', 'Only if $\\det A=0$')],
      correct: 0,
      explain: X(r`$x_1=x_2=\ldots=x_n=0$`),
    },
  ],
  trainers: ['rank', 'cramer2', 'system3'],
  related: [{ courseId: 'algebra', lessonId: 'systems' }],
  editorNotes: [
    'Дәріс 3: жалпы жүйе (2) m теңдеу үшін түзетілді (түпнұсқада соңғы жол aₙ₁…bₙ).',
    'Дәріс 3: матрицалық әдісте сілтеме (4′) емес, (6) формуласына түзетілді.',
    'Дәріс 3: тақырыпта аталған Кронекер–Капелли теоремасы мен біртекті жүйелер бөлімі қысқаша қосылды.',
    'Практика 5–7, Гаусс мысалы: жауап x = −1, y = 3, z = 2 (түпнұсқада x = 1 деп қате жазылған).',
  ],
};
