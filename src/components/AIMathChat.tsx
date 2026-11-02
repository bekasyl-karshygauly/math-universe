'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { Dialog } from './ui/Dialog';

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
  const t = (k: string) => I18N[lang][k] || k;
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Здесь собраны готовые справочные ответы по основным темам: уравнения, производные, интегралы, матрицы, логарифмы, тригонометрия, пределы и вероятность. Напиши тему или выбери пример ниже.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputId = 'math-chat-input';

  useEffect(() => { bottomRef.current?.scrollIntoView({ block: 'end' }); }, [messages, loading]);

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
    <Dialog onClose={onClose} title={t('chat_title')} subtitle={t('chat_sub')} closeLabel={t('close')} maxWidth={720} height="85vh" bodyClassName="chat__body">
      <div className="chat">
        <ol className="chat__log" aria-live="polite" aria-relevant="additions">
          {messages.map((m, i) => (
            <li key={i} className={`chat__msg chat__msg--${m.role} reveal`}>
              {m.content}
            </li>
          ))}
          {loading && (
            <li className="chat__msg chat__msg--assistant chat__typing" role="status">
              {t('chat_typing')}
            </li>
          )}
          <div ref={bottomRef} />
        </ol>

        {messages.length <= 1 && (
          <div className="solver-examples chat__suggestions">
            {suggestions.map((s) => (
              <button key={s} type="button" className="chip" onClick={() => setInput(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          className="chat__form"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <label htmlFor={inputId} className="sr-only">
            {t('chat_input_label')}
          </label>
          <input
            id={inputId}
            data-autofocus
            className="field-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat_input_label')}
            autoComplete="off"
          />
          <button type="submit" className="btn btn--primary" disabled={loading || !input.trim()} aria-label={t('chat_send')}>
            <ArrowUp size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </Dialog>
  );
}