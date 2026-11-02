'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KaTeXMath } from './KaTeXMath';
import { playClickSound, playSuccessSound } from '../lib/sound';
import confetti from 'canvas-confetti';

interface Flashcard {
  id: string;
  category: 'algebra' | 'trig' | 'geom' | 'calc' | 'comb';
  title: string;
  frontPrompt: string;
  formula: string;
  explanation: string;
}

const CARDS_DATA: Flashcard[] = [
  {
    id: '1',
    category: 'algebra',
    title: 'Квадрат суммы / разности',
    frontPrompt: 'Чему равен (a ± b)²?',
    formula: '(a \\pm b)^2 = a^2 \\pm 2ab + b^2',
    explanation: 'Квадрат первого слагаемого, удвоенное произведение и квадрат второго слагаемого.',
  },
  {
    id: '2',
    category: 'algebra',
    title: 'Разность квадратов',
    frontPrompt: 'Как раскладывается a² - b²?',
    formula: 'a^2 - b^2 = (a - b)(a + b)',
    explanation: 'Произведение разности двух выражений на их сумму.',
  },
  {
    id: '3',
    category: 'algebra',
    title: 'Теорема Виета (квадратное ур-е)',
    frontPrompt: 'Связь корней x₁ и x₂ с коэффициентами ax² + bx + c = 0',
    formula: 'x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 x_2 = \\frac{c}{a}',
    explanation: 'Сумма корней равна -b/a, а их произведение c/a.',
  },
  {
    id: '4',
    category: 'trig',
    title: 'Основное тригонометрическое тождество',
    frontPrompt: 'Чему равна сумма квадратов синуса и косинуса одного угла?',
    formula: '\\sin^2(\\alpha) + \\cos^2(\\alpha) = 1',
    explanation: 'Следует из теоремы Пифагора на единичной окружности (x² + y² = 1).',
  },
  {
    id: '5',
    category: 'trig',
    title: 'Синус двойного угла',
    frontPrompt: 'Формула для sin(2α)',
    formula: '\\sin(2\\alpha) = 2\\sin(\\alpha)\\cos(\\alpha)',
    explanation: 'Удвоенное произведение синуса на косинус половинного угла.',
  },
  {
    id: '6',
    category: 'trig',
    title: 'Косинус двойного угла',
    frontPrompt: 'Формула для cos(2α)',
    formula: '\\cos(2\\alpha) = \\cos^2(\\alpha) - \\sin^2(\\alpha) = 2\\cos^2(\\alpha) - 1',
    explanation: 'Разность квадратов косинуса и синуса.',
  },
  {
    id: '7',
    category: 'geom',
    title: 'Формула Герона для площади',
    frontPrompt: 'Площадь треугольника через три стороны a, b, c',
    formula: 'S = \\sqrt{p(p-a)(p-b)(p-c)}, \\quad p = \\frac{a+b+c}{2}',
    explanation: 'Где p — полупериметр треугольника.',
  },
  {
    id: '8',
    category: 'geom',
    title: 'Теорема косинусов',
    frontPrompt: 'Квадрат стороны треугольника напротив угла γ',
    formula: 'c^2 = a^2 + b^2 - 2ab\\cos(\\gamma)',
    explanation: 'Обобщение теоремы Пифагора для любого угла.',
  },
  {
    id: '9',
    category: 'calc',
    title: 'Производная произведения',
    frontPrompt: 'Чему равна (u · v)′?',
    formula: '(u \\cdot v)\' = u\'v + uv\'',
    explanation: 'Производная первого на второй плюс первый на производную второго.',
  },
  {
    id: '10',
    category: 'calc',
    title: 'Производная дроби',
    frontPrompt: 'Чему равна (u / v)′?',
    formula: '\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}',
    explanation: 'Знаменатель всегда возводится в квадрат!',
  },
  {
    id: '11',
    category: 'comb',
    title: 'Число сочетаний C(n, k)',
    frontPrompt: 'Формула выбора k элементов из n без учета порядка',
    formula: 'C_n^k = \\frac{n!}{k!(n-k)!}',
    explanation: 'Используется в биноме Ньютона и теории вероятностей.',
  },
  {
    id: '12',
    category: 'comb',
    title: 'Число размещений A(n, k)',
    frontPrompt: 'Выбор k элементов из n с учетом порядка',
    formula: 'A_n^k = \\frac{n!}{(n-k)!}',
    explanation: 'Порядок элементов важен (например, пароли или пьедестал почёта).',
  },
];

export function FormulaTrainer() {
  const [selectedCat, setSelectedCat] = useState<'all' | 'algebra' | 'trig' | 'geom' | 'calc' | 'comb'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());

  const filteredCards = CARDS_DATA.filter(
    (c) => selectedCat === 'all' || c.category === selectedCat
  );

  const card = filteredCards[currentIndex] || filteredCards[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    playClickSound();
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    playClickSound();
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    playClickSound();
  };

  const handleMarkKnown = () => {
    if (!card) return;
    const next = new Set(knownIds);
    next.add(card.id);
    setKnownIds(next);
    playSuccessSound();

    if (next.size === CARDS_DATA.length) {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }

    handleNext();
  };

  return (
    <div>
      {/* Category filters */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '22px', paddingBottom: '4px' }}>
        {[
          ['all', 'Все формулы'],
          ['algebra', 'Алгебра'],
          ['trig', 'Тригонометрия'],
          ['geom', 'Геометрия'],
          ['calc', 'Матанализ'],
          ['comb', 'Комбинаторика'],
        ].map(([cat, label]) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCat(cat as any);
              setCurrentIndex(0);
              setIsFlipped(false);
              playClickSound();
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedCat === cat ? 'var(--primary-gradient)' : 'var(--surface-secondary)',
              color: selectedCat === cat ? '#fff' : 'var(--text-muted)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Progress & Card count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '13px' }}>
        <span style={{ color: 'var(--text-muted)' }}>
          Карточка <b>{currentIndex + 1}</b> из <b>{filteredCards.length}</b>
        </span>
        <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
          Изучено: {knownIds.size} / {CARDS_DATA.length}
        </span>
      </div>

      {/* 3D Flip Card Container */}
      <div style={{ perspective: '1200px', minHeight: '260px', marginBottom: '20px' }}>
        <motion.div
          onClick={handleFlip}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            minHeight: '260px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            cursor: 'pointer',
          }}
        >
          {/* Front Face */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: '20px',
              padding: '32px',
              background: 'linear-gradient(145deg, var(--surface), var(--surface-secondary))',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.05em' }}>
                {card?.category.toUpperCase()}
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '8px', marginBottom: '14px' }}>
                {card?.title}
              </h3>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {card?.frontPrompt}
              </p>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
              🔄 Кликни, чтобы перевернуть карту
            </div>
          </div>

          {/* Back Face */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: '20px',
              padding: '32px',
              background: 'linear-gradient(145deg, var(--surface), var(--surface-secondary))',
              border: '1px solid var(--primary)',
              boxShadow: '0 8px 32px rgba(79, 70, 229, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent-emerald)', fontWeight: 800 }}>
                ✓ ТОЧНАЯ ФОРМУЛА
              </span>
              <div style={{ margin: '18px 0', padding: '16px', borderRadius: '12px', background: 'var(--surface)' }}>
                <KaTeXMath math={card?.formula || ''} block />
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {card?.explanation}
              </p>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
              🔄 Кликни, чтобы вернуться
            </div>
          </div>
        </motion.div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={handlePrev}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            background: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          ← Назад
        </button>

        <button
          onClick={handleMarkKnown}
          style={{
            padding: '10px 24px',
            borderRadius: '12px',
            background: 'var(--accent-emerald)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
          }}
        >
          ✓ Знаю формулу
        </button>

        <button
          onClick={handleNext}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            background: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Вперёд →
        </button>
      </div>
    </div>
  );
}
