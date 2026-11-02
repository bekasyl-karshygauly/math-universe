'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, Lesson } from '../data/courses';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { KaTeXMath } from './KaTeXMath';
import { MathRenderer } from './MathRenderer';
import { JSXGraphBoard } from './visualizations/JSXGraphBoard';
import { NumberSetsVisualizer } from './visualizations/NumberSetsVisualizer';
import { playSmoothSound, playDynamicSound, playSuccessSound, playModalOpenSound } from '../lib/sound';

interface LessonDetailViewProps {
  course: Course;
  lang: Language;
  progress: boolean[];
  lessonLevels: Record<string, 1 | 2 | 3>;
  onToggleProgress: (lessonIndex: number) => void;
  onSetLessonLevel: (lessonId: string, level: 1 | 2 | 3) => void;
  onOpenWhyItWorks: (whyItWorksId: string) => void;
  onBack: () => void;
}

export function LessonDetailView({
  course,
  lang,
  progress,
  lessonLevels,
  onToggleProgress,
  onSetLessonLevel,
  onOpenWhyItWorks,
  onBack,
}: LessonDetailViewProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const t = (k: string) => I18N[lang][k] || k;

  const toggleAccordion = (idx: number) => {
    playSmoothSound();
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'var(--surface)',
        borderRadius: '24px',
        border: '1px solid var(--border)',
        padding: '32px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Course Head */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '26px',
          paddingBottom: '22px',
          borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          }}
        >
          {course.icon}
        </div>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: 800 }}>{course.title[lang]}</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '14.5px' }}>{course.desc[lang]}</div>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            playSmoothSound();
            onBack();
          }}
          style={{
            marginLeft: 'auto',
            padding: '9px 18px',
            borderRadius: '10px',
            background: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
            fontWeight: 700,
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          {t('back')}
        </motion.button>
      </div>

      {/* Chapters list */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {course.lessons.map((lesson: Lesson, idx: number) => {
          const isOpen = openIndex === idx;
          const isDone = progress[idx] || false;
          const currentLevel = lessonLevels[lesson.id] || 1;

          // Tier content
          const tier =
            currentLevel === 1
              ? lesson.level1
              : currentLevel === 2
              ? lesson.level2
              : lesson.level3;

          return (
            <motion.div
              key={lesson.id}
              layout
              style={{
                borderRadius: '16px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                background: isOpen ? 'var(--surface)' : 'var(--surface-secondary)',
                boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {/* Accordion Head */}
              <div
                onClick={() => toggleAccordion(idx)}
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  background: isOpen ? 'var(--surface-hover)' : 'transparent',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isDone ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--primary-gradient)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {isDone ? '✓' : idx + 1}
                </div>

                <div style={{ fontSize: '16px', fontWeight: 700, flex: 1 }}>
                  {lesson.title[lang]}
                </div>

                {lesson.whyItWorksId && (
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: 'var(--accent-amber)',
                      fontWeight: 700,
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    💡 Вывод
                  </span>
                )}

                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '14px',
                  }}
                >
                  ▼
                </motion.span>
              </div>

              {/* Accordion Body with Motion */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '24px 26px', borderTop: '1px solid var(--border)' }}>
                      {/* 3-Level Depth Selector */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          marginBottom: '20px',
                          flexWrap: 'wrap',
                          background: 'var(--surface-secondary)',
                          padding: '5px',
                          borderRadius: '12px',
                          border: '1px solid var(--border)',
                        }}
                      >
                        {[
                          { level: 1 as const, label: t('level_1'), icon: '🟢', desc: t('level_1_desc') },
                          { level: 2 as const, label: t('level_2'), icon: '🟡', desc: t('level_2_desc') },
                          { level: 3 as const, label: t('level_3'), icon: '🟣', desc: t('level_3_desc') },
                        ].map((lvl) => {
                          const isSelected = currentLevel === lvl.level;
                          return (
                            <motion.button
                              key={lvl.level}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                playDynamicSound();
                                onSetLessonLevel(lesson.id, lvl.level);
                              }}
                              style={{
                                flex: 1,
                                minWidth: '150px',
                                padding: '9px 14px',
                                borderRadius: '9px',
                                fontSize: '13px',
                                fontWeight: 700,
                                background: isSelected ? 'var(--surface)' : 'transparent',
                                color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
                                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                                border: isSelected ? '1px solid var(--border)' : '1px solid transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                              }}
                            >
                              <span>{lvl.icon}</span>
                              <span>{lvl.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Animated Level Transition Container */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${lesson.id}-lvl-${currentLevel}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.22 }}
                        >
                          {/* Summary Callout */}
                          <div
                            style={{
                              padding: '12px 18px',
                              borderRadius: '10px',
                              background: 'rgba(99, 102, 241, 0.08)',
                              borderLeft: '4px solid var(--primary)',
                              fontSize: '14px',
                              marginBottom: '18px',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {tier.summary[lang]}
                          </div>

                          {/* Visual Component for Numbers and Sets */}
                          {lesson.id === 'numbers' && currentLevel === 1 && (
                            <NumberSetsVisualizer lang={lang} />
                          )}

                          {/* Main Lesson Rendered KaTeX HTML Content */}
                          <div style={{ marginBottom: '22px' }}>
                            <MathRenderer content={tier.contentHtml[lang]} />
                          </div>

                          {/* Key Formulas */}
                          {tier.formulas.length > 0 && (
                            <div
                              style={{
                                padding: '16px 20px',
                                borderRadius: '12px',
                                background: 'var(--surface-secondary)',
                                border: '1px solid var(--border)',
                                marginBottom: '22px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                              }}
                            >
                              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                                Формулы уровня {currentLevel}
                              </span>
                              {tier.formulas.map((f, i) => (
                                <KaTeXMath key={i} math={f} block />
                              ))}
                            </div>
                          )}

                          {/* Interactive JSXGraph Embeds */}
                          {lesson.id === 'derivative' && currentLevel >= 2 && (
                            <div style={{ marginBottom: '22px' }}>
                              <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '8px', color: 'var(--primary)' }}>
                                🎯 Интерактивный чертёж: Касательная как предел секущей
                              </h4>
                              <JSXGraphBoard type="derivative" height={340} />
                            </div>
                          )}

                          {lesson.id === 'trigonometry' && currentLevel >= 2 && (
                            <div style={{ marginBottom: '22px' }}>
                              <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '8px', color: 'var(--primary)' }}>
                                🎯 Интерактивный единичный круг и тригонометрические проекции
                              </h4>
                              <JSXGraphBoard type="unit_circle" height={340} />
                            </div>
                          )}

                          {lesson.id === 'integrals' && currentLevel >= 2 && (
                            <div style={{ marginBottom: '22px' }}>
                              <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '8px', color: 'var(--primary)' }}>
                                🎯 Интерактивные суммы Римана и предел площади
                              </h4>
                              <JSXGraphBoard type="riemann" height={340} />
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {/* Action Bar */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px',
                          paddingTop: '16px',
                          borderTop: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {/* Mark as read */}
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              playSuccessSound();
                              onToggleProgress(idx);
                            }}
                            style={{
                              padding: '11px 22px',
                              borderRadius: '11px',
                              fontWeight: 700,
                              fontSize: '13.5px',
                              background: isDone ? 'var(--surface-secondary)' : 'linear-gradient(135deg, #10b981, #059669)',
                              color: isDone ? 'var(--accent-emerald)' : '#fff',
                              border: isDone ? '2px solid var(--accent-emerald)' : 'none',
                              boxShadow: isDone ? 'none' : '0 4px 14px rgba(16, 185, 129, 0.35)',
                              cursor: 'pointer',
                            }}
                          >
                            {isDone ? t('read') : t('mark_read')}
                          </motion.button>

                          {/* Explore Deeper button */}
                          {currentLevel < 3 && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => {
                                playDynamicSound();
                                onSetLessonLevel(lesson.id, (currentLevel + 1) as any);
                              }}
                              style={{
                                padding: '11px 20px',
                                borderRadius: '11px',
                                fontWeight: 700,
                                fontSize: '13.5px',
                                background: 'var(--surface-secondary)',
                                border: '1px solid var(--border)',
                                color: 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                              }}
                            >
                              <span>🔬</span>
                              <span>{t('explore_deeper')} (Уровень {currentLevel + 1})</span>
                            </motion.button>
                          )}
                        </div>

                        {/* Why it works button */}
                        {lesson.whyItWorksId && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              playModalOpenSound();
                              onOpenWhyItWorks(lesson.whyItWorksId!);
                            }}
                            style={{
                              padding: '11px 22px',
                              borderRadius: '11px',
                              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                              color: '#fff',
                              fontWeight: 800,
                              fontSize: '13.5px',
                              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer',
                            }}
                          >
                            <span>💡</span>
                            <span>{t('why_it_works')}</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
