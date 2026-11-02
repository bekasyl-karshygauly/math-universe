'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { signIn, signUp } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  lang: 'ru' | 'en' | 'kz';
}

export function AuthModal({ onClose, lang }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const labels = {
    ru: { title_l: 'Войти', title_r: 'Регистрация', email: 'Email', pass: 'Пароль', name: 'Имя пользователя', btn_l: 'Войти', btn_r: 'Зарегистрироваться', switch_l: 'Нет аккаунта?', switch_r: 'Уже есть аккаунт?', link_l: 'Зарегистрироваться', link_r: 'Войти', confirm: 'Проверьте почту для подтверждения!' },
    en: { title_l: 'Sign In', title_r: 'Sign Up', email: 'Email', pass: 'Password', name: 'Username', btn_l: 'Sign In', btn_r: 'Create Account', switch_l: 'No account?', switch_r: 'Have an account?', link_l: 'Sign Up', link_r: 'Sign In', confirm: 'Check your email to confirm!' },
    kz: { title_l: 'Кіру', title_r: 'Тіркелу', email: 'Email', pass: 'Құпия сөз', name: 'Пайдаланушы аты', btn_l: 'Кіру', btn_r: 'Тіркелу', switch_l: 'Аккаунт жоқ па?', switch_r: 'Аккаунт бар ма?', link_l: 'Тіркелу', link_r: 'Кіру', confirm: 'Растау үшін поштаңызды тексеріңіз!' },
  };
  const L = labels[lang];

  const handle = async () => {
    setError(''); setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        onClose();
      } else {
        if (!username.trim()) { setError('Введите имя пользователя'); setLoading(false); return; }
        await signUp(email, password, username);
        setSuccess(L.confirm);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    }
    setLoading(false);
  };

  const inp = {
    width: '100%', padding: '13px 16px', borderRadius: '12px',
    border: '1px solid var(--border)', background: 'var(--surface-secondary)',
    color: 'var(--text-primary)', fontSize: '15px', outline: 'none',
    boxSizing: 'border-box' as const,
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
          style={{ background: 'var(--surface)', borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '420px', boxShadow: '0 30px 80px rgba(0,0,0,0.4)', border: '1px solid var(--border)' }}>

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>{mode === 'login' ? '🔐' : '🚀'}</div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px' }}>{mode === 'login' ? L.title_l : L.title_r}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Math Universe</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'register' && (
              <input style={inp} placeholder={L.name} value={username} onChange={(e) => setUsername(e.target.value)} />
            )}
            <input style={inp} type="email" placeholder={L.email} value={email} onChange={(e) => setEmail(e.target.value)} />
            <input style={inp} type="password" placeholder={L.pass} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handle()} />

            {error && <div style={{ color: '#ef4444', fontSize: '13px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: '10px' }}>{error}</div>}
            {success && <div style={{ color: '#10b981', fontSize: '13px', padding: '10px 14px', background: 'rgba(16,185,129,0.1)', borderRadius: '10px' }}>{success}</div>}

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handle} disabled={loading}
              style={{ padding: '14px', borderRadius: '12px', background: 'var(--primary-gradient)', color: '#fff', fontWeight: 800, fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? '...' : (mode === 'login' ? L.btn_l : L.btn_r)}
            </motion.button>

            <div style={{ textAlign: 'center', fontSize: '13.5px', color: 'var(--text-muted)' }}>
              {mode === 'login' ? L.switch_l : L.switch_r}{' '}
              <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
                style={{ color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '13.5px' }}>
                {mode === 'login' ? L.link_l : L.link_r}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}