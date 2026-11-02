'use client';

import { useSyncExternalStore } from 'react';

// Animation preference, stored separately from mathuni_state so the saved-state format is unchanged.
// "system" follows the OS (prefers-reduced-motion); "on"/"off" override it.
export type MotionPref = 'system' | 'on' | 'off';

const KEY = 'mu_motion';
const MQ = '(prefers-reduced-motion: reduce)';

export function getMotionPref(): MotionPref {
  if (typeof window === 'undefined') return 'system';
  try {
    const v = localStorage.getItem(KEY);
    return v === 'on' || v === 'off' ? v : 'system';
  } catch {
    return 'system';
  }
}

function effectiveReduce(pref: MotionPref): boolean {
  if (pref === 'on') return false;
  if (pref === 'off') return true;
  return window.matchMedia(MQ).matches;
}

/** Writes data-motion="reduce|full" on <html>; CSS, Motion, Lenis and canvases read it. */
export function applyMotionPref(pref: MotionPref = getMotionPref()) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-motion', effectiveReduce(pref) ? 'reduce' : 'full');
}

export function setMotionPref(pref: MotionPref) {
  try {
    if (pref === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {}
  applyMotionPref(pref);
}

/** True when animations should be reduced, honouring the in-app setting. Safe outside React. */
export function isMotionReduced(): boolean {
  if (typeof document === 'undefined') return false;
  const attr = document.documentElement.getAttribute('data-motion');
  if (attr) return attr === 'reduce';
  return effectiveReduce(getMotionPref());
}

function subscribe(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
  // Follow live OS changes while the preference is "system"
  const mq = window.matchMedia(MQ);
  const onMq = () => {
    if (getMotionPref() === 'system') applyMotionPref('system');
  };
  mq.addEventListener('change', onMq);
  return () => {
    obs.disconnect();
    mq.removeEventListener('change', onMq);
  };
}

/** React hook form of isMotionReduced(), re-rendering when the preference or OS setting changes. */
export function useReduceMotion(): boolean {
  return useSyncExternalStore(subscribe, isMotionReduced, () => false);
}
