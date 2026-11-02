'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { WHY_IT_WORKS_DATA, WhyItWorksTopic } from '../data/whyItWorks';
import { Language } from '../lib/storage';
import { KaTeXMath } from './KaTeXMath';
import { JSXGraphBoard } from './visualizations/JSXGraphBoard';
import { VisualProofInteractive } from './visualizations/VisualProofInteractive';
import {
  playModalOpenSound,
  playModalCloseSound,
  playSmoothSound,
  playDynamicSound,
  playStepSound,
  playSuccessSound,
} from '../lib/sound';

interface WhyItWorksModalProps {
  topicId: string | null;
  lang: Language;
  onClose: () => void;
}

export function WhyItWorksModal({ topicId, lang, onClose }: WhyItWorksModalProps) {
  const [activeTab, setActiveTab] = useState<'derivation' | 'visual' | 'history' | 'apps'>('derivation');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'slides' | 'scroll'>('slides');

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const stepCardRef = useRef<HTMLDivElement>(null);

  // Play opening sound and animate modal in with GSAP
  useEffect(() => {
    if (topicId) {
      playModalOpenSound();

      if (overlayRef.current) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      }
      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.92, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.42, ease: 'back.out(1.4)' }
        );
      }
    }
  }, [topicId]);

  // Animate tab content change
  useEffect(() => {
    if (tabContentRef.current) {
      gsap.fromTo(
        tabContentRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  // Animate step card change
  useEffect(() => {
    if (stepCardRef.current && viewMode === 'slides') {
      gsap.fromTo(
        stepCardRef.current,
        { opacity: 0, x: 20, scale: 0.98 },
        { opacity: 1, x: 0, scale: 1, duration: 0.35, ease: 'back.out(1.3)' }
      );
    }
  }, [currentStep, viewMode]);

  const handleClose = () => {
    playModalCloseSound();
    if (modalRef.current && overlayRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.94,
        y: 20,
        duration: 0.22,
        ease: 'power2.in',
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  const handleTabChange = (tab: 'derivation' | 'visual' | 'history' | 'apps') => {
    playSmoothSound();
    setActiveTab(tab);
  };

  const handleStepChange = (idx: number) => {
    playStepSound(idx);
    setCurrentStep(idx);
  };

  if (!topicId || !WHY_IT_WORKS_DATA[topicId]) return null;

  const topic: WhyItWorksTopic = WHY_IT_WORKS_DATA[topicId];
  const steps = topic.steps;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(5, 7, 13, 0.78)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        style={{
          width: '100%',
          maxWidth: '890px',
          maxHeight: '92vh',
          backgroundColor: 'var(--surface)',
          borderRadius: '24px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg), 0 0 50px rgba(99, 102, 241, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 26px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-hover)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: 'var(--primary-gradient)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              {topic.badge}
            </span>
            <h2 style={{ fontSize: '18.5px', fontWeight: 800 }}>
              💡 {topic.title[lang]}
            </h2>
          </div>
          <button
            onClick={handleClose}
            title="Закрыть (Esc)"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation with dynamic audio feedback */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 26px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface)',
            overflowX: 'auto',
          }}
        >
          {[
            ['derivation', `📐 Пошаговый вывод (${steps.length} шагов)`],
            ['visual', '✨ Визуальный эксперимент'],
            ['history', '📜 Происхождение и история'],
            ['apps', '🚀 В реальном мире'],
          ].map(([tabKey, label]) => {
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => handleTabChange(tabKey as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  background: isActive ? 'var(--primary-gradient)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: isActive ? 'transparent' : 'transparent',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.35)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div ref={tabContentRef} style={{ padding: '24px 26px', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: DERIVATION */}
          {activeTab === 'derivation' && (
            <div>
              {/* Header bar with Mode Switcher */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Режим:</span>
                  <div style={{ display: 'flex', background: 'var(--surface-secondary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <button
                      onClick={() => {
                        setViewMode('slides');
                        playDynamicSound();
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        background: viewMode === 'slides' ? 'var(--primary)' : 'transparent',
                        color: viewMode === 'slides' ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      Слайды
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('scroll');
                        playDynamicSound();
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        background: viewMode === 'scroll' ? 'var(--primary)' : 'transparent',
                        color: viewMode === 'scroll' ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      📜 Лента
                    </button>
                  </div>
                </div>

                {viewMode === 'slides' && (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleStepChange(i)}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          background: currentStep === i ? 'var(--primary-gradient)' : 'var(--surface-secondary)',
                          color: currentStep === i ? '#fff' : 'var(--text-muted)',
                          border: '1px solid var(--border)',
                          boxShadow: currentStep === i ? '0 2px 8px rgba(79, 70, 229, 0.4)' : 'none',
                          transition: 'all 0.15s',
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* SLIDES MODE */}
              {viewMode === 'slides' && (
                <div>
                  <div
                    ref={stepCardRef}
                    style={{
                      padding: '26px',
                      borderRadius: '18px',
                      background: 'var(--surface-hover)',
                      border: '1px solid var(--border)',
                      marginBottom: '20px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                      <div style={{ fontSize: '15px', color: 'var(--primary)', fontWeight: 800 }}>
                        Шаг {currentStep + 1} из {steps.length}: {steps[currentStep].title[lang]}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '22px',
                        borderRadius: '14px',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        margin: '16px 0',
                        textAlign: 'center',
                        fontSize: '18px',
                        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    >
                      <KaTeXMath math={steps[currentStep].formula} block />
                    </div>

                    <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.75 }}>
                      {steps[currentStep].explanation[lang]}
                    </p>
                  </div>

                  {/* Step Navigation Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <button
                      disabled={currentStep === 0}
                      onClick={() => handleStepChange(Math.max(0, currentStep - 1))}
                      style={{
                        padding: '11px 20px',
                        borderRadius: '11px',
                        background: 'var(--surface-secondary)',
                        border: '1px solid var(--border)',
                        fontWeight: 700,
                        fontSize: '13.5px',
                        opacity: currentStep === 0 ? 0.4 : 1,
                        cursor: currentStep === 0 ? 'default' : 'pointer',
                      }}
                    >
                      ← Предыдущий шаг
                    </button>

                    {currentStep < steps.length - 1 ? (
                      <button
                        onClick={() => handleStepChange(currentStep + 1)}
                        style={{
                          padding: '11px 24px',
                          borderRadius: '11px',
                          background: 'var(--primary-gradient)',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '13.5px',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                        }}
                      >
                        Следующий шаг ({currentStep + 2} / {steps.length}) →
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          playSuccessSound();
                          handleTabChange('visual');
                        }}
                        style={{
                          padding: '11px 24px',
                          borderRadius: '11px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '13.5px',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                        }}
                      >
                        Перейти к интерактивному эксперименту ✨
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* CONTINUOUS SCROLL STORY MODE */}
              {viewMode === 'scroll' && (
                <div style={{ display: 'grid', gap: '22px' }}>
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '24px',
                        borderRadius: '16px',
                        background: 'var(--surface-hover)',
                        border: '1px solid var(--border)',
                        borderLeft: '4px solid var(--primary)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                          {step.title[lang]}
                        </span>
                      </div>

                      <div
                        style={{
                          padding: '18px',
                          borderRadius: '12px',
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          margin: '14px 0',
                          textAlign: 'center',
                          fontSize: '17px',
                        }}
                      >
                        <KaTeXMath math={step.formula} block />
                      </div>

                      <p style={{ fontSize: '14.5px', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                        {step.explanation[lang]}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIVE VISUAL EXPERIMENT */}
          {activeTab === 'visual' && (
            <div>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.65 }}>
                {topic.visualProofDescription[lang]}
              </p>

              {/* Interactive GSAP-animated proof widget */}
              <div style={{ marginBottom: '22px' }}>
                <VisualProofInteractive type={topic.visualProofType} lang={lang} />
              </div>

              {/* Underlying geometric board if available */}
              {topic.visualProofType === 'square_completion' && (
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '10px' }}>Графическая парабола f(x) = ax² + bx + c:</h4>
                  <JSXGraphBoard type="parabola" height={340} />
                </div>
              )}

              {topic.visualProofType === 'secant_to_tangent' && (
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '10px' }}>Интерактивная доска производной:</h4>
                  <JSXGraphBoard type="derivative" height={340} />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HISTORY */}
          {activeTab === 'history' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '18px',
                  borderRadius: '14px',
                  background: 'var(--surface-hover)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: '36px' }}>🏛️</div>
                <div>
                  <div style={{ fontSize: '17px', fontWeight: 800 }}>{topic.origin.author}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{topic.origin.era}</div>
                </div>
              </div>

              <div
                style={{
                  padding: '22px',
                  borderRadius: '16px',
                  background: 'var(--surface-secondary)',
                  border: '1px solid var(--border)',
                  fontSize: '15px',
                  lineHeight: 1.75,
                }}
              >
                {topic.origin.story[lang]}
              </div>
            </div>
          )}

          {/* TAB 4: PRACTICAL APPLICATIONS */}
          {activeTab === 'apps' && (
            <div
              style={{
                padding: '26px',
                borderRadius: '18px',
                background: 'var(--surface-hover)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '28px' }}>🌍</span>
                <h4 style={{ fontSize: '18px', fontWeight: 800 }}>Применение в науке, инженерии и технологиях</h4>
              </div>
              <p style={{ fontSize: '15.5px', color: 'var(--text-primary)', lineHeight: 1.8 }}>
                {topic.practicalApplication[lang]}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
