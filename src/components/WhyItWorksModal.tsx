'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { WHY_IT_WORKS_DATA, WhyItWorksTopic } from '../data/whyItWorks';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { KaTeXMath } from './KaTeXMath';
import { JSXGraphBoard } from './visualizations/JSXGraphBoard';
import { VisualProofInteractive } from './visualizations/VisualProofInteractive';
import { Dialog } from './ui/Dialog';
import { SegmentedTabs } from './ui/SegmentedTabs';
import { playModalOpenSound, playModalCloseSound, playSmoothSound, playDynamicSound, playStepSound, playSuccessSound } from '../lib/sound';

interface WhyItWorksModalProps {
  topicId: string | null;
  lang: Language;
  onClose: () => void;
}

type Tab = 'derivation' | 'visual' | 'history' | 'apps';

export function WhyItWorksModal({ topicId, lang, onClose }: WhyItWorksModalProps) {
  if (!topicId || !WHY_IT_WORKS_DATA[topicId]) return null;
  // Keyed by topic so tab and step state start fresh for every topic
  return <WhyItWorksDialog key={topicId} topic={WHY_IT_WORKS_DATA[topicId]} lang={lang} onClose={onClose} />;
}

function WhyItWorksDialog({ topic, lang, onClose }: { topic: WhyItWorksTopic; lang: Language; onClose: () => void }) {
  const t = (k: string) => I18N[lang][k] || k;
  const [activeTab, setActiveTab] = useState<Tab>('derivation');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'slides' | 'scroll'>('slides');
  const steps = topic.steps;

  useEffect(() => {
    playModalOpenSound();
  }, []);

  const handleClose = () => {
    playModalCloseSound();
    onClose();
  };

  const handleTabChange = (tab: Tab) => {
    playSmoothSound();
    setActiveTab(tab);
  };

  const handleStepChange = (idx: number) => {
    playStepSound(idx);
    setCurrentStep(idx);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'derivation', label: `${t('step_by_step')} · ${steps.length}` },
    { id: 'visual', label: t('visual_proof') },
    { id: 'history', label: t('why_tab_history') },
    { id: 'apps', label: t('practical_apps') },
  ];

  return (
    <Dialog
      onClose={handleClose}
      title={topic.title[lang]}
      subtitle={
        <>
          <span className="chip chip--accent" style={{ marginRight: '8px' }}>
            {topic.badge}
          </span>
          {t('why_it_works_sub')}
        </>
      }
      closeLabel={t('close')}
      maxWidth={900}
    >
      <SegmentedTabs label={t('why_tabs_label')} items={tabs} value={activeTab} idPrefix="why" scroll onChange={handleTabChange} />

      <div key={activeTab} id="why-panel" role="tabpanel" aria-labelledby={`why-tab-${activeTab}`} className="reveal" style={{ marginTop: '22px' }}>
        {/* TAB 1: DERIVATION */}
        {activeTab === 'derivation' && (
          <div>
            <div className="why-toolbar">
              <div className="seg-tabs" role="group" aria-label={t('why_view_label')}>
                <button
                  type="button"
                  className="seg-tab"
                  aria-pressed={viewMode === 'slides'}
                  onClick={() => {
                    setViewMode('slides');
                    playDynamicSound();
                  }}
                >
                  {t('why_view_slides')}
                </button>
                <button
                  type="button"
                  className="seg-tab"
                  aria-pressed={viewMode === 'scroll'}
                  onClick={() => {
                    setViewMode('scroll');
                    playDynamicSound();
                  }}
                >
                  {t('why_view_scroll')}
                </button>
              </div>

              {viewMode === 'slides' && (
                <div className="why-steps" role="group" aria-label={t('why_steps_label')}>
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className="why-steps__dot mono"
                      aria-current={currentStep === i ? 'step' : undefined}
                      aria-label={`${t('step')} ${i + 1}`}
                      onClick={() => handleStepChange(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {viewMode === 'slides' && (
              <div>
                <article key={currentStep} className="why-step reveal" aria-live="polite">
                  <p className="eyebrow eyebrow--muted">
                    {t('step')} {currentStep + 1} / {steps.length}
                  </p>
                  <h3 className="why-step__title">{steps[currentStep].title[lang]}</h3>
                  <div className="formula-box why-step__formula">
                    <KaTeXMath math={steps[currentStep].formula} block />
                  </div>
                  <p className="why-step__text">{steps[currentStep].explanation[lang]}</p>
                </article>

                <div className="why-nav">
                  <button type="button" className="btn btn--secondary" disabled={currentStep === 0} onClick={() => handleStepChange(Math.max(0, currentStep - 1))}>
                    <ArrowLeft size={16} aria-hidden="true" />
                    {t('why_prev')}
                  </button>

                  {currentStep < steps.length - 1 ? (
                    <button type="button" className="btn btn--primary" onClick={() => handleStepChange(currentStep + 1)}>
                      {t('why_next')} · {currentStep + 2}/{steps.length}
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => {
                        playSuccessSound();
                        handleTabChange('visual');
                      }}
                    >
                      {t('why_to_visual')}
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {viewMode === 'scroll' && (
              <ol className="why-scroll">
                {steps.map((step, idx) => (
                  <li key={idx} className="why-step">
                    <p className="eyebrow eyebrow--muted">
                      {t('step')} {idx + 1}
                    </p>
                    <h3 className="why-step__title">{step.title[lang]}</h3>
                    <div className="formula-box why-step__formula">
                      <KaTeXMath math={step.formula} block />
                    </div>
                    <p className="why-step__text">{step.explanation[lang]}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIVE VISUAL EXPERIMENT */}
        {activeTab === 'visual' && (
          <div>
            <p className="lead" style={{ fontSize: '15px', marginBottom: '18px' }}>
              {topic.visualProofDescription[lang]}
            </p>

            <div style={{ marginBottom: '22px' }}>
              <VisualProofInteractive type={topic.visualProofType} lang={lang} />
            </div>

            {topic.visualProofType === 'square_completion' && (
              <section className="panel panel--instrument" style={{ marginTop: '16px' }}>
                <div className="panel__top">
                  <span>{t('interactive_sandbox')}</span>
                  <span style={{ textTransform: 'none' }}>f(x) = ax² + bx + c</span>
                </div>
                <JSXGraphBoard type="parabola" height={340} lang={lang} />
              </section>
            )}

            {topic.visualProofType === 'secant_to_tangent' && (
              <section className="panel panel--instrument" style={{ marginTop: '16px' }}>
                <div className="panel__top">
                  <span>{t('interactive_sandbox')}</span>
                  <span style={{ textTransform: 'none' }}>f′(x)</span>
                </div>
                <JSXGraphBoard type="derivative" height={340} lang={lang} />
              </section>
            )}
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === 'history' && (
          <div className="why-history">
            <p className="eyebrow eyebrow--muted">{topic.origin.era}</p>
            <h3 className="why-step__title">{topic.origin.author}</h3>
            <p className="why-step__text">{topic.origin.story[lang]}</p>
          </div>
        )}

        {/* TAB 4: PRACTICAL APPLICATIONS */}
        {activeTab === 'apps' && (
          <div className="why-history">
            <h3 className="why-step__title">{t('practical_apps')}</h3>
            <p className="why-step__text">{topic.practicalApplication[lang]}</p>
          </div>
        )}
      </div>
    </Dialog>
  );
}
