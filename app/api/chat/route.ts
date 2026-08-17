import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { CHAT_MODEL, SYSTEM_PROMPT } from '@/lib/chat-config';
import { getCaseStudy } from '@/lib/tools';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

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
}
