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
      className="app-header"
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
        className="app-header-inner"
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
            <div className="hide-on-mobile" style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Interactive Educational Platform
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="app-header-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* AI Chat Button */}
          <button onClick={onOpenAIChat} title="AI-Математик"
            style={{ padding: '8px 14px', borderRadius: '10px', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 3px 12px rgba(124,58,237,0.35)' }}>
            🤖 <span className="hide-on-mobile">AI-чат</span>
          </button>
          {/* Step Solver Button */}
          <button onClick={onOpenSolver} title="Решатель уравнений"
            style={{ padding: '8px 14px', borderRadius: '10px', background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 3px 12px rgba(6,182,212,0.35)' }}>
            🧮 <span className="hide-on-mobile">Решатель</span>
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
