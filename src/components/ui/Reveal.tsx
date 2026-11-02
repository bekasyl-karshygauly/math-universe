'use client';

import React from 'react';
import { motion } from 'motion/react';

const EASE = [0.2, 0, 0, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  /** Stagger position inside a list; each step adds 50 ms */
  index?: number;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'section';
  style?: React.CSSProperties;
}

/**
 * Fades content up once it scrolls into view. Under reduced motion MotionConfig
 * ("always") skips the transform and shows it immediately.
 */
export function Reveal({ children, index = 0, delay = 0, y = 16, className, as = 'div', style }: RevealProps) {
  const Comp = as === 'li' ? motion.li : as === 'section' ? motion.section : motion.div;
  return (
    <Comp
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.45, ease: EASE, delay: delay + Math.min(index, 10) * 0.05 }}
    >
      {children}
    </Comp>
  );
}
