'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Language } from '../../lib/storage';
import { I18N } from '../../data/i18n';
import { KaTeXMath } from '../KaTeXMath';
import { UnitCircleVisualizer } from '../visualizations/UnitCircleVisualizer';
import { LaTeXPlayground } from '../LaTeXPlayground';
import { playClickSound, playSuccessSound } from '../../lib/sound';
import { parseFunctionOrNaN } from '../../lib/mathExpr';

type TabType = 'quad' | 'matrix' | 'deriv' | 'stats' | 'comb' | 'trig' | 'log' | 'latex';

interface CalculatorsViewProps {
  lang: Language;
}

// GSAP Animated Result Box component
function ResultBox({
  children,
  resultKey,
  borderColor = 'var(--primary)',
}: {
  children: React.ReactNode;
  resultKey: any;
  borderColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && resultKey) {
      gsap.killTweensOf(ref.current);
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20, scale: 0.96, filter: 'blur(3px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.4, ease: 'back.out(1.5)' }
      );

      const items = ref.current.querySelectorAll('.calc-result-row');
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: 0.32, stagger: 0.05, ease: 'power2.out', delay: 0.06 }
        );
      }
    }
  }, [resultKey]);

  return (
    <div
      ref={ref}
      style={{
        marginTop: '22px',
        padding: '20px 24px',
        borderRadius: '16px',
        background: 'var(--surface-secondary)',
        border: '1px solid var(--border)',
        borderLeft: `5px solid ${borderColor}`,
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      }}
    >
      {children}
    </div>
  );
}

// GSAP Animated Action Button
function CalcButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (btnRef.current) {
      gsap.timeline()
        .to(btnRef.current, { scale: 0.92, duration: 0.08, ease: 'power2.in' })
        .to(btnRef.current, { scale: 1.05, duration: 0.16, ease: 'back.out(2.5)' })
        .to(btnRef.current, { scale: 1, duration: 0.1, ease: 'power1.out' });
    }
    playClickSound();
    onClick();
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      style={{
        padding: '12px 28px',
        borderRadius: '12px',
        background: 'var(--primary-gradient)',
        color: '#fff',
        fontWeight: 800,
        fontSize: '14px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(79, 70, 229, 0.35)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {children}
    </button>
  );
}

// Step-by-step accordion helper
function StepsToggle({
  isOpen,
  onToggle,
  children,
}: {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: '16px', borderTop: '1px dashed var(--border)', paddingTop: '14px' }}>
      <button
        onClick={() => {
          onToggle();
          playClickSound();
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          fontWeight: 800,
          fontSize: '13.5px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 0',
        }}
      >
        <span>{isOpen ? '▼' : '▶'}</span>
        <span>{isOpen ? 'Скрыть пошаговое решение' : '💡 Показать пошаговое решение'}</span>
      </button>

      {isOpen && (
        <div
          style={{
            marginTop: '12px',
            padding: '16px',
            borderRadius: '12px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'grid',
            gap: '10px',
            fontSize: '13.5px',
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function CalculatorsView({ lang }: CalculatorsViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('quad');
  const [showSteps, setShowSteps] = useState<Record<string, boolean>>({});
  const panelRef = useRef<HTMLDivElement>(null);

  const toggleSteps = (key: string) => {
    setShowSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Animate panel when tab changes with GSAP
  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 15, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: 'power2.out', clearProps: 'transform' }
      );
    }
  }, [activeTab]);

  // Quad inputs
  const [qa, setQa] = useState<number>(1);
  const [qb, setQb] = useState<number>(-5);
  const [qc, setQc] = useState<number>(6);
  const [quadResult, setQuadResult] = useState<any>(null);

  // Matrix inputs
  const [m11, setM11] = useState<number>(1);
  const [m12, setM12] = useState<number>(2);
  const [m21, setM21] = useState<number>(3);
  const [m22, setM22] = useState<number>(4);
  const [matrixResult, setMatrixResult] = useState<any>(null);

  // Deriv inputs
  const [dFunc, setDFunc] = useState<string>('x^2 + 3*x');
  const [dX0, setDX0] = useState<number>(2);
  const [derivResult, setDerivResult] = useState<any>(null);

  // Stats inputs
  const [sData, setSData] = useState<string>('2, 4, 4, 4, 5, 5, 7, 9');
  const [statsResult, setStatsResult] = useState<any>(null);

  // Comb inputs
  const [cN, setCN] = useState<number>(10);
  const [cK, setCK] = useState<number>(3);
  const [combResult, setCombResult] = useState<any>(null);

  // Trig inputs
  const [tAngle, setTAngle] = useState<number>(45);
  const [trigResult, setTrigResult] = useState<any>(null);

  // Log inputs
  const [lA, setLA] = useState<number>(2);
  const [lB, setLB] = useState<number>(8);
  const [logResult, setLogResult] = useState<any>(null);

  const t = (k: string) => I18N[lang][k] || k;

  // Quad Solver
  const solveQuad = () => {
    if (qa === 0) {
      setQuadResult({ error: 'a = 0 (это линейное уравнение, a не квадратное)' });
      return;
    }
    const D = qb * qb - 4 * qa * qc;
    if (D < 0) {
      const re = (-qb / (2 * qa)).toFixed(4);
      const im = (Math.sqrt(-D) / (2 * qa)).toFixed(4);
      setQuadResult({
        D: D.toFixed(4),
        type: 'complex',
        x1: `${re} + ${im}i`,
        x2: `${re} - ${im}i`,
        vertexX: (-qb / (2 * qa)).toFixed(4),
        vertexY: (-D / (4 * qa)).toFixed(4),
      });
    } else if (D === 0) {
      const x = (-qb / (2 * qa)).toFixed(4);
      setQuadResult({
        D: D.toFixed(4),
        type: 'single',
        x1: x,
        x2: x,
        vertexX: x,
        vertexY: '0.0000',
      });
    } else {
      const x1 = ((-qb + Math.sqrt(D)) / (2 * qa)).toFixed(4);
      const x2 = ((-qb - Math.sqrt(D)) / (2 * qa)).toFixed(4);
      setQuadResult({
        D: D.toFixed(4),
        type: 'real',
        x1,
        x2,
        vietaSum: (parseFloat(x1) + parseFloat(x2)).toFixed(4),
        vietaExpected: (-qb / qa).toFixed(4),
        vertexX: (-qb / (2 * qa)).toFixed(4),
        vertexY: (-D / (4 * qa)).toFixed(4),
      });
    }
    playSuccessSound();
  };

  // Matrix Solver
  const solveMatrix = () => {
    const det = m11 * m22 - m12 * m21;
    const tr = m11 + m22;
    if (det !== 0) {
      const inv11 = (m22 / det).toFixed(3);
      const inv12 = (-m12 / det).toFixed(3);
      const inv21 = (-m21 / det).toFixed(3);
      const inv22 = (m11 / det).toFixed(3);
      setMatrixResult({
        det,
        tr,
        hasInverse: true,
        inv: [
          [inv11, inv12],
          [inv21, inv22],
        ],
      });
    } else {
      setMatrixResult({ det, tr, hasInverse: false });
    }
    playSuccessSound();
  };

  // Deriv Solver
  const solveDeriv = () => {
    const f = parseFunctionOrNaN(dFunc);
    const h = 1e-6;
    const y0 = f(dX0);
    const fp = (f(dX0 + h) - f(dX0 - h)) / (2 * h);
    const fpp = (f(dX0 + h) - 2 * f(dX0) + f(dX0 - h)) / (h * h);

    if (isNaN(y0) || isNaN(fp)) {
      setDerivResult({ error: 'Ошибка в формуле функции' });
      return;
    }

    setDerivResult({
      y0: y0.toFixed(5),
      fp: fp.toFixed(5),
      fpp: fpp.toFixed(5),
      tangentEq: `y = ${fp.toFixed(3)}·(x - ${dX0}) + ${y0.toFixed(3)}`,
    });
    playSuccessSound();
  };

  // Stats Solver
  const solveStats = () => {
    const arr = sData
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((x) => !isNaN(x));

    if (!arr.length) {
      setStatsResult({ error: 'Введите числовые данные через запятую' });
      return;
    }

    const n = arr.length;
    const sorted = [...arr].sort((a, b) => a - b);
    const sum = arr.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

    setStatsResult({
      n,
      sum: sum.toFixed(3),
      mean: mean.toFixed(4),
      median,
      variance: variance.toFixed(4),
      stdDev: stdDev.toFixed(4),
      min: sorted[0],
      max: sorted[n - 1],
    });
    playSuccessSound();
  };

  // Fact helper
  function fact(n: number): number {
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }

  // Comb Solver
  const solveComb = () => {
    if (cN < 0 || cK < 0 || cK > cN) {
      setCombResult({ error: 'Убедитесь, что 0 ≤ k ≤ n' });
      return;
    }
    const nFact = fact(cN);
    const ank = fact(cN) / fact(cN - cK);
    const cnk = fact(cN) / (fact(cK) * fact(cN - cK));
    setCombResult({ nFact, ank, cnk });
    playSuccessSound();
  };

  // Trig Solver
  const solveTrig = () => {
    const rad = (tAngle * Math.PI) / 180;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const tanVal = Math.abs(c) < 1e-12 ? '∞' : Math.tan(rad).toFixed(5);
    setTrigResult({
      rad: rad.toFixed(4),
      sin: s.toFixed(5),
      cos: c.toFixed(5),
      tan: tanVal,
      pythagoras: (s * s + c * c).toFixed(6),
    });
    playSuccessSound();
  };

  // Log Solver
  const solveLog = () => {
    if (lA <= 0 || lA === 1 || lB <= 0) {
      setLogResult({ error: 'Основание a > 0, a ≠ 1 и аргумент b > 0' });
      return;
    }
    const res = Math.log(lB) / Math.log(lA);
    setLogResult({
      res: res.toFixed(5),
      lnA: Math.log(lA).toFixed(4),
      lnB: Math.log(lB).toFixed(4),
      checkPower: Math.pow(lA, res).toFixed(4),
    });
    playSuccessSound();
  };

  const handleTabChange = (id: TabType, e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.fromTo(e.currentTarget, { scale: 0.94 }, { scale: 1, duration: 0.22, ease: 'back.out(2)' });
    playClickSound();
    setActiveTab(id);
  };

  return (
    <div>
      {/* Tab Buttons */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px' }}>
        {[
          ['quad', 'c_quad', '📉'],
          ['matrix', 'c_matrix', '🔷'],
          ['deriv', 'c_deriv', '📈'],
          ['stats', 'c_stats', '📊'],
          ['comb', 'c_comb', '🎲'],
          ['trig', 'c_trig', '📐'],
          ['log', 'c_log', '🔢'],
          ['latex', 'c_latex', '⚡'],
        ].map(([id, key, icon]) => {
          const isActive = activeTab === id;
          const label = id === 'latex' ? 'Песочница LaTeX' : t(key);
          return (
            <button
              key={id}
              onClick={(e) => handleTabChange(id as TabType, e)}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '13.5px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                background: isActive ? 'var(--primary-gradient)' : 'var(--surface)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: isActive ? 'transparent' : 'var(--border)',
                boxShadow: isActive ? '0 4px 14px rgba(79, 70, 229, 0.35)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ marginRight: '6px' }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </div>

      {/* Panels with GSAP Transition */}
      <div
        ref={panelRef}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* QUAD */}
        {activeTab === 'quad' && (
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>
              <KaTeXMath math="ax^2 + bx + c = 0" />
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '18px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>a =</label>
                <input
                  type="number"
                  value={qa}
                  onChange={(e) => setQa(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>b =</label>
                <input
                  type="number"
                  value={qb}
                  onChange={(e) => setQb(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>c =</label>
                <input
                  type="number"
                  value={qc}
                  onChange={(e) => setQc(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }}
                />
              </div>
            </div>

            <CalcButton onClick={solveQuad}>
              ⚡ {t('c_solve')}
            </CalcButton>

            {quadResult && (
              <ResultBox resultKey={quadResult} borderColor="var(--primary)">
                {quadResult.error ? (
                  <div className="calc-result-row" style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>⚠️ {quadResult.error}</div>
                ) : (
                  <div style={{ display: 'grid', gap: '8px', fontSize: '14.5px' }}>
                    <div className="calc-result-row"><b>Дискриминант:</b> D = b² - 4ac = <b>{quadResult.D}</b></div>
                    {quadResult.type === 'real' && (
                      <>
                        <div className="calc-result-row"><b>Корень x₁:</b> <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{quadResult.x1}</span></div>
                        <div className="calc-result-row"><b>Корень x₂:</b> <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{quadResult.x2}</span></div>
                        <div className="calc-result-row"><b>Проверка Виета:</b> x₁ + x₂ = {quadResult.vietaSum} (ожидается -b/a = {quadResult.vietaExpected}) ✓</div>
                      </>
                    )}
                    {quadResult.type === 'single' && (
                      <div className="calc-result-row"><b>Единственный корень:</b> x = <b>{quadResult.x1}</b> (парабола касается оси X)</div>
                    )}
                    {quadResult.type === 'complex' && (
                      <>
                        <div className="calc-result-row"><b>Комплексный x₁:</b> <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>{quadResult.x1}</span></div>
                        <div className="calc-result-row"><b>Комплексный x₂:</b> <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>{quadResult.x2}</span></div>
                      </>
                    )}
                    <div className="calc-result-row" style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Вершина параболы: ({quadResult.vertexX}, {quadResult.vertexY})
                    </div>

                    {/* Step-by-step breakdown */}
                    <StepsToggle isOpen={!!showSteps['quad']} onToggle={() => toggleSteps('quad')}>
                      <div><b>Шаг 1 (Коэффициенты):</b> a = {qa}, b = {qb}, c = {qc}.</div>
                      <div>
                        <b>Шаг 2 (Дискриминант):</b>
                        <br />
                        D = ({qb})² - 4 · ({qa}) · ({qc}) = {qb * qb} - {4 * qa * qc} = <b>{quadResult.D}</b>.
                      </div>
                      <div>
                        <b>Шаг 3 (Анализ D):</b>
                        {parseFloat(quadResult.D) > 0 && ` Так как D > 0, уравнение имеет 2 различных действительных корня.`}
                        {parseFloat(quadResult.D) === 0 && ` Так как D = 0, уравнение имеет 1 корень кратности 2.`}
                        {parseFloat(quadResult.D) < 0 && ` Так как D < 0, действительных корней нет (2 сопряженных комплексных).`}
                      </div>
                      <div>
                        <b>Шаг 4 (Формула корней):</b>
                        <br />
                        x = (-({qb}) ± √{quadResult.D}) / (2 · {qa}) = ({-qb} ± {Math.sqrt(Math.max(0, parseFloat(quadResult.D))).toFixed(3)}) / {2 * qa}.
                      </div>
                    </StepsToggle>
                  </div>
                )}
              </ResultBox>
            )}
          </div>
        )}

        {/* MATRIX */}
        {activeTab === 'matrix' && (
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Матрица 2×2</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 80px)', gap: '10px', marginBottom: '18px' }}>
              <input type="number" value={m11} onChange={(e) => setM11(+e.target.value)} style={{ padding: '10px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }} />
              <input type="number" value={m12} onChange={(e) => setM12(+e.target.value)} style={{ padding: '10px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }} />
              <input type="number" value={m21} onChange={(e) => setM21(+e.target.value)} style={{ padding: '10px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }} />
              <input type="number" value={m22} onChange={(e) => setM22(+e.target.value)} style={{ padding: '10px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }} />
            </div>

            <CalcButton onClick={solveMatrix}>
              ⚡ {t('c_calc')}
            </CalcButton>

            {matrixResult && (
              <ResultBox resultKey={matrixResult} borderColor="var(--primary)">
                <div className="calc-result-row"><b>Определитель det A:</b> <b>{matrixResult.det}</b></div>
                <div className="calc-result-row"><b>След матрицы tr A:</b> <b>{matrixResult.tr}</b></div>
                {matrixResult.hasInverse ? (
                  <div className="calc-result-row" style={{ marginTop: '8px' }}>
                    <b>Обратная матрица A⁻¹:</b>
                    <div style={{ fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                      [[{matrixResult.inv[0][0]}, {matrixResult.inv[0][1]}], [{matrixResult.inv[1][0]}, {matrixResult.inv[1][1]}]]
                    </div>
                  </div>
                ) : (
                  <div className="calc-result-row" style={{ color: 'var(--accent-rose)', marginTop: '6px' }}>⚠️ det = 0 → матрица вырождена, обратной матрицы не существует!</div>
                )}

                <StepsToggle isOpen={!!showSteps['matrix']} onToggle={() => toggleSteps('matrix')}>
                  <div><b>Шаг 1 (Определитель):</b> det A = ({m11} · {m22}) - ({m12} · {m21}) = {m11 * m22} - {m12 * m21} = <b>{matrixResult.det}</b>.</div>
                  {matrixResult.hasInverse ? (
                    <div>
                      <b>Шаг 2 (Алгоритм обращения):</b>
                      <br />
                      Для матрицы 2×2 обратная находится по формуле:
                      <br />
                      A⁻¹ = (1 / det A) · [[a₂₂, -a₁₂], [-a₂₁, a₁₁]]
                      <br />
                      = (1 / {matrixResult.det}) · [[{m22}, {-m12}], [{-m21}, {m11}]].
                    </div>
                  ) : (
                    <div>Так как определитель равен 0, деление на ноль невозможно, обратной матрицы нет.</div>
                  )}
                </StepsToggle>
              </ResultBox>
            )}
          </div>
        )}

        {/* DERIV */}
        {activeTab === 'deriv' && (
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Численная производная f′(x₀)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>f(x) =</label>
                <input value={dFunc} onChange={(e) => setDFunc(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>x₀ =</label>
                <input type="number" value={dX0} onChange={(e) => setDX0(+e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }} />
              </div>
            </div>

            <CalcButton onClick={solveDeriv}>
              ⚡ {t('c_calc')}
            </CalcButton>

            {derivResult && (
              <ResultBox resultKey={derivResult} borderColor="var(--accent-cyan)">
                {derivResult.error ? (
                  <div className="calc-result-row" style={{ color: 'var(--accent-rose)' }}>{derivResult.error}</div>
                ) : (
                  <div style={{ display: 'grid', gap: '6px' }}>
                    <div className="calc-result-row">f({dX0}) = <b>{derivResult.y0}</b></div>
                    <div className="calc-result-row">f′({dX0}) ≈ <b style={{ color: 'var(--primary)' }}>{derivResult.fp}</b> (наклон касательной)</div>
                    <div className="calc-result-row">f″({dX0}) ≈ <b>{derivResult.fpp}</b> (кривизна)</div>
                    <div className="calc-result-row">Касательная: <b>{derivResult.tangentEq}</b></div>
                  </div>
                )}
              </ResultBox>
            )}
          </div>
        )}

        {/* STATS */}
        {activeTab === 'stats' && (
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Математическая статистика</h3>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Выборка чисел (через запятую):</label>
              <input value={sData} onChange={(e) => setSData(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }} />
            </div>

            <CalcButton onClick={solveStats}>
              ⚡ {t('c_analyze')}
            </CalcButton>

            {statsResult && (
              <ResultBox resultKey={statsResult} borderColor="var(--accent-emerald)">
                <div className="calc-result-row">Размер выборки: n = <b>{statsResult.n}</b> | Сумма = <b>{statsResult.sum}</b></div>
                <div className="calc-result-row">Среднее значение x̄: <b style={{ color: 'var(--primary)' }}>{statsResult.mean}</b></div>
                <div className="calc-result-row">Медиана: <b>{statsResult.median}</b></div>
                <div className="calc-result-row">Дисперсия D(X): <b>{statsResult.variance}</b></div>
                <div className="calc-result-row">Стандартное отклонение σ: <b style={{ color: 'var(--accent-cyan)' }}>{statsResult.stdDev}</b></div>
                <div className="calc-result-row" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Размах: [{statsResult.min} ... {statsResult.max}]</div>
              </ResultBox>
            )}
          </div>
        )}

        {/* COMB */}
        {activeTab === 'comb' && (
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Комбинаторика: n!, A(n, k), C(n, k)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>n =</label>
                <input type="number" value={cN} onChange={(e) => setCN(+e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>k =</label>
                <input type="number" value={cK} onChange={(e) => setCK(+e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }} />
              </div>
            </div>

            <CalcButton onClick={solveComb}>
              ⚡ {t('c_calc')}
            </CalcButton>

            {combResult && (
              <ResultBox resultKey={combResult} borderColor="var(--accent-purple)">
                {combResult.error ? (
                  <div className="calc-result-row" style={{ color: 'var(--accent-rose)' }}>{combResult.error}</div>
                ) : (
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div className="calc-result-row"><b>Факториал n! :</b> <b>{combResult.nFact}</b></div>
                    <div className="calc-result-row"><b>Размещения A(n, k) (порядок важен):</b> <b style={{ color: 'var(--primary)' }}>{combResult.ank}</b></div>
                    <div className="calc-result-row"><b>Сочетания C(n, k) (порядок не важен):</b> <b style={{ color: 'var(--accent-emerald)' }}>{combResult.cnk}</b></div>
                  </div>
                )}

                <StepsToggle isOpen={!!showSteps['comb']} onToggle={() => toggleSteps('comb')}>
                  <div><b>Формула факториала:</b> {cN}! = 1 · 2 · ... · {cN} = {combResult.nFact}</div>
                  <div><b>Формула A({cN}, {cK}):</b> {cN}! / ({cN} - {cK})! = {cN}! / {cN - cK}! = {combResult.ank}</div>
                  <div><b>Формула C({cN}, {cK}):</b> {cN}! / ({cK}! · ({cN} - {cK})!) = {combResult.cnk}</div>
                </StepsToggle>
              </ResultBox>
            )}
          </div>
        )}

        {/* TRIG + UNIT CIRCLE */}
        {activeTab === 'trig' && (
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Тригонометрия и Единичная Окружность</h3>
            
            <div style={{ marginBottom: '28px' }}>
              <UnitCircleVisualizer
                initialAngleDeg={tAngle}
                onAngleChange={(deg) => setTAngle(Math.round(deg))}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px' }}>Точный расчёт для угла (°):</h4>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                <input
                  type="number"
                  value={tAngle}
                  onChange={(e) => setTAngle(+e.target.value)}
                  style={{ width: '130px', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }}
                />
                <CalcButton onClick={solveTrig}>
                  ⚡ {t('c_calc')}
                </CalcButton>
              </div>

              {trigResult && (
                <ResultBox resultKey={trigResult} borderColor="var(--accent-cyan)">
                  <div className="calc-result-row">Угол в радианах: <b>{trigResult.rad} рад</b></div>
                  <div className="calc-result-row">sin({tAngle}°) = <b style={{ color: 'var(--primary)' }}>{trigResult.sin}</b></div>
                  <div className="calc-result-row">cos({tAngle}°) = <b style={{ color: 'var(--accent-cyan)' }}>{trigResult.cos}</b></div>
                  <div className="calc-result-row">tan({tAngle}°) = <b>{trigResult.tan}</b></div>
                  <div className="calc-result-row" style={{ color: 'var(--accent-emerald)', marginTop: '4px' }}>sin² + cos² = {trigResult.pythagoras} ✓</div>
                </ResultBox>
              )}
            </div>
          </div>
        )}

        {/* LOG */}
        {activeTab === 'log' && (
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Логарифм log_a(b)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Основание a =</label>
                <input type="number" value={lA} onChange={(e) => setLA(+e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Число b =</label>
                <input type="number" value={lB} onChange={(e) => setLB(+e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-secondary)' }} />
              </div>
            </div>

            <CalcButton onClick={solveLog}>
              ⚡ {t('c_calc')}
            </CalcButton>

            {logResult && (
              <ResultBox resultKey={logResult} borderColor="var(--primary)">
                {logResult.error ? (
                  <div className="calc-result-row" style={{ color: 'var(--accent-rose)' }}>{logResult.error}</div>
                ) : (
                  <div>
                    <div className="calc-result-row">log_{lA}({lB}) = ln({lB}) / ln({lA}) = {logResult.lnB} / {logResult.lnA}</div>
                    <div className="calc-result-row" style={{ fontSize: '18px', margin: '8px 0' }}>
                      = <b style={{ color: 'var(--primary)' }}>{logResult.res}</b>
                    </div>
                    <div className="calc-result-row" style={{ color: 'var(--accent-emerald)', fontSize: '13px' }}>
                      Проверка: {lA}^{logResult.res} ≈ {logResult.checkPower} ✓
                    </div>

                    <StepsToggle isOpen={!!showSteps['log']} onToggle={() => toggleSteps('log')}>
                      <div><b>Шаг 1 (Переход к новому основанию):</b> log_{lA}({lB}) = ln({lB}) / ln({lA}).</div>
                      <div><b>Шаг 2 (Значения натуральных логарифмов):</b> ln({lB}) ≈ {logResult.lnB}, ln({lA}) ≈ {logResult.lnA}.</div>
                      <div><b>Шаг 3 (Деление):</b> {logResult.lnB} / {logResult.lnA} ≈ <b>{logResult.res}</b>.</div>
                      <div><b>Шаг 4 (Проверка возведением в степень):</b> {lA}^({logResult.res}) = {logResult.checkPower} ≈ {lB} ✓.</div>
                    </StepsToggle>
                  </div>
                )}
              </ResultBox>
            )}
          </div>
        )}

        {/* LATEX PLAYGROUND */}
        {activeTab === 'latex' && (
          <LaTeXPlayground />
        )}
      </div>
    </div>
  );
}
