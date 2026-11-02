'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { KaTeXMath } from './KaTeXMath';
import { playClickSound, playSuccessSound } from '../lib/sound';
import { labConfetti } from '../lib/celebrate';

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
      labConfetti();
    }

    handleNext();
  };

  return (
    <div className="panel panel--instrument flashcards">
      {/* Category filters */}
      <div className="seg-tabs seg-tabs--scroll" role="group" aria-label="Категория формул" style={{ marginBottom: '20px' }}>
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
            type="button"
            className="seg-tab"
            aria-pressed={selectedCat === cat}
            onClick={() => {
              setSelectedCat(cat as any);
              setCurrentIndex(0);
              setIsFlipped(false);
              playClickSound();
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Progress & Card count */}
      <div className="quiz-card__meta">
        <span className="mono">
          {currentIndex + 1} / {filteredCards.length}
        </span>
        <span className="mono" style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
          Изучено: {knownIds.size} / {CARDS_DATA.length}
        </span>
      </div>

      {/* Flip card: a real button, so it works with keyboard and screen readers */}
      <div className="flashcard__stage">
        <motion.button
          type="button"
          className="flashcard"
          onClick={handleFlip}
          aria-pressed={isFlipped}
          aria-label={isFlipped ? `${card?.title}: ${card?.explanation}` : `${card?.title}. ${card?.frontPrompt}. Перевернуть карточку`}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
        >
          {/* Front Face */}
          <span className="flashcard__face" aria-hidden={isFlipped}>
            <span className="eyebrow eyebrow--muted">{card?.category}</span>
            <span className="flashcard__title">{card?.title}</span>
            <span className="flashcard__prompt">{card?.frontPrompt}</span>
            <span className="field-help flashcard__hint">Нажмите, чтобы увидеть формулу</span>
          </span>

          {/* Back Face */}
          <span className="flashcard__face flashcard__face--back" aria-hidden={!isFlipped}>
            <span className="eyebrow" style={{ color: 'var(--primary)' }}>
              Формула
            </span>
            <span className="flashcard__formula">
              <KaTeXMath math={card?.formula || ''} block />
            </span>
            <span className="flashcard__prompt" style={{ fontSize: '14px' }}>
              {card?.explanation}
            </span>
            <span className="field-help flashcard__hint">Нажмите, чтобы вернуться</span>
          </span>
        </motion.button>
      </div>

      {/* Control Buttons */}
      <div className="flashcards__nav">
        <button type="button" className="btn btn--secondary" onClick={handlePrev}>
          <ArrowLeft size={16} aria-hidden="true" />
          Назад
        </button>
        <button type="button" className="btn btn--primary" onClick={handleMarkKnown}>
          <Check size={16} aria-hidden="true" />
          Знаю формулу
        </button>
        <button type="button" className="btn btn--secondary" onClick={handleNext}>
          Вперёд
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
