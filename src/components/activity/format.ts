import { COURSES } from '../../data/courses';
import { I18N } from '../../data/i18n';
import { fmt, htmlLang } from '../../data/i18n-lab';
import { MATH1_COURSE_ID, MATH1_META, MATH1_SYLLABUS } from '../../data/math1';
import type { ActivityScreen } from '../../lib/activity';
import type { Language } from '../../lib/storage';

export function minutesText(lang: Language, minutes: number) {
  const t = I18N[lang];
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return fmt(t.act_min, { n: m });
  return m === 0 ? fmt(t.act_h, { h }) : fmt(t.act_hm, { h, m });
}

export function screenLabel(lang: Language, screen: ActivityScreen) {
  const t = I18N[lang];
  return screen === 'lesson' ? t.act_screen_lesson : t[`nav_${screen}`] ?? screen;
}

export function courseTitle(lang: Language, courseId: string) {
  if (courseId === MATH1_COURSE_ID) return MATH1_META.title[lang];
  return COURSES.find(course => course.id === courseId)?.title[lang] ?? null;
}

/** [course title, lesson title], or null when the pair is unknown. */
export function topicTitle(lang: Language, courseId: string | null, lessonIndex: number | null) {
  if (courseId === null || lessonIndex === null) return null;
  if (courseId === MATH1_COURSE_ID) {
    const lecture = MATH1_SYLLABUS[lessonIndex];
    return lecture ? [MATH1_META.title[lang], lecture.title[lang]] as const : null;
  }
  const course = COURSES.find(entry => entry.id === courseId);
  const lesson = course?.lessons[lessonIndex];
  return course && lesson ? [course.title[lang], lesson.title[lang]] as const : null;
}

export function hourText(hour: number) {
  return `${String(hour % 24).padStart(2, '0')}:00`;
}

// Kazakh names are spelled out: browsers without Kazakh locale data print "M11" and English weekdays.
const KZ_MONTHS = ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'];
const KZ_MONTHS_SHORT = ['қаң.', 'ақп.', 'нау.', 'сәу.', 'мам.', 'мау.', 'шіл.', 'там.', 'қыр.', 'қаз.', 'қар.', 'жел.'];
// Date.getDay() order: Sunday first.
const KZ_WEEKDAYS = ['жексенбі', 'дүйсенбі', 'сейсенбі', 'сәрсенбі', 'бейсенбі', 'жұма', 'сенбі'];
const KZ_WEEKDAYS_SHORT = ['жс', 'дс', 'сс', 'ср', 'бс', 'жм', 'сб'];

/** "16 нояб.", "16 қар.", "Nov 16" */
export function shortDate(lang: Language, date: Date) {
  if (lang === 'kz') return `${date.getDate()} ${KZ_MONTHS_SHORT[date.getMonth()]}`;
  return new Intl.DateTimeFormat(htmlLang(lang), { day: 'numeric', month: 'short' }).format(date);
}

/** "пн", "дс", "Mon" */
export function weekdayShort(lang: Language, date: Date) {
  if (lang === 'kz') return KZ_WEEKDAYS_SHORT[date.getDay()];
  return new Intl.DateTimeFormat(htmlLang(lang), { weekday: 'short' }).format(date);
}

/** "понедельник, 16 ноября", "16 қараша, дүйсенбі", "Monday, November 16" */
export function longDate(lang: Language, date: Date) {
  if (lang === 'kz') return `${date.getDate()} ${KZ_MONTHS[date.getMonth()]}, ${KZ_WEEKDAYS[date.getDay()]}`;
  return new Intl.DateTimeFormat(htmlLang(lang), { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
}
