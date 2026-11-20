'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { supabase } from './supabase';

export interface ActivityLeader {
  rank: number;
  username: string;
  xp: number;
  completed: number;
  course_id: string | null;
  lesson_index: number | null;
  is_me: boolean;
}

export interface CommunityActivity {
  accounts: number;
  guests: number;
  learners: number;
  share_topic: boolean;
  leaders: ActivityLeader[];
}

/** Screens reported with each heartbeat; the database accepts exactly this list. */
export type ActivityScreen =
  | 'home' | 'courses' | 'lesson' | 'math1' | 'calc' | 'plot' | 'quiz' | 'activity' | 'notes' | 'hacks' | 'bonus';

export interface OnlinePerson {
  username: string;
  active: boolean;
  study: boolean;
  screen: ActivityScreen;
  since: string;
  is_me: boolean;
  course_id: string | null;
  lesson_index: number | null;
}

export interface OnlineSnapshot {
  online: number;
  active: number;
  studying: number;
  accounts: number;
  guests: number;
  show_online: boolean;
  /** Signed-in visitors only; guests receive an empty list. */
  people: OnlinePerson[];
}

export interface StudyTime {
  start: string;
  tz: string;
  total: number;
  study: number;
  prev_total: number;
  prev_study: number;
  days: { total: number; study: number }[];
  hours: number[];
  screens: { screen: ActivityScreen; minutes: number; study: number }[];
  courses: { course_id: string; minutes: number }[];
  lessons: { course_id: string; lesson_index: number; minutes: number }[];
}

export interface TimeLeader {
  rank: number;
  username: string;
  study: number;
  total: number;
  is_me: boolean;
}

export interface TimeRanking {
  study: number;
  total: number;
  learners: number;
  leaders: TimeLeader[];
}

const VISITOR_KEY = 'mathuni_visitor';
const DEV_KEY = 'mathuni_activity_dev';
/** A heartbeat every 30 s marks every active minute at least once. */
const PING_MS = 30_000;
/** Without input for this long a visible tab counts as idle, unless a video plays. */
const IDLE_MS = 2 * 60_000;

/**
 * Local previews do not send activity, so development does not change real statistics.
 * Opening a local page with ?activity=on enables it for that tab.
 */
function trackingDisabled() {
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  if (!local) return false;
  try {
    if (new URLSearchParams(window.location.search).get('activity') === 'on') sessionStorage.setItem(DEV_KEY, '1');
    return sessionStorage.getItem(DEV_KEY) !== '1';
  } catch {
    return true;
  }
}

export function guestId() {
  try {
    const saved = localStorage.getItem(VISITOR_KEY);
    if (saved && /^[0-9a-f-]{36}$/i.test(saved)) return saved;
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    // A browser with blocked storage cannot be deduplicated across visits.
    return null;
  }
}

// ---- Shared state: the current study target and the latest online snapshot ----

let studyTarget: { course: string; lesson: number } | null = null;
let online: OnlineSnapshot | null = null;
const onlineListeners = new Set<() => void>();
const targetListeners = new Set<() => void>();

function setOnline(next: OnlineSnapshot) {
  online = next;
  onlineListeners.forEach(listener => listener());
}

export function useOnlineSnapshot() {
  return useSyncExternalStore(
    listener => {
      onlineListeners.add(listener);
      return () => onlineListeners.delete(listener);
    },
    () => online,
    () => null,
  );
}

export async function refreshOnline() {
  const { data, error } = await supabase.rpc('online_now');
  if (error) throw error;
  setOnline(data as OnlineSnapshot);
}

/** Visiting a site page: counts minutes, keeps presence fresh and records the daily visit. */
export function useActivityTracker(loading: boolean, userId: string | undefined, screen: ActivityScreen) {
  useEffect(() => {
    if (loading || trackingDisabled()) return;
    const guest = userId ? null : guestId();
    if (!userId && !guest) return;

    let lastInput = Date.now();
    let pending = false;
    let queued = false;
    let timer: number | undefined;

    function videoPlaying() {
      return Array.from(document.querySelectorAll('video')).some(video => !video.paused && !video.ended);
    }

    async function ping() {
      if (document.visibilityState !== 'visible') return;
      if (pending) {
        queued = true;
        return;
      }
      pending = true;
      try {
        const { data, error } = await supabase.rpc('activity_ping', {
          p_guest: guest,
          p_screen: screen,
          p_course: studyTarget?.course ?? null,
          p_lesson: studyTarget?.lesson ?? null,
          p_active: Date.now() - lastInput < IDLE_MS || videoPlaying(),
          p_visible: true,
        });
        if (!error && data) setOnline(data as OnlineSnapshot);
      } catch {
        // Activity is optional; learning continues offline.
      } finally {
        pending = false;
        if (queued) {
          queued = false;
          void ping();
        }
      }
    }

    function schedule(delay: number) {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void ping();
        schedule(PING_MS);
      }, delay);
    }

    function onInput() { lastInput = Date.now(); }
    function onVisibility() {
      if (document.visibilityState === 'visible') {
        lastInput = Date.now();
        schedule(0);
      } else {
        window.clearTimeout(timer);
      }
    }
    function onTarget() { schedule(1500); }

    const inputs = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll'] as const;
    inputs.forEach(name => window.addEventListener(name, onInput, { passive: true, capture: true }));
    document.addEventListener('visibilitychange', onVisibility);
    targetListeners.add(onTarget);
    schedule(screen === 'home' ? 0 : 1500);

    return () => {
      window.clearTimeout(timer);
      inputs.forEach(name => window.removeEventListener(name, onInput, { capture: true }));
      document.removeEventListener('visibilitychange', onVisibility);
      targetListeners.delete(onTarget);
    };
  }, [loading, userId, screen]);
}

export function useStudyActivity(userId: string | undefined, courseId: string, lessonIndex: number | null) {
  // The open lesson is attached to the next heartbeat, for guests and accounts alike.
  useEffect(() => {
    if (lessonIndex === null) return;
    const target = { course: courseId, lesson: lessonIndex };
    studyTarget = target;
    targetListeners.forEach(listener => listener());
    return () => {
      if (studyTarget === target) studyTarget = null;
    };
  }, [courseId, lessonIndex]);

  useEffect(() => {
    if (!userId || lessonIndex === null || trackingDisabled()) return;
    const index = lessonIndex;
    let timer: number | undefined;
    let recorded = false;
    function onVisible() {
      window.clearTimeout(timer);
      if (recorded || document.visibilityState !== 'visible') return;
      timer = window.setTimeout(async () => {
        try {
          const { error } = await supabase.rpc('record_study_topic', { p_course: courseId, p_lesson: index });
          recorded = !error;
        } catch {
          // Reading remains available if activity could not be sent.
        }
      }, 12_000);
    }
    onVisible();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [userId, courseId, lessonIndex]);
}

export function localTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export async function getMyStudyTime(start: string, signal: AbortSignal) {
  const { data, error } = await supabase
    .rpc('my_study_time', { p_guest: guestId(), p_tz: localTimeZone(), p_start: start })
    .abortSignal(signal);
  if (error) throw error;
  return data as StudyTime;
}

export async function getTimeRanking(signal: AbortSignal) {
  const { data, error } = await supabase.rpc('study_time_ranking').abortSignal(signal);
  if (error) throw error;
  return data as TimeRanking;
}

export async function getCommunityActivity(signal: AbortSignal) {
  const { data, error } = await supabase.rpc('community_activity').abortSignal(signal);
  if (error) throw error;
  return data as CommunityActivity;
}

export async function setTopicSharing(enabled: boolean) {
  const { error } = await supabase.rpc('set_topic_sharing', { p_enabled: enabled });
  if (error) throw error;
}

export async function setOnlineVisibility(enabled: boolean) {
  const { error } = await supabase.rpc('set_online_visibility', { p_enabled: enabled });
  if (error) throw error;
  if (online) setOnline({ ...online, show_online: enabled });
}
