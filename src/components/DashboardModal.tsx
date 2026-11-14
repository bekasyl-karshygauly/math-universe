'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Award, Check, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { getQuizAttempts, xpToLevel, levelProgress, signOut, QuizAttempt } from '../lib/supabase';
import { ACHIEVEMENTS } from '../data/achievements';
import { Language } from '../lib/storage';
import { COURSES } from '../data/courses';
import { MATH1_LECTURE_COUNT } from '../data/math1/constants';
import { I18N } from '../data/i18n';
import { fmt, htmlLang } from '../data/i18n-lab';
import { Dialog } from './ui/Dialog';
import { SegmentedTabs } from './ui/SegmentedTabs';
import { ActivityView } from './ActivityView';

interface DashboardModalProps {
  onClose: () => void;
  lang: Language;
  progress: Record<string, boolean[]>;
}

type Tab = 'profile' | 'achievements' | 'leaderboard' | 'analytics';

// Accuracy is shown as text and a bar; the tone is a secondary cue
const accuracyTone = (pct: number) => (pct < 60 ? 'var(--accent-rose)' : pct < 80 ? 'var(--accent-amber)' : 'var(--accent-emerald)');

export function DashboardModal({ onClose, lang, progress }: DashboardModalProps) {
  const { user, profile, unlockedKeys } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const t = (k: string) => I18N[lang][k] || k;

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    const qa = await getQuizAttempts(user.id);
    setQuizHistory(qa);
    setLoadingData(false);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  if (!user || !profile) return null;

  const lvl = xpToLevel(profile.xp);
  const pct = levelProgress(profile.xp);
  const totalLessons = COURSES.reduce((a, c) => a + c.lessons.length, 0) + MATH1_LECTURE_COUNT;
  const completedLessons = Object.values(progress).reduce((a, arr) => a + (arr || []).filter(Boolean).length, 0);
  const progressPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: t('dash_profile') },
    { id: 'achievements', label: t('dash_achievements') },
    { id: 'leaderboard', label: t('dash_leaders') },
    { id: 'analytics', label: t('dash_analytics') },
  ];

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
    <Dialog
      onClose={onClose}
      title={profile.username}
      subtitle={user.email}
      closeLabel={t('close')}
      maxWidth={720}
      headerActions={
        <button
          type="button"
          className="btn btn--danger btn--sm"
          onClick={async () => {
            await signOut();
            onClose();
          }}
        >
          <LogOut size={14} aria-hidden="true" />
          {t('dash_signout')}
        </button>
      }
    >
      <SegmentedTabs label={t('dash_tabs_label')} items={tabs} value={tab} idPrefix="dash" scroll onChange={setTab} />

      <div key={tab} id="dash-panel" role="tabpanel" aria-labelledby={`dash-tab-${tab}`} className="reveal" style={{ marginTop: '20px', display: 'grid', gap: '18px' }}>
        {/* PROFILE */}
        {tab === 'profile' && (
          <>
            <section className="dash-level">
              <div>
                <p className="metric__label">{t('dash_level')}</p>
                <p className="dash-level__value display">{lvl}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="metric__label">{t('dash_total_xp')}</p>
                <p className="metric__value" style={{ fontSize: '24px' }}>{profile.xp.toLocaleString(htmlLang(lang))}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="progress-track" aria-hidden="true">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <p className="field-help" style={{ marginTop: '6px' }}>
                  {fmt(t('dash_to_next'), { n: Math.round(100 - pct) })}
                </p>
              </div>
            </section>

            <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
              <div className="metric">
                <span className="metric__label">{t('dash_streak')}</span>
                <span className="metric__value">{profile.streak}</span>
              </div>
              <div className="metric">
                <span className="metric__label">{t('dash_lessons')}</span>
                <span className="metric__value">{completedLessons}/{totalLessons}</span>
              </div>
              <div className="metric">
                <span className="metric__label">{t('dash_achievements_count')}</span>
                <span className="metric__value">{unlockedKeys.length}</span>
              </div>
            </div>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 className="field-label">{t('dash_overall')}</h3>
                <span className="mono" style={{ fontSize: '13px' }}>{progressPct}%</span>
              </div>
              <div className="progress-track" aria-hidden="true">
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </section>

            <section>
              <h3 className="field-label" style={{ marginBottom: '10px' }}>{t('dash_by_course')}</h3>
              <ul className="dash-bars">
                {COURSES.map((c) => {
                  const done = (progress[c.id] || []).filter(Boolean).length;
                  const total = c.lessons.length;
                  const cp = total ? Math.round((done / total) * 100) : 0;
                  return (
                    <li key={c.id}>
                      <div className="dash-bars__row">
                        <span>{c.title[lang]}</span>
                        <span className="mono">{done}/{total}</span>
                      </div>
                      <div className="progress-track" aria-hidden="true">
                        <div className="progress-fill" style={{ width: `${cp}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        )}

        {/* ACHIEVEMENTS */}
        {tab === 'achievements' && (
          <>
            <p className="result-note">{fmt(t('dash_unlocked'), { n: unlockedKeys.length, total: ACHIEVEMENTS.length })}</p>
            <ul className="dash-achievements">
              {ACHIEVEMENTS.map((a) => {
                const unlocked = unlockedKeys.includes(a.key);
                return (
                  <li key={a.key} className={`dash-achievement${unlocked ? ' is-unlocked' : ''}`}>
                    <span className="dash-achievement__icon" aria-hidden="true">
                      {unlocked ? <Award size={18} /> : <Award size={18} opacity={0.45} />}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p className="dash-achievement__title">{a.title[lang]}</p>
                      <p className="field-help">{a.description[lang]}</p>
                      <p className="dash-achievement__state mono">
                        {unlocked ? (
                          <>
                            <Check size={12} aria-hidden="true" /> {t('dash_unlocked_mark')}
                          </>
                        ) : (
                          `+${a.xpReward} XP`
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* LEADERBOARD */}
        {tab === 'leaderboard' && <ActivityView lang={lang} embedded />}

        {/* ANALYTICS */}
        {tab === 'analytics' && (
          <>
            <section>
              <h3 className="field-label" style={{ marginBottom: '10px' }}>{t('dash_weak')}</h3>
              {loadingData ? (
                <p className="empty-state" role="status">{t('loading')}</p>
              ) : weakAreas.length === 0 ? (
                <p className="empty-state">{t('dash_weak_empty')}</p>
              ) : (
                <ul className="dash-bars">
                  {weakAreas.map((w) => (
                    <li key={w.topic}>
                      <div className="dash-bars__row">
                        <span>{topicLabel(w.topic)}</span>
                        <span className="mono" style={{ color: accuracyTone(w.accuracy), fontWeight: 700 }}>{w.accuracy}%</span>
                      </div>
                      <div className="progress-track" aria-hidden="true">
                        <div className="progress-fill" style={{ width: `${w.accuracy}%`, background: accuracyTone(w.accuracy) }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="field-label" style={{ marginBottom: '10px' }}>{t('dash_history')}</h3>
              {quizHistory.length === 0 ? (
                <p className="empty-state">{t('dash_history_empty')}</p>
              ) : (
                <div className="scroll-x">
                  <table className="data-table">
                    <tbody>
                      {quizHistory.slice(0, 20).map((a) => (
                        <tr key={a.id}>
                          <td>{topicLabel(a.topic)}</td>
                          <td className="mono" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(a.created_at).toLocaleDateString(htmlLang(lang))}
                          </td>
                          <td className="mono" style={{ textAlign: 'right', fontWeight: 700, color: accuracyTone(a.total ? (a.score / a.total) * 100 : 0) }}>
                            {a.score}/{a.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </Dialog>
  );
}
