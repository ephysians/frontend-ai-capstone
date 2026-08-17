import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { CHAT_MODEL, SYSTEM_PROMPT } from '@/lib/chat-config';
import { getCaseStudy } from '@/lib/tools';

// ── Dev-only sabotage mechanism ──────────────────────────────────────────────
// Trigger failure modes from the browser without touching code.
// Usage: change the fetch URL in Chat.tsx to /api/chat?sabotage=<mode>
// Modes: "network" | "429" | "500" | "malformed"
// This block is completely inert in production (NODE_ENV check).
function handleSabotage(mode: string): Response | null {
  if (process.env.NODE_ENV !== 'development') return null;

  switch (mode) {
    case 'network':
      // Simulate a network-level failure — never responds
      return new Response(null, { status: 503, statusText: 'Sabotage: network' });
    case '429':
      return Response.json(
        { error: 'Rate limit reached. The model is temporarily unavailable — wait a moment and try again.' },
        { status: 429 }
      );
    case '500':
      return Response.json(
        { error: 'The model returned an error. Try again in a moment.' },
        { status: 500 }
      );
    case 'malformed':
      // Returns a 200 with garbage — simulates a corrupted stream
      return new Response('}{not valid json at all', {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    case 'midstream': {
      // Streams a few real-looking tokens then aborts mid-flight.
      // More reliable than trying to cancel in DevTools since the
      // timing is controlled server-side.
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Emit a couple of valid-looking stream chunks
          controller.enqueue(encoder.encode('0:"The workflow "\n'));
          await new Promise((r) => setTimeout(r, 400));
          controller.enqueue(encoder.encode('0:"project was "\n'));
          await new Promise((r) => setTimeout(r, 400));
          // Then abruptly close with an error — simulates mid-stream failure
          controller.error(new Error('Sabotage: mid-stream abort'));
        },
      });
      return new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }
    default:
      return null;
  }
}

export async function POST(req: Request) {
  // Dev sabotage: check for ?sabotage= query param
  const { searchParams } = new URL(req.url);
  const sabotage = searchParams.get('sabotage');
  if (sabotage) {
    const sabotageResponse = handleSabotage(sabotage);
    if (sabotageResponse) return sabotageResponse;
  }

  // Guard: malformed request body
  let messages: UIMessage[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages)) {
      return Response.json(
        { error: 'Invalid request: messages must be an array.' },
        { status: 400 }
      );
    }
  } catch {
    return Response.json({ error: 'Invalid JSON in request body.' }, { status: 400 });
  }

  try {
    const result = streamText({
      model: CHAT_MODEL,
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools: { getCaseStudy },
    });

    return result.toUIMessageStreamResponse({
      onError: (error) =>
        error instanceof Error ? error.message : 'Something went wrong looking that up.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    if (
      message.includes('429') ||
      message.toLowerCase().includes('rate limit') ||
      message.toLowerCase().includes('quota')
    ) {
      return Response.json(
        { error: 'Rate limit reached. The model is temporarily unavailable — wait a moment and try again.' },
        { status: 429 }
      );
    }

    console.error('[api/chat] streamText error:', err);
    return Response.json(
      { error: 'The model returned an error. Try again in a moment.' },
      { status: 500 }
    );
  }
}
