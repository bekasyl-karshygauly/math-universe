import { Block, Example, L, Lecture, T, TestQuestion, X } from './types';

const tex = String.raw;
const heading = (text: L): Block => ({ kind: 'h', text });
const paragraph = (text: L): Block => ({ kind: 'p', text });
const formula = (value: string): Block => ({ kind: 'formula', tex: value });
const question = (q: L, options: L[], explain: L): TestQuestion => ({ q, options, correct: 0, explain });

const VECTOR_EXAMPLE: Example = {
  title: T('Екі нүкте арасындағы вектор', 'Вектор по двум точкам', 'A vector from two points'),
  task: T('Вектордың координаталарын, ұзындығын және бағыттаушы косинустарын табыңыз.', 'Найдите координаты, длину и направляющие косинусы вектора.', 'Find the vector components, length and direction cosines.'),
  given: 'A=(1,-2,3),\\qquad B=(4,2,3)',
  steps: [
    { text: T('Соңғы нүктеден бастапқы нүктені азайтамыз.', 'Вычитаем координаты начала из координат конца.', 'Subtract the start coordinates from the end coordinates.'), tex: tex`\overrightarrow{AB}=(4-1,\,2-(-2),\,3-3)=(3,4,0)` },
    { tex: tex`|\overrightarrow{AB}|=\sqrt{3^2+4^2+0^2}=5` },
    { text: T('Әр координатаны ұзындыққа бөлеміз.', 'Делим каждую координату на длину.', 'Divide each component by the length.'), tex: tex`(\cos\alpha,\cos\beta,\cos\gamma)=(3/5,4/5,0)` },
  ],
  added: true,
};

export const LECTURE_4: Lecture = {
  id: 'm1-l4',
  number: 4,
  title: T('Векторлар және координаталар', 'Векторы и координаты', 'Vectors and coordinates'),
  summary: T('Екі нүкте арқылы векторды құрып, оның бағытын, ұзындығын және проекцияларын анықтаймыз.', 'Построим вектор по двум точкам и найдём его направление, длину и проекции.', 'Construct a vector from two points and find its direction, length and projections.'),
  topics: [T('сызықтық амалдар', 'линейные операции', 'linear operations'), T('проекция', 'проекция', 'projection'), T('коллинеарлық', 'коллинеарность', 'collinearity')],
  blocks: [
    heading(T('Нүктелер мен векторлар', 'Точки и векторы', 'Points and vectors')),
    paragraph(T('Декарт жүйесінде нүктенің координаталары оның орнын, ал вектордың координаталары осьтер бойындағы орын ауыстыруды көрсетеді. Вектор — бағытталған кесінді. Басы мен ұшы беттессе, нөлдік вектор шығады.', 'В декартовой системе координаты точки задают положение, а координаты вектора — перемещение вдоль осей. Вектор — направленный отрезок. При совпадении начала и конца получается нулевой вектор.', 'Cartesian coordinates give a point’s location and a vector’s displacement along each axis. A vector is a directed segment. Coincident start and end points give the zero vector.')),
    formula(tex`\overrightarrow{AB}=(x_B-x_A,\,y_B-y_A,\,z_B-z_A),\qquad |\mathbf a|=\sqrt{a_x^2+a_y^2+a_z^2}`),
    { kind: 'visual', id: 'vector-coordinates' },
    heading(T('Сызықтық амалдар', 'Линейные операции', 'Linear operations')),
    paragraph(T('Векторларды координаталары бойынша қосамыз және азайтамыз. Санға көбейткенде барлық координата өзгереді. Теріс көбейткіш бағытты өзгертеді. Қосындыны үшбұрыш немесе параллелограмм ережесімен салуға болады.', 'Векторы складываем и вычитаем покомпонентно. При умножении на число масштабируем все координаты. Отрицательный множитель разворачивает вектор. Сумму можно построить по правилу треугольника или параллелограмма.', 'Add and subtract vectors component by component. Scalar multiplication scales every component. A negative scalar reverses the direction. Use the triangle or parallelogram rule to construct a sum.')),
    formula(tex`\mathbf a+\mathbf b=(a_x+b_x,\,a_y+b_y,\,a_z+b_z),\qquad k\mathbf a=(ka_x,\,ka_y,\,ka_z)`),
    paragraph(T('Екі нөлдік емес вектордың біреуі екіншісіне пропорционал болса, олар коллинеар. Координатасы нөл болса, бөлудің орнына ортақ көбейткішті тексеріңіз. Векторларды бір нүктеге көшіргенде олар бір жазықтықта жатса, компланар болады.', 'Два ненулевых вектора коллинеарны, если один пропорционален другому. При нулевой координате проверяйте общий множитель без деления на ноль. Векторы компланарны, если после переноса к общему началу лежат в одной плоскости.', 'Two nonzero vectors are collinear when one is a scalar multiple of the other. For zero components, check the common multiplier directly. Vectors are coplanar when they lie in one plane after moving their tails to a common point.')),
    heading(T('Проекция және бағыттаушы косинустар', 'Проекции и направляющие косинусы', 'Projections and direction cosines')),
    paragraph(T('Оське таңбалы проекция — вектордың сол осьтегі координатасы. Нөлдік емес вектордың бағыттаушы косинустары оның координаталарын ұзындығына бөлу арқылы табылады.', 'Знаковая проекция на координатную ось равна соответствующей координате вектора. Направляющие косинусы ненулевого вектора получаются делением координат на его длину.', 'The signed projection onto a coordinate axis is the corresponding component. For a nonzero vector, divide the components by its length to obtain the direction cosines.')),
    formula(tex`\cos\alpha=\frac{a_x}{|\mathbf a|},\quad \cos\beta=\frac{a_y}{|\mathbf a|},\quad \cos\gamma=\frac{a_z}{|\mathbf a|}`),
  ],
  practice: {
    sessions: '8–12',
    goal: T('Вектордың координаталары мен ұзындығын өзіңіз табыңыз.', 'Самостоятельно найдите координаты и длину вектора.', 'Find a vector’s components and length on your own.'),
    questions: [T('Бағыт өзгерсе, координаталар мен ұзындық қалай өзгереді?', 'Что меняется у вектора при обращении направления?', 'What changes when a vector reverses direction?')],
    examples: [VECTOR_EXAMPLE],
  },
  selfCheck: [{ q: T('Нөлдік вектордың бағыттаушы косинустары бар ма?', 'Есть ли направляющие косинусы у нулевого вектора?', 'Does the zero vector have direction cosines?'), a: T('Жоқ. Оның бағыты анықталмаған.', 'Нет. У нулевого вектора направление не определено.', 'No. Its direction is undefined.') }],
  test: [
    question(X(tex`$A=(1,3),\,B=(4,1),\quad \overrightarrow{AB}=?$`), [X('$(3,-2)$'), X('$(-3,2)$'), X('$(5,4)$'), X('$(4,1)$')], T('Соңғы нүктенің координаталарынан бастапқыны азайтамыз.', 'Вычитаем начало из конца. Получаем $(4-1,1-3)$.', 'Subtract the start from the end to get $(4-1,1-3)$.')),
    question(X(tex`$|\mathbf a|=?,\quad \mathbf a=(2,-3,6)$`), [X('$7$'), X('$5$'), X('$11$'), X('$49$')], X(tex`$\sqrt{4+9+36}=\sqrt{49}=7$.`)),
    question(T('$(2,-4,0)$ векторына қайсысы коллинеар?', 'Какой вектор коллинеарен $(2,-4,0)$?', 'Which vector is collinear with $(2,-4,0)$?'), [X('$(-1,2,0)$'), X('$(1,2,0)$'), X('$(2,4,0)$'), X('$(0,-4,2)$')], X('$(-1,2,0)=-\\frac12(2,-4,0)$.')),
    question(T('$(3,-4,0)$ векторының $y$ осіне таңбалы проекциясы қандай?', 'Чему равна знаковая проекция $(3,-4,0)$ на ось $y$?', 'What is the signed projection of $(3,-4,0)$ onto the $y$-axis?'), [X('$-4$'), X('$4$'), X('$-4/5$'), X('$5$')], T('Проекция — $y$ координатасы.', 'Проекция равна координате $y$.', 'Take the $y$ component.')),
    question(X(tex`$\mathbf a=(1,-1,2),\,\mathbf b=(0,3,-2),\quad 2\mathbf a+\mathbf b=?$`), [X('$(2,1,2)$'), X('$(1,2,0)$'), X('$(2,-5,6)$'), X('$(2,1,0)$')], X('$(2,-2,4)+(0,3,-2)=(2,1,2)$.')),
  ],
  trainers: ['vector-components'],
  related: [{ courseId: 'linal', lessonId: 'vectors' }],
};

const TRIANGLE_EXAMPLE: Example = {
  title: T('Үшбұрыштың ауданы', 'Площадь треугольника в пространстве', 'Area of a triangle in space'),
  task: T('УМКД-дағы үшбұрыштың ауданын векторлық көбейтінді арқылы табыңыз.', 'Найдите площадь треугольника из УМКД через векторное произведение.', 'Find the area of the triangle from the course materials using the cross product.'),
  given: 'A=(1,2,0),\\quad B=(3,2,1),\\quad C=(-2,1,2)',
  steps: [
    { tex: tex`\overrightarrow{AB}=(2,0,1),\quad \overrightarrow{AC}=(-3,-1,2)` },
    { tex: tex`\overrightarrow{AB}\times\overrightarrow{AC}=(1,-7,-2)` },
    { text: T('Үшбұрыш ауданы параллелограмм ауданының жартысына тең.', 'Треугольник занимает половину параллелограмма на этих векторах.', 'The triangle has half the area of the parallelogram spanned by these vectors.'), tex: tex`S=\frac{\sqrt{1+49+4}}2=\frac{3\sqrt6}{2}` },
  ],
};

export const LECTURE_5: Lecture = {
  id: 'm1-l5',
  number: 5,
  title: T('Векторлардың көбейтінділері және базис', 'Произведения векторов и базис', 'Vector products and bases'),
  summary: T('Бұрышты, ауданды және көлемді координаталар арқылы табамыз.', 'Найдём угол, площадь и объём через координаты векторов.', 'Use vector components to calculate angles, areas and volumes.'),
  topics: [T('скаляр көбейтінді', 'скалярное произведение', 'dot product'), T('векторлық көбейтінді', 'векторное произведение', 'cross product'), T('аралас көбейтінді', 'смешанное произведение', 'triple product')],
  blocks: [
    heading(T('Скаляр көбейтінді және бұрыш', 'Скалярное произведение и угол', 'Dot product and angle')),
    paragraph(T('Скаляр көбейтінді сан береді. Нөлдік емес векторлар перпендикуляр болса, ол нөлге тең. Орын ауыстыру бойындағы тұрақты күштің жұмысы $W=\\mathbf F\\cdot\\mathbf s$.', 'Скалярное произведение даёт число. У ненулевых перпендикулярных векторов оно равно нулю. Работа постоянной силы на перемещении равна $W=\\mathbf F\\cdot\\mathbf s$.', 'The dot product is a scalar and vanishes for nonzero perpendicular vectors. The work of a constant force over a displacement is $W=\\mathbf F\\cdot\\mathbf s$.')),
    formula(tex`\mathbf a\cdot\mathbf b=a_xb_x+a_yb_y+a_zb_z=|\mathbf a||\mathbf b|\cos\theta`),
    { kind: 'visual', id: 'vector-angle' },
    heading(T('Векторлық көбейтінді және аудан', 'Векторное произведение и площадь', 'Cross product and area')),
    paragraph(T('Векторлық көбейтінді екі бастапқы векторға перпендикуляр. Бағыты оң қол ережесімен анықталады. Векторлардың орнын ауыстырсақ, таңба өзгереді. Модулі параллелограмм ауданын береді.', 'Векторное произведение перпендикулярно обоим сомножителям. Направление задаёт правило правой руки. Перестановка векторов меняет знак. Модуль равен площади параллелограмма.', 'The cross product is perpendicular to both factors. Its direction follows the right-hand rule. Swapping the factors reverses the sign. Its magnitude is the parallelogram area.')),
    formula(tex`\mathbf a\times\mathbf b=(a_yb_z-a_zb_y,\ a_zb_x-a_xb_z,\ a_xb_y-a_yb_x),\quad S_{\triangle}=\frac{|\mathbf a\times\mathbf b|}{2}`),
    heading(T('Аралас көбейтінді және базис', 'Смешанное произведение и базис', 'Triple product and basis')),
    paragraph(T('Аралас көбейтіндінің модулі параллелепипедтің көлемін береді. Ол нөл болса, үш вектор компланар. Базис — кеңістікті тудыратын сызықтық тәуелсіз векторлар жиыны. $\\mathbb R^3$ кеңістігінде анықтауышы нөл емес үш вектор базис құрайды.', 'Модуль смешанного произведения даёт объём параллелепипеда. Нулевое значение означает компланарность. Базис — линейно независимый набор, порождающий пространство. В $\\mathbb R^3$ три вектора образуют базис, если их определитель ненулевой.', 'The magnitude of the triple product is the parallelepiped volume. Zero means the vectors are coplanar. A basis is an independent set that spans the space. Three vectors form a basis of $\\mathbb R^3$ when their determinant is nonzero.')),
    formula(tex`[\mathbf a,\mathbf b,\mathbf c]=(\mathbf a\times\mathbf b)\cdot\mathbf c=\det\begin{pmatrix}a_x&a_y&a_z\\b_x&b_y&b_z\\c_x&c_y&c_z\end{pmatrix},\quad V=|[\mathbf a,\mathbf b,\mathbf c]|`),
  ],
  practice: { sessions: '8–12', goal: T('Көбейтіндіні есептің мағынасына қарай таңдаңыз.', 'Выберите произведение по смыслу задачи.', 'Choose the product that matches the problem.'), questions: [T('Үшбұрыш ауданы үшін неге екіге бөлеміз?', 'Почему для площади треугольника делим на два?', 'Why do we divide by two for triangle area?')], examples: [TRIANGLE_EXAMPLE] },
  selfCheck: [{ q: T('Үш вектор базис болатынын қалай тексереміз?', 'Как проверить, образуют ли три вектора базис в пространстве?', 'How do we check if three vectors form a basis in space?'), a: T('Олардың координаталарынан құралған анықтауыш нөлден өзгеше болуы керек.', 'Определитель из их координат должен быть ненулевым.', 'The determinant of their coordinate matrix must be nonzero.') }],
  test: [
    question(X(tex`$(2,-1,3)\cdot(1,4,0)=?$`), [X('$-2$'), X('$2$'), X('$6$'), X('$0$')], X('$2\\cdot1+(-1)\\cdot4+3\\cdot0=-2$.')),
    question(X(tex`$(2,0,0)\times(0,3,0)=?$`), [X('$(0,0,6)$'), X('$(0,0,-6)$'), X('$(6,0,0)$'), X('$(0,0,0)$')], T('Оң қол ережесі бойынша бағыт — оң $z$.', 'По правилу правой руки направление — положительная ось $z$.', 'The right-hand rule gives the positive $z$ direction.')),
    question(T('Векторлық көбейтіндінің модулі 12. Үшбұрыштың ауданы қандай?', 'Модуль векторного произведения равен 12. Какова площадь треугольника?', 'The cross product has magnitude 12. What is the triangle area?'), [X('$6$'), X('$12$'), X('$24$'), X('$3$')], X('$S=12/2=6$.')),
    question(T('Аралас көбейтінді $-24$. Параллелепипедтің көлемі қандай?', 'Смешанное произведение равно $-24$. Чему равен объём параллелепипеда?', 'The triple product is $-24$. What is the parallelepiped volume?'), [X('$24$'), X('$-24$'), X('$12$'), X('$4$')], T('Көлем — аралас көбейтіндінің модулі.', 'Знак задаёт ориентацию. Для объёма берём модуль.', 'The sign gives orientation. Take the absolute value for volume.')),
    question(T('Үш вектор қашан $\\mathbb R^3$ базисін құрайды?', 'Когда три вектора образуют базис $\\mathbb R^3$?', 'When do three vectors form a basis of $\\mathbb R^3$?'), [X('$\\det\\ne0$'), X('$\\det=0$'), T('Кез келген үш вектор', 'Любые три вектора', 'Any three vectors'), T('Тек ұзындықтары бірдей болса', 'Только если длины равны', 'Only if the lengths are equal')], T('Нөлден өзгеше анықтауыш сызықтық тәуелсіздікті білдіреді.', 'Ненулевой определитель означает линейную независимость.', 'A nonzero determinant implies linear independence.')),
  ],
  trainers: ['vector-products'],
  related: [{ courseId: 'linal', lessonId: 'vectors' }, { courseId: 'linal', lessonId: 'determinant' }],
};

const ALTITUDE_EXAMPLE: Example = {
  title: T('Үшбұрыштың биіктігінің теңдеуі', 'Уравнение высоты треугольника', 'Equation of a triangle’s altitude'),
  task: T('$C$ төбесінен $AB$ қабырғасына жүргізілген биіктіктің теңдеуін жазыңыз.', 'Запишите уравнение высоты из вершины $C$ к стороне $AB$.', 'Find the equation of the altitude from $C$ to side $AB$.'),
  given: 'A=(1,1),\\quad B=(7,4),\\quad C=(4,5)',
  steps: [
    { tex: tex`\overrightarrow{AB}=(6,3)\parallel(2,1)` },
    { text: T('Биіктік $AB$-ға перпендикуляр, сондықтан $(2,1)$ — биіктіктің нормалі.', 'Высота перпендикулярна $AB$, поэтому $(2,1)$ — её нормаль.', 'The altitude is perpendicular to $AB$, so $(2,1)$ is its normal.'), tex: '2(x-4)+(y-5)=0' },
    { text: T('$C$ нүктесін қойып, теңдеуді тексеріңіз.', 'Подставьте точку $C$ для проверки.', 'Substitute point $C$ to check the result.'), tex: '2x+y-13=0' },
  ],
};

export const LECTURE_6: Lecture = {
  id: 'm1-l6',
  number: 6,
  title: T('Жазықтықтағы түзу. Жазықтық теңдеуіне кіріспе', 'Прямая на плоскости и уравнение плоскости', 'Lines in the plane and plane equations'),
  summary: T('Түзудің теңдеуін құрамыз, екі түзудің орналасуын анықтаймыз және нүктеден түзу мен жазықтыққа дейінгі қашықтықты табамыз.', 'Построим уравнение прямой, сравним две прямые и найдём расстояние от точки до прямой или плоскости.', 'Build a line equation, compare two lines and find the distance from a point to a line or plane.'),
  topics: [T('нормаль', 'нормаль', 'normal'), T('түзудің теңдеуі', 'уравнение прямой', 'line equation'), T('қашықтық', 'расстояние', 'distance')],
  blocks: [
    heading(T('Кесінді және екі нүкте', 'Отрезок и две точки', 'A segment and two points')),
    paragraph(T('Қашықтық $|AB|$ — $\\overrightarrow{AB}$ векторының ұзындығы. $AM:MB=m:n$ болса, $M$ координаталары $A$ мен $B$ координаталарының салмақталған орташа мәні болады.', 'Расстояние $|AB|$ равно длине вектора $\\overrightarrow{AB}$. При $AM:MB=m:n$ координаты $M$ — взвешенное среднее координат концов.', 'Distance $|AB|$ is the length of $\\overrightarrow{AB}$. If $AM:MB=m:n$, the coordinates of $M$ are a weighted average of the endpoints.' )),
    formula(tex`|AB|=\sqrt{(x_B-x_A)^2+(y_B-y_A)^2},\quad M=\frac{nA+mB}{m+n}`),
    heading(T('Түзу теңдеуінің түрлері', 'Формы уравнения прямой', 'Forms of a line equation')),
    paragraph(T('Екі әртүрлі нүкте арқылы түзу жүргізу үшін бағыттаушы векторды табамыз. Оған перпендикуляр вектор — нормаль. Тік түзу үшін $y=kx+b$ түрін қолдана алмаймыз, ал жалпы теңдеу жарайды.', 'По двум различным точкам найдите направляющий вектор. Перпендикулярный ему вектор — нормаль. Вертикальная прямая не записывается как $y=kx+b$, но описывается общим уравнением.', 'Two distinct points give a direction vector. A vector perpendicular to it is a normal. A vertical line has no slope-intercept form, but the general form still works.')),
    formula(tex`y=kx+b,\quad y-y_0=k(x-x_0),\quad Ax+By+C=0,\quad \frac{x}{a}+\frac{y}{b}=1`),
    paragraph(T('Соңғы түрді түзу осьтерді нөлден өзгеше $a$ және $b$ нүктелерінде қиғанда қолданамыз. Бірлік нормаль арқылы нормаль теңдеуін жазуға болады: $x\\cos\\alpha+y\\sin\\alpha=p$.', 'Уравнение в отрезках применяем, когда прямая отсекает на осях ненулевые отрезки $a$ и $b$. С единичной нормалью получаем нормальное уравнение $x\\cos\\alpha+y\\sin\\alpha=p$.', 'Use intercept form when the line has nonzero intercepts $a$ and $b$. With a unit normal, the normal form is $x\\cos\\alpha+y\\sin\\alpha=p$.')),
    paragraph(T('Бағыттаушы векторлар пропорционал болса, түзулер параллель немесе беттеседі. Беттесуді тексеру үшін бір түзудің нүктесін екінші теңдеуге қойыңыз. Перпендикулярлық үшін скаляр көбейтінді нөлге тең.', 'Пропорциональные направления означают параллельные или совпадающие прямые. Для различения подставьте точку одной прямой в уравнение другой. Перпендикулярность проверяется нулевым скалярным произведением направлений.', 'Proportional directions mean parallel or coincident lines. Substitute a point from one line into the other to tell them apart. Perpendicular directions have zero dot product.')),
    heading(T('Қашықтық және жазықтық нормалі', 'Расстояние и нормаль плоскости', 'Distance and plane normals')),
    paragraph(T('Нүктеден түзуге немесе жазықтыққа дейінгі ең қысқа кесінді перпендикуляр болады. Теңдеудің сол жағына нүктені қойып, модулін нормаль ұзындығына бөлеміз.', 'Кратчайший отрезок от точки до прямой или плоскости идёт по перпендикуляру. Подставляем точку в левую часть уравнения и делим модуль на длину нормали.', 'The shortest segment from a point to a line or plane is perpendicular. Substitute the point and divide the absolute result by the normal’s length.')),
    formula(tex`d_{\ell}=\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}},\qquad d_{\Pi}=\frac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}}`),
    { kind: 'visual', id: 'line-distance' },
    paragraph(T('Екі түзудің кіші бұрышы бағыттаушы векторлар арқылы, екі жазықтықтың кіші бұрышы нормальдар арқылы есептеледі. Екі жағдайда да скаляр көбейтіндінің модулін аламыз.', 'Меньший угол между прямыми находим по направлениям, а между плоскостями — по нормалям. В обоих случаях берём модуль скалярного произведения. Пропорциональные нормали дают параллельность или совпадение плоскостей, нулевое произведение — перпендикулярность.', 'Use direction vectors for the smaller angle between lines and normals for the smaller angle between planes. Take the absolute dot product in both cases. Proportional normals mean parallel or coincident planes. A zero dot product means perpendicular planes.')),
    formula(tex`\cos\varphi=\frac{|\mathbf u\cdot\mathbf v|}{|\mathbf u||\mathbf v|}`),
  ],
  practice: { sessions: '13–17', goal: T('Нүктелер бойынша теңдеу құрып, нәтижені тексеріңіз.', 'Составьте уравнение по точкам и проверьте подстановкой.', 'Construct an equation from points and check it by substitution.'), questions: [T('Тік түзудің теңдеуі қандай түрде жазылады?', 'В какой форме записать вертикальную прямую?', 'How do you write the equation of a vertical line?')], examples: [ALTITUDE_EXAMPLE] },
  selfCheck: [{ q: T('Түзудің теңдеуін екіге көбейтсек, қашықтық өзгере ме?', 'Изменится ли расстояние, если умножить уравнение прямой на два?', 'Does doubling the line equation change the distance?'), a: T('Жоқ. Алым да, бөлім де екі есе өседі.', 'Нет. Числитель и знаменатель умножатся на два.', 'No. Both numerator and denominator are multiplied by two.') }],
  test: [
    question(T('$(1,2)$ және $(3,6)$ арқылы өтетін түзудің бұрыштық коэффициенті қандай?', 'Каков наклон прямой через $(1,2)$ и $(3,6)$?', 'What is the slope through $(1,2)$ and $(3,6)$?'), [X('$2$'), X('$1/2$'), X('$4$'), X('$-2$')], X('$(6-2)/(3-1)=2$.')),
    question(T('$3x-4y+1=0$ түзуінің нормалі қандай?', 'Какая нормаль у прямой $3x-4y+1=0$?', 'What is a normal to $3x-4y+1=0$?'), [X('$(3,-4)$'), X('$(4,3)$'), X('$(3,4)$'), X('$(1,-4)$')], T('Нормаль — $x$ пен $y$ коэффициенттері.', 'Нормаль составляют коэффициенты при $x$ и $y$.', 'Use the coefficients of $x$ and $y$.')),
    question(T('$(0,0)$ нүктесінен $3x+4y-10=0$ түзуіне дейінгі қашықтық?', 'Расстояние от $(0,0)$ до $3x+4y-10=0$?', 'Distance from $(0,0)$ to $3x+4y-10=0$?'), [X('$2$'), X('$-2$'), X('$10$'), X('$5$')], X('$|-10|/\\sqrt{9+16}=2$.')),
    question(T('$y=2x+1$ түзуіне қайсысы перпендикуляр?', 'Какая прямая перпендикулярна $y=2x+1$?', 'Which line is perpendicular to $y=2x+1$?'), [X('$y=-x/2+3$'), X('$y=2x-1$'), X('$y=x/2+3$'), X('$y=-2x$')], X('$2\\cdot(-1/2)=-1$.')),
    question(T('$(1,2,5)$ нүктесінен $z=2$ жазықтығына дейінгі қашықтық?', 'Расстояние от $(1,2,5)$ до плоскости $z=2$?', 'Distance from $(1,2,5)$ to the plane $z=2$?'), [X('$3$'), X('$5$'), X('$2$'), X('$7$')], X('$d=|5-2|=3$.')),
  ],
  trainers: ['line-distance'],
  related: [{ courseId: 'linal', lessonId: 'vectors' }],
  editorNotes: ['В примере УМКД уравнение высоты приведено к общему виду с исправленным свободным членом.'],
};

const INTERSECTION_EXAMPLE: Example = {
  title: T('Түзу мен жазықтықтың қиылысуы', 'Пересечение прямой с плоскостью', 'Intersecting a line and a plane'),
  task: T('Түзудің жазықтықпен қиылысу нүктесін табыңыз.', 'Найдите точку пересечения прямой с плоскостью.', 'Find the point where the line meets the plane.'),
  given: tex`(x,y,z)=(1,0,3)+t(2,1,-1),\quad x+y+z=6`,
  steps: [
    { text: T('Координаталарды жазықтық теңдеуіне қоямыз.', 'Подставляем координаты прямой в уравнение плоскости.', 'Substitute the line coordinates into the plane equation.'), tex: '(1+2t)+t+(3-t)=6' },
    { tex: '4+2t=6\\quad\\Rightarrow\\quad t=1' },
    { tex: 'P=(3,1,2),\\qquad 3+1+2=6' },
  ],
  added: true,
};

export const LECTURE_7: Lecture = {
  id: 'm1-l7',
  number: 7,
  title: T('Кеңістіктегі түзу мен жазықтық', 'Прямая и плоскость в пространстве', 'Lines and planes in space'),
  summary: T('Екі нүкте бойынша түзу, үш нүкте бойынша жазықтық құрамыз. Олардың қиылысуын және арасындағы бұрышты табамыз.', 'Зададим прямую по двум точкам, плоскость по трём и найдём их пересечение и угол.', 'Construct a line from two points, a plane from three, and find their intersection and angle.'),
  topics: [T('параметрлік теңдеу', 'параметрическое уравнение', 'parametric equation'), T('қиылысу', 'пересечение', 'intersection'), T('бұрыш', 'угол', 'angle')],
  blocks: [
    heading(T('Түзудің теңдеуі', 'Как задать прямую', 'Describing a line')),
    paragraph(T('Түзуге бір нүкте және нөлдік емес бағыт жеткілікті. Екі нүкте берілсе, бағытты олардың айырмасынан табамыз. Жалпы түрде кеңістіктегі түзу — нормальдары пропорционал емес екі жазықтықтың қиылысуы.', 'Прямую задают точка и ненулевое направление. Если даны две точки, направление равно их разности. В общем виде пространственная прямая — пересечение двух плоскостей с непропорциональными нормалями.', 'A point and a nonzero direction determine a line. Two points supply the direction by subtraction. A line can also be specified by two intersecting planes with nonproportional normals.')),
    formula(tex`\mathbf r=\mathbf r_0+t\mathbf v,\quad (x,y,z)=(x_0+tu,\,y_0+tv,\,z_0+tw)`),
    formula(tex`\frac{x-x_0}{u}=\frac{y-y_0}{v}=\frac{z-z_0}{w}`),
    paragraph(T('Бағыт координатасы нөл болса, канондық түрде бөлмейміз: сәйкес координата тұрақты. Мысалы, $w=0$ болса, $z=z_0$. Параметрлік түрде бұл автоматты түрде орындалады.', 'Если компонента направления нулевая, в канонической форме вместо деления записываем постоянную координату. При $w=0$ имеем $z=z_0$. Параметрическая форма работает сразу.', 'A zero direction component gives a constant coordinate instead of a quotient in symmetric form. When $w=0$, use $z=z_0$. The parametric form works directly.')),
    paragraph(T('Пропорционал бағыттар параллельдікті білдіреді, ал нөлдік скаляр көбейтінді бағыттардың ортогоналдығын білдіреді. Кеңістікте параллель емес түзулер қиылыспай, айқас болуы мүмкін. Қиылысуды екі параметр арқылы тексереміз.', 'Пропорциональные направления означают параллельность направлений. Нулевое скалярное произведение означает ортогональные направления. В пространстве непараллельные прямые могут быть скрещивающимися. Проверяем пересечение равенством координат с двумя параметрами.', 'Proportional directions are parallel and a zero dot product gives orthogonal directions. In space, nonparallel lines can be skew. To check intersection, equate the coordinates using two parameters.')),
    heading(T('Жазықтықты құру', 'Построение плоскости', 'Constructing a plane')),
    paragraph(T('Жазықтық нүктесі мен нормалі арқылы анықталады. Бір түзуде жатпайтын үш нүктеден нормальды екі бағыттың векторлық көбейтіндісі арқылы табамыз.', 'Плоскость определяют точка и нормаль. Для трёх неколлинеарных точек нормаль — векторное произведение двух направлений между ними.', 'A point and a normal determine a plane. For three noncollinear points, cross two directions between them to obtain the normal.')),
    formula(tex`\mathbf n=\overrightarrow{AB}\times\overrightarrow{AC},\quad \mathbf n\cdot(\mathbf r-\mathbf r_A)=0,\quad Ax+By+Cz+D=0`),
    paragraph(T('Жазықтық барлық осьті нөлден өзгеше нүктелерде қиғанда кесінділік түрін қолданамыз. Нормаль түрін алу үшін коэффициенттерді нормаль ұзындығына бөлеміз.', 'Если все три пересечения с осями ненулевые, используем форму в отрезках. Для нормальной формы делим коэффициенты на длину нормали и при необходимости меняем общий знак.', 'Use intercept form when all three axis intercepts are nonzero. For normal form, divide by the normal length and reverse the overall sign if necessary.')),
    formula(tex`\frac{x}{a}+\frac{y}{b}+\frac{z}{c}=1`),
    heading(T('Қиылысу және бұрыш', 'Пересечение и угол', 'Intersection and angle')),
    paragraph(T('Түзуді жазықтық теңдеуіне қойғанда $t$ үшін сызықтық теңдеу шығады. Параметр коэффициенті нөл емес болса, бір қиылысу нүктесі бар. Ол нөл болса, түзу жазықтықта жатады немесе жазықтыққа параллель және онымен қиылыспайды.', 'Подстановка прямой в уравнение плоскости даёт линейное уравнение на $t$. Ненулевой коэффициент при $t$ даёт одну точку пересечения. При нулевом коэффициенте прямая лежит в плоскости или параллельна ей без общих точек.', 'Substituting the line into the plane gives a linear equation in $t$. A nonzero coefficient yields one intersection. Otherwise the line lies in the plane or is parallel with no intersection.')),
    formula(tex`\sin\varphi=\frac{|\mathbf v\cdot\mathbf n|}{|\mathbf v||\mathbf n|},\quad 0^\circ\le\varphi\le90^\circ`),
    { kind: 'visual', id: 'plane-line' },
    paragraph(T('Түзу мен жазықтық бұрышы — түзу мен нормаль арасындағы кіші бұрышты $90^\\circ$-қа толықтыратын бұрыш.', 'Угол прямой с плоскостью дополняет меньший угол прямой с нормалью до $90^\\circ$. Поэтому в формуле стоит синус.', 'The line–plane angle is the complement of the smaller angle between the line and the normal, so the formula uses sine.')),
  ],
  practice: { sessions: '13–17', goal: T('Параметрді табу арқылы қиылысу нүктесін есептеңіз.', 'Найдите пересечение через параметр прямой.', 'Find the intersection through the line parameter.'), questions: [T('Қай кезде түзудің жазықтықпен ортақ нүктесі болмайды?', 'Когда у прямой и плоскости нет общих точек?', 'When do a line and a plane have no point in common?')], examples: [INTERSECTION_EXAMPLE] },
  selfCheck: [{ q: T('$\\mathbf v\\cdot\\mathbf n=0$ болса, түзу міндетті түрде жазықтықта жата ма?', 'Обязательно ли прямая лежит в плоскости, если $\\mathbf v\\cdot\\mathbf n=0$?', 'Does $\\mathbf v\\cdot\\mathbf n=0$ guarantee that the line lies in the plane?'), a: T('Жоқ. Түзудің бір нүктесін жазықтық теңдеуіне қойыңыз.', 'Нет. Нужно проверить подстановкой одной точки прямой.', 'No. Check a point of the line in the plane equation.') }],
  test: [
    question(T('$(x,y,z)=(1,2,3)+t(2,-1,0)$ түзуінде қандай координата тұрақты?', 'Какая координата постоянна у прямой $(x,y,z)=(1,2,3)+t(2,-1,0)$?', 'Which coordinate is constant on $(x,y,z)=(1,2,3)+t(2,-1,0)$?'), [X('$z=3$'), X('$x=1$'), X('$y=2$'), X('$z=0$')], T('$t$ алдында $z$ координатасында нөл тұр.', 'У параметра в координате $z$ коэффициент ноль.', 'The parameter coefficient in $z$ is zero.')),
    question(T('$(0,1,0)+t(1,0,2)$ түзуі $z=4$ жазықтығын қай нүктеде қияды?', 'Где прямая $(0,1,0)+t(1,0,2)$ пересекает $z=4$?', 'Where does $(0,1,0)+t(1,0,2)$ meet $z=4$?'), [X('$(2,1,4)$'), X('$(4,1,2)$'), X('$(2,0,4)$'), X('$(0,1,4)$')], X('$2t=4\\Rightarrow t=2$.')),
    question(T('$x+2y-3z+4=0$ жазықтығының нормалі?', 'Нормаль плоскости $x+2y-3z+4=0$?', 'A normal to $x+2y-3z+4=0$?'), [X('$(1,2,-3)$'), X('$(1,2,4)$'), X('$(1,-2,3)$'), X('$(2,-3,4)$')], T('Координаталардың коэффициенттерін аламыз.', 'Берём коэффициенты при координатах.', 'Use the coordinate coefficients.')),
    question(T('$(1,0,0)$ бағыты бар түзу $z=0$ жазықтығымен қандай бұрыш жасайды?', 'Каков угол прямой с направлением $(1,0,0)$ к плоскости $z=0$?', 'What angle does direction $(1,0,0)$ make with plane $z=0$?'), [X('$0^\\circ$'), X('$30^\\circ$'), X('$45^\\circ$'), X('$90^\\circ$')], X('$(1,0,0)\\cdot(0,0,1)=0\\Rightarrow\\sin\\varphi=0$.')),
    question(T('$(0,0,3)+t(1,0,0)$ түзуінің $z=0$ жазықтығымен неше ортақ нүктесі бар?', 'Сколько общих точек у прямой $(0,0,3)+t(1,0,0)$ с $z=0$?', 'How many points does $(0,0,3)+t(1,0,0)$ share with $z=0$?'), [X('$0$'), X('$1$'), X('$2$'), T('Шексіз көп', 'Бесконечно много', 'Infinitely many')], T('Түзудің барлық нүктесінде $z=3$.', 'На всей прямой $z=3$.', 'Every point on the line has $z=3$.')),
  ],
  trainers: ['plane-intersection'],
  related: [{ courseId: 'linal', lessonId: 'vectors' }],
};

const HYPERBOLA_EXAMPLE: Example = {
  title: T('Гиперболаны канондық түрге келтіру', 'Приведение гиперболы к каноническому виду', 'Reducing a hyperbola to standard form'),
  task: T('Жарты осьтерін, фокустарын, эксцентриситетін, асимптоталары мен директрисаларын табыңыз.', 'Найдите полуоси, фокусы, эксцентриситет, асимптоты и директрисы.', 'Find the semiaxes, foci, eccentricity, asymptotes and directrices.'),
  given: '9x^2-16y^2=144',
  steps: [
    { text: T('Теңдеуді 144-ке бөлеміз.', 'Делим уравнение на 144.', 'Divide the equation by 144.'), tex: tex`\frac{x^2}{16}-\frac{y^2}{9}=1,\quad a=4,\ b=3` },
    { tex: tex`c=\sqrt{a^2+b^2}=5,\quad F_{1,2}=(\pm5,0),\quad e=c/a=5/4` },
    { tex: tex`y=\pm\frac34 x,\quad x=\pm\frac{a^2}{c}=\pm\frac{16}{5}` },
  ],
  added: true,
};

const SPHERE_EXAMPLE: Example = {
  title: T('Сфера теңдеуі', 'Уравнение сферы по центру и точке', 'A sphere through a point'),
  task: T('Центрі $C$ және $P$ нүктесі арқылы өтетін сфера теңдеуін жазыңыз.', 'Запишите уравнение сферы с центром $C$, проходящей через $P$.', 'Write the sphere equation with center $C$ and passing through $P$.'),
  given: 'C=(-1,2,0),\\quad P=(1,3,2)',
  steps: [{ tex: 'R^2=|CP|^2=2^2+1^2+2^2=9' }, { tex: '(x+1)^2+(y-2)^2+z^2=9' }],
  added: true,
};

export const LECTURE_8: Lecture = {
  id: 'm1-l8',
  number: 8,
  title: T('Екінші ретті қисықтар мен беттер', 'Кривые и поверхности второго порядка', 'Conic sections and quadric surfaces'),
  summary: T('Теңдеу арқылы шеңберді, эллипсті, гиперболаны және параболаны танимыз. Жазықтықтан кеңістікке өтеміз.', 'Научимся распознавать окружность, эллипс, гиперболу и параболу по уравнению. Перейдём от плоскости к пространству.', 'Recognize circles, ellipses, hyperbolas and parabolas from their equations, then move from curves to surfaces.'),
  topics: [T('коника', 'конические сечения', 'conic sections'), T('полярлық координаталар', 'полярные координаты', 'polar coordinates'), T('екінші ретті беттер', 'квадрики', 'quadrics')],
  blocks: [
    heading(T('Жалпы теңдеу және шеңбер', 'Общее уравнение и окружность', 'General equation and the circle')),
    paragraph(T('Екінші ретті теңдеуде кемінде бір квадраттық коэффициент нөлден өзгеше. Қисық азғындамаған болса, $B^2-4AC$ таңбасы оның түрін береді: теріс — эллипстік, нөл — параболалық, оң — гиперболалық.', 'В уравнении второй степени хотя бы один квадратичный коэффициент ненулевой. Для невырожденной вещественной кривой знак $B^2-4AC$ задаёт тип: минус — эллиптический, ноль — параболический, плюс — гиперболический.', 'At least one quadratic coefficient is nonzero. For a nondegenerate real conic, the sign of $B^2-4AC$ gives the type: negative for ellipse, zero for parabola, positive for hyperbola.')),
    formula('Ax^2+Bxy+Cy^2+Dx+Ey+F=0'),
    paragraph(T('Шеңбердің барлық нүктесі центрден бірдей қашықтықта. Центрді табу үшін толық квадраттарды бөліп алыңыз.', 'Точки окружности равноудалены от центра. Чтобы найти центр из раскрытого уравнения, выделите полные квадраты.', 'Points on a circle are equidistant from its center. Complete the squares to recover the center from the expanded equation.')),
    formula('(x-h)^2+(y-k)^2=R^2'),
    heading(T('Канондық түрлер', 'Канонические формы', 'Standard forms')),
    paragraph(T('Эллипс үшін екі фокусқа дейінгі қашықтықтардың қосындысы тұрақты. $a\\ge b>0$ болғанда фокустар $x$ осінде, $c^2=a^2-b^2$.', 'На эллипсе сумма расстояний до двух фокусов постоянна. При $a\\ge b>0$ фокусы на оси $x$, $c^2=a^2-b^2$.', 'The sum of distances to the two foci is constant on an ellipse. For $a\\ge b>0$ the foci lie on the $x$-axis and $c^2=a^2-b^2$.')),
    formula(tex`\frac{x^2}{a^2}+\frac{y^2}{b^2}=1,\quad F_{1,2}=(\pm c,0),\quad e=c/a`),
    paragraph(T('Гипербола үшін фокустарға дейінгі қашықтықтардың айырмасының модулі тұрақты. Төбелер $(\\pm a,0)$, ал $c^2=a^2+b^2$.', 'На гиперболе постоянен модуль разности расстояний до фокусов. Вершины $(\\pm a,0)$, а $c^2=a^2+b^2$.', 'The absolute difference of focal distances is constant on a hyperbola. The vertices are $(\\pm a,0)$ and $c^2=a^2+b^2$.')),
    formula(tex`\frac{x^2}{a^2}-\frac{y^2}{b^2}=1,\quad y=\pm\frac ba x,\quad F_{1,2}=(\pm c,0)`),
    paragraph(T('Параболаның әр нүктесі фокус пен директрисадан бірдей қашықтықта. $p>0$ болса, берілген түр оңға ашылады.', 'Каждая точка параболы равноудалена от фокуса и директрисы. При $p>0$ указанная форма раскрывается вправо.', 'Every point of a parabola is equidistant from the focus and directrix. With $p>0$ this form opens to the right.')),
    formula(tex`y^2=4px,\quad F=(p,0),\quad x=-p`),
    { kind: 'visual', id: 'conics' },
    heading(T('Полярлық координаталар', 'Полярные координаты', 'Polar coordinates')),
    paragraph(T('Нүкте полюстен қашықтықпен $r\\ge 0$ және полярлық бұрышпен $\\theta$ беріледі. Бұрышты ширекті ескеріп таңдаңыз.', 'Точка задаётся расстоянием $r\\ge 0$ от полюса и углом $\\theta$. При обратном переходе учитывайте четверть.', 'Use the distance $r\\ge 0$ from the pole and the angle $\\theta$. Account for the quadrant when converting back.')),
    formula(tex`x=r\cos\theta,\quad y=r\sin\theta,\quad r=\sqrt{x^2+y^2}`),
    heading(T('Кеңістіктегі екінші ретті беттер', 'Поверхности второго порядка', 'Quadric surfaces')),
    paragraph(T('Бетті тану үшін оның $z=\\text{const}$ қималарын салыстырыңыз. Эллипсоидтың қималары шектеулі, цилиндрдікі өзгермейді, ал конус қимасының өлшемі төбеден алыстаған сайын артады.', 'Распознавайте поверхности по сечениям $z=\\text{const}$. Сечения эллипсоида ограничены, у цилиндра остаются одинаковыми, у конуса растут по мере удаления от вершины.', 'Recognize surfaces by comparing $z=\\text{const}$ sections. Ellipsoid sections are bounded, cylinder sections stay the same, and cone sections grow away from the apex.')),
    formula(tex`\text{Sphere: } (x-h)^2+(y-k)^2+(z-l)^2=R^2`),
    formula(tex`\frac{x^2}{a^2}+\frac{y^2}{b^2}+\frac{z^2}{c^2}=1,\quad \frac{x^2}{a^2}+\frac{y^2}{b^2}=1,\quad \frac{x^2}{a^2}+\frac{y^2}{b^2}=\frac{z^2}{c^2}`),
    paragraph(T('Солдан оңға: эллипсоид, эллипстік цилиндр, конус. Төменде бір қуысты және екі қуысты гиперболоидтар берілген.', 'Слева направо — эллипсоид, эллиптический цилиндр, конус. Ниже — однополостный и двуполостный гиперболоиды.', 'From left to right: ellipsoid, elliptic cylinder, cone. Below are hyperboloids of one and two sheets.')),
    formula(tex`\frac{x^2}{a^2}+\frac{y^2}{b^2}-\frac{z^2}{c^2}=1,\quad \frac{z^2}{c^2}-\frac{x^2}{a^2}-\frac{y^2}{b^2}=1`),
    paragraph(T('Эллипстік параболоидтың көлденең қимасы — эллипс, гиперболалық параболоидтыкі — гипербола (нөлдік биіктікте — екі түзу).', 'Горизонтальные сечения эллиптического параболоида — эллипсы при положительной высоте, у гиперболического — гиперболы, а на нулевой высоте — две прямые.', 'Positive-height sections of the elliptic paraboloid are ellipses. Horizontal sections of the hyperbolic paraboloid are hyperbolas, with two lines at height zero.')),
    formula(tex`z=\frac{x^2}{a^2}+\frac{y^2}{b^2},\quad z=\frac{x^2}{a^2}-\frac{y^2}{b^2}`),
  ],
  practice: { sessions: '13–17', goal: T('Теңдеуді канондық түрге келтіріп, параметрлерді оқыңыз.', 'Приведите уравнение к каноническому виду и определите параметры.', 'Reduce the equation to standard form and read off its parameters.'), questions: [T('Гиперболаның асимптоталарын қалай табамыз?', 'Как найти асимптоты гиперболы?', 'How do you find the asymptotes of a hyperbola?')], examples: [HYPERBOLA_EXAMPLE, SPHERE_EXAMPLE] },
  selfCheck: [{ q: T('$x^2+y^2=9$ кеңістікте қандай бетті береді?', 'Какую поверхность задаёт $x^2+y^2=9$ в пространстве?', 'What surface is $x^2+y^2=9$ in space?'), a: T('Радиусы 3 цилиндр. $z$ координатасы еркін.', 'Цилиндр радиуса 3. Координата $z$ свободна.', 'A cylinder of radius 3. The $z$ coordinate is free.') }],
  test: [
    question(T('$(x+2)^2+(y-3)^2=16$ шеңберінің центрі мен радиусы?', 'Центр и радиус окружности $(x+2)^2+(y-3)^2=16$?', 'Center and radius of $(x+2)^2+(y-3)^2=16$?'), [X('$(-2,3),\\ R=4$'), X('$(2,-3),\\ R=4$'), X('$(-2,3),\\ R=16$'), X('$(2,3),\\ R=4$')], X('$x-h=x+2\\Rightarrow h=-2,\\quad R=\\sqrt{16}=4$.')),
    question(T('$x^2/25+y^2/9=1$ эллипсінің фокустары?', 'Фокусы эллипса $x^2/25+y^2/9=1$?', 'Foci of $x^2/25+y^2/9=1$?'), [X('$(\\pm4,0)$'), X('$(0,\\pm4)$'), X('$(\\pm5,0)$'), X('$(\\pm\\sqrt{34},0)$')], X('$c=\\sqrt{25-9}=4$.')),
    question(T('$x^2/9-y^2/4=1$ гиперболасының асимптоталары?', 'Асимптоты гиперболы $x^2/9-y^2/4=1$?', 'Asymptotes of $x^2/9-y^2/4=1$?'), [X('$y=\\pm2x/3$'), X('$y=\\pm3x/2$'), X('$y=\\pm x$'), X('$x=\\pm3$')], X('$y=\\pm (b/a)x$, $a=3$, $b=2$.')),
    question(T('$y^2=12x$ параболасының фокусы?', 'Фокус параболы $y^2=12x$?', 'Focus of $y^2=12x$?'), [X('$(3,0)$'), X('$(12,0)$'), X('$(0,3)$'), X('$(-3,0)$')], X('$4p=12\\Rightarrow p=3$.')),
    question(T('$r=2$, $\\theta=\\pi/2$ нүктесінің декарт координаталары?', 'Декартовы координаты точки $r=2$, $\\theta=\\pi/2$?', 'Cartesian coordinates for $r=2$, $\\theta=\\pi/2$?'), [X('$(0,2)$'), X('$(2,0)$'), X('$(-2,0)$'), X('$(0,-2)$')], X('$(2\\cos(\\pi/2),2\\sin(\\pi/2))=(0,2)$.')),
    question(T('$x^2+y^2=4$ кеңістікте нені береді?', 'Какую поверхность задаёт $x^2+y^2=4$ в пространстве?', 'What surface is $x^2+y^2=4$ in space?'), [T('Цилиндр', 'Цилиндр', 'Cylinder'), T('Сфера', 'Сфера', 'Sphere'), T('Конус', 'Конус', 'Cone'), T('Жазықтық', 'Плоскость', 'Plane')], T('$z$ шектелмейді, сондықтан әр деңгейде радиусы 2 шеңбер бар.', 'На любой высоте $z$ получается окружность радиуса 2.', 'At every height $z$, the section is a circle of radius 2.')),
  ],
  trainers: ['conic-parameters'],
  related: [{ courseId: 'algebra', lessonId: 'quadratic' }],
};
