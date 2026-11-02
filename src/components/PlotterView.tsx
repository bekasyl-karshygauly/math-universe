'use client';

import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { Language, Theme } from '../lib/storage';
import { I18N } from '../data/i18n';
import { JSXGraphBoard, JSXGraphDemoType } from './visualizations/JSXGraphBoard';
import { Math3DViewer } from './visualizations/Math3DViewer';
import { GeometrySandbox } from './visualizations/GeometrySandbox';
import { SegmentedTabs } from './ui/SegmentedTabs';
import { playClickSound } from '../lib/sound';
import { compileFunction, ExprError } from '../lib/mathExpr';
import { getLabPalette, prefersReducedMotion } from '../lib/labPalette';
import { DUR, easeOutCubic, tween } from '../lib/motion';

interface PlotterViewProps {
  lang: Language;
  theme: Theme;
}

type SubTab = '2d' | 'jsxgraph' | '3d' | 'sandbox';

const PRESETS = ['sin(x)', 'x^2 - 4', '0.25*x^3 - x', 'exp(-x^2)', '1 / (1 + x^2)', 'sin(x) * x', 'ln(x)', 'tan(x)'];

const JSX_DEMOS: { id: JSXGraphDemoType; label: string }[] = [
  { id: 'derivative', label: 'Касательная (точка A)' },
  { id: 'unit_circle', label: 'Единичный круг (точка P)' },
  { id: 'parabola', label: 'Вершина параболы и корни' },
  { id: 'riemann', label: 'Суммы Римана' },
];

const PLOT_H = 420;
const SAMPLES = 800;

interface PlotData {
  pts: ([number, number] | null)[]; // null = outside the domain (gap)
  yMin: number;
  yMax: number;
  xMin: number;
  xMax: number;
  expr: string;
}

/** Samples f once, outside any animation loop. Non-finite values become gaps. */
function samplePlot(f: (x: number) => number, xMin: number, xMax: number, expr: string): PlotData {
  const pts: ([number, number] | null)[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const x = xMin + ((xMax - xMin) * i) / SAMPLES;
    const y = f(x);
    if (Number.isFinite(y)) {
      pts.push([x, y]);
      ys.push(y);
    } else pts.push(null);
  }

  let yMin = -10;
  let yMax = 10;
  if (ys.length) {
    const sorted = [...ys].sort((a, b) => a - b);
    const lo = sorted[0];
    const hi = sorted[sorted.length - 1];
    // Robust range: near-asymptote spikes (tan x, 1/x) would otherwise flatten the whole curve
    const q = (p: number) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))))];
    const q02 = q(0.02);
    const q98 = q(0.98);
    const core = q98 - q02;
    if (core > 0 && hi - lo > 12 * core) {
      yMin = q02;
      yMax = q98;
    } else {
      yMin = lo;
      yMax = hi;
    }
  }
  const pad = (yMax - yMin) * 0.15 || 1;
  return { pts, yMin: yMin - pad, yMax: yMax + pad, xMin, xMax, expr };
}

export function PlotterView({ lang, theme }: PlotterViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('2d');
  const [jsxType, setJsxType] = useState<JSXGraphDemoType>('derivative');

  // 2D Canvas State
  const [funcStr, setFuncStr] = useState<string>('sin(x)');
  const [xMin, setXMin] = useState<number>(-10);
  const [xMax, setXMax] = useState<number>(10);
  const [plotStats, setPlotStats] = useState<string>('');
  const [isPlotting, setIsPlotting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cancelDrawRef = useRef<(() => void) | null>(null);
  const lastPlotRef = useRef<PlotData | null>(null);
  const funcId = useId();

  const t = (k: string) => I18N[lang][k] || k;

  /** Paints grid, axes and the curve up to fraction `progress` of the x-range. */
  const paint = useCallback((data: PlotData, progress: number) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    // Crisp lines on high-DPI screens; cap DPR to keep the canvas light
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = cv.clientWidth || 800;
    const H = PLOT_H;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Canvas cannot resolve CSS variables, so colors come from the computed theme tokens
    const pal = getLabPalette();
    const { pts, yMin, yMax } = data;
    const sx = (x: number) => ((x - data.xMin) / (data.xMax - data.xMin)) * W;
    const sy = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H;

    // Stable layer: background, grid, axes and labels never move during the draw
    ctx.fillStyle = pal.surface;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 10; i++) {
      const gy = Math.round((H * i) / 10) + 0.5;
      const gx = Math.round((W * i) / 10) + 0.5;
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H);
    }
    ctx.stroke();

    ctx.strokeStyle = pal.axis;
    ctx.lineWidth = 1.5;
    const y0 = sy(0);
    const x0 = sx(0);
    ctx.beginPath();
    if (y0 >= 0 && y0 <= H) {
      ctx.moveTo(0, y0);
      ctx.lineTo(W, y0);
    }
    if (x0 >= 0 && x0 <= W) {
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, H);
    }
    ctx.stroke();

    ctx.fillStyle = pal.label;
    ctx.font = '11px Arial, Helvetica, sans-serif';
    ctx.fillText(String(data.xMin), 6, H - 6);
    const xMaxLabel = String(data.xMax);
    ctx.fillText(xMaxLabel, W - 6 - ctx.measureText(xMaxLabel).width, H - 6);
    ctx.fillText(yMax.toFixed(1), 6, 14);

    // Curve: exact sampled points, no smoothing; gaps and asymptote jumps break the path
    const limit = Math.round(progress * (pts.length - 1));
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    let prev: [number, number] | null = null;
    let last: [number, number] | null = null;
    for (let i = 0; i <= limit; i++) {
      const p = pts[i];
      if (!p) {
        prev = null;
        continue;
      }
      const px = sx(p[0]);
      const py = sy(p[1]);
      // A jump of more than the plot height between neighbouring samples is a pole: do not connect it
      const jump = prev && Math.abs(py - prev[1]) > H;
      if (!prev || jump) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      prev = [px, py];
      if (py >= -4 && py <= H + 4) last = [px, py];
    }
    ctx.stroke();

    // Pen head while drawing: shows where the curve is being traced
    if (progress < 1 && last) {
      ctx.fillStyle = pal.accent;
      ctx.beginPath();
      ctx.arc(last[0], last[1], 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  /**
   * Validates and plots. animate=true traces the curve over ~550 ms (build button, presets);
   * otherwise it redraws instantly (typing, resize, theme). Any running draw is cancelled first.
   */
  const drawPlot = useCallback(
    (animate: boolean) => {
      cancelDrawRef.current?.();
      cancelDrawRef.current = null;

      let f: (x: number) => number;
      try {
        f = compileFunction(funcStr);
      } catch (e) {
        // Keep the last valid graph on screen and explain the problem next to the input
        setError(`${t('plot_error')}: ${e instanceof ExprError ? e.message : String(e)}`);
        setIsPlotting(false);
        return;
      }
      if (!(xMax > xMin)) {
        setError(t('plot_error_range'));
        setIsPlotting(false);
        return;
      }
      setError('');

      const data = samplePlot(f, xMin, xMax, funcStr);
      lastPlotRef.current = data;
      setPlotStats(`f(x) = ${funcStr} · x ∈ [${xMin}, ${xMax}] · y ∈ [${data.yMin.toFixed(2)}, ${data.yMax.toFixed(2)}]`);

      if (!animate || prefersReducedMotion()) {
        paint(data, 1);
        setIsPlotting(false);
        return;
      }
      setIsPlotting(true);
      cancelDrawRef.current = tween(
        DUR.draw,
        (p) => paint(data, easeOutCubic(p)),
        () => {
          cancelDrawRef.current = null;
          setIsPlotting(false);
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [funcStr, xMin, xMax, paint, lang]
  );

  // Latest-wins: an explicit build (button / preset / opening the tab) animates
  const animateNext = useRef(true);
  useEffect(() => {
    if (activeSubTab !== '2d') return;
    if (animateNext.current) {
      animateNext.current = false;
      drawPlot(true);
      return;
    }
    // Typing: short debounce, then an instant redraw — no animation per keystroke
    const id = setTimeout(() => drawPlot(false), 160);
    return () => clearTimeout(id);
  }, [activeSubTab, drawPlot]);

  useEffect(() => () => cancelDrawRef.current?.(), []);

  // Theme change: repaint the last valid graph with the new palette
  useEffect(() => {
    if (activeSubTab === '2d' && lastPlotRef.current && !cancelDrawRef.current) paint(lastPlotRef.current, 1);
  }, [theme, activeSubTab, paint]);

  // Keep the canvas sharp when its width changes (rotation, window resize) without restarting a draw
  useEffect(() => {
    if (activeSubTab !== '2d' || !canvasRef.current) return;
    let lastWidth = canvasRef.current.clientWidth;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (Math.abs(w - lastWidth) > 1) {
        lastWidth = w;
        if (lastPlotRef.current && !cancelDrawRef.current) paint(lastPlotRef.current, 1);
      }
    });
    ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [activeSubTab, paint]);

  const tabs: { id: SubTab; label: string }[] = [
    { id: '2d', label: t('plot_mode_2d') },
    { id: 'jsxgraph', label: t('plot_mode_jsx') },
    { id: '3d', label: t('plot_mode_3d') },
    { id: 'sandbox', label: t('plot_mode_sandbox') },
  ];

  return (
    <div>
      <SegmentedTabs
        label={t('plot_modes_label')}
        items={tabs}
        value={activeSubTab}
        idPrefix="plot"
        scroll
        onChange={(id) => {
          if (id === '2d') animateNext.current = true;
          setActiveSubTab(id);
          playClickSound();
        }}
      />

      <div key={activeSubTab} id="plot-panel" role="tabpanel" aria-labelledby={`plot-tab-${activeSubTab}`} className="panel panel--instrument calc-panel reveal">
        {activeSubTab === '2d' && (
          <div>
            <form
              className="plot-controls"
              onSubmit={(e) => {
                e.preventDefault();
                drawPlot(true);
              }}
            >
              <div className="field">
                <label className="field-label" htmlFor={funcId}>
                  f(x) =
                </label>
                <input
                  id={funcId}
                  className="field-input field-input--mono"
                  value={funcStr}
                  onChange={(e) => setFuncStr(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={`${funcId}-status`}
                />
              </div>
              <div className="field">
                <label className="field-label" htmlFor={`${funcId}-min`}>
                  {t('plot_xmin')}
                </label>
                <input id={`${funcId}-min`} className="field-input field-input--mono" type="number" value={xMin} onChange={(e) => setXMin(+e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label" htmlFor={`${funcId}-max`}>
                  {t('plot_xmax')}
                </label>
                <input id={`${funcId}-max`} className="field-input field-input--mono" type="number" value={xMax} onChange={(e) => setXMax(+e.target.value)} />
              </div>
              <button type="submit" className="btn btn--primary plot-controls__submit" aria-busy={isPlotting || undefined}>
                <span>{t('plot_btn')}</span>
              </button>
            </form>

            {/* Reserved line: the error appears without pushing the graph around */}
            <p id={`${funcId}-status`} className="plot-status" role={error ? 'alert' : undefined}>
              {error}
            </p>

            <div className="solver-examples" style={{ margin: '0 0 16px' }}>
              <span className="field-help">{t('plot_presets')}:</span>
              {PRESETS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className="chip mono"
                  aria-pressed={funcStr === f}
                  onClick={() => {
                    animateNext.current = true;
                    setFuncStr(f);
                    if (f === funcStr) drawPlot(true);
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            <canvas
              ref={canvasRef}
              className={`plot-surface${error ? ' plot-surface--stale' : ''}`}
              role="img"
              aria-label={plotStats || `f(x) = ${funcStr}`}
              style={{ height: `${PLOT_H}px` }}
            />

            {plotStats && (
              <p className="plot-readout mono" aria-live="polite">
                {plotStats}
              </p>
            )}
          </div>
        )}

        {activeSubTab === 'jsxgraph' && (
          <div>
            <div className="seg-tabs" role="group" aria-label={t('plot_mode_jsx')} style={{ marginBottom: '18px' }}>
              {JSX_DEMOS.map((d) => (
                <button key={d.id} type="button" className="seg-tab" aria-pressed={jsxType === d.id} onClick={() => setJsxType(d.id)}>
                  {d.label}
                </button>
              ))}
            </div>
            <p className="field-help" style={{ marginBottom: '10px' }}>
              {t('drag_points')}
            </p>
            <div key={jsxType} className="reveal">
              <JSXGraphBoard type={jsxType} height={460} lang={lang} />
            </div>
          </div>
        )}

        {activeSubTab === '3d' && <Math3DViewer height={480} lang={lang} />}

        {activeSubTab === 'sandbox' && <GeometrySandbox />}
      </div>
    </div>
  );
}
