import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { CHAT_MODEL, SYSTEM_PROMPT } from '@/lib/chat-config';

// This route is the only place the Gemini API key is ever read
// (via GOOGLE_GENERATIVE_AI_API_KEY, read internally by @ai-sdk/google),
// it never reaches the client bundle.
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: CHAT_MODEL,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
