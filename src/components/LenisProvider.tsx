'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { useReduceMotion } from '../lib/motionPref';

// The single active smoother; programmatic scrolls go through it so two systems never fight
let activeLenis: Lenis | null = null;

/** Scrolls to the top through Lenis when it runs, otherwise natively (instant when motion is reduced). */
export function scrollToTop(smooth: boolean) {
  if (activeLenis) activeLenis.scrollTo(0, { immediate: !smooth, duration: 0.6 });
  else window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
}

/** Brings an element to the top of the viewport (below the sticky nav) through the same smoother. */
export function scrollToElement(el: HTMLElement, smooth: boolean, offset = -64) {
  if (activeLenis) activeLenis.scrollTo(el, { offset, immediate: !smooth, duration: 0.6 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: smooth ? 'smooth' : 'auto' });
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduce = useReduceMotion();

  useEffect(() => {
    // Smooth wheel scrolling only when animations are on (in-app setting or OS preference)
    if (reduce) return;

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Inner scroll areas (textarea, wide formulas, chat log, lesson outline) keep native scrolling
      allowNestedScroll: true,
    });
    activeLenis = lenis;

    // Track the latest frame id: cancelling only the first one left the loop running after unmount
    let animId = 0;
    function raf(time: number) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }
    animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
      if (activeLenis === lenis) activeLenis = null;
    };
  }, [reduce]);

  return <>{children}</>;
}
