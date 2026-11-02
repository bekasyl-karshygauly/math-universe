import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  xp: number;
  level: number;
  streak: number;
  last_active: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_key: string;
  unlocked_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  topic: string;
  score: number;
  total: number;
  time_spent: number;
  created_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_index: number;
  completed: boolean;
  updated_at: string;
}

export const XP_PER_LEVEL = 200;

export function xpToLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpInCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function levelProgress(xp: number): number {
  return (xpInCurrentLevel(xp) / XP_PER_LEVEL) * 100;
}

// The profile row is created by the on_auth_user_created trigger (see supabase_schema.sql),
// so sign-up works even when email confirmation is enabled.
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      // The confirmation link returns to the site the user signed up on (localhost or GitHub Pages).
      // That URL must be listed in Supabase → Authentication → URL Configuration → Redirect URLs.
      emailRedirectTo: `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/`,
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return data;
}

// XP, streaks and achievements are computed by security-definer functions in the
// database (supabase_schema.sql); the client cannot write those columns directly.

/** Creates the profile if it is missing and refreshes the daily streak. */
export async function ensureProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.rpc('ensure_profile');
  if (error) throw error;
  return data;
}

/** Marks a lesson done/undone; the first completion grants XP. Returns the updated profile. */
export async function setLessonProgress(courseId: string, lessonIndex: number, completed: boolean): Promise<Profile | null> {
  const { data, error } = await supabase.rpc('set_lesson_progress', {
    p_course_id: courseId,
    p_lesson_index: lessonIndex,
    p_completed: completed,
  });
  if (error) throw error;
  return data;
}

/** Stores a quiz result and grants XP for correct answers. Returns the updated profile. */
export async function recordQuizAttempt(topic: string, score: number, total: number, timeSpent: number): Promise<Profile | null> {
  const { data, error } = await supabase.rpc('record_quiz_attempt', {
    p_topic: topic,
    p_score: score,
    p_total: total,
    p_time_spent: timeSpent,
  });
  if (error) throw error;
  return data;
}

/** Unlocks every achievement whose condition is met; returns the newly unlocked keys. */
export async function checkAchievements(): Promise<string[]> {
  const { data, error } = await supabase.rpc('check_achievements');
  if (error) throw error;
  return data || [];
}

export async function getLeaderboard(limit = 20): Promise<Profile[]> {
  const { data } = await supabase.from('profiles').select('*').order('xp', { ascending: false }).limit(limit);
  return data || [];
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const { data } = await supabase.from('user_achievements').select('*').eq('user_id', userId);
  return data || [];
}

export async function getQuizAttempts(userId: string): Promise<QuizAttempt[]> {
  const { data } = await supabase.from('quiz_attempts').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50);
  return data || [];
}

export async function getLessonProgress(userId: string): Promise<LessonProgress[]> {
  const { data } = await supabase.from('lesson_progress').select('*').eq('user_id', userId);
  return data || [];
}
