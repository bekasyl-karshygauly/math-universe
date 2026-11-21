'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Users } from 'lucide-react';
import { I18N } from '../../data/i18n';
import { fmt } from '../../data/i18n-lab';
import {
  CODE_PATTERN, formatCode, joinGroup, leaveGroup, normalizeCode, previewGroup,
  type GroupMembership, type GroupPreview, type MyGroups,
} from '../../lib/groups';
import type { Language } from '../../lib/storage';
import { Button } from '../ui/Button';
import { Field } from '../ui/Field';
import { shortDate } from '../activity/format';
import { courseName, errorText } from './shared';
import styles from './groups.module.css';

export function StudentGroups({ lang, data, onChange, joinCode }: {
  lang: Language;
  data: MyGroups;
  onChange: (next: MyGroups) => void;
  joinCode?: string;
}) {
  const t = I18N[lang];
  const titleId = useId();
  const [code, setCode] = useState(() => formatCode(normalizeCode(joinCode ?? '')));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [preview, setPreview] = useState<GroupPreview | null>(null);
  const [checking, setChecking] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<string | null>(null);

  async function check(raw: string) {
    const clean = normalizeCode(raw);
    setNotice(null);
    setActionError(null);
    if (!CODE_PATTERN.test(clean)) {
      setPreview(null);
      setCodeError(t.grp_code_invalid);
      return;
    }
    setChecking(true);
    setCodeError(null);
    try {
      const found = await previewGroup(clean);
      setPreview(found);
      if (!found) setCodeError(t.grp_err_code);
    } catch (error) {
      setPreview(null);
      setCodeError(errorText(lang, error));
    } finally {
      setChecking(false);
    }
  }

  // An invite link opens this screen with the code filled in and checked.
  useEffect(() => {
    if (joinCode) void check(joinCode);
    // Runs once for the code the screen was opened with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function leave(group: GroupMembership) {
    if (!window.confirm(fmt(t.grp_leave_confirm, { name: group.name }))) return;
    setLeaving(group.id);
    setNotice(null);
    setActionError(null);
    try {
      onChange(await leaveGroup(group.id));
      setNotice(fmt(t.grp_left, { name: group.name }));
    } catch (error) {
      setActionError(errorText(lang, error));
    } finally {
      setLeaving(null);
    }
  }

  return (
    <section className={`panel ${styles.section}`} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.sectionTitle}>{t.grp_my_title}</h2>
      <p className={styles.lead}>{t.grp_my_lead}</p>

      <form
        className={styles.codeForm}
        onSubmit={event => {
          event.preventDefault();
          void check(code);
        }}
      >
        <Field
          label={t.grp_code_label}
          help={t.grp_code_help}
          error={codeError ?? undefined}
          mono
          value={code}
          maxLength={9}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="ABCD-EFGH"
          onChange={event => {
            setCode(formatCode(normalizeCode(event.target.value)));
            setCodeError(null);
          }}
        />
        <Button type="submit" variant="secondary" loading={checking}>{t.grp_check}</Button>
      </form>

      {preview && (
        <JoinCard
          key={preview.code}
          lang={lang}
          preview={preview}
          onCancel={() => setPreview(null)}
          onJoined={(next, name) => {
            onChange(next);
            setPreview(null);
            setCode('');
            setNotice(fmt(preview.member ? t.grp_renamed_self : t.grp_joined, { name }));
          }}
        />
      )}

      <div aria-live="polite">
        {notice && <p className="status status--success">{notice}</p>}
      </div>
      {actionError && <p role="alert" className="status status--danger">{actionError}</p>}

      {data.memberships.length === 0 ? <p className={styles.empty}>{t.grp_none}</p> : (
        <>
          <ul className={styles.memberships}>
            {data.memberships.map(group => (
              <li key={group.id} className={styles.membership}>
                <span className={styles.membershipIcon} aria-hidden="true"><Users size={18} /></span>
                <span className={styles.membershipText}>
                  <strong>{group.name}</strong>
                  <small>{courseName(lang, group.course_id)} · {fmt(t.grp_teacher_is, { teacher: group.teacher })}</small>
                  <small>{fmt(t.grp_shown_as, { name: group.display_name, date: shortDate(lang, new Date(group.joined_at)) })}</small>
                </span>
                <Button variant="danger" size="sm" loading={leaving === group.id} onClick={() => void leave(group)}>
                  {t.grp_leave}
                </Button>
              </li>
            ))}
          </ul>
          <p className="field-help">{t.grp_sees_short}</p>
        </>
      )}
    </section>
  );
}

function JoinCard({ lang, preview, onCancel, onJoined }: {
  lang: Language;
  preview: GroupPreview;
  onCancel: () => void;
  onJoined: (next: MyGroups, groupName: string) => void;
}) {
  const t = I18N[lang];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [name, setName] = useState(preview.display_name ?? '');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const course = courseName(lang, preview.course_id);

  // Keyboard and screen reader users land on the result of the check.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  async function join() {
    setJoining(true);
    setError(null);
    try {
      onJoined(await joinGroup(preview.code, name), preview.name);
    } catch (failure) {
      setError(errorText(lang, failure));
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className={styles.joinCard}>
      <p className="eyebrow eyebrow--muted">{t.grp_found}</p>
      <h3 ref={headingRef} tabIndex={-1} className={styles.joinTitle}>{preview.name}</h3>
      <p className={styles.joinMeta}>{fmt(t.grp_course_teacher, { course, teacher: preview.teacher })}</p>

      {preview.own ? (
        <>
          <p className="status">{t.grp_own_note}</p>
          <div className={styles.actions}>
            <Button variant="secondary" size="sm" onClick={onCancel}>{t.close}</Button>
          </div>
        </>
      ) : (
        <form
          className={styles.joinForm}
          onSubmit={event => {
            event.preventDefault();
            void join();
          }}
        >
          <div>
            <h4 className={styles.seesTitle}>{t.grp_sees_title}</h4>
            <ul className={styles.sees}>
              <li>{t.grp_sees_name}</li>
              <li>{fmt(t.grp_sees_lessons, { course })}</li>
              <li>{t.grp_sees_quizzes}</li>
              <li>{t.grp_sees_time}</li>
              <li>{t.grp_sees_last}</li>
            </ul>
            <p className="field-help">{t.grp_sees_note}</p>
          </div>
          {preview.member && <p className="status">{t.grp_member_already}</p>}
          <Field
            label={t.grp_name_label}
            help={t.grp_name_help}
            value={name}
            maxLength={80}
            required
            autoComplete="name"
            onChange={event => setName(event.target.value)}
          />
          {error && <p role="alert" className="status status--danger">{error}</p>}
          <div className={styles.actions}>
            <Button type="submit" loading={joining} disabled={!name.trim()}>
              {preview.member ? t.grp_save_name : t.grp_join}
            </Button>
            <Button variant="ghost" onClick={onCancel}>{t.grp_cancel}</Button>
          </div>
        </form>
      )}
    </div>
  );
}
