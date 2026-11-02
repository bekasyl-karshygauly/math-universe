'use client';

import { useEffect, useState } from 'react';

/** Increments whenever <html data-theme> changes, so renderers that bake colors can rebuild. */
export function useThemeVersion(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const obs = new MutationObserver(() => setVersion((v) => v + 1));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return version;
}
