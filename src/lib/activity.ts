'use client';

import { useEffect } from 'react';
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

const VISITOR_KEY = 'mathuni_visitor';

function isLocalPreview() {
  return ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
}

function guestId() {
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

export function useVisitActivity(loading: boolean, userId: string | undefined) {
  useEffect(() => {
    if (loading || isLocalPreview()) return;
    const guest = userId ? null : guestId();
    if (!userId && !guest) return;
    let sentAt = 0;
    let pending = false;
    async function visit() {
      if (document.visibilityState !== 'visible' || pending || Date.now() - sentAt < 30 * 60_000) return;
      pending = true;
      try {
        const { error } = await supabase.rpc('record_site_visit', { p_guest: guest });
        if (!error) sentAt = Date.now();
      } finally {
        pending = false;
      }
    }
    function onVisible() { void visit().catch(() => {}); }
    onVisible();
    const interval = window.setInterval(onVisible, 60_000);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [loading, userId]);
}

export function useStudyActivity(userId: string | undefined, courseId: string, lessonIndex: number | null) {
  useEffect(() => {
    if (!userId || lessonIndex === null || isLocalPreview()) return;
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

export async function getCommunityActivity(signal: AbortSignal) {
  const { data, error } = await supabase.rpc('community_activity').abortSignal(signal);
  if (error) throw error;
  return data as CommunityActivity;
}

export async function setTopicSharing(enabled: boolean) {
  const { error } = await supabase.rpc('set_topic_sharing', { p_enabled: enabled });
  if (error) throw error;
}
