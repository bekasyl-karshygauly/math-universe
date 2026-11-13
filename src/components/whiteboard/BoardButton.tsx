'use client';

import { useRef, useState, type ReactNode } from 'react';
import { PenTool } from 'lucide-react';
import type { Language } from '../../lib/storage';
import { boardLabel } from './copy';
import { emptyHistory, type History, type Point } from './drawing';
import { Whiteboard } from './Whiteboard';

export function BoardButton({ lang, problem }: { lang: Language; problem?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<History>(emptyHistory);
  const offset = useRef<Point>({ x: 0, y: 0 });

  return (
    <>
      <button type="button" className="btn btn--secondary btn--sm" aria-haspopup="dialog" onClick={e => {
        e.currentTarget.focus({ preventScroll: true });
        setOpen(true);
      }}>
        <PenTool size={16} aria-hidden="true" /> {boardLabel(lang, problem ? 'open' : 'board')}
      </button>
      {open && <Whiteboard lang={lang} problem={problem} history={history} onChange={setHistory}
        offset={offset} onClose={() => setOpen(false)} />}
    </>
  );
}
