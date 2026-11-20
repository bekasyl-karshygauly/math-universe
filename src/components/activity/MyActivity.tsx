'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { I18N } from '../../data/i18n';
import { fmt, htmlLang } from '../../data/i18n-lab';
import { getMyStudyTime, type StudyTime } from '../../lib/activity';
import type { Language } from '../../lib/storage';
import { courseTitle, hourText, longDate, minutesText, screenLabel, shortDate, topicTitle, weekdayShort } from './format';
import styles from './my.module.css';

/** The current week refreshes quietly while it is on screen. */
const REFRESH_MS = 60_000;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function isoDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Monday of the local week, `offset` weeks from the current one. */
function weekStart(offset: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7) + offset * 7);
  return date;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

type Peak = { from: number; to: number };

/** Busiest three-hour window without empty hours at its edges, or null without activity. */
function peakWindow(hours: number[]): Peak | null {
  let best = -1;
  let bestSum = 0;
  for (let h = 0; h <= 21; h++) {
    const sum = hours[h] + hours[h + 1] + hours[h + 2];
    if (sum > bestSum) {
      bestSum = sum;
      best = h;
    }
  }
  if (best < 0) return null;
  let from = best;
  let to = best + 3;
  while (hours[from] === 0) from++;
  while (hours[to - 1] === 0) to--;
  return { from, to };
}

/** Tooltips of the first and last marks stay inside the chart. */
function tipEdge(index: number, count: number) {
  if (index < Math.ceil(count / 6)) return styles.tipStart;
  if (index >= count - Math.ceil(count / 6)) return styles.tipEnd;
  return '';
}

export function MyActivity({ lang, signedIn }: { lang: Language; signedIn: boolean }) {
  const t = I18N[lang];
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<StudyTime>();
  const [failed, setFailed] = useState(false);
  const [revision, setRevision] = useState(0);
  const monday = useMemo(() => weekStart(offset), [offset]);

  useEffect(() => {
    const request = new AbortController();
    let timer: number | undefined;
    setData(undefined);
    setFailed(false);
    function load(first: boolean) {
      getMyStudyTime(isoDate(monday), request.signal).then(result => {
        if (!request.signal.aborted) setData(result);
      }).catch(() => {
        // A failed background refresh keeps the figures already shown.
        if (!request.signal.aborted && first) setFailed(true);
      });
    }
    function onVisible() {
      if (document.visibilityState === 'visible') load(false);
    }
    load(true);
    if (offset === 0) {
      timer = window.setInterval(onVisible, REFRESH_MS);
      document.addEventListener('visibilitychange', onVisible);
    }
    return () => {
      request.abort();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [monday, offset, revision]);

  const range = `${shortDate(lang, monday)} – ${shortDate(lang, addDays(monday, 6))}`;

  return (
    <div className={styles.my}>
      <div className={styles.toolbar}>
        <p className={styles.week}>
          <CalendarDays size={16} aria-hidden="true" />
          <span aria-live="polite">{fmt(t.act_week_label, { range })}</span>
        </p>
        <div className={styles.weekNav}>
          <button type="button" className="icon-btn" aria-label={t.act_prev_week} title={t.act_prev_week}
            onClick={() => setOffset(value => value - 1)}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" className="icon-btn" aria-label={t.act_next_week} title={t.act_next_week}
            disabled={offset >= 0} onClick={() => setOffset(value => Math.min(0, value + 1))}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {!signedIn && <p className="field-help">{t.act_guest_note}</p>}

      {failed ? (
        <div className="empty-state" role="status">
          <p>{t.activity_error}</p>
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => setRevision(value => value + 1)}>
            {t.activity_retry}
          </button>
        </div>
      ) : !data ? <p className="empty-state" role="status">{t.loading}</p> : (
        <Report lang={lang} data={data} monday={monday} isCurrent={offset === 0} />
      )}

      <p className="field-help">{t.act_how}</p>
    </div>
  );
}

function Report({ lang, data, monday, isCurrent }: { lang: Language; data: StudyTime; monday: Date; isCurrent: boolean }) {
  const t = I18N[lang];
  const locale = htmlLang(lang);
  const number = new Intl.NumberFormat(locale);
  const todayIndex = isCurrent ? (new Date().getDay() + 6) % 7 : -1;
  const studyDays = data.days.filter(day => day.study > 0).length;
  const share = data.total ? Math.round((data.study / data.total) * 100) : 0;
  const peak = peakWindow(data.hours);
  const studyCourses = data.courses;
  const studyCourseTotal = studyCourses.reduce((sum, course) => sum + course.minutes, 0);

  if (data.total === 0) {
    return (
      <div className="empty-state">
        <p>{t.act_empty}</p>
        {data.prev_total > 0 && <p>{fmt(t.act_prev_week_value, { t: minutesText(lang, data.prev_study) })}</p>}
      </div>
    );
  }

  const insights: string[] = [];
  if (data.study === 0) insights.push(t.act_ins_none);
  if (peak) insights.push(fmt(t.act_ins_peak, { from: hourText(peak.from), to: hourText(peak.to) }));
  if (studyDays > 0) {
    insights.push(fmt(t.act_ins_days, { n: studyDays, t: minutesText(lang, Math.round(data.study / studyDays)) }));
  }
  const topCourse = studyCourses[0];
  const topTitle = topCourse && courseTitle(lang, topCourse.course_id);
  if (topCourse && topTitle && studyCourseTotal > 0) {
    insights.push(fmt(t.act_ins_course, { course: topTitle, p: Math.round((topCourse.minutes / studyCourseTotal) * 100) }));
  }
  if (data.prev_study > 0 || data.study > 0) {
    const diff = data.study - data.prev_study;
    insights.push(diff === 0 ? t.act_ins_same : fmt(diff > 0 ? t.act_ins_up : t.act_ins_down, { t: minutesText(lang, Math.abs(diff)) }));
  }

  return (
    <>
      <section className={styles.summary} aria-label={t.act_study_time}>
        <StudyRing share={share} />
        <div className={styles.hero}>
          <p className="eyebrow eyebrow--muted">{t.act_study_time}</p>
          <p className={styles.heroValue}>{minutesText(lang, data.study)}</p>
          <p className="field-help">{fmt(t.act_study_share, { p: share })}</p>
        </div>
        <dl className={styles.facts}>
          <div><dt>{t.act_site_time}</dt><dd>{minutesText(lang, data.total)}</dd></div>
          <div><dt>{t.act_days_studied}</dt><dd>{number.format(studyDays)} / 7</dd></div>
          <div><dt>{t.act_prev_week_short}</dt><dd>{minutesText(lang, data.prev_study)}</dd></div>
        </dl>
      </section>

      <div className={styles.charts}>
        <section className={styles.chart} aria-label={t.act_by_day}>
          <div className={styles.chartHead}>
            <h3 className="eyebrow eyebrow--muted">{t.act_by_day}</h3>
            <Legend lang={lang} />
          </div>
          <DayBars
            lang={lang}
            days={data.days}
            labels={data.days.map((_, i) => weekdayShort(lang, addDays(monday, i)))}
            fullLabels={data.days.map((_, i) => longDate(lang, addDays(monday, i)))}
            todayIndex={todayIndex}
          />
        </section>

        <section className={styles.chart} aria-label={t.act_by_hour}>
          <div className={styles.chartHead}>
            <h3 className="eyebrow eyebrow--muted">{t.act_by_hour}</h3>
            {peak && <p className={styles.peak}>{fmt(t.act_peak, { from: hourText(peak.from), to: hourText(peak.to) })}</p>}
          </div>
          <HourBars lang={lang} hours={data.hours} peak={peak} />
        </section>
      </div>

      <section aria-label={t.act_insights}>
        <h3 className="eyebrow eyebrow--muted">{t.act_insights}</h3>
        <ul className={styles.insights}>
          {insights.map(text => <li key={text}>{text}</li>)}
        </ul>
      </section>

      <div className={styles.lists}>
        <section aria-label={t.act_by_screen}>
          <h3 className="eyebrow eyebrow--muted">{t.act_by_screen}</h3>
          <ul className={styles.rows}>
            {data.screens.map(screen => (
              <MeterRow key={screen.screen} label={screenLabel(lang, screen.screen)} value={minutesText(lang, screen.minutes)}
                share={screen.minutes / data.total} study={screen.study > 0} />
            ))}
          </ul>
        </section>

        <section aria-label={t.act_where}>
          <h3 className="eyebrow eyebrow--muted">{t.act_where}</h3>
          {studyCourses.length === 0 ? <p className="field-help">{t.act_ins_none}</p> : (
            <ul className={styles.rows}>
              {studyCourses.map(course => (
                <MeterRow key={course.course_id} label={courseTitle(lang, course.course_id) ?? course.course_id}
                  value={minutesText(lang, course.minutes)} share={course.minutes / studyCourseTotal} study />
              ))}
            </ul>
          )}
          {data.lessons.length > 0 && (
            <>
              <h3 className={`eyebrow eyebrow--muted ${styles.subhead}`}>{t.act_lessons}</h3>
              <ol className={styles.lessons}>
                {data.lessons.map(lesson => {
                  const topic = topicTitle(lang, lesson.course_id, lesson.lesson_index);
                  return (
                    <li key={`${lesson.course_id}-${lesson.lesson_index}`}>
                      <span>
                        {topic ? topic[1] : `${lesson.course_id} · ${lesson.lesson_index + 1}`}
                        {topic && <small>{topic[0]}</small>}
                      </span>
                      <span className={`mono ${styles.value}`}>{minutesText(lang, lesson.minutes)}</span>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </section>
      </div>
    </>
  );
}

function StudyRing({ share }: { share: number }) {
  const radius = 34;
  const length = 2 * Math.PI * radius;
  return (
    <svg className={styles.ring} viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r={radius} className={styles.ringTrack} />
      <circle cx="40" cy="40" r={radius} className={styles.ringValue}
        strokeDasharray={`${(share / 100) * length} ${length}`} transform="rotate(-90 40 40)" />
    </svg>
  );
}

function Legend({ lang }: { lang: Language }) {
  const t = I18N[lang];
  return (
    <ul className={styles.legend}>
      <li><span className={styles.swatchStudy} aria-hidden="true" />{t.act_study_time}</li>
      <li><span className={styles.swatchOther} aria-hidden="true" />{t.act_other_time}</li>
    </ul>
  );
}

function DayBars({ lang, days, labels, fullLabels, todayIndex }: {
  lang: Language; days: StudyTime['days']; labels: string[]; fullLabels: string[]; todayIndex: number;
}) {
  const t = I18N[lang];
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...days.map(day => day.total));
  const maxIndex = days.findIndex(day => day.total === max);
  return (
    <>
      <div className={styles.bars} aria-hidden="true" onMouseLeave={() => setHover(null)}>
        {days.map((day, i) => (
          <div key={i} className={styles.column} onMouseEnter={() => setHover(i)}>
            <div className={styles.stack} style={{ height: `${(day.total / max) * 100}%` }}>
              {(i === maxIndex || hover === i) && day.total > 0 && (
                <span className={hover === i ? `${styles.tip} ${tipEdge(i, days.length)}` : styles.topLabel}>
                  {hover === i
                    ? `${labels[i]} · ${fmt(t.act_tip_study, { t: minutesText(lang, day.study) })} · ${fmt(t.act_tip_other, { t: minutesText(lang, day.total - day.study) })}`
                    : day.total}
                </span>
              )}
              {day.total - day.study > 0 && <span className={styles.other} style={{ flexGrow: day.total - day.study }} />}
              {day.study > 0 && <span className={styles.study} style={{ flexGrow: day.study }} />}
            </div>
            <span className={i === todayIndex ? styles.today : styles.tick}>{labels[i]}</span>
          </div>
        ))}
      </div>
      <details className={styles.tableToggle}>
        <summary>{t.act_table}</summary>
        <table className="data-table">
          <thead><tr><th scope="col">{t.act_day}</th><th scope="col">{t.act_study_time}</th><th scope="col">{t.act_site_time}</th></tr></thead>
          <tbody>
            {days.map((day, i) => (
              <tr key={i}><th scope="row">{fullLabels[i]}</th><td>{minutesText(lang, day.study)}</td><td>{minutesText(lang, day.total)}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </>
  );
}

function HourBars({ lang, hours, peak }: { lang: Language; hours: number[]; peak: Peak | null }) {
  const t = I18N[lang];
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...hours);
  return (
    <>
      <div className={styles.hours} aria-hidden="true" onMouseLeave={() => setHover(null)}>
        {hours.map((minutes, hour) => {
          const inPeak = peak !== null && hour >= peak.from && hour < peak.to;
          return (
            <div key={hour} className={inPeak ? styles.hourPeak : styles.hour} onMouseEnter={() => setHover(hour)}>
              {hover === hour && (
                <span className={`${styles.tip} ${tipEdge(hour, hours.length)}`}>
                  {hourText(hour)}–{hourText(hour + 1)} · {minutesText(lang, minutes)}
                </span>
              )}
              <span className={styles.hourBar} style={{ height: minutes ? `${Math.max(4, (minutes / max) * 100)}%` : 0 }} />
            </div>
          );
        })}
      </div>
      <div className={styles.hourTicks} aria-hidden="true">
        {[0, 6, 12, 18].map(hour => <span key={hour} style={{ left: `${(hour / 24) * 100}%` }}>{hourText(hour)}</span>)}
      </div>
      <details className={styles.tableToggle}>
        <summary>{t.act_table}</summary>
        <table className="data-table">
          <thead><tr><th scope="col">{t.act_hour}</th><th scope="col">{t.act_minutes}</th></tr></thead>
          <tbody>
            {hours.map((minutes, hour) => minutes > 0 && (
              <tr key={hour}><th scope="row">{hourText(hour)}–{hourText(hour + 1)}</th><td>{minutes}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </>
  );
}

function MeterRow({ label, value, share, study }: { label: string; value: string; share: number; study: boolean }) {
  return (
    <li className={styles.meterRow}>
      <span className={styles.meterLabel}>
        <span className={study ? styles.swatchStudy : styles.swatchOther} aria-hidden="true" />
        {label}
      </span>
      <span className={`mono ${styles.value}`}>{value}</span>
      <span className={styles.meter} aria-hidden="true">
        <span className={study ? styles.study : styles.other} style={{ width: `${Math.max(1, share * 100)}%` }} />
      </span>
    </li>
  );
}
