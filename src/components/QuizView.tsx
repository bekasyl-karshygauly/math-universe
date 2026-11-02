'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { COURSES } from '../data/courses';
import { QUIZ_BANK, QuizItem } from '../data/quiz';
import { MathSprint } from './MathSprint';
import { FormulaTrainer } from './FormulaTrainer';
import { playClickSound, playSuccessSound } from '../lib/sound';
import { useAuth } from '../lib/auth-context';

interface QuizViewProps {
  lang: Language;
  onUpdateBestScore: (score: number) => void;
}

export function QuizView({ lang, onUpdateBestScore }: QuizViewProps) {
  const { recordQuiz } = useAuth();
  const [mode, setMode] = useState<'quiz' | 'sprint' | 'cards'>('quiz');
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
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }

    setActiveQuiz({
      ...activeQuiz,
      isFinished: true,
    });
  };

  // If no quiz is running, show setup or selected mode
  if (!activeQuiz) {
    return (
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {/* Mode switcher tabs */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            ['quiz', '🎯 Тематический тест'],
            ['sprint', '⚡ Спринт 60 секунд'],
            ['cards', '🃏 3D Карточки формул'],
          ].map(([mId, label]) => (
            <button
              key={mId}
              onClick={() => {
                setMode(mId as any);
                playClickSound();
              }}
              style={{
                padding: '11px 22px',
                borderRadius: '13px',
                fontWeight: 800,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                background: mode === mId ? 'var(--primary-gradient)' : 'var(--surface)',
                color: mode === mId ? '#fff' : 'var(--text-muted)',
                boxShadow: mode === mId ? '0 4px 14px rgba(79, 70, 229, 0.35)' : 'var(--shadow-sm)',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === 'sprint' && <MathSprint />}
        {mode === 'cards' && <FormulaTrainer />}

        {mode === 'quiz' && (
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
              🎯 {t('quiz_title')}
            </h3>

        {/* Count selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            {t('quiz_count')}:
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[5, 10, 15].map((n) => (
              <button
                key={n}
                onClick={() => setQuizCount(n)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '15px',
                  background: quizCount === n ? 'var(--primary-light)' : 'var(--surface-secondary)',
                  color: quizCount === n ? 'var(--primary)' : 'var(--text-muted)',
                  border: '2px solid',
                  borderColor: quizCount === n ? 'var(--primary)' : 'var(--border)',
                  transition: 'all 0.2s',
                }}
              >
                {n} вопросов
              </button>
            ))}
          </div>
        </div>

        {/* Topic selection */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            {t('quiz_topics')}:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            <button
              onClick={() => setQuizTopic('all')}
              style={{
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '13.5px',
                background: quizTopic === 'all' ? 'var(--primary-light)' : 'var(--surface-secondary)',
                color: quizTopic === 'all' ? 'var(--primary)' : 'var(--text-muted)',
                border: '2px solid',
                borderColor: quizTopic === 'all' ? 'var(--primary)' : 'var(--border)',
              }}
            >
              🌟 {t('quiz_all')}
            </button>
            {COURSES.map((c) => (
              <button
                key={c.id}
                onClick={() => setQuizTopic(c.id)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  background: quizTopic === c.id ? 'var(--primary-light)' : 'var(--surface-secondary)',
                  color: quizTopic === c.id ? 'var(--primary)' : 'var(--text-muted)',
                  border: '2px solid',
                  borderColor: quizTopic === c.id ? 'var(--primary)' : 'var(--border)',
                }}
              >
                {c.icon} {c.title[lang]}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startQuiz}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            background: 'var(--primary-gradient)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '16px',
            boxShadow: '0 4px 16px rgba(79, 70, 229, 0.4)',
          }}
        >
          {t('quiz_start')}
        </button>
          </div>
        )}
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
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '40px 32px',
          maxWidth: '640px',
          margin: '0 auto',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{t('quiz_done')}</h3>
        <div
          style={{
            fontSize: '72px',
            fontWeight: 900,
            margin: '16px 0',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {pct}%
        </div>
        <p style={{ fontSize: '18px', fontWeight: 700 }}>
          {t('quiz_correct')}: <b>{ok} / {total}</b>
        </p>
        <p style={{ color: 'var(--text-muted)', margin: '14px 0 24px', fontSize: '15px' }}>
          {t(msgKey)}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveQuiz({ ...activeQuiz, isReviewing: true })}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'var(--primary-gradient)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            {t('quiz_review')}
          </button>
          <button
            onClick={() => setActiveQuiz(null)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            {t('quiz_new')}
          </button>
        </div>
      </div>
    );
  }

  // Review mode
  if (activeQuiz.isReviewing) {
    return (
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800 }}>📋 {t('quiz_review')}</h3>
          <button
            onClick={() => setActiveQuiz(null)}
            style={{
              padding: '9px 18px',
              borderRadius: '10px',
              background: 'var(--primary-gradient)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '13.5px',
            }}
          >
            {t('quiz_new')}
          </button>
        </div>

        {activeQuiz.questions.map((q, idx) => {
          const userPick = activeQuiz.userAnswers[idx];
          const isCorrect = userPick === q.c;

          return (
            <div
              key={idx}
              style={{
                marginBottom: '16px',
                padding: '20px',
                borderRadius: '16px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderLeft: `5px solid ${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`,
              }}
            >
              <div style={{ fontSize: '15.5px', fontWeight: 700, marginBottom: '12px' }}>
                {idx + 1}. {q.q[lang]}
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {q.a[lang].map((opt, optIdx) => {
                  let bg = 'var(--surface-secondary)';
                  let border = 'var(--border)';
                  let color = 'inherit';

                  if (optIdx === q.c) {
                    bg = 'rgba(16, 185, 129, 0.15)';
                    border = 'var(--accent-emerald)';
                    color = 'var(--accent-emerald)';
                  } else if (optIdx === userPick && !isCorrect) {
                    bg = 'rgba(244, 63, 94, 0.15)';
                    border = 'var(--accent-rose)';
                    color = 'var(--accent-rose)';
                  }

                  return (
                    <div
                      key={optIdx}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: bg,
                        border: `1px solid ${border}`,
                        fontSize: '14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                      {optIdx === q.c && <span style={{ fontWeight: 800 }}>✓ Правильный</span>}
                      {optIdx === userPick && !isCorrect && <span style={{ fontWeight: 800 }}>✗ Ваш ответ</span>}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  💡 {q.explanation[lang]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Active Question Card
  const curQ = activeQuiz.questions[activeQuiz.currentIndex];
  const curPct = (activeQuiz.currentIndex / activeQuiz.questions.length) * 100;
  const curSelected = activeQuiz.userAnswers[activeQuiz.currentIndex];

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '720px',
        margin: '0 auto',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
        <span>
          {t('quiz_q')} {activeQuiz.currentIndex + 1} {t('quiz_of')} {activeQuiz.questions.length}
        </span>
        <span>{Math.round(curPct)}%</span>
      </div>

      {/* Progress line */}
      <div style={{ height: '6px', background: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ height: '100%', width: `${curPct}%`, background: 'var(--primary-gradient)', transition: 'width 0.3s' }} />
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '22px' }}>
        {curQ.q[lang]}
      </h3>

      {/* Answer options */}
      <div style={{ display: 'grid', gap: '10px', marginBottom: '24px' }}>
        {curQ.a[lang].map((opt, i) => {
          const isSelected = curSelected === i;
          return (
            <button
              key={i}
              onClick={() => selectAnswer(i)}
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                background: isSelected ? 'var(--primary-light)' : 'var(--surface-secondary)',
                border: '2px solid',
                borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                textAlign: 'left',
                fontSize: '15px',
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? 'var(--primary)' : 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.15s',
              }}
            >
              <span
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 800,
                  background: isSelected ? 'var(--primary)' : 'var(--surface)',
                  color: isSelected ? '#fff' : 'var(--text-muted)',
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <button
          disabled={activeQuiz.currentIndex === 0}
          onClick={() => setActiveQuiz({ ...activeQuiz, currentIndex: activeQuiz.currentIndex - 1 })}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            background: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
            fontWeight: 600,
            opacity: activeQuiz.currentIndex === 0 ? 0.4 : 1,
          }}
        >
          {t('quiz_prev')}
        </button>

        {activeQuiz.currentIndex === activeQuiz.questions.length - 1 ? (
          <button
            onClick={finishQuiz}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            }}
          >
            {t('quiz_finish')}
          </button>
        ) : (
          <button
            onClick={() => setActiveQuiz({ ...activeQuiz, currentIndex: activeQuiz.currentIndex + 1 })}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              background: 'var(--primary-gradient)',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            {t('quiz_next')}
          </button>
        )}
      </div>
    </div>
  );
}
