'use client';

import React, { useRef, useState } from 'react';
import { Save, Download, Upload } from 'lucide-react';
import { Language } from '../lib/storage';
import { I18N } from '../data/i18n';
import { fmt } from '../data/i18n-lab';

interface NotesViewProps {
  lang: Language;
  initialNotes: string;
  onSaveNotes: (notes: string) => void;
  onImportState: (data: any) => void;
  onToast: (msg: string) => void;
}

export function NotesView({ lang, initialNotes, onSaveNotes, onImportState, onToast }: NotesViewProps) {
  const [notes, setNotes] = useState<string>(initialNotes);
  // Notes are saved by the button, so the UI shows when there are unsaved edits
  const [savedNotes, setSavedNotes] = useState<string>(initialNotes);
  const fileRef = useRef<HTMLInputElement>(null);
  const t = (k: string) => I18N[lang][k] || k;
  const dirty = notes !== savedNotes;
  const lineCount = notes.trim() ? notes.trim().split('\n').length : 0;

  const handleSave = () => {
    onSaveNotes(notes);
    setSavedNotes(notes);
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
          setSavedNotes(parsed.notes);
          onSaveNotes(parsed.notes);
        }
        if (onImportState) {
          onImportState(parsed);
        }
        onToast(t('t_import'));
      } catch (err) {
        onToast(t('notes_import_error'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="panel panel--instrument notes">
      <div className="notes__head">
        <label htmlFor="notes-text" className="field-label">
          {t('notes_title')}
        </label>
        <span className="mono notes__meta" aria-live="polite">
          {fmt(t('notes_lines'), { n: lineCount })} · {dirty ? t('notes_dirty') : t('notes_clean')}
        </span>
      </div>

      <textarea
        id="notes-text"
        className="field-input notes__text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={t('notes_ph')}
        aria-describedby="notes-storage"
        onKeyDown={(e) => {
          // Ctrl/Cmd + S saves without leaving the keyboard
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            e.preventDefault();
            handleSave();
          }
        }}
      />

      <div className="notes__actions">
        <button type="button" className="btn btn--primary" onClick={handleSave}>
          <Save size={16} aria-hidden="true" />
          {t('notes_save')}
        </button>
        <button type="button" className="btn btn--secondary" onClick={handleExport}>
          <Download size={16} aria-hidden="true" />
          {t('notes_export')}
        </button>
        <button type="button" className="btn btn--secondary" onClick={() => fileRef.current?.click()}>
          <Upload size={16} aria-hidden="true" />
          {t('notes_import')}
        </button>
        <input ref={fileRef} type="file" accept=".json,.txt" onChange={handleImport} className="sr-only" tabIndex={-1} aria-hidden="true" />
      </div>

      <p id="notes-storage" className="field-help" style={{ marginTop: '14px' }}>
        {t('notes_cookie')}
      </p>
    </div>
  );
}
