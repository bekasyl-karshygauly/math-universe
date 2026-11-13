'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import type { Language } from '../../lib/storage';
import type { TestQuestion } from '../../data/math1/types';
import { fmt } from '../../data/i18n-lab';
import { playSuccessSound } from '../../lib/sound';
import { useReduceMotion } from '../../lib/motionPref';
import { MathText, shuffledIndices, useT } from './shared';
import { scrollToStudyTarget } from './studyScroll';

interface StudyQuizProps {
  id: string;
  questions: TestQuestion[];
  label: string;
  lang: Language;
  resultActions?: ReactNode;
}

export function StudyQuiz({ id, questions, label, lang, resultActions }: StudyQuizProps) {
  const t = useT(lang);
  const [orders, setOrders] = useState(() => questions.map(q => shuffledIndices(q.options.length)));
  const [picked, setPicked] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const focusHeading = useRef(false);
  const total = questions.length;
  const question = questions[index];
  const pick = picked[index];
  const score = picked.filter((option, i) => option === questions[i].correct).length;
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
              {questions.map((q, i) => picked[i] !== q.correct && (
                <li key={i} className="m1-selfcheck__item">
                  <MathText as="p" className="m1-selfcheck__q" text={q.q[lang]} />
                  <MathText as="p" text={q.explain[lang]} />
                </li>
              ))}
            </ol>
          </details>
        )}
        <div className="m1-study-actions">
          {resultActions}
          <button type="button" className="btn btn--ghost" onClick={() => {
            focusHeading.current = true;
            setOrders(questions.map(q => shuffledIndices(q.options.length)));
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
        <progress value={picked.length} max={total} aria-label={label} />
      </div>
      <h4 id={`${id}-question`} ref={heading} tabIndex={-1} className="m1-test__text">
        <MathText text={question.q[lang]} />
      </h4>
      <div className="m1-test__options" role="group" aria-labelledby={`${id}-question`}>
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
              {answered && isPicked && !isCorrect && <X size={16} className="m1-test__mark" aria-label={t('m1_wrong_short')} />}
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
