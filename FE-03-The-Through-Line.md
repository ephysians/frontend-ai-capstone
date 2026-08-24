# FE-03 — The Through-Line: Map Content & CTAs

## Assignment context

This document maps the existing Frontend AI Engineering capstone to one portfolio claim and one primary visitor action. It is a content and strategy artifact for FE-03, grounded in the current routes, shipped features, audit evidence, and the authoritative Week 1 positioning.

The through-line is not generic portfolio credibility. It is a specific proof sequence: show how AI-assisted frontend work is directed, inspected, tested, and shipped, then invite the visitor to inspect a live implementation for themselves.

## Week 1 source-of-truth proof statement

> I help technical co-founders drowning in frontend backlog by directing AI-assisted workflows to ship production-ready code they don't have to rewrite, not faster-but-sloppier output, but interfaces that pass their own review standard. If you're a technical co-founder buried under a frontend queue, the fastest way to check if that's true is to open one of my live demos and judge the code yourself.
>
> **Why this needs to exist**
>
> LinkedIn shows job titles, not whether AI-assisted code actually ships clean. This portfolio is the only place that claim gets tested against real, reviewable work.

## Sharpened one-line claim

> **I use AI-assisted engineering workflows to turn frontend backlog into production-ready interfaces that can survive real review.**

This sharpens the original without changing its promise. The Week 1 statement remains the source of truth: the claim is about directing AI-assisted work and reviewing the result, not about speed alone or unverified business impact.

## Target person

**Technical co-founders with frontend backlog.**

The intended reader is responsible for getting frontend work shipped and needs evidence that AI-assisted delivery can produce code and interfaces they will not have to rewrite. They are not being asked to trust a title or a generic promise; they are being given a route into reviewable work.

## Primary action

**Open a live demo and judge the implementation yourself.**

The primary action is the Week 1 action, expressed in the current interface as **Review a live demo** or **Open the live app**. Contact is a later conversation, not a replacement for proof. Every page should make it easy to move toward a live implementation, either directly or through the work and case-study sequence.

## Content map

The route maps below follow the exact rendered section order in the current application. Each CTA is named as it exists or is implied by the route, then connected back to the single Week 1 action.

### `/` — Home

**Purpose:** Establish the claim immediately, frame the difference between reviewed and merely generated output, and send the visitor to concrete work.

| Order | Section | Work or case assigned | CTA | Contribution to the primary action |
| --- | --- | --- | --- | --- |
| 1 | Signature hero: eyebrow, headline, and supporting proof statement | The overall reviewed AI-assisted frontend practice; no single project is assigned yet | None in the copy block | Creates the question the live work must answer: can this process produce code worth reviewing? |
| 2 | Hero action row | Backlog Tracker as the live product reference; `/work` as the case-study path | **Review a live demo** → Backlog Tracker; **See the work** → `/work` | The first link goes directly to the Week 1 action. The second gives visitors who need context a route to proof before they inspect the demo. |
| 3 | DiffBlock: “what reviewed, not just generated looks like” | Workflow discipline, including the real example of a green test suite that still hid a browser module/CommonJS mismatch | None | Makes the reason for judging the implementation concrete and prepares the visitor to inspect the work rather than accept marketing language. |

### `/chat` — AI Chat Experience

**Purpose:** Let the visitor test the portfolio claim through an AI experience that is itself grounded, bounded, streamed, and reviewable.

| Order | Section | Work or case assigned | CTA | Contribution to the primary action |
| --- | --- | --- | --- | --- |
| 1 | Section label and headline: “Ask, don't just read.” | AI Chat Experience | None | Sets the interaction as an active test of the work rather than passive portfolio browsing. |
| 2 | Context paragraph | The actual case studies, including workflow and onboarding | Starter questions are presented as prompts inside the chat experience | Gives the visitor a low-friction way to discover which implementation or case study to inspect next. |
| 3 | Chat interface | Streaming Gemini chat; Send/Stop controls; error and retry states; grounded `getCaseStudy` responses | **Send message**; use the conversation to ask about the work | Demonstrates production behavior directly. The assistant points to real work, which then leads the visitor to the live implementation and case-study evidence. |
| 4 | Closing backlog prompt and contact link | The broader frontend-backlog problem | **Get in touch** → `/contact` | This is a secondary path for a visitor already persuaded by the interaction. `/contact` should still preserve the live-demo invitation so contact does not replace the Week 1 action. |

### `/experience` — 3D Review Pipeline

**Purpose:** Make the human review layer visible as an interactive model of the AI-assisted engineering process.

| Order | Section | Work or case assigned | CTA | Contribution to the primary action |
| --- | --- | --- | --- | --- |
| 1 | Section label and headline: “Review the pipeline before it ships.” | FE-AA2 Review Pipeline 3D Experience | None | Names the review discipline behind the portfolio claim. |
| 2 | Explanatory paragraph | Prompt → Build → Tests → Review pipeline | None | Explains what the visitor is about to inspect without presenting the scene as a client or business outcome. |
| 3 | Interactive `Experience` scene | React Three Fiber procedural scene; stage selection; Workflow, Tests, and Risk lenses; dynamic loading; DPR cap; WebGL and reduced-motion fallback | Select a stage and change a lens within the experience | Lets the visitor examine the review process directly, reinforcing why the implementation should be judged through real behavior. |
| 4 | Three detail blocks: geometry, interaction, fallback | Performance and resilience decisions in FE-AA2 | None | Supplies technical evidence for the scene without inventing an FPS or user outcome. |
| 5 | Closing link row | The work index and the static accessible experience | **Back to the work** → `/work`; **Open the static fallback** → `/experience?fallback=1` | Moves the visitor to the case studies and then toward the live demo. The fallback link keeps the proof inspectable for users without WebGL or with reduced motion. |

### `/work` — Case Studies and Live Demo

**Purpose:** Provide the deepest written evidence, distinguish completed proof from work still in progress, and offer the clearest live implementation path.

| Order | Section | Work or case assigned | CTA | Contribution to the primary action |
| --- | --- | --- | --- | --- |
| 1 | Section label, headline, and introduction | The portfolio's case-study standard: problem, decision, and outcome | None | Establishes that the page contains evidence rather than a generic project grid. |
| 2 | Case study 1: repeatable AI-assisted engineering workflow | Workflow discipline; a real browser-compatibility bug caught despite passing tests | None | Provides the strongest written proof that review changed the result. It gives the visitor criteria for judging the live implementation. |
| 3 | Case study 2: agro-tourism onboarding design | In-progress onboarding and partner-registration work; explicitly not publicly launched | None | Shows honest scope and decision-making without presenting unfinished work as a shipped business outcome. |
| 4 | Backlog Tracker figure and live product image | Backlog Tracker, the deployed live demo | **Open the live app** → `backlog-tracker-app.vercel.app` | This is the clearest direct handoff to the Week 1 action: open the implementation and judge it. |
| 5 | DiffBlock: “a mistake caught, not hidden” | The CommonJS/browser ES module mismatch and its guarded export fix | None | Gives the visitor a concrete review artifact to compare against the live work. |
| 6 | Closing backlog prompt and contact link | Frontend work needing a careful pair of eyes | **Get in touch** → `/contact` | Offers conversation after proof. It should remain subordinate to the live-demo invitation in the overall journey. |

## Strongest-work prioritization

The strongest proof should be presented approximately in this order:

1. **AI Chat Experience**
2. **3D Review Pipeline**
3. **Signature Shader Hero**

This is a proof order, not a claim about client value or business outcomes.

1. **AI Chat Experience leads** because it is the most complete demonstration of production behavior under scrutiny. It combines a real AI/LLM-powered interface with streaming responses, Send/Stop interaction, error and retry behavior, request validation, input limits, rate limiting, server-only credentials, accessibility work, WAVE testing, Playwright coverage, and a public deployment. It asks the visitor to interact with a system whose failure paths and boundaries are visible.
2. **The 3D Review Pipeline follows** because it makes the method legible. The procedural React Three Fiber scene represents Prompt → Build → Tests → Review and includes interaction, deferred loading, a DPR cap, WebGL fallback, reduced-motion handling, and Lighthouse/performance work. It demonstrates that review is part of the build process, not only a sentence in the bio.
3. **The Signature Shader Hero comes third** because it is a distinctive implementation detail and a strong first impression, but it is less direct evidence of the full backlog-to-production workflow. The fullscreen GLSL shader, `u_time`, `u_resolution`, `u_mouse`, procedural value noise/FBM, visibility handling, DPR cap, reduced-motion fallback, and HTML layering show technical craft. The hero earns attention; the chat and pipeline do more of the argumentative work.

The current home route necessarily opens with the Signature Shader Hero as the visual entry point. The prioritization above describes how the portfolio's proof should be discussed and linked: lead the explanation with the most reviewable shipped behavior, use the 3D pipeline to explain the method, and use the shader as a memorable signature rather than the sole proof of the claim.

## CTA ladder

All route-level actions should ladder toward the same Week 1 action:

```text
Homepage
  Review a live demo ------------------------------┐
  See the work -> /work                            |
                                                     v
Work
  Open the live app ------------------------------> Open the implementation and judge it
  Get in touch -> /contact                         ^
                                                     |
Experience                                           |
  Back to the work -> /work ------------------------┘
  Static fallback -> inspect the same proof accessibly

Chat
  Ask about the work -> grounded case-study context -> live implementation
  Get in touch -> /contact -> preserve the live-demo invitation
```

The ladder has one primary destination: inspect a live implementation. The case studies, chat, and interactive pipeline are different ways to earn enough context and trust to take that action. **Get in touch** is a valid later-stage CTA for an already-convinced visitor, but it should not displace the Week 1 instruction to open a demo and judge the work.

## Still Need to Gather

### Evidence already available

- Public Vercel deployment at `https://frontend-ai-capstone-two.vercel.app/`.
- A deployed Backlog Tracker reference linked from `/` and `/work`.
- Existing Lighthouse reports and summary data for `/`, `/chat`, `/experience`, and `/work`.
- Accessibility audit artifacts, including the recorded WAVE results and screenshots.
- Unit tests with React Testing Library and Playwright E2E coverage.
- Chromium, Firefox, and WebKit automated chat-flow coverage.
- FE-AA2 implementation and fallback behavior.
- FE-AA3 implementation details and its project documentation.
- FE-11 request limits, rate protection, server-only AI credentials, environment documentation, and production README.

### Evidence still worth gathering

- Polished final screenshots selected specifically for the portfolio's strongest proof sequence.
- Mobile screenshots for the homepage, chat, experience, and work routes.
- Concise performance comparisons that remain faithful to the recorded Lighthouse runs and their limitations.
- Genuine testimonials from clients or mentors, if they become available. No testimonial should be written or implied before it exists.
- Manual Safari and mobile Safari validation; WebKit is the closest automated check, not a substitute for those platforms.
- Unfinished internship work once it is genuinely complete and reviewable.

These are evidence improvements, not invented gaps to fill with claims. The current artifacts are enough to support the through-line; the remaining items would make the proof easier to scan or broaden its validation.

## FE-03 rubric checklist

- [x] **Single memorable claim:** The sharpened claim preserves the Week 1 proof statement and names AI-assisted workflows, frontend backlog, production-ready interfaces, and real review.
- [x] **Ordered page sections:** `/`, `/chat`, `/experience`, and `/work` are mapped in their exact current rendered section order.
- [x] **Strongest work leads:** AI Chat Experience, 3D Review Pipeline, and Signature Shader Hero are explicitly prioritized as portfolio proof, without client or business-outcome claims.
- [x] **Every page has a named CTA:** Each mapped route has named actions or clearly identified in-experience actions, including the direct live-app links and supporting navigation.
- [x] **CTAs ladder to one action:** All paths ultimately point toward opening a live demo and judging the implementation; contact remains a later-stage option.
- [x] **Honest gather-list:** Available evidence is separated from worthwhile future evidence, with no fabricated metrics, testimonials, users, clients, or outcomes.

## Implementation status

This FE-03 deliverable is a content and strategy artifact only. It does not require application-code, UI, route, styling, configuration, dependency, or test changes. Any future implementation of this map should be a separate task with its own scope and validation.
