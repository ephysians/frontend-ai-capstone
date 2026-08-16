import { Chat } from '@/components/Chat';

export default function ChatPage() {
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
      <Chat />
    </div>
  );
}
