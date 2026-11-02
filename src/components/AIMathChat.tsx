'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { Dialog } from './ui/Dialog';
import { CHAT_GREETING, CHAT_SUGGESTIONS, getChatAnswer } from '../data/chatAnswers';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  onClose: () => void;
  lang: Language;
}

// Renders **bold** segments of the prepared answers
function renderAnswer(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <React.Fragment key={i}>{part}</React.Fragment>
  );
}

export function AIMathChat({ onClose, lang }: AIChatProps) {
  const t = (k: string) => I18N[lang][k] || k;
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: CHAT_GREETING[lang] },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputId = 'math-chat-input';

  // Scroll only the message log (block: 'nearest' never moves the page behind the dialog)
  useEffect(() => { bottomRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    // Answer in the language the question was written in
    setMessages((prev) => [...prev, { role: 'assistant', content: getChatAnswer(userMsg, lang) }]);
    setLoading(false);
  };

  const suggestions = CHAT_SUGGESTIONS[lang];

  return (
    <Dialog onClose={onClose} title={t('chat_title')} subtitle={t('chat_sub')} closeLabel={t('close')} maxWidth={720} height="85vh" bodyClassName="chat__body">
      <div className="chat">
        <ol className="chat__log" aria-live="polite" aria-relevant="additions">
          {messages.map((m, i) => (
            <li key={i} className={`chat__msg chat__msg--${m.role} reveal`}>
              {renderAnswer(m.content)}
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