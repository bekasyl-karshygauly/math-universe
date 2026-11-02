'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../lib/storage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  onClose: () => void;
  lang: Language;
}

// Smart template responses
function getAIResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('квадратн') || q.includes('уравнен') || q.includes('ax²') || q.includes('дискриминант')) {
    return `📐 **Квадратное уравнение** ax² + bx + c = 0\n\n**Шаги решения:**\n1. Вычисли дискриминант: D = b² - 4ac\n2. Если D > 0 → два корня: x = (-b ± √D) / 2a\n3. Если D = 0 → один корень: x = -b / 2a\n4. Если D < 0 → нет вещественных корней\n\n**Пример:** x² - 5x + 6 = 0\nD = 25 - 24 = 1\nx₁ = (5+1)/2 = 3, x₂ = (5-1)/2 = 2 ✓`;
  }
  if (q.includes('производн') || q.includes('дифференц') || q.includes('derivative')) {
    return `📊 **Производная** — скорость изменения функции\n\n**Основные правила:**\n- (xⁿ)' = n·xⁿ⁻¹\n- (sin x)' = cos x\n- (cos x)' = -sin x\n- (eˣ)' = eˣ\n- (ln x)' = 1/x\n\n**Правило произведения:** (uv)' = u'v + uv'\n**Правило частного:** (u/v)' = (u'v - uv') / v²\n**Цепное правило:** (f(g(x)))' = f'(g(x))·g'(x)`;
  }
  if (q.includes('интеграл') || q.includes('integral')) {
    return `∫ **Интегрирование** — обратная операция к дифференцированию\n\n**Основные интегралы:**\n- ∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n- ∫sin x dx = -cos x + C\n- ∫cos x dx = sin x + C\n- ∫eˣ dx = eˣ + C\n- ∫(1/x) dx = ln|x| + C\n\n**Метод подстановки:** если есть f(g(x))·g'(x), делаем u = g(x)`;
  }
  if (q.includes('матриц') || q.includes('matrix') || q.includes('определитель')) {
    return `📋 **Матрицы**\n\n**Определитель 2×2:**\n|a b|\n|c d| = ad - bc\n\n**Умножение матриц:** строка × столбец, результат [i][j] = сумма строки i на столбец j\n\n**Обратная матрица:** A⁻¹ существует если det(A) ≠ 0\n\n**Транспонирование:** строки и столбцы меняются местами`;
  }
  if (q.includes('логарифм') || q.includes('log')) {
    return `📏 **Логарифмы**\n\nlogₐ(x) = y ⟺ aʸ = x\n\n**Свойства:**\n- log(ab) = log(a) + log(b)\n- log(a/b) = log(a) - log(b)\n- log(aⁿ) = n·log(a)\n- logₐ(b) = log(b)/log(a)\n\n**Особые значения:**\n- log₁₀(10) = 1\n- ln(e) = 1\n- log(1) = 0`;
  }
  if (q.includes('тригоном') || q.includes('sin') || q.includes('cos') || q.includes('tan')) {
    return `📐 **Тригонометрия**\n\n**Основные тождества:**\n- sin²x + cos²x = 1\n- tan x = sin x / cos x\n- sin(2x) = 2·sin x·cos x\n- cos(2x) = cos²x - sin²x\n\n**Единичная окружность:**\n- 0° → (1, 0)\n- 90° → (0, 1)\n- 180° → (-1, 0)\n- 270° → (0, -1)`;
  }
  if (q.includes('предел') || q.includes('limit') || q.includes('lim')) {
    return `🔢 **Пределы**\n\nПредел — значение к которому стремится функция\n\n**Основные правила:**\n- lim[f(x)+g(x)] = lim f(x) + lim g(x)\n- lim[f(x)·g(x)] = lim f(x) · lim g(x)\n- lim[sin(x)/x] = 1 при x→0 (1-й замечательный предел)\n- lim[(1+1/n)ⁿ] = e при n→∞ (2-й замечательный предел)\n\n**Неопределённости:** 0/0, ∞/∞ → используй правило Лопиталя`;
  }
  if (q.includes('вероятност') || q.includes('probability') || q.includes('байес')) {
    return `🎲 **Теория вероятностей**\n\n**Основные понятия:**\n- P(A) = число благоприятных / общее число\n- 0 ≤ P(A) ≤ 1\n- P(Ā) = 1 - P(A)\n\n**Формулы:**\n- P(A∪B) = P(A) + P(B) - P(A∩B)\n- P(A|B) = P(A∩B) / P(B)\n- **Теорема Байеса:** P(A|B) = P(B|A)·P(A) / P(B)`;
  }

  // General fallback
  const fallbacks = [
    `🤔 Интересный вопрос! Попробуй переформулировать более конкретно. Например:\n- "Как решить квадратное уравнение?"\n- "Объясни производную"\n- "Что такое интеграл?"\n- "Как умножать матрицы?"\n\nЯ помогу с: алгеброй, геометрией, тригонометрией, анализом, вероятностью и матрицами!`,
    `📚 Я специализируюсь на математике! Спроси меня про:\n\n✓ Квадратные уравнения\n✓ Производные и интегралы\n✓ Тригонометрию\n✓ Матрицы и определители\n✓ Логарифмы\n✓ Теорию вероятностей\n✓ Пределы\n\nЧто именно тебя интересует?`,
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export function AIMathChat({ onClose, lang }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '👋 Привет! Я AI-математик. Задай мне любой вопрос по математике — объясню теорему, помогу решить задачу или расскажу правила. Что хочешь узнать?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    const response = getAIResponse(userMsg);
    setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const suggestions = ['Как решить квадратное уравнение?', 'Объясни производную', 'Что такое интеграл?', 'Как умножать матрицы?'];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0' }}>
        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          style={{ background: 'var(--surface)', borderRadius: '28px 28px 0 0', width: '100%', maxWidth: '700px', height: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 -20px 80px rgba(0,0,0,0.4)', border: '1px solid var(--border)' }}>

          {/* Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🤖</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '16px' }}>AI-Математик</div>
                <div style={{ color: '#10b981', fontSize: '12px', fontWeight: 600 }}>● Онлайн</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border)', borderRadius: '10px', width: '34px', height: '34px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '12px 16px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user' ? 'var(--primary-gradient)' : 'var(--surface-secondary)',
                  color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap', border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                }}>
                  {m.content}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '12px 16px', background: 'var(--surface-secondary)', borderRadius: '18px 18px 18px 4px', border: '1px solid var(--border)' }}>
                  {[0, 1, 2].map((j) => (
                    <motion.span key={j} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: j * 0.2 }}
                      style={{ display: 'inline-block', width: '7px', height: '7px', background: 'var(--text-muted)', borderRadius: '50%', margin: '0 2px' }} />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 24px 12px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 }}>
              {suggestions.map((s) => (
                <button key={s} onClick={() => { setInput(s); }}
                  style={{ padding: '7px 14px', borderRadius: '20px', background: 'var(--surface-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '12.5px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '14px 24px 24px', flexShrink: 0, borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Спроси по математике..."
              style={{ flex: 1, padding: '13px 16px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--surface-secondary)', color: 'var(--text-primary)', fontSize: '14.5px', outline: 'none' }} />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={send} disabled={loading || !input.trim()}
              style={{ padding: '13px 20px', borderRadius: '14px', background: 'var(--primary-gradient)', color: '#fff', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              →
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}