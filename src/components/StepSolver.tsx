'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { solveEquation, SolverSolution } from '../lib/equationSolver';

interface StepSolverProps {
  onClose: () => void;
}

export function StepSolver({ onClose }: StepSolverProps) {
  const [input, setInput] = useState('');
  const [solution, setSolution] = useState<SolverSolution | null>(null);
  const [error, setError] = useState('');
  const [visibleSteps, setVisibleSteps] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const examples = ['x^2-5x+6=0', 'x^2-5x=-6', '2(x-1)=x+3', '(x-2)(x+3)=0', 'x^2+2x+5=0'];

  const stopReveal = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => stopReveal, []);

  const solve = () => {
    stopReveal();
    setError(''); setSolution(null); setVisibleSteps(0);
    if (!input.trim()) { setError('Введите уравнение'); return; }
    const res = solveEquation(input);
    if (!res.ok) { setError(res.error); return; }
    const sol = res.solution;
    setSolution(sol);
    // Show steps one by one
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      setVisibleSteps(step);
      if (step >= sol.steps.length) stopReveal();
    }, 500);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
          style={{ background: 'var(--surface)', borderRadius: '28px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}>

          {/* Header */}
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '2px' }}>🧮 Пошаговый решатель</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Введи уравнение — получи полное решение</p>
            </div>
            <button onClick={onClose} style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border)', borderRadius: '10px', width: '34px', height: '34px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
            {/* Input */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && solve()}
                placeholder="Например: x^2-5x+6=0"
                style={{ flex: 1, padding: '13px 16px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--surface-secondary)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none', fontFamily: 'monospace' }} />
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={solve}
                style={{ padding: '13px 20px', borderRadius: '14px', background: 'var(--primary-gradient)', color: '#fff', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                Решить
              </motion.button>
            </div>

            {/* Examples */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {examples.map((ex) => (
                <button key={ex} onClick={() => setInput(ex)}
                  style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--surface-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '12.5px', cursor: 'pointer', fontFamily: 'monospace' }}>
                  {ex}
                </button>
              ))}
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ color: '#ef4444', padding: '12px 16px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', fontSize: '14px', marginBottom: '16px' }}>
                ⚠️ {error}
              </motion.div>
            )}

            {solution && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '16px', marginBottom: '16px', color: 'var(--primary)' }}>📋 {solution.title}</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {solution.steps.slice(0, visibleSteps).map((step, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      style={{ display: 'flex', gap: '14px', padding: '16px', background: 'var(--surface-secondary)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '13px', flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13.5px', marginBottom: '5px' }}>{step.action}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--primary)', marginBottom: '5px', background: 'rgba(99,102,241,0.08)', padding: '6px 10px', borderRadius: '8px' }}>{step.result}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>{step.explanation}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {visibleSteps >= solution.steps.length && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ padding: '20px', background: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(6,182,212,0.15))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Ответ:</div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#10b981', fontFamily: 'monospace' }}>{solution.answer}</div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}