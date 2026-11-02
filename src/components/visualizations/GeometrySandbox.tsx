'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../../lib/sound';
import { getLabPalette, withAlpha } from '../../lib/labPalette';

interface Point {
  x: number;
  y: number;
}

export function GeometrySandbox() {
  const [activeTab, setActiveTab] = useState<'triangle' | 'montecarlo'>('triangle');

  // Triangle state
  const [pA, setPA] = useState<Point>({ x: 90, y: 220 });
  const [pB, setPB] = useState<Point>({ x: 310, y: 220 });
  const [pC, setPC] = useState<Point>({ x: 190, y: 70 });
  const draggingPoint = useRef<'A' | 'B' | 'C' | null>(null);
  const triSvgRef = useRef<SVGSVGElement>(null);

  // Monte Carlo state
  const [pointsTotal, setPointsTotal] = useState<number>(0);
  const [pointsInside, setPointsInside] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(25); // points per frame
  const mcCanvasRef = useRef<HTMLCanvasElement>(null);
  const mcAnimRef = useRef<number | null>(null);

  // Triangle math
  const dist = (p1: Point, p2: Point) => Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const sideA = dist(pB, pC); // opposite A
  const sideB = dist(pA, pC); // opposite B
  const sideC = dist(pA, pB); // opposite C

  // Angles via law of cosines
  const angleA = Math.acos(Math.max(-1, Math.min(1, (sideB ** 2 + sideC ** 2 - sideA ** 2) / (2 * sideB * sideC))));
  const angleB = Math.acos(Math.max(-1, Math.min(1, (sideA ** 2 + sideC ** 2 - sideB ** 2) / (2 * sideA * sideC))));
  const angleC = Math.PI - angleA - angleB;

  const degA = (angleA * 180) / Math.PI;
  const degB = (angleB * 180) / Math.PI;
  const degC = (angleC * 180) / Math.PI;

  const semiP = (sideA + sideB + sideC) / 2;
  const area = Math.sqrt(Math.max(0, semiP * (semiP - sideA) * (semiP - sideB) * (semiP - sideC)));
  const circumR = sideA / (2 * Math.sin(angleA) || 1);
  const inR = area / (semiP || 1);

  // Circumcenter (x, y)
  const d = 2 * (pA.x * (pB.y - pC.y) + pB.x * (pC.y - pA.y) + pC.x * (pA.y - pB.y));
  const ccX = d !== 0 ? ((pA.x ** 2 + pA.y ** 2) * (pB.y - pC.y) + (pB.x ** 2 + pB.y ** 2) * (pC.y - pA.y) + (pC.x ** 2 + pC.y ** 2) * (pA.y - pB.y)) / d : 0;
  const ccY = d !== 0 ? ((pA.x ** 2 + pA.y ** 2) * (pC.x - pB.x) + (pB.x ** 2 + pB.y ** 2) * (pA.x - pC.x) + (pC.x ** 2 + pC.y ** 2) * (pB.x - pA.x)) / d : 0;

  // Triangle pointer handlers
  const handleTrianglePointerDown = (which: 'A' | 'B' | 'C', e: React.PointerEvent) => {
    draggingPoint.current = which;
    (e.target as Element).setPointerCapture(e.pointerId);
    playClickSound();
  };

  const handleTrianglePointerMove = (e: React.PointerEvent) => {
    if (!draggingPoint.current || !triSvgRef.current) return;
    const rect = triSvgRef.current.getBoundingClientRect();
    // The SVG scales with its container: convert screen pixels to viewBox units
    const scale = 400 / rect.width;
    const x = Math.max(20, Math.min(380, (e.clientX - rect.left) * scale));
    const y = Math.max(20, Math.min(280, (e.clientY - rect.top) * scale));

    if (draggingPoint.current === 'A') setPA({ x, y });
    else if (draggingPoint.current === 'B') setPB({ x, y });
    else if (draggingPoint.current === 'C') setPC({ x, y });
  };

  const handleTrianglePointerUp = () => {
    draggingPoint.current = null;
  };

  // Monte Carlo simulation loop
  useEffect(() => {
    if (!isSimulating) {
      if (mcAnimRef.current) cancelAnimationFrame(mcAnimRef.current);
      return;
    }

    const canvas = mcCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const r = w / 2;
    // Canvas cannot resolve CSS variables: take theme colors once per run
    const pal = getLabPalette();
    const inColor = withAlpha(pal.success, 0.7);
    const outColor = withAlpha(pal.danger, 0.7);

    const step = () => {
      let localIn = 0;
      let localTotal = 0;

      for (let i = 0; i < speed; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const dx = x - r;
        const dy = y - r;
        const inside = dx * dx + dy * dy <= r * r;

        ctx.fillStyle = inside ? inColor : outColor;
        ctx.fillRect(x, y, 2.5, 2.5);

        if (inside) localIn++;
        localTotal++;
      }

      setPointsInside((prev) => prev + localIn);
      setPointsTotal((prev) => prev + localTotal);

      mcAnimRef.current = requestAnimationFrame(step);
    };

    mcAnimRef.current = requestAnimationFrame(step);

    return () => {
      if (mcAnimRef.current) cancelAnimationFrame(mcAnimRef.current);
    };
  }, [isSimulating, speed]);

  const resetMonteCarlo = () => {
    setIsSimulating(false);
    setPointsTotal(0);
    setPointsInside(0);
    const canvas = mcCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const pal = getLabPalette();
        ctx.fillStyle = pal.surface;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // redraw circle outline
        const r = canvas.width / 2;
        ctx.strokeStyle = pal.axis;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r, r, r - 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'montecarlo' && pointsTotal === 0) {
      resetMonteCarlo();
    }
  }, [activeTab]);

  const approxPi = pointsTotal > 0 ? (4 * pointsInside) / pointsTotal : 0;
  const piError = pointsTotal > 0 ? Math.abs((approxPi - Math.PI) / Math.PI) * 100 : 0;

  return (
    <div>
      {/* Sub tabs */}
      <div className="seg-tabs" role="group" aria-label="Геометрия" style={{ marginBottom: '20px' }}>
        <button
          type="button"
          className="seg-tab"
          aria-pressed={activeTab === 'triangle'}
          onClick={() => {
            setActiveTab('triangle');
            playClickSound();
          }}
        >
          Живой треугольник
        </button>
        <button
          type="button"
          className="seg-tab"
          aria-pressed={activeTab === 'montecarlo'}
          onClick={() => {
            setActiveTab('montecarlo');
            playClickSound();
          }}
        >
          Метод Монте-Карло (число π)
        </button>
      </div>

      {/* TAB 1: TRIANGLE */}
      {activeTab === 'triangle' && (
        <div className="sandbox-grid">
          <div style={{ minWidth: 0 }}>
            <svg
              ref={triSvgRef}
              viewBox="0 0 400 300"
              role="img"
              aria-label={`α = ${degA.toFixed(1)}°, β = ${degB.toFixed(1)}°, γ = ${degC.toFixed(1)}°`}
              onPointerMove={handleTrianglePointerMove}
              onPointerUp={handleTrianglePointerUp}
              className="plot-surface"
              style={{ height: 'auto', touchAction: 'none', userSelect: 'none' }}
            >
              {/* Circumcircle (if inside bounds) */}
              {circumR < 400 && circumR > 10 && (
                <circle cx={ccX} cy={ccY} r={circumR} fill="none" stroke="var(--plot-axis)" strokeWidth={1} strokeDasharray="4 4" />
              )}

              {/* Triangle fill & outline */}
              <polygon
                points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y}`}
                fill="color-mix(in srgb, var(--chart-1) 12%, transparent)"
                stroke="var(--primary)"
                strokeWidth={3}
                strokeLinejoin="round"
              />

              {/* Vertex A */}
              <circle
                cx={pA.x}
                cy={pA.y}
                r={10}
                fill="var(--chart-2)"
                stroke="var(--plot-bg)"
                strokeWidth={2.5}
                style={{ cursor: 'grab' }}
                onPointerDown={(e) => handleTrianglePointerDown('A', e)}
              />
              <text x={pA.x - 18} y={pA.y + 18} fill="var(--chart-2)" fontWeight={700} fontSize={14}>A</text>

              {/* Vertex B */}
              <circle
                cx={pB.x}
                cy={pB.y}
                r={10}
                fill="var(--chart-3)"
                stroke="var(--plot-bg)"
                strokeWidth={2.5}
                style={{ cursor: 'grab' }}
                onPointerDown={(e) => handleTrianglePointerDown('B', e)}
              />
              <text x={pB.x + 10} y={pB.y + 18} fill="var(--chart-3)" fontWeight={700} fontSize={14}>B</text>

              {/* Vertex C */}
              <circle
                cx={pC.x}
                cy={pC.y}
                r={10}
                fill="var(--chart-6)"
                stroke="var(--plot-bg)"
                strokeWidth={2.5}
                style={{ cursor: 'grab' }}
                onPointerDown={(e) => handleTrianglePointerDown('C', e)}
              />
              <text x={pC.x} y={pC.y - 14} fill="var(--chart-6)" fontWeight={700} fontSize={14} textAnchor="middle">C</text>
            </svg>
            <p className="field-help" style={{ textAlign: 'center', marginTop: '8px' }}>
              Перетаскивайте вершины A, B, C мышью или пальцем
            </p>
          </div>

          {/* Metrics */}
          <div style={{ minWidth: 0 }}>
            <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', marginBottom: '14px' }}>
              <div className="metric" style={{ boxShadow: 'inset 3px 0 0 var(--chart-2)' }}>
                <span className="metric__label">α (A)</span>
                <span className="metric__value">{degA.toFixed(1)}°</span>
              </div>
              <div className="metric" style={{ boxShadow: 'inset 3px 0 0 var(--chart-3)' }}>
                <span className="metric__label">β (B)</span>
                <span className="metric__value">{degB.toFixed(1)}°</span>
              </div>
              <div className="metric" style={{ boxShadow: 'inset 3px 0 0 var(--chart-6)' }}>
                <span className="metric__label">γ (C)</span>
                <span className="metric__value">{degC.toFixed(1)}°</span>
              </div>
              <div className="metric">
                <span className="metric__label">Площадь (Герон)</span>
                <span className="metric__value" style={{ color: 'var(--primary)' }}>S = {(area / 100).toFixed(1)}</span>
              </div>
              <div className="metric" style={{ gridColumn: 'span 2' }}>
                <span className="metric__label">Периметр</span>
                <span className="metric__value">P = {((sideA + sideB + sideC) / 10).toFixed(1)}</span>
              </div>
            </div>

            <div className="result-panel" style={{ marginTop: 0 }}>
              <p className="eyebrow eyebrow--muted" style={{ marginBottom: '8px' }}>
                Теорема синусов (2R)
              </p>
              <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', gap: '8px 16px', flexWrap: 'wrap', fontSize: '13px' }}>
                <span>a / sin A = {(sideA / Math.sin(angleA) / 10).toFixed(1)}</span>
                <span>b / sin B = {(sideB / Math.sin(angleB) / 10).toFixed(1)}</span>
                <span>c / sin C = {(sideC / Math.sin(angleC) / 10).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MONTE CARLO */}
      {activeTab === 'montecarlo' && (
        <div className="sandbox-grid">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
            <canvas
              ref={mcCanvasRef}
              width={300}
              height={300}
              className="plot-surface"
              role="img"
              aria-label={`π ≈ ${approxPi.toFixed(5)}`}
              style={{ width: '100%', maxWidth: '300px', height: 'auto', aspectRatio: '1 / 1' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button
                type="button"
                className={isSimulating ? 'btn btn--secondary' : 'btn btn--primary'}
                aria-pressed={isSimulating}
                onClick={() => {
                  setIsSimulating(!isSimulating);
                  playClickSound();
                  if (!isSimulating && pointsTotal > 500) playSuccessSound();
                }}
              >
                {isSimulating ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
                {isSimulating ? 'Пауза' : 'Запустить'}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  resetMonteCarlo();
                  playClickSound();
                }}
              >
                <RotateCcw size={16} aria-hidden="true" />
                Сброс
              </button>
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ marginBottom: '18px' }}>
              <p className="eyebrow eyebrow--muted">π ≈ 4 · N_внутри / N_всего</p>
              <p className="mono" style={{ fontSize: '40px', fontWeight: 700, color: 'var(--primary)', margin: '6px 0' }} aria-live="off">
                {approxPi.toFixed(5)}
              </p>
              <p className="result-note">
                Истинное значение: <b className="mono">{Math.PI.toFixed(5)}</b> · погрешность:{' '}
                <b className="mono" style={{ color: piError < 1 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{piError.toFixed(2)}%</b>
              </p>
            </div>

            <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', marginBottom: '16px' }}>
              <div className="metric" style={{ boxShadow: 'inset 3px 0 0 var(--accent-emerald)' }}>
                <span className="metric__label">Внутри круга</span>
                <span className="metric__value">{pointsInside.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="metric__label">Всего точек</span>
                <span className="metric__value">{pointsTotal.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <label htmlFor="mc-speed">Скорость симуляции</label>
                <span className="mono">{speed * 60} точек/сек</span>
              </div>
              <input id="mc-speed" type="range" min={5} max={150} step={5} value={speed} onChange={(e) => setSpeed(+e.target.value)} style={{ width: '100%', cursor: 'pointer' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
