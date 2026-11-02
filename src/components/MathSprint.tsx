'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessSound, playFanfareSound } from '../lib/sound';

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
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

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
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      {!isPlaying && timeLeft === 60 && (
        <div style={{ textAlign: 'center', padding: '36px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '14px' }}>⚡</div>
          <h3 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '10px' }}>
            60-Секундный Математический Спринт
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '26px' }}>
            Решай примеры на скорость! Каждая серия правильных ответов активирует множитель очков (×2, ×3). Проверь свой устный счёт!
          </p>

          {bestScore > 0 && (
            <div style={{ display: 'inline-block', padding: '10px 22px', borderRadius: '14px', background: 'var(--surface-secondary)', border: '1px solid var(--border)', marginBottom: '24px', fontWeight: 800, fontSize: '15px' }}>
              🏆 Лучший рекорд: <span style={{ color: 'var(--primary)' }}>{bestScore} очков</span>
            </div>
          )}

          <div>
            <button
              onClick={startGame}
              style={{
                padding: '16px 48px',
                borderRadius: '16px',
                background: 'var(--primary-gradient)',
                color: '#fff',
                fontWeight: 900,
                fontSize: '18px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(79, 70, 229, 0.45)',
              }}
            >
              🚀 Начать спринт!
            </button>
          </div>
        </div>
      )}

      {isPlaying && currentQ && (
        <div>
          {/* Header Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            {/* Timer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>⏱</span>
              <span style={{ fontSize: '26px', fontWeight: 900, color: timeLeft <= 10 ? 'var(--accent-rose)' : 'var(--text-primary)' }}>
                {timeLeft}s
              </span>
            </div>

            {/* Streak Multiplier */}
            {streak >= 2 && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.3 }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '14px',
                }}
              >
                🔥 КОМБО {streak >= 5 ? '×3' : '×2'} ({streak} подряд)
              </motion.div>
            )}

            {/* Score */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>СЧЁТ</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--primary)' }}>{score}</div>
            </div>
          </div>

          {/* Time progress bar */}
          <div style={{ height: '6px', background: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '28px' }}>
            <motion.div
              style={{
                height: '100%',
                background: timeLeft <= 10 ? 'var(--accent-rose)' : 'var(--primary-gradient)',
                borderRadius: '4px',
                width: `${(timeLeft / 60) * 100}%`,
              }}
            />
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQ.text}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: feedback === 'correct' ? 1.04 : feedback === 'wrong' ? 0.97 : 1,
              opacity: 1,
            }}
            transition={{ duration: 0.15 }}
            style={{
              padding: '40px 24px',
              borderRadius: '24px',
              textAlign: 'center',
              background:
                feedback === 'correct'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : feedback === 'wrong'
                  ? 'rgba(244, 63, 94, 0.15)'
                  : 'var(--surface)',
              border: `2px solid ${
                feedback === 'correct'
                  ? 'var(--accent-emerald)'
                  : feedback === 'wrong'
                  ? 'var(--accent-rose)'
                  : 'var(--border)'
              }`,
              boxShadow: 'var(--shadow-md)',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.02em' }}>
              {currentQ.text} = ?
            </div>
          </motion.div>

          {/* 4 Options Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {currentQ.options.map((opt) => (
              <motion.button
                key={opt}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelectOption(opt)}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  fontSize: '24px',
                  fontWeight: 900,
                  border: '1px solid var(--border)',
                  background: 'var(--surface-secondary)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {!isPlaying && timeLeft === 0 && (
        <div style={{ textAlign: 'center', padding: '36px 20px' }}>
          <div style={{ fontSize: '56px', marginBottom: '10px' }}>🎉</div>
          <h3 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '6px' }}>Время вышло!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px' }}>
            Отличный результат в спринте!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--surface-secondary)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>ИТОГОВЫЙ СЧЁТ</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--primary)' }}>{score}</div>
            </div>
            <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--surface-secondary)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>РЕШЕНО</div>
              <div style={{ fontSize: '28px', fontWeight: 900 }}>{correctCount} / {totalAnswered}</div>
            </div>
            <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--surface-secondary)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>ТОЧНОСТЬ</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--accent-emerald)' }}>
                {totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0}%
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            style={{
              padding: '14px 40px',
              borderRadius: '14px',
              background: 'var(--primary-gradient)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)',
            }}
          >
            ↺ Играть ещё раз
          </button>
        </div>
      )}
    </div>
  );
}
