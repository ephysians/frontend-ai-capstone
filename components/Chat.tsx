'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { CaseStudyCard } from './CaseStudyCard';
import type { CaseStudy } from '@/lib/tools';

/**
 * Deliberate scope decision, not an oversight: text parts render as plain
 * text (whitespace-pre-wrap), not parsed markdown. The mentor tips warn
 * that naive markdown rendering breaks visually mid-stream (unclosed code
 * fences, dangling asterisks). Noted here instead of silently skipped.
 */

// Designed empty state: click-to-fill prompts grounded in the actual case
// study content the assistant is trained on. Points the user somewhere
// useful instead of leaving them at a dead end.
const STARTER_PROMPTS = [
  'Tell me about the workflow project',
  "What's still in progress on the Agro-Tourism case?",
  'How did you catch the module export bug?',
  'What does the Backlog Tracker actually do?',
];

// Classify the error from useChat into a specific user-facing message.
// Rate-limit errors get their own copy; everything else gets a generic one.
function classifyError(err: Error | undefined): string {
  if (!err) return '';
  const msg = err.message ?? '';
  if (
    msg.includes('429') ||
    msg.toLowerCase().includes('rate limit') ||
    msg.toLowerCase().includes('quota')
  ) {
    return 'Rate limit reached — the model is temporarily unavailable. Wait a moment, then retry.';
  }
  if (msg.includes('400')) {
    return 'The request was malformed. This is a bug — please report it.';
  }
  return 'The model returned an error mid-stream. Your message was not lost — retry to resend it.';
}

// Dev-only: pass a sabotage mode to trigger failure states without DevTools
type SabotageMode = 'network' | '429' | '500' | 'malformed' | 'midstream' | null;

export function Chat({ sabotage = null }: { sabotage?: SabotageMode }) {
  const api = sabotage ? `/api/chat?sabotage=${sabotage}` : '/api/chat';

  const { messages, sendMessage, status, stop, error, regenerate, clearError } = useChat({
    transport: new DefaultChatTransport({ api }),
  });

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);

  // Double-click guard on retry: prevents a second tap from firing a
  // second request before the first resolves.
  const [isRetrying, setIsRetrying] = useState(false);

  const isBusy = status === 'submitted' || status === 'streaming';

  // Auto-scroll: pin to bottom only while the user is already there.
  // Release the moment they scroll up — never fight deliberate scrollback.
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsPinnedToBottom(distanceFromBottom < 40);
  }, []);

  useEffect(() => {
    if (!isPinnedToBottom) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    // Re-runs on every message/content change including token-by-token
    // streaming updates — this is what keeps the pin working during streaming.
  }, [messages, isPinnedToBottom]);

  // Clear the retrying guard once a new stream starts
  useEffect(() => {
    if (status === 'streaming' || status === 'submitted') {
      setIsRetrying(false);
    }
  }, [status]);

  function jumpToLatest() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    setIsPinnedToBottom(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isBusy) return;
    sendMessage({ text: trimmed });
    setInput('');
    setIsPinnedToBottom(true);
  }

  // Fill the input from a starter prompt — does not auto-send, lets the
  // user edit or confirm before submitting.
  function fillPrompt(prompt: string) {
    setInput(prompt);
  }

  function handleRetry() {
    if (isRetrying || isBusy) return;
    setIsRetrying(true);
    setIsPinnedToBottom(true);
    // clearError resets the error state, regenerate re-sends the last
    // user message — retrying the failed message, not the whole conversation.
    clearError();
    regenerate();
  }

  // Thinking indicator: shows only in the gap between "submitted" and the
  // first real content arriving. Checking whether the last assistant message
  // actually has text content yet makes the handoff correct — the indicator
  // transitions directly into streamed text with no flash between them.
  const lastMessage = messages[messages.length - 1];
  const lastMessageHasText =
    lastMessage?.role === 'assistant' &&
    lastMessage.parts?.some((p) => p.type === 'text' && p.text.length > 0);
  const showThinking = status === 'submitted' || (status === 'streaming' && !lastMessageHasText);

  const errorMessage = classifyError(error);

  return (
    /*
     * Mobile Safari viewport fixes:
     * - h-[70dvh] uses dynamic viewport height so the container shrinks
     *   correctly when the on-screen keyboard appears. Plain vh ignores
     *   the keyboard and pushes the input off-screen.
     * - overscroll-behavior: contain on the scroll area prevents rubber-band
     *   scroll from fighting the auto-scroll pin logic.
     */
    <div className="flex flex-col h-[70dvh] max-h-[640px] rounded-lg border border-white/10 bg-panel overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* ── Empty state ─────────────────────────────────────────────────
            Designed, not apologetic. Click-to-fill prompts grounded in the
            actual case study content — points the user somewhere useful.
        ──────────────────────────────────────────────────────────────────── */}
        {messages.length === 0 && !isBusy && (
          <div className="flex flex-col items-center mt-6 gap-4">
            <p className="font-mono text-sm text-muted text-center">
              Grounded in the actual case studies — not a generic assistant.
            </p>
            <p className="font-mono text-xs text-muted/60 text-center">Try one of these:</p>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => fillPrompt(prompt)}
                  className="font-mono text-xs text-left text-muted hover:text-ink border border-white/10 hover:border-white/20 rounded-md px-3 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Messages ──────────────────────────────────────────────────── */}
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'self-end' : 'self-start'}`}
            >
              {message.parts?.map((part, i) => {
                // Plain text part
                if (part.type === 'text' && part.text) {
                  return (
                    <div
                      key={i}
                      className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                        isUser ? 'bg-accent text-base' : 'bg-white/5 text-ink'
                      }`}
                    >
                      {part.text}
                    </div>
                  );
                }

                // Tool part: getCaseStudy — four distinct states.
                // Each answers a different question for the user
                // (what's happening / with what input / what came back /
                // what went wrong), not the same card relabeled.
                if (part.type === 'tool-getCaseStudy') {
                  const key = part.toolCallId;
                  switch (part.state) {
                    case 'input-streaming':
                      return (
                        <div
                          key={key}
                          className="rounded-lg border border-dashed border-white/20 px-3 py-2 text-xs font-mono text-muted animate-pulse"
                        >
                          reading question...
                        </div>
                      );
                    case 'input-available': {
                      // Cast is safe: the shape is guaranteed at runtime by
                      // our own Zod schema in lib/tools.ts.
                      const topic = (part.input as { topic?: string } | undefined)?.topic;
                      return (
                        <div key={key} className="flex flex-col gap-2">
                          <div className="rounded-lg border border-accent/40 px-3 py-2 text-xs font-mono text-accent flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                            looking up: {topic ?? '...'}
                          </div>
                          {/* Skeleton mirrors CaseStudyCard layout within a few
                              pixels so there is no layout shift (CLS) when the
                              card arrives and replaces it. */}
                          <div className="rounded-lg border border-white/10 bg-panel p-4 text-sm animate-pulse">
                            <div className="h-4 w-3/4 rounded bg-white/10 mb-3" />
                            <div className="grid gap-3">
                              <div>
                                <div className="h-2 w-14 rounded bg-white/10 mb-1" />
                                <div className="space-y-1.5">
                                  <div className="h-3 w-full rounded bg-white/10" />
                                  <div className="h-3 w-full rounded bg-white/10" />
                                  <div className="h-3 w-2/3 rounded bg-white/10" />
                                </div>
                              </div>
                              <div>
                                <div className="h-2 w-16 rounded bg-white/10 mb-1" />
                                <div className="space-y-1.5">
                                  <div className="h-3 w-full rounded bg-white/10" />
                                  <div className="h-3 w-full rounded bg-white/10" />
                                  <div className="h-3 w-4/5 rounded bg-white/10" />
                                </div>
                              </div>
                              <div>
                                <div className="h-2 w-14 rounded bg-white/10 mb-1" />
                                <div className="space-y-1.5">
                                  <div className="h-3 w-full rounded bg-white/10" />
                                  <div className="h-3 w-full rounded bg-white/10" />
                                  <div className="h-3 w-full rounded bg-white/10" />
                                  <div className="h-3 w-1/2 rounded bg-white/10" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    case 'output-available':
                      return (
                        <div key={key} className="animate-[fadeIn_0.2s_ease]">
                          <CaseStudyCard data={part.output as CaseStudy} />
                        </div>
                      );
                    case 'output-error':
                      return (
                        <div
                          key={key}
                          role="alert"
                          className="rounded-lg border border-remove/40 bg-remove/10 px-3 py-2 text-sm text-remove"
                        >
                          Couldn&apos;t find a case study for that. Try &quot;workflow&quot; or
                          &quot;onboarding&quot;.
                        </div>
                      );
                    default:
                      return null;
                  }
                }

                return null;
              })}
            </div>
          );
        })}

        {/* ── Thinking skeleton ─────────────────────────────────────────
            3-dot bounce matches the assistant bubble layout so there is no
            layout shift when the first token arrives.
        ──────────────────────────────────────────────────────────────────── */}
        {showThinking && (
          <div
            className="self-start max-w-[85%] rounded-lg px-3 py-2 text-sm bg-white/5 text-muted font-mono"
            role="status"
            aria-live="polite"
            aria-label="Assistant is thinking"
          >
            <span className="inline-flex gap-1 items-center">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </span>
          </div>
        )}

        {/* ── Error state ───────────────────────────────────────────────
            Classified message (rate-limit vs generic), retry button that
            communicates exactly what will be retried (the failed message,
            not the whole conversation), guarded against double-clicks.
        ──────────────────────────────────────────────────────────────────── */}
        {error && !isBusy && (
          <div
            className="self-start max-w-[85%] rounded-lg px-3 py-3 text-sm bg-remove/10 border border-remove/20 text-remove flex flex-col gap-2"
            role="alert"
          >
            <p>{errorMessage}</p>
            <button
              type="button"
              onClick={handleRetry}
              disabled={isRetrying}
              aria-label="Retry the last failed message"
              className="self-start font-mono text-xs bg-remove/20 hover:bg-remove/30 text-remove px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-remove"
            >
              {isRetrying ? 'Retrying…' : '↺ Retry last message'}
            </button>
          </div>
        )}
      </div>

      {/* ── Jump to latest ────────────────────────────────────────────── */}
      {!isPinnedToBottom && (
        <button
          type="button"
          onClick={jumpToLatest}
          className="mx-auto -mt-10 mb-2 font-mono text-xs bg-accent text-base px-3 py-1 rounded-full shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ↓ jump to latest
        </button>
      )}

      {/* ── Input form ────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="border-t border-white/10 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the work..."
          aria-label="Message"
          disabled={isBusy}
          /*
           * Mobile Safari: font-size must be >= 16px on inputs to prevent
           * Safari from auto-zooming the viewport on focus. text-sm is 14px
           * so we override inline — negligible visual difference, prevents
           * the zoom entirely.
           */
          style={{ fontSize: '16px' }}
          className="flex-1 min-w-0 rounded-md bg-base border border-white/10 px-3 py-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        {isBusy ? (
          <button
            type="button"
            onClick={stop}
            className="font-mono text-sm bg-remove text-white px-4 py-2 rounded-md shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="font-mono text-sm bg-accent text-base px-4 py-2 rounded-md shrink-0 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
