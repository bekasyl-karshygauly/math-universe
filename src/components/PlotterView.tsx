'use client';

import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { Language, Theme } from '../lib/storage';
import { I18N } from '../data/i18n';
import { JSXGraphBoard, JSXGraphDemoType } from './visualizations/JSXGraphBoard';
import { Math3DViewer } from './visualizations/Math3DViewer';
import { GeometrySandbox } from './visualizations/GeometrySandbox';
import { SegmentedTabs } from './ui/SegmentedTabs';
import { playClickSound } from '../lib/sound';
import { parseFunctionOrNaN } from '../lib/mathExpr';
import { getLabPalette, prefersReducedMotion } from '../lib/labPalette';

interface PlotterViewProps {
  lang: Language;
  theme: Theme;
}

type SubTab = '2d' | 'jsxgraph' | '3d' | 'sandbox';

const PRESETS = ['sin(x)', 'x^2 - 4', '0.25*x^3 - x', 'exp(-x^2)', '1 / (1 + x^2)', 'sin(x) * x', 'ln(x)'];

const JSX_DEMOS: { id: JSXGraphDemoType; label: string }[] = [
  { id: 'derivative', label: 'Касательная (точка A)' },
  { id: 'unit_circle', label: 'Единичный круг (точка P)' },
  { id: 'parabola', label: 'Вершина параболы и корни' },
  { id: 'riemann', label: 'Суммы Римана' },
];

const PLOT_H = 420;

export function PlotterView({ lang, theme }: PlotterViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('2d');
  const [jsxType, setJsxType] = useState<JSXGraphDemoType>('derivative');

  // 2D Canvas State
  const [funcStr, setFuncStr] = useState<string>('sin(x)');
  const [xMin, setXMin] = useState<number>(-10);
  const [xMax, setXMax] = useState<number>(10);
  const [plotStats, setPlotStats] = useState<string>('');
  const [isPlotting, setIsPlotting] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const funcId = useId();

  const t = (k: string) => I18N[lang][k] || k;

  const drawPlot = useCallback(
    (animate = true) => {
      const cv = canvasRef.current;
      if (!cv) return;
      const ctx = cv.getContext('2d');
      if (!ctx) return;

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      // Crisp lines on high-DPI screens: draw in CSS pixels on a scaled backing store
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const W = cv.clientWidth || 800;
      const H = PLOT_H;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Canvas cannot resolve CSS variables, so colors come from the computed theme tokens
      const pal = getLabPalette();

      const f = parseFunctionOrNaN(funcStr);
      const N = 600;
      const pts: [number, number][] = [];
      let yMin = Infinity;
      let yMax = -Infinity;

      for (let i = 0; i <= N; i++) {
        const x = xMin + ((xMax - xMin) * i) / N;
        const y = f(x);
        if (isFinite(y)) {
          pts.push([x, y]);
          if (y < yMin) yMin = y;
          if (y > yMax) yMax = y;
        }
      }

      if (!isFinite(yMin) || !isFinite(yMax)) {
        yMin = -10;
        yMax = 10;
      }

      const pad = (yMax - yMin) * 0.15 || 1;
      yMin -= pad;
      yMax += pad;

      const sx = (x: number) => ((x - xMin) / (xMax - xMin)) * W;
      const sy = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H;

      const renderStaticGrid = () => {
        ctx.fillStyle = pal.surface;
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = pal.grid;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
          ctx.beginPath();
          ctx.moveTo(0, Math.round((H * i) / 10) + 0.5);
          ctx.lineTo(W, Math.round((H * i) / 10) + 0.5);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(Math.round((W * i) / 10) + 0.5, 0);
          ctx.lineTo(Math.round((W * i) / 10) + 0.5, H);
          ctx.stroke();
        }

        ctx.strokeStyle = pal.axis;
        ctx.lineWidth = 1.5;
        const y0 = sy(0);
        const x0 = sx(0);
        if (y0 >= 0 && y0 <= H) {
          ctx.beginPath();
          ctx.moveTo(0, y0);
          ctx.lineTo(W, y0);
          ctx.stroke();
        }
        if (x0 >= 0 && x0 <= W) {
          ctx.beginPath();
          ctx.moveTo(x0, 0);
          ctx.lineTo(x0, H);
          ctx.stroke();
        }

        // Axis range labels
        ctx.fillStyle = pal.label;
        ctx.font = '11px Arial, Helvetica, sans-serif';
        ctx.fillText(String(xMin), 6, H - 6);
        const xMaxLabel = String(xMax);
        ctx.fillText(xMaxLabel, W - 6 - ctx.measureText(xMaxLabel).width, H - 6);
        ctx.fillText(yMax.toFixed(1), 6, 14);
      };

      const renderCurve = (limit: number) => {
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < limit; i++) {
          const [x, y] = pts[i];
          const px = sx(x);
          const py = sy(y);
          // Break the path at gaps in the domain (e.g. ln(x) for x ≤ 0) and at asymptotes
          const prev = i > 0 ? pts[i - 1] : null;
          const gap = prev && x - prev[0] > ((xMax - xMin) / N) * 1.5;
          if (py < -2000 || py > H + 2000 || gap) {
            started = false;
            if (py < -2000 || py > H + 2000) continue;
          }
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      };

      setPlotStats(`f(x) = ${funcStr} · x ∈ [${xMin}, ${xMax}] · y ∈ [${yMin.toFixed(2)}, ${yMax.toFixed(2)}]`);

      // Reduced motion or redraw (resize/theme): draw the finished curve at once
      if (!animate || prefersReducedMotion()) {
        renderStaticGrid();
        renderCurve(pts.length);
        setIsPlotting(false);
        return;
      }

      let currentIdx = 0;
      const step = 20;
      setIsPlotting(true);

      const animateCurve = () => {
        renderStaticGrid();
        renderCurve(Math.min(pts.length, currentIdx));
        if (currentIdx < pts.length) {
          currentIdx += step;
          animFrameRef.current = requestAnimationFrame(animateCurve);
        } else {
          animFrameRef.current = null;
          setIsPlotting(false);
        }
      };

      animateCurve();
    },
    [funcStr, xMin, xMax]
  );

  // Draw on open and when inputs change; redraw without animation on theme change
  useEffect(() => {
    if (activeSubTab === '2d') drawPlot(true);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeSubTab, drawPlot]);

  useEffect(() => {
    if (activeSubTab === '2d') drawPlot(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Keep the canvas sharp when its width changes (rotation, window resize)
  useEffect(() => {
    if (activeSubTab !== '2d' || !canvasRef.current) return;
    let lastWidth = canvasRef.current.clientWidth;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (Math.abs(w - lastWidth) > 1) {
        lastWidth = w;
        drawPlot(false);
      }
    });
    ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [activeSubTab, drawPlot]);

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
              <button type="submit" className="btn btn--primary plot-controls__submit" disabled={isPlotting}>
                {t('plot_btn')}
              </button>
            </form>

            <div className="solver-examples" style={{ margin: '0 0 16px' }}>
              <span className="field-help">{t('plot_presets')}:</span>
              {PRESETS.map((f) => (
                <button key={f} type="button" className="chip mono" aria-pressed={funcStr === f} onClick={() => setFuncStr(f)}>
                  {f}
                </button>
              ))}
            </div>

            <canvas
              ref={canvasRef}
              className="plot-surface"
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
            <JSXGraphBoard type={jsxType} height={460} lang={lang} />
          </div>
        )}

        {activeSubTab === '3d' && <Math3DViewer height={480} lang={lang} />}

        {activeSubTab === 'sandbox' && <GeometrySandbox />}
      </div>
    </div>
  );
}
