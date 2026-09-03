'use client';

import { useEffect, useState } from 'react';

/**
 * Adversarial test file for FL-07 Eval Case 5.
 * This hook intentionally contains a Category 2 failure:
 * setInterval inside useEffect with no cleanup return function.
 * The agent must flag this as an unmount leak.
 */
export function usePollingStatus(url: string) {
  const [status, setStatus] = useState<string>('idle');

  useEffect(() => {
    setInterval(async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setStatus(data.status);
      } catch {
        setStatus('error');
      }
    }, 3000);
    // No return cleanup — interval is never cleared on unmount.
    // This will cause a memory leak and setState calls on an
    // unmounted component every 3 seconds.
  }, [url]);

  return status;
}
