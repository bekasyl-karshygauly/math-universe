'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { KaTeXMath } from '../KaTeXMath';
import { playDynamicSound, playSmoothSound, playVisualMorphSound, playSuccessSound } from '../../lib/sound';

interface VisualProofInteractiveProps {
  type: 'square_completion' | 'unit_circle' | 'secant_to_tangent' | 'parallelogram_area' | 'euler_spiral' | 'bayes_venn';
  lang: 'ru' | 'kz' | 'en';
}

export function VisualProofInteractive({ type, lang }: VisualProofInteractiveProps) {
  // 1. SQUARE COMPLETION STATE
  const [sqT, setSqT] = useState<number>(0.2); // 0 = separated, 1 = complete square
  const sqContainerRef = useRef<SVGSVGElement>(null);

  // 2. SECANT TO TANGENT STATE
  const [dx, setDx] = useState<number>(1.8);
  const secantSvgRef = useRef<SVGSVGElement>(null);

  // 3. PARALLELOGRAM STATE
  const [pAngle, setPAngle] = useState<number>(55); // angle between vectors
  const [pLenU, setPLenU] = useState<number>(140);
  const [pLenV, setPLenV] = useState<number>(110);

  // 4. EULER PHASOR STATE
  const [eulerAngle, setEulerAngle] = useState<number>(45);

  // 5. BAYES STATE
  const [probA, setProbA] = useState<number>(0.4);
  const [probBgivenA, setProbBgivenA] = useState<number>(0.8);
  const [probBgivenNotA, setProbBgivenNotA] = useState<number>(0.2);

  // Auto animation for square completion
  const animateSquareCompletion = () => {
    playSmoothSound();
    const obj = { val: sqT };
    gsap.to(obj, {
      val: sqT > 0.8 ? 0 : 1,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => setSqT(obj.val),
      onComplete: () => playSuccessSound(),
    });
  };

  // Auto animation for secant limit
  const animateSecantLimit = () => {
    playDynamicSound();
    const obj = { val: dx };
    gsap.to(obj, {
      val: dx < 0.2 ? 2.0 : 0.01,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => setDx(obj.val),
      onComplete: () => playSuccessSound(),
    });
  };

  // Auto animation for Euler rotation to pi
  const animateEulerToPi = () => {
    playSmoothSound();
    const obj = { val: eulerAngle };
    gsap.to(obj, {
      val: 180,
      duration: 2.0,
      ease: 'power2.inOut',
      onUpdate: () => setEulerAngle(obj.val),
      onComplete: () => playSuccessSound(),
    });
  };

  return (
    <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-secondary)', border: '1px solid var(--border)' }}>
      {/* ================= 1. SQUARE COMPLETION ================= */}
      {type === 'square_completion' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--primary)' }}>
              Геометрическая сборка полного квадрата (x + d)²
            </span>
            <button
              onClick={animateSquareCompletion}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-gradient)',
                color: 'var(--on-primary)',
                fontSize: '12.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'none',
              }}
            >
              {sqT > 0.8 ? 'Разобрать' : 'Собрать квадрат'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg ref={sqContainerRef} width={320} height={260} viewBox="0 0 320 260" style={{ background: 'var(--plot-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              {/* Main square x * x */}
              <rect x={40} y={40} width={130} height={130} fill="var(--chart-1)" rx={2} />
              <text x={105} y={110} fill="var(--plot-bg)" fontSize={16} fontWeight={700} textAnchor="middle">x²</text>

              {/* Top strip (width x, height d) */}
              <rect
                x={40}
                y={40 - 50 * sqT}
                width={130}
                height={50 * sqT}
                fill="var(--chart-3)"
                opacity={0.85}
                rx={3}
              />
              {sqT > 0.4 && (
                <text x={105} y={40 - 20 * sqT} fill="var(--plot-bg)" fontSize={12} fontWeight={700} textAnchor="middle">
                  x · (b/2a)
                </text>
              )}

              {/* Right strip (width d, height x) */}
              <rect
                x={40 + 130}
                y={40}
                width={50 * sqT}
                height={130}
                fill="var(--chart-3)"
                opacity={0.85}
                rx={3}
              />
              {sqT > 0.4 && (
                <text x={40 + 130 + 25 * sqT} y={110} fill="var(--plot-bg)" fontSize={11} fontWeight={700} textAnchor="middle">
                  (b/2a)·x
                </text>
              )}

              {/* Corner piece: (b/2a)^2 */}
              <rect
                x={40 + 130}
                y={40 - 50 * sqT}
                width={50 * sqT}
                height={50 * sqT}
                fill="var(--chart-4)"
                opacity={sqT}
                rx={3}
              />
              {sqT > 0.6 && (
                <text x={40 + 130 + 25 * sqT} y={40 - 20 * sqT} fill="var(--plot-bg)" fontSize={10} fontWeight={700} textAnchor="middle">
                  (b/2a)²
                </text>
              )}

              {/* Dimension markers */}
              <text x={105} y={195} fill="var(--text-muted)" fontSize={12} textAnchor="middle">Сторона x</text>
              <text x={220} y={195} fill="var(--chart-3)" fontSize={12} textAnchor="middle">+ (b / 2a)</text>
            </svg>

            {/* Slider */}
            <div style={{ width: '100%', maxWidth: '320px', marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                <span>Раздельные блоки</span>
                <span>Полный квадрат</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={sqT}
                onChange={(e) => {
                  setSqT(parseFloat(e.target.value));
                  playVisualMorphSound();
                }}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
            Добавление золотого уголка <b style={{ color: 'var(--chart-4)' }}>(b/2a)²</b> превращает прямоугольную фигуру в идеальный квадрат площади <b style={{ color: 'var(--primary)' }}>(x + b/2a)²</b>!
          </div>
        </div>
      )}

      {/* ================= 2. SECANT TO TANGENT ================= */}
      {type === 'secant_to_tangent' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--primary)' }}>
              Предельный переход секущей к касательной: Δx → 0
            </span>
            <button
              onClick={animateSecantLimit}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-gradient)',
                color: 'var(--on-primary)',
                fontSize: '12.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {dx < 0.1 ? 'Отдалить точку Q' : 'Стянуть Δx → 0'}
            </button>
          </div>

          {/* Canvas SVG */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {(() => {
              const x0 = 1.0;
              const f = (x: number) => 0.5 * x * x;
              const y0 = f(x0);
              const x1 = x0 + dx;
              const y1 = f(x1);
              const secantSlope = (y1 - y0) / dx;
              const tangentSlope = x0; // f'(x) = x for 0.5*x^2

              // Coordinate mapping
              const toSvgX = (x: number) => 50 + x * 75;
              const toSvgY = (y: number) => 210 - y * 65;

              return (
                <svg ref={secantSvgRef} width={340} height={240} viewBox="0 0 340 240" style={{ background: 'var(--plot-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  {/* Grid axes */}
                  <line x1={30} y1={210} x2={320} y2={210} stroke="var(--plot-axis)" strokeWidth={1} />
                  <line x1={50} y1={20} x2={50} y2={230} stroke="var(--plot-axis)" strokeWidth={1} />

                  {/* Curve f(x) = 0.5 * x^2 */}
                  <path
                    d={`M ${toSvgX(0)} ${toSvgY(f(0))} Q ${toSvgX(1.5)} ${toSvgY(0.5)} ${toSvgX(3.2)} ${toSvgY(f(3.2))}`}
                    fill="none"
                    stroke="var(--chart-5)"
                    strokeWidth={3}
                  />

                  {/* Secant line extending across */}
                  <line
                    x1={toSvgX(x0 - 0.8)}
                    y1={toSvgY(y0 - 0.8 * secantSlope)}
                    x2={toSvgX(x1 + 0.8)}
                    y2={toSvgY(y1 + 0.8 * secantSlope)}
                    stroke="var(--chart-3)"
                    strokeWidth={2}
                    strokeDasharray={dx < 0.05 ? 'none' : '4 3'}
                  />

                  {/* True tangent line (f'(1) = 1.0) */}
                  <line
                    x1={toSvgX(0)}
                    y1={toSvgY(y0 - x0 * tangentSlope)}
                    x2={toSvgX(3)}
                    y2={toSvgY(y0 + 2 * tangentSlope)}
                    stroke="var(--chart-6)"
                    strokeWidth={1.5}
                    opacity={0.4}
                  />

                  {/* Point P(x0, y0) */}
                  <circle cx={toSvgX(x0)} cy={toSvgY(y0)} r={6} fill="var(--chart-2)" stroke="var(--plot-bg)" strokeWidth={2} />
                  <text x={toSvgX(x0) - 16} y={toSvgY(y0) - 10} fill="var(--chart-2)" fontSize={11} fontWeight={700}>P</text>

                  {/* Point Q(x1, y1) */}
                  <circle cx={toSvgX(x1)} cy={toSvgY(y1)} r={6} fill="var(--chart-3)" stroke="var(--plot-bg)" strokeWidth={2} />
                  <text x={toSvgX(x1) + 8} y={toSvgY(y1) - 6} fill="var(--chart-3)" fontSize={11} fontWeight={700}>Q</text>
                </svg>
              );
            })()}

            {/* Slider */}
            <div style={{ width: '100%', maxWidth: '320px', marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                <span>Δx = {dx.toFixed(2)}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  Наклон секущей k = {(0.5 * ((1 + dx) ** 2 - 1) / dx).toFixed(3)} → 1.000 (f′)
                </span>
              </div>
              <input
                type="range"
                min={0.01}
                max={2.0}
                step={0.02}
                value={dx}
                onChange={(e) => {
                  setDx(parseFloat(e.target.value));
                  playVisualMorphSound();
                }}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. PARALLELOGRAM AREA ================= */}
      {type === 'parallelogram_area' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--primary)' }}>
              Определитель 2×2 как ориентированная площадь S = |u × v|
            </span>
          </div>

          {(() => {
            const rad = (pAngle * Math.PI) / 180;
            const uX = pLenU * Math.cos(0);
            const uY = pLenU * Math.sin(0);
            const vX = pLenV * Math.cos(rad);
            const vY = pLenV * Math.sin(rad);
            const areaVal = Math.abs(uX * vY - uY * vX) / 100;

            const ox = 40;
            const oy = 180;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg width={320} height={220} viewBox="0 0 320 220" style={{ background: 'var(--plot-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  {/* Parallelogram fill */}
                  <polygon
                    points={`${ox},${oy} ${ox + uX},${oy - uY} ${ox + uX + vX},${oy - (uY + vY)} ${ox + vX},${oy - vY}`}
                    fill="color-mix(in srgb, var(--chart-1) 22%, transparent)"
                    stroke="var(--primary)"
                    strokeWidth={2}
                  />

                  {/* Vector u (cyan) */}
                  <line x1={ox} y1={oy} x2={ox + uX} y2={oy - uY} stroke="var(--chart-3)" strokeWidth={3} strokeLinecap="round" />
                  <text x={ox + uX / 2} y={oy + 18} fill="var(--chart-3)" fontSize={12} fontWeight={700}>Вектор u</text>

                  {/* Vector v (rose) */}
                  <line x1={ox} y1={oy} x2={ox + vX} y2={oy - vY} stroke="var(--chart-2)" strokeWidth={3} strokeLinecap="round" />
                  <text x={ox + vX / 2 - 20} y={oy - vY / 2} fill="var(--chart-2)" fontSize={12} fontWeight={700}>Вектор v</text>
                </svg>

                <div style={{ width: '100%', maxWidth: '320px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>Угол между векторами: {pAngle}°</span>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>Площадь det = {areaVal.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={179}
                    value={pAngle}
                    onChange={(e) => {
                      setPAngle(+e.target.value);
                      playVisualMorphSound();
                    }}
                    style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ================= 4. EULER SPIRAL & COMPLEX PLANE ================= */}
      {(type === 'euler_spiral' || type === 'unit_circle') && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--primary)' }}>
              Фазор Эйлера e^(iθ) в комплексной плоскости C
            </span>
            <button
              onClick={animateEulerToPi}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary)',
                color: 'var(--on-primary)',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Вращение к π (e^iπ = -1)
            </button>
          </div>

          {(() => {
            const rad = (eulerAngle * Math.PI) / 180;
            const r = 90;
            const cx = 160;
            const cy = 110;
            const px = cx + r * Math.cos(rad);
            const py = cy - r * Math.sin(rad);

            return (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg width={320} height={220} viewBox="0 0 320 220" style={{ background: 'var(--plot-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  {/* Real & Imaginary Axes */}
                  <line x1={30} y1={cy} x2={290} y2={cy} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                  <line x1={cx} y1={15} x2={cx} y2={205} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                  <text x={275} y={cy - 6} fill="var(--text-muted)" fontSize={11}>Re</text>
                  <text x={cx + 6} y={26} fill="var(--text-muted)" fontSize={11}>Im</text>

                  {/* Unit circle */}
                  <circle cx={cx} cy={cy} r={r} fill="none" stroke="color-mix(in srgb, var(--chart-1) 30%, transparent)" strokeDasharray="3 3" />

                  {/* Cosine projection (Re) */}
                  <line x1={cx} y1={cy} x2={px} y2={cy} stroke="var(--chart-3)" strokeWidth={3} strokeLinecap="round" />

                  {/* Sine projection (Im) */}
                  <line x1={px} y1={cy} x2={px} y2={py} stroke="var(--chart-2)" strokeWidth={3} strokeLinecap="round" />

                  {/* Phasor arrow */}
                  <line x1={cx} y1={cy} x2={px} y2={py} stroke="var(--text-primary)" strokeWidth={2} />
                  <circle cx={px} cy={py} r={6} fill="var(--primary)" stroke="var(--plot-bg)" strokeWidth={2} />
                </svg>

                <div style={{ width: '100%', maxWidth: '320px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>θ = {Math.round(eulerAngle)}° ({rad.toFixed(2)} rad)</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      cos + i·sin = {Math.cos(rad).toFixed(2)} + {Math.sin(rad).toFixed(2)}i
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={Math.round(eulerAngle)}
                    onChange={(e) => {
                      setEulerAngle(+e.target.value);
                      playVisualMorphSound();
                    }}
                    style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ================= 5. BAYES VENN ================= */}
      {type === 'bayes_venn' && (
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px' }}>
            Вероятностные множества: апостериорная вероятность P(A|B)
          </div>

          {(() => {
            const pB = probA * probBgivenA + (1 - probA) * probBgivenNotA;
            const pAgivenB = pB > 0 ? (probBgivenA * probA) / pB : 0;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg width={320} height={180} viewBox="0 0 320 180" style={{ background: 'var(--plot-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  {/* Circle A */}
                  <circle cx={120} cy={90} r={65} fill="color-mix(in srgb, var(--chart-1) 30%, transparent)" stroke="var(--chart-1)" strokeWidth={2} />
                  <text x={90} y={90} fill="var(--text-primary)" fontSize={13} fontWeight={700}>A ({Math.round(probA * 100)}%)</text>

                  {/* Circle B */}
                  <circle cx={200} cy={90} r={65} fill="color-mix(in srgb, var(--chart-3) 30%, transparent)" stroke="var(--chart-3)" strokeWidth={2} />
                  <text x={220} y={90} fill="var(--text-primary)" fontSize={13} fontWeight={700}>B</text>

                  {/* Overlap */}
                  <text x={160} y={95} fill="var(--chart-4)" fontSize={11} fontWeight={700} textAnchor="middle">A ∩ B</text>
                </svg>

                <div style={{ width: '100%', maxWidth: '320px', marginTop: '14px', display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Априорная P(A): {Math.round(probA * 100)}%</span>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>P(A | B) = {Math.round(pAgivenB * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={0.95}
                    step={0.05}
                    value={probA}
                    onChange={(e) => {
                      setProbA(+e.target.value);
                      playVisualMorphSound();
                    }}
                    style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
