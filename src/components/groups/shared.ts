import { COURSES } from '../../data/courses';
import { I18N } from '../../data/i18n';
import { fmt, htmlLang } from '../../data/i18n-lab';
import { MATH1_COURSE_ID } from '../../data/math1/constants';
import { groupError, type GroupError, type GroupReport, type GroupStudent } from '../../lib/groups';
import type { Language } from '../../lib/storage';
import { courseTitle, shortDate, topicTitle } from '../activity/format';

const ERROR_KEYS: Record<GroupError, string> = {
  'sign-in required': 'grp_err_signin',
  'teacher only': 'grp_err_teacher',
  'group not found': 'grp_err_not_found',
  'code not found': 'grp_err_code',
  'own group': 'grp_err_own',
  'group is full': 'grp_err_full',
  'too many groups': 'grp_err_many',
  'invalid name': 'grp_err_name',
  'invalid course': 'grp_err_course',
};

export function errorText(lang: Language, error: unknown) {
  const known = groupError(error);
  return I18N[lang][known ? ERROR_KEYS[known] : 'grp_err_generic'];
}

/** Courses a group can follow: Mathematics 1 first, then the catalog order. */
export const GROUP_COURSES = [MATH1_COURSE_ID, ...COURSES.map(course => course.id)];

export function courseName(lang: Language, courseId: string) {
  return courseTitle(lang, courseId) ?? courseId;
}

export function lessonTitle(lang: Language, courseId: string, index: number) {
  return topicTitle(lang, courseId, index)?.[1] ?? '';
}

/** Whole local calendar days between the date and today. */
export function daysAgo(iso: string, now = new Date()) {
  const date = new Date(iso);
  const a = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const b = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((b - a) / 86_400_000);
}

export function lastActiveText(lang: Language, iso: string | null) {
  const t = I18N[lang];
  if (!iso) return t.grp_never;
  const days = daysAgo(iso);
  if (days <= 0) return t.grp_today;
  if (days === 1) return t.grp_yesterday;
  if (days <= 30) return fmt(t.grp_days_ago, { n: days });
  return shortDate(lang, new Date(iso));
}

export function percentText(lang: Language, value: number) {
  return new Intl.NumberFormat(htmlLang(lang), { style: 'percent', maximumFractionDigits: 0 }).format(value / 100);
}

/** Average score over all attempts, percent; null without attempts. */
export function quizAverage(student: Pick<GroupStudent, 'quiz_score' | 'quiz_total'>) {
  return student.quiz_total > 0 ? Math.round((student.quiz_score / student.quiz_total) * 100) : null;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** Local calendar date as YYYY-MM-DD, which spreadsheets read in every locale. */
export function isoDay(iso: string | null) {
  if (!iso) return '';
  const date = new Date(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Spreadsheet apps run cells that start with these characters as formulas; names come from users.
function csvCell(value: string | number) {
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[";,\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * One row per student. Russian and Kazakh spreadsheets expect ";" between columns,
 * English ones ","; the byte order mark keeps Cyrillic readable in Excel.
 */
export function reportCsv(lang: Language, report: GroupReport) {
  const t = I18N[lang];
  const separator = lang === 'en' ? ',' : ';';
  const header = [
    t.grp_csv_name, t.grp_csv_username, t.grp_csv_joined, t.grp_csv_lessons_done, t.grp_csv_lessons_total,
    t.grp_csv_lessons_list, t.grp_csv_attempts, t.grp_csv_avg, t.grp_csv_best, t.grp_csv_quiz_last,
    t.grp_csv_study_7, t.grp_csv_course_7, t.grp_csv_site_7, t.grp_csv_study_30, t.grp_csv_course_30,
    t.grp_csv_site_30, t.grp_csv_last,
  ];
  const rows = report.students.map(student => [
    student.name,
    student.username ?? '',
    isoDay(student.joined_at),
    student.lessons.length,
    report.group.lesson_count,
    student.lessons.map(index => index + 1).join(' '),
    student.quiz_attempts,
    quizAverage(student) ?? '',
    student.quiz_best ?? '',
    isoDay(student.quiz_last),
    student.study_7, student.course_7, student.total_7,
    student.study_30, student.course_30, student.total_30,
    isoDay(student.last_active),
  ]);
  return String.fromCharCode(0xfeff) + [header, ...rows].map(row => row.map(csvCell).join(separator)).join('\r\n') + '\r\n';
}

export function csvFileName(name: string, date = new Date()) {
  const stem = name.normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'group';
  return `${stem}-${isoDay(date.toISOString())}.csv`;
}

export function downloadText(fileName: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
