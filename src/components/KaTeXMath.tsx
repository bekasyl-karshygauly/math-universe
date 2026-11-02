'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface KaTeXMathProps {
  math: string;
  block?: boolean;
  className?: string;
}

export function KaTeXMath({ math, block = false, className = '' }: KaTeXMathProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false,
        });
      } catch (err) {
        containerRef.current.innerText = math;
      }
    }
  }, [math, block]);

  return <span ref={containerRef} className={`katex-wrap ${className}`} />;
}
