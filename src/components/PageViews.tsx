'use client';

import React from 'react';
import { motion } from 'motion/react';
import { HACKS } from '../data/hacks';
import { BONUS } from '../data/bonus';
import { COURSES } from '../data/courses';
import { KaTeXMath } from './KaTeXMath';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { NavPage } from './NavTabs';
import { playSmoothSound, playDynamicSound } from '../lib/sound';

interface SharedProps { lang: Language; }

// Section Header helper
function SectionHeader({ label, delay = 0, useInView = false }: { label: string; delay?: number; useInView?: boolean }) {
  const base = { style: { fontSize: '24px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' } as React.CSSProperties };
  const bar = <span style={{ display: 'block', width: '5px', height: '28px', borderRadius: '3px', background: 'var(--primary-gradient)' }} />;
  if (useInView) {
    return (
      <motion.h2 {...base} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45 }}>
        {bar}{label}
      </motion.h2>
    );
  }
  return (
    <motion.h2 {...base} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay }}>
      {bar}{label}
    </motion.h2>
  );
}

// HOME VIEW
interface HomeViewProps extends SharedProps {
  progress: Record<string, boolean[]>;
  quizBest: number;
  notes: string;
  onOpenCourse: (id: string) => void;
  onNav: (page: NavPage) => void;
}

export function HomeView({ lang, progress, quizBest, notes, onOpenCourse, onNav }: HomeViewProps) {
  const t = (k: string) => I18N[lang][k] || k;
  const totalLessons = COURSES.reduce((a, c) => a + c.lessons.length, 0);
  const completedLessons = Object.values(progress).reduce((a, arr) => a + (arr ? arr.filter(Boolean).length : 0), 0);
  const pct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const stats = [
    { val: `${pct}%`, label: t('st_progress') },
    { val: `${completedLessons}/${totalLessons}`, label: t('st_lessons') },
    { val: notes.trim() ? notes.trim().split('\n').length : 0, label: t('st_notes') },
  ];
  const tools: { page: NavPage; icon: string; tKey: string; dKey: string; grad: string }[] = [
    { page: 'calc', icon: '🧮', tKey: 'tool_calc', dKey: 'tool_calc_d', grad: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
    { page: 'quiz', icon: '🎯', tKey: 'tool_quiz', dKey: 'tool_quiz_d', grad: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
    { page: 'plot', icon: '📈', tKey: 'tool_plot', dKey: 'tool_plot_d', grad: 'linear-gradient(135deg,#10b981,#06b6d4)' },
    { page: 'notes', icon: '📝', tKey: 'tool_notes', dKey: 'tool_notes_d', grad: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  ];

  return (
    <motion.div key="home-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.35 }}>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="hero-gradient-animated"
        style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 35%,#06b6d4 65%,#4f46e5 100%)', borderRadius: '28px', padding: '56px 48px', color: '#fff', position: 'relative', overflow: 'hidden', marginBottom: '40px', boxShadow: 'var(--shadow-lg), 0 12px 56px rgba(79,70,229,0.38)' }}>
        <div style={{ position: 'absolute', width: '520px', height: '520px', top: '-55%', right: '-8%', background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 68%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', width: '280px', height: '280px', bottom: '-30%', left: '5%', background: 'radial-gradient(circle, rgba(6,182,212,0.20) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15 }}
            style={{ fontSize: '40px', fontWeight: 900, lineHeight: 1.18, marginBottom: '14px', letterSpacing: '-0.025em' }}>
            {t('hero_title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28 }}
            style={{ fontSize: '17px', opacity: 0.92, lineHeight: 1.65, marginBottom: '34px' }}>
            {t('hero_sub')}
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } } }} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {stats.map((s, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 20 } } }}
                whileHover={{ scale: 1.07, y: -2 }} whileTap={{ scale: 0.95 }}
                style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(14px)', padding: '16px 24px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.22)', minWidth: '130px' }}>
                <b style={{ display: 'block', fontSize: '28px', fontWeight: 900, letterSpacing: '-0.02em' }}>{s.val}</b>
                <span style={{ fontSize: '12px', opacity: 0.85, fontWeight: 600 }}>{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <SectionHeader label={t('home_courses')} delay={0.5} />
      <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.55 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px', marginBottom: '48px' }}>
        {COURSES.map((c, i) => {
          const done = (progress[c.id] || []).filter(Boolean).length;
          const total = c.lessons.length;
          const cp = total ? Math.round((done / total) * 100) : 0;
          return (
            <motion.div key={c.id}
              variants={{ hidden: { opacity: 0, y: 28, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 240, damping: 22 } } }}
              whileHover={{ y: -8, scale: 1.018, transition: { type: 'spring', stiffness: 400, damping: 20 } }} whileTap={{ scale: 0.97 }}
              onClick={() => {
                playSmoothSound();
                onOpenCourse(c.id);
              }} className="glow-card" style={{ padding: '28px', cursor: 'pointer' }}>
              <motion.div whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                style={{ width: '54px', height: '54px', borderRadius: '15px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '27px', color: '#fff', marginBottom: '18px', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
                {c.icon}
              </motion.div>
              <h3 style={{ fontSize: '18.5px', fontWeight: 800, marginBottom: '8px' }}>{c.title[lang]}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.55, marginBottom: '20px' }}>{c.desc[lang]}</p>
              <div style={{ height: '6px', background: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${cp}%` }} transition={{ duration: 0.8, delay: 0.6 + i * 0.05, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'var(--primary-gradient)', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                <span>{done}/{total} {t('lessons_done')}</span><span>{cp}%</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <SectionHeader label={t('home_tools')} useInView />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {tools.map((item) => (
          <motion.div key={item.page}
            variants={{ hidden: { opacity: 0, y: 24, scale: 0.94 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } } }}
            whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 380, damping: 20 } }} whileTap={{ scale: 0.96 }}
            onClick={() => {
              playDynamicSound();
              onNav(item.page);
            }} className="glow-card" style={{ padding: '28px', cursor: 'pointer' }}>
            <motion.div whileHover={{ scale: 1.15, rotate: -6, transition: { type: 'spring', stiffness: 500 } }}
              style={{ width: '54px', height: '54px', borderRadius: '15px', background: item.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '27px', color: '#fff', marginBottom: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}>
              {item.icon}
            </motion.div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '7px' }}>{t(item.tKey)}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.55 }}>{t(item.dKey)}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// HACKS VIEW
export function HacksView({ lang }: SharedProps) {
  const t = (k: string) => I18N[lang][k] || k;
  return (
    <motion.div key="hacks-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.28 }}>
      <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>⚡ {t('hacks_title')}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '26px' }}>{t('hacks_sub')}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {HACKS.map((h, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6, scale: 1.015 }} className="glow-card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{h.icon}</div>
            <h4 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px', color: 'var(--primary)' }}>{h.t[lang]}</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: h.f ? '12px' : '0' }}>{h.d[lang]}</p>
            {h.f && (<div style={{ padding: '12px', borderRadius: '10px', background: 'var(--surface-secondary)', border: '1px solid var(--border)' }}><KaTeXMath math={h.f} block /></div>)}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// BONUS VIEW
export function BonusView({ lang }: SharedProps) {
  const t = (k: string) => I18N[lang][k] || k;
  return (
    <motion.div key="bonus-view" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.28 }}>
      <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '20px' }}>🌌 {t('bonus_title')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {BONUS.map((b, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6, scale: 1.015 }} className="glow-card" style={{ padding: '24px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#fff', marginBottom: '16px' }}>{b.icon}</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{b.t[lang]}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: b.f ? '12px' : '0' }}>{b.d[lang]}</p>
            {b.f && (<div style={{ padding: '12px', borderRadius: '10px', background: 'var(--surface-secondary)', border: '1px solid var(--border)' }}><KaTeXMath math={b.f} block /></div>)}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
