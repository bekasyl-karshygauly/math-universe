'use client';

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Search } from 'lucide-react';
import { Language } from '../../lib/storage';
import { MATH1_GLOSSARY, MATH1_LECTURES, MATH1_META, MATH1_SYLLABUS } from '../../data/math1';
import { fmt } from '../../data/i18n-lab';
import { PageHeader } from '../ui/PageHeader';
import { SegmentedTabs } from '../ui/SegmentedTabs';
import { useReduceMotion } from '../../lib/motionPref';
import { playSmoothSound } from '../../lib/sound';
import { LectureView } from './LectureView';
import { VariantWork } from './VariantWork';
import { Trainer, ALL_TRAINER_GROUPS } from './Trainer';
import { Tex, useT } from './shared';
import { TopicSearch } from './TopicSearch';
import type { StudyTarget } from '../../data/math1/search';
import { scrollToStudyTarget } from './studyScroll';

type HubTab = 'lectures' | 'variant' | 'trainer' | 'glossary';

function focusLecture(panel: HTMLElement | null, smooth: boolean) {
  const lecture = panel?.querySelector<HTMLElement>('.m1-lecture');
  const title = lecture?.querySelector<HTMLElement>('.lesson__title');
  if (!lecture || !title) return;
  title.focus({ preventScroll: true });
  scrollToStudyTarget(lecture, smooth);
}

interface Math1ViewProps {
  lang: Language;
  progress: boolean[];
  onToggleProgress: (lectureIndex: number) => void;
  onOpenCourse: (courseId: string, lessonId: string) => void;
}

function Glossary({ lang, onOpenLecture }: { lang: Language; onOpenLecture: (n: number) => void }) {
  const t = useT(lang);
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const rows = MATH1_GLOSSARY.filter((g) => !query || Object.values(g.term).some((s) => s.toLowerCase().includes(query)));

  return (
    <div className="m1-glossary">
      <p className="field-help">{t('m1_glossary_lead')}</p>
      <div className="catalog-search">
        <label className="field-label" htmlFor="m1-glossary-search">
          {t('m1_glossary_search')}
        </label>
        <div className="catalog-search__box">
          <Search size={18} aria-hidden="true" className="catalog-search__icon" />
          <input id="m1-glossary-search" type="search" className="field-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="анықтауыш / определитель / determinant" />
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="empty-state">{t('search_empty')}</p>
      ) : (
        <div className="scroll-x">
          <table className="data-table m1-glossary__table">
            <thead>
              <tr>
                <th scope="col">Қазақша</th>
                <th scope="col">Русский</th>
                <th scope="col">English</th>
                <th scope="col">{t('m1_formula')}</th>
                <th scope="col">{t('m1_lecture_short')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((g) => (
                <tr key={g.term.en}>
                  <td lang="kk">{g.term.kz}</td>
                  <td lang="ru">{g.term.ru}</td>
                  <td lang="en">{g.term.en}</td>
                  <td>{g.tex ? <Tex tex={g.tex} /> : '—'}</td>
                  <td>
                    <button type="button" className="text-link" onClick={() => onOpenLecture(g.lecture)}>
                      {g.lecture}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function Math1View({ lang, progress, onToggleProgress, onOpenCourse }: Math1ViewProps) {
  const t = useT(lang);
  const reduceMotion = useReduceMotion();
  const [tab, setTab] = useState<HubTab>('lectures');
  const [open, setOpen] = useState(() => {
    const firstUnread = MATH1_LECTURES.findIndex((_, i) => !progress[i]);
    return firstUnread === -1 ? 0 : firstUnread;
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const jumpToLecture = useRef(false);
  const [studyJump, setStudyJump] = useState<StudyTarget>();

  const done = MATH1_LECTURES.filter((_, i) => progress[i]).length;
  const total = MATH1_LECTURES.length;
  const lecture = MATH1_LECTURES[open];

  useLayoutEffect(() => {
    if (tab !== 'lectures' || !jumpToLecture.current) return;
    jumpToLecture.current = false;
    focusLecture(contentRef.current, !reduceMotion);
  }, [open, tab, reduceMotion]);

  const openLecture = (idx: number, fromContent = false) => {
    setStudyJump(undefined);
    playSmoothSound();
    if (idx === open && tab === 'lectures') {
      if (fromContent) focusLecture(contentRef.current, !reduceMotion);
      return;
    }
    jumpToLecture.current = true;
    setTab('lectures');
    setOpen(idx);
  };

  const tabs = useMemo(
    () => [
      { id: 'lectures' as const, label: t('m1_tab_lectures') },
      { id: 'variant' as const, label: t('m1_tab_variant') },
      { id: 'trainer' as const, label: t('m1_tab_trainer') },
      { id: 'glossary' as const, label: t('m1_tab_glossary') },
    ],
    [lang] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className="m1">
      <PageHeader eyebrow={t('m1_eyebrow')} title={MATH1_META.title[lang]} lead={t('m1_lead')} />
      <div className="m1-credit">
        <p>
          {t('m1_based_on')} <b>{MATH1_META.author[lang]}</b> · {MATH1_META.university[lang]} · {MATH1_META.year}
        </p>
        <div className="lesson-view__progress">
          <span className="mono">{fmt(t('lesson_course_progress'), { done, total })}</span>
          <span className="progress-track" aria-hidden="true">
            <span className="progress-fill" style={{ display: 'block', width: `${(done / total) * 100}%` }} />
          </span>
        </div>
      </div>

      <TopicSearch lang={lang} onOpen={(lectureIndex, target) => {
        jumpToLecture.current = false;
        setTab('lectures');
        setOpen(lectureIndex);
        setStudyJump({ id: target.id, tab: target.tab });
      }} />

      <div className="m1-hub-tabs">
        <SegmentedTabs label={t('m1_sections')} items={tabs} value={tab} onChange={(id) => setTab(id)} idPrefix="m1-hub" scroll />
      </div>

      <div ref={contentRef} id="m1-hub-panel" role="tabpanel" aria-labelledby={`m1-hub-tab-${tab}`}>
        {tab === 'lectures' && (
          <div className="lesson-grid m1-study-grid">
            <nav className="lesson-outline m1-scroll-pane" aria-label={t('m1_syllabus')} tabIndex={0}>
              <ol>
                {MATH1_LECTURES.map((s, idx) => {
                  const read = !!progress[idx];
                  return (
                    <li key={s.number}>
                      <button
                        type="button"
                        className="lesson-outline__item"
                        aria-current={idx === open ? 'true' : undefined}
                        onClick={() => openLecture(idx)}
                      >
                        <span className="lesson-outline__num mono">
                          {String(s.number).padStart(2, '0')}
                        </span>
                        <span className="lesson-outline__title">
                          {s.title[lang]}
                        </span>
                        {idx === open && (
                          <motion.span
                            layoutId="outline-math1"
                            className="lesson-outline__indicator"
                            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                            aria-hidden="true"
                          />
                        )}
                        {read && (
                          <span className="m1-outline__status" title={t('lesson_done_state')}>
                            <Check size={14} aria-hidden="true" />
                            <span className="sr-only">{t('lesson_done_state')}</span>
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
              <details className="m1-syllabus">
                <summary>{t('m1_upcoming')}</summary>
                <ol start={total + 1}>
                  {MATH1_SYLLABUS.slice(total).map((s) => <li key={s.number}>{s.title[lang]}</li>)}
                </ol>
              </details>
            </nav>
            <div className="m1-reader m1-scroll-pane" role="region" aria-label={lecture.title[lang]} tabIndex={0}>
              <LectureView
                key={lecture.id}
                lecture={lecture}
                jump={studyJump}
                lang={lang}
                isDone={!!progress[open]}
                onToggleDone={() => onToggleProgress(open)}
                onOpenRelated={onOpenCourse}
                onNext={open + 1 < MATH1_LECTURES.length ? () => openLecture(open + 1, true) : undefined}
              />
            </div>
          </div>
        )}

        {tab === 'variant' && <VariantWork lang={lang} />}

        {tab === 'trainer' && (
          <div className="m1-trainers">
            <p className="field-help">{t('m1_trainer_lead')}</p>
            {ALL_TRAINER_GROUPS.map((g) => (
              <section key={g.lecture} className="m1-trainers__group" aria-label={MATH1_SYLLABUS[g.lecture - 1].title[lang]}>
                <p className="eyebrow eyebrow--muted">
                  {fmt(t('m1_lecture_n'), { n: String(g.lecture).padStart(2, '0') })} · {MATH1_SYLLABUS[g.lecture - 1].title[lang]}
                </p>
                <Trainer lang={lang} kinds={g.kinds} />
              </section>
            ))}
          </div>
        )}

        {tab === 'glossary' && <Glossary lang={lang} onOpenLecture={(n) => openLecture(n - 1, true)} />}
      </div>
    </div>
  );
}
