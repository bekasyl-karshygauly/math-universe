'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { HACKS } from '../data/hacks';
import { BONUS } from '../data/bonus';
import { COURSES } from '../data/courses';
import { KaTeXMath } from './KaTeXMath';
import { LabExperiment } from './LabExperiment';
import { PageHeader } from './ui/PageHeader';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { fmt } from '../data/i18n-lab';
import { NavPage } from './NavTabs';
import { playSmoothSound, playDynamicSound } from '../lib/sound';

interface SharedProps { lang: Language; }

function useViewMotion() {
  const reduce = useReducedMotion();
  return {
    initial: { opacity: 0, y: reduce ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: reduce ? 0 : 0.22, ease: [0.2, 0, 0, 1] as const },
  };
}

// HOME VIEW
interface HomeViewProps extends SharedProps {
  progress: Record<string, boolean[]>;
  quizBest: number;
  onOpenCourse: (id: string) => void;
  onNav: (page: NavPage) => void;
}

export function HomeView({ lang, progress, quizBest, onOpenCourse, onNav }: HomeViewProps) {
  const t = (k: string) => I18N[lang][k] || k;
  const viewMotion = useViewMotion();
  const totalLessons = COURSES.reduce((a, c) => a + c.lessons.length, 0);
  const completedLessons = Object.values(progress).reduce((a, arr) => a + (arr ? arr.filter(Boolean).length : 0), 0);
  const hasProgress = completedLessons > 0;

  // "Continue" opens the first course that still has unread lessons
  const nextCourse = COURSES.find((c) => c.lessons.some((_, i) => !progress[c.id]?.[i])) ?? COURSES[0];
  const ctaCourse = hasProgress ? nextCourse : COURSES[0];

  const levels = [1, 2, 3].map((n) => ({ n, title: t(`level_${n}`), desc: t(`level_${n}_desc`) }));

  const tools: { page: NavPage; tKey: string; dKey: string }[] = [
    { page: 'calc', tKey: 'tool_calc', dKey: 'tool_calc_d' },
    { page: 'plot', tKey: 'tool_plot', dKey: 'tool_plot_d' },
    { page: 'quiz', tKey: 'tool_quiz', dKey: 'tool_quiz_d' },
    { page: 'notes', tKey: 'tool_notes', dKey: 'tool_notes_d' },
  ];

  return (
    <motion.div key="home-view" {...viewMotion}>
      {/* Hero: typography on the left, a working experiment on the right */}
      <section className="lab-hero" aria-labelledby="lab-hero-title">
        <div className="lab-hero__intro">
          <p className="eyebrow">{t('lab_eyebrow')}</p>
          <h1 id="lab-hero-title" className="display lab-hero__title">
            {t('lab_h1_1')}
            <br />
            {t('lab_h1_2')}
            <br />
            <em>{t('lab_h1_3')}</em>
          </h1>
          <p className="lead">
            {t('lab_lead_1')}
            <br />
            {t('lab_lead_2')}
          </p>
          <button
            type="button"
            className="rule-link lab-hero__cta"
            onClick={() => {
              playSmoothSound();
              onOpenCourse(ctaCourse.id);
            }}
          >
            <span>
              {hasProgress ? t('lab_cta_continue') : t('lab_cta_start')}
              {hasProgress && <span className="lab-hero__cta-sub">{ctaCourse.title[lang]}</span>}
            </span>
            <ArrowUpRight size={18} aria-hidden="true" className="rule-link__arrow" />
          </button>
          <p className="lab-hero__foot">
            {hasProgress ? (
              <>
                {fmt(t('home_progress_value'), { done: completedLessons, total: totalLessons })}
                {quizBest > 0 && (
                  <>
                    <br />
                    {fmt(t('home_quiz_best'), { n: quizBest })}
                  </>
                )}
              </>
            ) : (
              <>
                {t('lab_foot_1')}
                <br />
                {t('lab_foot_2')}
              </>
            )}
          </p>
        </div>
        <div className="lab-hero__instrument">
          <LabExperiment lang={lang} />
        </div>
      </section>

      {/* Depth levels */}
      <section className="home-section" aria-labelledby="home-depth-title">
        <p className="eyebrow eyebrow--muted">{t('home_depth_eyebrow')}</p>
        <h2 id="home-depth-title" className="section-title home-section__title">
          {t('home_depth_title')}
        </h2>
        <p className="lead">{t('home_depth_lead')}</p>
        <ol className="depth-levels">
          {levels.map((l) => (
            <li key={l.n} className="depth-level">
              <span className="depth-level__num display" aria-hidden="true">
                {l.n}
              </span>
              <h3 className="depth-level__title">{l.title}</h3>
              <p className="depth-level__desc">{l.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Course catalog */}
      <section className="home-section" aria-labelledby="home-courses-title">
        <p className="eyebrow eyebrow--muted">{t('home_catalog_eyebrow')}</p>
        <h2 id="home-courses-title" className="section-title home-section__title">
          {t('home_courses')}
        </h2>
        <ol className="course-list">
          {COURSES.map((c, i) => {
            const done = (progress[c.id] || []).filter(Boolean).length;
            const total = c.lessons.length;
            const cp = total ? Math.round((done / total) * 100) : 0;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  className="course-row"
                  onClick={() => {
                    playSmoothSound();
                    onOpenCourse(c.id);
                  }}
                >
                  <span className="course-row__num mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="course-row__main">
                    <span className="course-row__title">{c.title[lang]}</span>
                    <span className="course-row__desc">{c.desc[lang]}</span>
                  </span>
                  <span className="course-row__meta">
                    <span className="mono">{fmt(t('course_done'), { done, total })}</span>
                    <span className="progress-track" aria-hidden="true">
                      <span className="progress-fill" style={{ display: 'block', width: `${cp}%` }} />
                    </span>
                  </span>
                  <ArrowUpRight size={20} aria-hidden="true" className="course-row__arrow" />
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Tools */}
      <section className="home-section" aria-labelledby="home-tools-title">
        <p className="eyebrow eyebrow--muted">{t('home_tools_eyebrow')}</p>
        <h2 id="home-tools-title" className="section-title home-section__title">
          {t('home_tools_title')}
        </h2>
        <ul className="tool-grid">
          {tools.map((item) => (
            <li key={item.page}>
              <button
                type="button"
                className="tool-card"
                onClick={() => {
                  playDynamicSound();
                  onNav(item.page);
                }}
              >
                <span className="tool-card__title">
                  {t(item.tKey)}
                  <ArrowUpRight size={18} aria-hidden="true" className="rule-link__arrow" />
                </span>
                <span className="tool-card__desc">{t(item.dKey)}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </motion.div>
  );
}

// Shared list for the reference sections (techniques and "beauty of mathematics")
function ReferenceList({ items, lang }: { items: { icon?: string; t: Record<Language, string>; d: Record<Language, string>; f?: string }[]; lang: Language }) {
  return (
    <ol className="reference-list">
      {items.map((h, i) => (
        <li key={i} className="reference-item">
          <span className="reference-item__num mono" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="reference-item__body">
            <h2 className="reference-item__title">{h.t[lang]}</h2>
            <p className="reference-item__text">{h.d[lang]}</p>
            {h.f && (
              <div className="formula-box reference-item__formula">
                <KaTeXMath math={h.f} block />
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

// HACKS VIEW
export function HacksView({ lang }: SharedProps) {
  const t = (k: string) => I18N[lang][k] || k;
  const viewMotion = useViewMotion();
  return (
    <motion.div key="hacks-view" {...viewMotion}>
      <PageHeader eyebrow={t('hacks_eyebrow')} title={t('hacks_title')} lead={t('hacks_sub')} />
      <ReferenceList items={HACKS} lang={lang} />
    </motion.div>
  );
}

// BONUS VIEW
export function BonusView({ lang }: SharedProps) {
  const t = (k: string) => I18N[lang][k] || k;
  const viewMotion = useViewMotion();
  return (
    <motion.div key="bonus-view" {...viewMotion}>
      <PageHeader eyebrow={t('bonus_eyebrow')} title={t('bonus_title')} />
      <ReferenceList items={BONUS} lang={lang} />
    </motion.div>
  );
}
