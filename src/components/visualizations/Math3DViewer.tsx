'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type Math3DMode = 'vectors' | 'surface' | 'mobius';

interface Math3DViewerProps {
  initialMode?: Math3DMode;
  height?: number;
}

export function Math3DViewer({ initialMode = 'vectors', height = 440 }: Math3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Math3DMode>(initialMode);
  const [isRotating, setIsRotating] = useState(true);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);

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
    scene.background = new THREE.Color(0x0e121e);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(7, 6, 8);
    camera.lookAt(0, 0, 0);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x6366f1, 2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1.5);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Coordinate Grid
    try {
      const grid = new THREE.GridHelper(10, 10, 0x4f46e5, 0x1f293d);
      scene.add(grid);
    } catch (e) {
      // Fallback if grid fails
    }

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

    // Animation Loop with safe render
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (isRotatingRef.current && !isDragging && groupRef.current) {
        groupRef.current.rotation.y += 0.005;
      }
      try {
        renderer.render(scene, camera);
      } catch (err) {
        // Prevent crashing app on WebGL error
      }
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
      try {
        renderer.dispose();
      } catch (e) {}
    };
  }, [height]);

  // Rebuild 3D objects when mode changes (without recreating WebGL renderer)
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // Clear previous children
    while (group.children.length > 0) {
      const obj = group.children[0] as any;
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
        else obj.material.dispose();
      }
      group.remove(obj);
    }

    try {
      if (mode === 'vectors') {
        const dirA = new THREE.Vector3(2.5, 1.5, 0).normalize();
        const arrowA = new THREE.ArrowHelper(dirA, new THREE.Vector3(0, 0, 0), 3.2, 0x06b6d4, 0.5, 0.25);
        group.add(arrowA);

        const dirB = new THREE.Vector3(0.5, 1, 2.5).normalize();
        const arrowB = new THREE.ArrowHelper(dirB, new THREE.Vector3(0, 0, 0), 3.0, 0x8b5cf6, 0.5, 0.25);
        group.add(arrowB);

        const cross = new THREE.Vector3().crossVectors(dirA, dirB).normalize();
        const arrowC = new THREE.ArrowHelper(cross, new THREE.Vector3(0, 0, 0), 3.8, 0xf43f5e, 0.6, 0.3);
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
          color: 0x6366f1,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geom, mat);
        group.add(mesh);
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
          color: 0x4f46e5,
          wireframe: false,
          roughness: 0.25,
          metalness: 0.6,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geom, mat);
        group.add(mesh);

        const wireMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.25 });
        const wireMesh = new THREE.Mesh(geom, wireMat);
        group.add(wireMesh);
      } else if (mode === 'mobius') {
        const geom = new THREE.TorusKnotGeometry(2.2, 0.65, 100, 20);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xec4899,
          roughness: 0.15,
          metalness: 0.8,
        });
        const mesh = new THREE.Mesh(geom, mat);
        group.add(mesh);

        const wireMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.25 });
        const wire = new THREE.Mesh(geom, wireMat);
        group.add(wire);
      }
    } catch (e) {
      console.warn('Failed to build 3D mode objects:', e);
    }
  }, [mode]);

  return (
    <div
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: '#0e121e',
        position: 'relative',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Top Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setMode('vectors')}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              color: mode === 'vectors' ? '#fff' : '#94a3b8',
              background: mode === 'vectors' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
            }}
          >
            ➡️ Векторы a × b
          </button>
          <button
            onClick={() => setMode('surface')}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              color: mode === 'surface' ? '#fff' : '#94a3b8',
              background: mode === 'surface' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
            }}
          >
            🌐 3D-поверхность
          </button>
          <button
            onClick={() => setMode('mobius')}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              color: mode === 'mobius' ? '#fff' : '#94a3b8',
              background: mode === 'mobius' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
            }}
          >
            🌌 Торус / Мёбиус
          </button>
        </div>

        <button
          onClick={() => setIsRotating(!isRotating)}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
          }}
        >
          {isRotating ? '⏸ Пауза вращения' : '▶️ Автоповорот'}
        </button>
      </div>

      {/* WebGL Canvas Mount */}
      {hasWebGLError ? (
        <div style={{ height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          3D-графика временно недоступна в данном браузере
        </div>
      ) : (
        <div ref={mountRef} style={{ width: '100%', height: `${height}px`, cursor: 'grab' }} />
      )}

      {/* Legend & Instructions */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#94a3b8',
          background: 'rgba(14, 18, 30, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '6px 14px',
          borderRadius: '8px',
          pointerEvents: 'none',
        }}
      >
        <span>
          {mode === 'vectors' && '🔵 Вектор a | 🟣 Вектор b | 🔴 Векторное произведение a × b (перпендикуляр)'}
          {mode === 'surface' && 'Волновой рельеф z = sin(r) · e^(-0.15r) с линиями изопотенциалов'}
          {mode === 'mobius' && 'Топологический узел в R³ с зеркальным шейдером'}
        </span>
        <span style={{ opacity: 0.75 }}>Вращайте мышью или пальцем 🔄</span>
      </div>
    </div>
  );
}
