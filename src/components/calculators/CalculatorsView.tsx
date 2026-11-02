'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Language } from '../../lib/storage';
import { I18N } from '../../data/i18n';
import { KaTeXMath } from '../KaTeXMath';
import { UnitCircleVisualizer } from '../visualizations/UnitCircleVisualizer';
import { LaTeXPlayground } from '../LaTeXPlayground';
import { Field } from '../ui/Field';
import { SegmentedTabs } from '../ui/SegmentedTabs';
import { playClickSound, playSuccessSound } from '../../lib/sound';
import { parseFunctionOrNaN } from '../../lib/mathExpr';

type TabType = 'quad' | 'matrix' | 'deriv' | 'stats' | 'comb' | 'trig' | 'log' | 'latex';

interface CalculatorsViewProps {
  lang: Language;
}

// Result area: keyed by the result object so each new calculation re-runs the short reveal
function ResultBox({ children, resultKey, tone = 'default' }: { children: React.ReactNode; resultKey: any; tone?: 'default' | 'success' | 'danger' }) {
  const toneClass = tone === 'success' ? ' result-panel--success' : tone === 'danger' ? ' result-panel--danger' : '';
  return (
    <div key={JSON.stringify(resultKey)} className={`result-panel reveal${toneClass}`} role="status" aria-live="polite">
      {children}
    </div>
  );
}

function CalcButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="btn btn--primary"
      onClick={() => {
        playClickSound();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

// Step-by-step disclosure
function StepsToggle({ isOpen, onToggle, children, labels }: { isOpen: boolean; onToggle: () => void; children: React.ReactNode; labels: [string, string] }) {
  return (
    <div className="steps-toggle">
      <button
        type="button"
        className="btn btn--ghost btn--sm steps-toggle__btn"
        aria-expanded={isOpen}
        onClick={() => {
          onToggle();
          playClickSound();
        }}
      >
        <ChevronDown size={16} aria-hidden="true" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)' }} />
        {isOpen ? labels[1] : labels[0]}
      </button>
      {isOpen && <div className="steps-toggle__body reveal">{children}</div>}
    </div>
  );
}

export function CalculatorsView({ lang }: CalculatorsViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('quad');
  const [showSteps, setShowSteps] = useState<Record<string, boolean>>({});

  const toggleSteps = (key: string) => {
    setShowSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
  const stepLabels: [string, string] = [t('steps_show'), t('steps_hide')];

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

  const tabs: { id: TabType; label: string }[] = [
    { id: 'quad', label: t('c_quad') },
    { id: 'matrix', label: t('c_matrix') },
    { id: 'deriv', label: t('c_deriv') },
    { id: 'stats', label: t('c_stats') },
    { id: 'comb', label: t('c_comb') },
    { id: 'trig', label: t('c_trig') },
    { id: 'log', label: t('c_log') },
    { id: 'latex', label: t('calc_latex') },
  ];

  const errorRow = (msg: string) => <div className="result-row" style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>{msg}</div>;

  return (
    <div>
      <SegmentedTabs
        label={t('calc_tools_label')}
        items={tabs}
        value={activeTab}
        idPrefix="calc"
        scroll
        onChange={(id) => {
          playClickSound();
          setActiveTab(id);
        }}
      />

      <div key={activeTab} id="calc-panel" role="tabpanel" aria-labelledby={`calc-tab-${activeTab}`} className="panel panel--instrument calc-panel reveal">
        {/* QUAD */}
        {activeTab === 'quad' && (
          <div>
            <h2 className="calc-panel__title">
              <KaTeXMath math="ax^2 + bx + c = 0" />
            </h2>
            <div className="calc-fields calc-fields--3">
              <Field label="a =" type="number" mono value={qa} onChange={(e) => setQa(parseFloat(e.target.value) || 0)} />
              <Field label="b =" type="number" mono value={qb} onChange={(e) => setQb(parseFloat(e.target.value) || 0)} />
              <Field label="c =" type="number" mono value={qc} onChange={(e) => setQc(parseFloat(e.target.value) || 0)} />
            </div>

            <CalcButton onClick={solveQuad}>{t('c_solve')}</CalcButton>

            {quadResult && (
              <ResultBox resultKey={quadResult} tone={quadResult.error ? 'danger' : 'default'}>
                {quadResult.error ? (
                  errorRow(quadResult.error)
                ) : (
                  <div style={{ display: 'grid', gap: '8px', fontSize: '15px' }}>
                    <div className="result-row"><b>Дискриминант:</b> D = b² - 4ac = <b className="mono">{quadResult.D}</b></div>
                    {quadResult.type === 'real' && (
                      <>
                        <div className="result-row"><b>Корень x₁:</b> <span className="result-value">{quadResult.x1}</span></div>
                        <div className="result-row"><b>Корень x₂:</b> <span className="result-value">{quadResult.x2}</span></div>
                        <div className="result-row"><b>Проверка Виета:</b> x₁ + x₂ = {quadResult.vietaSum} (ожидается -b/a = {quadResult.vietaExpected}) ✓</div>
                      </>
                    )}
                    {quadResult.type === 'single' && (
                      <div className="result-row"><b>Единственный корень:</b> x = <span className="result-value">{quadResult.x1}</span> (парабола касается оси X)</div>
                    )}
                    {quadResult.type === 'complex' && (
                      <>
                        <div className="result-row"><b>Комплексный x₁:</b> <span className="result-value">{quadResult.x1}</span></div>
                        <div className="result-row"><b>Комплексный x₂:</b> <span className="result-value">{quadResult.x2}</span></div>
                      </>
                    )}
                    <div className="result-row result-note">
                      Вершина параболы: ({quadResult.vertexX}, {quadResult.vertexY})
                    </div>

                    <StepsToggle labels={stepLabels} isOpen={!!showSteps['quad']} onToggle={() => toggleSteps('quad')}>
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
            <h2 className="calc-panel__title">{t('c_matrix')}</h2>
            <div className="matrix-input" role="group" aria-label="A">
              <span className="matrix-input__bracket" aria-hidden="true">[</span>
              <div className="matrix-input__grid">
                <input aria-label="a₁₁" className="field-input field-input--mono" type="number" value={m11} onChange={(e) => setM11(+e.target.value)} />
                <input aria-label="a₁₂" className="field-input field-input--mono" type="number" value={m12} onChange={(e) => setM12(+e.target.value)} />
                <input aria-label="a₂₁" className="field-input field-input--mono" type="number" value={m21} onChange={(e) => setM21(+e.target.value)} />
                <input aria-label="a₂₂" className="field-input field-input--mono" type="number" value={m22} onChange={(e) => setM22(+e.target.value)} />
              </div>
              <span className="matrix-input__bracket" aria-hidden="true">]</span>
            </div>

            <CalcButton onClick={solveMatrix}>{t('c_calc')}</CalcButton>

            {matrixResult && (
              <ResultBox resultKey={matrixResult} tone={matrixResult.hasInverse ? 'default' : 'danger'}>
                <div className="result-row"><b>Определитель det A:</b> <span className="result-value">{matrixResult.det}</span></div>
                <div className="result-row"><b>След матрицы tr A:</b> <span className="result-value">{matrixResult.tr}</span></div>
                {matrixResult.hasInverse ? (
                  <div className="result-row" style={{ marginTop: '10px' }}>
                    <b>Обратная матрица A⁻¹:</b>
                    <table className="matrix-table mono">
                      <tbody>
                        {matrixResult.inv.map((row: string[], i: number) => (
                          <tr key={i}>
                            {row.map((v, j) => (
                              <td key={j}>{v}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="result-row" style={{ color: 'var(--accent-rose)', marginTop: '6px' }}>det = 0 → матрица вырождена, обратной матрицы не существует!</div>
                )}

                <StepsToggle labels={stepLabels} isOpen={!!showSteps['matrix']} onToggle={() => toggleSteps('matrix')}>
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
            <h2 className="calc-panel__title">Численная производная f′(x₀)</h2>
            <div className="calc-fields calc-fields--wide">
              <Field label={t('c_func')} mono value={dFunc} onChange={(e) => setDFunc(e.target.value)} help="sin(x), ln(x), sqrt(x), e^x, 2x^2" spellCheck={false} autoComplete="off" />
              <Field label="x₀ =" type="number" mono value={dX0} onChange={(e) => setDX0(+e.target.value)} />
            </div>

            <CalcButton onClick={solveDeriv}>{t('c_calc')}</CalcButton>

            {derivResult && (
              <ResultBox resultKey={derivResult} tone={derivResult.error ? 'danger' : 'default'}>
                {derivResult.error ? (
                  errorRow(derivResult.error)
                ) : (
                  <div className="metric-grid">
                    <div className="metric"><span className="metric__label">f({dX0})</span><span className="metric__value">{derivResult.y0}</span></div>
                    <div className="metric"><span className="metric__label">f′({dX0}) · наклон касательной</span><span className="metric__value" style={{ color: 'var(--primary)' }}>{derivResult.fp}</span></div>
                    <div className="metric"><span className="metric__label">f″({dX0}) · кривизна</span><span className="metric__value">{derivResult.fpp}</span></div>
                    <div className="metric" style={{ gridColumn: '1 / -1' }}><span className="metric__label">Касательная</span><span className="metric__value">{derivResult.tangentEq}</span></div>
                  </div>
                )}
              </ResultBox>
            )}
          </div>
        )}

        {/* STATS */}
        {activeTab === 'stats' && (
          <div>
            <h2 className="calc-panel__title">Математическая статистика</h2>
            <div className="calc-fields">
              <Field label="Выборка чисел (через запятую)" mono value={sData} onChange={(e) => setSData(e.target.value)} />
            </div>

            <CalcButton onClick={solveStats}>{t('c_analyze')}</CalcButton>

            {statsResult && (
              <ResultBox resultKey={statsResult} tone={statsResult.error ? 'danger' : 'success'}>
                {statsResult.error ? (
                  errorRow(statsResult.error)
                ) : (
                  <div className="metric-grid">
                    <div className="metric"><span className="metric__label">n</span><span className="metric__value">{statsResult.n}</span></div>
                    <div className="metric"><span className="metric__label">Сумма</span><span className="metric__value">{statsResult.sum}</span></div>
                    <div className="metric"><span className="metric__label">Среднее x̄</span><span className="metric__value" style={{ color: 'var(--primary)' }}>{statsResult.mean}</span></div>
                    <div className="metric"><span className="metric__label">Медиана</span><span className="metric__value">{statsResult.median}</span></div>
                    <div className="metric"><span className="metric__label">Дисперсия D(X)</span><span className="metric__value">{statsResult.variance}</span></div>
                    <div className="metric"><span className="metric__label">Ст. отклонение σ</span><span className="metric__value">{statsResult.stdDev}</span></div>
                    <div className="metric"><span className="metric__label">Размах</span><span className="metric__value">[{statsResult.min} … {statsResult.max}]</span></div>
                  </div>
                )}
              </ResultBox>
            )}
          </div>
        )}

        {/* COMB */}
        {activeTab === 'comb' && (
          <div>
            <h2 className="calc-panel__title">Комбинаторика: n!, A(n, k), C(n, k)</h2>
            <div className="calc-fields calc-fields--2">
              <Field label={t('c_n')} type="number" mono value={cN} onChange={(e) => setCN(+e.target.value)} />
              <Field label={t('c_k')} type="number" mono value={cK} onChange={(e) => setCK(+e.target.value)} />
            </div>

            <CalcButton onClick={solveComb}>{t('c_calc')}</CalcButton>

            {combResult && (
              <ResultBox resultKey={combResult} tone={combResult.error ? 'danger' : 'default'}>
                {combResult.error ? (
                  errorRow(combResult.error)
                ) : (
                  <div className="metric-grid">
                    <div className="metric"><span className="metric__label">Факториал n!</span><span className="metric__value">{combResult.nFact}</span></div>
                    <div className="metric"><span className="metric__label">A(n, k) · порядок важен</span><span className="metric__value" style={{ color: 'var(--primary)' }}>{combResult.ank}</span></div>
                    <div className="metric"><span className="metric__label">C(n, k) · порядок не важен</span><span className="metric__value">{combResult.cnk}</span></div>
                  </div>
                )}

                <StepsToggle labels={stepLabels} isOpen={!!showSteps['comb']} onToggle={() => toggleSteps('comb')}>
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
            <h2 className="calc-panel__title">Тригонометрия и единичная окружность</h2>

            <div style={{ marginBottom: '28px' }}>
              <UnitCircleVisualizer initialAngleDeg={tAngle} onAngleChange={(deg) => setTAngle(Math.round(deg))} />
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <div className="inline-form" style={{ alignItems: 'flex-end', maxWidth: '420px' }}>
                <Field label={t('c_angle')} type="number" mono value={tAngle} onChange={(e) => setTAngle(+e.target.value)} />
                <CalcButton onClick={solveTrig}>{t('c_calc')}</CalcButton>
              </div>

              {trigResult && (
                <ResultBox resultKey={trigResult}>
                  <div className="metric-grid">
                    <div className="metric"><span className="metric__label">Радианы</span><span className="metric__value">{trigResult.rad}</span></div>
                    <div className="metric"><span className="metric__label">sin({tAngle}°)</span><span className="metric__value" style={{ color: 'var(--chart-2)' }}>{trigResult.sin}</span></div>
                    <div className="metric"><span className="metric__label">cos({tAngle}°)</span><span className="metric__value" style={{ color: 'var(--chart-3)' }}>{trigResult.cos}</span></div>
                    <div className="metric"><span className="metric__label">tan({tAngle}°)</span><span className="metric__value">{trigResult.tan}</span></div>
                  </div>
                  <div className="result-row result-note" style={{ color: 'var(--accent-emerald)', marginTop: '10px' }}>sin² + cos² = {trigResult.pythagoras} ✓</div>
                </ResultBox>
              )}
            </div>
          </div>
        )}

        {/* LOG */}
        {activeTab === 'log' && (
          <div>
            <h2 className="calc-panel__title">Логарифм log_a(b)</h2>
            <div className="calc-fields calc-fields--2">
              <Field label={t('c_base')} type="number" mono value={lA} onChange={(e) => setLA(+e.target.value)} />
              <Field label={t('c_num')} type="number" mono value={lB} onChange={(e) => setLB(+e.target.value)} />
            </div>

            <CalcButton onClick={solveLog}>{t('c_calc')}</CalcButton>

            {logResult && (
              <ResultBox resultKey={logResult} tone={logResult.error ? 'danger' : 'default'}>
                {logResult.error ? (
                  errorRow(logResult.error)
                ) : (
                  <div>
                    <div className="result-row mono">log_{lA}({lB}) = ln({lB}) / ln({lA}) = {logResult.lnB} / {logResult.lnA}</div>
                    <div className="result-row" style={{ fontSize: '22px', margin: '8px 0' }}>
                      = <span className="result-value">{logResult.res}</span>
                    </div>
                    <div className="result-row result-note" style={{ color: 'var(--accent-emerald)' }}>
                      Проверка: {lA}^{logResult.res} ≈ {logResult.checkPower} ✓
                    </div>

                    <StepsToggle labels={stepLabels} isOpen={!!showSteps['log']} onToggle={() => toggleSteps('log')}>
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
        {activeTab === 'latex' && <LaTeXPlayground />}
      </div>
    </div>
  );
}
