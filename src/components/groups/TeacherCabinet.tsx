'use client';

import { useEffect, useId, useState } from 'react';
import { Copy, Link2, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { I18N } from '../../data/i18n';
import { fmt } from '../../data/i18n-lab';
import {
  createGroup, deleteGroup, formatCode, inviteLink, renameGroup, renewGroupCode,
  type MyGroups, type TeacherGroup,
} from '../../lib/groups';
import type { Language } from '../../lib/storage';
import { Button } from '../ui/Button';
import { Field } from '../ui/Field';
import { SegmentedTabs } from '../ui/SegmentedTabs';
import { shortDate } from '../activity/format';
import { GroupReportView } from './GroupReport';
import { GROUP_COURSES, courseName, errorText } from './shared';
import styles from './groups.module.css';

export function TeacherCabinet({ lang, data, onChange }: {
  lang: Language;
  data: MyGroups;
  onChange: (next: MyGroups) => void;
}) {
  const t = I18N[lang];
  const titleId = useId();
  const groups = data.groups;
  const [selected, setSelected] = useState<string | undefined>(groups[groups.length - 1]?.id);
  const [creating, setCreating] = useState(false);
  const current = groups.find(group => group.id === selected) ?? groups[groups.length - 1];

  // After a delete the selection moves to the newest remaining group.
  useEffect(() => {
    if (selected && !groups.some(group => group.id === selected)) setSelected(groups[groups.length - 1]?.id);
  }, [groups, selected]);

  return (
    <section className={`panel ${styles.section}`} aria-labelledby={titleId}>
      <div className={styles.sectionHead}>
        <div>
          <h2 id={titleId} className={styles.sectionTitle}>{t.grp_cab_title}</h2>
          <p className={styles.lead}>{t.grp_cab_lead}</p>
        </div>
        {groups.length > 0 && (
          <Button variant="secondary" size="sm" aria-expanded={creating} onClick={() => setCreating(value => !value)}>
            <Plus size={16} aria-hidden="true" />{t.grp_new}
          </Button>
        )}
      </div>

      {(creating || groups.length === 0) && (
        <CreateGroupForm
          lang={lang}
          empty={groups.length === 0}
          onCancel={groups.length > 0 ? () => setCreating(false) : undefined}
          onCreated={next => {
            onChange(next);
            setSelected(next.created);
            setCreating(false);
          }}
        />
      )}

      {current && (
        <>
          {groups.length > 1 && (
            <SegmentedTabs
              label={t.grp_list_label}
              idPrefix="group"
              scroll
              value={current.id}
              onChange={setSelected}
              items={groups.map(group => ({
                id: group.id,
                label: <>{group.name} <span className={styles.tabCount}>{group.members}</span></>,
              }))}
            />
          )}
          <div
            id="group-panel"
            role={groups.length > 1 ? 'tabpanel' : undefined}
            aria-labelledby={groups.length > 1 ? `group-tab-${current.id}` : undefined}
            className={styles.groupPanel}
          >
            <GroupDetail key={current.id} lang={lang} group={current} onChange={onChange} />
          </div>
        </>
      )}
    </section>
  );
}

function CreateGroupForm({ lang, empty, onCancel, onCreated }: {
  lang: Language;
  empty: boolean;
  onCancel?: () => void;
  onCreated: (next: MyGroups) => void;
}) {
  const t = I18N[lang];
  const courseId = useId();
  const [name, setName] = useState('');
  const [course, setCourse] = useState(GROUP_COURSES[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      onCreated(await createGroup(name, course));
    } catch (failure) {
      setError(errorText(lang, failure));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className={styles.createForm}
      onSubmit={event => {
        event.preventDefault();
        void submit();
      }}
    >
      <h3 className={styles.formTitle}>{t.grp_new_title}</h3>
      {empty && <p className="field-help">{t.grp_cab_empty}</p>}
      <div className={styles.createFields}>
        <Field
          label={t.grp_name_field}
          placeholder={t.grp_name_ph}
          value={name}
          maxLength={80}
          required
          autoFocus={!empty}
          onChange={event => setName(event.target.value)}
        />
        <div className="field">
          <label className="field-label" htmlFor={courseId}>{t.grp_course_field}</label>
          <select id={courseId} className="field-input" value={course} onChange={event => setCourse(event.target.value)}>
            {GROUP_COURSES.map(id => <option key={id} value={id}>{courseName(lang, id)}</option>)}
          </select>
        </div>
      </div>
      {error && <p role="alert" className="status status--danger">{error}</p>}
      <div className={styles.actions}>
        <Button type="submit" loading={saving} disabled={!name.trim()}>{t.grp_create}</Button>
        {onCancel && <Button variant="ghost" onClick={onCancel}>{t.grp_cancel}</Button>}
      </div>
    </form>
  );
}

function GroupDetail({ lang, group, onChange }: {
  lang: Language;
  group: TeacherGroup;
  onChange: (next: MyGroups) => void;
}) {
  const t = I18N[lang];
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(group.name);
  const [busy, setBusy] = useState<'rename' | 'renew' | 'delete' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function run(kind: 'rename' | 'renew' | 'delete', action: () => Promise<MyGroups>, done?: string) {
    setBusy(kind);
    setError(null);
    setNotice(null);
    try {
      onChange(await action());
      if (done) setNotice(done);
      return true;
    } catch (failure) {
      setError(errorText(lang, failure));
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function copy(text: string, done: string) {
    setError(null);
    try {
      await navigator.clipboard.writeText(text);
      setNotice(done);
    } catch {
      setNotice(null);
      setError(t.grp_copy_failed);
    }
  }

  return (
    <div className={styles.detail}>
      <div className={styles.detailHead}>
        <div className={styles.detailTitle}>
          {editing ? (
            <form
              className={styles.renameForm}
              onSubmit={async event => {
                event.preventDefault();
                if (await run('rename', () => renameGroup(group.id, name))) setEditing(false);
              }}
            >
              <Field label={t.grp_name_field} value={name} maxLength={80} required autoFocus
                onChange={event => setName(event.target.value)} />
              <div className={styles.actions}>
                <Button type="submit" size="sm" loading={busy === 'rename'} disabled={!name.trim()}>{t.grp_save}</Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditing(false);
                  setName(group.name);
                }}>{t.grp_cancel}</Button>
              </div>
            </form>
          ) : (
            <>
              <h3 className={styles.groupName}>{group.name}</h3>
              <p className="field-help">
                {courseName(lang, group.course_id)} · {fmt(t.grp_created_on, { date: shortDate(lang, new Date(group.created_at)) })}
              </p>
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                <Pencil size={14} aria-hidden="true" />{t.grp_rename}
              </Button>
            </>
          )}
        </div>

        <div className={styles.codeCard}>
          <span className="eyebrow eyebrow--muted" id={`code-${group.id}`}>{t.grp_invite}</span>
          <output className={styles.code} aria-labelledby={`code-${group.id}`}>{formatCode(group.code)}</output>
          <div className={styles.actions}>
            <Button variant="secondary" size="sm" onClick={() => void copy(formatCode(group.code), t.grp_copied_code)}>
              <Copy size={14} aria-hidden="true" />{t.grp_copy_code}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => void copy(inviteLink(group.code), t.grp_copied_link)}>
              <Link2 size={14} aria-hidden="true" />{t.grp_copy_link}
            </Button>
            <Button variant="ghost" size="sm" loading={busy === 'renew'} onClick={() => {
              if (window.confirm(t.grp_renew_confirm)) void run('renew', () => renewGroupCode(group.id), t.grp_renewed);
            }}>
              <RefreshCw size={14} aria-hidden="true" />{t.grp_renew}
            </Button>
          </div>
          <p className="field-help">{t.grp_invite_help}</p>
        </div>
      </div>

      <div aria-live="polite">{notice && <p className="status status--success">{notice}</p>}</div>
      {error && <p role="alert" className="status status--danger">{error}</p>}

      <GroupReportView lang={lang} group={group} onMembersChanged={onChange} />

      <div className={styles.danger}>
        <Button variant="danger" size="sm" loading={busy === 'delete'} onClick={() => {
          if (window.confirm(fmt(t.grp_delete_confirm, { name: group.name }))) void run('delete', () => deleteGroup(group.id));
        }}>
          <Trash2 size={14} aria-hidden="true" />{t.grp_delete}
        </Button>
        <p className="field-help">{t.grp_delete_help}</p>
      </div>
    </div>
  );
}
