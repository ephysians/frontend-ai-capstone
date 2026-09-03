# FL-06: Explain It Like You Built It

**Track:** General AI Fluency
**Author:** Emmanuel Chukwukere Obinna
**Live Production URL:** https://frontend-ai-capstone-two.vercel.app/
**Source Repository:** https://github.com/ephysians/frontend-ai-capstone

---

## The piece I picked: how the chat streams a response — and why it shows a card instead of text

When I first looked at the chat on this site, I didn't fully understand what was happening between the moment you press Send and the moment words start appearing on screen. It looked like magic. I knew there was an AI involved, but I didn't understand the path the message took, why the response arrived word by word instead of all at once, or why asking about a project sometimes showed a structured card instead of a paragraph. Once I actually read the code and traced it end to end, it stopped being magic and became something I could explain to anyone.

Here is what is actually happening.

---

## Step 1: You type a message and press Send

The chat lives in `components/Chat.tsx`. It is a regular React component — a form with a text input and a button. When you submit, it does not do anything exotic. It calls `sendMessage({ text: trimmed })`, which is a function from a library called the Vercel AI SDK. That library handles the network request so I don't have to write raw `fetch` calls and manage streaming manually.

The message gets sent as a POST request to `/api/chat` — a URL that lives on the same site.

---

## Step 2: The server receives the message

`/api/chat` maps to the file `app/api/chat/route.ts`. In Next.js, any file you put inside `app/api/` with a `route.ts` name becomes a real server endpoint. The browser hits that URL and this file runs on the server — not in the browser, not on someone else's machine, on the same Vercel deployment that serves the site.

The first thing the route does before touching the AI at all is check whether the request is safe to process. It checks: is the message array valid? Is it too long? Has this IP address sent too many requests in the last 60 seconds? If any of those checks fail, it sends back an error immediately and never calls the AI. This is why the API key stays safe — it never leaves the server, and the server controls who gets to use it.

If the request passes all the checks, it moves on.

---

## Step 3: The route calls the AI model — but asks for a stream, not a full answer

This is the part I found most interesting. A normal API call works like ordering food at a counter: you ask, you wait, you get everything at once. Streaming is different. It is more like watching someone write on a whiteboard in front of you — words appear as they are being produced, not after the whole answer is finished.

The route calls `streamText()` from the AI SDK. That function connects to the Gemini model (configured in `lib/chat-config.ts` as `gemini-flash-lite-latest` via the Google provider) and starts receiving tokens — small chunks of text — as the model generates them. Instead of waiting for the full response, it immediately starts forwarding those chunks back to the browser using `result.toUIMessageStreamResponse()`.

The system prompt in `chat-config.ts` is what tells the model who it is and what it is allowed to say. It is kept deliberately short and specific: answer questions about Emmanuel's portfolio, ground every answer in real information, do not invent facts. That constraint is what makes the assistant reliable rather than creative in the wrong direction.

---

## Step 4: The tool call — why you sometimes see a card instead of text

This is the part that surprised me most when I read it.

The route passes a `tools` object to `streamText`: `tools: { getCaseStudy }`. This tells the model that instead of always answering in plain text, it has the option to call a function. The system prompt makes this mandatory for project questions: whenever someone asks about a specific project, the model must call `getCaseStudy` with the topic rather than answering from memory.

When the model decides to call the tool, it sends back a structured signal — not text, but a tool invocation with a topic argument like `"workflow"` or `"onboarding"`. The SDK intercepts that, runs the `getCaseStudy` function in `lib/tools.ts`, which looks up the matching case study from a hardcoded list, and returns a structured object with fields like `title`, `problem`, `decision`, and `outcome`.

Back in `Chat.tsx`, the component watches for message parts with the type `tool-getCaseStudy`. When it sees one, it renders a `CaseStudyCard` component instead of a plain text bubble. That is why the response looks different — it is not text being formatted, it is a completely different React component being rendered based on what the model chose to do.

The loading skeleton you see while waiting — the pulsing grey bars — is also part of this. The tool call goes through two states before the card appears: `input-available` (the model has decided what to look up, the function is running) and `output-available` (the result is back, render the card). The skeleton renders during `input-available` so the UI never shows a blank gap.

---

## Why this matters to me

Before I traced this, I thought of the chat as one thing: "the AI feature." After reading it, I see it as four separate concerns that each do one job:

- `Chat.tsx` owns the UI and the user interaction — it knows nothing about AI
- `route.ts` owns the security, validation, and the connection to the model — it knows nothing about how the UI looks
- `chat-config.ts` owns the model choice and the system prompt — one place to change either
- `tools.ts` owns the data and the tool definition — the model can call it but cannot modify it

Each piece is replaceable without touching the others. That separation is what makes the code readable and what made it possible for me to understand it by reading one file at a time instead of having to hold the whole thing in my head at once.

The streaming part specifically — the reason words appear one by one instead of all at once — is not a visual trick. It is the actual delivery mechanism. The server starts sending before it has finished receiving. That is what makes the chat feel responsive even when the model takes a few seconds to complete a long answer.
