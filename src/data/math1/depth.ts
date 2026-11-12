import { DeepDive, TestQuestion } from './types';

export const MATH1_DEPTH_TESTS: Record<number, TestQuestion> = {
  "1": {
    "q": {
      "ru": "В произведении AB какое преобразование действует первым?",
      "kz": "AB көбейтіндісінде қай түрлендіру бірінші орындалады?",
      "en": "In the product AB, which transformation acts first?"
    },
    "options": [
      {
        "ru": "B",
        "kz": "B",
        "en": "B"
      },
      {
        "ru": "A",
        "kz": "A",
        "en": "A"
      },
      {
        "ru": "Всегда одновременно",
        "kz": "Әрқашан бір мезгілде",
        "en": "Always simultaneously"
      }
    ],
    "correct": 0,
    "explain": {
      "ru": "ABv = A(Bv). Сначала вычисляем Bv, затем применяем A.",
      "kz": "ABv = A(Bv). Алдымен Bv есептеліп, кейін A қолданылады.",
      "en": "ABv = A(Bv). Compute Bv first, then apply A."
    }
  },
  "2": {
    "q": {
      "ru": "Все элементы матрицы 3×3 умножили на 2. Во сколько раз изменился её определитель?",
      "kz": "3×3 матрицасының барлық элементі 2-ге көбейтілді. Анықтауышы неше есе өзгерді?",
      "en": "Every entry of a 3×3 matrix is doubled. By what factor does its determinant change?"
    },
    "options": [
      {
        "ru": "8",
        "kz": "8",
        "en": "8"
      },
      {
        "ru": "2",
        "kz": "2",
        "en": "2"
      },
      {
        "ru": "6",
        "kz": "6",
        "en": "6"
      }
    ],
    "correct": 0,
    "explain": {
      "ru": "Каждая из трёх строк даёт множитель 2. Получаем 2³ = 8.",
      "kz": "Үш жолдың әрқайсысы 2 көбейткішін береді. 2³ = 8.",
      "en": "Each of the three rows contributes a factor of 2, giving 2³ = 8."
    }
  },
  "3": {
    "q": {
      "ru": "Совместная система с четырьмя неизвестными имеет ранг 2. Сколько свободных переменных?",
      "kz": "Төрт белгісізі бар үйлесімді жүйенің рангі 2. Неше еркін айнымалы бар?",
      "en": "A consistent system with four unknowns has rank 2. How many variables are free?"
    },
    "options": [
      {
        "ru": "2",
        "kz": "2",
        "en": "2"
      },
      {
        "ru": "0",
        "kz": "0",
        "en": "0"
      },
      {
        "ru": "4",
        "kz": "4",
        "en": "4"
      }
    ],
    "correct": 0,
    "explain": {
      "ru": "Ведущих переменных две. Остальные 4 − 2 = 2 можно выбрать свободно.",
      "kz": "Екі жетекші айнымалы бар. Қалған 4 − 2 = 2 айнымалы еркін таңдалады.",
      "en": "There are two pivot variables, leaving 4 − 2 = 2 free variables."
    }
  },
  "4": {
    "q": {
      "ru": "Найдите единичный вектор в направлении (0,−3,4).",
      "kz": "(0,−3,4) бағытындағы бірлік векторды табыңыз.",
      "en": "Find the unit vector in direction (0,−3,4)."
    },
    "options": [
      {
        "ru": "$(0,-3/5,4/5)$",
        "kz": "$(0,-3/5,4/5)$",
        "en": "$(0,-3/5,4/5)$"
      },
      {
        "ru": "$(0,-1,1)$",
        "kz": "$(0,-1,1)$",
        "en": "$(0,-1,1)$"
      },
      {
        "ru": "$(0,3/5,-4/5)$",
        "kz": "$(0,3/5,-4/5)$",
        "en": "$(0,3/5,-4/5)$"
      }
    ],
    "correct": 0,
    "explain": {
      "ru": "Длина равна 5. Делим каждую координату на 5, сохраняя направление.",
      "kz": "Ұзындығы 5. Бағытты сақтап, әр координатаны 5-ке бөлеміз.",
      "en": "Its length is 5. Divide every component by 5 to preserve the direction."
    }
  },
  "5": {
    "q": {
      "ru": "Смешанное произведение трёх рёбер тетраэдра из одной вершины равно −18. Найдите объём.",
      "kz": "Тетраэдрдің бір төбеден шыққан үш қырының аралас көбейтіндісі −18. Көлемін табыңыз.",
      "en": "The triple product of three tetrahedron edges from one vertex is −18. Find its volume."
    },
    "options": [
      {
        "ru": "3",
        "kz": "3",
        "en": "3"
      },
      {
        "ru": "18",
        "kz": "18",
        "en": "18"
      },
      {
        "ru": "−3",
        "kz": "−3",
        "en": "−3"
      }
    ],
    "correct": 0,
    "explain": {
      "ru": "Берём модуль смешанного произведения и делим на 6. Получаем 18 / 6 = 3.",
      "kz": "Аралас көбейтіндінің модулін 6-ға бөлеміз. 18 / 6 = 3.",
      "en": "Take the absolute triple product and divide by 6, giving 18 / 6 = 3."
    }
  },
  "6": {
    "q": {
      "ru": "Какая точка является основанием перпендикуляра из (0,0) на прямую x + y = 4?",
      "kz": "(0,0) нүктесінен x + y = 4 түзуіне түсірілген перпендикулярдың табаны қай нүкте?",
      "en": "Which point is the perpendicular foot from (0,0) onto x + y = 4?"
    },
    "options": [
      {
        "ru": "$(2,2)$",
        "kz": "$(2,2)$",
        "en": "$(2,2)$"
      },
      {
        "ru": "$(4,0)$",
        "kz": "$(4,0)$",
        "en": "$(4,0)$"
      },
      {
        "ru": "$(0,4)$",
        "kz": "$(0,4)$",
        "en": "$(0,4)$"
      }
    ],
    "correct": 0,
    "explain": {
      "ru": "Нормаль (1,1). По формуле λ = −4/2 = −2, поэтому H = (2,2).",
      "kz": "Нормаль (1,1). λ = −4/2 = −2, сондықтан H = (2,2).",
      "en": "The normal is (1,1). λ = −4/2 = −2, so H = (2,2)."
    }
  },
  "7": {
    "q": {
      "ru": "Две прямые имеют непропорциональные направления и не имеют общей точки. Как они расположены?",
      "kz": "Екі түзудің бағыттары пропорционал емес және ортақ нүктесі жоқ. Олар қалай орналасқан?",
      "en": "Two lines have nonproportional directions and no point in common. What is their relation?"
    },
    "options": [
      {
        "ru": "Скрещиваются",
        "kz": "Айқас",
        "en": "Skew"
      },
      {
        "ru": "Параллельны",
        "kz": "Параллель",
        "en": "Parallel"
      },
      {
        "ru": "Совпадают",
        "kz": "Беттеседі",
        "en": "Coincident"
      }
    ],
    "correct": 0,
    "explain": {
      "ru": "Непараллельные прямые в одной плоскости пересекаются. Отсутствие общей точки означает скрещивание.",
      "kz": "Бір жазықтықтағы параллель емес түзулер қиылысады. Ортақ нүкте болмағандықтан, олар айқас.",
      "en": "Nonparallel coplanar lines intersect. Having no common point makes these lines skew."
    }
  },
  "8": {
    "q": {
      "ru": "При каких h поверхность z² − x² − y² = 1 имеет точки в сечении z = h?",
      "kz": "z² − x² − y² = 1 бетінің z = h қимасында қандай h үшін нүктелер бар?",
      "en": "For which h does z² − x² − y² = 1 have points in the section z = h?"
    },
    "options": [
      {
        "ru": "$|h|\\ge1$",
        "kz": "$|h|\\ge1$",
        "en": "$|h|\\ge1$"
      },
      {
        "ru": "$|h|<1$",
        "kz": "$|h|<1$",
        "en": "$|h|<1$"
      },
      {
        "ru": "При любых h",
        "kz": "Кез келген h үшін",
        "en": "For every h"
      }
    ],
    "correct": 0,
    "explain": {
      "ru": "Получаем x² + y² = h² − 1. Левая часть неотрицательна, значит h² ≥ 1.",
      "kz": "x² + y² = h² − 1. Сол жақ теріс емес, демек h² ≥ 1.",
      "en": "The section is x² + y² = h² − 1. Its left side is nonnegative, so h² ≥ 1."
    }
  }
};


/** Explanations and worked applications extending lectures 1–8 of the course pack. */
export const MATH1_DEPTH: Record<number, DeepDive[]> = {
  "1": [
    {
      "id": "composition",
      "title": {
        "ru": "Почему матрицы умножают строкой на столбец",
        "kz": "Неліктен жол бағанға көбейтіледі",
        "en": "Why matrix multiplication uses rows and columns"
      },
      "summary": {
        "ru": "Свяжите правило умножения с двумя последовательными преобразованиями.",
        "kz": "Көбейту ережесін екі тізбекті түрлендірумен байланыстырыңыз.",
        "en": "Connect the multiplication rule to two successive transformations."
      },
      "blocks": [
        {
          "kind": "p",
          "text": {
            "ru": "Матрица задаёт правило получения новых координат. Первая строка сообщает, как найти первую координату результата, вторая — вторую. Каждый столбец показывает, куда переходит соответствующий единичный вектор. Поэтому размер матрицы описывает число входных и выходных координат.",
            "kz": "Матрица жаңа координаталарды есептеу ережесін береді. Бірінші жол нәтиженің бірінші координатасын, екінші жол екіншісін анықтайды. Әр баған сәйкес бірлік вектордың бейнесін көрсетеді. Матрица өлшемі кіріс пен шығыс координаталарының санын береді.",
            "en": "A matrix specifies how to compute new coordinates. Each row produces one output coordinate, and each column shows the image of a coordinate unit vector. Its dimensions describe the numbers of input and output coordinates."
          }
        },
        {
          "kind": "p",
          "text": {
            "ru": "Пусть сначала действует B, затем A. Подставьте выражения для промежуточных координат в формулы A. Коэффициент при каждой исходной координате получится суммой произведений элементов строки A и столбца B. Именно эту подстановку сокращённо записывают как AB.",
            "kz": "Алдымен B, содан кейін A әсер етсін. Аралық координаталардың өрнектерін A формулаларына қойыңыз. Әр бастапқы координатаның коэффициенті A жолы мен B бағанының сәйкес элементтері көбейтінділерінің қосындысы болады. Бұл алмастыру AB деп жазылады.",
            "en": "Apply B first, then A. Substituting the intermediate coordinates into A gives a sum of row–column products for each coefficient. The matrix AB records this substitution."
          }
        },
        {
          "kind": "formula",
          "tex": "u_i=\\sum_k a_{ik}\\Bigl(\\sum_j b_{kj}x_j\\Bigr)=\\sum_j\\Bigl(\\sum_k a_{ik}b_{kj}\\Bigr)x_j"
        },
        {
          "kind": "example",
          "example": {
            "title": {
              "ru": "Порядок преобразований",
              "kz": "Түрлендірулердің реті",
              "en": "Order of transformations"
            },
            "task": {
              "ru": "A растягивает горизонтальную координату вдвое, B поворачивает на 90° против часовой стрелки. Сравните AB и BA на векторе v.",
              "kz": "A көлденең координатаны екі есе арттырады, B сағат тіліне қарсы 90° бұрады. v векторындағы AB мен BA нәтижелерін салыстырыңыз.",
              "en": "A doubles the horizontal coordinate and B rotates 90° counterclockwise. Compare AB and BA on v."
            },
            "given": "A=\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix},\\quad B=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix},\\quad v=\\binom10",
            "steps": [
              {
                "text": {
                  "ru": "Сначала поворот, затем растяжение.",
                  "kz": "Алдымен бұру, содан кейін созу.",
                  "en": "Rotate first, then stretch."
                },
                "tex": "Bv=\\binom01,\\quad A(Bv)=\\binom01"
              },
              {
                "text": {
                  "ru": "При обратном порядке растягивается исходный вектор.",
                  "kz": "Кері ретте бастапқы вектор созылады.",
                  "en": "In the reverse order the original vector is stretched."
                },
                "tex": "Av=\\binom20,\\quad B(Av)=\\binom02"
              },
              {
                "tex": "AB=\\begin{pmatrix}0&-2\\\\1&0\\end{pmatrix}\\ne BA=\\begin{pmatrix}0&-1\\\\2&0\\end{pmatrix}"
              }
            ],
            "added": true
          }
        },
        {
          "kind": "note",
          "tone": "warn",
          "text": {
            "ru": "Перед вычислением запишите размеры и порядок действий. В AB первым действует B. Поэлементное умножение даёт другую операцию.",
            "kz": "Есептеуден бұрын өлшемдер мен әрекеттер ретін жазыңыз. AB ішінде B бірінші әсер етеді. Элементтерді жеке-жеке көбейту басқа амал береді.",
            "en": "Write down dimensions and order first. In AB, B acts first. Multiplying corresponding entries gives a different operation."
          }
        }
      ]
    }
  ],
  "2": [
    {
      "id": "det-area",
      "title": {
        "ru": "Определитель, площадь и обратимость",
        "kz": "Анықтауыш, аудан және кері матрица",
        "en": "Determinants, area and invertibility"
      },
      "summary": {
        "ru": "Поймите геометрический смысл нулевого определителя и проверьте обратную матрицу.",
        "kz": "Нөлдік анықтауыштың геометриялық мағынасын түсініп, кері матрицаны тексеріңіз.",
        "en": "Understand zero determinants geometrically and verify an inverse."
      },
      "blocks": [
        {
          "kind": "p",
          "text": {
            "ru": "Столбцы матрицы 2×2 — образы единичных векторов. Они натягивают параллелограмм, площадь которого равна модулю определителя. Знак показывает ориентацию. Перестановка столбцов меняет ориентацию, поэтому определитель меняет знак. Умножение одного столбца на k умножает определитель на k.",
            "kz": "2×2 матрицасының бағандары бірлік векторлардың бейнелері. Оларға салынған параллелограмм ауданы анықтауыш модуліне тең. Таңба бағдарды көрсетеді. Бағандарды ауыстыру бағдар мен анықтауыш таңбасын өзгертеді. Бір бағанды k санына көбейту анықтауышты да k есе өзгертеді.",
            "en": "The columns of a 2×2 matrix are the images of the unit vectors. They span a parallelogram whose area is the absolute determinant. Its sign describes orientation. Swapping columns reverses the sign, and scaling one column by k scales the determinant by k."
          }
        },
        {
          "kind": "p",
          "text": {
            "ru": "При нулевом определителе столбцы зависимы. Плоскость сжимается в прямую или точку, разные входы дают один выход. Восстановить каждый вход однозначно нельзя. Для ненулевого определителя формулу обратной матрицы проверяем прямым умножением.",
            "kz": "Анықтауыш нөл болса, бағандар тәуелді. Жазықтық түзуге не нүктеге сығылады, әртүрлі кірістер бірдей нәтиже береді. Әр кірісті бірмәнді қалпына келтіру мүмкін болмайды. Анықтауыш нөлден өзгеше болса, кері матрицаны тікелей көбейтіп тексереміз.",
            "en": "A zero determinant means dependent columns. The plane collapses into a line or point and distinct inputs share an output, preventing unique recovery. With a nonzero determinant, verify the inverse formula by multiplication."
          }
        },
        {
          "kind": "formula",
          "tex": "\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}=(ad-bc)I"
        },
        {
          "kind": "example",
          "example": {
            "title": {
              "ru": "Проверка обратной матрицы",
              "kz": "Кері матрицаны тексеру",
              "en": "Checking an inverse"
            },
            "task": {
              "ru": "Найдите обратную матрицу и убедитесь, что она возвращает исходные координаты.",
              "kz": "Кері матрицаны тауып, бастапқы координаталарды қайтаратынын тексеріңіз.",
              "en": "Find the inverse and check that it recovers the original coordinates."
            },
            "given": "A=\\begin{pmatrix}2&1\\\\1&1\\end{pmatrix}",
            "steps": [
              {
                "tex": "\\det A=2\\cdot1-1\\cdot1=1"
              },
              {
                "tex": "A^{-1}=\\begin{pmatrix}1&-1\\\\-1&2\\end{pmatrix}"
              },
              {
                "tex": "AA^{-1}=\\begin{pmatrix}2-1&-2+2\\\\1-1&-1+2\\end{pmatrix}=I"
              }
            ],
            "added": true
          }
        },
        {
          "kind": "note",
          "tone": "warn",
          "text": {
            "ru": "Если умножить всю матрицу n×n на k, определитель умножится на kⁿ. Это отличается от изменения одного столбца.",
            "kz": "n×n матрицасын түгел k санына көбейтсек, анықтауыш kⁿ есе өзгереді. Бір ғана бағанды өзгерту бөлек жағдай.",
            "en": "Scaling the whole n×n matrix by k scales its determinant by kⁿ. Scaling a single column is a different case."
          }
        }
      ]
    }
  ],
  "3": [
    {
      "id": "rank-solutions",
      "title": {
        "ru": "Как ранг определяет число решений",
        "kz": "Ранг шешімдер санын қалай анықтайды",
        "en": "How rank determines the number of solutions"
      },
      "summary": {
        "ru": "Различайте несовместную систему, единственное решение и свободные переменные.",
        "kz": "Үйлесімсіз жүйені, жалғыз шешімді және еркін айнымалыларды ажыратыңыз.",
        "en": "Distinguish inconsistency, a unique solution and free variables."
      },
      "blocks": [
        {
          "kind": "p",
          "text": {
            "ru": "Строковые преобразования заменяют уравнения равносильными комбинациями. Перестановку можно отменить, умножение на ненулевое число обратить, прибавленное кратное другого уравнения вычесть. Поэтому множество решений сохраняется. Преобразовывать нужно и коэффициенты, и правую часть.",
            "kz": "Жол түрлендірулері теңдеулерді мәндес комбинациялармен алмастырады. Жолдарды ауыстыруды кері қайтаруға, нөлдік емес санға көбейтуді бөлу арқылы жоюға, қосылған теңдеуді азайтуға болады. Сондықтан шешімдер жиыны сақталады. Коэффициенттер мен оң жақты бірге түрлендіру керек.",
            "en": "Row operations are reversible combinations of equations. You can undo a swap, divide by a nonzero scale or subtract an added multiple. They preserve the solution set when applied to both the coefficients and the right-hand side."
          }
        },
        {
          "kind": "p",
          "text": {
            "ru": "В ступенчатой форме строка 0 = c при c ≠ 0 означает противоречие. При её отсутствии каждый ведущий элемент определяет одну переменную через остальные. Если неизвестных n и ведущих элементов r, остаётся n − r свободных переменных. Ранг расширенной матрицы учитывает правую часть и обнаруживает противоречие.",
            "kz": "Сатылы түрде c ≠ 0 болғандағы 0 = c жолы қайшылықты білдіреді. Қайшылық болмаса, әр жетекші элемент бір айнымалыны қалғандары арқылы анықтайды. n белгісіз бен r жетекші элемент болса, n − r еркін айнымалы қалады. Кеңейтілген матрица рангі оң жақты ескеріп, қайшылықты анықтайды.",
            "en": "In echelon form, a row 0 = c with c ≠ 0 is a contradiction. Otherwise each pivot determines one variable in terms of the others. With n unknowns and r pivots there are n − r free variables. The augmented rank accounts for the right-hand side and detects inconsistency."
          }
        },
        {
          "kind": "example",
          "example": {
            "title": {
              "ru": "Один коэффициент — три случая",
              "kz": "Бір коэффициент және үш жағдай",
              "en": "One coefficient, three cases"
            },
            "task": {
              "ru": "Определите число решений в зависимости от a и b.",
              "kz": "a мен b мәндеріне қарай шешімдер санын анықтаңыз.",
              "en": "Classify the solution set depending on a and b."
            },
            "given": "\\begin{cases}x+y=2\\\\2x+ay=b\\end{cases}",
            "steps": [
              {
                "text": {
                  "ru": "Вычитаем из второй строки удвоенную первую.",
                  "kz": "Екінші жолдан екі еселенген бірінші жолды азайтамыз.",
                  "en": "Subtract twice the first row from the second."
                },
                "tex": "(a-2)y=b-4"
              },
              {
                "text": {
                  "ru": "При a ≠ 2 решение единственное.",
                  "kz": "a ≠ 2 болса, шешім жалғыз.",
                  "en": "For a ≠ 2 the solution is unique."
                },
                "tex": "y=\\frac{b-4}{a-2},\\quad x=2-y"
              },
              {
                "text": {
                  "ru": "При a = 2, b = 4 параметр y свободен. При a = 2, b ≠ 4 получаем противоречие.",
                  "kz": "a = 2, b = 4 болса, y еркін параметр. a = 2, b ≠ 4 болса, қайшылық шығады.",
                  "en": "When a = 2 and b = 4, y is free. When a = 2 and b ≠ 4, there is a contradiction."
                },
                "tex": "(x,y)=(2-t,t)\\quad (a=2,\\ b=4)"
              }
            ],
            "added": true
          }
        },
        {
          "kind": "note",
          "tone": "warn",
          "text": {
            "ru": "Нулевой главный определитель сам по себе не определяет число решений. В таком случае продолжите методом Гаусса и сравните ранги.",
            "kz": "Бас анықтауыштың нөлге тең болуы шешімдер санын бірден анықтамайды. Гаусс әдісін жалғастырып, рангтерді салыстырыңыз.",
            "en": "A zero coefficient determinant alone does not determine the number of solutions. Continue with elimination and compare the ranks."
          }
        }
      ]
    }
  ],
  "4": [
    {
      "id": "unit-vector",
      "title": {
        "ru": "Единичный вектор и направляющие косинусы",
        "kz": "Бірлік вектор және бағыттаушы косинустар",
        "en": "Unit vectors and direction cosines"
      },
      "summary": {
        "ru": "Выведите формулу длины и задайте движение нужной длины в заданном направлении.",
        "kz": "Ұзындық формуласын шығарып, берілген бағытта қажетті қашықтыққа жылжытыңыз.",
        "en": "Derive the length formula and move a chosen distance in a given direction."
      },
      "blocks": [
        {
          "kind": "p",
          "text": {
            "ru": "Проекции вектора на взаимно перпендикулярные оси образуют прямоугольные треугольники. Сначала теорема Пифагора даёт квадрат длины проекции на xy, затем добавляется квадрат z-компоненты. Длина поэтому всегда неотрицательна, даже когда координаты отрицательны.",
            "kz": "Вектордың өзара перпендикуляр осьтердегі проекциялары тікбұрышты үшбұрыштар құрайды. Пифагор теоремасы алдымен xy проекциясының ұзындығы квадратын береді, оған z координатасының квадраты қосылады. Координаталар теріс болса да, ұзындық теріс болмайды.",
            "en": "Perpendicular coordinate projections form right triangles. Apply Pythagoras in the xy-plane, then add the square of the z component. Length is nonnegative even when components are negative."
          }
        },
        {
          "kind": "formula",
          "tex": "|\\mathbf a|^2=(a_x^2+a_y^2)+a_z^2,\\qquad \\mathbf e=\\frac{\\mathbf a}{|\\mathbf a|},\\quad |\\mathbf e|=1"
        },
        {
          "kind": "p",
          "text": {
            "ru": "Деление ненулевого вектора на его длину сохраняет направление и задаёт единицу расстояния. Его координаты равны косинусам углов с осями. Сумма квадратов этих косинусов равна единице — это полезная проверка расчёта. Для перемещения на расстояние s умножьте единичный вектор на s.",
            "kz": "Нөлдік емес векторды ұзындығына бөлу бағытты сақтап, бірлік ұзындық береді. Оның координаталары осьтермен жасайтын бұрыштардың косинустарына тең. Олардың квадраттарының қосындысы бірге тең — есепті тексеруге ыңғайлы. s қашықтыққа жылжу үшін бірлік векторды s санына көбейтіңіз.",
            "en": "Dividing a nonzero vector by its length preserves direction and gives unit length. Its components are the cosines of the angles with the axes. Their squared sum is one, a useful check. Multiply the unit vector by s to move a distance s."
          }
        },
        {
          "kind": "example",
          "example": {
            "title": {
              "ru": "Движение по направлению",
              "kz": "Бағыт бойынша қозғалыс",
              "en": "Moving along a direction"
            },
            "task": {
              "ru": "Из точки A пройдите 10 единиц в направлении a. Найдите конечную точку.",
              "kz": "A нүктесінен a бағытында 10 бірлік жүріңіз. Соңғы нүктені табыңыз.",
              "en": "Move 10 units from A in direction a. Find the endpoint."
            },
            "given": "A=(1,-2,3),\\quad \\mathbf a=(3,4,0)",
            "steps": [
              {
                "tex": "|\\mathbf a|=5,\\quad \\mathbf e=(3/5,4/5,0)"
              },
              {
                "tex": "\\overrightarrow{AB}=10\\mathbf e=(6,8,0),\\quad B=(7,6,3)"
              },
              {
                "text": {
                  "ru": "Проверяем расстояние между точками.",
                  "kz": "Нүктелер арасындағы қашықтықты тексереміз.",
                  "en": "Check the distance between the points."
                },
                "tex": "|AB|=\\sqrt{6^2+8^2}=10"
              }
            ],
            "added": true
          }
        },
        {
          "kind": "note",
          "tone": "warn",
          "text": {
            "ru": "Нулевой вектор нельзя нормировать. Его длина равна нулю, а направление не определено.",
            "kz": "Нөлдік векторды нормалауға болмайды. Ұзындығы нөл және бағыты анықталмаған.",
            "en": "The zero vector cannot be normalized. Its length is zero and its direction is undefined."
          }
        }
      ]
    },
    {
      "id": "linear-combination",
      "title": {
        "ru": "Разложение вектора и проверка коллинеарности",
        "kz": "Векторды жіктеу және коллинеарлықты тексеру",
        "en": "Vector decomposition and collinearity"
      },
      "summary": {
        "ru": "Используйте системы уравнений, чтобы найти коэффициенты разложения.",
        "kz": "Жіктеу коэффициенттерін теңдеулер жүйесі арқылы табыңыз.",
        "en": "Use a system of equations to find decomposition coefficients."
      },
      "blocks": [
        {
          "kind": "p",
          "text": {
            "ru": "Равенство векторов означает равенство каждой координаты. Чтобы представить w как αu + βv, составьте систему на α и β. Два неколлинеарных вектора на плоскости задают единственное разложение любого вектора. Коллинеарные направления позволяют двигаться только вдоль одной прямой.",
            "kz": "Векторлар тең болса, әр координатасы тең. w векторын αu + βv түрінде жазу үшін α мен β бойынша жүйе құрыңыз. Жазықтықтағы коллинеар емес екі вектор кез келген вектордың жалғыз жіктелуін береді. Коллинеар бағыттар тек бір түзудің бойымен қозғалуға мүмкіндік береді.",
            "en": "Vector equality means equality of every component. To express w as αu + βv, solve for α and β. Two noncollinear planar vectors give a unique decomposition of every vector. Collinear directions only span a line."
          }
        },
        {
          "kind": "example",
          "example": {
            "title": {
              "ru": "Два направления",
              "kz": "Екі бағыт",
              "en": "Two directions"
            },
            "task": {
              "ru": "Найдите α и β в разложении w = αu + βv.",
              "kz": "w = αu + βv жіктелуіндегі α мен β мәндерін табыңыз.",
              "en": "Find α and β in w = αu + βv."
            },
            "given": "\\mathbf u=(1,1),\\quad\\mathbf v=(1,-1),\\quad\\mathbf w=(4,2)",
            "steps": [
              {
                "tex": "\\begin{cases}\\alpha+\\beta=4\\\\\\alpha-\\beta=2\\end{cases}"
              },
              {
                "tex": "2\\alpha=6,\\quad \\alpha=3,\\quad\\beta=1"
              },
              {
                "tex": "3(1,1)+(1,-1)=(4,2)"
              }
            ],
            "added": true
          }
        },
        {
          "kind": "note",
          "tone": "warn",
          "text": {
            "ru": "При проверке коллинеарности нулевые координаты нельзя использовать как знаменатели. Найдите общий множитель по ненулевой координате и проверьте все остальные.",
            "kz": "Коллинеарлықты тексергенде нөлдік координаталарға бөлуге болмайды. Нөлдік емес координата арқылы ортақ көбейткішті тауып, қалғандарын тексеріңіз.",
            "en": "Do not divide by zero components when testing collinearity. Find the common factor from a nonzero component, then verify the others."
          }
        }
      ]
    }
  ],
  "5": [
    {
      "id": "dot-projection",
      "title": {
        "ru": "От теоремы косинусов к работе силы",
        "kz": "Косинустар теоремасынан күш жұмысына",
        "en": "From the cosine rule to work"
      },
      "summary": {
        "ru": "Выведите скалярное произведение и научитесь находить проекцию на произвольное направление.",
        "kz": "Скаляр көбейтіндіні қорытып, кез келген бағытқа проекция табыңыз.",
        "en": "Derive the dot product and project onto any direction."
      },
      "blocks": [
        {
          "kind": "p",
          "text": {
            "ru": "Рассмотрите треугольник со сторонами a, b и a − b. Выразите квадрат третьей стороны через угол между первыми двумя. Затем раскройте тот же квадрат по координатам. После сокращения квадратов длин останется равенство координатной и геометрической формул скалярного произведения.",
            "kz": "Қабырғалары a, b және a − b болатын үшбұрышты қарастырыңыз. Үшінші қабырғаның квадратын алғашқы екеуінің арасындағы бұрыш арқылы өрнектеңіз. Сол квадратты координаталар арқылы ашыңыз. Ұзындықтардың квадраттарын қысқартқанда скаляр көбейтіндінің екі формуласы тең болады.",
            "en": "Apply the cosine rule to the triangle with sides a, b and a − b. Expand the same squared distance in coordinates. Cancelling squared lengths gives the equivalence of the coordinate and geometric dot-product formulas."
          }
        },
        {
          "kind": "formula",
          "tex": "|\\mathbf a-\\mathbf b|^2=|\\mathbf a|^2+|\\mathbf b|^2-2|\\mathbf a||\\mathbf b|\\cos\\theta"
        },
        {
          "kind": "formula",
          "tex": "|\\mathbf a-\\mathbf b|^2=|\\mathbf a|^2+|\\mathbf b|^2-2\\sum_i a_i b_i"
        },
        {
          "kind": "p",
          "text": {
            "ru": "Для единичного направления e число a·e — знаковая длина проекции. Вектор проекции равен (a·e)e. Поэтому работу постоянной силы можно вычислить как произведение перемещения на составляющую силы вдоль него. Перпендикулярная составляющая работы не совершает.",
            "kz": "Бірлік e бағыты үшін a·e саны проекцияның таңбалы ұзындығы. Проекция векторы (a·e)e болады. Тұрақты күштің жұмысы орын ауыстыруды оның бойындағы күш құраушысына көбейту арқылы табылады. Перпендикуляр құраушы жұмыс атқармайды.",
            "en": "For unit direction e, a·e is the signed projection length and (a·e)e is the projection vector. Work by a constant force is displacement times the component of force along it. The perpendicular component contributes zero work."
          }
        },
        {
          "kind": "example",
          "example": {
            "title": {
              "ru": "Проекция силы и работа",
              "kz": "Күш проекциясы және жұмыс",
              "en": "Force projection and work"
            },
            "task": {
              "ru": "Найдите работу силы F на перемещении s и проекцию F на это направление.",
              "kz": "s орын ауыстыруындағы F күшінің жұмысын және сол бағыттағы проекциясын табыңыз.",
              "en": "Find the work of force F over displacement s and its projection along s."
            },
            "given": "\\mathbf F=(3,4)\\ \\mathrm N,\\quad \\mathbf s=(2,0)\\ \\mathrm m",
            "steps": [
              {
                "tex": "W=\\mathbf F\\cdot\\mathbf s=3\\cdot2+4\\cdot0=6\\ \\mathrm J"
              },
              {
                "tex": "\\mathbf e=(1,0),\\quad \\operatorname{pr}_{\\mathbf e}\\mathbf F=3\\ \\mathrm N"
              },
              {
                "tex": "\\operatorname{proj}_{\\mathbf s}\\mathbf F=(3,0)\\ \\mathrm N"
              }
            ],
            "added": true
          }
        },
        {
          "kind": "note",
          "tone": "warn",
          "text": {
            "ru": "Длина проекции — число, вектор проекции — вектор. Для угла между направленными векторами сохраните знак скалярного произведения, иначе потеряете тупые углы.",
            "kz": "Проекция ұзындығы — сан, проекция векторы — вектор. Бағытталған векторлар арасындағы бұрыш үшін скаляр көбейтіндінің таңбасын сақтаңыз, әйтпесе доғал бұрыштар жоғалады.",
            "en": "A projection length is a scalar and a projection vector is a vector. Keep the dot-product sign when finding a directed-vector angle to preserve obtuse angles."
          }
        }
      ]
    },
    {
      "id": "triple-basis",
      "title": {
        "ru": "Объём, компланарность и координаты в базисе",
        "kz": "Көлем, компланарлық және базистегі координаталар",
        "en": "Volume, coplanarity and basis coordinates"
      },
      "summary": {
        "ru": "Свяжите площадь основания, высоту и определитель одной геометрической задачей.",
        "kz": "Табан ауданы, биіктік және анықтауышты бір есепте байланыстырыңыз.",
        "en": "Connect base area, height and determinants in one problem."
      },
      "blocks": [
        {
          "kind": "p",
          "text": {
            "ru": "Вектор a×b направлен по нормали к основанию параллелепипеда, его длина равна площади основания. Скалярное произведение с c умножает эту площадь на знаковую высоту. Отсюда получается формула смешанного произведения. Модуль убирает зависимость объёма от выбранной ориентации.",
            "kz": "a×b векторы параллелепипед табанына нормаль бағытында, ұзындығы табан ауданына тең. Оны c векторына скаляр көбейту ауданды таңбалы биіктікке көбейтеді. Осыдан аралас көбейтінді формуласы шығады. Модуль көлемді бағдардан тәуелсіз етеді.",
            "en": "The vector a×b is normal to the base and has the magnitude of its area. Dotting it with c multiplies that area by the signed height. Taking the absolute value gives a volume independent of orientation."
          }
        },
        {
          "kind": "p",
          "text": {
            "ru": "Нулевой объём означает, что три вектора лежат в одной плоскости. При ненулевом объёме они образуют базис пространства. Разложение произвольного вектора w по этому базису находится решением системы, где a, b, c стоят в столбцах матрицы. Объём тетраэдра на тех же трёх рёбрах в шесть раз меньше.",
            "kz": "Нөлдік көлем үш вектордың бір жазықтықта жатқанын білдіреді. Көлем нөлден өзгеше болса, олар кеңістікте базис құрайды. w векторын осы базиске жіктеу үшін a, b, c бағандарда тұрған жүйені шешіңіз. Сол үш қырдан құралған тетраэдр көлемі алты есе аз.",
            "en": "Zero volume means the three vectors are coplanar. Otherwise they form a basis of space. Find the coordinates of w by solving a system whose columns are a, b and c. A tetrahedron with those three edges has one sixth of the parallelepiped volume."
          }
        },
        {
          "kind": "example",
          "example": {
            "title": {
              "ru": "Объём и разложение",
              "kz": "Көлем және жіктеу",
              "en": "Volume and decomposition"
            },
            "task": {
              "ru": "Найдите объём и разложите w по трём векторам.",
              "kz": "Көлемді тауып, w векторын үш вектор бойынша жіктеңіз.",
              "en": "Find the volume and decompose w in the three vectors."
            },
            "given": "\\mathbf a=(2,0,0),\\ \\mathbf b=(1,3,0),\\ \\mathbf c=(0,1,4),\\ \\mathbf w=(5,5,8)",
            "steps": [
              {
                "tex": "\\mathbf a\\times\\mathbf b=(0,0,6),\\quad V=|(0,0,6)\\cdot(0,1,4)|=24"
              },
              {
                "tex": "2\\alpha+\\beta=5,\\quad3\\beta+\\gamma=5,\\quad4\\gamma=8"
              },
              {
                "tex": "\\gamma=2,\\quad\\beta=1,\\quad\\alpha=2,\\quad \\mathbf w=2\\mathbf a+\\mathbf b+2\\mathbf c"
              },
              {
                "tex": "V_{\\mathrm{tetrahedron}}=24/6=4"
              }
            ],
            "added": true
          }
        }
      ]
    }
  ],
  "6": [
    {
      "id": "line-from-points",
      "title": {
        "ru": "Прямая через две точки без деления на ноль",
        "kz": "Екі нүкте арқылы түзуді нөлге бөлмей құру",
        "en": "A line through two points without dividing by zero"
      },
      "summary": {
        "ru": "Получите общее уравнение из направления и нормали, включая вертикальные прямые.",
        "kz": "Бағыт пен нормаль арқылы жалпы теңдеуді, соның ішінде тік түзуді құрыңыз.",
        "en": "Derive the general form from a direction and normal, including vertical lines."
      },
      "blocks": [
        {
          "kind": "p",
          "text": {
            "ru": "Две различные точки A и B задают направление d = B − A. Если d = (u,v), то n = (v,−u) перпендикулярен d, потому что их скалярное произведение равно нулю. Любая точка X прямой удовлетворяет n·(X − A) = 0. Раскрыв скобки, получите общее уравнение.",
            "kz": "A және B екі әртүрлі нүктесі d = B − A бағытын береді. d = (u,v) болса, n = (v,−u) оған перпендикуляр, себебі скаляр көбейтіндісі нөл. Түзудің кез келген X нүктесі n·(X − A) = 0 шартын қанағаттандырады. Жақшаларды ашып, жалпы теңдеуді аласыз.",
            "en": "Two distinct points A and B give direction d = B − A. For d = (u,v), the vector n = (v,−u) is perpendicular because their dot product is zero. Every point X on the line satisfies n·(X − A) = 0. Expanding gives the general equation."
          }
        },
        {
          "kind": "formula",
          "tex": "v(x-x_A)-u(y-y_A)=0"
        },
        {
          "kind": "example",
          "example": {
            "title": {
              "ru": "Вертикальная прямая",
              "kz": "Тік түзу",
              "en": "A vertical line"
            },
            "task": {
              "ru": "Составьте уравнение прямой AB и проверьте обе точки.",
              "kz": "AB түзуінің теңдеуін құрып, екі нүктені де тексеріңіз.",
              "en": "Find the equation of AB and check both points."
            },
            "given": "A=(2,-1),\\quad B=(2,4)",
            "steps": [
              {
                "tex": "\\mathbf d=(0,5),\\quad\\mathbf n=(5,0)"
              },
              {
                "tex": "5(x-2)=0\\quad\\Rightarrow\\quad x=2"
              },
              {
                "text": {
                  "ru": "Обе точки имеют x = 2. Координата y может быть любой.",
                  "kz": "Екі нүктеде де x = 2. y координатасы кез келген сан бола алады.",
                  "en": "Both points have x = 2, while y is unrestricted."
                }
              }
            ],
            "added": true
          }
        },
        {
          "kind": "note",
          "tone": "warn",
          "text": {
            "ru": "У общего уравнения Ax + By + C = 0 хотя бы один из коэффициентов A, B должен быть ненулевым. При совпадающих точках направление определить нельзя.",
            "kz": "Ax + By + C = 0 жалпы теңдеуінде A, B коэффициенттерінің кемінде біреуі нөлден өзгеше болуы тиіс. Беттескен екі нүкте бағытты анықтамайды.",
            "en": "In Ax + By + C = 0, at least one of A and B must be nonzero. Coincident points do not determine a direction."
          }
        }
      ]
    },
    {
      "id": "perpendicular-foot",
      "title": {
        "ru": "Почему работает формула расстояния",
        "kz": "Қашықтық формуласы неге орындалады",
        "en": "Why the distance formula works"
      },
      "summary": {
        "ru": "Найдите не только расстояние до прямой, но и основание перпендикуляра.",
        "kz": "Түзуге дейінгі қашықтықпен бірге перпендикуляр табанын табыңыз.",
        "en": "Find both the distance to a line and the perpendicular foot."
      },
      "blocks": [
        {
          "kind": "p",
          "text": {
            "ru": "Пусть P — заданная точка, а H — её ближайшая точка на прямой. Отрезок PH параллелен нормали n = (A,B). Поэтому H можно записать как P − λn. Подставьте H в уравнение прямой и решите относительно λ. Формула расстояния получится умножением |λ| на длину нормали.",
            "kz": "P берілген нүкте, H түзудегі ең жақын нүкте болсын. PH кесіндісі n = (A,B) нормаліне параллель. Сондықтан H = P − λn деп жазыңыз. H нүктесін түзу теңдеуіне қойып, λ мәнін табыңыз. |λ| санын нормаль ұзындығына көбейту қашықтық формуласын береді.",
            "en": "Let H be the closest point on the line to P. Since PH is parallel to n = (A,B), write H = P − λn. Substitute H into the line equation and solve for λ. Multiplying |λ| by the normal length yields the distance formula."
          }
        },
        {
          "kind": "formula",
          "tex": "\\lambda=\\frac{Ax_P+By_P+C}{A^2+B^2},\\quad H=P-\\lambda(A,B),\\quad d=|\\lambda|\\sqrt{A^2+B^2}"
        },
        {
          "kind": "example",
          "example": {
            "title": {
              "ru": "Основание перпендикуляра",
              "kz": "Перпендикуляр табаны",
              "en": "Foot of a perpendicular"
            },
            "task": {
              "ru": "Найдите ближайшую точку прямой к P.",
              "kz": "Түзудің P нүктесіне ең жақын нүктесін табыңыз.",
              "en": "Find the point on the line closest to P."
            },
            "given": "P=(0,0),\\quad 3x+4y-10=0",
            "steps": [
              {
                "tex": "\\lambda=-10/25=-2/5"
              },
              {
                "tex": "H=(0,0)-(-2/5)(3,4)=(6/5,8/5)"
              },
              {
                "tex": "3(6/5)+4(8/5)-10=0,\\quad |PH|=2"
              }
            ],
            "added": true
          }
        },
        {
          "kind": "p",
          "text": {
            "ru": "Для плоскости рассуждение совпадает. Возьмите n = (A,B,C), в числителе появится Ax + By + Cz + D, в знаменателе λ — A² + B² + C². Так можно найти ближайшую точку плоскости в пространстве.",
            "kz": "Жазықтық үшін дәл сол тәсіл қолданылады. n = (A,B,C) алыңыз. λ алымында Ax + By + Cz + D, бөлімінде A² + B² + C² болады. Осылай кеңістіктегі жазықтықтың ең жақын нүктесін табасыз.",
            "en": "The same argument works for a plane with n = (A,B,C). The numerator becomes Ax + By + Cz + D and the denominator for λ becomes A² + B² + C². This also gives the nearest point on a plane."
          }
        }
      ]
    }
  ],
  "7": [
    {
      "id": "plane-three-points",
      "title": {
        "ru": "Плоскость через три точки",
        "kz": "Үш нүкте арқылы жазықтық",
        "en": "A plane through three points"
      },
      "summary": {
        "ru": "Постройте нормаль, найдите уравнение и проверьте, что плоскость определена однозначно.",
        "kz": "Нормаль мен теңдеуді тауып, жазықтықтың бірмәнді анықталғанын тексеріңіз.",
        "en": "Construct a normal, find the equation and check uniqueness."
      },
      "blocks": [
        {
          "kind": "p",
          "text": {
            "ru": "Из одной вершины проведите два вектора к остальным точкам. Их векторное произведение даст нормаль. Если произведение нулевое, точки коллинеарны или совпадают, и единственная плоскость не определяется. При ненулевой нормали подставьте исходную точку в n·(X − A) = 0.",
            "kz": "Бір төбеден қалған екі нүктеге вектор жүргізіңіз. Олардың векторлық көбейтіндісі нормаль береді. Ол нөл болса, нүктелер бір түзуде жатады не беттеседі, жалғыз жазықтық анықталмайды. Нормаль нөлдік емес болса, бастапқы нүктені n·(X − A) = 0 өрнегіне қойыңыз.",
            "en": "Draw two vectors from one of the three points. Their cross product gives a normal. A zero cross product means collinear or coincident points, so there is no unique plane. Otherwise use the normal in n·(X − A) = 0."
          }
        },
        {
          "kind": "example",
          "example": {
            "title": {
              "ru": "Построение и проверка",
              "kz": "Құру және тексеру",
              "en": "Construction and verification"
            },
            "task": {
              "ru": "Найдите уравнение плоскости через A, B и C.",
              "kz": "A, B және C нүктелері арқылы өтетін жазықтық теңдеуін табыңыз.",
              "en": "Find the plane through A, B and C."
            },
            "given": "A=(1,0,0),\\quad B=(0,1,0),\\quad C=(0,0,1)",
            "steps": [
              {
                "tex": "\\overrightarrow{AB}=(-1,1,0),\\quad\\overrightarrow{AC}=(-1,0,1)"
              },
              {
                "tex": "\\mathbf n=\\overrightarrow{AB}\\times\\overrightarrow{AC}=(1,1,1)"
              },
              {
                "tex": "(x-1)+y+z=0\\quad\\Rightarrow\\quad x+y+z=1"
              },
              {
                "text": {
                  "ru": "Подстановка каждой из трёх точек даёт 1 = 1. Ненулевая нормаль подтверждает единственность плоскости.",
                  "kz": "Үш нүктенің әрқайсысын қою 1 = 1 теңдігін береді. Нөлдік емес нормаль жазықтықтың жалғыз екенін растайды.",
                  "en": "Each of the three points gives 1 = 1. The nonzero normal confirms that the plane is uniquely determined."
                }
              }
            ],
            "added": true
          }
        },
        {
          "kind": "note",
          "tone": "warn",
          "text": {
            "ru": "Перестановка AB и AC поменяет знак нормали. После умножения всего уравнения на −1 получится та же плоскость.",
            "kz": "AB мен AC орнын ауыстыру нормаль таңбасын өзгертеді. Теңдеуді түгел −1 санына көбейткенде сол жазықтық шығады.",
            "en": "Reversing AB and AC reverses the normal. Multiplying the whole equation by −1 gives the same plane."
          }
        }
      ]
    },
    {
      "id": "skew-lines",
      "title": {
        "ru": "Как распознать скрещивающиеся прямые",
        "kz": "Айқас түзулерді қалай анықтаймыз",
        "en": "How to recognize skew lines"
      },
      "summary": {
        "ru": "Разделите проверку направлений и поиск общей точки.",
        "kz": "Бағыттар мен ортақ нүктені жеке тексеріңіз.",
        "en": "Check directions and a common point separately."
      },
      "blocks": [
        {
          "kind": "p",
          "text": {
            "ru": "Для двух прямых используйте разные параметры t и s. Сначала проверьте, пропорциональны ли направления. При пропорциональных направлениях проверка одной точки различает совпадение и параллельность. Если направления непропорциональны, решите три уравнения равенства координат на t и s. Несовместность означает скрещивание.",
            "kz": "Екі түзу үшін t және s бөлек параметрлерін қолданыңыз. Алдымен бағыттардың пропорционалдығын тексеріңіз. Пропорционал болса, бір нүктені тексеру беттесу мен параллельдікті ажыратады. Пропорционал болмаса, координаталар теңдігінен үш теңдеу құрыңыз. Жүйе үйлесімсіз болса, түзулер айқас.",
            "en": "Use separate parameters t and s. Check whether the directions are proportional. If they are, testing one point distinguishes coincidence from parallel lines. Otherwise equate all three coordinates and solve for t and s. Inconsistency means the lines are skew."
          }
        },
        {
          "kind": "example",
          "example": {
            "title": {
              "ru": "Направления ортогональны, общей точки нет",
              "kz": "Бағыттар ортогонал, ортақ нүкте жоқ",
              "en": "Orthogonal directions with no common point"
            },
            "task": {
              "ru": "Определите взаимное положение прямых.",
              "kz": "Түзулердің өзара орналасуын анықтаңыз.",
              "en": "Determine how the two lines are positioned."
            },
            "given": "\\ell_1=(t,0,0),\\qquad \\ell_2=(0,s,1)",
            "steps": [
              {
                "tex": "\\mathbf v_1=(1,0,0),\\quad \\mathbf v_2=(0,1,0),\\quad\\mathbf v_1\\cdot\\mathbf v_2=0"
              },
              {
                "tex": "t=0,\\quad s=0,\\quad 0=1"
              },
              {
                "text": {
                  "ru": "Третье равенство невозможно. Прямые скрещиваются, хотя направления ортогональны.",
                  "kz": "Үшінші теңдік мүмкін емес. Бағыттары ортогонал болса да, түзулер айқас.",
                  "en": "The third equality is impossible. The lines are skew despite their orthogonal directions."
                }
              }
            ],
            "added": true
          }
        },
        {
          "kind": "p",
          "text": {
            "ru": "Быстрая дополнительная проверка — смешанное произведение вектора между точками прямых и двух направлений. Его ненулевое значение означает, что прямые не лежат в одной плоскости. При нуле и непропорциональных направлениях они пересекаются.",
            "kz": "Қосымша жылдам тексеру үшін түзулердің нүктелерін қосатын вектор мен екі бағыттың аралас көбейтіндісін табыңыз. Ол нөлдік емес болса, түзулер бір жазықтықта жатпайды. Нөлге тең және бағыттары пропорционал емес болса, қиылысады.",
            "en": "As an additional check, take the triple product of the vector between the lines’ points and their two directions. A nonzero value means they are not coplanar. A zero value with nonparallel directions means they intersect."
          }
        },
        {
          "kind": "formula",
          "tex": "(\\mathbf r_2-\\mathbf r_1)\\cdot(\\mathbf v_1\\times\\mathbf v_2)\\ne0\\quad\\Rightarrow\\quad \\text{skew}"
        }
      ]
    }
  ],
  "8": [
    {
      "id": "complete-square",
      "title": {
        "ru": "Как распознать кривую в раскрытом уравнении",
        "kz": "Ашылған теңдеуден қисықты тану",
        "en": "Recognizing a curve from an expanded equation"
      },
      "summary": {
        "ru": "Выделите полные квадраты, найдите центр и проверьте существование вещественных точек.",
        "kz": "Толық квадраттарды бөліп, центрді және нақты нүктелердің бар-жоғын анықтаңыз.",
        "en": "Complete the squares, find the center and check whether real points exist."
      },
      "blocks": [
        {
          "kind": "p",
          "text": {
            "ru": "Сначала сгруппируйте слагаемые по координатам. Из каждой группы вынесите коэффициент при квадрате, затем дополните выражение до полного квадрата, компенсируя добавленную константу. Перенос начала координат в найденный центр убирает линейные слагаемые. После деления на правую часть можно прочитать полуоси.",
            "kz": "Алдымен мүшелерді координаталар бойынша топтаңыз. Әр топтан квадрат коэффициентін шығарып, толық квадратқа толықтырыңыз және қосылған тұрақтыны шегеріңіз. Координаталар басын табылған центрге көшіру сызықтық мүшелерді жояды. Оң жаққа бөлген соң жарты осьтер көрінеді.",
            "en": "Group terms by coordinate, factor out each quadratic coefficient and complete the square while compensating for the added constant. Moving the origin to the center removes linear terms. Divide by the right-hand side to read the semiaxes."
          }
        },
        {
          "kind": "example",
          "example": {
            "title": {
              "ru": "Эллипс со смещённым центром",
              "kz": "Центрі ығысқан эллипс",
              "en": "An ellipse with a shifted center"
            },
            "task": {
              "ru": "Найдите центр, полуоси и фокусы эллипса.",
              "kz": "Эллипстің центрін, жарты осьтері мен фокустарын табыңыз.",
              "en": "Find the center, semiaxes and foci."
            },
            "given": "4x^2+y^2-8x+6y-3=0",
            "steps": [
              {
                "tex": "4(x^2-2x)+(y^2+6y)=3"
              },
              {
                "tex": "4[(x-1)^2-1]+[(y+3)^2-9]=3"
              },
              {
                "tex": "\\frac{(x-1)^2}{4}+\\frac{(y+3)^2}{16}=1"
              },
              {
                "text": {
                  "ru": "Большая полуось направлена вдоль y. Откладываем фокальное расстояние от центра по этой оси.",
                  "kz": "Үлкен жарты ось y бойында. Фокустық қашықтықты центрден сол ось бойынша өлшейміз.",
                  "en": "The major axis runs along y. Place the foci along that axis from the center."
                },
                "tex": "C=(1,-3),\\quad a=4,\\ b=2,\\ c=\\sqrt{16-4}=2\\sqrt3,\\quad F_{1,2}=(1,-3\\pm2\\sqrt3)"
              }
            ],
            "added": true
          }
        },
        {
          "kind": "note",
          "tone": "warn",
          "text": {
            "ru": "При Bxy = 0 выделение квадратов обычно достаточно. При ненулевом смешанном слагаемом может понадобиться поворот осей. Проверяйте правую часть, например x² + y² = −1 не имеет вещественных точек, а x² + y² = 0 задаёт точку.",
            "kz": "Bxy = 0 болса, толық квадраттарды бөлу көбіне жеткілікті. Аралас мүше нөлдік емес болса, осьтерді бұру қажет болуы мүмкін. Оң жақты тексеріңіз. x² + y² = −1 нақты нүктелер бермейді, x² + y² = 0 бір нүкте береді.",
            "en": "With no mixed xy term, completing squares usually suffices. A nonzero mixed term may require a rotation of axes. Check the right-hand side. x² + y² = −1 has no real points, while x² + y² = 0 is a single point."
          }
        }
      ]
    },
    {
      "id": "quadric-sections",
      "title": {
        "ru": "Сечения помогают увидеть поверхность",
        "kz": "Қималар бетті түсінуге көмектеседі",
        "en": "Understanding surfaces through sections"
      },
      "summary": {
        "ru": "Постройте мысленную 3D-модель по нескольким двумерным сечениям.",
        "kz": "Бірнеше жазық қима арқылы кеңістіктегі бетті елестетіңіз.",
        "en": "Build a mental 3D model from two-dimensional sections."
      },
      "blocks": [
        {
          "kind": "p",
          "text": {
            "ru": "Зафиксируйте одну координату и исследуйте полученную кривую. Для z = h выясните, при каких h существуют точки и как меняются размеры сечения. Затем проверьте сечения x = 0 и y = 0. Вместе они показывают ограниченность, симметрию, число частей и направление оси поверхности.",
            "kz": "Бір координатаны бекітіп, шыққан қисықты зерттеңіз. z = h үшін нүктелер қай h мәндерінде бар екенін және қима өлшемінің өзгерісін табыңыз. Содан кейін x = 0, y = 0 қималарын тексеріңіз. Олар беттің шектелуін, симметриясын, бөліктер санын және ось бағытын көрсетеді.",
            "en": "Fix one coordinate and examine the resulting curve. For z = h, determine which h values allow points and how the section size changes. Then check x = 0 and y = 0. Together these reveal boundedness, symmetry, connected parts and the surface axis."
          }
        },
        {
          "kind": "example",
          "example": {
            "title": {
              "ru": "Однополостный и двуполостный гиперболоиды",
              "kz": "Бір қуысты және екі қуысты гиперболоидтар",
              "en": "Hyperboloids of one and two sheets"
            },
            "task": {
              "ru": "Сравните горизонтальные сечения двух поверхностей.",
              "kz": "Екі беттің көлденең қималарын салыстырыңыз.",
              "en": "Compare horizontal sections of the two surfaces."
            },
            "given": "x^2+y^2-z^2=1,\\qquad z^2-x^2-y^2=1",
            "steps": [
              {
                "text": {
                  "ru": "У первой поверхности окружность существует при любом h. Минимальный радиус при h = 0 равен единице.",
                  "kz": "Бірінші бетте кез келген h үшін шеңбер бар. h = 0 кезіндегі ең кіші радиус бірге тең.",
                  "en": "The first has a circular section at every h. Its minimum radius is one at h = 0."
                },
                "tex": "z=h\\quad\\Rightarrow\\quad x^2+y^2=1+h^2"
              },
              {
                "text": {
                  "ru": "У второй точки существуют только при |h| ≥ 1. При h = ±1 сечение сжимается в точку.",
                  "kz": "Екіншісінде нүктелер тек |h| ≥ 1 болса бар. h = ±1 кезінде қима нүктеге айналады.",
                  "en": "The second has points only for |h| ≥ 1. At h = ±1 the section collapses to a point."
                },
                "tex": "x^2+y^2=h^2-1"
              },
              {
                "text": {
                  "ru": "Промежуток −1 < z < 1 пуст, поэтому вторая поверхность состоит из двух отдельных частей.",
                  "kz": "−1 < z < 1 аралығы бос, сондықтан екінші бет екі бөлек бөліктен тұрады.",
                  "en": "There are no points in −1 < z < 1, so the second surface has two separate sheets."
                }
              }
            ],
            "added": true
          }
        },
        {
          "kind": "p",
          "text": {
            "ru": "Примените тот же приём к z = x² + y². При h > 0 сечение — окружность радиуса √h, при h = 0 — точка, при h < 0 точек нет. Получается параболоид, раскрытый в сторону положительной оси z.",
            "kz": "Сол тәсілді z = x² + y² бетіне қолданыңыз. h > 0 болса, қима радиусы √h шеңбер, h = 0 болса нүкте, h < 0 болса нүктелер жоқ. Параболоид оң z бағытына ашылады.",
            "en": "Apply the same method to z = x² + y². For h > 0 the section is a circle of radius √h, for h = 0 a point, and for h < 0 it is empty. The paraboloid opens in the positive z direction."
          }
        }
      ]
    }
  ]
};
