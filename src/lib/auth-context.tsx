'use client';
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import {
  supabase,
  Profile,
  getProfile,
  getUserAchievements,
  getLessonProgress,
  ensureProfile,
  setLessonProgress,
  recordQuizAttempt,
  checkAchievements,
} from './supabase';
import { COURSES } from '../data/courses';
import { MATH1_COURSE_ID, MATH1_LECTURE_COUNT } from '../data/math1/constants';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  unlockedKeys: string[];
  /** Achievements unlocked during this session that have not been shown yet */
  achievementQueue: string[];
  loading: boolean;
  refreshProfile: () => Promise<void>;
  dismissAchievement: () => void;
  completeLesson: (courseId: string, lessonIndex: number, completed: boolean) => Promise<void>;
  recordQuiz: (topic: string, score: number, total: number, timeSpentSec: number) => Promise<void>;
  /** Merges local progress with the account: returns the union and uploads lessons missing on the server */
  mergeLessonProgress: (local: Record<string, boolean[]>) => Promise<Record<string, boolean[]> | null>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  profile: null,
  unlockedKeys: [],
  achievementQueue: [],
  loading: true,
  refreshProfile: async () => {},
  dismissAchievement: () => {},
  completeLesson: async () => {},
  recordQuiz: async () => {},
  mergeLessonProgress: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [unlockedKeys, setUnlockedKeys] = useState<string[]>([]);
  const [achievementQueue, setAchievementQueue] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUid = useRef<string | null>(null);

  // Server decides which achievements are earned; newly unlocked ones are queued for the toast
  const runAchievementCheck = async () => {
    try {
      const keys = await checkAchievements();
      if (keys.length === 0) return;
      setUnlockedKeys((prev) => Array.from(new Set([...prev, ...keys])));
      setAchievementQueue((prev) => [...prev, ...keys]);
      // Achievements grant XP, so the profile changed
      if (currentUid.current) setProfile(await getProfile(currentUid.current));
    } catch (err) {
      console.error('check_achievements failed:', err);
    }
  };

  const loadUser = async (uid: string) => {
    let p: Profile | null = null;
    try {
      p = await ensureProfile();
    } catch (err) {
      console.error('ensure_profile failed — run supabase_schema.sql in the Supabase SQL editor:', err);
      p = await getProfile(uid);
    }
    if (currentUid.current !== uid) return;
    setProfile(p);
    const ach = await getUserAchievements(uid);
    setUnlockedKeys(ach.map((a) => a.achievement_key));
    if (p) await runAchievementCheck();
  };

  useEffect(() => {
    // onAuthStateChange also fires INITIAL_SESSION on mount, so no separate getSession() is needed
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      const uid = s?.user?.id ?? null;
      if (uid === currentUid.current) {
        setLoading(false);
        return; // token refresh etc. — same user, nothing to reload
      }
      currentUid.current = uid;
      if (uid) {
        // Deferred: awaiting Supabase calls inside this callback can deadlock the auth client
        setTimeout(() => {
          loadUser(uid).finally(() => setLoading(false));
        }, 0);
      } else {
        setProfile(null);
        setUnlockedKeys([]);
        setAchievementQueue([]);
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) setProfile(await getProfile(user.id));
  };

  const dismissAchievement = () => setAchievementQueue((prev) => prev.slice(1));

  const completeLesson = async (courseId: string, lessonIndex: number, completed: boolean) => {
    if (!user) return;
    try {
      const p = await setLessonProgress(courseId, lessonIndex, completed);
      if (p) setProfile(p);
      if (completed) await runAchievementCheck();
    } catch (err) {
      console.error('set_lesson_progress failed:', err);
    }
  };

  const recordQuiz = async (topic: string, score: number, total: number, timeSpentSec: number) => {
    if (!user) return;
    try {
      const p = await recordQuizAttempt(topic, score, total, timeSpentSec);
      if (p) setProfile(p);
      await runAchievementCheck();
    } catch (err) {
      console.error('record_quiz_attempt failed:', err);
    }
  };

  const mergeLessonProgress = async (local: Record<string, boolean[]>) => {
    if (!user) return null;
    try {
      const rows = await getLessonProgress(user.id);
      const serverDone = new Set(rows.filter((r) => r.completed).map((r) => `${r.course_id}:${r.lesson_index}`));
      const merged: Record<string, boolean[]> = {};
      const toUpload: [string, number][] = [];

      const courses = [
        ...COURSES.map(({ id, lessons }) => ({ id, count: lessons.length })),
        { id: MATH1_COURSE_ID, count: MATH1_LECTURE_COUNT },
      ];
      for (const { id, count } of courses) {
        merged[id] = Array.from({ length: count }, (_, i) => {
          if (serverDone.has(`${id}:${i}`)) return true;
          if (local[id]?.[i]) {
            toUpload.push([id, i]);
            return true;
          }
          return false;
        });
      }

      let p: Profile | null = null;
      for (const [courseId, i] of toUpload) p = await setLessonProgress(courseId, i, true);
      if (p) setProfile(p);
      if (toUpload.length > 0) await runAchievementCheck();
      return merged;
    } catch (err) {
      console.error('Lesson progress sync failed:', err);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        unlockedKeys,
        achievementQueue,
        loading,
        refreshProfile,
        dismissAchievement,
        completeLesson,
        recordQuiz,
        mergeLessonProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
