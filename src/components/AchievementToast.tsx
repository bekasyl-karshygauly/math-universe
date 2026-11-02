'use client';
import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Award } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';

interface AchievementToastProps {
  achievementKey: string;
  lang: Language;
  onDone: () => void;
}

export function AchievementToast({ achievementKey, lang, onDone }: AchievementToastProps) {
  const def = ACHIEVEMENTS.find((a) => a.key === achievementKey);
  const reduceMotion = useReducedMotion();
  // Ref keeps the timer from restarting when the parent passes a new callback
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    const t = setTimeout(() => onDoneRef.current(), 5000);
    return () => clearTimeout(t);
  }, []);
  if (!def) return null;
  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="achievement-toast"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.2, 0, 0, 1] }}
    >
      <span className="achievement-toast__icon" aria-hidden="true">
        <Award size={22} />
      </span>
      <div style={{ minWidth: 0 }}>
        <p className="eyebrow" style={{ color: 'inherit', opacity: 0.85 }}>
          {I18N[lang]['achievement_unlocked']}
        </p>
        <p className="achievement-toast__title">{def.title[lang]}</p>
        <p className="achievement-toast__desc">
          {def.description[lang]} · <span className="mono">+{def.xpReward} XP</span>
        </p>
      </div>
    </motion.div>
  );
}
