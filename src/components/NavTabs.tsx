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
