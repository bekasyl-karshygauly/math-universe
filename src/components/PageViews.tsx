'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useReduceMotion } from '../lib/motionPref';
import { ArrowUpRight } from 'lucide-react';
import { HACKS } from '../data/hacks';
import { BONUS } from '../data/bonus';
import { COURSES } from '../data/courses';
import { MATH1_LECTURE_COUNT } from '../data/math1/constants';
import { KaTeXMath } from './KaTeXMath';
import { LabExperiment } from './LabExperiment';
import { PageHeader } from './ui/PageHeader';
import { Reveal } from './ui/Reveal';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { fmt } from '../data/i18n-lab';
import { NavPage } from './NavTabs';
import { playSmoothSound, playDynamicSound } from '../lib/sound';

interface SharedProps { lang: Language; }

const EASE = [0.2, 0, 0, 1] as const;

function useViewMotion() {
  const reduce = useReduceMotion();
  return {
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduce ? 0 : -6 },
    transition: { duration: reduce ? 0 : 0.3, ease: EASE },
  };
}

// Hero entrance: each element rises in turn (cause → effect reading order)
const heroItem = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: EASE, delay: 0.08 + i * 0.09 },
});

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
  const totalLessons = COURSES.reduce((a, c) => a + c.lessons.length, 0) + MATH1_LECTURE_COUNT;
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
          <motion.p className="eyebrow" {...heroItem(0)}>
            {t('lab_eyebrow')}
          </motion.p>
          <h1 id="lab-hero-title" className="display lab-hero__title">
            <motion.span style={{ display: 'block' }} {...heroItem(1)}>
              {t('lab_h1_1')}
            </motion.span>
            <motion.span style={{ display: 'block' }} {...heroItem(2)}>
              {t('lab_h1_2')}
            </motion.span>
            <motion.em style={{ display: 'block' }} {...heroItem(3)}>
              {t('lab_h1_3')}
            </motion.em>
          </h1>
          <motion.p className="lead" {...heroItem(4)}>
            {t('lab_lead_1')}
            <br />
            {t('lab_lead_2')}
          </motion.p>
          <motion.button
            {...heroItem(5)}
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
          </motion.button>
          <motion.p className="lab-hero__foot" {...heroItem(6)}>
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
          </motion.p>
        </div>
        <motion.div
          className="lab-hero__instrument"
          // Vertical entrance only: a horizontal offset would briefly widen the page on phones
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.3 }}
        >
          <LabExperiment lang={lang} />
        </motion.div>
      </section>

      {/* University course «Математика 1» */}
      <section className="home-section" aria-labelledby="home-math1-title">
        <Reveal>
          <button
            type="button"
            className="panel panel--instrument m1-promo"
            onClick={() => {
              playSmoothSound();
              onNav('math1');
            }}
          >
            <span className="eyebrow">{t('m1_eyebrow')}</span>
            <span id="home-math1-title" className="m1-promo__title">
              {t('m1_home_title')}
            </span>
            <span className="m1-promo__desc">{t('m1_home_desc')}</span>
            <span className="rule-link m1-promo__cta">
              <span>{t('m1_home_cta')}</span>
              <ArrowUpRight size={18} aria-hidden="true" className="rule-link__arrow" />
            </span>
          </button>
        </Reveal>
      </section>

      {/* Depth levels */}
      <section className="home-section" aria-labelledby="home-depth-title">
        <Reveal>
          <p className="eyebrow eyebrow--muted">{t('home_depth_eyebrow')}</p>
          <h2 id="home-depth-title" className="section-title home-section__title">
            {t('home_depth_title')}
          </h2>
          <p className="lead">{t('home_depth_lead')}</p>
        </Reveal>
        <ol className="depth-levels">
          {levels.map((l, i) => (
            <Reveal as="li" index={i} key={l.n} className="depth-level">
              <span className="depth-level__num display" aria-hidden="true">
                {l.n}
              </span>
              <h3 className="depth-level__title">{l.title}</h3>
              <p className="depth-level__desc">{l.desc}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Course catalog */}
      <section className="home-section" aria-labelledby="home-courses-title">
        <Reveal>
          <p className="eyebrow eyebrow--muted">{t('home_catalog_eyebrow')}</p>
          <h2 id="home-courses-title" className="section-title home-section__title">
            {t('home_courses')}
          </h2>
        </Reveal>
        <ol className="course-list">
          {COURSES.map((c, i) => {
            const done = (progress[c.id] || []).filter(Boolean).length;
            const total = c.lessons.length;
            const cp = total ? Math.round((done / total) * 100) : 0;
            return (
              <Reveal as="li" index={i} key={c.id}>
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
              </Reveal>
            );
          })}
        </ol>
      </section>

      {/* Tools */}
      <section className="home-section" aria-labelledby="home-tools-title">
        <Reveal>
          <p className="eyebrow eyebrow--muted">{t('home_tools_eyebrow')}</p>
          <h2 id="home-tools-title" className="section-title home-section__title">
            {t('home_tools_title')}
          </h2>
        </Reveal>
        <ul className="tool-grid">
          {tools.map((item, i) => (
            <Reveal as="li" index={i} key={item.page}>
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
            </Reveal>
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
        <Reveal as="li" index={i} key={i} className="reference-item">
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
        </Reveal>
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
