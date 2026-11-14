'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReduceMotion } from '../lib/motionPref';
import { ArrowLeft, Check, Lightbulb, ArrowDown } from 'lucide-react';
import { Course, Lesson } from '../data/courses';
import { COURSES } from '../data/courses';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { fmt } from '../data/i18n-lab';
import { KaTeXMath } from './KaTeXMath';
import { MathRenderer } from './MathRenderer';
import { JSXGraphBoard, JSXGraphDemoType } from './visualizations/JSXGraphBoard';
import { NumberSetsVisualizer } from './visualizations/NumberSetsVisualizer';
import { SegmentedTabs } from './ui/SegmentedTabs';
import { scrollToElement } from './LenisProvider';
import { playSmoothSound, playDynamicSound, playSuccessSound, playModalOpenSound } from '../lib/sound';
import { useAuth } from '../lib/auth-context';
import { useStudyActivity } from '../lib/activity';

interface LessonDetailViewProps {
  initialLessonId?: string;
  course: Course;
  lang: Language;
  progress: boolean[];
  lessonLevels: Record<string, 1 | 2 | 3>;
  onToggleProgress: (lessonIndex: number) => void;
  onSetLessonLevel: (lessonId: string, level: 1 | 2 | 3) => void;
  onOpenWhyItWorks: (whyItWorksId: string) => void;
  onBack: () => void;
}

// Interactive diagrams embedded in specific lessons from level 2 on
const DEMOS: Record<string, { type: JSXGraphDemoType; titleKey: string }> = {
  derivative: { type: 'derivative', titleKey: 'demo_tangent' },
  trigonometry: { type: 'unit_circle', titleKey: 'demo_unit_circle' },
  integrals: { type: 'riemann', titleKey: 'demo_riemann' },
};

export function LessonDetailView({
  initialLessonId,
  course,
  lang,
  progress,
  lessonLevels,
  onToggleProgress,
  onSetLessonLevel,
  onOpenWhyItWorks,
  onBack,
}: LessonDetailViewProps) {
  const t = (k: string) => I18N[lang][k] || k;
  const reduceMotion = useReduceMotion();
  // Start at the first unread lesson
  const [openIndex, setOpenIndex] = useState<number>(() => {
    const requested = course.lessons.findIndex((lesson) => lesson.id === initialLessonId);
    if (requested !== -1) return requested;
    const firstUnread = course.lessons.findIndex((_, i) => !progress[i]);
    return firstUnread === -1 ? 0 : firstUnread;
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  useStudyActivity(user?.id, course.id, openIndex);

  const done = course.lessons.filter((_, i) => progress[i]).length;
  const total = course.lessons.length;
  const courseNumber = COURSES.findIndex((c) => c.id === course.id) + 1;

  const lesson: Lesson = course.lessons[openIndex];
  const isDone = progress[openIndex] || false;
  const currentLevel = lessonLevels[lesson.id] || 1;
  const tier = currentLevel === 1 ? lesson.level1 : currentLevel === 2 ? lesson.level2 : lesson.level3;
  const demo = DEMOS[lesson.id];

  const selectLesson = (idx: number) => {
    playSmoothSound();
    setOpenIndex(idx);
    // On narrow screens the outline sits above the text: bring the lesson into view
    if (window.matchMedia('(max-width: 860px)').matches) {
      if (contentRef.current) scrollToElement(contentRef.current, !reduceMotion);
    }
  };

  const levelItems = ([1, 2, 3] as const).map((lvl) => ({ id: String(lvl) as '1' | '2' | '3', label: t(`level_${lvl}`) }));

  return (
    <div className="lesson-view">
      <header className="lesson-view__header">
        <button
          type="button"
          className="btn btn--ghost btn--sm lesson-view__back"
          onClick={() => {
            playSmoothSound();
            onBack();
          }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {t('nav_courses')}
        </button>
        <p className="eyebrow eyebrow--muted">
          {t('courses_eyebrow')} · {String(courseNumber).padStart(2, '0')}
        </p>
        <h1 className="page-header__title">{course.title[lang]}</h1>
        <p className="lead">{course.desc[lang]}</p>
        <div className="lesson-view__progress">
          <span className="mono">{fmt(t('lesson_course_progress'), { done, total })}</span>
          <span className="progress-track" aria-hidden="true">
            <span className="progress-fill" style={{ display: 'block', width: `${total ? (done / total) * 100 : 0}%` }} />
          </span>
        </div>
      </header>

      <div className="lesson-grid">
        <nav className="lesson-outline" aria-label={course.title[lang]}>
          <ol>
            {course.lessons.map((l, idx) => {
              const read = progress[idx] || false;
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    className="lesson-outline__item"
                    aria-current={idx === openIndex ? 'true' : undefined}
                    onClick={() => selectLesson(idx)}
                  >
                    <span className="lesson-outline__num mono" aria-hidden="true">
                      {read ? <Check size={14} /> : String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="lesson-outline__title">{l.title[lang]}</span>
                    {idx === openIndex && (
                      <motion.span
                        layoutId={`outline-${course.id}`}
                        className="lesson-outline__indicator"
                        transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                        aria-hidden="true"
                      />
                    )}
                    {read && <span className="sr-only">{t('lesson_done_state')}</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <article ref={contentRef} className="lesson" aria-labelledby={`lesson-${lesson.id}-title`}>
          <p className="eyebrow eyebrow--muted">
            {String(openIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            {lesson.whyItWorksId && <span className="chip chip--accent lesson__badge">{t('lesson_derivation')}</span>}
          </p>
          <h2 id={`lesson-${lesson.id}-title`} className="lesson__title">
            {lesson.title[lang]}
          </h2>

          <div className="lesson__levels">
            <SegmentedTabs
              label={t('lesson_levels_label')}
              items={levelItems}
              value={String(currentLevel) as '1' | '2' | '3'}
              idPrefix={`lesson-${lesson.id}`}
              onChange={(id) => {
                playDynamicSound();
                onSetLessonLevel(lesson.id, Number(id) as 1 | 2 | 3);
              }}
            />
            <p className="field-help">{t(`level_${currentLevel}_desc`)}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${lesson.id}-lvl-${currentLevel}`}
              id={`lesson-${lesson.id}-panel`}
              role="tabpanel"
              aria-labelledby={`lesson-${lesson.id}-tab-${currentLevel}`}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.2, 0, 0, 1] }}
            >
              <p className="lesson__summary">{tier.summary[lang]}</p>

              {lesson.id === 'numbers' && currentLevel === 1 && <NumberSetsVisualizer lang={lang} />}

              <MathRenderer content={tier.contentHtml[lang]} />

              {tier.formulas.length > 0 && (
                <section className="lesson__formulas" aria-label={t('lesson_formulas')}>
                  <p className="eyebrow eyebrow--muted">{t('lesson_formulas')}</p>
                  {tier.formulas.map((f, i) => (
                    <div key={i} className="scroll-x">
                      <KaTeXMath math={f} block />
                    </div>
                  ))}
                </section>
              )}

              {demo && currentLevel >= 2 && (
                <section className="panel panel--instrument lesson__demo" aria-label={t(demo.titleKey)}>
                  <div className="panel__top">
                    <span>{t('lesson_interactive')}</span>
                    <span>{t(demo.titleKey)}</span>
                  </div>
                  <JSXGraphBoard type={demo.type} height={340} lang={lang} />
                </section>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="lesson__actions">
            <button
              type="button"
              className={isDone ? 'btn btn--secondary' : 'btn btn--primary'}
              aria-pressed={isDone}
              onClick={() => {
                if (!isDone) playSuccessSound();
                onToggleProgress(openIndex);
              }}
            >
              {isDone && <Check size={16} aria-hidden="true" />}
              {isDone ? t('lesson_done_state') : t('mark_read')}
            </button>

            {currentLevel < 3 && (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  playDynamicSound();
                  onSetLessonLevel(lesson.id, (currentLevel + 1) as 2 | 3);
                }}
              >
                <ArrowDown size={16} aria-hidden="true" />
                {t('explore_deeper')} · {fmt(t('lesson_next_level'), { n: currentLevel + 1 })}
              </button>
            )}

            {lesson.whyItWorksId && (
              <button
                type="button"
                className="btn btn--ghost lesson__why"
                onClick={() => {
                  playModalOpenSound();
                  onOpenWhyItWorks(lesson.whyItWorksId!);
                }}
              >
                <Lightbulb size={16} aria-hidden="true" />
                {t('why_it_works')}
              </button>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
