'use client';

import { useId, useState, type ReactNode } from 'react';
import { T, type GeometryVisualId } from '../../data/math1/types';
import type { Language } from '../../lib/storage';
import { Tex } from './shared';

type Point = [number, number];
const origin: Point = [0, 0];
const scale = 22;
const sx = (x: number) => 160 + x * scale;
const sy = (y: number) => 100 - y * scale;
const points = (...positions: Point[]) => positions.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ');
const ticks = Array.from({ length: 15 }, (_, i) => i - 7);
const primary = 'var(--chart-1)';
const secondary = 'var(--chart-2)';

function Grid({ children }: { children: ReactNode }) {
  const clip = useId();
  return (
    <svg className="plot-surface m1-geometry__plot" viewBox="0 0 320 200" aria-hidden="true">
      <defs><clipPath id={clip}><rect width="320" height="200" /></clipPath></defs>
      <g clipPath={`url(#${clip})`}>
        {ticks.map(n => (
          <g key={n} stroke={n === 0 ? 'var(--plot-axis)' : 'var(--plot-grid)'}>
            <line x1={sx(n)} x2={sx(n)} y1={0} y2={200} />
            <line x1={0} x2={320} y1={sy(n)} y2={sy(n)} />
          </g>
        ))}
        <text x="305" y="94">x</text>
        <text x="166" y="14">y</text>
        {children}
      </g>
    </svg>
  );
}

function Segment({ from, to, color = primary, dashed = false, arrow = false }: {
  from: Point; to: Point; color?: string; dashed?: boolean; arrow?: boolean;
}) {
  const id = useId();
  return (
    <g>
      {arrow && (
        <defs>
          <marker id={id} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0L8 4L0 8Z" fill={color} />
          </marker>
        </defs>
      )}
      <line x1={sx(from[0])} y1={sy(from[1])} x2={sx(to[0])} y2={sy(to[1])} stroke={color}
        strokeWidth={dashed ? 1.5 : 2.5} strokeDasharray={dashed ? '4 4' : undefined}
        markerEnd={arrow ? `url(#${id})` : undefined} />
    </g>
  );
}

function Dot({ point, label, color = primary }: { point: Point; label: string; color?: string }) {
  const [x, y] = point;
  return (
    <g>
      <circle cx={sx(x)} cy={sy(y)} r="3.5" fill={color} />
      <text x={sx(x) + 6} y={sy(y) - 7}>{label}</text>
    </g>
  );
}

function Range({ label, value, min, max, step = 1, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void;
}) {
  return (
    <label className="m1-geometry__range">
      <span>{label} <span className="mono">{value}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} aria-label={label} onChange={e => onChange(e.target.valueAsNumber)} />
    </label>
  );
}

const r = String.raw;
const rounded = (n: number) => String(Number(n.toFixed(2)));

function VectorCoordinates() {
  const [x, setX] = useState(3);
  const [y, setY] = useState(2);
  const a: Point = [-2, -1];
  const dx = x - a[0];
  const dy = y - a[1];
  return (
    <>
      <Grid>
        <Segment from={a} to={[x, a[1]]} color={secondary} dashed />
        <Segment from={[x, a[1]]} to={[x, y]} color={secondary} dashed />
        <Segment from={a} to={[x, y]} arrow />
        <Dot point={a} label={dx || dy ? 'A' : 'A = B'} />
        {(dx !== 0 || dy !== 0) && <Dot point={[x, y]} label="B" />}
      </Grid>
      <div className="m1-geometry__controls">
        <Range label="Bₓ" value={x} min={-5} max={5} onChange={setX} />
        <Range label="Bᵧ" value={y} min={-3} max={3} onChange={setY} />
      </div>
      <Tex tex={r`\overrightarrow{AB}=(${dx},${dy}),\quad |\overrightarrow{AB}|\approx ${rounded(Math.hypot(dx, dy))}`} />
    </>
  );
}

function VectorAngle({ lang }: { lang: Language }) {
  const [angle, setAngle] = useState(60);
  const rad = angle * Math.PI / 180;
  const b: Point = [2 * Math.cos(rad), 2 * Math.sin(rad)];
  return (
    <>
      <Grid>
        <polygon points={points(origin, [3, 0], [3 + b[0], b[1]], b)} fill={primary} fillOpacity=".14" />
        <Segment from={origin} to={[3, 0]} arrow />
        <Segment from={origin} to={b} color={secondary} arrow />
        <Dot point={[3, 0]} label="a" />
        <Dot point={b} label="b" color={secondary} />
      </Grid>
      <Range label={T('Векторлар арасындағы бұрыш, °', 'Угол между векторами, °', 'Angle between vectors, °')[lang]}
        value={angle} min={0} max={180} onChange={setAngle} />
      <Tex tex={r`\mathbf a\cdot\mathbf b\approx ${rounded(6 * Math.cos(rad))},\quad S\approx ${rounded(6 * Math.sin(rad))}`} />
    </>
  );
}

function LineDistance() {
  const [height, setHeight] = useState(3);
  const projection = (1 + height / 2) / 1.25;
  const foot: Point = [projection, projection / 2];
  return (
    <>
      <Grid>
        <Segment from={[-8, -4]} to={[8, 4]} />
        <Segment from={foot} to={[1, height]} color={secondary} dashed />
        <Dot point={foot} label="H" />
        <Dot point={[1, height]} label="P" color={secondary} />
      </Grid>
      <Range label="Pᵧ" value={height} min={-4} max={4} step={0.5} onChange={setHeight} />
      <Tex tex={r`y=\frac{x}{2},\quad d(P,\ell)=\frac{|2y_P-x_P|}{\sqrt5}\approx ${rounded(Math.abs(2 * height - 1) / Math.sqrt(5))}`} />
    </>
  );
}

function PlaneLine({ lang }: { lang: Language }) {
  const [rise, setRise] = useState(2);
  const angle = Math.atan2(Math.abs(rise), 2) * 180 / Math.PI;
  return (
    <>
      <svg className="plot-surface m1-geometry__plot" viewBox="0 0 320 200" aria-hidden="true">
        <polygon points={points([-5, -1], [4, -1], [6, 1], [-3, 1])} fill={primary} fillOpacity=".16" stroke={primary} />
        <text x="57" y="110">z = 0</text>
        <Segment from={[-3.4, -1.7 * rise]} to={[3.4, 1.7 * rise]} color={secondary} />
        <Segment from={origin} to={[2, 0]} dashed />
        <Segment from={origin} to={[2, rise]} color={secondary} arrow />
        <Dot point={origin} label="O" />
      </svg>
      <Range label={T('Бағыт векторының z координатасы', 'Координата z направляющего вектора', 'z component of the direction vector')[lang]}
        value={rise} min={-3} max={3} onChange={setRise} />
      <Tex tex={r`\mathbf d=(2,0,${rise}),\quad \theta\approx ${rounded(angle)}^\circ`} />
    </>
  );
}

const conicNames = {
  circle: T('Шеңбер', 'Окружность', 'Circle'),
  ellipse: T('Эллипс', 'Эллипс', 'Ellipse'),
  hyperbola: T('Гипербола', 'Гипербола', 'Hyperbola'),
  parabola: T('Парабола', 'Парабола', 'Parabola'),
};
type Conic = keyof typeof conicNames;
const samples = Array.from({ length: 81 }, (_, i) => (i - 40) / 10);

function Conics({ lang }: { lang: Language }) {
  const [shape, setShape] = useState<Conic>('ellipse');
  const [a, setA] = useState(3);
  const formula = {
    circle: r`x^2+y^2=${a}^2`,
    ellipse: r`\frac{x^2}{${a}^2}+y^2=1`,
    hyperbola: r`\frac{x^2}{${a}^2}-y^2=1`,
    parabola: r`y^2=4\cdot ${a}x`,
  };
  return (
    <>
      <div className="m1-geometry__controls">
        <label className="m1-geometry__range">
          <span>{T('Қисық түрі', 'Вид кривой', 'Curve type')[lang]}</span>
          <select className="input" value={shape} onChange={e => {
            const next = e.target.value as Conic;
            if (next === 'ellipse') setA(Math.max(a, 2));
            setShape(next);
          }}>
            {(Object.keys(conicNames) as Conic[]).map(key => <option key={key} value={key}>{conicNames[key][lang]}</option>)}
          </select>
        </label>
        <Range label={shape === 'parabola' ? 'p' : shape === 'circle' ? 'r' : 'a'} value={a}
          min={shape === 'ellipse' ? 2 : 1} max={4} onChange={setA} />
      </div>
      <Grid>
        {shape === 'circle' && <circle cx={sx(0)} cy={sy(0)} r={a * scale} fill="none" stroke={primary} strokeWidth="2.5" />}
        {shape === 'ellipse' && <ellipse cx={sx(0)} cy={sy(0)} rx={a * scale} ry={scale} fill="none" stroke={primary} strokeWidth="2.5" />}
        {shape === 'hyperbola' && (
          <>
            <Segment from={[-8, -8 / a]} to={[8, 8 / a]} color={secondary} dashed />
            <Segment from={[-8, 8 / a]} to={[8, -8 / a]} color={secondary} dashed />
            {[-1, 1].map(sign => (
              <polyline key={sign} points={points(...samples.map((y): Point => [sign * a * Math.hypot(1, y), y]))}
                fill="none" stroke={primary} strokeWidth="2.5" />
            ))}
          </>
        )}
        {shape === 'parabola' && (
          <polyline points={points(...samples.map((y): Point => [y * y / (4 * a), y]))}
            fill="none" stroke={primary} strokeWidth="2.5" />
        )}
      </Grid>
      <Tex tex={formula[shape]} />
    </>
  );
}

const descriptions = {
  'vector-coordinates': T('B нүктесін жылжытып, координаталар айырмасы мен вектор ұзындығын салыстырыңыз.', 'Перемещайте точку B и сравнивайте разности координат с длиной вектора.', 'Move B and compare the coordinate differences with the vector length.'),
  'vector-angle': T('Бұрышты өзгертіңіз. Скаляр көбейтінді қай кезде нөлге, ал аудан ең үлкен мәнге жетеді?', 'Меняйте угол. Когда скалярное произведение равно нулю и площадь максимальна?', 'Change the angle. When is the dot product zero and the area greatest?'),
  'line-distance': T('P нүктесін жылжытыңыз. Үзік кесінді түзудегі H нүктесіне түсірілген перпендикулярды көрсетеді.', 'Перемещайте точку P. Пунктир показывает перпендикуляр до точки H на прямой.', 'Move point P. The dashed segment shows the perpendicular to point H on the line.'),
  'plane-line': T('Сызбада түзу мен оның жазықтықтағы проекциясы берілген. Бағытты өзгертіп, көлбеу бұрышын бақылаңыз.', 'Схема показывает прямую и её проекцию на плоскость. Меняйте направление и следите за углом наклона.', 'The diagram shows the line and its projection onto the plane. Change its direction and watch the angle.'),
  conics: T('Қисықты таңдаңыз және параметрін өзгертіңіз. Гиперболаның асимптоталары үзік сызықпен берілген.', 'Выберите кривую и измените параметр. Пунктир показывает асимптоты гиперболы.', 'Choose a curve and adjust its parameter. Dashed lines show the hyperbola’s asymptotes.'),
};

export function GeometryLab({ id, lang }: { id: GeometryVisualId; lang: Language }) {
  return (
    <figure className="panel panel--instrument m1-visual m1-geometry">
      <figcaption>{descriptions[id][lang]}</figcaption>
      {id === 'vector-coordinates' && <VectorCoordinates />}
      {id === 'vector-angle' && <VectorAngle lang={lang} />}
      {id === 'line-distance' && <LineDistance />}
      {id === 'plane-line' && <PlaneLine lang={lang} />}
      {id === 'conics' && <Conics lang={lang} />}
    </figure>
  );
}
