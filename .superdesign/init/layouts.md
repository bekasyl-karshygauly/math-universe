# Shared layouts
Next.js 16.4.2, React 19.3.0; Motion, GSAP and Lenis installed.

## src/app/layout.tsx
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Math Universe — Интерактивная образовательная платформа по математике",
  description: "Глубокое изучение математики от арифметики до университетского уровня: 3 уровня сложности, интерактивные 3D-модели, графики JSXGraph, пошаговые доказательства и вывод формул.",
  keywords: ["математика", "интерактивное обучение", "3D геометрия", "матанализ", "линейная алгебра", "формулы", "JSXGraph", "Three.js"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

```

## src/components/Header.tsx
```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Language, Theme } from '../lib/storage';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../lib/sound';
import { UserHUD } from './UserHUD';

function SoundButton() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isSoundEnabled());
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  return (
    <button
      onClick={toggle}
      title={enabled ? 'Выключить звук' : 'Включить звук'}
      style={{
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        background: 'var(--surface-secondary)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '16px',
        color: enabled ? 'var(--primary)' : 'var(--text-muted)',
        transition: 'transform 0.15s, border-color 0.15s',
      }}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}

interface HeaderProps {
  lang: Language;
  theme: Theme;
  onSetLang: (lang: Language) => void;
  onToggleTheme: () => void;
  onReset: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenAIChat: () => void;
  onOpenSolver: () => void;
}

export function Header({ lang, theme, onSetLang, onToggleTheme, onReset, onOpenAuth, onOpenProfile, onOpenAIChat, onOpenSolver }: HeaderProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        backgroundColor: 'var(--surface-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--surface-glass-border)',
        transition: 'background-color 0.25s, border-color 0.25s',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '22px',
              fontWeight: 900,
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
            }}
          >
            ∞
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Math Universe
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Interactive Educational Platform
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* AI Chat Button */}
          <button onClick={onOpenAIChat} title="AI-Математик"
            style={{ padding: '8px 14px', borderRadius: '10px', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 3px 12px rgba(124,58,237,0.35)' }}>
            🤖 <span>AI-чат</span>
          </button>
          {/* Step Solver Button */}
          <button onClick={onOpenSolver} title="Решатель уравнений"
            style={{ padding: '8px 14px', borderRadius: '10px', background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 3px 12px rgba(6,182,212,0.35)' }}>
            🧮 <span>Решатель</span>
          </button>
          {/* Sound Toggle */}
          <SoundButton />

          {/* Language Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'var(--surface-secondary)',
              borderRadius: '10px',
              padding: '3px',
              border: '1px solid var(--border)',
            }}
          >
            {(['ru', 'kz', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => onSetLang(l)}
                style={{
                  padding: '5px 11px',
                  borderRadius: '7px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: lang === l ? 'var(--primary-gradient)' : 'transparent',
                  color: lang === l ? '#fff' : 'var(--text-muted)',
                  boxShadow: lang === l ? '0 2px 8px rgba(79, 70, 229, 0.35)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title="Переключить тему"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'transform 0.15s, border-color 0.15s',
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Reset State */}
          <button
            onClick={onReset}
            title="Сбросить прогресс"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'transform 0.15s',
            }}
          >
            🗑️
          </button>
          {/* User HUD */}
          <UserHUD onOpenAuth={onOpenAuth} onOpenProfile={onOpenProfile} />
        </div>
      </div>
    </header>
  );
}

```

## src/components/NavTabs.tsx
```tsx
'use client';

import React from 'react';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { playSmoothSound } from '../lib/sound';

export type NavPage = 'home' | 'courses' | 'calc' | 'plot' | 'quiz' | 'notes' | 'hacks' | 'bonus';

interface NavTabsProps {
  currentPage: NavPage;
  lang: Language;
  onSelectPage: (page: NavPage) => void;
}

export function NavTabs({ currentPage, lang, onSelectPage }: NavTabsProps) {
  const t = (k: string) => I18N[lang][k] || k;

  const NAV_ITEMS: { id: NavPage; key: string; icon: string }[] = [
    { id: 'home', key: 'nav_home', icon: '🏠' },
    { id: 'courses', key: 'nav_courses', icon: '📚' },
    { id: 'calc', key: 'nav_calc', icon: '🧮' },
    { id: 'plot', key: 'nav_plot', icon: '📈' },
    { id: 'quiz', key: 'nav_quiz', icon: '🎯' },
    { id: 'notes', key: 'nav_notes', icon: '📝' },
    { id: 'hacks', key: 'nav_hacks', icon: '⚡' },
    { id: 'bonus', key: 'nav_bonus', icon: '🌌' },
  ];

  return (
    <nav
      style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        padding: '10px 24px',
        maxWidth: '1440px',
        margin: '0 auto',
        scrollbarWidth: 'none',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              playSmoothSound();
              onSelectPage(item.id);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13.5px',
              whiteSpace: 'nowrap',
              background: isActive ? 'var(--primary-gradient)' : 'transparent',
              color: isActive ? '#fff' : 'var(--text-muted)',
              border: '1px solid',
              borderColor: isActive ? 'transparent' : 'transparent',
              boxShadow: isActive ? '0 3px 12px rgba(99, 102, 241, 0.35)' : 'none',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{item.icon}</span>
            <span>{t(item.key)}</span>
          </button>
        );
      })}
    </nav>
  );
}

```

## src/components/LenisProvider.tsx
```tsx
'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

```
