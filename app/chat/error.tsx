'use client';

import { useEffect } from 'react';

/**
 * Route-level error boundary for /chat.
 * Catches failures outside the useChat hook — e.g. the page itself
 * failing to render. The useChat hook's own error object handles
 * mid-stream and API failures inside the Chat component itself.
 */
export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[chat/error.tsx]', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24">
      <p className="font-mono text-sm text-remove mb-3">something went wrong</p>
      <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink mb-4">
        The chat page failed to load.
      </h1>
      <p className="text-muted mb-8 max-w-xl">
        This is a route-level failure, not a model error. Try reloading — if it keeps happening,
        the deployment may be broken.
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
