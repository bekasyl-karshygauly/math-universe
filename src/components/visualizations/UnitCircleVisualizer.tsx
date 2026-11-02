'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Pause, Play } from 'lucide-react';
import { playClickSound } from '../../lib/sound';
import { prefersReducedMotion } from '../../lib/labPalette';
import { DUR, easeInOutCubic, tween } from '../../lib/motion';

interface UnitCircleVisualizerProps {
  initialAngleDeg?: number;
  onAngleChange?: (deg: number) => void;
}

const SPECIAL_ANGLES = [
  { deg: 0, rad: '0', sin: '0', cos: '1', tan: '0' },
  { deg: 30, rad: 'π/6', sin: '1/2', cos: '√3/2', tan: '√3/3' },
  { deg: 45, rad: 'π/4', sin: '√2/2', cos: '√2/2', tan: '1' },
  { deg: 60, rad: 'π/3', sin: '√3/2', cos: '1/2', tan: '√3' },
  { deg: 90, rad: 'π/2', sin: '1', cos: '0', tan: 'не сущ.' },
  { deg: 120, rad: '2π/3', sin: '√3/2', cos: '-1/2', tan: '-√3' },
  { deg: 135, rad: '3π/4', sin: '√2/2', cos: '-√2/2', tan: '-1' },
  { deg: 150, rad: '5π/6', sin: '1/2', cos: '-√3/2', tan: '-√3/3' },
  { deg: 180, rad: 'π', sin: '0', cos: '-1', tan: '0' },
  { deg: 210, rad: '7π/6', sin: '-1/2', cos: '-√3/2', tan: '√3/3' },
  { deg: 225, rad: '5π/4', sin: '-√2/2', cos: '-√2/2', tan: '1' },
  { deg: 240, rad: '4π/3', sin: '-√3/2', cos: '-1/2', tan: '√3' },
  { deg: 270, rad: '3π/2', sin: '-1', cos: '0', tan: 'не сущ.' },
  { deg: 300, rad: '5π/3', sin: '-√3/2', cos: '1/2', tan: '-√3' },
  { deg: 315, rad: '7π/4', sin: '-√2/2', cos: '√2/2', tan: '-1' },
  { deg: 330, rad: '11π/6', sin: '-1/2', cos: '√3/2', tan: '-√3/3' },
];

export function UnitCircleVisualizer({ initialAngleDeg = 45, onAngleChange }: UnitCircleVisualizerProps) {
  const [angle, setAngle] = useState<number>(initialAngleDeg);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef<boolean>(false);
  const animFrame = useRef<number | null>(null);

  const radius = 130;
  const cx = 170;
  const cy = 170;

  const rad = (angle * Math.PI) / 180;
  const cosVal = Math.cos(rad);
  const sinVal = Math.sin(rad);
  const tanVal = Math.abs(cosVal) < 1e-10 ? null : Math.tan(rad);

  const px = cx + radius * cosVal;
  const py = cy - radius * sinVal;

  const updateAngle = useCallback(
    (newAngle: number) => {
      const normalized = ((newAngle % 360) + 360) % 360;
      setAngle(Math.round(normalized * 10) / 10);
      if (onAngleChange) onAngleChange(normalized);
    },
    [onAngleChange]
  );

  // Auto rotation
  useEffect(() => {
    if (!isPlaying) {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
      return;
    }

    let lastTime = performance.now();
    const loop = (time: number) => {
      // Time-based speed; clamp the step after returning from a background tab
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      setAngle((prev) => {
        const next = (prev + dt * 45) % 360;
        if (onAngleChange) onAngleChange(next);
        return next;
      });
      animFrame.current = requestAnimationFrame(loop);
    };
    animFrame.current = requestAnimationFrame(loop);

    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [isPlaying, onAngleChange]);

  // Preset angles turn the radius along the shortest arc, so sin/cos visibly change with it
  const cancelTween = useRef<(() => void) | null>(null);
  const stopTween = () => {
    cancelTween.current?.();
    cancelTween.current = null;
  };
  useEffect(() => stopTween, []);

  const animateTo = (target: number) => {
    stopTween();
    setIsPlaying(false);
    if (prefersReducedMotion()) {
      updateAngle(target);
      return;
    }
    const from = angle;
    let delta = ((target - from + 540) % 360) - 180;
    if (delta === -180) delta = 180;
    cancelTween.current = tween(
      DUR.reveal + 0.04,
      (p) => updateAngle(from + delta * easeInOutCubic(p)),
      () => {
        cancelTween.current = null;
        updateAngle(target);
      }
    );
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    stopTween();
    isDragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    handlePointerMove(e);
    playClickSound();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    // The SVG scales with its container: convert screen pixels to viewBox units
    const scale = 340 / rect.width;
    const dx = (e.clientX - rect.left) * scale - cx;
    const dy = cy - (e.clientY - rect.top) * scale;
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    updateAngle(deg);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const quadrant = angle < 90 ? 'I' : angle < 180 ? 'II' : angle < 270 ? 'III' : 'IV';

  return (
    <div className="unit-circle">
      {/* SVG Canvas */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
        <svg
          ref={svgRef}
          viewBox="0 0 340 340"
          role="img"
          aria-label={`θ = ${Math.round(angle)}°, cos θ = ${cosVal.toFixed(3)}, sin θ = ${sinVal.toFixed(3)}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="plot-surface"
          style={{ width: '100%', maxWidth: '340px', height: 'auto', cursor: 'grab', touchAction: 'none' }}
        >
          {/* Grid Axes */}
          <line x1={20} y1={cy} x2={320} y2={cy} stroke="var(--plot-axis)" strokeWidth={1} />
          <line x1={cx} y1={20} x2={cx} y2={320} stroke="var(--plot-axis)" strokeWidth={1} />

          {/* Unit Circle */}
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--plot-axis)" strokeWidth={1.5} strokeDasharray="3 3" />

          {/* Special Angle Points */}
          {SPECIAL_ANGLES.map((sa) => {
            const aRad = (sa.deg * Math.PI) / 180;
            const sx = cx + radius * Math.cos(aRad);
            const sy = cy - radius * Math.sin(aRad);
            const isNear = Math.abs(angle - sa.deg) < 3;
            return (
              <circle
                key={sa.deg}
                cx={sx}
                cy={sy}
                r={isNear ? 5 : 3}
                fill={isNear ? 'var(--primary)' : 'var(--plot-axis)'}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  animateTo(sa.deg);
                  playClickSound();
                }}
              />
            );
          })}

          {/* Angle sector arc */}
          <path
            d={`M ${cx + 30} ${cy} A 30 30 0 ${angle > 180 ? 1 : 0} 0 ${cx + 30 * Math.cos(rad)} ${cy - 30 * Math.sin(rad)}`}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2}
          />

          {/* Right triangle fills */}
          <polygon
            points={`${cx},${cy} ${px},${cy} ${px},${py}`}
            fill="color-mix(in srgb, var(--chart-1) 12%, transparent)"
          />

          {/* Cosine vector (horizontal, blue/indigo) */}
          <line x1={cx} y1={cy} x2={px} y2={cy} stroke="var(--chart-3)" strokeWidth={3.5} strokeLinecap="round" />

          {/* Sine vector (vertical, rose/pink) */}
          <line x1={px} y1={cy} x2={px} y2={py} stroke="var(--chart-2)" strokeWidth={3.5} strokeLinecap="round" />

          {/* Hypotenuse (radius line) */}
          <line x1={cx} y1={cy} x2={px} y2={py} stroke="var(--text-primary)" strokeWidth={2} strokeDasharray="4 2" />

          {/* Draggable Point */}
          <circle
            cx={px}
            cy={py}
            r={10}
            fill="var(--primary)"
            stroke="var(--plot-bg)"
            strokeWidth={3}
          />

          {/* Labels */}
          <text x={298} y={cy - 8} fill="var(--plot-label)" fontSize={11}>x · cos</text>
          <text x={cx + 8} y={32} fill="var(--plot-label)" fontSize={11}>y · sin</text>
        </svg>

        {/* Controls below circle */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            className={isPlaying ? 'btn btn--secondary btn--sm' : 'btn btn--primary btn--sm'}
            aria-pressed={isPlaying}
            onClick={() => {
              stopTween();
              setIsPlaying(!isPlaying);
              playClickSound();
            }}
          >
            {isPlaying ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
            {isPlaying ? 'Стоп' : 'Вращение'}
          </button>
          {[0, 90, 180, 270].map((deg) => (
            <button
              key={deg}
              type="button"
              className="btn btn--secondary btn--sm mono"
              onClick={() => {
                animateTo(deg);
                playClickSound();
              }}
            >
              {deg}°
            </button>
          ))}
        </div>
      </div>

      {/* Info & Metrics */}
      <div style={{ minWidth: 0 }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px', gap: '12px' }}>
            <label htmlFor="unit-circle-angle" className="field-label">
              θ
            </label>
            <span className="mono" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)' }}>
              {Math.round(angle)}° <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>({rad.toFixed(3)} rad)</span>
            </span>
          </div>

          <input
            id="unit-circle-angle"
            type="range"
            min={0}
            max={360}
            step={1}
            value={Math.round(angle)}
            onChange={(e) => {
              stopTween();
              updateAngle(parseFloat(e.target.value));
            }}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        {/* Real-time values */}
        <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', marginBottom: '16px' }}>
          <div className="metric" style={{ boxShadow: 'inset 3px 0 0 var(--chart-3)' }}>
            <span className="metric__label">cos θ · x</span>
            <span className="metric__value">{cosVal.toFixed(4)}</span>
          </div>
          <div className="metric" style={{ boxShadow: 'inset 3px 0 0 var(--chart-2)' }}>
            <span className="metric__label">sin θ · y</span>
            <span className="metric__value">{sinVal.toFixed(4)}</span>
          </div>
          <div className="metric">
            <span className="metric__label">tan θ = sin/cos</span>
            <span className="metric__value">{tanVal !== null ? tanVal.toFixed(4) : '±∞ (разрыв)'}</span>
          </div>
          <div className="metric">
            <span className="metric__label">Квадрант</span>
            <span className="metric__value">{quadrant}</span>
          </div>
        </div>

        {/* Identity Check */}
        <p className="result-note" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <span>Основное тригонометрическое тождество</span>
          <span className="mono" style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
            sin² + cos² = {(sinVal * sinVal + cosVal * cosVal).toFixed(4)} ✓
          </span>
        </p>
      </div>
    </div>
  );
}
