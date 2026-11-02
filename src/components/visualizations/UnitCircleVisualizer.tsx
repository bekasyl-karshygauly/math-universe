'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { playClickSound } from '../../lib/sound';

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
      const dt = (time - lastTime) / 1000;
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

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    handlePointerMove(e);
    playClickSound();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = e.clientX - rect.left - cx;
    const dy = cy - (e.clientY - rect.top);
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    updateAngle(deg);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const quadrant = angle < 90 ? 'I' : angle < 180 ? 'II' : angle < 270 ? 'III' : 'IV';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'center' }}>
      {/* SVG Canvas */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg
          ref={svgRef}
          width={340}
          height={340}
          viewBox="0 0 340 340"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            cursor: 'grab',
            touchAction: 'none',
            background: 'var(--surface-secondary)',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <defs>
            <radialGradient id="circleGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glow */}
          <circle cx={cx} cy={cy} r={radius + 20} fill="url(#circleGlow)" />

          {/* Grid Axes */}
          <line x1={20} y1={cy} x2={320} y2={cy} stroke="var(--border)" strokeWidth={1.5} />
          <line x1={cx} y1={20} x2={cx} y2={320} stroke="var(--border)" strokeWidth={1.5} />

          {/* Unit Circle */}
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--text-muted)" strokeWidth={1.5} strokeDasharray="3 3" opacity={0.6} />

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
                r={isNear ? 5 : 2.5}
                fill={isNear ? 'var(--accent-cyan)' : 'var(--text-muted)'}
                opacity={isNear ? 1 : 0.4}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  updateAngle(sa.deg);
                  playClickSound();
                }}
              />
            );
          })}

          {/* Angle sector arc */}
          <path
            d={`M ${cx + 30} ${cy} A 30 30 0 ${angle > 180 ? 1 : 0} 0 ${cx + 30 * Math.cos(rad)} ${cy - 30 * Math.sin(rad)}`}
            fill="none"
            stroke="var(--accent-cyan)"
            strokeWidth={2}
            opacity={0.8}
          />

          {/* Right triangle fills */}
          <polygon
            points={`${cx},${cy} ${px},${cy} ${px},${py}`}
            fill="rgba(99, 102, 241, 0.12)"
          />

          {/* Cosine vector (horizontal, blue/indigo) */}
          <line x1={cx} y1={cy} x2={px} y2={cy} stroke="#3b82f6" strokeWidth={3.5} strokeLinecap="round" />

          {/* Sine vector (vertical, rose/pink) */}
          <line x1={px} y1={cy} x2={px} y2={py} stroke="#ec4899" strokeWidth={3.5} strokeLinecap="round" />

          {/* Hypotenuse (radius line) */}
          <line x1={cx} y1={cy} x2={px} y2={py} stroke="var(--text-primary)" strokeWidth={2} strokeDasharray="4 2" />

          {/* Draggable Point */}
          <circle
            cx={px}
            cy={py}
            r={10}
            fill="var(--primary)"
            stroke="#ffffff"
            strokeWidth={3}
            style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }}
          />

          {/* Labels */}
          <text x={315} y={cy - 8} fill="var(--text-muted)" fontSize={11} fontWeight={700}>X (cos)</text>
          <text x={cx + 8} y={32} fill="var(--text-muted)" fontSize={11} fontWeight={700}>Y (sin)</text>
        </svg>

        {/* Controls below circle */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '14px', alignItems: 'center' }}>
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              playClickSound();
            }}
            style={{
              padding: '7px 16px',
              borderRadius: '10px',
              background: isPlaying ? 'var(--accent-rose)' : 'var(--primary-gradient)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isPlaying ? '⏸ Стоп' : '▶ Вращение'}
          </button>
          <button
            onClick={() => {
              updateAngle(0);
              playClickSound();
            }}
            style={{
              padding: '7px 14px',
              borderRadius: '10px',
              background: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            0°
          </button>
          <button
            onClick={() => {
              updateAngle(90);
              playClickSound();
            }}
            style={{
              padding: '7px 14px',
              borderRadius: '10px',
              background: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            90°
          </button>
          <button
            onClick={() => {
              updateAngle(180);
              playClickSound();
            }}
            style={{
              padding: '7px 14px',
              borderRadius: '10px',
              background: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            180°
          </button>
        </div>
      </div>

      {/* Info & Metrics */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Угол θ:</span>
            <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary)' }}>
              {Math.round(angle)}° <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>({(rad).toFixed(3)} rad)</span>
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={Math.round(angle)}
            onChange={(e) => updateAngle(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
        </div>

        {/* Real-time Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--surface-secondary)', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 800 }}>cos(θ) [ось X]</div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{cosVal.toFixed(4)}</div>
          </div>
          <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--surface-secondary)', borderLeft: '4px solid #ec4899' }}>
            <div style={{ fontSize: '12px', color: '#ec4899', fontWeight: 800 }}>sin(θ) [ось Y]</div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{sinVal.toFixed(4)}</div>
          </div>
          <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--surface-secondary)', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 800 }}>tan(θ) = sin/cos</div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>
              {tanVal !== null ? tanVal.toFixed(4) : '±∞ (разрыв)'}
            </div>
          </div>
          <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--surface-secondary)', borderLeft: '4px solid var(--accent-cyan)' }}>
            <div style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 800 }}>Квадрант</div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{quadrant} четверть</div>
          </div>
        </div>

        {/* Identity Check */}
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--surface-secondary)', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Основное тригонометрическое тождество:</span>
          <span style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>
            sin² + cos² = {(sinVal * sinVal + cosVal * cosVal).toFixed(4)} ✓
          </span>
        </div>
      </div>
    </div>
  );
}
