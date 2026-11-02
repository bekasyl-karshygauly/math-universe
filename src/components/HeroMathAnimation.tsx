'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MATH_SYMBOLS = [
  { sym: '∞',    size: 38, top: 12, left: 8,  opacity: 0.10 },
  { sym: '∫',    size: 48, top: 8,  left: 30, opacity: 0.09 },
  { sym: '∑',    size: 34, top: 55, left: 15, opacity: 0.08 },
  { sym: 'π',    size: 52, top: 20, left: 55, opacity: 0.10 },
  { sym: 'e^x',  size: 24, top: 68, left: 48, opacity: 0.07 },
  { sym: '√x',   size: 28, top: 40, left: 72, opacity: 0.09 },
  { sym: '∇',    size: 36, top: 15, left: 82, opacity: 0.08 },
  { sym: 'λ',    size: 44, top: 72, left: 78, opacity: 0.10 },
  { sym: '∂',    size: 30, top: 85, left: 25, opacity: 0.07 },
  { sym: 'sin θ',size: 20, top: 30, left: 42, opacity: 0.07 },
  { sym: 'lim',  size: 22, top: 60, left: 88, opacity: 0.08 },
  { sym: '⊕',    size: 32, top: 48, left: 3,  opacity: 0.06 },
];

export function HeroMathAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const symbols = el.querySelectorAll('.fms');

    symbols.forEach((sym, i) => {
      // Floating drift
      gsap.to(sym, {
        y: `+=${18 + (i % 4) * 8}`,
        x: `+=${(i % 2 === 0 ? 1 : -1) * 14}`,
        rotation: (i % 2 === 0 ? 1 : -1) * 15,
        duration: 4 + (i % 5) * 1.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3,
      });

      // Opacity breathe — stays very low
      gsap.to(sym, {
        opacity: (MATH_SYMBOLS[i]?.opacity ?? 0.08) * 1.6,
        duration: 3 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: i * 0.2,
      });
    });

    return () => {
      gsap.killTweensOf(symbols);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,       /* BEHIND all content */
      }}
    >
      {MATH_SYMBOLS.map(({ sym, size, top, left, opacity }, i) => (
        <div
          key={i}
          className="fms"
          style={{
            position: 'absolute',
            top: `${top}%`,
            left: `${left}%`,
            fontSize: `${size}px`,
            fontWeight: 900,
            fontFamily: 'var(--font-mono)',
            color: '#ffffff',
            opacity,               /* very low initial opacity */
            userSelect: 'none',
            willChange: 'transform, opacity',
            filter: 'blur(0.3px)',
            letterSpacing: '-0.01em',
          }}
        >
          {sym}
        </div>
      ))}
    </div>
  );
}
