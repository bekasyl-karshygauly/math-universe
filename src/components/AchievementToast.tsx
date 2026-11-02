'use client';
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