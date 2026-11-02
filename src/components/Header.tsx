'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { Moon, Sun, Volume2, VolumeX, SlidersHorizontal, Trash2, Sigma, MessageSquareText } from 'lucide-react';
import { Language, Theme } from '../lib/storage';
import { I18N } from '../data/i18n';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../lib/sound';
import { UserHUD } from './UserHUD';

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
  onHome: () => void;
}

const LANGS: { id: Language; label: string }[] = [
  { id: 'ru', label: 'RU' },
  { id: 'kz', label: 'KZ' },
  { id: 'en', label: 'EN' },
];

function useSound() {
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
  return { enabled, toggle };
}

function LangSwitch({ lang, onSetLang, label }: { lang: Language; onSetLang: (l: Language) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="lang-switch">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          aria-pressed={lang === l.id}
          className="lang-switch__btn"
          onClick={() => onSetLang(l.id)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

export function Header({ lang, theme, onSetLang, onToggleTheme, onReset, onOpenAuth, onOpenProfile, onOpenAIChat, onOpenSolver, onHome }: HeaderProps) {
  const t = (k: string) => I18N[lang][k] || k;
  const sound = useSound();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const themeLabel = theme === 'dark' ? t('a_theme_light') : t('a_theme_dark');

  // Close the settings popover on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !toggleRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header className="app-header">
      <div className="container app-header__row">
        <button type="button" className="brand" onClick={onHome} aria-label="Math Universe">
          <span className="brand__mark" aria-hidden="true">
            m<span>u</span>
          </span>
          <span className="brand__name" aria-hidden="true">
            Math Universe
            <br />
            {t('brand_sub')}
          </span>
        </button>

        <div className="app-header__actions">
          <button type="button" className="header-action" onClick={onOpenSolver} title={t('a_solver_long')}>
            <Sigma size={18} aria-hidden="true" />
            <span className="header-action__label">{t('a_solver')}</span>
          </button>
          <button type="button" className="header-action" onClick={onOpenAIChat} title={t('a_chat_long')}>
            <MessageSquareText size={18} aria-hidden="true" />
            <span className="header-action__label">{t('a_chat')}</span>
          </button>

          <span className="app-header__divider desktop-only" aria-hidden="true" />

          <div className="desktop-only">
            <LangSwitch lang={lang} onSetLang={onSetLang} label={t('a_lang')} />
          </div>
          <button type="button" className="icon-btn desktop-only" onClick={onToggleTheme} aria-label={themeLabel} title={themeLabel}>
            {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>

          <div className="settings">
            <button
              ref={toggleRef}
              type="button"
              className="icon-btn"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={t('a_settings')}
              title={t('a_settings')}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <SlidersHorizontal size={18} aria-hidden="true" />
            </button>
            {menuOpen && (
              <div ref={menuRef} id={menuId} className="settings__panel reveal" role="group" aria-label={t('a_settings')}>
                <div className="settings__row">
                  <span className="settings__label">{t('a_lang')}</span>
                  <LangSwitch lang={lang} onSetLang={onSetLang} label={t('a_lang')} />
                </div>
                <div className="settings__row">
                  <span className="settings__label">{t('theme_label')}</span>
                  <button type="button" className="btn btn--secondary btn--sm" onClick={onToggleTheme}>
                    {theme === 'dark' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
                    {theme === 'dark' ? t('theme_dark') : t('theme_light')}
                  </button>
                </div>
                <div className="settings__row">
                  <span className="settings__label">{t('sound_label')}</span>
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    aria-pressed={sound.enabled}
                    onClick={sound.toggle}
                    title={sound.enabled ? t('a_sound_off') : t('a_sound_on')}
                  >
                    {sound.enabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
                    {sound.enabled ? t('on') : t('off')}
                  </button>
                </div>
                <div className="settings__danger">
                  <button
                    type="button"
                    className="btn btn--danger btn--sm btn--block"
                    onClick={() => {
                      setMenuOpen(false);
                      onReset();
                    }}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    {t('a_reset')}
                  </button>
                  <p className="field-help">{t('a_reset_hint')}</p>
                </div>
              </div>
            )}
          </div>

          <UserHUD lang={lang} onOpenAuth={onOpenAuth} onOpenProfile={onOpenProfile} />
        </div>
      </div>
    </header>
  );
}
