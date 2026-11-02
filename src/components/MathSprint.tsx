'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Timer } from 'lucide-react';
import { playClickSound, playSuccessSound, playFanfareSound } from '../lib/sound';
import { labConfetti } from '../lib/celebrate';

interface Question {
  text: string;
  answer: number;
  options: number[];
}

function generateQuestion(): Question {
  const types = ['add', 'sub', 'mul', 'pow', 'sqrt'];
  const type = types[Math.floor(Math.random() * types.length)];
  let text = '';
  let answer = 0;

  if (type === 'add') {
    const a = Math.floor(Math.random() * 80) + 12;
    const b = Math.floor(Math.random() * 80) + 12;
    text = `${a} + ${b}`;
    answer = a + b;
  } else if (type === 'sub') {
    const a = Math.floor(Math.random() * 90) + 20;
    const b = Math.floor(Math.random() * (a - 10)) + 5;
    text = `${a} - ${b}`;
    answer = a - b;
  } else if (type === 'mul') {
    const a = Math.floor(Math.random() * 12) + 3;
    const b = Math.floor(Math.random() * 12) + 3;
    text = `${a} × ${b}`;
    answer = a * b;
  } else if (type === 'pow') {
    const bases = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const base = bases[Math.floor(Math.random() * bases.length)];
    text = `${base}²`;
    answer = base * base;
  } else {
    const squares = [16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
    const sq = squares[Math.floor(Math.random() * squares.length)];
    text = `√${sq}`;
    answer = Math.round(Math.sqrt(sq));
  }

  // Generate 3 unique wrong options near the answer
  const optionsSet = new Set<number>([answer]);
  while (optionsSet.size < 4) {
    const offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
    const candidate = answer + offset;
    if (candidate > 0 && candidate !== answer) {
      optionsSet.add(candidate);
    }
  }

  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
  return { text, answer, options };
}

export function MathSprint() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [bestScore, setBestScore] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('mu_sprint_best');
    if (stored) setBestScore(parseInt(stored, 10) || 0);
    // Stop the countdown when the sprint is left mid-game (tab switch or page change)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setTotalAnswered(0);
    setCorrectCount(0);
    setCurrentQ(generateQuestion());
    playSuccessSound();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    setIsPlaying(false);
    playFanfareSound();
    labConfetti(80);

    setScore((finalScore) => {
      const stored = localStorage.getItem('mu_sprint_best');
      const curBest = stored ? parseInt(stored, 10) : 0;
      if (finalScore > curBest) {
        setBestScore(finalScore);
        localStorage.setItem('mu_sprint_best', String(finalScore));
      }
      return finalScore;
    });
  };

  const handleSelectOption = (chosen: number) => {
    if (!currentQ || !isPlaying) return;

    setTotalAnswered((p) => p + 1);

    if (chosen === currentQ.answer) {
      const multiplier = streak >= 5 ? 3 : streak >= 2 ? 2 : 1;
      const pts = 100 * multiplier;
      setScore((s) => s + pts);
      setStreak((st) => st + 1);
      setCorrectCount((c) => c + 1);
      setFeedback('correct');
      playClickSound();
    } else {
      setStreak(0);
      setFeedback('wrong');
      playClickSound();
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentQ(generateQuestion());
    }, 180);
  };

  return (
    <div className="panel panel--instrument sprint">
      {!isPlaying && timeLeft === 60 && (
        <div className="sprint__intro">
          <p className="eyebrow eyebrow--muted">60 s</p>
          <h2 className="calc-panel__title">Математический спринт</h2>
          <p className="lead" style={{ fontSize: '15px', marginBottom: '22px' }}>
            Решай примеры на скорость. Серия правильных ответов включает множитель очков (×2, ×3).
          </p>

          {bestScore > 0 && (
            <p className="result-note" style={{ marginBottom: '20px' }}>
              Лучший рекорд: <b className="mono" style={{ color: 'var(--primary)' }}>{bestScore}</b> очков
            </p>
          )}

          <button type="button" className="btn btn--primary" onClick={startGame}>
            <Play size={16} aria-hidden="true" />
            Начать спринт
          </button>
        </div>
      )}

      {isPlaying && currentQ && (
        <div>
          {/* Header Stats */}
          <div className="sprint__stats">
            <span className={`sprint__timer mono${timeLeft <= 10 ? ' is-low' : ''}`} role="timer" aria-live="off">
              <Timer size={18} aria-hidden="true" />
              {timeLeft} s
            </span>

            {streak >= 2 && (
              <span className="chip chip--accent mono">
                ×{streak >= 5 ? 3 : 2} · {streak} подряд
              </span>
            )}

            <span className="sprint__score">
              <span className="metric__label">Счёт</span>
              <span className="mono">{score}</span>
            </span>
          </div>

          {/* Time progress bar */}
          <div className="progress-track" style={{ marginBottom: '24px' }} aria-hidden="true">
            <div className="progress-fill" style={{ width: `${(timeLeft / 60) * 100}%`, background: timeLeft <= 10 ? 'var(--accent-rose)' : undefined }} />
          </div>

          {/* Question Card */}
          <div
            key={currentQ.text}
            className={`sprint__question reveal${feedback === 'correct' ? ' is-correct' : feedback === 'wrong' ? ' is-wrong' : ''}`}
            aria-live="polite"
          >
            <span className="mono">{currentQ.text} = ?</span>
            <span className="sr-only">{feedback === 'correct' ? '✓' : feedback === 'wrong' ? '✗' : ''}</span>
          </div>

          {/* 4 Options Grid */}
          <div className="sprint__options">
            {currentQ.options.map((opt) => (
              <button key={opt} type="button" className="choice sprint__option mono" onClick={() => handleSelectOption(opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {!isPlaying && timeLeft === 0 && (
        <div className="sprint__intro reveal" role="status">
          <p className="eyebrow eyebrow--muted">Время вышло</p>
          <h2 className="calc-panel__title">Результат спринта</h2>

          <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', margin: '8px 0 24px' }}>
            <div className="metric">
              <span className="metric__label">Счёт</span>
              <span className="metric__value" style={{ color: 'var(--primary)' }}>{score}</span>
            </div>
            <div className="metric">
              <span className="metric__label">Решено</span>
              <span className="metric__value">{correctCount} / {totalAnswered}</span>
            </div>
            <div className="metric">
              <span className="metric__label">Точность</span>
              <span className="metric__value">{totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0}%</span>
            </div>
          </div>

          <button type="button" className="btn btn--primary" onClick={startGame}>
            <RotateCcw size={16} aria-hidden="true" />
            Играть ещё раз
          </button>
        </div>
      )}
    </div>
  );
}
