'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, ChevronDown, ArrowRight, BookOpen, RotateCcw, X as XIcon } from 'lucide-react';
import { Language } from '../../lib/storage';
import { Block, Example, Lecture, MATH1_SYLLABUS } from '../../data/math1';
import { COURSES } from '../../data/courses';
import { fmt } from '../../data/i18n-lab';
import { SegmentedTabs } from '../ui/SegmentedTabs';
import { Reveal } from '../ui/Reveal';
import { scrollToStudyTarget } from './studyScroll';
import { MathText, TexBlock, shuffledIndices, useT } from './shared';
import { LectureVisual } from './visuals';
import { Trainer } from './Trainer';
import { playSuccessSound } from '../../lib/sound';
import { useReduceMotion } from '../../lib/motionPref';
import { lectureSections, type StudyTarget } from '../../data/math1/search';

type Tab = 'theory' | 'practice' | 'check';

function ExampleCard({ example, lang }: { example: Example; lang: Language }) {
  const t = useT(lang);
  const [shown, setShown] = useState(0);
  const total = example.steps.length;
  const done = shown >= total;

  return (
    <div className="example-box m1-example">
      <div className="m1-example__head">
        <b>{example.title[lang]}</b>
        {example.added && <span className="chip">{t('m1_added_example')}</span>}
      </div>
      <MathText as="p" text={example.task[lang]} />
      {example.given && <TexBlock tex={example.given} />}
      {example.steps.slice(0, shown).map((s, i) => (
        <div key={i} className="m1-example__step">
          <span className="m1-example__num mono" aria-hidden="true">
            {i + 1}
          </span>
          <div className="m1-example__body">
            {s.text && <MathText as="p" text={s.text[lang]} />}
            {s.tex && <TexBlock tex={s.tex} />}
          </div>
        </div>
      ))}
      {done && example.answer && (
        <p className="m1-example__answer">
          {t('m1_answer')}: <MathText text={example.answer[lang]} />
        </p>
      )}
      {!done && (
        <div className="m1-visual__controls">
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => setShown(shown + 1)}>
            <ChevronDown size={15} aria-hidden="true" /> {shown === 0 ? t('m1_show_solution') : t('m1_next_step')}
          </button>
          {total > 1 && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShown(total)}>
              {t('m1_all_steps')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function BlockView({ block, lang, headingId }: { block: Block; lang: Language; headingId?: string }) {
  const t = useT(lang);
  switch (block.kind) {
    case 'h':
      return <h3 id={headingId} tabIndex={headingId ? -1 : undefined} className="m1-h">{block.text[lang]}</h3>;
    case 'p':
      return <MathText as="p" className="m1-p" text={block.text[lang]} />;
    case 'def':
      return (
        <div className="m1-def">
          <p className="m1-def__label">
            {t('m1_definition')} · <b>{block.term[lang]}</b>
          </p>
          <MathText as="p" text={block.text[lang]} />
          {block.tex && <TexBlock tex={block.tex} />}
        </div>
      );
    case 'thm':
      return (
        <div className="m1-def m1-def--thm">
          <p className="m1-def__label">
            <b>{block.title[lang]}</b>
          </p>
          <MathText as="p" text={block.text[lang]} />
          {block.tex && <TexBlock tex={block.tex} />}
        </div>
      );
    case 'formula':
      return (
        <div className="formula-box m1-formula">
          <TexBlock tex={block.tex} />
          {(block.tag || block.note) && <span className="m1-formula__tag mono">{block.tag ? `(${block.tag})` : block.note![lang]}</span>}
        </div>
      );
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag className="m1-list">
          {block.items.map((it, i) => (
            <li key={i}>
              <MathText text={it[lang]} />
            </li>
          ))}
        </Tag>
      );
    }
    case 'example':
      return <ExampleCard example={block.example} lang={lang} />;
    case 'note':
      return <MathText as="div" className={block.tone === 'tip' ? 'tip-box' : 'warn-box'} text={block.text[lang]} />;
    case 'visual':
      return <LectureVisual id={block.id} lang={lang} />;
  }
}

function SelfCheck({ lecture, lang }: { lecture: Lecture; lang: Language }) {
  const t = useT(lang);
  const [open, setOpen] = useState<boolean[]>(() => lecture.selfCheck.map(() => false));
  return (
    <ol className="m1-selfcheck">
      {lecture.selfCheck.map((item, i) => (
        <li key={i} className="m1-selfcheck__item">
          <MathText as="p" className="m1-selfcheck__q" text={item.q[lang]} />
          {open[i] ? (
            <MathText as="div" className="m1-selfcheck__a" text={item.a[lang]} />
          ) : (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setOpen(open.map((v, k) => (k === i ? true : v)))}
            >
              <ChevronDown size={15} aria-hidden="true" /> {t('m1_show_answer')}
            </button>
          )}
        </li>
      ))}
    </ol>
  );
}


function LectureTest({ lecture, lang, isDone, onToggleDone, onNext }: Pick<LectureViewProps, 'lecture' | 'lang' | 'isDone' | 'onToggleDone' | 'onNext'>) {
  const t = useT(lang);
  const [orders, setOrders] = useState(() => lecture.test.map(q => shuffledIndices(q.options.length)));
  const [picked, setPicked] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const focusHeading = useRef(false);
  const total = lecture.test.length;
  const question = lecture.test[index];
  const pick = picked[index];
  const score = picked.filter((option, i) => option === lecture.test[i].correct).length;
  const progress = fmt(t('m1_test_question'), { current: index + 1, total });
  const reduce = useReduceMotion();

  useLayoutEffect(() => {
    if (!focusHeading.current || !heading.current) return;
    focusHeading.current = false;
    heading.current.focus({ preventScroll: true });
    scrollToStudyTarget(heading.current.closest<HTMLElement>('.m1-test__card') ?? heading.current, !reduce);
  }, [index, reduce]);

  useEffect(() => {
    if (pick !== undefined) feedback.current?.focus({ preventScroll: true });
  }, [pick]);

  if (!question) {
    return (
      <div className="m1-test__card panel">
        <h4 ref={heading} tabIndex={-1} className="m1-test__text">{t('m1_test_results')}</h4>
        <p className="mono">{fmt(t('m1_test_score'), { score, total })}</p>
        {score < total && (
          <details className="m1-test__review">
            <summary>{t('m1_test_review')}</summary>
            <ol className="m1-selfcheck">
              {lecture.test.map((q, i) => picked[i] !== q.correct && (
                <li key={i} className="m1-selfcheck__item">
                  <MathText as="p" className="m1-selfcheck__q" text={q.q[lang]} />
                  <MathText as="p" text={q.explain[lang]} />
                </li>
              ))}
            </ol>
          </details>
        )}
        <div className="m1-study-actions">
          {isDone ? (
            <span className="chip"><Check size={15} aria-hidden="true" /> {t('lesson_done_state')}</span>
          ) : (
            <button type="button" className="btn btn--primary" onClick={() => {
              playSuccessSound();
              onToggleDone();
            }}>{t('m1_mark_complete')}</button>
          )}
          {onNext && (
            <button type="button" className="btn btn--secondary" onClick={onNext}>
              {t('m1_next_lecture')} <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
          <button type="button" className="btn btn--ghost" onClick={() => {
            focusHeading.current = true;
            setOrders(lecture.test.map(q => shuffledIndices(q.options.length)));
            setPicked([]);
            setIndex(0);
          }}>
            <RotateCcw size={15} aria-hidden="true" /> {t('m1_retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div key={index} className="m1-test__card panel">
      <div className="m1-test__progress">
        <span className="eyebrow eyebrow--muted">{progress}</span>
        <progress value={picked.length} max={total} aria-label={t('m1_test')} />
      </div>
      <h4 id={`${lecture.id}-question`} ref={heading} tabIndex={-1} className="m1-test__text">
        <MathText text={question.q[lang]} />
      </h4>
      <div className="m1-test__options" role="group" aria-labelledby={`${lecture.id}-question`}>
        {orders[index].map((option, position) => {
          const isPicked = pick === option;
          const isCorrect = option === question.correct;
          const answered = pick !== undefined;
          const status = answered && isCorrect ? ' quiz-option--correct' : answered && isPicked ? ' quiz-option--wrong' : '';
          return (
            <button key={option} type="button" className={`choice m1-test__option${status}`} aria-pressed={isPicked}
              disabled={answered} onClick={() => {
                if (isCorrect) playSuccessSound();
                setPicked(previous => previous.length === index ? [...previous, option] : previous);
              }}>
              <span className="choice__key" aria-hidden="true">{String.fromCharCode(65 + position)}</span>
              <MathText text={question.options[option][lang]} />
              {answered && isCorrect && <Check size={16} className="m1-test__mark" aria-label={t('m1_correct_short')} />}
              {answered && isPicked && !isCorrect && <XIcon size={16} className="m1-test__mark" aria-label={t('m1_wrong_short')} />}
            </button>
          );
        })}
      </div>
      {pick !== undefined && (
        <div className="m1-test__feedback" ref={feedback} tabIndex={-1}>
          <p><b>{t(pick === question.correct ? 'm1_test_correct' : 'm1_test_incorrect')}</b></p>
          <MathText as="p" text={question.explain[lang]} />
          <button type="button" className="btn btn--primary" onClick={() => {
            focusHeading.current = true;
            setIndex(index + 1);
          }}>
            {t(index + 1 === total ? 'm1_test_show_results' : 'm1_test_next')} <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

interface LectureViewProps {
  lecture: Lecture;
  jump?: StudyTarget;
  lang: Language;
  isDone: boolean;
  onToggleDone: () => void;
  onOpenRelated: (courseId: string, lessonId: string) => void;
  onNext?: () => void;
}

export function LectureView({ lecture, jump, lang, isDone, onToggleDone, onOpenRelated, onNext }: LectureViewProps) {
  const t = useT(lang);
  const [tab, setTab] = useState<Tab>('theory');
  const [practiceOpened, setPracticeOpened] = useState(false);
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [pendingTarget, setPendingTarget] = useState<StudyTarget>();
  const reduce = useReduceMotion();
  const startHeading = useRef<HTMLHeadingElement>(null);
  const focusStart = useRef(false);
  const canOpenQuiz = quizUnlocked || isDone;
  const tabs: { id: Tab; label: string }[] = [
    { id: 'theory', label: t('m1_tab_theory') },
    { id: 'practice', label: t('m1_tab_practice') },
  ];
  if (canOpenQuiz) tabs.push({ id: 'check', label: t('m1_tab_check') });
  const idPrefix = `m1-${lecture.id}`;
  const sections = lectureSections(lecture);
  const depth = lecture.deepDive ?? [];
  const targetId = (id: string) => `${idPrefix}-${id}`;

  function selectTab(next: Tab) {
    if (next === 'practice') setPracticeOpened(true);
    if (next === 'check') setQuizUnlocked(true);
    setTab(next);
  }

  function goTo(next: 'practice' | 'check') {
    focusStart.current = true;
    selectTab(next);
  }

  function openSection(section: StudyTarget) {
    selectTab(section.tab);
    if (depth.some(item => item.id === section.id)) {
      setExpanded(previous => previous.includes(section.id) ? previous : [...previous, section.id]);
    }
    setPendingTarget(section);
  }

  useEffect(() => {
    if (!jump) return;
    setTab(jump.tab);
    if (jump.tab === 'practice') setPracticeOpened(true);
    if (lecture.deepDive?.some(section => section.id === jump.id)) {
      setExpanded(previous => previous.includes(jump.id) ? previous : [...previous, jump.id]);
    }
    setPendingTarget(jump);
  }, [jump, lecture]);

  useLayoutEffect(() => {
    if (!pendingTarget || tab !== pendingTarget.tab) return;
    const target = document.getElementById(`${idPrefix}-${pendingTarget.id}`);
    if (!target) return;
    target.focus({ preventScroll: true });
    scrollToStudyTarget(target, !reduce);
    setPendingTarget(undefined);
  }, [pendingTarget, tab, idPrefix, reduce]);

  useLayoutEffect(() => {
    if (!focusStart.current || !startHeading.current) return;
    focusStart.current = false;
    startHeading.current.focus({ preventScroll: true });
    scrollToStudyTarget(startHeading.current, !reduce);
  }, [tab, reduce]);

  return (
    <article className="lesson m1-lecture" aria-labelledby={`${idPrefix}-title`}>
      <p className="eyebrow eyebrow--muted">
        {fmt(t('m1_lecture_n'), { n: String(lecture.number).padStart(2, '0') })} / {String(MATH1_SYLLABUS.length).padStart(2, '0')}
      </p>
      <h2 id={`${idPrefix}-title`} className="lesson__title" tabIndex={-1}>
        {lecture.title[lang]}
      </h2>
      <p className="lesson__summary">{lecture.summary[lang]}</p>
      <div className="m1-topics">
        {lecture.topics.map((tp, i) => (
          <span key={i} className="chip">
            {tp[lang]}
          </span>
        ))}
      </div>

      <div className="lesson__levels">
        <SegmentedTabs label={t('m1_lecture_parts')} items={tabs} value={tab} onChange={selectTab} idPrefix={idPrefix} />
      </div>

      <div id={`${idPrefix}-panel`} role="tabpanel" aria-labelledby={`${idPrefix}-tab-${tab}`} className="m1-lecture__panel" tabIndex={0}>
        <div className="m1-theory" hidden={tab !== 'theory'}>
          <nav className="m1-contents" aria-label={t('m1_contents')}>
            <p className="eyebrow eyebrow--muted">{t('m1_contents')}</p>
            <ul>
              {[...sections, ...depth].map(section => (
                <li key={section.id}>
                  <button type="button" className="text-link" onClick={() => openSection({ id: section.id, tab: 'theory' })}>
                    {section.title[lang]}
                  </button>
                </li>
              ))}
              <li><button type="button" className="text-link" onClick={() => goTo('practice')}>{t('m1_practice_link')} <ArrowRight size={14} aria-hidden="true" /></button></li>
            </ul>
          </nav>
          {sections.map(section => (
            <Reveal key={section.id} className="m1-study-section" y={8} disabled={reduce}>
              {section.blocks[0]?.kind !== 'h' && <h3 id={targetId(section.id)} tabIndex={-1} className="sr-only">{section.title[lang]}</h3>}
              {section.blocks.map((block, j) => <BlockView key={j} block={block} lang={lang} headingId={j === 0 ? targetId(section.id) : undefined} />)}
            </Reveal>
          ))}
          {depth.length > 0 && (
            <section className="m1-depth" aria-labelledby={targetId('depth')}>
              <h3 id={targetId('depth')} className="m1-h">{t('m1_depth')}</h3>
              <p className="field-help">{t('m1_depth_help')}</p>
              {depth.map(section => {
                const isOpen = expanded.includes(section.id);
                const id = targetId(section.id);
                return (
                  <Reveal key={section.id} className="m1-study-section" y={8} disabled={reduce}>
                    <section className="m1-depth-card" data-open={isOpen}>
                      <h4>
                        <button id={id} type="button" className="m1-depth-card__trigger" aria-expanded={isOpen} aria-controls={id + '-body'}
                          onClick={() => setExpanded(previous => isOpen ? previous.filter(key => key !== section.id) : [...previous, section.id])}>
                          <span>{section.title[lang]}</span>
                          <ChevronDown size={18} aria-hidden="true" />
                        </button>
                      </h4>
                      <p className="m1-depth-card__summary">{section.summary[lang]}</p>
                      <div id={id + '-body'} className="m1-depth-card__disclosure" inert={!isOpen}>
                        <div className="m1-depth-card__clip">
                          <div className="m1-depth-card__body">
                            {section.blocks.map((block, i) => <BlockView key={i} block={block} lang={lang} />)}
                          </div>
                        </div>
                      </div>
                    </section>
                  </Reveal>
                );
              })}
            </section>
          )}
          <div className="m1-study-actions">
            <button type="button" className="btn btn--primary" onClick={() => goTo('practice')}>
              {t('m1_go_practice')} <ArrowRight size={16} aria-hidden="true" />
            </button>
            {!canOpenQuiz && <p className="field-help">{t('m1_test_unlock_hint')}</p>}
          </div>
        </div>

        {practiceOpened && (
          <div className="m1-practice" hidden={tab !== 'practice'}>
            <h3 ref={tab === 'practice' ? startHeading : undefined} tabIndex={-1} className="m1-h">
              {t('m1_tab_practice')}
            </h3>
            <p className="eyebrow eyebrow--muted">{fmt(t('m1_practice_sessions'), { s: lecture.practice.sessions })}</p>
            <p className="m1-p">
              <b>{t('m1_goal')}:</b> {lecture.practice.goal[lang]}
            </p>
            <div className="m1-questions">
              <p className="m1-def__label">{t('m1_questions')}</p>
              <ol>
                {lecture.practice.questions.map((q, i) => (
                  <li key={i}>
                    <MathText text={q[lang]} />
                  </li>
                ))}
              </ol>
            </div>
            {lecture.practice.examples.map((ex, i) => (
              <Reveal key={i} className="m1-study-section" y={8} disabled={reduce}>
                <div id={targetId('example-' + i)} tabIndex={-1} aria-label={ex.title[lang]}>
                  <ExampleCard example={ex} lang={lang} />
                </div>
              </Reveal>
            ))}
            <h3 className="m1-h">{t('m1_trainer')}</h3>
            <p className="field-help">{t('m1_trainer_lead')}</p>
            <Trainer lang={lang} kinds={lecture.trainers} compact />
            <h3 className="m1-h">{t('m1_selfcheck')}</h3>
            <SelfCheck lecture={lecture} lang={lang} />
            <div className="m1-study-actions">
              <button type="button" className="btn btn--primary" onClick={() => {
                goTo('check');
              }}>
                {t('m1_start_test')} <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {canOpenQuiz && (
          <div className="m1-check" hidden={tab !== 'check'}>
            <h3 ref={tab === 'check' ? startHeading : undefined} tabIndex={-1} className="m1-h">{t('m1_test')}</h3>
            <LectureTest lecture={lecture} lang={lang} isDone={isDone} onToggleDone={onToggleDone} onNext={onNext} />
          </div>
        )}
      </div>

      <div className="lesson__actions">
        {isDone && tab !== 'check' && (
          <button type="button" className="btn btn--secondary" aria-pressed="true" onClick={onToggleDone}>
            <Check size={15} aria-hidden="true" /> {t('lesson_done_state')}
          </button>
        )}
        {isDone && tab !== 'check' && onNext && (
          <button type="button" className="btn btn--secondary" onClick={onNext}>
            {t('m1_next_lecture')} <ArrowRight size={16} aria-hidden="true" />
          </button>
        )}
        {lecture.related.map((rel) => {
          const course = COURSES.find((c) => c.id === rel.courseId);
          const lesson = course?.lessons.find((l) => l.id === rel.lessonId);
          if (!course || !lesson) return null;
          return (
            <button key={rel.lessonId} type="button" className="btn btn--ghost" onClick={() => onOpenRelated(rel.courseId, rel.lessonId)}>
              <BookOpen size={16} aria-hidden="true" />
              {fmt(t('m1_related'), { title: lesson.title[lang] })}
            </button>
          );
        })}
      </div>
    </article>
  );
}
