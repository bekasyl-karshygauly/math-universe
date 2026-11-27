'use client';

import { useCallback, useEffect, useState } from 'react';
import type { NavPage } from '../components/NavTabs';

/**
 * Hash routes: every screen has its own address, the browser Back button works
 * and a link to a lecture can be shared. The hash survives the static export on
 * GitHub Pages, where paths other than the page itself would 404.
 *
 *   #/                         home
 *   #/courses                  course catalog
 *   #/courses/<course>/<lesson>
 *   #/math1                    Math 1, lectures
 *   #/math1/<n>/<part>         lecture n (1-based), part: video | practice | check
 *   #/math1/variant | trainer | glossary
 *   #/calc, #/plot, #/quiz, #/activity, #/notes, #/hacks, #/bonus
 */

export type Math1Section = 'lectures' | 'variant' | 'trainer' | 'glossary';
export type LecturePart = 'theory' | 'video' | 'practice' | 'check';

export interface Route {
  page: NavPage;
  course?: string;
  lesson?: string;
  section?: Math1Section;
  lecture?: number;
  part?: LecturePart;
}

const PAGES: NavPage[] = ['home', 'courses', 'math1', 'calc', 'plot', 'quiz', 'activity', 'notes', 'hacks', 'bonus'];
const SECTIONS: Math1Section[] = ['lectures', 'variant', 'trainer', 'glossary'];
const PARTS: LecturePart[] = ['theory', 'video', 'practice', 'check'];
const SLUG = /^[a-z0-9_-]{1,64}$/i;

const HOME: Route = { page: 'home' };

/** Only hashes starting with "#/" are routes; others (e.g. "#main") are in-page anchors. */
export function isRouteHash(hash: string) {
  return hash.startsWith('#/');
}

export function parseRoute(hash: string): Route {
  if (!isRouteHash(hash)) return HOME;
  const parts = hash
    .slice(2)
    .split('/')
    .filter(Boolean)
    .map((s) => {
      try {
        return decodeURIComponent(s);
      } catch {
        return '';
      }
    });
  const page = parts[0] as NavPage | undefined;
  if (!page || !PAGES.includes(page)) return HOME;

  if (page === 'courses') {
    const [, course, lesson] = parts;
    if (!course || !SLUG.test(course)) return { page };
    return { page, course, lesson: lesson && SLUG.test(lesson) ? lesson : undefined };
  }

  if (page === 'math1') {
    const [, first, second] = parts;
    if (first && SECTIONS.includes(first as Math1Section) && first !== 'lectures') {
      return { page, section: first as Math1Section };
    }
    const n = first && /^\d{1,2}$/.test(first) ? Number(first) : undefined;
    const part = PARTS.includes(second as LecturePart) && second !== 'theory' ? (second as LecturePart) : undefined;
    return { page, section: 'lectures', lecture: n, part: n ? part : undefined };
  }

  return { page };
}

export function formatRoute(route: Route): string {
  const seg: (string | number)[] = [];
  if (route.page !== 'home') seg.push(route.page);
  if (route.page === 'courses' && route.course) {
    seg.push(route.course);
    if (route.lesson) seg.push(route.lesson);
  }
  if (route.page === 'math1') {
    if (route.section && route.section !== 'lectures') seg.push(route.section);
    else if (route.lecture) {
      seg.push(route.lecture);
      if (route.part && route.part !== 'theory') seg.push(route.part);
    }
  }
  return '#/' + seg.map((s) => encodeURIComponent(String(s))).join('/');
}

export type Navigate = (route: Route, options?: { replace?: boolean }) => void;

/** Current route from location.hash; navigate() adds a history entry (or replaces it). */
export function useHashRoute(): [Route, Navigate] {
  const [route, setRoute] = useState<Route>(HOME);

  useEffect(() => {
    const sync = () => {
      if (isRouteHash(window.location.hash) || !window.location.hash) setRoute(parseRoute(window.location.hash));
    };
    sync();
    // popstate: Back / Forward; hashchange: a typed or pasted address
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  const navigate = useCallback<Navigate>((next, options) => {
    const hash = formatRoute(next);
    const parsed = parseRoute(hash);
    setRoute(parsed);
    if (hash === window.location.hash || (hash === '#/' && !window.location.hash)) return;
    const url = window.location.pathname + window.location.search + hash;
    if (options?.replace) window.history.replaceState(window.history.state, '', url);
    else window.history.pushState(window.history.state, '', url);
  }, []);

  return [route, navigate];
}
