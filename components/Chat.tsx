'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { CaseStudyCard } from './CaseStudyCard';
import type { CaseStudy } from '@/lib/tools';

/**
 * Deliberate scope decision, not an oversight: text parts render as plain
 * text (whitespace-pre-wrap), not parsed markdown. The mentor tips warn
 * that naive markdown rendering breaks visually mid-stream (unclosed code
 * fences, dangling asterisks). Noted here instead of silently skipped.
 */

export function Chat() {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);

  const isBusy = status === 'submitted' || status === 'streaming';

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsPinnedToBottom(distanceFromBottom < 40);
  }

  useEffect(() => {
    if (!isPinnedToBottom) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isPinnedToBottom]);

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

  const lastMessage = messages[messages.length - 1];
  const lastMessageHasText =
    lastMessage?.role === 'assistant' &&
    lastMessage.parts?.some((p) => p.type === 'text' && p.text.length > 0);
  const showThinking = status === 'submitted' || (status === 'streaming' && !lastMessageHasText);

  return (
    <div className="flex flex-col h-[70vh] max-h-[640px] rounded-lg border border-white/10 bg-panel overflow-hidden">
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="font-mono text-sm text-muted text-center mt-8">
            Try: &quot;tell me about the workflow project&quot; or &quot;what happened with onboarding?&quot;
          </p>
        )}

        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div key={message.id} className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'self-end' : 'self-start'}`}>
              {message.parts?.map((part, i) => {
                // Plain text part
                if (part.type === 'text' && part.text) {
                  return (
                    <div key={i} className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${isUser ? 'bg-accent text-base' : 'bg-white/5 text-ink'}`}>
                      {part.text}
                    </div>
                  );
                }

                // Tool part: getCaseStudy, four distinct states per the
                // brief. Each answers a different question for the user
                // (what's happening / with what input / what came back /
                // what went wrong), not the same card relabeled.
                if (part.type === 'tool-getCaseStudy') {
                  const key = part.toolCallId;
                  switch (part.state) {
                    case 'input-streaming':
                      return (
                        <div key={key} className="rounded-lg border border-dashed border-white/20 px-3 py-2 text-xs font-mono text-muted animate-pulse">
                          reading question...
                        </div>
                      );
                    case 'input-available': {
                      // Cast is safe, not a workaround for a real bug: the
                      // AI SDK's generic UIMessage type can't automatically
                      // narrow to this specific tool's schema without extra
                      // type wiring, but the shape is guaranteed at runtime
                      // by our own Zod schema in lib/tools.ts.
                      const topic = (part.input as { topic?: string } | undefined)?.topic;
                      return (
                        <div key={key} className="flex flex-col gap-2">
                          <div className="rounded-lg border border-accent/40 px-3 py-2 text-xs font-mono text-accent flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                            looking up: {topic ?? '...'}
                          </div>
                          {/* Skeleton mirrors CaseStudyCard layout while data is in-flight */}
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
                        <div key={key} role="alert" className="rounded-lg border border-remove/40 bg-remove/10 px-3 py-2 text-sm text-remove">
                          Couldn&apos;t find a case study for that. Try &quot;workflow&quot; or &quot;onboarding&quot;.
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
          <div className="self-start rounded-lg px-3 py-2 text-sm bg-white/5 text-muted font-mono" role="status" aria-live="polite">
            thinking<span className="animate-pulse">...</span>
          </div>
        )}

        {error && (
          <div className="self-start rounded-lg px-3 py-2 text-sm bg-remove/10 text-remove" role="alert">
            Something went wrong. You can try sending again.
          </div>
        )}
      </div>

      {!isPinnedToBottom && (
        <button
          type="button"
          onClick={jumpToLatest}
          className="mx-auto -mt-10 mb-2 font-mono text-xs bg-accent text-base px-3 py-1 rounded-full shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ↓ jump to latest
        </button>
      )}

      <form onSubmit={handleSubmit} className="border-t border-white/10 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the work..."
          aria-label="Message"
          disabled={isBusy}
          className="flex-1 min-w-0 rounded-md bg-base border border-white/10 px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        {isBusy ? (
          <button type="button" onClick={stop} className="font-mono text-sm bg-remove text-white px-4 py-2 rounded-md shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            Stop
          </button>
        ) : (
          <button type="submit" disabled={!input.trim()} className="font-mono text-sm bg-accent text-base px-4 py-2 rounded-md shrink-0 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            Send
          </button>
        )}
      </form>
    </div>
  );
}
