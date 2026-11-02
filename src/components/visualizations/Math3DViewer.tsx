'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Pause, Play } from 'lucide-react';
import { Language } from '../../lib/storage';
import { I18N } from '../../data/i18n';
import { getLabPalette, hexToNumber, prefersReducedMotion } from '../../lib/labPalette';
import { useThemeVersion } from '../../lib/useThemeVersion';

export type Math3DMode = 'vectors' | 'surface' | 'mobius';

interface Math3DViewerProps {
  initialMode?: Math3DMode;
  height?: number;
  lang?: Language;
}

const MODES: { id: Math3DMode; label: string }[] = [
  { id: 'vectors', label: 'Векторы a × b' },
  { id: 'surface', label: '3D-поверхность' },
  { id: 'mobius', label: 'Тор и узел' },
];

// Frees every geometry and material under an object (ArrowHelper keeps them in children)
function disposeTree(root: THREE.Object3D) {
  root.traverse((obj: any) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach((m: THREE.Material) => m.dispose());
      else obj.material.dispose();
    }
  });
}

export function Math3DViewer({ initialMode = 'vectors', height = 440, lang = 'ru' }: Math3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Math3DMode>(initialMode);
  // Auto-rotation is decorative motion: off when the user prefers reduced motion
  const [isRotating, setIsRotating] = useState(() => !prefersReducedMotion());
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const themeVersion = useThemeVersion();

  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const [sceneReady, setSceneReady] = useState(0);

  // Initialize WebGL Scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      // CRITICAL FIX: Disable shader validation checks.
      // On Windows / ANGLE drivers, gl.validateProgram returns false on LineBasicMaterial
      // before first draw, which triggers a false-positive Shader Error crash in Three.js.
      renderer.debug.checkShaderErrors = false;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      console.error('WebGL initialization failed:', e);
      setHasWebGLError(true);
      return;
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(7, 6, 8);
    camera.lookAt(0, 0, 0);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    // Neutral lighting so material colors stay true to the palette
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Object Group
    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    // Mouse & Touch Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !groupRef.current) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      groupRef.current.rotation.y += dx * 0.01;
      groupRef.current.rotation.x += dy * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !groupRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouseX;
      const dy = e.touches[0].clientY - prevMouseY;
      groupRef.current.rotation.y += dx * 0.01;
      groupRef.current.rotation.x += dy * 0.01;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // Render loop runs only while the canvas is on screen and the tab is visible
    let animId = 0;
    let onScreen = true;
    let lastTime = 0;
    const animate = (now: number = performance.now()) => {
      animId = 0;
      if (!onScreen || document.hidden) {
        lastTime = 0;
        return;
      }
      animId = requestAnimationFrame(animate);
      // Time-based motion: same speed at any frame rate; the first frame after a pause moves nothing
      const dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0;
      lastTime = now;
      const group = groupRef.current;
      if (group) {
        if (isRotatingRef.current && !isDragging) group.rotation.y += 0.3 * dt;
        // Short scale-in after a mode change (appear: 0 → 1 over ~0.35 s)
        const appear = group.userData.appear ?? 1;
        if (appear < 1) {
          const next = Math.min(1, appear + dt / 0.35);
          group.userData.appear = next;
          const s = 0.9 + 0.1 * (1 - Math.pow(1 - next, 3));
          group.scale.setScalar(s);
        }
      }
      try {
        renderer.render(scene, camera);
      } catch (err) {
        // Prevent crashing app on WebGL error
      }
    };
    const resume = () => {
      if (!animId && onScreen && !document.hidden) animate();
    };
    animate();

    const io = new IntersectionObserver((entries) => {
      onScreen = entries[0].isIntersecting;
      resume();
    });
    io.observe(container);
    document.addEventListener('visibilitychange', resume);

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      if (!w) return;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    });
    ro.observe(container);

    setSceneReady((v) => v + 1);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', resume);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
      disposeTree(scene);
      groupRef.current = null;
      gridRef.current = null;
      sceneRef.current = null;
      try {
        renderer.dispose();
      } catch (e) {}
    };
  }, [height]);

  // Theme: background and coordinate grid follow the laboratory palette
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const pal = getLabPalette();
    scene.background = new THREE.Color(pal.surface);
    if (gridRef.current) {
      scene.remove(gridRef.current);
      disposeTree(gridRef.current);
    }
    try {
      const grid = new THREE.GridHelper(10, 10, hexToNumber(pal.axis), hexToNumber(pal.grid));
      gridRef.current = grid;
      scene.add(grid);
    } catch (e) {
      // Fallback if grid fails
    }
  }, [sceneReady, themeVersion]);

  // Rebuild 3D objects when mode or theme changes (without recreating WebGL renderer)
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const [c1, c2, c3, , c5] = getLabPalette().series.map(hexToNumber);

    // Clear previous children
    while (group.children.length > 0) {
      const obj = group.children[0];
      disposeTree(obj);
      group.remove(obj);
    }
    // New model eases in; with reduced motion it appears at full size immediately
    group.userData.appear = prefersReducedMotion() ? 1 : 0;
    group.scale.setScalar(prefersReducedMotion() ? 1 : 0.9);

    try {
      if (mode === 'vectors') {
        const dirA = new THREE.Vector3(2.5, 1.5, 0).normalize();
        const arrowA = new THREE.ArrowHelper(dirA, new THREE.Vector3(0, 0, 0), 3.2, c3, 0.5, 0.25);
        group.add(arrowA);

        const dirB = new THREE.Vector3(0.5, 1, 2.5).normalize();
        const arrowB = new THREE.ArrowHelper(dirB, new THREE.Vector3(0, 0, 0), 3.0, c5, 0.5, 0.25);
        group.add(arrowB);

        const cross = new THREE.Vector3().crossVectors(dirA, dirB).normalize();
        const arrowC = new THREE.ArrowHelper(cross, new THREE.Vector3(0, 0, 0), 3.8, c2, 0.6, 0.3);
        group.add(arrowC);

        // Parallelogram surface
        const geom = new THREE.BufferGeometry();
        const v0 = new THREE.Vector3(0, 0, 0);
        const va = dirA.clone().multiplyScalar(3.2);
        const vb = dirB.clone().multiplyScalar(3.0);
        const vab = va.clone().add(vb);

        const vertices = new Float32Array([
          v0.x, v0.y, v0.z, va.x, va.y, va.z, vab.x, vab.y, vab.z,
          v0.x, v0.y, v0.z, vab.x, vab.y, vab.z, vb.x, vb.y, vb.z,
        ]);
        geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geom.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
          color: c1,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
        });
        group.add(new THREE.Mesh(geom, mat));
      } else if (mode === 'surface') {
        const size = 6;
        const segments = 50;
        const geom = new THREE.PlaneGeometry(size, size, segments, segments);
        geom.rotateX(-Math.PI / 2);

        const pos = geom.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const z = pos.getZ(i);
          const r = Math.sqrt(x * x + z * z);
          const y = Math.sin(r * 1.8) * 0.9 * Math.exp(-r * 0.15);
          pos.setY(i, y);
        }
        geom.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
          color: c1,
          roughness: 0.6,
          metalness: 0.1,
          side: THREE.DoubleSide,
        });
        group.add(new THREE.Mesh(geom, mat));

        // Separate geometry instance so disposal of one mesh never frees the other's buffers twice
        const wireMat = new THREE.MeshBasicMaterial({ color: c3, wireframe: true, transparent: true, opacity: 0.3 });
        group.add(new THREE.Mesh(geom.clone(), wireMat));
      } else if (mode === 'mobius') {
        const geom = new THREE.TorusKnotGeometry(2.2, 0.65, 100, 20);
        const mat = new THREE.MeshStandardMaterial({
          color: c2,
          roughness: 0.5,
          metalness: 0.15,
        });
        group.add(new THREE.Mesh(geom, mat));

        const wireMat = new THREE.MeshBasicMaterial({ color: c1, wireframe: true, transparent: true, opacity: 0.2 });
        group.add(new THREE.Mesh(geom.clone(), wireMat));
      }
    } catch (e) {
      console.warn('Failed to build 3D mode objects:', e);
    }
  }, [mode, sceneReady, themeVersion]);

  const legend =
    mode === 'vectors'
      ? [
          { color: 'var(--chart-3)', label: 'a' },
          { color: 'var(--chart-5)', label: 'b' },
          { color: 'var(--chart-2)', label: 'a × b ⟂ a, b' },
        ]
      : mode === 'surface'
        ? [{ color: 'var(--chart-1)', label: 'z = sin(1.8r) · 0.9 · e^(−0.15r)' }]
        : [{ color: 'var(--chart-2)', label: 'Torus knot (2, 3) ⊂ ℝ³' }];

  return (
    <div className="viewer-3d">
      <div className="viewer-3d__toolbar">
        <div className="seg-tabs" role="group" aria-label={I18N[lang]['plot_mode_3d']}>
          {MODES.map((m) => (
            <button key={m.id} type="button" className="seg-tab" aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn--secondary btn--sm" aria-pressed={isRotating} onClick={() => setIsRotating(!isRotating)}>
          {isRotating ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          {isRotating ? 'Пауза вращения' : 'Автоповорот'}
        </button>
      </div>

      {hasWebGLError ? (
        <p className="status status--warning" role="alert" style={{ minHeight: `${Math.min(height, 200)}px`, display: 'flex', alignItems: 'center' }}>
          {I18N[lang]['plot_webgl_error']}
        </p>
      ) : (
        <div
          ref={mountRef}
          className="plot-surface"
          role="img"
          aria-label={legend.map((l) => l.label).join('; ')}
          style={{ height: `${height}px`, cursor: 'grab', touchAction: 'none' }}
        />
      )}

      <div className="viewer-3d__legend legend">
        {legend.map((l) => (
          <span key={l.label}>
            <span className="legend__swatch" style={{ background: l.color }} aria-hidden="true" />
            {l.label}
          </span>
        ))}
        <span style={{ marginLeft: 'auto' }}>{I18N[lang]['drag_points']}</span>
      </div>
    </div>
  );
}
