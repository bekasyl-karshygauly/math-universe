'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Monitor, Users } from 'lucide-react';
import { I18N } from '../data/i18n';
import { htmlLang } from '../data/i18n-lab';
import {
  getCommunityActivity, getTimeRanking, setTopicSharing, useOnlineSnapshot,
  type CommunityActivity, type TimeRanking,
} from '../lib/activity';
import { useAuth } from '../lib/auth-context';
import type { Language } from '../lib/storage';
import { PageHeader } from './ui/PageHeader';
import { SegmentedTabs } from './ui/SegmentedTabs';
import { MyActivity } from './activity/MyActivity';
import { GroupsView } from './groups/GroupsView';
import { OnlineContent } from './activity/OnlineDialog';
import { minutesText, topicTitle } from './activity/format';
import styles from './activity.module.css';

const metrics = [
  ['accounts', 'activity_accounts', Users],
  ['guests', 'activity_guests', Monitor],
  ['learners', 'activity_learners', BookOpen],
] as const;

export type ActivityTab = 'me' | 'community' | 'groups';

export function ActivityView({ lang, onSignIn, embedded = false, initialTab = 'me', joinCode }: {
  lang: Language;
  onSignIn?: () => void;
  embedded?: boolean;
  initialTab?: ActivityTab;
  /** Code from an invite link; opens the join screen filled in. */
  joinCode?: string;
}) {
  const { user, loading } = useAuth();
  const t = I18N[lang];
  const [tab, setTab] = useState<ActivityTab>(initialTab);
  const eyebrow = tab === 'me' ? t.act_eyebrow_me : tab === 'groups' ? t.grp_eyebrow : t.activity_eyebrow;
  const title = tab === 'me' ? t.act_my_title : tab === 'groups' ? t.grp_title : t.activity_title;
  const key = user?.id ?? 'guest';
  if (embedded) {
    return <ActivityContent key={key} lang={lang} loading={loading} signedIn={!!user} embedded onSignIn={onSignIn} />;
  }
  return (
    <div className={styles.view}>
      <PageHeader eyebrow={eyebrow} title={title} />
      <SegmentedTabs
        label={t.nav_activity}
        idPrefix="activity"
        value={tab}
        onChange={setTab}
        items={[
          { id: 'me', label: t.act_tab_me },
          { id: 'community', label: t.act_tab_community },
          { id: 'groups', label: t.grp_tab },
        ]}
      />
      <div id="activity-panel" role="tabpanel" aria-labelledby={`activity-tab-${tab}`} className={styles.tabPanel}>
        {loading ? <p className="empty-state" role="status">{t.loading}</p> : tab === 'me' ? (
          <MyActivity key={key} lang={lang} signedIn={!!user} />
        ) : tab === 'groups' ? (
          <GroupsView key={key} lang={lang} signedIn={!!user} onSignIn={onSignIn} joinCode={joinCode} />
        ) : (
          <>
            <LiveNow lang={lang} signedIn={!!user} onSignIn={onSignIn} />
            <TimeLeaders key={`time-${key}`} lang={lang} signedIn={!!user} onSignIn={onSignIn} />
            <ActivityContent key={key} lang={lang} loading={loading} signedIn={!!user} embedded={false} onSignIn={onSignIn} />
          </>
        )}
      </div>
    </div>
  );
}

function LiveNow({ lang, signedIn, onSignIn }: { lang: Language; signedIn: boolean; onSignIn?: () => void }) {
  const t = I18N[lang];
  const snapshot = useOnlineSnapshot();
  return (
    <section className={`panel ${styles.live}`} aria-label={t.online_now}>
      <h2 className={styles.liveTitle}><span className={styles.liveDot} aria-hidden="true" />{t.online_now}</h2>
      {snapshot ? <OnlineContent lang={lang} snapshot={snapshot} signedIn={signedIn} onSignIn={onSignIn} />
        : <p className="field-help">{t.online_offline}</p>}
    </section>
  );
}

function TimeLeaders({ lang, signedIn, onSignIn }: { lang: Language; signedIn: boolean; onSignIn?: () => void }) {
  const t = I18N[lang];
  const format = new Intl.NumberFormat(htmlLang(lang));
  const [data, setData] = useState<TimeRanking>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const request = new AbortController();
    getTimeRanking(request.signal).then(result => {
      if (!request.signal.aborted) setData(result);
    }).catch(() => {
      if (!request.signal.aborted) setFailed(true);
    });
    return () => request.abort();
  }, []);

  return (
    <section className={`panel ${styles.ranking}`} aria-label={t.act_rank_time}>
      <div className={styles.heading}><h2>{t.act_rank_time}</h2></div>
      {failed ? <p className="field-help">{t.activity_error}</p> : !data ? <p className="field-help" role="status">{t.loading}</p> : (
        <>
          <dl className={styles.metrics}>
            <div className={styles.metric}><dt>{t.act_comm_study}</dt><dd>{minutesText(lang, data.study)}</dd></div>
            <div className={styles.metric}><dt>{t.act_rank_total}</dt><dd>{minutesText(lang, data.total)}</dd></div>
            <div className={styles.metric}><dt>{t.act_comm_learners}</dt><dd>{format.format(data.learners)}</dd></div>
          </dl>
          <p className="field-help">{t.act_comm_note}</p>
          {!signedIn ? (
            <div className={styles.signIn}>
              <p className="field-help">{t.act_rank_login}</p>
              {onSignIn && <button type="button" className="btn btn--secondary btn--sm" onClick={onSignIn}>{t.a_login}</button>}
            </div>
          ) : data.leaders.length === 0 ? <p className="empty-state">{t.act_rank_empty}</p> : (
            <table className={`data-table ${styles.table}`}>
              <thead><tr>
                <th scope="col">#</th>
                <th scope="col">{t.activity_student}</th>
                <th scope="col">{t.act_rank_study}</th>
                <th scope="col">{t.act_rank_total}</th>
              </tr></thead>
              <tbody>
                {data.leaders.map(leader => (
                  <tr key={leader.username} className={leader.is_me ? styles.me : undefined}>
                    <td className={styles.rank}>{format.format(leader.rank)}</td>
                    <th scope="row">
                      <span className={styles.name}>{leader.username} {leader.is_me && <span className="chip chip--accent">{t.dash_you}</span>}</span>
                    </th>
                    <td className={styles.xp}>{minutesText(lang, leader.study)}</td>
                    <td className={styles.rank}>{minutesText(lang, leader.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </section>
  );
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
                    const topic = topicTitle(lang, leader.course_id, leader.lesson_index);
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
