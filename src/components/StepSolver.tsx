'use client';
import React, { useId, useState } from 'react';
import { solveEquation, SolverSolution } from '../lib/equationSolver';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { Dialog } from './ui/Dialog';

interface StepSolverProps {
  onClose: () => void;
  lang: Language;
}

const EXAMPLES = ['x^2-5x+6=0', 'x^2-5x=-6', '2(x-1)=x+3', '(x-2)(x+3)=0', 'x^2+2x+5=0'];

export function StepSolver({ onClose, lang }: StepSolverProps) {
  const t = (k: string) => I18N[lang][k] || k;
  const [input, setInput] = useState('');
  const [solution, setSolution] = useState<SolverSolution | null>(null);
  const [error, setError] = useState('');
  const [run, setRun] = useState(0);
  const inputId = useId();
  const errorId = useId();

  const solve = () => {
    setError('');
    setSolution(null);
    if (!input.trim()) {
      setError(t('solver_empty'));
      return;
    }
    const res = solveEquation(input);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSolution(res.solution);
    // New key per run: the step cascade replays for every solve, the previous one is replaced at once
    setRun((r) => r + 1);
  };

  return (
    <Dialog onClose={onClose} title={t('solver_title')} subtitle={t('solver_sub')} closeLabel={t('close')} maxWidth={620}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          solve();
        }}
      >
        <label className="field-label" htmlFor={inputId}>
          {t('solver_input_label')}
        </label>
        <div className="inline-form">
          <input
            id={inputId}
            data-autofocus
            className="field-input field-input--mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="x^2-5x+6=0"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
          <button type="submit" className="btn btn--primary">
            {t('c_solve')}
          </button>
        </div>
      </form>

      <div className="solver-examples">
        <span className="field-help">{t('solver_examples')}:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex} type="button" className="chip mono" onClick={() => setInput(ex)}>
            {ex}
          </button>
        ))}
      </div>

      {error && (
        <p id={errorId} className="status status--danger" role="alert" style={{ marginTop: '16px' }}>
          {error}
        </p>
      )}

      {solution && (
        <section key={run} aria-live="polite" style={{ marginTop: '22px' }}>
          <p className="eyebrow eyebrow--muted">{solution.title}</p>
          <ol className="solver-steps">
            {solution.steps.map((step, i) => (
              <li key={i} className="solver-step reveal" style={{ animationDelay: `${i * 40}ms` }}>
                <span className="solver-step__num mono" aria-hidden="true">
                  {i + 1}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="solver-step__action">{step.action}</div>
                  <div className="solver-step__result mono">{step.result}</div>
                  <div className="solver-step__note">{step.explanation}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="result-panel result-panel--success solver-answer reveal" style={{ animationDelay: `${solution.steps.length * 40}ms` }}>
            <span className="eyebrow eyebrow--muted">{t('solver_answer')}</span>
            <span className="solver-answer__value mono">{solution.answer}</span>
          </div>
        </section>
      )}
    </Dialog>
  );
}
