# Shared UI
Custom React components; no shared Button/Card library. Most styles are inline.

## src/components/KaTeXMath.tsx
```tsx
'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface KaTeXMathProps {
  math: string;
  block?: boolean;
  className?: string;
}

export function KaTeXMath({ math, block = false, className = '' }: KaTeXMathProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false,
        });
      } catch (err) {
        containerRef.current.innerText = math;
      }
    }
  }, [math, block]);

  return <span ref={containerRef} className={`katex-wrap ${className}`} />;
}

```

## src/components/MathRenderer.tsx
```tsx
'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Parses raw HTML string and transforms all LaTeX delimiters:
 * - $$ ... $$ -> display mode KaTeX
 * - \( ... \) -> inline KaTeX
 * - $ ... $   -> inline KaTeX
 */
export function renderLatexInHtml(html: string): string {
  if (!html) return '';

  let output = html;

  // 1. Replace display math $$ ... $$
  output = output.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
      });
    } catch (e) {
      return math;
    }
  });

  // 2. Replace inline math \( ... \)
  output = output.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch (e) {
      return math;
    }
  });

  // 3. Replace single $ ... $ (avoiding currency or double $$)
  output = output.replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (match, prefix, math) => {
    try {
      return prefix + katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch (e) {
      return match;
    }
  });

  return output;
}

export function MathRenderer({ content, className = '' }: MathRendererProps) {
  const renderedHtml = useMemo(() => {
    return renderLatexInHtml(content);
  }, [content]);

  return (
    <div
      className={`math-content ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}

```

## src/components/AchievementToast.tsx
```tsx
﻿'use client';
import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ACHIEVEMENTS } from '../data/achievements';
import { Language } from '../lib/storage';

interface AchievementToastProps {
  achievementKey: string;
  lang: Language;
  onDone: () => void;
}

export function AchievementToast({ achievementKey, lang, onDone }: AchievementToastProps) {
  const def = ACHIEVEMENTS.find((a) => a.key === achievementKey);
  // Ref keeps the 4s timer from restarting when the parent passes a new callback
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    const t = setTimeout(() => onDoneRef.current(), 4000);
    return () => clearTimeout(t);
  }, []);
  if (!def) return null;
  return (
    // x: '-50%' centers the toast; a CSS transform would be overwritten by the animation
    <motion.div initial={{ opacity: 0, x: '-50%', y: 60, scale: 0.8 }} animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }} exit={{ opacity: 0, x: '-50%', y: 60, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      style={{ position: 'fixed', bottom: '80px', left: '50%', zIndex: 10001, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderRadius: '20px', padding: '16px 24px', boxShadow: '0 20px 60px rgba(79,70,229,0.5)', display: 'flex', alignItems: 'center', gap: '16px', minWidth: '300px' }}>
      <div style={{ fontSize: '36px', flexShrink: 0 }}>{def.icon}</div>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>🏆 Достижение разблокировано!</div>
        <div style={{ fontSize: '17px', fontWeight: 900 }}>{def.title[lang]}</div>
        <div style={{ fontSize: '12.5px', opacity: 0.85, marginTop: '2px' }}>{def.description[lang]} · +{def.xpReward} XP</div>
      </div>
    </motion.div>
  );
}
```

## src/components/UserHUD.tsx
```tsx
﻿'use client';
import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/auth-context';
import { levelProgress, xpToLevel } from '../lib/supabase';

interface UserHUDProps {
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export function UserHUD({ onOpenAuth, onOpenProfile }: UserHUDProps) {
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  if (!user || !profile) {
    return (
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
        onClick={onOpenAuth}
        style={{ padding: '8px 18px', borderRadius: '10px', background: 'var(--primary-gradient)', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', boxShadow: '0 3px 12px rgba(99,102,241,0.35)' }}>
        🔐 Войти
      </motion.button>
    );
  }

  const lvl = xpToLevel(profile.xp);
  const pct = levelProgress(profile.xp);

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={onOpenProfile}
      style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 12px', borderRadius: '14px', background: 'var(--surface-secondary)', border: '1px solid var(--border)' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '14px', flexShrink: 0 }}>
        {profile.username?.[0]?.toUpperCase() || '?'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, fontSize: '13px' }}>{profile.username}</span>
          <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lv.{lvl}</span>
          {profile.streak > 0 && (
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#f97316' }}>🔥{profile.streak}</span>
          )}
        </div>
        <div style={{ width: '90px', height: '4px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ height: '100%', background: 'var(--primary-gradient)', borderRadius: '4px' }} />
        </div>
      </div>
    </motion.div>
  );
}
```
