import { Chat } from '@/components/Chat';
import Link from 'next/link';

// Dev-only: ?sabotage=429 | 500 | network | malformed
// Completely ignored in production (the route handler guards it).
type SabotageMode = 'network' | '429' | '500' | 'malformed' | 'midstream' | null;

const VALID_MODES = ['network', '429', '500', 'malformed', 'midstream'];

export default function ChatPage({
  searchParams,
}: {
  searchParams: { sabotage?: string };
}) {
  const raw = searchParams?.sabotage ?? null;
  const sabotage = (VALID_MODES.includes(raw ?? '') ? raw : null) as SabotageMode;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24">
      <p className="font-mono text-sm text-accent mb-3">ask about the work</p>
      <h1 className="font-display font-semibold text-2xl sm:text-4xl text-ink mb-6">
        Ask, don&apos;t just read.
      </h1>
      <p className="text-muted mb-8 max-w-xl">
        Grounded in the actual case studies on this site, not a generic assistant. Try asking what
        the hardest part of the workflow project was, or what&apos;s still in progress on the
        Agro-Tourism case.
      </p>

      {/* Dev sabotage indicator — only renders when a mode is active */}
      {sabotage && process.env.NODE_ENV === 'development' && (
        <div className="mb-4 font-mono text-xs text-remove border border-remove/30 bg-remove/10 rounded-md px-3 py-2">
          ⚠ sabotage mode active: <strong>{sabotage}</strong> — all sends will trigger this failure
        </div>
      )}

      <Chat sabotage={sabotage} />

      <div className="mt-8 border-t border-white/10 pt-8">
        <p className="font-display font-semibold text-xl text-ink">Need help with a frontend backlog?</p>
        <p className="mt-2 text-muted max-w-xl">If the answers are useful, let&apos;s talk about the work itself.</p>
        <Link
          href="/contact"
          className="mt-5 inline-flex font-mono text-sm bg-accent text-base font-medium px-5 py-3 rounded-md hover:bg-accent/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}
