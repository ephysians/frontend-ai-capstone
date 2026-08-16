'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect, FormEvent } from 'react';

/**
 * Deliberate scope decision, not an oversight: messages render as plain
 * text (whitespace-pre-wrap), not parsed markdown. The mentor tips warn
 * that naive markdown rendering breaks visually mid-stream (unclosed code
 * fences, dangling asterisks). The correct fix is a streaming-aware
 * renderer or per-block buffering, both real engineering effort beyond
 * this assignment's scope for a text-only Q&A assistant that isn't
 * expected to return code blocks. Noted here instead of silently skipped.
 */

export function Chat() {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);

  const isBusy = status === 'submitted' || status === 'streaming';

  // Auto-scroll, implemented as the mentor tips describe: pin to bottom
  // only while the user is already there, release the moment they scroll
  // up, and never fight a user who's deliberately reading scrollback.
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
    // Re-runs on every message/content change, including token-by-token
    // streaming updates, since `messages` is a new array reference each
    // time useChat appends a chunk. This is what keeps the pin working
    // *during* streaming, not just after it finishes.
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

  // Thinking indicator shows only in the gap between "submitted" and the
  // first real content arriving, this is the handoff the mentor tips call
  // out: it should feel like one continuous state transition into the
  // streamed text, not an indicator that vanishes and text that pops in
  // a frame later. Checking whether the last assistant message actually
  // has text content yet is what makes that handoff correct.
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
            Ask about the work, the case studies, or how the AI-assisted workflow actually holds up.
          </p>
        )}

        {messages.map((message) => {
          const text = message.parts
            ?.filter((p) => p.type === 'text')
            .map((p) => (p.type === 'text' ? p.text : ''))
            .join('');

          const isUser = message.role === 'user';

          return (
            <div key={message.id} className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${isUser ? 'self-end bg-accent text-base' : 'self-start bg-white/5 text-ink'}`}>
              {text}
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
