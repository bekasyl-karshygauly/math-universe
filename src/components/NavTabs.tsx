'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { playSmoothSound } from '../lib/sound';

export type NavPage = 'home' | 'courses' | 'math1' | 'calc' | 'plot' | 'quiz' | 'activity' | 'notes' | 'hacks' | 'bonus';

interface NavTabsProps {
  currentPage: NavPage;
  lang: Language;
  onSelectPage: (page: NavPage) => void;
}

const NAV_ITEMS: { id: NavPage; key: string }[] = [
  { id: 'home', key: 'nav_home' },
  { id: 'courses', key: 'nav_courses' },
  { id: 'math1', key: 'nav_math1' },
  { id: 'calc', key: 'nav_calc' },
  { id: 'plot', key: 'nav_plot' },
  { id: 'quiz', key: 'nav_quiz' },
  { id: 'activity', key: 'nav_activity' },
  { id: 'notes', key: 'nav_notes' },
  { id: 'hacks', key: 'nav_hacks' },
  { id: 'bonus', key: 'nav_bonus' },
];

/** Section navigation: logical screens of the single page, marked with aria-current. */
export function NavTabs({ currentPage, lang, onSelectPage }: NavTabsProps) {
  const t = (k: string) => I18N[lang][k] || k;

  return (
    <nav className="app-nav" aria-label={t('nav_label')}>
      <div className="container">
        <ul className="app-nav__list">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className="app-nav__link"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => {
                    playSmoothSound();
                    onSelectPage(item.id);
                  }}
                >
                  {t(item.key)}
                  {/* Shared layoutId: the underline slides from the previous section to the new one */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="app-nav__indicator"
                      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
