# Frontend AI Engineering Capstone

Production portfolio site for Emmanuel Chukwukere Obinna. The project demonstrates a reviewed, disciplined AI-assisted frontend workflow through real case studies, a grounded streaming AI chat assistant, an interactive 3D review-pipeline lab, a GLSL WebGL shader hero, and an automated Frontend Code Review Agent.

**Live Production Site:** [frontend-ai-capstone-two.vercel.app](https://frontend-ai-capstone-two.vercel.app/)  
**Source Repository:** [github.com/ephysians/frontend-ai-capstone](https://github.com/ephysians/frontend-ai-capstone)

---

## What It Does and For Whom

This portfolio is built for **technical co-founders and engineering leaders drowned under frontend backlog queue** who need production-ready frontend code built with AI assistance—code that passes their own architectural review standard without needing to be rewritten.

Rather than presenting generic project grids or synthetic claims, the portfolio proves the thesis:  
> *"I ship what AI writes, after I've actually read it."*

---

## AI Transparency Framework Note

> **AI Transparency Line:** I built this portfolio using Next.js 14, React 18, and TypeScript, directing AI assistants (Claude, Gemini, Amazon Q Developer) as implementation partners. 
> 
> **What AI built:** Initial component scaffolding, CSS motion keyframes, starter unit test cases, and repetitive boilerplate.  
> **What I checked and verified myself:**
> 1. Audited module export definitions to catch browser CommonJS vs. ES module mismatches (`module.exports` vs. `<script type="module">`) that passed 22 green unit tests in Node but would have crashed in the browser.
> 2. Verified timer cleanup (`clearTimeout` / `clearInterval`) in custom hooks to prevent memory leaks on unmount.
> 3. Enforced ReDoS regular expression escaping (`escapeRegExp`) to prevent user input from crashing the thread on special characters.
> 4. Audited screen-reader accessibility (`aria-live="polite"`, `aria-label`, focus trap restoration, 0 WAVE errors).
> 5. Verified server-side API key protection so private credentials never leak to client bundles.

---

## Routes and Features

- `/` — Signature WebGL GLSL fragment shader hero ("Living Earth"), proof statement, 22-test diff proof block, and demo handoffs.
- `/chat` — Streaming Gemini Flash Lite assistant grounded in site case studies via the `getCaseStudy` tool schema, with loading, error, retry, and stop controls.
- `/experience` — Interactive React Three Fiber 3D review pipeline with stage selection, workflow lenses, orbit controls, and static fallback (`?fallback=1`).
- `/work` — Detailed case studies (*Problem → Decision → Outcome*), Backlog Tracker live demo figure, caught-bug diff, and contact CTA.
- `/about` — Bio, engineering discipline positioning, resume/CV link, LinkedIn, and GitHub links.
- `/contact` — Working contact form powered by serverless API route and Resend email delivery with rate limiting.
- `/health` — Lightweight server-rendered GitHub API health check (`ephysians/frontend-ai-capstone`).
- `/playground` and `/button` — Isolated accessible UI experiments (Modal, Tabs, Disclosure, Async SendButton lifecycle).

---

## Architecture Sketch

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER                                │
│   Sora / Inter / JetBrains Mono  │  Tailwind CSS  │  Local UI Primitives  │
└──────────────┬───────────────────┬───────────────────┬──────────────────┘
               │                   │                   │
               ▼                   ▼                   ▼
┌─────────────────────────┐ ┌──────────────┐ ┌───────────────────────────┐
│ WebGL GLSL Shader Hero  │ │ 3D Lab (R3F) │ │ Grounded Chat UI          │
│ (SignatureShader.tsx)   │ │ (Scene.tsx)  │ │ (components/Chat.tsx)     │
└─────────────────────────┘ └──────────────┘ └─────────────┬─────────────┘
                                                           │
                                                           ▼ Streaming API
┌─────────────────────────────────────────────────────────────────────────┐
│                      VERCEL SERVERLESS RUNTIME                          │
│                                                                         │
│   ┌───────────────────────────┐         ┌───────────────────────────┐   │
│   │ app/api/chat/route.ts     │         │ app/api/contact/route.ts  │   │
│   │ • Rate Limiter (IP-based) │         │ • Rate Limiter (IP-based) │   │
│   │ • Input Sanitization      │         │ • Input Validation        │   │
│   │ • Vercel AI SDK           │         │ • Resend Email SDK        │   │
│   └─────────────┬─────────────┘         └─────────────┬─────────────┘   │
└─────────────────┼─────────────────────────────────────┼─────────────────┘
                  │                                     │
                  ▼                                     ▼
      ┌───────────────────────┐             ┌───────────────────────┐
      │ Google AI Studio      │             │ Resend Email Service  │
      │ (Gemini Flash Lite)   │             │ (njokuobinna@gmail)   │
      └───────────────────────┘             └───────────────────────┘
```

---

## Local Setup Guide (Stranger-Reproducible)

Any reviewer or developer can reproduce this project locally from scratch by following these steps.

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ephysians/frontend-ai-capstone.git
   cd frontend-ai-capstone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   # On macOS / Linux:
   cp .env.example .env.local

   # On Windows PowerShell:
   Copy-Item .env.example .env.local
   ```

   Edit `.env.local` and set your credentials:
   ```env
   # Required for live AI chat (/chat)
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_studio_api_key_here

   # Optional for contact form email delivery (/contact)
   RESEND_API_KEY=your_resend_api_key_here
   CONTACT_EMAIL_RECIPIENT=njokuobinna@gmail.com
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development and Testing Commands

| Command | Action | Description |
| --- | --- | --- |
| `npm run dev` | Dev Server | Starts Next.js development server on port 3000 |
| `npm run build` | Production Build | Compiles Next.js production build |
| `npm run start` | Serve Build | Runs local server serving production build |
| `npm run typecheck` | TypeScript Check | Runs `tsc --noEmit` to verify type correctness (0 errors) |
| `npm run lint` | ESLint | Runs Next.js ESLint checks |
| `npm run test:unit` | Vitest Suite | Executes 30 unit tests across 5 test files |
| `npm run test:e2e` | Playwright E2E | Runs Playwright end-to-end browser tests in Chromium |

---

## Automated Agent & v2 Eval Results Summary

As part of the AI Fluency agent track, an automated **Frontend Code Review Agent** was designed ([`FL-06-Design-Your-Personal-Agent.md`](FL-06-Design-Your-Personal-Agent.md)), built, and evaluated ([`FL-07-Build-Log.md`](FL-07-Build-Log.md)) using MCP tools (`fsRead`, `listDir`).

The agent was benchmarked against a 5-case evaluation suite:

| Eval Case | Target File / Input | Evaluation Focus | Result |
|---|---|---|---|
| **Case 1 — Vague Form** | Documented Run 1 code | Monolithic validate(), submit-only | ✅ PASS (Flagged accessibility & blur rules) |
| **Case 2 — CJS/ESM Bug** | Documented Run 2 code | `module.exports` inside `<script type="module">` | ✅ PASS (Flagged runtime crash missed by Jest) |
| **Case 3 — CopyButton** | `components/ui/CopyButton.tsx` | Clean component with unmount timer cleanup | ✅ PASS (Zero false positives) |
| **Case 4 — Search Filter** | `lib/search-filter.ts` | Clean utility with `escapeRegExp` | ✅ PASS (Zero false positives) |
| **Case 5 — Leak Hook** | `tests/lib/use-leak-hook.ts` | Unmounted `setInterval` memory leak | ✅ PASS (Flagged leak at exact line) |

**Evaluation Score:** **5 / 5 eval cases passed (100% accuracy, 0 false positives).**

---

## Known Project Limitations

1. **Serverless Rate Limiting is Instance-Local:** The API rate limiters (`app/api/chat/route.ts` and `app/api/contact/route.ts`) use an in-memory sliding window. On Vercel serverless deployments, instances scale horizontally, so rate-limiting is per-instance rather than globally centralized via Redis.
2. **Mobile GPU Thermal & Performance Budget:** The WebGL GLSL shader (`SignatureShader.tsx`) and 3D review scene (`Experience.tsx`) cap device pixel ratio at `1.5` and pause animation when hidden. However, older mobile GPUs may still experience frame drops under prolonged use.
3. **Serverless Execution Timeout:** Streaming chat route functions cap `maxDuration` at 30 seconds (Vercel Hobby limit). Extremely long, multi-step queries could potentially time out if Gemini response generation stalls.
4. **Model Hallucination Boundary:** Although the chat assistant is constrained by system prompts and grounded via the `getCaseStudy` tool schema, LLMs can occasionally generate stylistic prose variations when asked questions outside the documented case studies.

---

## Production Deployment & Verification

* **Platform:** Vercel (Production branch `main`).
* **Health Endpoint:** [`/health`](https://frontend-ai-capstone-two.vercel.app/health) verifies server-side GitHub API connectivity.
* **Accessibility Verification:** Live WAVE audit reported **0 errors, 0 contrast errors, and 0 alerts** across `/`, `/chat`, and `/experience`; `/work` reported 0 errors, 0 contrast errors, and 1 reviewed alert.
* **Lighthouse Mobile Scores:** Captured in [`AUDIT.md`](AUDIT.md) (`/chat`: 87 Perf / 96 Access; `/experience`: 70 Perf / 95 Access; `/work`: 87 Perf / 100 Access).

---

## Master Deliverables Index

All track assignment documents, technical walkthroughs, audit logs, and agent specifications are tracked in the repository root and indexed in [`INDEX.md`](INDEX.md).

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE).
