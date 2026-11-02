'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../../lib/storage';
import { KaTeXMath } from '../KaTeXMath';

interface NumberSetsVisualizerProps {
  lang: Language;
}

interface SetInfo {
  key: 'N' | 'Z' | 'Q' | 'R' | 'C';
  symbol: string;
  name: Record<Language, string>;
  color: string;
  gradient: string;
  examples: string[];
  desc: Record<Language, string>;
}

const SETS_DATA: SetInfo[] = [
  {
    key: 'N',
    symbol: '\\mathbb{N}',
    name: { ru: 'Натуральные числа', kz: 'Натурал сандар', en: 'Natural Numbers' },
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    examples: ['1', '2', '3', '42', '100', '999...'],
    desc: {
      ru: 'Используются для счёта предметов: 1, 2, 3... (наименьшее — 1). Не содержат отрицательных чисел и дробей.',
      kz: 'Заттарды санау үшін қолданылады: 1, 2, 3... (ең кішісі — 1).',
      en: 'Counting numbers: 1, 2, 3... Does not include negative numbers or fractions.'
    }
  },
  {
    key: 'Z',
    symbol: '\\mathbb{Z}',
    name: { ru: 'Целые числа', kz: 'Бүтін сандар', en: 'Integers' },
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0284c7)',
    examples: ['-100', '-5', '-1', '0', '1', '5', '42'],
    desc: {
      ru: 'Включают натуральные числа, ноль и противоположные отрицательные: ..., -2, -1, 0, 1, 2... Решают задачи долгов, температур и баланса.',
      kz: 'Натурал сандар, нөл және қарама-қарсы теріс сандар жиыны: ..., -2, -1, 0, 1, 2...',
      en: 'Natural numbers, zero, and their negatives: ..., -2, -1, 0, 1, 2... Resolves subtraction.'
    }
  },
  {
    key: 'Q',
    symbol: '\\mathbb{Q}',
    name: { ru: 'Рациональные числа', kz: 'Рационал сандар', en: 'Rational Numbers' },
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    examples: ['1/2', '-3/4', '0.25', '7/3', '0.333...', '-5'],
    desc: {
      ru: 'Любые обыкновенные дроби p/q, где p целое, q натуральное. Всегда записываются конечной или периодической десятичной дробью.',
      kz: 'p/q бөлшегі түрінде жазылатын сандар. Әрқашан шекті немесе периодты ондық бөлшек болады.',
      en: 'Fractions p/q where p ∈ ℤ, q ∈ ℕ. Always represented by terminating or repeating decimals.'
    }
  },
  {
    key: 'R',
    symbol: '\\mathbb{R}',
    name: { ru: 'Вещественные числа', kz: 'Нақты сандар', en: 'Real Numbers' },
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    examples: ['\\sqrt{2}', '\\pi', 'e', '\\sqrt{3}', '-0.5', '1/3', '42'],
    desc: {
      ru: 'Вся непрерывная числовая прямая без пробелов. Включает иррациональные числа (√2 ≈ 1.414, π ≈ 3.1415, e ≈ 2.718), чья дробная часть бесконечна и непериодична.',
      kz: 'Бүкіл үздіксіз сан түзуі. Рационал сандар мен иррационал сандарды (√2, π, e) біріктіреді.',
      en: 'The continuous real continuum line. Contains irrationals like √2, π, and e with infinite non-repeating digits.'
    }
  },
  {
    key: 'C',
    symbol: '\\mathbb{C}',
    name: { ru: 'Комплексные числа', kz: 'Кешен сандар', en: 'Complex Numbers' },
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #d946ef)',
    examples: ['3 + 2i', '5i', '-1 + 4i', 'e^{i\\pi}', '7', '\\sqrt{-4} = 2i'],
    desc: {
      ru: 'Числа вида a + bi, где i — мнимая единица (i² = -1). Позволяют извлекать корни из отрицательных чисел и описывать квантовые волны и электромагнитные колебания.',
      kz: 'a + bi түріндегі сандар, мұндағы i² = -1. Теріс сандардан түбір алуға және толқындарды сипаттауға мүмкіндік береді.',
      en: 'Numbers of the form a + bi where i² = -1. Extends arithmetic to 2D complex plane, powering quantum wave mechanics.'
    }
  }
];

export function NumberSetsVisualizer({ lang }: NumberSetsVisualizerProps) {
  const [selectedSet, setSelectedSet] = useState<'N' | 'Z' | 'Q' | 'R' | 'C'>('N');
  const [testInput, setTestInput] = useState<string>('3/4');

  // Interactive tester for user input
  const detectedSets = React.useMemo(() => {
    const val = testInput.trim().toLowerCase();
    if (!val) return [];

    // Complex
    if (val.includes('i')) return ['C'];

    // Irrational (sqrt, pi, e)
    if (val.includes('pi') || val.includes('π') || val.includes('sqrt') || val.includes('√') || val.includes('e')) {
      return ['R', 'C'];
    }

    // Fraction or decimal
    if (val.includes('/') || val.includes('.') || val.includes(',')) {
      return ['Q', 'R', 'C'];
    }

    // Integer
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      if (num > 0) return ['N', 'Z', 'Q', 'R', 'C'];
      return ['Z', 'Q', 'R', 'C'];
    }

    return ['R', 'C'];
  }, [testInput]);

  const activeSet = SETS_DATA.find((s) => s.key === selectedSet)!;

  return (
    <div
      style={{
        borderRadius: '20px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        padding: '24px',
        margin: '20px 0',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>🎯</span>
          <h4 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Интерактивная карта числовых систем
          </h4>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
          Вложенность: <KaTeXMath math="\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}" />
        </div>
      </div>

      {/* Visual Nested Boxes / Pills */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '8px',
          marginBottom: '20px',
        }}
      >
        {SETS_DATA.map((set) => {
          const isSelected = selectedSet === set.key;
          const isDetected = detectedSets.includes(set.key);

          return (
            <motion.button
              key={set.key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedSet(set.key)}
              style={{
                padding: '14px 12px',
                borderRadius: '14px',
                background: isSelected ? set.gradient : 'var(--surface-secondary)',
                color: isSelected ? '#fff' : 'var(--text-primary)',
                border: '2px solid',
                borderColor: isDetected ? set.color : isSelected ? 'transparent' : 'var(--border)',
                boxShadow: isSelected ? `0 4px 16px ${set.color}40` : isDetected ? `0 0 12px ${set.color}60` : 'none',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '22px', fontWeight: 900, marginBottom: '4px' }}>
                <KaTeXMath math={set.symbol} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, opacity: isSelected ? 1 : 0.8 }}>
                {set.name[lang]}
              </div>
              {isDetected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: set.color,
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Detail panel with animated transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSet.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{
            padding: '20px 24px',
            borderRadius: '16px',
            background: 'var(--surface-secondary)',
            borderLeft: `5px solid ${activeSet.color}`,
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '22px', fontWeight: 900, color: activeSet.color }}>
              <KaTeXMath math={activeSet.symbol} />
            </span>
            <span style={{ fontSize: '17px', fontWeight: 800 }}>{activeSet.name[lang]}</span>
          </div>

          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
            {activeSet.desc[lang]}
          </p>

          <div>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Примеры чисел:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              {activeSet.examples.map((ex, i) => (
                <span
                  key={i}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                >
                  <KaTeXMath math={ex} />
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Interactive Number Classifier Sandbox */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: '14px',
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px dashed rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
          <span style={{ fontSize: '18px' }}>🔍</span>
          <span style={{ fontSize: '13.5px', fontWeight: 700 }}>Проверить число:</span>
          <input
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="например: 5, -3, 3/4, sqrt(2), 3+2i"
            style={{
              padding: '8px 14px',
              borderRadius: '9px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              width: '180px',
            }}
          />
        </div>

        {/* Quick sample chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Быстро:</span>
          {['7', '-12', '3/4', 'sqrt(2)', '3+2i'].map((chip) => (
            <button
              key={chip}
              onClick={() => setTestInput(chip)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
