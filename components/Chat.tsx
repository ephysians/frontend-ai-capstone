'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { ArrowDown, RefreshCw, Send, Square } from 'lucide-react';
import { CaseStudyCard } from './CaseStudyCard';
import type { CaseStudy } from '@/lib/tools';

const STARTER_PROMPTS = [
  'Tell me about the workflow project',
  "What's still in progress on the Agro-Tourism case?",
  'How did you catch the module export bug?',
  'What does the Backlog Tracker actually do?',
];

function classifyError(err: Error | undefined): string {
  if (!err) return '';

  const msg = err.message ?? '';
  if (
    msg.includes('429') ||
    msg.toLowerCase().includes('rate limit') ||
    msg.toLowerCase().includes('quota')
  ) {
    return 'Rate limit reached. The model is temporarily unavailable. Wait a moment, then retry.';
  }

  if (msg.includes('400')) {
    return 'The request was malformed. This is a bug. Please report it.';
  }

  return 'The model returned an error mid-stream. Your message was not lost. Retry to resend it.';
}

type SabotageMode = 'network' | '429' | '500' | 'malformed' | 'midstream' | null;

export function Chat({ sabotage = null }: { sabotage?: SabotageMode }) {
  const api = sabotage ? `/api/chat?sabotage=${sabotage}` : '/api/chat';

  const { messages, sendMessage, status, stop, error, regenerate, clearError } = useChat({
    transport: new DefaultChatTransport({ api }),
  });

  const [input, setInput] = useState('');
  const [inputTouched, setInputTouched] = useState(false);
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isBusy = status === 'submitted' || status === 'streaming';

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
  }, [messages, isPinnedToBottom]);

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
    setInputTouched(true);
    if (!trimmed || isBusy) return;

    sendMessage({ text: trimmed });
    setInput('');
    setInputTouched(false);
    setIsPinnedToBottom(true);
  }

  function handleRetry() {
    if (isRetrying || isBusy) return;

    setIsRetrying(true);
    setIsPinnedToBottom(true);
    clearError();
    regenerate();
  }

  const lastMessage = messages[messages.length - 1];
  const lastMessageHasText =
    lastMessage?.role === 'assistant' &&
    lastMessage.parts?.some((p) => p.type === 'text' && p.text.length > 0);
  const showThinking = status === 'submitted' || (status === 'streaming' && !lastMessageHasText);
  const errorMessage = classifyError(error);

  // Announce completed assistant messages to screen readers only when not streaming
  const [announce, setAnnounce] = useState('');
  useEffect(() => {
    if (status === 'streaming') return;
    const last = messages[messages.length - 1];
    if (last && last.role === 'assistant') {
      // Announce a short notification to avoid duplicating visible text for test/e2e
      setAnnounce('Assistant replied');
    }
  }, [messages, status]);

  return (
    <div className="flex h-[70dvh] max-h-[640px] flex-col overflow-hidden rounded-lg border border-white/10 bg-panel">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
        style={{ overscrollBehavior: 'contain' }}
      >
        {messages.length === 0 && !isBusy && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-center font-mono text-sm text-muted">
              Grounded in the actual case studies, not a generic assistant.
            </p>
            <p className="text-center font-mono text-xs text-muted">Try one of these:</p>
            <div className="flex w-full max-w-sm flex-col gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setInput(prompt);
                    setInputTouched(false);
                  }}
                  className="rounded-md border border-white/10 px-3 py-2 text-left font-mono text-xs text-muted transition-colors hover:border-white/20 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => {
          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex max-w-[85%] flex-col gap-2 ${isUser ? 'self-end' : 'self-start'}`}
            >
              {message.parts?.map((part, i) => {
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

                if (part.type === 'tool-getCaseStudy') {
                  const key = part.toolCallId;

                  switch (part.state) {
                    case 'input-streaming':
                      return (
                        <div
                          key={key}
                          className="rounded-lg border border-dashed border-white/20 px-3 py-2 font-mono text-xs text-muted animate-pulse"
                        >
                          reading question...
                        </div>
                      );

                    case 'input-available': {
                      const topic = (part.input as { topic?: string } | undefined)?.topic;

                      return (
                        <div key={key} className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 rounded-lg border border-accent/40 px-3 py-2 font-mono text-xs text-accent">
                            <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
                            looking up: {topic ?? '...'}
                          </div>
                          <div className="rounded-lg border border-white/10 bg-panel p-4 text-sm animate-pulse">
                            <div className="mb-3 h-4 w-3/4 rounded bg-white/10" />
                            <div className="grid gap-3">
                              {[0, 1, 2].map((section) => (
                                <div key={section}>
                                  <div className="mb-1 h-2 w-16 rounded bg-white/10" />
                                  <div className="space-y-1.5">
                                    <div className="h-3 w-full rounded bg-white/10" />
                                    <div className="h-3 w-full rounded bg-white/10" />
                                    <div className="h-3 w-2/3 rounded bg-white/10" />
                                  </div>
                                </div>
                              ))}
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
                          Could not find a case study for that. Try
                          &quot;workflow&quot; or &quot;onboarding&quot;.
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

        {showThinking && (
          <div
            className="self-start max-w-[85%] rounded-lg bg-white/5 px-3 py-2 font-mono text-sm text-ink"
            role="status"
            aria-live="polite"
            aria-label="Assistant is thinking"
          >
            <span className="inline-flex items-center gap-1">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="inline-block h-1.5 w-1.5 rounded-full bg-muted animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </span>
          </div>
        )}

        {error && !isBusy && (
          <div
            className="flex max-w-[85%] flex-col gap-2 self-start rounded-lg border border-remove/20 bg-remove/10 px-3 py-3 text-sm text-remove"
            role="alert"
          >
            <p>{errorMessage}</p>
            <button
              type="button"
              onClick={handleRetry}
              disabled={isRetrying}
              aria-label="Retry the last failed message"
              className="inline-flex items-center gap-1.5 self-start rounded-md bg-remove/20 px-3 py-1.5 font-mono text-xs text-remove transition-colors hover:bg-remove/30 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-remove focus-visible:outline-offset-2"
            >
              <RefreshCw aria-hidden="true" size={13} className={isRetrying ? 'animate-spin' : ''} />
              {isRetrying ? 'Retrying...' : 'Retry last message'}
            </button>
          </div>
        )}
      </div>

      {/* Live region for completed assistant messages (polite, avoids announcing partial streams) */}
      <div aria-live="polite" aria-atomic="false" className="sr-only">{announce}</div>

      {!isPinnedToBottom && (
        <button
          type="button"
          onClick={jumpToLatest}
          aria-label="Jump to latest message"
          className="mx-auto -mt-10 mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-base shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          <ArrowDown aria-hidden="true" size={16} />
        </button>
      )}

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 border-t border-white/10 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={() => setInputTouched(true)}
          placeholder="Ask about the work..."
          aria-label="Message"
          aria-describedby={inputTouched && !input.trim() ? 'message-error' : undefined}
          aria-invalid={inputTouched && !input.trim()}
          disabled={isBusy}
          style={{ fontSize: '16px' }}
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-base px-3 py-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        />
        {isBusy ? (
          <button
            type="button"
            onClick={stop}
            aria-label="Stop generating"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-remove text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
          >
            <Square aria-hidden="true" size={16} fill="currentColor" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-base disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
          >
            <Send aria-hidden="true" size={16} />
          </button>
        )}
        {inputTouched && !input.trim() ? (
          <p id="message-error" role="alert" className="basis-full font-mono text-xs text-remove">
            Message is required.
          </p>
        ) : (
          <span id="message-error" className="sr-only" aria-hidden="true" />
        )}
      </form>
    </div>
  );
}
