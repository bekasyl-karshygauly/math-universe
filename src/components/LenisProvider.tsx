'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { useReduceMotion } from '../lib/motionPref';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduce = useReduceMotion();

  useEffect(() => {
    // Smooth scrolling only when animations are on (in-app setting or OS preference)
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

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
    };
  }, [reduce]);

  return <>{children}</>;
}
