'use client';

import { I18N } from '../../data/i18n';
import { fmt } from '../../data/i18n-lab';
import { useOnlineSnapshot } from '../../lib/activity';
import type { Language } from '../../lib/storage';

/** Header button with the live online count; hidden until the first heartbeat answers. */
export function OnlineBadge({ lang, onOpen }: { lang: Language; onOpen: () => void }) {
  const snapshot = useOnlineSnapshot();
  if (!snapshot) return null;
  const t = I18N[lang];
  const label = fmt(t.online_button, { n: snapshot.online });
  return (
    <button type="button" className="header-action online-badge" onClick={onOpen} aria-label={label} title={label}>
      <span className="online-badge__dot" aria-hidden="true" />
      <span className="mono">{snapshot.online}</span>
      <span className="header-action__label">{t.online_word}</span>
    </button>
  );
}
