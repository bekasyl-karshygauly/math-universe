'use client';

import React, { useEffect, useRef, useState } from 'react';

export type JSXGraphDemoType = 'derivative' | 'unit_circle' | 'parabola' | 'riemann';

interface JSXGraphBoardProps {
  type: JSXGraphDemoType;
  height?: number;
}

export function JSXGraphBoard({ type, height = 400 }: JSXGraphBoardProps) {
  const containerId = useRef(`jxgbox-${type}-${Math.random().toString(36).substring(2, 9)}`);
  const [isLoaded, setIsLoaded] = useState(false);
  const [boardInfo, setBoardInfo] = useState<string>('');
  const boardRef = useRef<any>(null);

  useEffect(() => {
    // 1. Ensure CSS is loaded
    if (!document.getElementById('jxg-css')) {
      const link = document.createElement('link');
      link.id = 'jxg-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/jsxgraph@1.10.0/distrib/jsxgraph.css';
      document.head.appendChild(link);
    }

    // 2. Ensure JS is loaded
    function initJSXGraph() {
      if ((window as any).JXG) {
        setIsLoaded(true);
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jsxgraph@1.10.0/distrib/jsxgraphcore.js';
        script.async = true;
        script.onload = () => setIsLoaded(true);
        document.body.appendChild(script);
      }
    }

    initJSXGraph();
  }, []);

  useEffect(() => {
    if (!isLoaded || !(window as any).JXG) return;
    const JXG = (window as any).JXG;

    // Destroy existing board if any
    if (boardRef.current) {
      try {
        JXG.JSXGraph.freeBoard(boardRef.current);
      } catch (e) {}
    }

    const box = document.getElementById(containerId.current);
    if (!box) return;

    if (type === 'derivative') {
      const board = JXG.JSXGraph.initBoard(containerId.current, {
        boundingbox: [-4, 4, 4, -4],
        axis: true,
        showCopyright: false,
        showNavigation: false,
      });
      boardRef.current = board;

      // Function f(x) = 0.25*x^3 - x
      const f = board.create('functiongraph', [(x: number) => 0.25 * Math.pow(x, 3) - x], {
        strokeColor: '#6366f1',
        strokeWidth: 3,
      });

      // Draggable point on curve
      const p = board.create('glider', [1.2, 0, f], {
        name: 'A',
        size: 5,
        color: '#f43f5e',
      });

      // Tangent line
      const t = board.create('tangent', [p], {
        strokeColor: '#06b6d4',
        strokeWidth: 2,
        dash: 2,
      });

      // Slope triangle
      board.create('slopetriangle', [t], {
        color: '#10b981',
      });

      function updateInfo() {
        const x = p.X();
        const y = p.Y();
        const slope = 0.75 * x * x - 1;
        setBoardInfo(`Точка A: x = ${x.toFixed(2)}, y = ${y.toFixed(2)} | Производная f'(x) = ${slope.toFixed(2)}`);
      }

      p.on('drag', updateInfo);
      updateInfo();

    } else if (type === 'unit_circle') {
      const board = JXG.JSXGraph.initBoard(containerId.current, {
        boundingbox: [-1.8, 1.8, 1.8, -1.8],
        axis: true,
        showCopyright: false,
        showNavigation: false,
      });
      boardRef.current = board;

      const origin = board.create('point', [0, 0], { fixed: true, visible: false });
      const circle = board.create('circle', [origin, 1], {
        strokeColor: '#94a3b8',
        strokeWidth: 2,
      });

      const p = board.create('glider', [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4), circle], {
        name: 'P',
        size: 5,
        color: '#8b5cf6',
      });

      // Segment from origin to point
      board.create('segment', [origin, p], { strokeColor: '#8b5cf6', strokeWidth: 2 });

      // Projections
      const pX = board.create('point', [() => p.X(), 0], { visible: false });
      const pY = board.create('point', [0, () => p.Y()], { visible: false });

      board.create('segment', [p, pX], { strokeColor: '#06b6d4', strokeWidth: 2, dash: 2 });
      board.create('segment', [p, pY], { strokeColor: '#10b981', strokeWidth: 2, dash: 2 });

      function updateInfo() {
        const x = p.X();
        const y = p.Y();
        let angleDeg = (Math.atan2(y, x) * 180) / Math.PI;
        if (angleDeg < 0) angleDeg += 360;
        setBoardInfo(`Угол α = ${angleDeg.toFixed(1)}° | cos α = ${x.toFixed(3)} | sin α = ${y.toFixed(3)} | sin² + cos² = ${(x * x + y * y).toFixed(3)}`);
      }

      p.on('drag', updateInfo);
      updateInfo();

    } else if (type === 'parabola') {
      const board = JXG.JSXGraph.initBoard(containerId.current, {
        boundingbox: [-5, 6, 5, -4],
        axis: true,
        showCopyright: false,
        showNavigation: false,
      });
      boardRef.current = board;

      // Draggable vertex
      const vertex = board.create('point', [1, -2], {
        name: 'Вершина (x₀, y₀)',
        size: 5,
        color: '#f59e0b',
      });

      // Slider for curvature a
      const aSlider = board.create('slider', [[-4, 4.5], [-1, 4.5], [0.2, 1, 3]], {
        name: 'a',
        snapWidth: 0.1,
      });

      // Parabola y = a*(x - x0)^2 + y0
      board.create('functiongraph', [(x: number) => aSlider.Value() * Math.pow(x - vertex.X(), 2) + vertex.Y()], {
        strokeColor: '#4f46e5',
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
        setBoardInfo(`Уравнение: ${a.toFixed(1)}x² + (${b.toFixed(1)})x + (${c.toFixed(1)}) = 0 | D = ${D.toFixed(2)} (${D > 0 ? '2 корня' : D === 0 ? '1 корень' : 'нет вещ. корней'})`);
      }

      vertex.on('drag', updateInfo);
      aSlider.on('drag', updateInfo);
      updateInfo();

    } else if (type === 'riemann') {
      const board = JXG.JSXGraph.initBoard(containerId.current, {
        boundingbox: [-0.5, 5, 4.5, -0.5],
        axis: true,
        showCopyright: false,
        showNavigation: false,
      });
      boardRef.current = board;

      const f = (x: number) => 0.25 * x * x + 0.5;
      board.create('functiongraph', [f, 0, 4], {
        strokeColor: '#3b82f6',
        strokeWidth: 3,
      });

      const nSlider = board.create('slider', [[0.5, 4.2], [3.5, 4.2], [2, 8, 30]], {
        name: 'Прямоугольники n',
        snapWidth: 1,
      });

      const riemann = board.create('riemannsum', [f, () => nSlider.Value(), 'middle', 0, 4], {
        fillColor: '#8b5cf6',
        fillOpacity: 0.35,
        strokeColor: '#7c3aed',
      });

      function updateInfo() {
        const n = Math.round(nSlider.Value());
        const sum = (riemann as any).Value ? (riemann as any).Value() : 0;
        // Exact integral from 0 to 4 of (0.25*x^2 + 0.5) is [0.25*x^3/3 + 0.5*x] = 16/3 + 2 = 7.333
        setBoardInfo(`Количество полос n = ${n} | Сумма Римана ≈ ${sum.toFixed(3)} | Точный интеграл = 7.333`);
      }

      nSlider.on('drag', updateInfo);
      updateInfo();
    }

    return () => {
      if (boardRef.current) {
        try {
          JXG.JSXGraph.freeBoard(boardRef.current);
        } catch (e) {}
      }
    };
  }, [isLoaded, type]);

  return (
    <div style={{ margin: '14px 0' }}>
      <div
        id={containerId.current}
        className="jxgbox"
        style={{
          width: '100%',
          height: `${height}px`,
          borderRadius: '14px',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          backgroundColor: 'var(--surface)',
        }}
      />
      {boardInfo && (
        <div
          style={{
            marginTop: '8px',
            padding: '8px 14px',
            fontSize: '13px',
            borderRadius: '8px',
            background: 'var(--surface-secondary)',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🎯</span>
          <span>{boardInfo}</span>
        </div>
      )}
    </div>
  );
}
