'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/auth-context';
import { getLeaderboard, getQuizAttempts, xpToLevel, levelProgress, signOut, Profile, QuizAttempt } from '../lib/supabase';
import { ACHIEVEMENTS } from '../data/achievements';
import { Language } from '../lib/storage';
import { COURSES } from '../data/courses';
import { I18N } from '../data/i18n';

interface DashboardModalProps {
  onClose: () => void;
  lang: Language;
  progress: Record<string, boolean[]>;
}

type Tab = 'profile' | 'achievements' | 'leaderboard' | 'analytics';

export function DashboardModal({ onClose, lang, progress }: DashboardModalProps) {
  const { user, profile, unlockedKeys } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');
  const [leaders, setLeaders] = useState<Profile[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    const [lb, qa] = await Promise.all([getLeaderboard(20), getQuizAttempts(user.id)]);
    setLeaders(lb);
    setQuizHistory(qa);
    setLoadingData(false);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  if (!user || !profile) return null;

  const lvl = xpToLevel(profile.xp);
  const pct = levelProgress(profile.xp);
  const totalLessons = COURSES.reduce((a, c) => a + c.lessons.length, 0);
  const completedLessons = Object.values(progress).reduce((a, arr) => a + (arr || []).filter(Boolean).length, 0);
  const progressPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'profile', icon: '👤', label: 'Профиль' },
    { id: 'achievements', icon: '🏆', label: 'Достижения' },
    { id: 'leaderboard', icon: '📊', label: 'Лидеры' },
    { id: 'analytics', icon: '📈', label: 'Аналитика' },
  ];

  const cardStyle = { background: 'var(--surface-secondary)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)' };

  // Weak areas analysis from quiz history
  const topicStats: Record<string, { total: number; correct: number }> = {};
  quizHistory.forEach((a) => {
    if (!topicStats[a.topic]) topicStats[a.topic] = { total: 0, correct: 0 };
    topicStats[a.topic].total += a.total;
    topicStats[a.topic].correct += a.score;
  });
  // Attempts store the course id (or 'all'); show a readable title
  const topicLabel = (topic: string) =>
    topic === 'all' ? (I18N[lang]['quiz_all'] || topic) : COURSES.find((c) => c.id === topic)?.title[lang] || topic;

  const weakAreas = Object.entries(topicStats)
    .map(([topic, s]) => ({ topic, accuracy: s.total ? Math.round((s.correct / s.total) * 100) : 0 }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
        <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
          style={{ background: 'var(--surface)', borderRadius: '28px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}>

          {/* Header */}
          <div style={{ padding: '28px 28px 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#fff', fontWeight: 900, boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
                  {profile.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '18px' }}>{profile.username}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{user.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={async () => { await signOut(); onClose(); }}
                  style={{ padding: '7px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', fontWeight: 700, fontSize: '12.5px', border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer' }}>
                  Выйти
                </button>
                <button onClick={onClose} style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border)', borderRadius: '10px', width: '34px', height: '34px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ padding: '9px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap', background: tab === t.id ? 'var(--primary-gradient)' : 'transparent', color: tab === t.id ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, transition: 'all 0.2s' }}>
                  <span>{t.icon}</span><span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '20px 28px 28px', overflowY: 'auto', flex: 1 }}>
            <AnimatePresence mode="wait">
              {/* ── PROFILE ── */}
              {tab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* XP Card */}
                  <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Уровень</div>
                        <div style={{ fontSize: '32px', fontWeight: 900, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lv. {lvl}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Всего XP</div>
                        <div style={{ fontSize: '28px', fontWeight: 900 }}>{profile.xp.toLocaleString()}</div>
                      </div>
                    </div>
                    <div style={{ background: 'var(--border)', borderRadius: '6px', height: '10px', overflow: 'hidden', marginBottom: '6px' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                        style={{ height: '100%', background: 'var(--primary-gradient)', borderRadius: '6px' }} />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{Math.round(pct)}% до следующего уровня</div>
                  </div>

                  {/* Stats grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    {[
                      { icon: '🔥', label: 'Стрик', val: `${profile.streak} д.` },
                      { icon: '📚', label: 'Уроков', val: `${completedLessons}/${totalLessons}` },
                      { icon: '🏆', label: 'Достижений', val: unlockedKeys.length },
                    ].map((s) => (
                      <div key={s.label} style={{ ...cardStyle, textAlign: 'center' }}>
                        <div style={{ fontSize: '26px', marginBottom: '6px' }}>{s.icon}</div>
                        <div style={{ fontWeight: 900, fontSize: '20px' }}>{s.val}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '3px' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Progress */}
                  <div style={cardStyle}>
                    <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '14px' }}>📊 Общий прогресс</div>
                    <div style={{ background: 'var(--border)', borderRadius: '6px', height: '12px', overflow: 'hidden', marginBottom: '8px' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
                        style={{ height: '100%', background: 'linear-gradient(90deg,#10b981,#06b6d4)', borderRadius: '6px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <span>{completedLessons} из {totalLessons} уроков</span>
                      <span style={{ fontWeight: 700 }}>{progressPct}%</span>
                    </div>
                  </div>

                  {/* Per-course progress */}
                  <div style={cardStyle}>
                    <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '14px' }}>📚 По курсам</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {COURSES.map((c) => {
                        const done = (progress[c.id] || []).filter(Boolean).length;
                        const total = c.lessons.length;
                        const cp = total ? Math.round((done / total) * 100) : 0;
                        return (
                          <div key={c.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                              <span style={{ fontWeight: 600 }}>{c.icon} {c.title[lang]}</span>
                              <span style={{ color: 'var(--text-muted)' }}>{done}/{total}</span>
                            </div>
                            <div style={{ background: 'var(--border)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${cp}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                                style={{ height: '100%', background: 'var(--primary-gradient)', borderRadius: '4px' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── ACHIEVEMENTS ── */}
              {tab === 'achievements' && (
                <motion.div key="achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    Разблокировано: <b style={{ color: 'var(--text-primary)' }}>{unlockedKeys.length}</b> / {ACHIEVEMENTS.length}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {ACHIEVEMENTS.map((a) => {
                      const unlocked = unlockedKeys.includes(a.key);
                      return (
                        <motion.div key={a.key} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          style={{ ...cardStyle, opacity: unlocked ? 1 : 0.45, display: 'flex', gap: '12px', alignItems: 'flex-start', position: 'relative', overflow: 'hidden' }}>
                          {unlocked && <div style={{ position: 'absolute', top: 0, right: 0, left: 0, height: '2px', background: 'var(--primary-gradient)' }} />}
                          <div style={{ fontSize: '30px', flexShrink: 0 }}>{a.icon}</div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '13.5px', marginBottom: '3px' }}>{a.title[lang]}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.4 }}>{a.description[lang]}</div>
                            <div style={{ marginTop: '6px', fontSize: '11.5px', fontWeight: 700, color: unlocked ? '#10b981' : 'var(--text-muted)' }}>
                              {unlocked ? '✓ Разблокировано' : `+${a.xpReward} XP`}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── LEADERBOARD ── */}
              {tab === 'leaderboard' && (
                <motion.div key="leaderboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {loadingData ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Загрузка...</div>
                  ) : leaders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Пока никого нет. Будь первым! 🚀</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {leaders.map((p, i) => {
                        const isMe = p.id === user.id;
                        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
                        return (
                          <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '14px', background: isMe ? 'rgba(99,102,241,0.12)' : 'var(--surface-secondary)', border: isMe ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--border)' }}>
                            <div style={{ fontSize: '18px', width: '28px', textAlign: 'center', flexShrink: 0 }}>{medal}</div>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '14px', flexShrink: 0 }}>
                              {p.username?.[0]?.toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 800, fontSize: '14px' }}>{p.username} {isMe && <span style={{ fontSize: '11px', color: 'var(--primary)' }}>(Ты)</span>}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Ур. {xpToLevel(p.xp)} · 🔥{p.streak} дней</div>
                            </div>
                            <div style={{ fontWeight: 900, fontSize: '15px', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                              {p.xp.toLocaleString()} XP
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── ANALYTICS ── */}
              {tab === 'analytics' && (
                <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Weak areas */}
                  <div style={cardStyle}>
                    <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '14px' }}>🔍 Слабые места (по квизам)</div>
                    {weakAreas.length === 0 ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Пройди несколько квизов, чтобы увидеть аналитику</div>
                    ) : weakAreas.map((w) => (
                      <div key={w.topic} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                          <span style={{ fontWeight: 600 }}>{topicLabel(w.topic)}</span>
                          <span style={{ color: w.accuracy < 60 ? '#ef4444' : w.accuracy < 80 ? '#f97316' : '#10b981', fontWeight: 700 }}>{w.accuracy}%</span>
                        </div>
                        <div style={{ background: 'var(--border)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${w.accuracy}%` }} transition={{ duration: 0.8 }}
                            style={{ height: '100%', borderRadius: '4px', background: w.accuracy < 60 ? '#ef4444' : w.accuracy < 80 ? '#f97316' : '#10b981' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quiz history */}
                  <div style={cardStyle}>
                    <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '14px' }}>📋 История квизов</div>
                    {quizHistory.length === 0 ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Ещё нет попыток</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                        {quizHistory.slice(0, 20).map((a) => (
                          <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', background: 'var(--background)', fontSize: '13px' }}>
                            <div>
                              <div style={{ fontWeight: 700 }}>{topicLabel(a.topic)}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>{new Date(a.created_at).toLocaleDateString('ru-RU')}</div>
                            </div>
                            <div style={{ fontWeight: 900, color: a.score / a.total >= 0.8 ? '#10b981' : a.score / a.total >= 0.6 ? '#f97316' : '#ef4444' }}>
                              {a.score}/{a.total}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}