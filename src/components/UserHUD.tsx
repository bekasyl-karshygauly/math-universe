'use client';
import React from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { levelProgress, xpToLevel } from '../lib/supabase';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { fmt } from '../data/i18n-lab';

interface UserHUDProps {
  lang: Language;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export function UserHUD({ lang, onOpenAuth, onOpenProfile }: UserHUDProps) {
  const { user, profile, loading } = useAuth();
  const t = (k: string) => I18N[lang][k] || k;

  // Reserve the space while the session loads so the header does not jump
  if (loading) return <span className="user-hud user-hud--placeholder" aria-hidden="true" />;

  if (!user || !profile) {
    return (
      <button type="button" className="btn btn--secondary btn--sm user-login" onClick={onOpenAuth}>
        <LogIn size={16} aria-hidden="true" />
        <span>{t('a_login')}</span>
      </button>
    );
  }

  const lvl = xpToLevel(profile.xp);
  const pct = levelProgress(profile.xp);

  return (
    <button type="button" className="user-hud" onClick={onOpenProfile} aria-label={`${t('a_profile')}: ${profile.username}, ${fmt(t('dash_level_short'), { n: lvl })}`}>
      <span className="user-hud__avatar" aria-hidden="true">
        {profile.username?.[0]?.toUpperCase() || '?'}
      </span>
      <span className="user-hud__meta" aria-hidden="true">
        <span className="user-hud__name">{profile.username}</span>
        <span className="user-hud__stats mono">
          {fmt(t('dash_level_short'), { n: lvl })}
          {profile.streak > 0 && ` · ${fmt(t('dash_days'), { n: profile.streak })}`}
        </span>
        <span className="user-hud__track">
          <span className="user-hud__fill" style={{ width: `${pct}%` }} />
        </span>
      </span>
    </button>
  );
}
