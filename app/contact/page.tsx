'use client';

import { useState, FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState({ name: false, email: false, message: false });

  const isBusy = status === 'submitting';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setTouched({ name: false, email: false, message: false });
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
      <p className="font-mono text-sm text-accent mb-3">contact</p>
      <h1 className="font-display font-semibold text-2xl sm:text-4xl text-ink max-w-xl">
        See the code before you take a call.
      </h1>
      <p className="mt-6 text-muted max-w-xl leading-relaxed">
        If you&apos;re a technical co-founder buried under a frontend queue, the fastest way to check
        whether I&apos;m worth your time is to open a live demo and judge the code yourself, not sit
        through a pitch.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="https://backlog-tracker-app.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm bg-accent text-base font-medium px-5 py-3 rounded-md hover:bg-accent/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Review the live demo
        </a>
      </div>

      <div className="mt-12 max-w-xl">
        <p className="font-mono text-sm text-muted mb-6">Or send a message directly:</p>

        {status === 'success' ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border border-white/10 bg-white/5 px-5 py-6 font-mono text-sm text-ink"
          >
            Message sent. I&apos;ll reply within a day.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="font-mono text-xs text-muted">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                aria-invalid={touched.name && !name.trim()}
                aria-describedby={touched.name && !name.trim() ? 'name-error' : undefined}
                disabled={isBusy}
                style={{ fontSize: '16px' }}
                className="rounded-md border border-white/10 bg-base px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-50"
              />
              {touched.name && !name.trim() && (
                <p id="name-error" role="alert" className="font-mono text-xs text-remove">
                  Name is required.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-mono text-xs text-muted">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                aria-invalid={touched.email && !email.trim()}
                aria-describedby={touched.email && !email.trim() ? 'email-error' : undefined}
                disabled={isBusy}
                style={{ fontSize: '16px' }}
                className="rounded-md border border-white/10 bg-base px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-50"
              />
              {touched.email && !email.trim() && (
                <p id="email-error" role="alert" className="font-mono text-xs text-remove">
                  Email is required.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="font-mono text-xs text-muted">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                aria-invalid={touched.message && !message.trim()}
                aria-describedby={touched.message && !message.trim() ? 'message-error' : undefined}
                disabled={isBusy}
                style={{ fontSize: '16px' }}
                className="rounded-md border border-white/10 bg-base px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-50 resize-none"
              />
              {touched.message && !message.trim() && (
                <p id="message-error" role="alert" className="font-mono text-xs text-remove">
                  Message is required.
                </p>
              )}
            </div>

            {status === 'error' && (
              <p role="alert" aria-live="polite" className="font-mono text-xs text-remove">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isBusy}
              className="self-start font-mono text-sm bg-accent text-base font-medium px-5 py-3 rounded-md hover:bg-accent/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {isBusy ? 'Sending...' : 'Send message'}
            </button>
          </form>
        )}
      </div>

      <p className="mt-8 font-mono text-xs text-muted">
        Prefer email directly?{' '}
        <a
          href="mailto:njokuobinna@gmail.com"
          className="text-ink hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded"
        >
          njokuobinna@gmail.com
        </a>
      </p>
    </div>
  );
}
