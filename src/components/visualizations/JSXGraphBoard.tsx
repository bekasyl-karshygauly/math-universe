'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../../lib/storage';
import { I18N } from '../../data/i18n';
import { getLabPalette } from '../../lib/labPalette';
import { useThemeVersion } from '../../lib/useThemeVersion';

export type JSXGraphDemoType = 'derivative' | 'unit_circle' | 'parabola' | 'riemann';

interface JSXGraphBoardProps {
  type: JSXGraphDemoType;
  height?: number;
  lang?: Language;
}

const JXG_VERSION = '1.10.0';

export function JSXGraphBoard({ type, height = 400, lang = 'ru' }: JSXGraphBoardProps) {
  const containerId = useRef(`jxgbox-${type}-${Math.random().toString(36).substring(2, 9)}`);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [boardInfo, setBoardInfo] = useState<string>('');
  const boardRef = useRef<any>(null);
  const themeVersion = useThemeVersion();

  useEffect(() => {
    // 1. Ensure CSS is loaded
    if (!document.getElementById('jxg-css')) {
      const link = document.createElement('link');
      link.id = 'jxg-css';
      link.rel = 'stylesheet';
      link.href = `https://cdn.jsdelivr.net/npm/jsxgraph@${JXG_VERSION}/distrib/jsxgraph.css`;
      document.head.appendChild(link);
    }

    // 2. Ensure JS is loaded (shared script tag across boards)
    if ((window as any).JXG) {
      setStatus('ready');
      return;
    }
    let script = document.getElementById('jxg-js') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'jxg-js';
      script.src = `https://cdn.jsdelivr.net/npm/jsxgraph@${JXG_VERSION}/distrib/jsxgraphcore.js`;
      script.async = true;
      document.body.appendChild(script);
    }
    const onLoad = () => setStatus('ready');
    const onError = () => {
      script?.remove();
      setStatus('error');
    };
    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);
    return () => {
      script?.removeEventListener('load', onLoad);
      script?.removeEventListener('error', onError);
    };
  }, []);

  useEffect(() => {
    if (status !== 'ready' || !(window as any).JXG) return;
    const JXG = (window as any).JXG;
    const pal = getLabPalette();
    const [c1, c2, c3, c4] = pal.series;

    // Destroy existing board if any
    if (boardRef.current) {
      try {
        JXG.JSXGraph.freeBoard(boardRef.current);
      } catch (e) {}
    }

    const box = document.getElementById(containerId.current);
    if (!box) return;

    const axisStyle = {
      strokeColor: pal.axis,
      highlightStrokeColor: pal.axis,
      ticks: { strokeColor: pal.grid, label: { strokeColor: pal.label, fontSize: 11 } },
    };
    const init = (boundingbox: number[]) =>
      JXG.JSXGraph.initBoard(containerId.current, {
        boundingbox,
        axis: true,
        showCopyright: false,
        showNavigation: false,
        defaultAxes: { x: axisStyle, y: axisStyle },
      });
    const labelText = { strokeColor: pal.ink };

    if (type === 'derivative') {
      const board = init([-4, 4, 4, -4]);
      boardRef.current = board;

      // Function f(x) = 0.25*x^3 - x
      const f = board.create('functiongraph', [(x: number) => 0.25 * Math.pow(x, 3) - x], {
        strokeColor: c1,
        strokeWidth: 3,
      });

      // Draggable point on curve
      const p = board.create('glider', [1.2, 0, f], {
        name: 'A',
        size: 5,
        color: c2,
        label: labelText,
      });

      // Tangent line
      const t = board.create('tangent', [p], {
        strokeColor: c3,
        strokeWidth: 2,
        dash: 2,
      });

      // Slope triangle
      board.create('slopetriangle', [t], {
        color: c4,
      });

      function updateInfo() {
        const x = p.X();
        const y = p.Y();
        const slope = 0.75 * x * x - 1;
        setBoardInfo(`A: x = ${x.toFixed(2)}, y = ${y.toFixed(2)} · f′(x) = ${slope.toFixed(2)}`);
      }

      p.on('drag', updateInfo);
      updateInfo();
    } else if (type === 'unit_circle') {
      const board = init([-1.8, 1.8, 1.8, -1.8]);
      boardRef.current = board;

      const origin = board.create('point', [0, 0], { fixed: true, visible: false });
      const circle = board.create('circle', [origin, 1], {
        strokeColor: pal.axis,
        strokeWidth: 2,
      });

      const p = board.create('glider', [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4), circle], {
        name: 'P',
        size: 5,
        color: c1,
        label: labelText,
      });

      // Segment from origin to point
      board.create('segment', [origin, p], { strokeColor: c1, strokeWidth: 2 });

      // Projections
      const pX = board.create('point', [() => p.X(), 0], { visible: false });
      const pY = board.create('point', [0, () => p.Y()], { visible: false });

      board.create('segment', [p, pX], { strokeColor: c2, strokeWidth: 2, dash: 2 });
      board.create('segment', [p, pY], { strokeColor: c3, strokeWidth: 2, dash: 2 });

      function updateInfo() {
        const x = p.X();
        const y = p.Y();
        let angleDeg = (Math.atan2(y, x) * 180) / Math.PI;
        if (angleDeg < 0) angleDeg += 360;
        setBoardInfo(`α = ${angleDeg.toFixed(1)}° · cos α = ${x.toFixed(3)} · sin α = ${y.toFixed(3)} · sin²α + cos²α = ${(x * x + y * y).toFixed(3)}`);
      }

      p.on('drag', updateInfo);
      updateInfo();
    } else if (type === 'parabola') {
      const board = init([-5, 6, 5, -4]);
      boardRef.current = board;

      // Draggable vertex
      const vertex = board.create('point', [1, -2], {
        name: '(x₀, y₀)',
        size: 5,
        color: c2,
        label: labelText,
      });

      // Slider for curvature a
      const aSlider = board.create('slider', [[-4, 4.5], [-1, 4.5], [0.2, 1, 3]], {
        name: 'a',
        snapWidth: 0.1,
        label: labelText,
        baseline: { strokeColor: pal.axis },
        highline: { strokeColor: c1 },
        fillColor: c1,
        strokeColor: c1,
      });

      // Parabola y = a*(x - x0)^2 + y0
      board.create('functiongraph', [(x: number) => aSlider.Value() * Math.pow(x - vertex.X(), 2) + vertex.Y()], {
        strokeColor: c1,
        strokeWidth: 3,
      });

      function updateInfo() {
        const a = aSlider.Value();
        const x0 = vertex.X();
        const y0 = vertex.Y();
        // y = a*x^2 - 2*a*x0*x + a*x0^2 + y0
        const b = -2 * a * x0;
        const c = a * x0 * x0 + y0;
        const D = b * b - 4 * a * c;
        setBoardInfo(`${a.toFixed(1)}x² + (${b.toFixed(1)})x + (${c.toFixed(1)}) = 0 · D = ${D.toFixed(2)} (${D > 0 ? '2' : D === 0 ? '1' : '0'})`);
      }

      vertex.on('drag', updateInfo);
      aSlider.on('drag', updateInfo);
      updateInfo();
    } else if (type === 'riemann') {
      const board = init([-0.5, 5, 4.5, -0.5]);
      boardRef.current = board;

      const f = (x: number) => 0.25 * x * x + 0.5;
      board.create('functiongraph', [f, 0, 4], {
        strokeColor: c1,
        strokeWidth: 3,
      });

      const nSlider = board.create('slider', [[0.5, 4.2], [3.5, 4.2], [2, 8, 30]], {
        name: 'n',
        snapWidth: 1,
        label: labelText,
        baseline: { strokeColor: pal.axis },
        highline: { strokeColor: c1 },
        fillColor: c1,
        strokeColor: c1,
      });

      const riemann = board.create('riemannsum', [f, () => nSlider.Value(), 'middle', 0, 4], {
        fillColor: c3,
        fillOpacity: 0.25,
        strokeColor: c3,
      });

      function updateInfo() {
        const n = Math.round(nSlider.Value());
        const sum = (riemann as any).Value ? (riemann as any).Value() : 0;
        // Exact integral from 0 to 4 of (0.25*x^2 + 0.5) is [0.25*x^3/3 + 0.5*x] = 16/3 + 2 = 7.333
        setBoardInfo(`n = ${n} · Σ ≈ ${sum.toFixed(3)} · ∫₀⁴ f(x) dx = 7.333`);
      }

      nSlider.on('drag', updateInfo);
      updateInfo();
    }

    return () => {
      if (boardRef.current) {
        try {
          JXG.JSXGraph.freeBoard(boardRef.current);
        } catch (e) {}
        boardRef.current = null;
      }
    };
  }, [status, type, themeVersion]);

  return (
    <div className="jxg-wrap">
      {status === 'error' ? (
        <p className="status status--warning" role="alert">
          {I18N[lang]['plot_jsx_error']}
        </p>
      ) : (
        <div
          id={containerId.current}
          className="jxgbox jxg-board"
          style={{ height: `${height}px` }}
          aria-busy={status === 'loading'}
        />
      )}
      {boardInfo && status === 'ready' && (
        <p className="plot-readout mono" aria-live="polite">
          {boardInfo}
        </p>
      )}
    </div>
  );
}
