'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { applyMotionPref, useReduceMotion } from '../lib/motionPref';
import { Check, Search, ArrowUpRight } from 'lucide-react';
import { AppState, Language, Theme, loadStoredState, saveStoredState } from '../lib/storage';
import { I18N } from '../data/i18n';
import { fmt, htmlLang } from '../data/i18n-lab';
import { COURSES } from '../data/courses';
import { MATH1_COURSE_ID, MATH1_LECTURE_COUNT } from '../data/math1/constants';
import { useAuth } from '../lib/auth-context';

import { LenisProvider, scrollToTop } from '../components/LenisProvider';
import { Header } from '../components/Header';
import { NavTabs, NavPage } from '../components/NavTabs';
import { HomeView, HacksView, BonusView } from '../components/PageViews';
import { PageHeader } from '../components/ui/PageHeader';

// Loading text for lazily loaded views; reads the language already applied to <html>
function ViewLoading() {
  const lang = typeof document !== 'undefined' ? document.documentElement.lang : 'ru';
  const key: Language = lang === 'kk' ? 'kz' : lang === 'en' ? 'en' : 'ru';
  return (
    <p className="view-loading" role="status">
      {I18N[key]['loading']}
    </p>
  );
}

// Dynamic lazy imports to minimize memory usage and bundle compilation
const LessonDetailView = dynamic(() => import('../components/LessonDetailView').then((m) => m.LessonDetailView), { ssr: false, loading: ViewLoading });
const CalculatorsView = dynamic(() => import('../components/calculators/CalculatorsView').then((m) => m.CalculatorsView), { ssr: false, loading: ViewLoading });
const PlotterView = dynamic(() => import('../components/PlotterView').then((m) => m.PlotterView), { ssr: false, loading: ViewLoading });
const QuizView = dynamic(() => import('../components/QuizView').then((m) => m.QuizView), { ssr: false, loading: ViewLoading });
const NotesView = dynamic(() => import('../components/NotesView').then((m) => m.NotesView), { ssr: false, loading: ViewLoading });
const Math1View = dynamic(() => import('../components/math1/Math1View').then((m) => m.Math1View), { ssr: false, loading: ViewLoading });

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
  const reduceMotion = useReduceMotion();
  const [state, setState] = useState<AppState>({
    lang: 'ru',
    theme: 'light',
    progress: {},
    quizBest: 0,
    notes: '',
    lessonLevels: {},
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    document.documentElement.lang = htmlLang(loaded.lang);
    applyMotionPref();
    setIsLoaded(true);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
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
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(msg);
    toastTimer.current = setTimeout(() => setToastMessage(null), 2600);
  };

  const t = (k: string) => I18N[state.lang][k] || k;

  const handleSetLang = (lang: Language) => {
    updateState((prev) => ({ ...prev, lang }));
    document.documentElement.lang = htmlLang(lang);
  };

  const handleToggleTheme = () => {
    const nextTheme: Theme = state.theme === 'dark' ? 'light' : 'dark';
    updateState((prev) => ({ ...prev, theme: nextTheme }));
    document.documentElement.setAttribute('data-theme', nextTheme);
    showToast(t('t_theme'));
  };

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
    const total = course ? course.lessons.length : courseId === MATH1_COURSE_ID ? MATH1_LECTURE_COUNT : 10;
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

    if (completed) showToast(t('t_done'));
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

  // Section navigation always lands on the section root ("Курсы" from inside a course opens the catalog)
  const goTo = (page: NavPage) => {
    setCurrentPage(page);
    setSelectedCourseId(null);
    setSelectedLessonId(undefined);
    scrollToTop(!reduceMotion);
  };

  const handleOpenCourse = (id: string, lessonId?: string) => {
    setSelectedCourseId(id);
    setSelectedLessonId(lessonId);
    setCurrentPage('courses');
    scrollToTop(!reduceMotion);
  };

  // Filter courses for courses view
  const q = searchQuery.trim().toLowerCase();
  const filteredCourses = COURSES.filter((c) => {
    if (!q) return true;
    return (
      c.title[state.lang].toLowerCase().includes(q) ||
      c.desc[state.lang].toLowerCase().includes(q) ||
      c.lessons.some((l) => l.title[state.lang].toLowerCase().includes(q))
    );
  });

  const selectedCourse = COURSES.find((c) => c.id === selectedCourseId);

  if (!isLoaded) {
    return <div className="app-loading">Math Universe</div>;
  }

  const viewMotion = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduceMotion ? 0 : -6 },
    transition: { duration: reduceMotion ? 0 : 0.3, ease: [0.2, 0, 0, 1] as const },
  };

  return (
    // Every Motion animation follows the in-app "Animations" setting (system / on / off)
    <MotionConfig reducedMotion={reduceMotion ? 'always' : 'never'}>
    <LenisProvider>
      <a href="#main" className="skip-link">
        {t('skip_to_content')}
      </a>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
          onHome={() => goTo('home')}
        />

        <NavTabs currentPage={currentPage} lang={state.lang} onSelectPage={goTo} />

        <main id="main" tabIndex={-1} className="app-main container">
          <AnimatePresence mode="wait">
            {currentPage === 'home' && (
              <HomeView
                key="home-view"
                lang={state.lang}
                progress={state.progress}
                quizBest={state.quizBest}
                onOpenCourse={handleOpenCourse}
                onNav={goTo}
              />
            )}

            {currentPage === 'courses' && (
              <motion.div key={selectedCourse ? `course-${selectedCourse.id}` : 'courses-view'} {...viewMotion}>
                {selectedCourse ? (
                  <LessonDetailView
                    initialLessonId={selectedLessonId}
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
                    <PageHeader eyebrow={t('courses_eyebrow')} title={t('courses_title')} lead={t('courses_lead')} />

                    <div className="catalog-search">
                      <label className="field-label" htmlFor="course-search">
                        {t('search_label')}
                      </label>
                      <div className="catalog-search__box">
                        <Search size={18} aria-hidden="true" className="catalog-search__icon" />
                        <input
                          id="course-search"
                          type="search"
                          className="field-input"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={t('search_ph')}
                          aria-describedby="course-search-count"
                        />
                      </div>
                      <p id="course-search-count" className="sr-only" aria-live="polite">
                        {filteredCourses.length}
                      </p>
                    </div>

                    {filteredCourses.length === 0 ? (
                      <p className="empty-state">{t('search_empty')}</p>
                    ) : (
                      <ol className="course-list">
                        {filteredCourses.map((c) => {
                          const done = (state.progress[c.id] || []).filter(Boolean).length;
                          const total = c.lessons.length;
                          const pct = total ? Math.round((done / total) * 100) : 0;
                          const number = COURSES.indexOf(c) + 1;
                          const matches = q ? c.lessons.filter((l) => l.title[state.lang].toLowerCase().includes(q)) : [];

                          return (
                            <li key={c.id}>
                              <button type="button" className="course-row" onClick={() => setSelectedCourseId(c.id)}>
                                <span className="course-row__num mono">{String(number).padStart(2, '0')}</span>
                                <span className="course-row__main">
                                  <span className="course-row__title">{c.title[state.lang]}</span>
                                  <span className="course-row__desc">{c.desc[state.lang]}</span>
                                  {matches.length > 0 && (
                                    <span className="course-row__matches">
                                      {matches.map((l) => (
                                        <span key={l.id} className="chip chip--accent">
                                          {l.title[state.lang]}
                                        </span>
                                      ))}
                                    </span>
                                  )}
                                </span>
                                <span className="course-row__meta">
                                  <span className="mono">{fmt(t('course_done'), { done, total })}</span>
                                  <span className="progress-track" aria-hidden="true">
                                    <span className="progress-fill" style={{ display: 'block', width: `${pct}%` }} />
                                  </span>
                                  {done === total && total > 0 && (
                                    <span className="course-row__done">
                                      <Check size={14} aria-hidden="true" /> {pct}%
                                    </span>
                                  )}
                                </span>
                                <ArrowUpRight size={20} aria-hidden="true" className="course-row__arrow" />
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {currentPage === 'math1' && (
              <motion.div key="math1-view" {...viewMotion}>
                <Math1View
                  lang={state.lang}
                  progress={state.progress[MATH1_COURSE_ID] || []}
                  onToggleProgress={(idx) => handleToggleProgress(MATH1_COURSE_ID, idx)}
                  onOpenCourse={handleOpenCourse}
                />
              </motion.div>
            )}

            {currentPage === 'calc' && (
              <motion.div key="calc-view" {...viewMotion}>
                <PageHeader eyebrow={t('calc_eyebrow')} title={t('calc_title')} lead={t('calc_lead')} />
                <CalculatorsView lang={state.lang} />
              </motion.div>
            )}

            {currentPage === 'plot' && (
              <motion.div key="plot-view" {...viewMotion}>
                <PageHeader eyebrow={t('plot_eyebrow')} title={t('plot_title')} lead={t('plot_lead')} />
                <PlotterView lang={state.lang} theme={state.theme} />
              </motion.div>
            )}

            {currentPage === 'quiz' && (
              <motion.div key="quiz-view" {...viewMotion}>
                <PageHeader eyebrow={t('quiz_eyebrow')} title={t('quiz_title')} lead={t('quiz_lead')} />
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

            {currentPage === 'notes' && (
              <motion.div key="notes-view" {...viewMotion}>
                <PageHeader eyebrow={t('notes_eyebrow')} title={t('notes_title')} lead={t('notes_sub')} />
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

            {currentPage === 'hacks' && <HacksView key="hacks-view" lang={state.lang} />}

            {currentPage === 'bonus' && <BonusView key="bonus-view" lang={state.lang} />}
          </AnimatePresence>
        </main>

        <footer className="container">
          <div className="app-footer">
            <span>Math Universe © 2026 · {t('footer')}</span>
            <a className="text-link" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/legacy.html`} target="_blank" rel="noopener">
              {t('footer_legacy')} ↗
            </a>
          </div>
        </footer>

        <WhyItWorksModal topicId={whyItWorksId} lang={state.lang} onClose={() => setWhyItWorksId(null)} />

        {/* AnimatePresence lets dialogs play their exit transition before unmounting */}
        <AnimatePresence>
          {showAuth && <AuthModal key="auth" onClose={() => setShowAuth(false)} lang={state.lang} />}
          {showDashboard && <DashboardModal key="dashboard" onClose={() => setShowDashboard(false)} lang={state.lang} progress={state.progress} />}
          {showAIChat && <AIMathChat key="chat" onClose={() => setShowAIChat(false)} lang={state.lang} />}
          {showSolver && <StepSolver key="solver" onClose={() => setShowSolver(false)} lang={state.lang} />}
        </AnimatePresence>

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

        <div aria-live="polite" role="status" className="sr-only">
          {toastMessage}
        </div>
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              key="toast"
              className="toast"
              aria-hidden="true"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
            >
              <Check size={16} aria-hidden="true" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LenisProvider>
    </MotionConfig>
  );
}
