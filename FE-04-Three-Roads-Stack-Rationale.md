# FE-04 — Three Roads: Choose Your Stack with AI

**Track:** Frontend AI Engineering  
**Project:** Frontend AI Engineering Capstone  
**Author:** Emmanuel Chukwukere Obinna  
**Live Production URL:** https://frontend-ai-capstone-two.vercel.app/  
**Source Repository:** https://github.com/ephysians/frontend-ai-capstone  

---

## 1. My Four Real Constraints

Before evaluating any technology stack, I grounded my choices in four real constraints derived from my actual project goals, repository evidence, and operating reality.

### Constraint 1: Free Only
The entire portfolio, including its interactive features, hosting, build pipelines, and external API usage, must operate strictly within persistent free tiers. I cannot take on paid hosting, monthly database charges, or paid third-party proxy subscriptions. Everything must deploy cleanly to platforms with reliable free tiers (such as Vercel and GitHub) and leverage Google AI Studio / Gemini API free tier allocations.

### Constraint 2: Honest, Evidence-Based Skill Level
My proven skill set is in modern frontend engineering and AI-assisted workflows:
- **Core Frontend:** React 18, Next.js App Router (Server and Client Components), TypeScript, and Tailwind CSS.
- **Creative & Interactive Graphics:** Custom WebGL fragment shaders written in GLSL (`SignatureShader.tsx`) and 3D procedural scenes using Three.js and React Three Fiber (`Experience.tsx`) with accessible static fallbacks.
- **AI Engineering & Integration:** Integrating the Vercel AI SDK (`@ai-sdk/google`), streaming Gemini Flash Lite responses, building grounded tool-calling schemas (`lib/tools.ts`), and implementing client/server state safeguards (Send/Stop/Retry).
- **Testing & Accessibility:** Automated component testing with Vitest, E2E browser testing with Playwright, and semantic accessibility verified by a 0-error WAVE audit (`AUDIT.md`).
- **Disciplined Review:** Catching structural bugs that automated tests miss (such as the CommonJS export vs. ES module import bug documented in `WORKFLOW.md`).

I am not a dedicated backend engineer or DevOps specialist. I should not spend time debugging persistent database migrations, server container orchestration, or complex distributed microservices when my goal is to showcase high-quality, reviewable frontend engineering.

### Constraint 3: What the Portfolio Needs to Do
Based on `FE-03-The-Through-Line.md`, the portfolio must deliver one central proof statement:
> *"I ship what AI writes, after I've actually read it."*

To prove this claim to technical co-founders, the portfolio must:
1. Land the proof statement immediately on the homepage with an interactive WebGL hero and a concrete code diff.
2. Present honest, structured case studies on `/work` using the *Problem → Decision → Outcome* format.
3. Provide an interactive `/chat` interface where visitors can query my case studies and receive grounded, tool-backed answers.
4. Host an interactive 3D review pipeline on `/experience` demonstrating the Prompt → Build → Tests → Review workflow with an accessible fallback.
5. Provide a direct CTA ladder leading visitors to inspect live demos (such as the deployed Backlog Tracker) and get in touch.

### Constraint 4: How My Work Needs to Be Displayed
My portfolio cannot simply be a static list of bullet points or external screenshots. It must directly showcase five genuine capstone work items:
1. **AI-Assisted Workflow Discipline:** Displayed through live `DiffBlock` components showing real code review decisions and caught bugs.
2. **AI Chat Experience:** A live streaming assistant with visible loading, error, retry, and stop states, grounded in real project data.
3. **FE-AA2 Review Pipeline 3D Experience:** An interactive 3D procedural scene with stage selection and workflow lenses.
4. **FE-AA3 Signature Hero:** A custom fullscreen WebGL GLSL procedural fragment shader with aspect-ratio correction and reduced-motion support.
5. **Backlog Tracker Demo:** Real UI captures and direct links to the live application.

---

## 2. Three Genuine Stack Options

I evaluated three distinct paths, ordered from simplest to most powerful.

```
   ROAD 1: SIMPLEST               ROAD 2: BALANCED / CHOSEN          ROAD 3: MOST POWERFUL
┌─────────────────────────┐     ┌────────────────────────────┐     ┌─────────────────────────────┐
│ Pure Static SPA         │     │ Serverless Hybrid          │     │ Decoupled Full-Stack        │
│ (Vite + React / Astro)  │     │ (Next.js 14 App Router)    │     │ (Next.js + Express + DB)    │
├─────────────────────────┤     ├────────────────────────────┤     ├─────────────────────────────┤
│ • Zero server runtime   │     │ • Serverless route handler │     │ • Persistent API + Postgres │
│ • Free GitHub Pages     │     │ • Free Vercel Hobby Tier   │     │ • Multi-platform hosting    │
│ • Breaks secure AI chat │     │ • Secure Gemini streaming  │     │ • High maintenance overhead │
└─────────────────────────┘     └────────────────────────────┘     └─────────────────────────────┘
```

---

### Road 1 (Simplest): Pure Static Single-Page Application (Vite + React)

* **Stack:** Vite, React 18, TypeScript, Tailwind CSS, Three.js / React Three Fiber, client-only routing.
* **How I Would Build It:**
  * Build the entire site as a pre-compiled client bundle of HTML, CSS, and JavaScript.
  * Render the WebGL shader hero, 3D review pipeline, diff blocks, and case studies entirely in client-side React.
  * For the AI chat, I would either have to mock responses with static canned JSON, require users to paste their own Gemini API key into the browser, or remove the chat page entirely.
* **Free Hosting Option:** GitHub Pages or Cloudflare Pages (100% free static CDN hosting).
* **Whether a Backend is Required:** No backend required at all.
* **Strengths:**
  * Zero server runtime issues, zero cold starts, and zero function timeout limits.
  * Extremely low maintenance overhead and instant global edge caching.
  * Trivial local development and build pipelines.
* **Real Trade-offs:**
  * **Cannot securely run the AI chat:** Private API keys (`GOOGLE_GENERATIVE_AI_API_KEY`) cannot be stored in client-side code without exposing them to public theft.
  * **Breaks live server health checks:** The `/health` route could not perform server-side GitHub API fetching.
  * Weakens my core positioning as a frontend AI engineer by replacing a live streaming AI implementation with a static mock or external link.

---

### Road 2 (Balanced / Chosen): Serverless Hybrid (Next.js 14 App Router + Vercel)

* **Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Vercel AI SDK (`@ai-sdk/google` with Gemini Flash Lite), Three.js / React Three Fiber / Drei, Vitest, Playwright.
* **How I Would Build It (My Actual Architecture):**
  * Use **Next.js Server Components** for static pages, metadata, case-study copy, and server-rendered health checks to ensure fast initial page loads and zero layout shift.
  * Use **Client Components** for isolated interactive islands: the fullscreen GLSL shader (`SignatureShader.tsx`), the 3D review pipeline (`Experience.tsx`), interactive diff views (`DiffBlock.tsx`), the animated button lifecycle (`SendButton.tsx`), and the chat UI (`Chat.tsx`).
  * Implement `app/api/chat/route.ts` as a **serverless route handler** to securely hold the Google Gemini API key on the server, validate incoming payloads, enforce rate limits, and stream text and tool calls back to the client.
  * Ground the AI assistant in my actual case studies using the `getCaseStudy` tool in `lib/tools.ts`.
* **Free Hosting Option:** Vercel Hobby Tier (free automated Next.js deployments, global CDN edge network, and serverless API execution).
* **Whether a Backend is Required:** A serverless execution environment (route handler) is required for the streaming AI endpoint; no dedicated persistent backend server or database is needed.
* **Strengths:**
  * **Full feature support:** Natively supports all five genuine capstone items, including live AI streaming, procedural WebGL, 3D interactive graphics, and static case studies.
  * **Secure AI architecture:** Keeps API keys strictly on the server and avoids client-side credential exposure.
  * **Manageable maintenance:** A unified TypeScript codebase with automated unit (Vitest) and end-to-end (Playwright) test coverage.
  * **Zero hosting costs:** Runs entirely within Vercel's free hobby tier and Google AI Studio's free tier.
* **Real Trade-offs:**
  * Subject to Vercel Hobby function execution limits (configured with `maxDuration = 30` for streaming).
  * Occasional minor serverless cold starts (~500ms–1s) after periods of inactivity.
  * Requires disciplined management of Next.js Server vs. Client component boundaries (`'use client'`).

---

### Road 3 (Most Powerful): Full-Stack Decoupled Architecture (Next.js + Express/FastAPI + PostgreSQL + Redis)

* **Stack:** Next.js 14 frontend, standalone Node.js (Express) or Python (FastAPI) backend API, PostgreSQL (via Supabase or Neon), Redis (Upstash) for session rate limiting, and a vector database (Pinecone/pgvector) for Retrieval-Augmented Generation (RAG).
* **How I Would Build It:**
  * Decouple the frontend into a standalone client communicating via REST/GraphQL with a separate backend API service.
  * Store all case studies, visitor analytics, conversation histories, and error telemetry in a relational PostgreSQL database.
  * Index case studies as vector embeddings in pgvector and perform semantic similarity search on every user chat query before generating a Gemini response.
  * Implement centralized token-bucket rate limiting in Redis across all server instances.
* **Free Hosting Option:** Vercel (Frontend) + Render / Fly.io free tier (Backend API) + Supabase free tier (PostgreSQL) + Upstash free tier (Redis).
* **Whether a Backend is Required:** Yes, full dedicated backend servers and persistent cloud databases.
* **Strengths:**
  * Supports complex multi-user features, persistent chat history across devices, and detailed analytics logging.
  * Semantic vector search scales seamlessly to hundreds of case studies or documentation pages.
  * Complete control over backend middleware, custom logging, and distributed caching.
* **Real Trade-offs:**
  * **Severe architectural bloat:** Extreme overkill for a personal portfolio with static case studies.
  * **Fragile free-tier stacking:** Free backend instances on Render or Fly.io spin down after 15 minutes of inactivity, resulting in **30–60 second cold starts** for visitors attempting to use the chat.
  * **High operational and maintenance overhead:** Requires managing database schemas, migration scripts, CORS policies across domains, environment variables across four dashboards, and multiple failure points.

---

## 3. Pressure-Testing the Three Options

| Pressure-Test Question | Road 1: Pure Static SPA | Road 2: Serverless Hybrid (Next.js 14) | Road 3: Decoupled Full-Stack |
|---|---|---|---|
| **What breaks or becomes difficult?** | **The AI Chat breaks.** Storing private Gemini API keys on a static client is impossible without severe security risks. Server-side `/health` check fails. | Potential function timeouts if an external AI call exceeds 30s (mitigated by streaming and Gemini Flash Lite). | Free-tier backend servers sleep when idle, causing **30–60s cold starts** that ruin the visitor experience. Database connection limits. |
| **What additional complexity/maintenance comes with it?** | Minimal complexity. Standard static build maintenance. | Low to manageable. Maintaining Next.js App Router conventions, dependency updates, and AI SDK streaming formats. | **High maintenance.** Database migrations, multi-platform deployments, CORS configuration, API contract versioning, and connection pooling. |
| **Can I realistically maintain each option?** | **Yes.** Trivial to maintain, but sacrifices essential AI capabilities. | **Yes.** Confirmed by my repository: builds cleanly, passes TypeScript, passes ESLint, passes Vitest, and passes Playwright E2E tests. | **No / High risk.** The operational overhead diverts time and attention away from building and refining frontend interfaces. |
| **Does it display my actual work properly?** | **No.** Fails to showcase the live, grounded AI Chat Experience, which is one of my strongest work items. | **Yes.** Flawlessly showcases all five genuine work items (Shader Hero, 3D Pipeline, AI Chat, DiffBlocks, and Live Demos). | **Yes, but with poor UX.** Live features work in theory, but severe free-tier latency harms real visitor interactions. |

---

## 4. The Chosen Stack and Rejection of Alternatives

### My Chosen Stack
**Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Vercel AI SDK (`@ai-sdk/google` with Gemini Flash Lite), Three.js / React Three Fiber, and Vitest / Playwright, deployed on Vercel.**

### Why I Rejected Road 1 (Pure Static SPA)
I rejected the pure static approach because it cannot support my primary interactive proof piece: the **grounded AI Chat Experience**. A static site cannot securely store API keys or stream model completions from a private Google AI credential. Downgrading the chat to a fake mock or asking visitors to supply their own API keys would undermine my credibility as an AI engineer.

### Why I Rejected Road 3 (Decoupled Full-Stack Backend)
I rejected the full-stack dedicated backend because it introduces massive unnecessary complexity without adding value to the visitor. My case studies are static and do not require a persistent database or vector search engine. Furthermore, stacking multiple free-tier services (Render, Supabase, Upstash) creates severe reliability issues, including 30–60 second server spin-up delays that make the chat feel broken to visitors.

---

## 5. Explicit Three-Point Evaluation

### 1. Can I realistically maintain this stack?
**Yes.** The stack is unified in TypeScript across both client UI and serverless route handlers. The codebase contains no database schemas to migrate, no background workers to monitor, and no persistent server processes to maintain. With automated unit tests in Vitest and end-to-end browser tests in Playwright, I can maintain and update this codebase with low, manageable effort.

### 2. Does it display my actual work well?
**Yes, exceptionally well.** It provides a native environment for all five genuine capstone work items:
- The **Signature WebGL Shader Hero** runs smoothly as a client component with DPR capping and reduced-motion fallback.
- The **FE-AA2 3D Review Pipeline** renders procedural Three.js geometry with stage and lens controls and an accessible static fallback.
- The **AI Chat Experience** streams real-time responses from Gemini Flash Lite, executes the `getCaseStudy` tool against real project data, and gracefully handles loading, error, and stop states.
- The **Workflow Discipline** case is visually anchored by live, accessible `DiffBlock` components.
- The **Backlog Tracker** is presented with high-resolution UI captures and verified outbound links.

### 3. Is a backend needed now?
**No traditional backend is needed, but a serverless execution environment is strictly required.**
- **No traditional dedicated backend or database is required:** The portfolio has no user accounts, no authenticated sessions, and no dynamically created user content. Storing case studies in version-controlled TypeScript files is faster, more reliable, and completely free.
- **Serverless execution is strictly required:** The AI Chat requires a secure server runtime (`app/api/chat/route.ts`) to keep `GOOGLE_GENERATIVE_AI_API_KEY` private, validate message length, apply in-memory rate limiting, and stream chunked responses. Next.js App Router route handlers on Vercel satisfy this requirement perfectly without the maintenance or cost of a standalone backend server.

---

## 6. Final Decision

The **Next.js 14 Serverless Hybrid on Vercel** is the most defensible, robust, and cost-effective architecture for my capstone portfolio. It adheres strictly to my four real constraints: it is **100% free**, matches my **demonstrated frontend AI skill set**, fulfills **every content requirement in `FE-03-The-Through-Line.md`**, and **displays my actual interactive work** with high fidelity, zero database bloat, and low ongoing maintenance.

