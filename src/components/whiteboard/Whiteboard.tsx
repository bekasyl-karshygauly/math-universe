'use client';

import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowUpRight, Circle, Eraser, Grid3X3, Hand, Minus, Pencil, Redo2, Square, Trash2, Type, Undo2,
} from 'lucide-react';
import type { Language } from '../../lib/storage';
import { Dialog } from '../ui/Dialog';
import { boardLabel, type BoardLabel } from './copy';
import { drawMark, inkTokens, type Action, type History, type Ink, type Mark, type Point, type StrokeWidth, type Tool } from './drawing';
import styles from './whiteboard.module.css';

const tools = [
  ['pan', Hand], ['pen', Pencil], ['line', Minus], ['arrow', ArrowUpRight],
  ['rect', Square], ['ellipse', Circle], ['text', Type], ['eraser', Eraser],
] as const;
const inks = Object.keys(inkTokens) as Ink[];
const widths = [[2, 'thin'], [4, 'medium'], [7, 'thick']] as const;
const origin = { x: 0, y: 0 };

interface WhiteboardProps {
  lang: Language;
  problem?: ReactNode;
  history: History;
  onChange: (history: History) => void;
  onClose: () => void;
  offset: RefObject<Point>;
}

type Gesture = {
  id: number;
  last: Point;
  mark: Mark | null;
};

export function Whiteboard({ lang, problem, history, onChange, onClose, offset }: WhiteboardProps) {
  const t = (key: BoardLabel) => boardLabel(lang, key);
  const [tool, setTool] = useState<Tool>('pen');
  const [ink, setInk] = useState<Ink>('ink');
  const [width, setWidth] = useState<StrokeWidth>(4);
  const [grid, setGrid] = useState(true);
  const [value, setValue] = useState('');
  const [failed, setFailed] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const frame = useRef(0);
  const scene = useRef(history.done);
  const textField = useRef<HTMLInputElement>(null);
  const textId = useId();
  const hintId = useId();

  function paint() {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) {
      setFailed(true);
      return;
    }
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(w * dpr);
    const pixelHeight = Math.round(h * dpr);
    if (el.width !== pixelWidth) el.width = pixelWidth;
    if (el.height !== pixelHeight) el.height = pixelHeight;
    const { x, y } = offset.current;
    el.style.backgroundPosition = `${x}px ${y}px`;
    const css = getComputedStyle(el);
    const colors = Object.fromEntries(inks.map(key => [key, css.getPropertyValue(inkTokens[key]).trim()])) as Record<Ink, string>;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, pixelWidth, pixelHeight);
    ctx.setTransform(dpr, 0, 0, dpr, x * dpr, y * dpr);
    const done = scene.current;
    const lastClear = done.findLastIndex(action => action.tool === 'clear');
    for (let index = lastClear + 1; index < done.length; index++) {
      const mark = done[index];
      if (mark.tool !== 'clear') drawMark(ctx, mark, colors);
    }
    if (gesture.current?.mark) drawMark(ctx, gesture.current.mark, colors);
  }

  function schedulePaint() {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      paint();
    });
  }

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const observer = new ResizeObserver(schedulePaint);
    observer.observe(el);
    window.addEventListener('resize', schedulePaint);
    schedulePaint();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', schedulePaint);
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, []);

  function setHistory(next: History) {
    scene.current = next.done;
    onChange(next);
    schedulePaint();
  }

  function commit(action: Action) {
    setHistory({ done: [...history.done, action], undone: [] });
  }

  function undo() {
    const last = history.done.at(-1);
    if (!last) return;
    setHistory({ done: history.done.slice(0, -1), undone: [...history.undone, last] });
  }

  function redo() {
    const next = history.undone.at(-1);
    if (!next) return;
    setHistory({ done: [...history.done, next], undone: history.undone.slice(0, -1) });
  }

  function point(e: PointerEvent<HTMLCanvasElement>): Point {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * el.clientWidth / rect.width,
      y: (e.clientY - rect.top) * el.clientHeight / rect.height,
    };
  }

  function onBoard(point: Point): Point {
    return { x: point.x - offset.current.x, y: point.y - offset.current.y };
  }

  function addText(at: Point) {
    if (!value.trim()) {
      textField.current?.focus();
      return;
    }
    commit({ tool: 'text', start: onBoard(at), value: value.trim(), ink, width });
    setValue('');
  }

  function start(e: PointerEvent<HTMLCanvasElement>) {
    if (!e.isPrimary || e.button !== 0 || gesture.current || failed) return;
    const last = point(e);
    if (tool === 'text') {
      addText(last);
      return;
    }
    const start = onBoard(last);
    let mark: Mark | null = null;
    if (tool === 'pen' || tool === 'eraser') mark = { tool, points: [start], ink, width };
    else if (tool !== 'pan') mark = { tool, start, end: start, ink, width };
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { id: e.pointerId, last, mark };
    schedulePaint();
  }

  function move(e: PointerEvent<HTMLCanvasElement>) {
    const current = gesture.current;
    if (!current || current.id !== e.pointerId) return;
    const at = point(e);
    if (at.x === current.last.x && at.y === current.last.y) return;
    const mark = current.mark;
    if (!mark) {
      offset.current = { x: offset.current.x + at.x - current.last.x, y: offset.current.y + at.y - current.last.y };
    } else if ('points' in mark) {
      mark.points.push(onBoard(at));
    } else if ('end' in mark) {
      mark.end = onBoard(at);
    }
    current.last = at;
    schedulePaint();
  }

  function finish(e: PointerEvent<HTMLCanvasElement>, cancelled = false) {
    const current = gesture.current;
    if (!current || current.id !== e.pointerId) return;
    if (!cancelled) move(e);
    gesture.current = null;
    if (!cancelled && current.mark) commit(current.mark);
    else schedulePaint();
  }

  useEffect(() => {
    if (tool === 'text') textField.current?.focus();
  }, [tool]);

  const hint = tool === 'text' ? 'textHint' : tool === 'pan' ? 'panHint' : 'drawHint';
  const lastAction = history.done.at(-1);

  return createPortal(
    <Dialog onClose={onClose} title={t('board')} closeLabel={t('close')} maxWidth={1240} height="100dvh"
      bodyClassName={styles.body} onBackdropClose={false}>
      <div className={styles.layout} onKeyDown={e => {
        if (e.target instanceof HTMLInputElement || !(e.ctrlKey || e.metaKey) || e.altKey) return;
        const key = e.key.toLowerCase();
        if (key !== 'z' && key !== 'y') return;
        e.preventDefault();
        if (key === 'y' || e.shiftKey) redo();
        else undo();
      }}>
        {problem && (
          <details open className={styles.problem}>
            <summary>{t('problem')}</summary>
            <div className={styles.problemContent}>{problem}</div>
          </details>
        )}
        <div className={styles.toolbar}>
          <div role="group" aria-label={t('tools')} className={styles.group}>
            {tools.map(([name, Icon]) => (
              <button type="button" key={name} className={styles.tool} aria-label={t(name)} title={t(name)}
                disabled={failed} aria-pressed={tool === name} onClick={() => setTool(name)}>
                <Icon size={18} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className={styles.group}>
            <button type="button" className={styles.tool} disabled={!lastAction} onClick={undo} aria-label={t('undo')} title={t('undo')}><Undo2 size={18} aria-hidden="true" /></button>
            <button type="button" className={styles.tool} disabled={!history.undone.length} onClick={redo} aria-label={t('redo')} title={t('redo')}><Redo2 size={18} aria-hidden="true" /></button>
            <button type="button" className={styles.tool} aria-pressed={grid} onClick={() => setGrid(!grid)} aria-label={t('grid')} title={t('grid')}><Grid3X3 size={18} aria-hidden="true" /></button>
            <button type="button" className={styles.tool} disabled={!lastAction || lastAction.tool === 'clear'} onClick={() => commit({ tool: 'clear' })} aria-label={t('clear')} title={t('clear')}><Trash2 size={18} aria-hidden="true" /></button>
          </div>
        </div>
        <div className={styles.settings}>
          <div className={styles.group} role="group" aria-label={t('color')}>
            {inks.map(color => (
              <button type="button" key={color} className={`${styles.tool} ${styles.swatch}`} aria-label={t(color)}
                title={t(color)} aria-pressed={ink === color} onClick={() => setInk(color)}>
                <span aria-hidden="true" style={{ backgroundColor: `var(${inkTokens[color]})` }} />
              </button>
            ))}
          </div>
          <div className={styles.group} role="group" aria-label={t('thickness')}>
            {widths.map(([size, label]) => (
              <button type="button" key={size} className={`${styles.tool} ${styles.width}`} aria-label={t(label)}
                title={t(label)} aria-pressed={width === size} onClick={() => setWidth(size)}>
                <span aria-hidden="true" style={{ height: size }} />
              </button>
            ))}
          </div>
        </div>
        {tool === 'text' && (
          <form noValidate className={styles.textEntry} onSubmit={e => {
            e.preventDefault();
            const el = canvas.current;
            if (el) addText({ x: 20, y: el.clientHeight / 2 });
          }}>
            <label className="field-label" htmlFor={textId}>{t('write')}</label>
            <div>
              <input ref={textField} id={textId} className="field-input" maxLength={160}
                placeholder="x² + 3x = 0" value={value} onChange={e => setValue(e.target.value)} />
              <button type="submit" className="btn btn--secondary btn--sm" disabled={!value.trim()}>{t('insert')}</button>
            </div>
          </form>
        )}
        <p id={hintId} className={styles.hint}>{t(hint)}</p>
        {failed && <p role="status" className="status status--danger">{t('unavailable')}</p>}
        <div className={styles.paper}>
          <canvas ref={canvas} className={styles.canvas} data-grid={grid} data-tool={tool} tabIndex={0}
            aria-label={t('board')} aria-describedby={hintId} onPointerDown={start} onPointerMove={move}
            onPointerUp={finish} onPointerCancel={e => finish(e, true)} onLostPointerCapture={e => finish(e, true)}
            onKeyDown={e => {
              if (e.ctrlKey || e.metaKey || e.altKey) return;
              const { x, y } = offset.current;
              switch (e.key) {
                case 'ArrowLeft': offset.current = { x: x + 64, y }; break;
                case 'ArrowRight': offset.current = { x: x - 64, y }; break;
                case 'ArrowUp': offset.current = { x, y: y + 64 }; break;
                case 'ArrowDown': offset.current = { x, y: y - 64 }; break;
                case 'Home': offset.current = origin; break;
                default: return;
              }
              e.preventDefault();
              schedulePaint();
            }} />
        </div>
      </div>
    </Dialog>,
    document.body,
  );
}
