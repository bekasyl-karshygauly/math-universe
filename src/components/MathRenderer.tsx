'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Parses raw HTML string and transforms all LaTeX delimiters:
 * - $$ ... $$ -> display mode KaTeX
 * - \( ... \) -> inline KaTeX
 * - $ ... $   -> inline KaTeX
 */
export function renderLatexInHtml(html: string): string {
  if (!html) return '';

  let output = html;

  // 1. Replace display math $$ ... $$
  output = output.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
      });
    } catch (e) {
      return math;
    }
  });

  // 2. Replace inline math \( ... \)
  output = output.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch (e) {
      return math;
    }
  });

  // 3. Replace single $ ... $ (avoiding currency or double $$)
  output = output.replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (match, prefix, math) => {
    try {
      return prefix + katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch (e) {
      return match;
    }
  });

  return output;
}

export function MathRenderer({ content, className = '' }: MathRendererProps) {
  const renderedHtml = useMemo(() => {
    return renderLatexInHtml(content);
  }, [content]);

  return (
    <div
      className={`math-content ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
