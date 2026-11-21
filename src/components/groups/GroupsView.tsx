'use client';

import { useEffect, useState } from 'react';
import { I18N } from '../../data/i18n';
import { fmt } from '../../data/i18n-lab';
import { formatCode, getMyGroups, normalizeCode, type MyGroups } from '../../lib/groups';
import type { Language } from '../../lib/storage';
import { StudentGroups } from './StudentGroups';
import { TeacherCabinet } from './TeacherCabinet';
import styles from './groups.module.css';

/** The Groups tab of the Activity screen: the teacher dashboard for teachers, then the student's own groups. */
export function GroupsView({ lang, signedIn, onSignIn, joinCode }: {
  lang: Language;
  signedIn: boolean;
  onSignIn?: () => void;
  joinCode?: string;
}) {
  const t = I18N[lang];
  const [data, setData] = useState<MyGroups>();
  const [failed, setFailed] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!signedIn) return;
    const request = new AbortController();
    setFailed(false);
    getMyGroups(request.signal).then(result => {
      if (!request.signal.aborted) setData(result);
    }).catch(() => {
      if (!request.signal.aborted) setFailed(true);
    });
    return () => request.abort();
  }, [signedIn, revision]);

  if (!signedIn) {
    const code = normalizeCode(joinCode ?? '');
    return (
      <section className={`panel ${styles.section}`}>
        <h2 className={styles.sectionTitle}>{t.grp_my_title}</h2>
        <p className={styles.lead}>{t.grp_my_lead}</p>
        <div className={styles.signIn}>
          <p className="field-help">{code.length === 8 ? fmt(t.grp_login_code, { code: formatCode(code) }) : t.grp_login}</p>
          {onSignIn && <button type="button" className="btn btn--secondary btn--sm" onClick={onSignIn}>{t.a_login}</button>}
        </div>
      </section>
    );
  }

  if (failed) {
    return (
      <div className="empty-state" role="status">
        <p>{t.grp_load_error}</p>
        <button type="button" className="btn btn--secondary btn--sm" onClick={() => setRevision(value => value + 1)}>
          {t.activity_retry}
        </button>
      </div>
    );
  }

  if (!data) return <p className="empty-state" role="status">{t.loading}</p>;

  return (
    <div className={styles.groups}>
      {data.teacher && <TeacherCabinet lang={lang} data={data} onChange={setData} />}
      <StudentGroups lang={lang} data={data} onChange={setData} joinCode={joinCode} />
    </div>
  );
}
