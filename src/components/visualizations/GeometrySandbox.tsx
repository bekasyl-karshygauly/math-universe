'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { playClickSound, playSuccessSound } from '../../lib/sound';

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
    const x = Math.max(20, Math.min(380, e.clientX - rect.left));
    const y = Math.max(20, Math.min(280, e.clientY - rect.top));

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

    const step = () => {
      let localIn = 0;
      let localTotal = 0;

      for (let i = 0; i < speed; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const dx = x - r;
        const dy = y - r;
        const inside = dx * dx + dy * dy <= r * r;

        ctx.fillStyle = inside ? 'rgba(16, 185, 129, 0.75)' : 'rgba(244, 63, 94, 0.75)';
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // redraw circle outline
        const r = canvas.width / 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
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
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => {
            setActiveTab('triangle');
            playClickSound();
          }}
          style={{
            padding: '9px 18px',
            borderRadius: '11px',
            fontWeight: 800,
            fontSize: '13.5px',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'triangle' ? 'var(--primary-gradient)' : 'var(--surface-secondary)',
            color: activeTab === 'triangle' ? '#fff' : 'var(--text-muted)',
            boxShadow: activeTab === 'triangle' ? '0 4px 12px rgba(79, 70, 229, 0.35)' : 'none',
          }}
        >
          📐 Живой треугольник
        </button>
        <button
          onClick={() => {
            setActiveTab('montecarlo');
            playClickSound();
          }}
          style={{
            padding: '9px 18px',
            borderRadius: '11px',
            fontWeight: 800,
            fontSize: '13.5px',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'montecarlo' ? 'var(--primary-gradient)' : 'var(--surface-secondary)',
            color: activeTab === 'montecarlo' ? '#fff' : 'var(--text-muted)',
            boxShadow: activeTab === 'montecarlo' ? '0 4px 12px rgba(79, 70, 229, 0.35)' : 'none',
          }}
        >
          🎯 Метод Монте-Карло (Число π)
        </button>
      </div>

      {/* TAB 1: TRIANGLE */}
      {activeTab === 'triangle' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'center' }}>
          <div>
            <svg
              ref={triSvgRef}
              width={400}
              height={300}
              viewBox="0 0 400 300"
              onPointerMove={handleTrianglePointerMove}
              onPointerUp={handleTrianglePointerUp}
              style={{
                width: '100%',
                maxHeight: '300px',
                background: 'var(--surface-secondary)',
                borderRadius: '18px',
                border: '1px solid var(--border)',
                touchAction: 'none',
                userSelect: 'none',
              }}
            >
              {/* Circumcircle (if inside bounds) */}
              {circumR < 400 && circumR > 10 && (
                <circle
                  cx={ccX}
                  cy={ccY}
                  r={circumR}
                  fill="none"
                  stroke="var(--accent-cyan)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  opacity={0.4}
                />
              )}

              {/* Triangle fill & outline */}
              <polygon
                points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y}`}
                fill="rgba(99, 102, 241, 0.12)"
                stroke="var(--primary)"
                strokeWidth={3}
                strokeLinejoin="round"
              />

              {/* Vertex A */}
              <circle
                cx={pA.x}
                cy={pA.y}
                r={10}
                fill="#ef4444"
                stroke="#fff"
                strokeWidth={2.5}
                style={{ cursor: 'grab' }}
                onPointerDown={(e) => handleTrianglePointerDown('A', e)}
              />
              <text x={pA.x - 18} y={pA.y + 18} fill="#ef4444" fontWeight={900} fontSize={14}>A</text>

              {/* Vertex B */}
              <circle
                cx={pB.x}
                cy={pB.y}
                r={10}
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth={2.5}
                style={{ cursor: 'grab' }}
                onPointerDown={(e) => handleTrianglePointerDown('B', e)}
              />
              <text x={pB.x + 10} y={pB.y + 18} fill="#3b82f6" fontWeight={900} fontSize={14}>B</text>

              {/* Vertex C */}
              <circle
                cx={pC.x}
                cy={pC.y}
                r={10}
                fill="#10b981"
                stroke="#fff"
                strokeWidth={2.5}
                style={{ cursor: 'grab' }}
                onPointerDown={(e) => handleTrianglePointerDown('C', e)}
              />
              <text x={pC.x} y={pC.y - 14} fill="#10b981" fontWeight={900} fontSize={14} textAnchor="middle">C</text>
            </svg>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
              💡 Перетаскивай вершины <b>A, B, C</b> мышкой или пальцем
            </div>
          </div>

          {/* Metrics */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--surface-secondary)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 800 }}>Угол A (α)</div>
                <div style={{ fontSize: '17px', fontWeight: 900, marginTop: '2px' }}>{degA.toFixed(1)}°</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--surface-secondary)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 800 }}>Угол B (β)</div>
                <div style={{ fontSize: '17px', fontWeight: 900, marginTop: '2px' }}>{degB.toFixed(1)}°</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--surface-secondary)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 800 }}>Угол C (γ)</div>
                <div style={{ fontSize: '17px', fontWeight: 900, marginTop: '2px' }}>{degC.toFixed(1)}°</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--surface-secondary)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>Площадь (Герон)</div>
                <div style={{ fontSize: '19px', fontWeight: 900, color: 'var(--primary)' }}>S = {(area / 100).toFixed(1)}</div>
              </div>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--surface-secondary)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>Периметр</div>
                <div style={{ fontSize: '19px', fontWeight: 900 }}>P = {((sideA + sideB + sideC) / 10).toFixed(1)}</div>
              </div>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--surface-secondary)', fontSize: '13px' }}>
              <div style={{ fontWeight: 800, marginBottom: '6px', color: 'var(--accent-cyan)' }}>Теорема синусов (2R):</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
                <span>a / sin(A) = {(sideA / Math.sin(angleA) / 10).toFixed(1)}</span>
                <span>b / sin(B) = {(sideB / Math.sin(angleB) / 10).toFixed(1)}</span>
                <span>c / sin(C) = {(sideC / Math.sin(angleC) / 10).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MONTE CARLO */}
      {activeTab === 'montecarlo' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <canvas
              ref={mcCanvasRef}
              width={300}
              height={300}
              style={{
                borderRadius: '18px',
                background: '#0d1117',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button
                onClick={() => {
                  setIsSimulating(!isSimulating);
                  playClickSound();
                  if (!isSimulating && pointsTotal > 500) playSuccessSound();
                }}
                style={{
                  padding: '9px 20px',
                  borderRadius: '11px',
                  background: isSimulating ? 'var(--accent-rose)' : 'var(--primary-gradient)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {isSimulating ? '⏸ Пауза' : '▶ Запустить дождь'}
              </button>
              <button
                onClick={() => {
                  resetMonteCarlo();
                  playClickSound();
                }}
                style={{
                  padding: '9px 16px',
                  borderRadius: '11px',
                  background: 'var(--surface-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                ↺ Сброс
              </button>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700 }}>
                Приближение числа π = 4 · (N_внутри / N_всего):
              </div>
              <div style={{ fontSize: '42px', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.02em', margin: '4px 0' }}>
                {approxPi.toFixed(5)}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Истинное значение: <b>{Math.PI.toFixed(5)}</b> (погрешность: <b style={{ color: piError < 1 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{piError.toFixed(2)}%</b>)
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--surface-secondary)', borderLeft: '4px solid var(--accent-emerald)' }}>
                <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 800 }}>Точек внутри круга</div>
                <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '2px' }}>{pointsInside.toLocaleString()}</div>
              </div>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--surface-secondary)', borderLeft: '4px solid var(--text-muted)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800 }}>Всего сгенерировано</div>
                <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '2px' }}>{pointsTotal.toLocaleString()}</div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                <span>Скорость симуляции</span>
                <span>{speed * 60} точек/сек</span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                step={5}
                value={speed}
                onChange={(e) => setSpeed(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
