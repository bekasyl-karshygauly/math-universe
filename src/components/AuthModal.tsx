'use client';
import React, { useState } from 'react';
import { signIn, signUp } from '../lib/supabase';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { Dialog } from './ui/Dialog';
import { Field } from './ui/Field';
import { Button } from './ui/Button';

interface AuthModalProps {
  onClose: () => void;
  lang: Language;
}

export function AuthModal({ onClose, lang }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const t = (k: string) => I18N[lang][k] || k;

  const labels = {
    ru: { email: 'Email', pass: 'Пароль', name: 'Имя пользователя', btn_l: 'Войти', btn_r: 'Зарегистрироваться', switch_l: 'Нет аккаунта?', switch_r: 'Уже есть аккаунт?', link_l: 'Зарегистрироваться', link_r: 'Войти', confirm: 'Проверьте почту для подтверждения!' },
    en: { email: 'Email', pass: 'Password', name: 'Username', btn_l: 'Sign In', btn_r: 'Create Account', switch_l: 'No account?', switch_r: 'Have an account?', link_l: 'Sign Up', link_r: 'Sign In', confirm: 'Check your email to confirm!' },
    kz: { email: 'Email', pass: 'Құпия сөз', name: 'Пайдаланушы аты', btn_l: 'Кіру', btn_r: 'Тіркелу', switch_l: 'Аккаунт жоқ па?', switch_r: 'Аккаунт бар ма?', link_l: 'Тіркелу', link_r: 'Кіру', confirm: 'Растау үшін поштаңызды тексеріңіз!' },
  };
  const L = labels[lang];

  const handle = async () => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        onClose();
      } else {
        if (!username.trim()) {
          setError(t('auth_username_required'));
          setLoading(false);
          return;
        }
        await signUp(email, password, username);
        setSuccess(L.confirm);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('auth_error'));
    }
    setLoading(false);
  };

  return (
    <Dialog onClose={onClose} title={mode === 'login' ? t('auth_login_title') : t('auth_register_title')} subtitle="Math Universe" closeLabel={t('close')} maxWidth={440}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handle();
        }}
        style={{ display: 'grid', gap: '14px' }}
        aria-busy={loading}
      >
        {mode === 'register' && <Field label={L.name} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required data-autofocus />}
        <Field label={L.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required data-autofocus={mode === 'login' ? true : undefined} />
        <Field label={L.pass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required />

        {error && (
          <p className="status status--danger" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="status status--success" role="status">
            {success}
          </p>
        )}

        <Button type="submit" block loading={loading}>
          {mode === 'login' ? L.btn_l : L.btn_r}
        </Button>
        {loading && <span className="sr-only" role="status">{t('loading')}</span>}

        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {mode === 'login' ? L.switch_l : L.switch_r}{' '}
          <button
            type="button"
            className="text-link"
            style={{ fontSize: '14px', fontWeight: 700 }}
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
              setSuccess('');
            }}
          >
            {mode === 'login' ? L.link_l : L.link_r}
          </button>
        </p>
      </form>
    </Dialog>
  );
}
