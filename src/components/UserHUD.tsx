'use client';
import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/auth-context';
import { levelProgress, xpToLevel } from '../lib/supabase';

interface UserHUDProps {
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export function UserHUD({ onOpenAuth, onOpenProfile }: UserHUDProps) {
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  if (!user || !profile) {
    return (
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
        onClick={onOpenAuth}
        style={{ padding: '8px 18px', borderRadius: '10px', background: 'var(--primary-gradient)', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', boxShadow: '0 3px 12px rgba(99,102,241,0.35)' }}>
        🔐 Войти
      </motion.button>
    );
  }

  const lvl = xpToLevel(profile.xp);
  const pct = levelProgress(profile.xp);

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={onOpenProfile}
      style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 12px', borderRadius: '14px', background: 'var(--surface-secondary)', border: '1px solid var(--border)' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '14px', flexShrink: 0 }}>
        {profile.username?.[0]?.toUpperCase() || '?'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, fontSize: '13px' }}>{profile.username}</span>
          <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lv.{lvl}</span>
          {profile.streak > 0 && (
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#f97316' }}>🔥{profile.streak}</span>
          )}
        </div>
        <div style={{ width: '90px', height: '4px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ height: '100%', background: 'var(--primary-gradient)', borderRadius: '4px' }} />
        </div>
      </div>
    </motion.div>
  );
}