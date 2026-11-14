'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Monitor, Users } from 'lucide-react';
import { COURSES } from '../data/courses';
import { I18N } from '../data/i18n';
import { htmlLang } from '../data/i18n-lab';
import { MATH1_META, MATH1_SYLLABUS, MATH1_COURSE_ID } from '../data/math1';
import { getCommunityActivity, setTopicSharing, type ActivityLeader, type CommunityActivity } from '../lib/activity';
import { useAuth } from '../lib/auth-context';
import type { Language } from '../lib/storage';
import { PageHeader } from './ui/PageHeader';
import styles from './activity.module.css';

const metrics = [
  ['accounts', 'activity_accounts', Users],
  ['guests', 'activity_guests', Monitor],
  ['learners', 'activity_learners', BookOpen],
] as const;

function topicTitle({ course_id, lesson_index }: ActivityLeader, lang: Language) {
  if (lesson_index === null) return null;
  if (course_id === MATH1_COURSE_ID) {
    const lecture = MATH1_SYLLABUS[lesson_index];
    return lecture && [MATH1_META.title[lang], lecture.title[lang]];
  }
  const course = COURSES.find(entry => entry.id === course_id);
  const lesson = course?.lessons[lesson_index];
  return course && lesson ? [course.title[lang], lesson.title[lang]] : null;
}

export function ActivityView({ lang, onSignIn, embedded = false }: {
  lang: Language;
  onSignIn?: () => void;
  embedded?: boolean;
}) {
  const { user, loading } = useAuth();
  return <ActivityContent key={user?.id ?? 'guest'} lang={lang} loading={loading} signedIn={!!user}
    embedded={embedded} onSignIn={onSignIn} />;
}

function ActivityContent({ lang, loading, signedIn, embedded, onSignIn }: {
  lang: Language; loading: boolean; signedIn: boolean; embedded: boolean; onSignIn?: () => void;
}) {
  const t = I18N[lang];
  const format = new Intl.NumberFormat(htmlLang(lang));
  const [data, setData] = useState<CommunityActivity>();
  const [failed, setFailed] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (loading) return;
    const request = new AbortController();
    getCommunityActivity(request.signal).then(result => {
      if (!request.signal.aborted) setData(result);
    }).catch(() => {
      if (!request.signal.aborted) setFailed(true);
    });
    return () => request.abort();
  }, [loading, revision]);

  async function shareTopic(enabled: boolean) {
    if (saving) return;
    setSaving(true);
    setSaveFailed(false);
    try {
      await setTopicSharing(enabled);
      setData(previous => previous && { ...previous, share_topic: enabled });
    } catch {
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.view}>
      {!embedded && <PageHeader eyebrow={t.activity_eyebrow} title={t.activity_title} />}
      {failed ? (
        <div className="empty-state" role="status">
          <p>{t.activity_error}</p>
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => {
            setFailed(false);
            setRevision(value => value + 1);
          }}>{t.activity_retry}</button>
        </div>
      ) : !data ? <p className="empty-state" role="status">{t.loading}</p> : (
        <>
          {!embedded && (
            <section aria-label={t.activity_period}>
              <h2 className="eyebrow">{t.activity_period}</h2>
              <dl className={styles.metrics}>
                {metrics.map(([key, label, Icon]) => (
                  <div className={styles.metric} key={key}>
                    <dt><Icon size={18} aria-hidden="true" />{t[label]}</dt>
                    <dd>{format.format(data[key])}</dd>
                  </div>
                ))}
              </dl>
              <p className="field-help">{t.activity_note}</p>
            </section>
          )}
          <section className={embedded ? styles.ranking : `panel ${styles.ranking}`} aria-label={t.activity_rank}>
            <div className={styles.heading}>
              <h2>{t.activity_rank}</h2>
              {signedIn ? (
                <div>
                  <label className={styles.sharing}>
                    <input type="checkbox" checked={data.share_topic} disabled={saving}
                      onChange={event => void shareTopic(event.target.checked)} />
                    {t.activity_shared}
                  </label>
                  <p className="field-help">{t.activity_share_help}</p>
                  {saveFailed && <p role="alert" className="status status--danger">{t.activity_save_error}</p>}
                </div>
              ) : onSignIn && (
                <div className={styles.signIn}>
                  <p className="field-help">{t.activity_login}</p>
                  <button type="button" className="btn btn--secondary btn--sm" onClick={onSignIn}>{t.a_login}</button>
                </div>
              )}
            </div>
            {data.leaders.length === 0 ? <p className="empty-state">{t.activity_empty}</p> : (
              <table className={`data-table ${styles.table}`}>
                <thead><tr>
                  <th scope="col">#</th>
                  <th scope="col">{t.activity_student}</th>
                  <th scope="col">XP</th>
                </tr></thead>
                <tbody>
                  {data.leaders.map(leader => {
                    const topic = topicTitle(leader, lang);
                    return (
                      <tr key={leader.username} className={leader.is_me ? styles.me : undefined}>
                        <td className={styles.rank}>{format.format(leader.rank)}</td>
                        <th scope="row">
                          <span className={styles.name}>{leader.username} {leader.is_me && <span className="chip chip--accent">{t.dash_you}</span>}</span>
                          <small>{t.activity_done} · {format.format(leader.completed)}</small>
                          {topic && <small>{t.activity_topic} · {topic[0]} — {topic[1]}</small>}
                        </th>
                        <td className={styles.xp}>{format.format(leader.xp)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
}
