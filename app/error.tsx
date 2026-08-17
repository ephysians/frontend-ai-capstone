'use client';

import { useEffect } from 'react';

/**
 * Global root error boundary. Catches any unhandled error in the app
 * not caught by a more specific route-level error.tsx.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app/error.tsx]', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
      <p className="font-mono text-sm text-remove mb-3">error</p>
      <h1 className="font-display font-semibold text-2xl sm:text-4xl text-ink mb-4">
        Something went wrong.
      </h1>
      <p className="text-muted mb-8 max-w-xl">
        An unexpected error occurred. You can try again — if the problem persists, the issue is on
        our end.
      </p>
      <button
        type="button"
        onClick={reset}
        className="font-mono text-sm bg-accent text-base font-medium px-5 py-3 rounded-md hover:bg-accent/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        Try again
      </button>
    </div>
  );
}
