import { T, type L, type TestQuestion } from './types';

export interface LectureVideo {
  id: string;
  seconds: number;
  title: L;
  summary: L;
  test: TestQuestion[];
}

export const MATH1_VIDEOS: Partial<Record<number, LectureVideo[]>> = {
  1: [
    {
      id: "1-01",
      seconds: 211,
      title: T("Матрицаларға кіріспе", "Введение в матрицы", "Introduction to matrices"),
      summary: T("Жол, баған және элемент индекстерін ажыратыңыз. Видеодағы тікбұрышты матрица мен бірлік матрицаның өлшемдерін салыстырыңыз.", "Различите строки, столбцы и индексы элементов. Сравните размеры прямоугольной и единичной матриц из видео.", "Identify rows, columns and entry indices. Compare the sizes of the rectangular and identity matrices in the video."),
      test: [
        {
          q: T("$A=\\begin{pmatrix}1&2&1\\\\3&2&0\\end{pmatrix}$ матрицасының өлшемі қандай?", "Каков размер матрицы $A=\\begin{pmatrix}1&2&1\\\\3&2&0\\end{pmatrix}$?", "What are the dimensions of $A=\\begin{pmatrix}1&2&1\\\\3&2&0\\end{pmatrix}$?"),
          options: [
            T("$2\\times3$", "$2\\times3$", "$2\\times3$"),
            T("$3\\times2$", "$3\\times2$", "$3\\times2$"),
            T("$3\\times3$", "$3\\times3$", "$3\\times3$"),
          ],
          correct: 0,
          explain: T("Екі жол және үш баған бар. Өлшемде алдымен жол саны жазылады.", "Две строки и три столбца. Первым указывают число строк.", "There are two rows and three columns. The row count comes first."),
        },
        {
          q: T("$I_3$ бірлік матрицасында $a_{23}$ нешеге тең?", "Чему равен $a_{23}$ в единичной матрице $I_3$?", "What is $a_{23}$ in the identity matrix $I_3$?"),
          options: [
            T("0", "0", "0"),
            T("1", "1", "1"),
            T("3", "3", "3"),
          ],
          correct: 0,
          explain: T("Екінші жол мен үшінші баған қиылысындағы элемент диагональдан тыс жатыр, сондықтан нөлге тең.", "Элемент второй строки и третьего столбца находится вне главной диагонали, поэтому равен нулю.", "Row two and column three meet off the main diagonal, so the entry is zero."),
        },
      ],
    },
    {
      id: "1-02",
      seconds: 197,
      title: T("Матрицалық амалдар", "Операции с матрицами", "Matrix operations"),
      summary: T("Қосудың өлшем шартын көбейтудің өлшем шартымен салыстырыңыз. Көбейтінді элементі бірінші матрицаның жолы мен екіншісінің бағанынан есептеледі.", "Сравните требования к размерам при сложении и умножении. Элемент произведения получают из строки первой матрицы и столбца второй.", "Compare the dimension rules for addition and multiplication. Each product entry comes from a row of the first matrix and a column of the second."),
      test: [
        {
          q: T("Өлшемдері $2\\times3$ және $3\\times4$ матрицаларының көбейтіндісінің өлшемі қандай?", "Каков размер произведения матриц $2\\times3$ и $3\\times4$?", "What is the size of the product of a $2\\times3$ matrix and a $3\\times4$ matrix?"),
          options: [
            T("$2\\times4$", "$2\\times4$", "$2\\times4$"),
            T("$3\\times3$", "$3\\times3$", "$3\\times3$"),
            T("$4\\times2$", "$4\\times2$", "$4\\times2$"),
          ],
          correct: 0,
          explain: T("Ішкі өлшемдер 3-ке тең. Нәтиженің өлшемі сыртқы 2 және 4 сандарымен анықталады.", "Внутренние размеры равны 3. Размер результата задают внешние 2 и 4.", "The inner dimensions both equal 3. The outer dimensions 2 and 4 give the result size."),
        },
        {
          q: T("Егер жол $(2,-1)$, баған $(3,4)$ болса, көбейтіндідегі сәйкес элемент нешеге тең?", "Строка равна $(2,-1)$, а столбец $(3,4)$. Чему равен соответствующий элемент произведения?", "A row is $(2,-1)$ and a column is $(3,4)$. What is the corresponding product entry?"),
          options: [
            T("2", "2", "2"),
            T("10", "10", "10"),
            T("−2", "−2", "−2"),
          ],
          correct: 0,
          explain: T("$2\\cdot3+(-1)\\cdot4=2$", "$2\\cdot3+(-1)\\cdot4=2$", "$2\\cdot3+(-1)\\cdot4=2$"),
        },
      ],
    },
  ],
  2: [
    {
      id: "1-03",
      seconds: 493,
      title: T("Матрицаның анықтауышы", "Определитель матрицы", "Matrix determinant"),
      summary: T("Екінші және үшінші ретті анықтауыштарды есептеу тәсілдерін қайталаңыз. Жол ауысқанда таңба қалай өзгеретінін тексеріңіз.", "Повторите вычисление определителей второго и третьего порядков. Проследите, как перестановка строк меняет знак.", "Review determinants of order two and three and track the sign change when rows are swapped."),
      test: [
        {
          q: T("$\\det\\begin{pmatrix}3&5\\\\1&3\\end{pmatrix}=?$", "$\\det\\begin{pmatrix}3&5\\\\1&3\\end{pmatrix}=?$", "$\\det\\begin{pmatrix}3&5\\\\1&3\\end{pmatrix}=?$"),
          options: [
            T("4", "4", "4"),
            T("14", "14", "14"),
            T("−4", "−4", "−4"),
          ],
          correct: 0,
          explain: T("$3\\cdot3-5\\cdot1=4$", "$3\\cdot3-5\\cdot1=4$", "$3\\cdot3-5\\cdot1=4$"),
        },
        {
          q: T("Екі жолдың орнын ауыстырғанда анықтауыш 4-тен қандай мәнге өзгереді?", "Определитель равен 4. Каким он станет после перестановки двух строк?", "A determinant equals 4. What is its value after swapping two rows?"),
          options: [
            T("−4", "−4", "−4"),
            T("4", "4", "4"),
            T("0", "0", "0"),
          ],
          correct: 0,
          explain: T("Бір жол ауыстыру анықтауыштың таңбасын өзгертеді.", "Одна перестановка двух строк меняет знак определителя.", "One row swap negates the determinant."),
        },
      ],
    },
    {
      id: "1-05",
      seconds: 127,
      title: T("Кері матрица", "Обратная матрица", "Inverse matrix"),
      summary: T("Квадрат матрица қашан кері матрицаға ие болатынын және нәтижені қалай тексеруге болатынын қайталаңыз.", "Повторите условие существования обратной матрицы и способ проверки умножением.", "Review when a square matrix has an inverse and how to verify it by multiplication."),
      test: [
        {
          q: T("Квадрат матрица үшін $\\det A=-9$. Кері матрица бар ма?", "Для квадратной матрицы $\\det A=-9$. Существует ли обратная?", "A square matrix has $\\det A=-9$. Does its inverse exist?"),
          options: [
            T("Иә", "Да", "Yes"),
            T("Жоқ", "Нет", "No"),
            T("Тек симметриялы болса", "Только если она симметрична", "Only if it is symmetric"),
          ],
          correct: 0,
          explain: T("Анықтауыш нөлден өзгеше. Теріс таңба кедергі емес.", "Определитель ненулевой. Его отрицательный знак не мешает обратимости.", "The determinant is nonzero. A negative sign does not prevent invertibility."),
        },
        {
          q: T("B матрицасының A-ға кері екенін қалай тексереміз?", "Как проверить, что B обратна к A?", "How do you verify that B is the inverse of A?"),
          options: [
            T("$AB=BA=I$", "$AB=BA=I$", "$AB=BA=I$"),
            T("$AB=0$", "$AB=0$", "$AB=0$"),
            T("$A+B=I$", "$A+B=I$", "$A+B=I$"),
          ],
          correct: 0,
          explain: T("Матрицаны кері матрицасына көбейткенде бірлік матрица шығады.", "При умножении матрицы на её обратную получается единичная матрица.", "Multiplying a matrix by its inverse gives the identity."),
        },
      ],
    },
  ],
  3: [
    {
      id: "1-04",
      seconds: 194,
      title: T("Матрица рангі", "Ранг матрицы", "Matrix rank"),
      summary: T("Рангты нөлден өзгеше минорлар және сатылы түрдегі жетекші элементтер арқылы анықтаңыз.", "Свяжите ранг с ненулевыми минорами и ведущими элементами ступенчатой формы.", "Connect rank to nonzero minors and pivots in echelon form."),
      test: [
        {
          q: T("Сатылы матрицада екі нөлден өзгеше жол бар. Рангі қандай?", "В ступенчатой матрице две ненулевые строки. Каков ранг?", "An echelon matrix has two nonzero rows. What is its rank?"),
          options: [
            T("2", "2", "2"),
            T("1", "1", "1"),
            T("3", "3", "3"),
          ],
          correct: 0,
          explain: T("Әр нөлден өзгеше жол бір жетекші элемент береді.", "Каждая ненулевая строка ступенчатой матрицы даёт один ведущий элемент.", "Each nonzero row of an echelon matrix contributes one pivot."),
        },
        {
          q: T("Үшінші ретті минорлардың бәрі нөл, ал екінші ретті бір минор нөлден өзгеше. Ранг қандай?", "Все миноры третьего порядка равны нулю, а один минор второго порядка ненулевой. Каков ранг?", "All third-order minors are zero and one second-order minor is nonzero. What is the rank?"),
          options: [
            T("2", "2", "2"),
            T("0", "0", "0"),
            T("3", "3", "3"),
          ],
          correct: 0,
          explain: T("Нөлден өзгеше минордың ең үлкен реті — 2.", "Наибольший порядок ненулевого минора равен 2.", "The largest order of a nonzero minor is 2."),
        },
      ],
    },
    {
      id: "1-06",
      seconds: 153,
      title: T("Крамер формуласы", "Формулы Крамера", "Cramer’s rule"),
      summary: T("Бас анықтауыштың шартын және бос мүшелер бағанымен қай бағанды ауыстыру керегін қайталаңыз.", "Повторите условие на главный определитель и выберите столбец, который заменяется правой частью.", "Review the condition on the main determinant and identify the column replaced by the right-hand side."),
      test: [
        {
          q: T("$\\Delta_{x_2}$ анықтауышын алу үшін қай бағанды ауыстырамыз?", "Какой столбец заменяем для вычисления $\\Delta_{x_2}$?", "Which column is replaced to compute $\\Delta_{x_2}$?"),
          options: [
            T("Екінші", "Второй", "Second"),
            T("Бірінші", "Первый", "First"),
            T("Соңғысы кез келген жүйеде", "Последний в любой системе", "Last in every system"),
          ],
          correct: 0,
          explain: T("Ауыстырылатын баған ізделетін белгісізге сәйкес келеді.", "Заменяемый столбец соответствует искомой неизвестной.", "The replaced column corresponds to the variable being solved for."),
        },
        {
          q: T("$\\Delta=-30,\\quad\\Delta_{x_1}=-30,\\quad x_1=?$", "$\\Delta=-30,\\quad\\Delta_{x_1}=-30,\\quad x_1=?$", "$\\Delta=-30,\\quad\\Delta_{x_1}=-30,\\quad x_1=?$"),
          options: [
            T("1", "1", "1"),
            T("−1", "−1", "−1"),
            T("30", "30", "30"),
          ],
          correct: 0,
          explain: T("$x_1=\\Delta_{x_1}/\\Delta=(-30)/(-30)=1$", "$x_1=\\Delta_{x_1}/\\Delta=(-30)/(-30)=1$", "$x_1=\\Delta_{x_1}/\\Delta=(-30)/(-30)=1$"),
        },
      ],
    },
    {
      id: "1-07",
      seconds: 344,
      title: T("Кронекер–Капелли теоремасы", "Теорема Кронекера–Капелли", "Kronecker–Capelli theorem"),
      summary: T("Коэффициенттер матрицасы мен кеңейтілген матрицаның рангтерін салыстырып, жүйенің шешімдер санын анықтаңыз.", "Сравните ранги матрицы коэффициентов и расширенной матрицы, чтобы определить число решений.", "Compare the coefficient and augmented matrix ranks to determine how many solutions the system has."),
      test: [
        {
          q: T("$\\operatorname{rank}A=2$, $\\operatorname{rank}[A\\mid b]=3$. Жүйенің шешімі бар ма?", "Ранги $A$ и $[A\\mid b]$ равны 2 и 3. Есть ли у системы решение?", "The ranks of $A$ and $[A\\mid b]$ are 2 and 3. Does the system have a solution?"),
          options: [
            T("Шешімі жоқ", "Решений нет", "No solutions"),
            T("Бір шешім", "Одно решение", "One solution"),
            T("Шексіз көп шешім", "Бесконечно много решений", "Infinitely many solutions"),
          ],
          correct: 0,
          explain: T("Рангтер әртүрлі болғанда жүйе үйлесімсіз.", "При разных рангах система несовместна.", "Different ranks make the system inconsistent."),
        },
        {
          q: T("Үш белгісіз бар және екі ранг те 2-ге тең. Еркін айнымалылар саны қанша?", "Неизвестных три, оба ранга равны 2. Сколько свободных переменных?", "There are three unknowns and both ranks equal 2. How many free variables are there?"),
          options: [
            T("1", "1", "1"),
            T("0", "0", "0"),
            T("2", "2", "2"),
          ],
          correct: 0,
          explain: T("Жүйе үйлесімді және $3-2=1$ еркін айнымалы бар.", "Система совместна, и свободных переменных $3-2=1$.", "The system is consistent and has $3-2=1$ free variable."),
        },
      ],
    },
    {
      id: "1-08",
      seconds: 141,
      title: T("Жүйені матрицалық әдіспен шешу", "Матричный метод решения системы", "Solving a system by the matrix method"),
      summary: T("Жүйені $Ax=b$ түрінде жазып, теңдеудің екі жағын қай жақтан $A^{-1}$-ке көбейту керегін қараңыз.", "Запишите систему как $Ax=b$ и определите, с какой стороны умножить обе части на $A^{-1}$.", "Write the system as $Ax=b$ and decide which side to multiply by $A^{-1}$."),
      test: [
        {
          q: T("$Ax=b$ және A кері матрицаға ие. x формуласы қандай?", "Как выразить x из $Ax=b$, если A обратима?", "How do you solve $Ax=b$ for x when A is invertible?"),
          options: [
            T("$x=A^{-1}b$", "$x=A^{-1}b$", "$x=A^{-1}b$"),
            T("$x=bA^{-1}$", "$x=bA^{-1}$", "$x=bA^{-1}$"),
            T("$x=Ab$", "$x=Ab$", "$x=Ab$"),
          ],
          correct: 0,
          explain: T("$A^{-1}(Ax)=(A^{-1}A)x=x$", "$A^{-1}(Ax)=(A^{-1}A)x=x$", "$A^{-1}(Ax)=(A^{-1}A)x=x$"),
        },
        {
          q: T("Егер $A=\\operatorname{diag}(2,3)$ және $b=(4,9)^T$ болса, шешім қандай?", "Найдите решение для $A=\\operatorname{diag}(2,3)$ и $b=(4,9)^T$.", "Find the solution for $A=\\operatorname{diag}(2,3)$ and $b=(4,9)^T$."),
          options: [
            T("$(2,3)^T$", "$(2,3)^T$", "$(2,3)^T$"),
            T("$(8,27)^T$", "$(8,27)^T$", "$(8,27)^T$"),
            T("$(3,2)^T$", "$(3,2)^T$", "$(3,2)^T$"),
          ],
          correct: 0,
          explain: T("$A^{-1}=\\operatorname{diag}(1/2,1/3),\\quad x=(2,3)^T$", "$A^{-1}=\\operatorname{diag}(1/2,1/3),\\quad x=(2,3)^T$", "$A^{-1}=\\operatorname{diag}(1/2,1/3),\\quad x=(2,3)^T$"),
        },
      ],
    },
    {
      id: "1-09",
      seconds: 232,
      title: T("Гаусс әдісі", "Метод Гаусса", "Gaussian elimination"),
      summary: T("Кеңейтілген матрицаны сатылы түрге келтіріп, соңғы теңдеуден кері қарай шешіңіз.", "Приведите расширенную матрицу к ступенчатому виду и выполните обратную подстановку.", "Reduce the augmented matrix to echelon form and solve by back substitution."),
      test: [
        {
          q: T("Қай амал жүйенің шешімдерін сақтайды?", "Какая операция сохраняет множество решений системы?", "Which operation preserves the solution set?"),
          options: [
            T("$R_2\\leftarrow R_2-2R_1$", "$R_2\\leftarrow R_2-2R_1$", "$R_2\\leftarrow R_2-2R_1$"),
            T("$R_2\\leftarrow0R_2$", "$R_2\\leftarrow0R_2$", "$R_2\\leftarrow0R_2$"),
            T("$R_2\\leftarrow R_1$", "$R_2\\leftarrow R_1$", "$R_2\\leftarrow R_1$"),
          ],
          correct: 0,
          explain: T("Бір жолға екінші жолдың еселігін қосуды кері қайтаруға болады. Амалды бос мүшелерге де қолданамыз.", "Добавление кратной другой строки обратимо. Операцию применяют и к столбцу правой части.", "Adding a multiple of another row is reversible. Apply it to the right-hand column as well."),
        },
        {
          q: T("Сатылы жүйеде $y=2$ және $x+3y=7$. x нешеге тең?", "После исключения получены $y=2$ и $x+3y=7$. Чему равен x?", "After elimination, $y=2$ and $x+3y=7$. What is x?"),
          options: [
            T("1", "1", "1"),
            T("2", "2", "2"),
            T("7", "7", "7"),
          ],
          correct: 0,
          explain: T("$x=7-3\\cdot2=1$", "$x=7-3\\cdot2=1$", "$x=7-3\\cdot2=1$"),
        },
      ],
    },
    {
      id: "1-10",
      seconds: 230,
      title: T("Біртекті сызықтық теңдеулер жүйесі", "Однородная система линейных уравнений", "Homogeneous systems"),
      summary: T("Нөлдік шешімнің бар екенін тексеріп, еркін айнымалы болғанда нөлден өзге шешімдерді құрыңыз.", "Проверьте существование нулевого решения и найдите ненулевые решения через свободную переменную.", "Verify the zero solution and use a free variable to find nonzero solutions."),
      test: [
        {
          q: T("$Ax=0$ жүйесінде әрқашан қандай шешім бар?", "Какое решение всегда есть у системы $Ax=0$?", "Which solution always exists for $Ax=0$?"),
          options: [
            T("$x=0$", "$x=0$", "$x=0$"),
            T("$x=(1,\\ldots,1)^T$", "$x=(1,\\ldots,1)^T$", "$x=(1,\\ldots,1)^T$"),
            T("Шешім әрқашан жоқ", "Решений всегда нет", "There are always no solutions"),
          ],
          correct: 0,
          explain: T("Кез келген A матрицасын нөлдік векторға көбейтсек, нөлдік вектор шығады.", "Произведение любой матрицы A на нулевой вектор равно нулевому вектору.", "Multiplying any matrix A by the zero vector gives the zero vector."),
        },
        {
          q: T("Біртекті жүйеде үш белгісіз және $\\operatorname{rank}A=2$. Нөлден өзге шешімдер бар ма?", "У однородной системы три неизвестных и $\\operatorname{rank}A=2$. Есть ли ненулевые решения?", "A homogeneous system has three unknowns and $\\operatorname{rank}A=2$. Are there nonzero solutions?"),
          options: [
            T("Иә, бір еркін айнымалы бар", "Да, есть одна свободная переменная", "Yes, there is one free variable"),
            T("Жоқ, тек нөлдік шешім", "Нет, только нулевое решение", "No, only the zero solution"),
            T("Жүйе үйлесімсіз", "Система несовместна", "The system is inconsistent"),
          ],
          correct: 0,
          explain: T("Бір еркін айнымалы бар. Оған нөлден өзгеше мән берсек, нөлден өзге шешім шығады.", "Есть одна свободная переменная. Её ненулевое значение даёт ненулевое решение.", "There is one free variable. A nonzero value for it gives a nonzero solution."),
        },
      ],
    },
  ],
};
