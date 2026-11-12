import { T, type DeepDive, type Example } from './types';

/** Supplements for the eight published lectures of the course pack. */
export const ADDITIONAL_DEPTH: Record<number, DeepDive> = {
  1: {
    id: "columns-and-models",
    title: T(
      "Матрица бағандары нені білдіреді",
      "Что означают столбцы матрицы",
      "What matrix columns represent",
    ),
    summary: T(
      "Кесте бойынша модель құрып, бағандардың салмақталған қосындысын табыңыз.",
      "Постройте модель по таблице и получите результат как взвешенную сумму столбцов.",
      "Build a model from a table and compute its output as a weighted sum of columns.",
    ),
    blocks: [
      {
        kind: "p",
        text: T(
          "A матрицасын x бағанына көбейткенде xⱼ коэффициенті A-ның j-бағанын неше рет алу керегін көрсетеді. Сондықтан x координаталарының саны A бағандарының санына тең. Нәтижедегі координаталар саны A жолдарының санына тең.",
          "При умножении A на столбец x каждый коэффициент xⱼ показывает, сколько раз нужно взять j-й столбец A. Из этого видно, почему число координат x должно совпадать с числом столбцов A. Результат имеет столько координат, сколько у A строк.",
          "In Ax, each coefficient xⱼ tells you how many copies of column j to take. This is why x needs one component for every column of A. The result has one component for each row of A.",
        ),
      },
      {
        kind: "formula",
        tex: "A=[\\,\\mathbf a_1\\ \\mathbf a_2\\ \\cdots\\ \\mathbf a_n\\,],\\qquad Ax=\\sum_{j=1}^{n}x_j\\mathbf a_j",
      },
      {
        kind: "example",
        example: {
          title: T(
            "Материал шығыны",
            "Расход материалов",
            "Material requirements",
          ),
          task: T(
            "Әр баған өз түріндегі бір бөлшекке жұмсалатын екі материалды көрсетеді. Бірінші түрден төрт, екіншісінен үш бөлшекке кететін шығынды табыңыз.",
            "Каждый столбец показывает расход двух материалов на одну деталь своего вида. Найдите расход на четыре детали первого вида и три второго.",
            "Each column shows the two materials needed for one part of its type. Find the requirements for four parts of the first type and three of the second.",
          ),
          given: "A=\\begin{pmatrix}3&5\\\\2&1\\end{pmatrix},\\qquad x=\\binom43",
          steps: [
            {
              text: T(
                "Әр түрдің бағанын сол түрдегі бөлшектер санына көбейтіңіз.",
                "Умножьте столбец каждого вида на число его деталей.",
                "Multiply each column by its production count.",
              ),
              tex: "4\\binom32=\\binom{12}{8},\\qquad 3\\binom51=\\binom{15}{3}",
            },
            {
              tex: "Ax=\\binom{12}{8}+\\binom{15}{3}=\\binom{27}{11}",
            },
            {
              text: T(
                "Бірінші координата бірінші материалға, екіншісі екінші материалға сәйкес. Модельді тексеру үшін x = (1,0) алыңыз. Бірінші баған шығуы тиіс.",
                "Первая координата отвечает за первый материал, вторая за второй. Чтобы проверить модель, возьмите x = (1,0). Должен получиться первый столбец.",
                "The first component is the first material and the second is the second. Check the model with x = (1,0). The result should be the first column.",
              ),
            },
          ],
          added: true,
        },
      },
    ],
  },
  2: {
    id: "determinant-elimination",
    title: T(
      "Төртінші ретті анықтауышты екі тәсілмен есептеу",
      "Определитель четвёртого порядка двумя способами",
      "A fourth-order determinant by two methods",
    ),
    summary: T(
      "Минорлар бойынша тиімді жіктеуді таңдаңыз немесе матрицаны үшбұрышты түрге келтіріңіз.",
      "Выберите выгодное разложение по минорам или сведите матрицу к треугольной.",
      "Choose an efficient cofactor expansion or reduce the matrix to triangular form.",
    ),
    blocks: [
      {
        kind: "p",
        text: T(
          "Жол немесе баған бойынша жіктеу кез келген ретті квадрат матрицаға жарайды. Нөлі ең көп жолды таңдаңыз. Нөлдері аз матрица үшін жолдарға басқа жолдардың еселіктерін қосып, үшбұрышты түрге келтірген тиімді. Содан кейін диагональ элементтерін көбейтіңіз.",
          "Разложение по строке или столбцу работает для квадратной матрицы любого порядка. Выбирайте строку с наибольшим числом нулей. Для плотной матрицы выгоднее получить треугольный вид прибавлением кратных строк, а затем перемножить диагональные элементы.",
          "Cofactor expansion works for any square matrix. Choose a row with many zeros. For a dense matrix, use row additions to reach triangular form, then multiply the diagonal entries.",
        ),
      },
      {
        kind: "formula",
        tex: "\\det A=\\sum_j a_{ij}(-1)^{i+j}M_{ij},\\qquad \\det U=\\prod_i u_{ii}",
      },
      {
        kind: "example",
        example: {
          title: T(
            "Жол ауыстыру таңбасы және минормен тексеру",
            "Знак перестановки и проверка минором",
            "Swap sign and cofactor check",
          ),
          task: T(
            "Анықтауышты бірінші жол бойынша жіктеп есептеп, нәтижені жол түрлендірулерімен тексеріңіз.",
            "Вычислите определитель разложением по первой строке и проверьте результат исключением.",
            "Compute the determinant by the first row and check it by elimination.",
          ),
          given: "A=\\begin{pmatrix}0&2&0&0\\\\1&3&1&0\\\\0&1&2&1\\\\0&0&1&2\\end{pmatrix}",
          steps: [
            {
              tex: "\\det A=-2\\begin{vmatrix}1&1&0\\\\0&2&1\\\\0&1&2\\end{vmatrix}=-2(4-1)=-6",
            },
            {
              text: T(
                "Алғашқы екі жолды ауыстырыңыз. Үшінші жолдан екінші жолдың жартысын, төртінші жолдан жаңа үшінші жолдың жартысын азайтыңыз.",
                "Переставьте первые две строки. Затем вычтите половину второй строки из третьей и половину новой третьей из четвёртой.",
                "Swap the first two rows. Subtract half of row two from row three, then half of the new row three from row four.",
              ),
              tex: "U=\\begin{pmatrix}1&3&1&0\\\\0&2&0&0\\\\0&0&2&1\\\\0&0&0&3/2\\end{pmatrix}",
            },
            {
              text: T(
                "Еселік жолды қосу анықтауышты өзгертпейді, бір рет ауыстыру таңбаны өзгертеді.",
                "Прибавление кратных строк не меняет определитель, а одна перестановка меняет его знак.",
                "Row additions preserve the determinant, and the single swap reverses its sign.",
              ),
              tex: "\\det A=-\\det U=-1\\cdot2\\cdot2\\cdot\\tfrac32=-6",
            },
          ],
          added: true,
        },
      },
    ],
  },
  3: {
    id: "cramer-why",
    title: T(
      "Крамер ережесі неге орындалады",
      "Почему работает правило Крамера",
      "Why Cramer’s rule works",
    ),
    summary: T(
      "Формуланы анықтауыш қасиеттерінен қорытып, шешімді қою арқылы тексеріңіз.",
      "Выведите формулу из свойств определителя и проверьте решение подстановкой.",
      "Derive the formula from determinant properties and check the solution by substitution.",
    ),
    blocks: [
      {
        kind: "p",
        text: T(
          "Ax = b теңдеуі b оң жағын A бағандарының xⱼ коэффициенттері бар комбинациясы түрінде жазады. i-бағанды b-мен алмастырып, сол баған бойынша анықтауыштың сызықтылығын қолданыңыз. i-шіден басқа әр қосылғышта екі баған беттеседі, сондықтан анықтауышы нөл. xᵢ det A ғана қалады. det A ≠ 0 болса ғана бөлуге болады.",
          "Уравнение Ax = b выражает правую часть b как комбинацию столбцов A с коэффициентами xⱼ. Замените столбец i на b и раскройте определитель по линейности в этом столбце. В каждом слагаемом, кроме i-го, два столбца совпадают, поэтому определитель равен нулю. Остаётся xᵢ det A. Делить можно, только если det A ≠ 0.",
          "Ax = b expresses b as a combination of the columns of A with weights xⱼ. Replace column i by b and use linearity in that column. Every term except i has two identical columns and therefore a zero determinant. The remaining term is xᵢ det A. Division requires det A ≠ 0.",
        ),
      },
      {
        kind: "formula",
        tex: "\\det A_i(b)=x_i\\det A,\\qquad x_i=\\frac{\\det A_i(b)}{\\det A}\\quad(\\det A\\ne0)",
      },
      {
        kind: "example",
        example: {
          title: T(
            "Екі белгісіз",
            "Два неизвестных",
            "Two unknowns",
          ),
          task: T(
            "Жүйені Крамер ережесімен шешіп, екі теңдеудің де орындалуын тексеріңіз.",
            "Решите систему по Крамеру. Проверьте, что оба уравнения выполняются.",
            "Solve using Cramer’s rule and verify both equations.",
          ),
          given: "\\begin{cases}2x+y=5\\\\x-y=1\\end{cases}",
          steps: [
            {
              tex: "\\Delta=\\begin{vmatrix}2&1\\\\1&-1\\end{vmatrix}=-3",
            },
            {
              tex: "\\Delta_x=\\begin{vmatrix}5&1\\\\1&-1\\end{vmatrix}=-6,\\quad\\Delta_y=\\begin{vmatrix}2&5\\\\1&1\\end{vmatrix}=-3",
            },
            {
              tex: "x=2,\\quad y=1,\\qquad 2(2)+1=5,\\quad 2-1=1",
            },
          ],
          added: true,
        },
      },
    ],
  },
  4: {
    id: "signed-axis-projections",
    title: T(
      "Проекция таңбасы және координаталарды қалпына келтіру",
      "Знак проекции и восстановление координат",
      "Signed projections and coordinate recovery",
    ),
    summary: T(
      "Ұзындық пен бұрыштан координаталарды табыңыз. Таңбаларды ширек бойынша тексеріңіз.",
      "Находите координаты по длине и углу. Проверяйте знаки по четверти.",
      "Recover components from length and angle, then check their signs by quadrant.",
    ),
    blocks: [
      {
        kind: "p",
        text: T(
          "Оське проекция — оның бойындағы таңбалы орын ауыстыру. Осьтің оң бағытымен сүйір бұрыш жасаса, проекция оң, доғал болса, теріс. α бұрышы оң x бағытынан сағат тіліне қарсы есептелсе, ұзындығы r вектордың координаталары r cos α және r sin α болады.",
          "Проекция на ось — знаковое перемещение вдоль неё. При остром угле с положительным направлением оси она положительна, при тупом отрицательна. Если угол α отсчитывается от положительного направления x против часовой стрелки, координаты вектора длины r равны r cos α и r sin α.",
          "A projection is a signed displacement along an axis. It is positive for an acute angle to the positive axis and negative for an obtuse angle. If α is measured counterclockwise from positive x, a vector of length r has components r cos α and r sin α.",
        ),
      },
      {
        kind: "formula",
        tex: "\\mathbf a=r\\cos\\alpha\\,\\mathbf i+r\\sin\\alpha\\,\\mathbf j",
      },
      {
        kind: "example",
        example: {
          title: T(
            "Екінші ширектегі вектор",
            "Вектор во второй четверти",
            "A vector in the second quadrant",
          ),
          task: T(
            "Ұзындығы 8, бұрышы 120° болатын вектордың координаталарын табыңыз. Олардан бастапқы ұзындық шығатынын тексеріңіз.",
            "Найдите координаты вектора длины 8 с углом 120°. Убедитесь, что координаты дают исходную длину.",
            "Find the components of a vector of length 8 at 120°. Check that the components give the original length.",
          ),
          given: "r=8,\\qquad\\alpha=120^\\circ",
          steps: [
            {
              tex: "a_x=8\\cos120^\\circ=-4,\\qquad a_y=8\\sin120^\\circ=4\\sqrt3",
            },
            {
              tex: "|\\mathbf a|^2=(-4)^2+(4\\sqrt3)^2=64",
            },
            {
              text: T(
                "x таңбасы теріс, y таңбасы оң. Бұл екінші ширекке сәйкес.",
                "Знак x отрицательный, знак y положительный. Это согласуется со второй четвертью.",
                "The x component is negative and y is positive, as expected in the second quadrant.",
              ),
            },
          ],
          added: true,
        },
      },
    ],
  },
  5: {
    id: "torque",
    title: T(
      "Күш моменті және күш иіні",
      "Момент силы и плечо рычага",
      "Torque and the lever arm",
    ),
    summary: T(
      "Айналу бағытын және момент шамасын векторлық көбейтіндімен табыңыз.",
      "Используйте векторное произведение, чтобы найти направление вращения и величину момента.",
      "Use the cross product to find the axis of rotation and torque magnitude.",
    ),
    blocks: [
      {
        kind: "p",
        text: T(
          "r векторы тірек нүктесінен F күшінің түсу нүктесіне бағытталады. Момент модулі күш пен иіннің көбейтіндісіне тең. Иін — тіректен күш әсер ететін түзуге дейінгі қашықтық. Тікбұрышты үшбұрыштан ол |r| sin θ болады. Сондықтан момент векторлық көбейтіндімен өрнектеледі. Бағыты оң қол ережесімен табылады.",
          "Вектор r проводят от точки опоры к точке приложения силы F. Модуль момента равен произведению силы на плечо, то есть расстояние от опоры до линии действия силы. Из прямоугольного треугольника плечо равно |r| sin θ, поэтому момент выражается векторным произведением. Его направление определяют по правилу правой руки.",
          "Draw r from the pivot to where the force F acts. The magnitude of torque is the force times the lever arm, the perpendicular distance from the pivot to the line of action. The right triangle gives that distance as |r| sin θ, hence the cross product. Use the right-hand rule for its direction.",
        ),
      },
      {
        kind: "formula",
        tex: "\\mathbf M=\\mathbf r\\times\\mathbf F,\\qquad |\\mathbf M|=|\\mathbf F|\\,|\\mathbf r|\\sin\\theta",
      },
      {
        kind: "example",
        example: {
          title: T(
            "Иінтірек ұшындағы күш",
            "Сила на конце рычага",
            "Force at the end of a lever",
          ),
          task: T(
            "Координаталар басына қатысты моментті табыңыз. Күштің қай құраушысы айналу туғызады?",
            "Найдите момент относительно начала координат. Какая составляющая силы создаёт вращение?",
            "Find the torque about the origin. Which component of the force causes rotation?",
          ),
          given: "\\mathbf r=(2,0,0)\\,\\mathrm m,\\qquad \\mathbf F=(3,4,0)\\,\\mathrm N",
          steps: [
            {
              tex: "\\mathbf M=(0,0,2\\cdot4)=(0,0,8)\\,\\mathrm{N\\,m}",
            },
            {
              text: T(
                "3 Н құраушысы иінтірек бойымен бағытталып, момент туғызбайды. 4 Н құраушысы иінтірекке перпендикуляр.",
                "Компонента 3 Н направлена вдоль рычага и момента не создаёт. Компонента 4 Н перпендикулярна рычагу.",
                "The 3 N component is parallel to the lever and produces no torque. The 4 N component is perpendicular.",
              ),
              tex: "|\\mathbf M|=2\\cdot4=8\\,\\mathrm{N\\,m}",
            },
            {
              text: T(
                "Оң z бағыты оң z осі жағынан қарағанда сағат тіліне қарсы айналуды білдіреді.",
                "Положительный z означает вращение против часовой стрелки при взгляде со стороны положительной оси z.",
                "Positive z means counterclockwise rotation as viewed from the positive z side.",
              ),
            },
          ],
          added: true,
        },
      },
    ],
  },
  6: {
    id: "segment-and-area",
    title: T(
      "Кесіндіні бөлу және координаталар бойынша аудан",
      "Деление отрезка и площадь по координатам",
      "Dividing a segment and finding area from coordinates",
    ),
    summary: T(
      "ОӘК-тегі 13–17 практикалық сабақтың кешенді есебін шығарыңыз.",
      "Решите комплексную задачу из практических занятий 13–17 УМКД.",
      "Solve a combined problem from practical sessions 13–17 of the course pack.",
    ),
    blocks: [
      {
        kind: "p",
        text: T(
          "BM:MC = m:n болса, M нүктесі B-ден C-ге дейінгі жолдың m/(m+n) бөлігін өтеді. Сондықтан B координаталарының салмағы n, C координаталарының салмағы m. Аудан үшін бір төбеден шыққан екі векторды алыңыз. Олардың екі өлшемді анықтауышының модулі параллелограмм ауданын береді.",
          "Если BM:MC = m:n, точка M проходит долю m/(m+n) пути от B к C. Поэтому вес у координат B равен n, а у C равен m. Для площади треугольника возьмите два вектора из одной вершины. Модуль их двумерного определителя даёт площадь параллелограмма.",
          "If BM:MC = m:n, M is the fraction m/(m+n) of the way from B to C. This gives weight n to B and weight m to C. For triangle area, take two vectors from the same vertex. The absolute value of their planar determinant gives the parallelogram area.",
        ),
      },
      {
        kind: "formula",
        tex: "M=B+\\frac{m}{m+n}(C-B),\\qquad S_{ABC}=\\tfrac12|\\det(\\overrightarrow{AB},\\overrightarrow{AC})|",
      },
      {
        kind: "p",
        text: T(
          "Практикада екі формуланы да ОӘК-тегі үшбұрышқа қолданыңыз. Аудан үшін алдымен AB және AC векторларын, қабырғаны бөлу үшін BC векторын табыңыз.",
          "В практике примените обе формулы к треугольнику из УМКД. Сначала найдите векторы AB и AC для площади, затем используйте вектор BC для деления стороны.",
          "Apply both formulas to the course-pack triangle in Practice. Use AB and AC for the area, then BC to divide the side.",
        ),
      },
    ],
  },
  7: {
    id: "normal-form-signed-distance",
    title: T(
      "Жазықтықтың нормаль теңдеуі және таңбалы қашықтық",
      "Нормальное уравнение плоскости и знаковое расстояние",
      "Plane normal form and signed distance",
    ),
    summary: T(
      "Нормальді бірлік ұзындыққа келтіріп, нүкте жазықтықтың қай жағында жатқанын анықтаңыз.",
      "Приведите нормаль к единичной длине и определите, по какую сторону плоскости находится точка.",
      "Normalize the plane normal and determine which side of the plane contains a point.",
    ),
    blocks: [
      {
        kind: "p",
        text: T(
          "Жазықтықтың нормаль түрі u·X = p, мұнда u — бірлік нормаль, p ≥ 0 — координаталар басынан жазықтыққа дейінгі қашықтық. Барлық коэффициентті нормаль ұзындығына бөліңіз. Оң жақ теріс болмайтындай ортақ таңбаны таңдаңыз. p = 0 болса, нормальдің екі бағытының кез келгенін алуға болады.",
          "Нормальная форма плоскости имеет вид u·X = p, где u — единичная нормаль, а p ≥ 0 — расстояние от начала координат до плоскости. Чтобы получить её, разделите все коэффициенты на длину нормали. Выберите общий знак так, чтобы правая часть была неотрицательной. При p = 0 можно выбрать любое из двух направлений нормали.",
          "The normal form is u·X = p, where u is a unit normal and p ≥ 0 is the distance from the origin. Divide all coefficients by the normal length, then choose the overall sign to make the right-hand side nonnegative. At p = 0 either normal direction works.",
        ),
      },
      {
        kind: "p",
        text: T(
          "s = u·P − p таңбалы қашықтығы таңдалған нормаль бойымен өлшенеді. Оның модулі — кәдімгі қашықтық. P нүктесінен −su векторын салсақ, жазықтықтағы ең жақын нүкте шығады. Орнына қою проекцияның жазықтықта жатқанын растайды.",
          "Знаковое расстояние s = u·P − p измеряется вдоль выбранной нормали. Его модуль — обычное расстояние. Ближайшая точка плоскости получается, если от P отложить вектор −su. Подстановка подтверждает, что проекция лежит в плоскости.",
          "The signed distance s = u·P − p is measured along the chosen normal. Its absolute value is the ordinary distance. Move from P by −su to reach the closest point. Substitution confirms that the projection lies in the plane.",
        ),
      },
      {
        kind: "example",
        example: {
          title: T(
            "P қай жақта жатыр",
            "По какую сторону лежит P",
            "Which side contains P",
          ),
          task: T(
            "Нормаль түрін жазып, P нүктесінің қашықтығын және проекциясын табыңыз.",
            "Запишите нормальную форму, найдите расстояние и проекцию P.",
            "Write the normal form, find the distance and project P onto the plane.",
          ),
          given: "2x-y+2z+6=0,\\qquad P=(1,2,3)",
          steps: [
            {
              tex: "|\\mathbf n|=3,\\quad \\mathbf u=(-2/3,1/3,-2/3),\\quad \\mathbf u\\cdot X=2",
            },
            {
              tex: "s=\\mathbf u\\cdot P-2=-4,\\quad d=4",
            },
            {
              tex: "H=P-s\\mathbf u=(-5/3,10/3,1/3)",
            },
            {
              tex: "2(-5/3)-10/3+2(1/3)+6=0",
            },
          ],
          added: true,
        },
      },
    ],
  },
  8: {
    id: "parabola-focus-derivation",
    title: T(
      "Фокус пен директрисадан парабола теңдеуін қорыту",
      "Как вывести уравнение параболы из фокуса и директрисы",
      "Deriving a parabola from its focus and directrix",
    ),
    summary: T(
      "Геометриялық анықтаманы формуламен және ОӘК-тегі белгілеулермен байланыстырыңыз.",
      "Свяжите геометрическое определение с формулой и обозначениями в УМКД.",
      "Connect the geometric definition with the equation and the course-pack notation.",
    ),
    blocks: [
      {
        kind: "p",
        text: T(
          "Төбені координаталар басына, F фокусын оңға қарай a қашықтықта орналастырыңыз. Директриса солға қарай a қашықтықта өтеді. (x,y) нүктесі фокус пен директрисадан бірдей қашықтықта болса, параболада жатады. Екі қашықтық та теріс емес, сондықтан квадраттау шешімдерді өзгертпейді.",
          "Поместите вершину в начало координат, а фокус F на расстояние a справа. Директриса тогда проходит на расстоянии a слева. Точка (x,y) лежит на параболе, когда расстояние до фокуса равно расстоянию до директрисы. Обе части неотрицательны, поэтому их можно возвести в квадрат без потери решений.",
          "Put the vertex at the origin and the focus a units to the right. The directrix then lies a units to the left. A point (x,y) lies on the parabola when its two distances agree. Both distances are nonnegative, so squaring preserves the solutions.",
        ),
      },
      {
        kind: "formula",
        tex: "\\sqrt{(x-a)^2+y^2}=|x+a|\\quad\\Longrightarrow\\quad y^2=(x+a)^2-(x-a)^2=4ax",
      },
      {
        kind: "p",
        text: T(
          "ОӘК-те p параметрі — фокустан директрисаға дейінгі қашықтық. Біздің қорытуда ол 2a. Сондықтан p = 2a кезінде y² = 2px және y² = 4ax бір қисықты сипаттайды. Басқа дереккөздегі есепті қолданғанда параметр анықтамасын тексеріңіз.",
          "В УМКД параметром p называют расстояние от фокуса до директрисы. В нашем выводе это 2a, поэтому формулы y² = 2px и y² = 4ax описывают одну кривую при p = 2a. Смотрите на определение параметра при переносе задач между источниками.",
          "The course pack uses p for the focus-to-directrix distance. Here it equals 2a, so y² = 2px and y² = 4ax describe the same curve when p = 2a. Check the definition of the parameter when switching sources.",
        ),
      },
      {
        kind: "example",
        example: {
          title: T(
            "Нүктені екі қашықтық арқылы тексеру",
            "Проверка точки по двум расстояниям",
            "Checking a point using both distances",
          ),
          task: T(
            "Парабола теңдеуін тауып, (2,4) нүктесін тексеріңіз.",
            "Найдите уравнение параболы и проверьте точку (2,4).",
            "Find the parabola equation and verify the point (2,4).",
          ),
          given: "F=(2,0),\\qquad \\ell:\\ x=-2",
          steps: [
            {
              tex: "a=2,\\quad p=4,\\qquad y^2=8x",
            },
            {
              tex: "4^2=8\\cdot2,\\qquad d((2,4),F)=4,\\quad d((2,4),\\ell)=|2+2|=4",
            },
          ],
          added: true,
        },
      },
    ],
  },
};

/** Worked applications based on the practical sessions in the course pack. */
export const UMKD_PRACTICE: Partial<Record<number, Example[]>> = {
  5: [
    {
      title: T(
        "Төрт төбе бойынша пирамиданың көлемі",
        "Объём пирамиды по четырём вершинам",
        "Pyramid volume from four vertices",
      ),
      task: T(
        "ОӘК-тегі 8–12 сабақтағы ABCD пирамидасының көлемін табыңыз. A төбесінен шығатын үш қырды пайдаланыңыз.",
        "Найдите объём пирамиды ABCD из практических занятий 8–12 УМКД. Используйте три ребра из вершины A.",
        "Find the volume of ABCD from practical sessions 8–12. Use the three edges from A.",
      ),
      given: "A=(5,1,-4),\\ B=(1,2,-1),\\ C=(3,3,-4),\\ D=(2,2,2)",
      steps: [
        {
          tex: "\\overrightarrow{AB}=(-4,1,3),\\quad\\overrightarrow{AC}=(-2,2,0),\\quad\\overrightarrow{AD}=(-3,1,6)",
        },
        {
          tex: "\\overrightarrow{AB}\\times\\overrightarrow{AC}=(-6,-6,-6)",
        },
        {
          tex: "(-6,-6,-6)\\cdot(-3,1,6)=18-6-36=-24",
        },
        {
          text: T(
            "Осы үш қырға салынған пирамиданың көлемі параллелепипед көлемінің алтыдан біріне тең.",
            "Пирамида на трёх рёбрах занимает одну шестую объёма параллелепипеда.",
            "The pyramid on the three edges occupies one sixth of the parallelepiped volume.",
          ),
          tex: "V=\\frac{|-24|}{6}=4",
        },
      ],
      added: false,
    },
  ],
  6: [
    {
      title: T(
        "Үшбұрыш және оның қабырғасындағы нүкте",
        "Треугольник и точка на его стороне",
        "A triangle and a point on one side",
      ),
      task: T(
        "Қабырғалар ұзындықтарын, BM:MC = 2:3 шартын қанағаттандыратын M нүктесін және ABC ауданын табыңыз.",
        "Найдите длины сторон, точку M с BM:MC = 2:3 и площадь ABC.",
        "Find the side lengths, the point M with BM:MC = 2:3, and the area of ABC.",
      ),
      given: "A=(3,2),\\qquad B=(-2,4),\\qquad C=(-1,5)",
      steps: [
        {
          tex: "\\overrightarrow{AB}=(-5,2),\\quad\\overrightarrow{BC}=(1,1),\\quad\\overrightarrow{AC}=(-4,3)",
        },
        {
          tex: "|AB|=\\sqrt{29},\\qquad |BC|=\\sqrt2,\\qquad |AC|=5",
        },
        {
          tex: "M=(-2,4)+\\tfrac25(1,1)=\\left(-\\tfrac85,\\tfrac{22}5\\right)",
        },
        {
          tex: "S_{ABC}=\\tfrac12|(-5)\\cdot3-2\\cdot(-4)|=\\tfrac72",
        },
      ],
      added: false,
    },
  ],
  8: [
    {
      title: T(
        "Центрі ығысқан шеңбер",
        "Окружность со смещённым центром",
        "A circle with a shifted center",
      ),
      task: T(
        "ОӘК есебі бойынша шеңбер теңдеуін жазыңыз. x осімен қиылысу нүктелерін табыңыз.",
        "По задаче из УМКД запишите уравнение окружности. Найдите её пересечения с осью x.",
        "Write the circle equation from the course-pack problem. Find where it meets the x-axis.",
      ),
      given: "C=(-4,3),\\qquad R=5",
      steps: [
        {
          tex: "(x+4)^2+(y-3)^2=25",
        },
        {
          text: T(
            "x осінде y координатасы нөлге тең.",
            "На оси x координата y равна нулю.",
            "On the x-axis, y is zero.",
          ),
          tex: "(x+4)^2+9=25\\quad\\Longrightarrow\\quad x+4=\\pm4",
        },
        {
          tex: "P_1=(-8,0),\\qquad P_2=(0,0)",
        },
      ],
      added: false,
    },
  ],
};
