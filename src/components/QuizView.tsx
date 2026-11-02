'use client';

import React, { useState } from 'react';
import { Check, X, ArrowLeft, ArrowRight, RotateCcw, ListChecks } from 'lucide-react';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { fmt } from '../data/i18n-lab';
import { COURSES } from '../data/courses';
import { QUIZ_BANK, QuizItem } from '../data/quiz';
import { MathSprint } from './MathSprint';
import { FormulaTrainer } from './FormulaTrainer';
import { SegmentedTabs } from './ui/SegmentedTabs';
import { playClickSound, playSuccessSound } from '../lib/sound';
import { labConfetti } from '../lib/celebrate';
import { useAuth } from '../lib/auth-context';

interface QuizViewProps {
  lang: Language;
  onUpdateBestScore: (score: number) => void;
}

type Mode = 'quiz' | 'sprint' | 'cards';

export function QuizView({ lang, onUpdateBestScore }: QuizViewProps) {
  const { recordQuiz } = useAuth();
  const [mode, setMode] = useState<Mode>('quiz');
  const [quizCount, setQuizCount] = useState<number>(5);
  const [quizTopic, setQuizTopic] = useState<string>('all');
  const [activeQuiz, setActiveQuiz] = useState<{
    topic: string;
    startedAt: number;
    questions: QuizItem[];
    currentIndex: number;
    userAnswers: number[];
    isFinished: boolean;
    isReviewing: boolean;
  } | null>(null);

  const t = (k: string) => I18N[lang][k] || k;

  function shuffle<T>(array: T[]): T[] {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const startQuiz = () => {
    const topics = quizTopic === 'all' ? Object.keys(QUIZ_BANK) : [quizTopic];
    let pool: QuizItem[] = [];

    topics.forEach((tp) => {
      if (QUIZ_BANK[tp]) {
        pool.push(...QUIZ_BANK[tp]);
      }
    });

    const selected = shuffle(pool).slice(0, quizCount).map((q) => {
      // Shuffle answer options
      const originalOptions = q.a[lang];
      const indices = shuffle(originalOptions.map((_, i) => i));
      const shuffledOptions = indices.map((i) => originalOptions[i]);
      const newCorrectIndex = indices.indexOf(q.c);

      return {
        ...q,
        a: {
          ...q.a,
          [lang]: shuffledOptions,
        },
        c: newCorrectIndex,
      };
    });

    setActiveQuiz({
      topic: quizTopic,
      startedAt: Date.now(),
      questions: selected,
      currentIndex: 0,
      userAnswers: new Array(selected.length).fill(-1),
      isFinished: false,
      isReviewing: false,
    });
  };

  const selectAnswer = (ansIdx: number) => {
    if (!activeQuiz || activeQuiz.isFinished) return;
    const updated = [...activeQuiz.userAnswers];
    updated[activeQuiz.currentIndex] = ansIdx;
    setActiveQuiz({
      ...activeQuiz,
      userAnswers: updated,
    });
  };

  const finishQuiz = () => {
    if (!activeQuiz) return;
    let correctCount = 0;
    activeQuiz.questions.forEach((q, i) => {
      if (activeQuiz.userAnswers[i] === q.c) {
        correctCount++;
      }
    });

    const pct = Math.round((correctCount / activeQuiz.questions.length) * 100);
    onUpdateBestScore(pct);
    // Saves the attempt to the account (history, analytics, XP, achievements); no-op when signed out
    recordQuiz(activeQuiz.topic, correctCount, activeQuiz.questions.length, Math.round((Date.now() - activeQuiz.startedAt) / 1000));

    if (pct >= 80) {
      playSuccessSound();
      labConfetti();
    }

    setActiveQuiz({
      ...activeQuiz,
      isFinished: true,
    });
  };

  // If no quiz is running, show setup or selected mode
  if (!activeQuiz) {
    const modes: { id: Mode; label: string }[] = [
      { id: 'quiz', label: t('quiz_mode_quiz') },
      { id: 'sprint', label: t('quiz_mode_sprint') },
      { id: 'cards', label: t('quiz_mode_cards') },
    ];
    const topicOptions = [{ id: 'all', label: t('quiz_all') }, ...COURSES.map((c) => ({ id: c.id, label: c.title[lang] }))];

    return (
      <div>
        <SegmentedTabs
          label={t('quiz_modes_label')}
          items={modes}
          value={mode}
          idPrefix="quiz"
          scroll
          onChange={(id) => {
            setMode(id);
            playClickSound();
          }}
        />

        <div key={mode} id="quiz-panel" role="tabpanel" aria-labelledby={`quiz-tab-${mode}`} className="reveal" style={{ marginTop: '20px' }}>
          {mode === 'sprint' && <MathSprint />}
          {mode === 'cards' && <FormulaTrainer />}

          {mode === 'quiz' && (
            <div className="panel panel--instrument quiz-setup">
              <fieldset className="quiz-setup__group">
                <legend className="field-label">{t('quiz_count')}</legend>
                <div className="seg-tabs">
                  {[5, 10, 15].map((n) => (
                    <button key={n} type="button" className="seg-tab" aria-pressed={quizCount === n} onClick={() => setQuizCount(n)}>
                      {fmt(t('quiz_n'), { n })}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="quiz-setup__group">
                <legend className="field-label">{t('quiz_topics')}</legend>
                <div className="quiz-topics">
                  {topicOptions.map((opt) => (
                    <button key={opt.id} type="button" className="choice" aria-pressed={quizTopic === opt.id} onClick={() => setQuizTopic(opt.id)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <button type="button" className="btn btn--primary" onClick={startQuiz}>
                {t('quiz_start')}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Finished state
  if (activeQuiz.isFinished && !activeQuiz.isReviewing) {
    let ok = 0;
    activeQuiz.questions.forEach((q, i) => {
      if (activeQuiz.userAnswers[i] === q.c) ok++;
    });
    const total = activeQuiz.questions.length;
    const pct = Math.round((ok / total) * 100);
    const msgKey = pct >= 90 ? 'quiz_great' : pct >= 70 ? 'quiz_good' : pct >= 50 ? 'quiz_ok' : 'quiz_bad';

    return (
      <section className="panel panel--instrument quiz-result reveal" aria-labelledby="quiz-result-title" role="status">
        <p className="eyebrow eyebrow--muted" id="quiz-result-title">
          {t('quiz_done')}
        </p>
        <p className="quiz-result__score display">{pct}%</p>
        <p className="quiz-result__count">
          {t('quiz_correct')}: <b className="mono">{ok} / {total}</b>
        </p>
        <p className="lead" style={{ margin: '10px 0 24px' }}>
          {t(msgKey)}
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn--primary" onClick={() => setActiveQuiz({ ...activeQuiz, isReviewing: true })}>
            <ListChecks size={16} aria-hidden="true" />
            {t('quiz_review')}
          </button>
          <button type="button" className="btn btn--secondary" onClick={() => setActiveQuiz(null)}>
            <RotateCcw size={16} aria-hidden="true" />
            {t('quiz_new')}
          </button>
        </div>
      </section>
    );
  }

  // Review mode
  if (activeQuiz.isReviewing) {
    return (
      <div className="quiz-review">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
          <h2 className="calc-panel__title" style={{ marginBottom: 0 }}>
            {t('quiz_review')}
          </h2>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setActiveQuiz(null)}>
            <RotateCcw size={14} aria-hidden="true" />
            {t('quiz_new')}
          </button>
        </div>

        <ol className="quiz-review__list">
          {activeQuiz.questions.map((q, idx) => {
            const userPick = activeQuiz.userAnswers[idx];
            const isCorrect = userPick === q.c;

            return (
              <li key={idx} className={`quiz-review__item ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
                <p className="quiz-review__q">
                  <span className="mono">{String(idx + 1).padStart(2, '0')}</span> {q.q[lang]}
                </p>
                <ul className="quiz-review__options">
                  {q.a[lang].map((opt, optIdx) => {
                    const correct = optIdx === q.c;
                    const wrongPick = optIdx === userPick && !isCorrect;
                    return (
                      <li key={optIdx} className={`quiz-option${correct ? ' quiz-option--correct' : ''}${wrongPick ? ' quiz-option--wrong' : ''}`}>
                        <span>
                          <span className="mono">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                        </span>
                        {correct && (
                          <span className="quiz-option__tag">
                            <Check size={14} aria-hidden="true" /> {t('quiz_correct_mark')}
                          </span>
                        )}
                        {wrongPick && (
                          <span className="quiz-option__tag">
                            <X size={14} aria-hidden="true" /> {t('quiz_your_answer')}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {q.explanation && <p className="quiz-review__expl">{q.explanation[lang]}</p>}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  // Active Question Card
  const curQ = activeQuiz.questions[activeQuiz.currentIndex];
  const curPct = (activeQuiz.currentIndex / activeQuiz.questions.length) * 100;
  const curSelected = activeQuiz.userAnswers[activeQuiz.currentIndex];

  return (
    <section className="panel panel--instrument quiz-card" aria-labelledby="quiz-question">
      <div className="quiz-card__meta">
        <span className="mono">
          {t('quiz_q')} {activeQuiz.currentIndex + 1} {t('quiz_of')} {activeQuiz.questions.length}
        </span>
        <span className="mono">{Math.round(curPct)}%</span>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={activeQuiz.questions.length}
        aria-valuenow={activeQuiz.currentIndex}
        style={{ marginBottom: '24px' }}
      >
        <div className="progress-fill" style={{ width: `${curPct}%` }} />
      </div>

      <h2 id="quiz-question" key={activeQuiz.currentIndex} className="quiz-card__q reveal">
        {curQ.q[lang]}
      </h2>

      <div className="quiz-card__options" role="group" aria-labelledby="quiz-question">
        {curQ.a[lang].map((opt, i) => (
          <button key={i} type="button" className="choice" aria-pressed={curSelected === i} onClick={() => selectAnswer(i)}>
            <span className="choice__key" aria-hidden="true">
              {String.fromCharCode(65 + i)}
            </span>
            <span>{opt}</span>
          </button>
        ))}
      </div>

      <div className="quiz-card__nav">
        <button
          type="button"
          className="btn btn--secondary"
          disabled={activeQuiz.currentIndex === 0}
          onClick={() => setActiveQuiz({ ...activeQuiz, currentIndex: activeQuiz.currentIndex - 1 })}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {t('quiz_prev')}
        </button>

        {activeQuiz.currentIndex === activeQuiz.questions.length - 1 ? (
          <button type="button" className="btn btn--primary" onClick={finishQuiz}>
            <Check size={16} aria-hidden="true" />
            {t('quiz_finish')}
          </button>
        ) : (
          <button type="button" className="btn btn--primary" onClick={() => setActiveQuiz({ ...activeQuiz, currentIndex: activeQuiz.currentIndex + 1 })}>
            {t('quiz_next')}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}
