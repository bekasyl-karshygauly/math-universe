'use client';

import React, { useState } from 'react';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';

interface NotesViewProps {
  lang: Language;
  initialNotes: string;
  onSaveNotes: (notes: string) => void;
  onImportState: (data: any) => void;
  onToast: (msg: string) => void;
}

export function NotesView({ lang, initialNotes, onSaveNotes, onImportState, onToast }: NotesViewProps) {
  const [notes, setNotes] = useState<string>(initialNotes);
  const t = (k: string) => I18N[lang][k] || k;

  const handleSave = () => {
    onSaveNotes(notes);
    onToast(t('t_saved'));
  };

  const handleExport = () => {
    const data = JSON.stringify(
      {
        notes,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'math_universe_notes.json';
    a.click();
    onToast(t('t_export'));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.notes !== undefined) {
          setNotes(parsed.notes);
          onSaveNotes(parsed.notes);
        }
        if (onImportState) {
          onImportState(parsed);
        }
        onToast(t('t_import'));
      } catch (err) {
        onToast('⚠️ Ошибка импорта файла');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: 'var(--shadow-sm)',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800 }}>📝 {t('notes_title')}</h3>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {notes.trim() ? notes.trim().split('\n').length : 0} строк заметок
        </span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginBottom: '16px' }}>
        {t('notes_sub')}
      </p>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={t('notes_ph')}
        style={{
          width: '100%',
          minHeight: '320px',
          padding: '18px 20px',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          background: 'var(--surface-secondary)',
          color: 'var(--text-primary)',
          fontSize: '15px',
          lineHeight: 1.7,
          fontFamily: 'inherit',
          resize: 'vertical',
          outline: 'none',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)',
        }}
      />

      <div style={{ display: 'flex', gap: '12px', marginTop: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '12px 26px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '14px',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
          }}
        >
          {t('notes_save')}
        </button>

        <button
          onClick={handleExport}
          style={{
            padding: '12px 22px',
            borderRadius: '12px',
            background: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          {t('notes_export')}
        </button>

        <label
          style={{
            padding: '12px 22px',
            borderRadius: '12px',
            background: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          {t('notes_import')}
          <input type="file" accept=".json,.txt" onChange={handleImport} style={{ display: 'none' }} />
        </label>
      </div>

      <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
        {t('notes_cookie')}
      </p>
    </div>
  );
}
