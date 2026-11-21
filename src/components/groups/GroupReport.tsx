'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Download, RefreshCw, UserMinus } from 'lucide-react';
import { I18N } from '../../data/i18n';
import { fmt, htmlLang } from '../../data/i18n-lab';
import {
  formatCode, getGroupReport, getMyGroups, removeGroupMember,
  type GroupReport, type GroupStudent, type MyGroups, type TeacherGroup,
} from '../../lib/groups';
import type { Language } from '../../lib/storage';
import { Button } from '../ui/Button';
import { minutesText, shortDate } from '../activity/format';
import {
  courseName, csvFileName, daysAgo, downloadText, errorText, lastActiveText, lessonTitle,
  percentText, quizAverage, reportCsv,
} from './shared';
import styles from './groups.module.css';

type Period = 7 | 30;
type SortKey = 'name' | 'lessons' | 'quizzes' | 'study' | 'site' | 'last';
type Sort = { key: SortKey; desc: boolean };

function minutes(student: GroupStudent, period: Period) {
  return period === 7
    ? { study: student.study_7, course: student.course_7, total: student.total_7 }
    : { study: student.study_30, course: student.course_30, total: student.total_30 };
}

function sortValue(student: GroupStudent, key: SortKey, period: Period) {
  switch (key) {
    case 'lessons': return student.lessons.length;
    case 'quizzes': return quizAverage(student) ?? -1;
    case 'study': return minutes(student, period).study;
    case 'site': return minutes(student, period).total;
    case 'last': return student.last_active ? new Date(student.last_active).getTime() : 0;
    default: return 0;
  }
}

export function GroupReportView({ lang, group, onMembersChanged }: {
  lang: Language;
  group: TeacherGroup;
  onMembersChanged: (next: MyGroups) => void;
}) {
  const t = I18N[lang];
  const [report, setReport] = useState<GroupReport>();
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const [period, setPeriod] = useState<Period>(7);
  const [sort, setSort] = useState<Sort>({ key: 'name', desc: false });
  const [removing, setRemoving] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  useEffect(() => {
    const request = new AbortController();
    setLoading(true);
    getGroupReport(group.id, request.signal).then(result => {
      if (request.signal.aborted) return;
      setReport(result);
      setFailed(false);
    }).catch(() => {
      // A failed refresh keeps the figures already shown.
      if (!request.signal.aborted) setFailed(true);
    }).finally(() => {
      if (!request.signal.aborted) setLoading(false);
    });
    return () => request.abort();
  }, [group.id, group.members, revision]);

  const collator = useMemo(() => new Intl.Collator(htmlLang(lang), { sensitivity: 'base', numeric: true }), [lang]);
  const students = useMemo(() => {
    const list = [...(report?.students ?? [])];
    list.sort((a, b) => {
      const byName = collator.compare(a.name, b.name);
      if (sort.key === 'name') return sort.desc ? -byName : byName;
      const diff = sortValue(a, sort.key, period) - sortValue(b, sort.key, period);
      return (sort.desc ? -diff : diff) || byName;
    });
    return list;
  }, [report, sort, period, collator]);

  async function remove(student: GroupStudent) {
    if (!window.confirm(fmt(t.grp_remove_confirm, { name: student.name }))) return;
    setRemoving(student.user_id);
    setRemoveError(null);
    try {
      await removeGroupMember(group.id, student.user_id);
      setReport(previous => previous && { ...previous, students: previous.students.filter(s => s.user_id !== student.user_id) });
      onMembersChanged(await getMyGroups());
    } catch (error) {
      setRemoveError(errorText(lang, error));
    } finally {
      setRemoving(null);
    }
  }

  if (!report) {
    return failed ? (
      <div className="empty-state" role="status">
        <p>{t.grp_report_error}</p>
        <button type="button" className="btn btn--secondary btn--sm" onClick={() => setRevision(value => value + 1)}>
          {t.activity_retry}
        </button>
      </div>
    ) : <p className="empty-state" role="status">{t.loading}</p>;
  }

  const lessonCount = report.group.lesson_count;
  const updated = new Intl.DateTimeFormat(htmlLang(lang), { hour: '2-digit', minute: '2-digit' }).format(new Date(report.generated_at));

  return (
    <div className={styles.report}>
      <div className={styles.toolbar}>
        <div role="group" aria-label={t.grp_period} className="lang-switch">
          {([7, 30] as const).map(days => (
            <button key={days} type="button" className="lang-switch__btn" aria-pressed={period === days} onClick={() => setPeriod(days)}>
              {days === 7 ? t.grp_days_7 : t.grp_days_30}
            </button>
          ))}
        </div>
        <div className={styles.toolbarEnd}>
          <span className="field-help" aria-live="polite">{fmt(t.grp_updated, { time: updated })}</span>
          <Button variant="ghost" size="sm" loading={loading} onClick={() => setRevision(value => value + 1)}>
            <RefreshCw size={14} aria-hidden="true" />{t.grp_refresh}
          </Button>
          <Button variant="secondary" size="sm" disabled={report.students.length === 0} onClick={() => {
            downloadText(csvFileName(report.group.name), reportCsv(lang, report), 'text/csv;charset=utf-8');
          }}>
            <Download size={14} aria-hidden="true" />{t.grp_csv}
          </Button>
        </div>
      </div>
      {failed && <p role="alert" className="status status--danger">{t.grp_report_error}</p>}

      <Summary lang={lang} report={report} period={period} />

      {report.students.length === 0 ? (
        <p className={styles.empty}>{fmt(t.grp_no_students, { code: formatCode(group.code) })}</p>
      ) : (
        <>
          <LessonBars lang={lang} report={report} />
          <section aria-label={t.grp_students_title}>
            <h4 className={styles.blockTitle}>{t.grp_students_title}</h4>
            {removeError && <p role="alert" className="status status--danger">{removeError}</p>}
            <div className={`scroll-x ${styles.tableWrap}`}>
              <table className={`data-table ${styles.table}`}>
                <thead>
                  <tr>
                    <SortHeader lang={lang} label={t.grp_col_student} column="name" sort={sort} onSort={setSort} />
                    <SortHeader lang={lang} label={t.grp_col_lessons} column="lessons" sort={sort} onSort={setSort} />
                    <SortHeader lang={lang} label={t.grp_col_quizzes} column="quizzes" sort={sort} onSort={setSort} />
                    <SortHeader lang={lang} label={t.grp_col_study} column="study" sort={sort} onSort={setSort} />
                    <SortHeader lang={lang} label={t.grp_col_site} column="site" sort={sort} onSort={setSort} />
                    <SortHeader lang={lang} label={t.grp_col_last} column="last" sort={sort} onSort={setSort} />
                    <th scope="col"><span className="sr-only">{t.grp_col_actions}</span></th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <StudentRow
                      key={student.user_id}
                      lang={lang}
                      student={student}
                      period={period}
                      courseId={report.group.course_id}
                      lessonCount={lessonCount}
                      removing={removing === student.user_id}
                      onRemove={() => void remove(student)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
      <p className="field-help">{t.grp_report_note}</p>
    </div>
  );
}

function SortHeader({ lang, label, column, sort, onSort }: {
  lang: Language; label: string; column: SortKey; sort: Sort; onSort: (next: Sort) => void;
}) {
  const active = sort.key === column;
  const Icon = !active ? ArrowUpDown : sort.desc ? ArrowDown : ArrowUp;
  return (
    <th scope="col" aria-sort={active ? (sort.desc ? 'descending' : 'ascending') : 'none'}>
      <button
        type="button"
        className={styles.sortButton}
        title={fmt(I18N[lang].grp_sort_by, { col: label })}
        // Numbers start with the largest value, names with A.
        onClick={() => onSort({ key: column, desc: active ? !sort.desc : column !== 'name' })}
      >
        {label}
        <Icon size={13} aria-hidden="true" />
      </button>
    </th>
  );
}

function StudentRow({ lang, student, period, courseId, lessonCount, removing, onRemove }: {
  lang: Language; student: GroupStudent; period: Period; courseId: string; lessonCount: number;
  removing: boolean; onRemove: () => void;
}) {
  const t = I18N[lang];
  const number = new Intl.NumberFormat(htmlLang(lang));
  const done = new Set(student.lessons);
  const time = minutes(student, period);
  const average = quizAverage(student);
  const stale = !student.last_active || daysAgo(student.last_active) > 7;
  const doneLabel = student.lessons.length
    ? fmt(t.grp_done_list, { list: student.lessons.map(index => index + 1).join(', ') })
    : t.grp_done_none;

  return (
    <tr>
      <th scope="row" className={styles.studentCell}>
        <span className={styles.studentName}>{student.name}</span>
        <small>
          {student.username && student.username !== student.name ? `@${student.username} · ` : ''}
          {fmt(t.grp_since, { date: shortDate(lang, new Date(student.joined_at)) })}
        </small>
      </th>
      <td>
        <span className={styles.figure}>{fmt(t.grp_of, { n: number.format(student.lessons.length), total: number.format(lessonCount) })}</span>
        <span className={styles.strip} role="img" aria-label={doneLabel} title={doneLabel}>
          {Array.from({ length: lessonCount }, (_, index) => (
            <span key={index} className={done.has(index) ? styles.stripDone : styles.stripCell}
              title={`${index + 1}. ${lessonTitle(lang, courseId, index)}`} />
          ))}
        </span>
      </td>
      <td>
        {average === null ? <span className={styles.muted}>{t.grp_no_quizzes}</span> : (
          <>
            <span className={styles.figure}>{percentText(lang, average)}</span>
            <small>
              {fmt(t.grp_attempts, { n: number.format(student.quiz_attempts) })}
              {student.quiz_best !== null && <> · {fmt(t.grp_best, { p: percentText(lang, student.quiz_best) })}</>}
            </small>
          </>
        )}
      </td>
      <td>
        <span className={styles.figure}>{minutesText(lang, time.study)}</span>
        <small>{fmt(t.grp_in_course, { t: minutesText(lang, time.course) })}</small>
      </td>
      <td><span className={styles.figure}>{minutesText(lang, time.total)}</span></td>
      <td className={stale ? styles.stale : undefined}>
        {student.last_active ? (
          <time dateTime={student.last_active}>{lastActiveText(lang, student.last_active)}</time>
        ) : lastActiveText(lang, null)}
      </td>
      <td className={styles.actionCell}>
        <button type="button" className="icon-btn" disabled={removing} onClick={onRemove}
          aria-label={fmt(t.grp_remove, { name: student.name })} title={fmt(t.grp_remove, { name: student.name })}>
          <UserMinus size={16} aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}

function Summary({ lang, report, period }: { lang: Language; report: GroupReport; period: Period }) {
  const t = I18N[lang];
  const number = new Intl.NumberFormat(htmlLang(lang), { maximumFractionDigits: 1 });
  const list = report.students;
  const count = list.length;
  const sum = (pick: (student: GroupStudent) => number) => list.reduce((total, student) => total + pick(student), 0);
  const active = list.filter(student => minutes(student, period).total > 0).length;
  const quizTotal = sum(student => student.quiz_total);
  const items = [
    [t.grp_sum_students, number.format(count)],
    [t.grp_sum_active, fmt(t.grp_of, { n: number.format(active), total: number.format(count) })],
    [t.grp_sum_study, minutesText(lang, count ? Math.round(sum(student => minutes(student, period).study) / count) : 0)],
    [t.grp_sum_course, minutesText(lang, count ? Math.round(sum(student => minutes(student, period).course) / count) : 0)],
    [t.grp_sum_lessons, fmt(t.grp_of, {
      n: number.format(count ? sum(student => student.lessons.length) / count : 0),
      total: number.format(report.group.lesson_count),
    })],
    [t.grp_sum_quiz, quizTotal ? percentText(lang, Math.round((sum(student => student.quiz_score) / quizTotal) * 100)) : '—'],
  ];
  return (
    <section aria-label={t.grp_summary}>
      <h4 className="sr-only">{t.grp_summary}</h4>
      <dl className={styles.summary}>
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function LessonBars({ lang, report }: { lang: Language; report: GroupReport }) {
  const t = I18N[lang];
  const number = new Intl.NumberFormat(htmlLang(lang));
  const count = report.students.length;
  const done = Array.from({ length: report.group.lesson_count }, (_, index) =>
    report.students.filter(student => student.lessons.includes(index)).length);
  return (
    <section aria-label={t.grp_lessons_title}>
      <h4 className={styles.blockTitle}>{t.grp_lessons_title}</h4>
      <p className="field-help">{courseName(lang, report.group.course_id)}</p>
      <ol className={styles.bars}>
        {done.map((value, index) => (
          <li key={index} className={styles.bar}>
            <span className={styles.barLabel}>
              {fmt(t.grp_lesson_n, { n: index + 1, title: lessonTitle(lang, report.group.course_id, index) })}
            </span>
            <span className={styles.barTrack} aria-hidden="true">
              <span className={styles.barFill} style={{ width: `${count ? (value / count) * 100 : 0}%` }} />
            </span>
            <span className={styles.barValue}>{fmt(t.grp_of, { n: number.format(value), total: number.format(count) })}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
