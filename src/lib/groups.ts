'use client';

import { supabase } from './supabase';

// Study groups: teachers follow the progress of students who joined with an invite code.
// All reads and writes go through the security-definer RPCs in
// supabase/migrations/*_teacher_groups.sql; the tables themselves are private.

export interface GroupMembership {
  id: string;
  name: string;
  course_id: string;
  /** The name the site owner set for the teacher, or the teacher's username. */
  teacher: string;
  /** The name this student is shown under in the group. */
  display_name: string;
  joined_at: string;
}

export interface TeacherGroup {
  id: string;
  name: string;
  course_id: string;
  code: string;
  created_at: string;
  members: number;
}

export interface MyGroups {
  teacher: boolean;
  memberships: GroupMembership[];
  /** Only filled for teachers. */
  groups: TeacherGroup[];
  /** Id of the group a create call just made. */
  created?: string;
}

export interface GroupPreview {
  name: string;
  course_id: string;
  code: string;
  teacher: string;
  own: boolean;
  member: boolean;
  display_name: string;
}

export interface GroupStudent {
  user_id: string;
  name: string;
  username: string | null;
  joined_at: string;
  /** Completed lesson indexes of the group's course. */
  lessons: number[];
  quiz_attempts: number;
  quiz_score: number;
  quiz_total: number;
  /** Best attempt, percent. */
  quiz_best: number | null;
  quiz_last: string | null;
  study_7: number;
  course_7: number;
  total_7: number;
  study_30: number;
  course_30: number;
  total_30: number;
  last_active: string | null;
}

export interface GroupReport {
  group: { id: string; name: string; course_id: string; code: string; created_at: string; lesson_count: number };
  generated_at: string;
  students: GroupStudent[];
}

/** Server error messages the interface explains; anything else is shown as a generic failure. */
export type GroupError =
  | 'sign-in required' | 'teacher only' | 'group not found' | 'code not found' | 'own group'
  | 'group is full' | 'too many groups' | 'invalid name' | 'invalid course';

const KNOWN_ERRORS: GroupError[] = [
  'sign-in required', 'teacher only', 'group not found', 'code not found', 'own group',
  'group is full', 'too many groups', 'invalid name', 'invalid course',
];

export function groupError(error: unknown): GroupError | null {
  const message = typeof error === 'object' && error && 'message' in error ? String((error as { message: unknown }).message) : '';
  return KNOWN_ERRORS.find(known => message === known) ?? null;
}

// Cyrillic letters that look like Latin ones in a code typed with a Russian or Kazakh layout.
const LOOKALIKES: Record<string, string> = {
  А: 'A', В: 'B', Е: 'E', К: 'K', М: 'M', Н: 'H', Р: 'P', С: 'C', Т: 'T', У: 'Y', Х: 'X',
};

/** "abcd-efgh", "АВСD EFGH" → "ABCDEFGH" (at most 8 characters). */
export function normalizeCode(input: string) {
  return input
    .toUpperCase()
    .replace(/[А-ЯЁ]/g, letter => LOOKALIKES[letter] ?? letter)
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8);
}

export const CODE_PATTERN = /^[A-HJKMNP-Z2-9]{8}$/;

/** "ABCDEFGH" → "ABCD-EFGH" */
export function formatCode(code: string) {
  return code.length > 4 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;
}

/** Link that opens the join screen with the code filled in. */
export function inviteLink(code: string) {
  return `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/?join=${code}`;
}

async function call<T>(name: string, args?: Record<string, unknown>, signal?: AbortSignal) {
  let request = supabase.rpc(name, args);
  if (signal) request = request.abortSignal(signal);
  const { data, error } = await request;
  if (error) throw error;
  return data as T;
}

export const getMyGroups = (signal?: AbortSignal) => call<MyGroups>('my_study_groups', undefined, signal);
export const previewGroup = (code: string) => call<GroupPreview | null>('preview_study_group', { p_code: code });
export const joinGroup = (code: string, name: string) => call<MyGroups>('join_study_group', { p_code: code, p_name: name });
export const leaveGroup = (group: string) => call<MyGroups>('leave_study_group', { p_group: group });
export const createGroup = (name: string, course: string) => call<MyGroups>('create_study_group', { p_name: name, p_course: course });
export const renameGroup = (group: string, name: string) => call<MyGroups>('rename_study_group', { p_group: group, p_name: name });
export const renewGroupCode = (group: string) => call<MyGroups>('renew_study_group_code', { p_group: group });
export const deleteGroup = (group: string) => call<MyGroups>('delete_study_group', { p_group: group });
export const removeGroupMember = (group: string, user: string) =>
  call<null>('remove_study_group_member', { p_group: group, p_user: user });
export const getGroupReport = (group: string, signal?: AbortSignal) =>
  call<GroupReport>('study_group_report', { p_group: group }, signal);
