'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, Language, Theme, loadStoredState, saveStoredState } from '../lib/storage';
import { I18N } from '../data/i18n';
import { COURSES } from '../data/courses';
import { useAuth } from '../lib/auth-context';

import { LenisProvider } from '../components/LenisProvider';
import { Header } from '../components/Header';
import { NavTabs, NavPage } from '../components/NavTabs';
import { HomeView, HacksView, BonusView } from '../components/PageViews';

// Dynamic lazy imports to minimize memory usage and bundle compilation
const LessonDetailView = dynamic(() => import('../components/LessonDetailView').then((m) => m.LessonDetailView), {
  ssr: false,
  loading: () => <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>Загрузка...</div>,
});

const CalculatorsView = dynamic(() => import('../components/calculators/CalculatorsView').then((m) => m.CalculatorsView), {
  ssr: false,
  loading: () => <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>Загрузка калькуляторов...</div>,
});

const PlotterView = dynamic(() => import('../components/PlotterView').then((m) => m.PlotterView), {
  ssr: false,
  loading: () => <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>Загрузка графиков и 3D...</div>,
});

const QuizView = dynamic(() => import('../components/QuizView').then((m) => m.QuizView), {
  ssr: false,
  loading: () => <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>Загрузка викторины...</div>,
});

const NotesView = dynamic(() => import('../components/NotesView').then((m) => m.NotesView), {
  ssr: false,
  loading: () => <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>Загрузка заметок...</div>,
});

const WhyItWorksModal = dynamic(() => import('../components/WhyItWorksModal').then((m) => m.WhyItWorksModal), {
  ssr: false,
});

const AuthModal = dynamic(() => import('../components/AuthModal').then((m) => m.AuthModal), { ssr: false });
const DashboardModal = dynamic(() => import('../components/DashboardModal').then((m) => m.DashboardModal), { ssr: false });
const AIMathChat = dynamic(() => import('../components/AIMathChat').then((m) => m.AIMathChat), { ssr: false });
const StepSolver = dynamic(() => import('../components/StepSolver').then((m) => m.StepSolver), { ssr: false });
const AchievementToast = dynamic(() => import('../components/AchievementToast').then((m) => m.AchievementToast), { ssr: false });

export default function HomePage() {
  const { user, completeLesson, mergeLessonProgress, achievementQueue, dismissAchievement } = useAuth();
  const [state, setState] = useState<AppState>({
    lang: 'ru',
    theme: 'dark',
    progress: {},
    quizBest: 0,
    notes: '',
    lessonLevels: {},
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [whyItWorksId, setWhyItWorksId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showSolver, setShowSolver] = useState(false);

  // Load state on mount
  useEffect(() => {
    const loaded = loadStoredState();
    setState(loaded);
    document.documentElement.setAttribute('data-theme', loaded.theme);
    document.documentElement.lang = loaded.lang;
    setIsLoaded(true);
  }, []);

  // After sign-in, merge this device's lesson progress with the account
  const userId = user?.id;
  useEffect(() => {
    if (!isLoaded || !userId) return;
    let cancelled = false;
    mergeLessonProgress(state.progress).then((merged) => {
      if (cancelled || !merged) return;
      updateState((prev) => {
        const progress: Record<string, boolean[]> = { ...prev.progress };
        for (const [courseId, arr] of Object.entries(merged)) {
          progress[courseId] = arr.map((done, i) => done || !!prev.progress[courseId]?.[i]);
        }
        return { ...prev, progress };
      });
    });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, userId]);

  // Save state on changes
  const updateState = (updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      saveStoredState(next);
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleSetLang = (lang: Language) => {
    updateState((prev) => ({ ...prev, lang }));
    document.documentElement.lang = lang;
  };

  const handleToggleTheme = () => {
    const nextTheme: Theme = state.theme === 'dark' ? 'light' : 'dark';
    updateState((prev) => ({ ...prev, theme: nextTheme }));
    document.documentElement.setAttribute('data-theme', nextTheme);
    showToast(I18N[state.lang]['t_theme'] || 'Тема изменена');
  };

  const t = (k: string) => I18N[state.lang][k] || k;

  const handleReset = () => {
    if (!window.confirm(t('confirm_reset'))) return;
    // Keep the chosen language and theme — only learning data is cleared
    const resetState: AppState = {
      lang: state.lang,
      theme: state.theme,
      progress: {},
      quizBest: 0,
      notes: '',
      lessonLevels: {},
    };
    setState(resetState);
    saveStoredState(resetState);
    showToast(t('t_reset'));
  };

  const handleToggleProgress = (courseId: string, lessonIndex: number) => {
    const course = COURSES.find((c) => c.id === courseId);
    const total = course ? course.lessons.length : 10;
    // Decided outside the state updater: updaters must stay pure (StrictMode calls them twice)
    const completed = !state.progress[courseId]?.[lessonIndex];

    updateState((prev) => {
      const nextArr = [...(prev.progress[courseId] || [])];
      while (nextArr.length < total) nextArr.push(false);
      nextArr[lessonIndex] = completed;
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [courseId]: nextArr,
        },
      };
    });

    if (completed) showToast(t('t_done') || 'Урок завершен');
    completeLesson(courseId, lessonIndex, completed);
  };

  const handleSetLessonLevel = (lessonId: string, level: 1 | 2 | 3) => {
    updateState((prev) => ({
      ...prev,
      lessonLevels: {
        ...prev.lessonLevels,
        [lessonId]: level,
      },
    }));
  };

  const handleOpenCourse = (id: string) => {
    setSelectedCourseId(id);
    setCurrentPage('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter courses for courses view
  const filteredCourses = COURSES.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title[state.lang].toLowerCase().includes(q) ||
      c.desc[state.lang].toLowerCase().includes(q) ||
      c.lessons.some((l) => l.title[state.lang].toLowerCase().includes(q))
    );
  });

  const selectedCourse = COURSES.find((c) => c.id === selectedCourseId);

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '20px' }}>Loading Math Universe...</div>
      </div>
    );
  }

  return (
    <LenisProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Header
          lang={state.lang}
          theme={state.theme}
          onSetLang={handleSetLang}
          onToggleTheme={handleToggleTheme}
          onReset={handleReset}
          onOpenAuth={() => setShowAuth(true)}
          onOpenProfile={() => setShowDashboard(true)}
          onOpenAIChat={() => setShowAIChat(true)}
          onOpenSolver={() => setShowSolver(true)}
        />

        {/* Navigation Tabs */}
        <NavTabs
          currentPage={currentPage}
          lang={state.lang}
          onSelectPage={(page: NavPage) => {
            setCurrentPage(page);
            if (page !== 'courses') {
              setSelectedCourseId(null);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Main Content Area */}
        <main className="app-main" style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '26px 24px', flex: 1 }}>
          <AnimatePresence mode="wait">
            {/* ================= PAGE: HOME ================= */}
            {currentPage === 'home' && (
              <HomeView
                key="home-view"
                lang={state.lang}
                progress={state.progress}
                quizBest={state.quizBest}
                notes={state.notes}
                onOpenCourse={handleOpenCourse}
                onNav={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* ================= PAGE: COURSES / LESSON ================= */}
            {currentPage === 'courses' && (
              <motion.div
                key="courses-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.28 }}
              >
                {selectedCourse ? (
                  <LessonDetailView
                    course={selectedCourse}
                    lang={state.lang}
                    progress={state.progress[selectedCourse.id] || []}
                    lessonLevels={state.lessonLevels}
                    onToggleProgress={(idx) => handleToggleProgress(selectedCourse.id, idx)}
                    onSetLessonLevel={handleSetLessonLevel}
                    onOpenWhyItWorks={(id) => setWhyItWorksId(id)}
                    onBack={() => setSelectedCourseId(null)}
                  />
                ) : (
                  <div>
                    <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '20px' }}>
                      📚 {t('courses_title')}
                    </h2>

                    {/* Search bar */}
                    <div style={{ marginBottom: '26px' }}>
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('search_ph')}
                        style={{
                          width: '100%',
                          padding: '14px 20px',
                          borderRadius: '14px',
                          border: '1px solid var(--border)',
                          background: 'var(--surface)',
                          color: 'var(--text-primary)',
                          fontSize: '15px',
                          boxShadow: 'var(--shadow-sm)',
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '22px' }}>
                      {filteredCourses.map((c, i) => {
                        const done = (state.progress[c.id] || []).filter(Boolean).length;
                        const total = c.lessons.length;
                        const pct = total ? Math.round((done / total) * 100) : 0;

                        return (
                          <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -6, scale: 1.015 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedCourseId(c.id)}
                            className="glow-card"
                            style={{ padding: '26px', cursor: 'pointer' }}
                          >
                            <div
                              style={{
                                width: '54px',
                                height: '54px',
                                borderRadius: '14px',
                                background: 'var(--primary-gradient)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                color: '#fff',
                                marginBottom: '16px',
                              }}
                            >
                              {c.icon}
                            </div>

                            <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '8px' }}>
                              {c.title[state.lang]}
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
                              {c.desc[state.lang]}
                            </p>

                            <div style={{ height: '6px', background: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.5 }}
                                style={{ height: '100%', background: 'var(--primary-gradient)', borderRadius: '4px' }}
                              />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                              <span>
                                {done}/{total} {t('lessons_done')}
                              </span>
                              <span>{pct}%</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ================= PAGE: CALCULATORS ================= */}
            {currentPage === 'calc' && (
              <motion.div
                key="calc-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.28 }}
              >
                <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '20px' }}>
                  🧮 {t('calc_title')}
                </h2>
                <CalculatorsView lang={state.lang} />
              </motion.div>
            )}

            {/* ================= PAGE: PLOT & 3D ================= */}
            {currentPage === 'plot' && (
              <motion.div
                key="plot-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.28 }}
              >
                <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '20px' }}>
                  📈 {t('plot_title')}
                </h2>
                <PlotterView lang={state.lang} theme={state.theme} />
              </motion.div>
            )}

            {/* ================= PAGE: QUIZ ================= */}
            {currentPage === 'quiz' && (
              <motion.div
                key="quiz-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.28 }}
              >
                <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '20px' }}>
                  🎯 {t('quiz_title')}
                </h2>
                <QuizView
                  lang={state.lang}
                  onUpdateBestScore={(score) => {
                    if (score > state.quizBest) {
                      updateState((prev) => ({ ...prev, quizBest: score }));
                    }
                  }}
                />
              </motion.div>
            )}

            {/* ================= PAGE: NOTES ================= */}
            {currentPage === 'notes' && (
              <motion.div
                key="notes-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.28 }}
              >
                <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '20px' }}>
                  📝 {t('notes_title')}
                </h2>
                <NotesView
                  lang={state.lang}
                  initialNotes={state.notes}
                  onSaveNotes={(n) => {
                    updateState((prev) => ({ ...prev, notes: n }));
                  }}
                  onImportState={(d) => {
                    updateState((prev) => ({
                      ...prev,
                      notes: d.notes !== undefined ? d.notes : prev.notes,
                      progress: d.progress || prev.progress,
                      quizBest: d.quizBest || prev.quizBest,
                    }));
                  }}
                  onToast={showToast}
                />
              </motion.div>
            )}

            {/* ================= PAGE: LIFEHACKS ================= */}
            {currentPage === 'hacks' && <HacksView key="hacks-view" lang={state.lang} />}

            {/* ================= PAGE: BONUS ================= */}
            {currentPage === 'bonus' && <BonusView key="bonus-view" lang={state.lang} />}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer
          style={{
            textAlign: 'center',
            padding: '36px 24px',
            color: 'var(--text-muted)',
            fontSize: '13.5px',
            borderTop: '1px solid var(--border)',
            marginTop: '48px',
          }}
        >
          <div>Math Universe © 2026 · {t('footer')}</div>
          <div style={{ marginTop: '6px', fontSize: '12px', opacity: 0.75 }}>
            {t('legacy_file_badge')} · <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/legacy.html`} target="_blank" style={{ textDecoration: 'underline' }}>Открыть оригинальный файл Qwen_html</a>
          </div>
        </footer>

        {/* Why it works modal */}
        <WhyItWorksModal
          topicId={whyItWorksId}
          lang={state.lang}
          onClose={() => setWhyItWorksId(null)}
        />

        {/* Auth Modal */}
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} lang={state.lang} />}

        {/* Dashboard Modal */}
        {showDashboard && <DashboardModal onClose={() => setShowDashboard(false)} lang={state.lang} progress={state.progress} />}

        {/* AI Math Chat */}
        {showAIChat && <AIMathChat onClose={() => setShowAIChat(false)} lang={state.lang} />}

        {/* Step Solver */}
        {showSolver && <StepSolver onClose={() => setShowSolver(false)} />}

        {/* Achievement Toast */}
        <AnimatePresence>
          {achievementQueue.length > 0 && (
            <AchievementToast
              key={achievementQueue[0]}
              achievementKey={achievementQueue[0]}
              lang={state.lang}
              onDone={dismissAchievement}
            />
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: 'var(--surface)',
              border: '1px solid var(--accent-emerald)',
              color: 'var(--text-primary)',
              padding: '14px 22px',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 9999,
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>✓</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </div>
    </LenisProvider>
  );
}
