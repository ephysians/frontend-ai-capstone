import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_NAME_CHARS = 100;
const MAX_EMAIL_CHARS = 254;
const MAX_MESSAGE_CHARS = 2_000;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

function getClientKey(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
}

function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(clientKey) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (recent.length >= RATE_LIMIT_REQUESTS) {
    requestLog.set(clientKey, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(clientKey, recent);
  return false;
}

export async function POST(req: Request) {
  if (isRateLimited(getClientKey(req))) {
    return Response.json(
      { error: 'Too many requests. Please wait a moment before trying again.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof message !== 'string' || !message.trim()
  ) {
    return Response.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  if (
    name.length > MAX_NAME_CHARS ||
    email.length > MAX_EMAIL_CHARS ||
    message.length > MAX_MESSAGE_CHARS
  ) {
    return Response.json({ error: 'One or more fields exceed the maximum length.' }, { status: 413 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'njokuobinna@gmail.com',
      replyTo: email.trim(),
      subject: `Portfolio enquiry from ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error('[api/contact] Resend error:', err);
    return Response.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
