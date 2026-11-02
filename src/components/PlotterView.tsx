'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Language, Theme } from '../lib/storage';
import { I18N } from '../data/i18n';
import { JSXGraphBoard, JSXGraphDemoType } from './visualizations/JSXGraphBoard';
import { Math3DViewer } from './visualizations/Math3DViewer';
import { GeometrySandbox } from './visualizations/GeometrySandbox';
import { playClickSound } from '../lib/sound';
import { parseFunctionOrNaN } from '../lib/mathExpr';

interface PlotterViewProps {
  lang: Language;
  theme: Theme;
}

export function PlotterView({ lang, theme }: PlotterViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'2d' | 'jsxgraph' | '3d' | 'sandbox'>('2d');
  const [jsxType, setJsxType] = useState<JSXGraphDemoType>('derivative');

  // 2D Canvas State
  const [funcStr, setFuncStr] = useState<string>('sin(x)');
  const [xMin, setXMin] = useState<number>(-10);
  const [xMax, setXMax] = useState<number>(10);
  const [plotStats, setPlotStats] = useState<string>('');
  const [isPlotting, setIsPlotting] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const t = (k: string) => I18N[lang][k] || k;

  const drawPlot = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const W = cv.clientWidth || 800;
    const H = 420;
    cv.width = W;
    cv.height = H;

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
      // Background
      ctx.fillStyle = theme === 'dark' ? '#131620' : '#f8fafc';
      ctx.fillRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (H * i) / 10);
        ctx.lineTo(W, (H * i) / 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((W * i) / 10, 0);
        ctx.lineTo((W * i) / 10, H);
        ctx.stroke();
      }

      // Axes
      ctx.strokeStyle = theme === 'dark' ? '#94a3b8' : '#64748b';
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
    };

    // Animated smooth line drawing
    let currentIdx = 0;
    const step = 15;
    setIsPlotting(true);

    const animateCurve = () => {
      renderStaticGrid();

      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.beginPath();

      let started = false;
      const limit = Math.min(pts.length, currentIdx);

      for (let i = 0; i < limit; i++) {
        const [x, y] = pts[i];
        const px = sx(x);
        const py = sy(y);

        if (py < -2000 || py > H + 2000) {
          started = false;
          continue;
        }

        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      // Glowing cursor head
      if (limit > 0 && limit < pts.length) {
        const [lastX, lastY] = pts[limit - 1];
        const lx = sx(lastX);
        const ly = sy(lastY);
        if (ly >= 0 && ly <= H) {
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(lx, ly, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      if (currentIdx < pts.length) {
        currentIdx += step;
        animFrameRef.current = requestAnimationFrame(animateCurve);
      } else {
        setIsPlotting(false);
      }
    };

    animateCurve();
    setPlotStats(`f(x) = ${funcStr} | x ∈ [${xMin}, ${xMax}] | y ∈ [${yMin.toFixed(2)}, ${yMax.toFixed(2)}]`);
  }, [funcStr, xMin, xMax, theme]);

  useEffect(() => {
    if (activeSubTab === '2d') {
      drawPlot();
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeSubTab, drawPlot]);

  return (
    <div>
      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: '2d' as const, label: '📈 2D-График функций (анимированный)' },
          { id: 'jsxgraph' as const, label: '✨ JSXGraph Интерактивная геометрия' },
          { id: '3d' as const, label: '🌌 Three.js 3D-пространство' },
          { id: 'sandbox' as const, label: '🎯 Живой треугольник & Монте-Карло' },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveSubTab(tab.id);
              playClickSound();
            }}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 700,
              background: activeSubTab === tab.id ? 'var(--primary-gradient)' : 'var(--surface)',
              color: activeSubTab === tab.id ? '#fff' : 'var(--text-muted)',
              border: '1px solid',
              borderColor: activeSubTab === tab.id ? 'transparent' : 'var(--border)',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {activeSubTab === '2d' && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Функция f(x) =
              </label>
              <input
                value={funcStr}
                onChange={(e) => setFuncStr(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '15px',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                {t('plot_xmin')}
              </label>
              <input
                type="number"
                value={xMin}
                onChange={(e) => setXMin(+e.target.value)}
                style={{ width: '90px', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                {t('plot_xmax')}
              </label>
              <input
                type="number"
                value={xMax}
                onChange={(e) => setXMax(+e.target.value)}
                style={{ width: '90px', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }}
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px' }}>Пресеты:</span>
            {[
              ['sin(x)', 'sin(x)'],
              ['x^2 - 4', 'x^2 - 4'],
              ['0.25*x^3 - x', '0.25*x^3 - x'],
              ['exp(-x^2)', 'exp(-x^2)'],
              ['1 / (1 + x^2)', '1 / (1 + x^2)'],
              ['sin(x) * x', 'sin(x) * x'],
            ].map(([label, f]) => (
              <button
                key={label}
                onClick={() => {
                  setFuncStr(f);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: 'var(--surface-secondary)',
                  border: '1px solid var(--border)',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={drawPlot}
            disabled={isPlotting}
            style={{
              padding: '11px 26px',
              borderRadius: '11px',
              background: 'var(--primary-gradient)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '13.5px',
              marginBottom: '16px',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              cursor: isPlotting ? 'default' : 'pointer',
              opacity: isPlotting ? 0.7 : 1,
            }}
          >
            {isPlotting ? '⏳ Построение...' : `🚀 ${t('plot_btn')}`}
          </motion.button>

          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '420px',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              display: 'block',
            }}
          />

          {plotStats && (
            <div
              style={{
                marginTop: '14px',
                padding: '12px 18px',
                borderRadius: '10px',
                background: 'var(--surface-secondary)',
                borderLeft: '4px solid var(--primary)',
                fontSize: '13.5px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {plotStats}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'jsxgraph' && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
            {[
              ['derivative', '📈 Касательная к кривой (перетаскивайте точку A)'],
              ['unit_circle', '⭕ Единичный круг (перетаскивайте точку P)'],
              ['parabola', '📉 Вершина параболы и корни'],
              ['riemann', '📊 Суммы Римана (ползунок прямоугольников)'],
            ].map(([type, label]) => (
              <button
                key={type}
                onClick={() => setJsxType(type as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: jsxType === type ? 'var(--primary-light)' : 'var(--surface-secondary)',
                  color: jsxType === type ? 'var(--primary)' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: jsxType === type ? 'var(--primary)' : 'var(--border)',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <JSXGraphBoard type={jsxType} height={460} />
        </div>
      )}

      {activeSubTab === '3d' && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Math3DViewer height={480} />
        </div>
      )}

      {activeSubTab === 'sandbox' && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <GeometrySandbox />
        </div>
      )}
    </div>
  );
}
