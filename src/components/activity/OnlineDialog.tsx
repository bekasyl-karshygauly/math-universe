'use client';

import { useEffect, useState } from 'react';
import { I18N } from '../../data/i18n';
import { fmt, htmlLang } from '../../data/i18n-lab';
import { refreshOnline, setOnlineVisibility, useOnlineSnapshot, type OnlinePerson, type OnlineSnapshot } from '../../lib/activity';
import { useAuth } from '../../lib/auth-context';
import type { Language } from '../../lib/storage';
import { Dialog } from '../ui/Dialog';
import { minutesText, screenLabel, topicTitle } from './format';
import styles from './online.module.css';

const REFRESH_MS = 10_000;

export function OnlineDialog({ lang, onClose, onSignIn }: { lang: Language; onClose: () => void; onSignIn: () => void }) {
  const t = I18N[lang];
  const { user } = useAuth();
  const snapshot = useOnlineSnapshot();
  const [failed, setFailed] = useState(false);

  // While the list is open it refreshes faster than the regular heartbeat.
  useEffect(() => {
    let stopped = false;
    async function load() {
      try {
        await refreshOnline();
        if (!stopped) setFailed(false);
      } catch {
        if (!stopped) setFailed(true);
      }
    }
    void load();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void load();
    }, REFRESH_MS);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [user?.id]);

  return (
    <Dialog onClose={onClose} title={t.online_title} closeLabel={t.close} maxWidth={520}>
      {failed && <p role="alert" className="status status--danger">{t.online_error}</p>}
      {!snapshot ? <p className="empty-state" role="status">{t.loading}</p> : (
        <OnlineContent lang={lang} snapshot={snapshot} signedIn={!!user} onSignIn={onSignIn} />
      )}
    </Dialog>
  );
}

export function OnlineCounts({ lang, snapshot }: { lang: Language; snapshot: OnlineSnapshot }) {
  const t = I18N[lang];
  const format = new Intl.NumberFormat(htmlLang(lang));
  const counts = [
    ['online_total', snapshot.online],
    ['online_active', snapshot.active],
    ['online_studying', snapshot.studying],
    ['online_guests', snapshot.guests],
  ] as const;
  return (
    <dl className={styles.counts} aria-live="polite">
      {counts.map(([key, value]) => (
        <div key={key}>
          <dt>{t[key]}</dt>
          <dd>{format.format(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function OnlineContent({ lang, snapshot, signedIn, onSignIn }: {
  lang: Language; snapshot: OnlineSnapshot; signedIn: boolean; onSignIn?: () => void;
}) {
  const t = I18N[lang];
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const hiddenMore = Math.max(0, snapshot.online - snapshot.people.length);

  async function toggleVisibility(enabled: boolean) {
    setSaving(true);
    setSaveFailed(false);
    try {
      await setOnlineVisibility(enabled);
    } catch {
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.online}>
      <OnlineCounts lang={lang} snapshot={snapshot} />
      {!signedIn ? (
        <div className={styles.signIn}>
          <p className="field-help">{t.online_login}</p>
          {onSignIn && <button type="button" className="btn btn--secondary btn--sm" onClick={onSignIn}>{t.a_login}</button>}
        </div>
      ) : (
        <>
          <h3 className="eyebrow eyebrow--muted">{t.online_people}</h3>
          <ul className={styles.people}>
            {snapshot.people.map(person => <PersonRow key={person.username} lang={lang} person={person} />)}
          </ul>
          {snapshot.people.every(person => person.is_me) && <p className="field-help">{t.online_empty}</p>}
          {hiddenMore > 0 && <p className="field-help">{fmt(t.online_hidden_more, { n: hiddenMore })}</p>}
          <label className={styles.toggle}>
            <input type="checkbox" checked={snapshot.show_online} disabled={saving}
              onChange={event => void toggleVisibility(event.target.checked)} />
            <span>
              {t.online_show_me}
              <small className="field-help">{t.online_show_help}</small>
            </span>
          </label>
          {saveFailed && <p role="alert" className="status status--danger">{t.activity_save_error}</p>}
        </>
      )}
      <p className="field-help">{t.online_note}</p>
    </div>
  );
}

function PersonRow({ lang, person }: { lang: Language; person: OnlinePerson }) {
  const t = I18N[lang];
  const topic = topicTitle(lang, person.course_id, person.lesson_index);
  const minutes = Math.max(1, Math.round((Date.now() - new Date(person.since).getTime()) / 60_000));
  const state = !person.active ? t.online_idle : person.study ? t.online_studying : null;
  return (
    <li className={styles.person}>
      <span className={styles.avatar} aria-hidden="true">
        {person.username.slice(0, 1).toUpperCase()}
        <span className={person.active ? styles.dotActive : styles.dotIdle} />
      </span>
      <span className={styles.who}>
        <span className={styles.name}>
          {person.username} {person.is_me && <span className="chip chip--accent">{t.dash_you}</span>}
        </span>
        <small>
          {state && <>{state} · </>}
          {topic ? `${topic[0]} — ${topic[1]}` : screenLabel(lang, person.screen)}
        </small>
      </span>
      <small className={styles.since}>{fmt(t.online_for, { t: minutesText(lang, minutes) })}</small>
    </li>
  );
}
