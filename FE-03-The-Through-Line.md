# FE-03 - The Through-Line: Map Content & CTAs

## Audit basis

This document is based on a read-only audit of the repository as it exists on 2026-08-25. The audit checked the route implementations for `/`, `/chat`, `/experience`, and `/work`; `README.md`, `AUDIT.md`, `IDENTITY.md`, `WORKFLOW.md`, `CLAUDE.md`, and `FE-AA3-Signature-Hero.md`; the case-study data in `app/work/page.tsx` and `lib/tools.ts`; tracked screenshots and public assets; tests and package scripts; and recent Git history.

The repository contains unrelated material in the `/work` page and chat data. Because this assignment is about the completed capstone, that material is excluded from the capstone inventory below and is not used as evidence for a next case.

## Week 1 source-of-truth proof statement

> I help technical co-founders drowning in frontend backlog by directing AI-assisted workflows to ship production-ready code they don't have to rewrite, not faster-but-sloppier output, but interfaces that pass their own review standard. If you're a technical co-founder buried under a frontend queue, the fastest way to check if that's true is to open one of my live demos and judge the code yourself.
>
> **Why this needs to exist**
>
> LinkedIn shows job titles, not whether AI-assisted code actually ships clean. This portfolio is the only place that claim gets tested against real, reviewable work.

The repository also uses the shorter homepage claim: **I ship what AI writes, after I've actually read it.** The longer Week 1 statement remains the source of truth for this map.

## Audit findings

### Genuine capstone work inventory

The audit found **five genuine capstone work items**. This count separates a documented case study from completed feature or product artifacts; it does not count the unrelated second `/work` entry.

| Work item | Assignment or repository provenance | Status | Evidence found |
| --- | --- | --- | --- |
| **AI-assisted engineering workflow** | `WORKFLOW.md`; the workflow drill commits; the first `/work` case | **Completed** | A documented vague-versus-precise prompt comparison, 22 passing tests, the browser module/CommonJS mismatch found by code review, the guarded export fix, and the final repository. |
| **AI Chat Experience** | Chat implementation commits; FE-08 error/edge-state commit; `README.md`; `/chat` and `components/Chat.tsx` | **Completed** | Streaming Gemini route, grounded `getCaseStudy` tool, validation and rate limits, Send/Stop/error/retry states, unit tests, Playwright chat coverage, deployed-site reference, screenshots, and `AUDIT.md`. |
| **FE-AA2 Review Pipeline 3D Experience** | `/experience` route label, `Experience`, `ReviewScene`, and `StaticReviewPipeline` components; interactive-experience commit | **Completed** | Interactive Prompt -> Build -> Tests -> Review scene, stage/lens controls, deferred loading, DPR cap, WebGL/reduced-motion fallback, route screenshot, and Lighthouse results in `AUDIT.md`. |
| **FE-AA3 Signature Hero: A Fullscreen Shader** | `FE-AA3-Signature-Hero.md`, `SignatureShader.tsx`, `/`, and the Signature Hero commit | **Completed** | Dedicated assignment document, GLSL source and uniform decisions, implementation, production URL, homepage screenshot, reduced-motion/WebGL fallback details, and resource cleanup description. |
| **Backlog Tracker** | Live URL used by `/`, `/work`, and `/contact`; `public/backlog-tracker-ui.png`; README and route links | **Completed as a live product reference; source is not in this repository** | Public URL `https://backlog-tracker-app.vercel.app`, real UI screenshot, link from the portfolio, and descriptive README/chat references. The product source, tests, and deployment history are not present here. |

### What `/work` actually contains

The current `CASES` array in `app/work/page.tsx` has two entries, rendered before the Backlog Tracker figure:

1. **Building a repeatable AI-assisted engineering workflow** - the genuine capstone case study. It uses the Problem, Decision, and Outcome structure and records the browser module/CommonJS mismatch that passed the tests but would have broken in the browser.
2. An unrelated second entry - excluded from this capstone audit and from this FE-03 map.

The Backlog Tracker image and live link are separate from the `CASES` array. They are a product reference, not a written case study in the current `/work` page.

Therefore, the current `/work` page contains **one genuine capstone case study** and **one separate completed product reference**. Across the repository, the full genuine capstone inventory is the five-item list above.

### Strongest work

The strongest direct case for the Week 1 claim is the **AI-assisted engineering workflow** because it contains the clearest review outcome: a browser-breaking module mismatch was found even though all 22 tests passed. It is the strongest narrative proof that reading and reviewing AI-assisted output changed the result.

The strongest shipped interactive implementation is the **AI Chat Experience**. It has the broadest recorded behavior and validation: streaming, grounded tool use, input and request protections, failure states, unit tests, Playwright coverage, accessibility evidence, and a production deployment. The **Backlog Tracker** is the clearest direct live-demo handoff, but its source and test history cannot be verified from this repository.

## Content map

The map follows the current route implementations and keeps one primary visitor action: open a live implementation and judge it.

### `/` - Home

| Order | Section | Evidence/work represented | CTA and role |
| --- | --- | --- | --- |
| 1 | Signature Hero | FE-AA3 fullscreen WebGL shader with HTML proof copy | No CTA in the copy block; establishes the claim. |
| 2 | Hero action row | Backlog Tracker live product reference and `/work` | **Review a live demo** -> `backlog-tracker-app.vercel.app`; **See the work** -> `/work`. |
| 3 | DiffBlock | Workflow case: 22 green tests did not prove browser correctness | No CTA; gives the visitor a concrete reason to inspect the implementation. |

### `/chat` - AI Chat Experience

| Order | Section | Evidence/work represented | CTA and role |
| --- | --- | --- | --- |
| 1 | Label and headline | AI Chat Experience | No CTA; frames the interaction as evidence. |
| 2 | Context paragraph | Grounded case-study assistant | Starter prompts invite inspection of the documented work. |
| 3 | Chat interface | Streaming Gemini, grounded `getCaseStudy`, Send/Stop, error and retry states | **Send message**; the response points back to real work. |
| 4 | Closing prompt | Frontend-backlog positioning | **Get in touch** -> `/contact`; secondary after proof. |

### `/experience` - FE-AA2 Review Pipeline

| Order | Section | Evidence/work represented | CTA and role |
| --- | --- | --- | --- |
| 1 | Label, headline, and explanation | Prompt -> Build -> Tests -> Review method | No CTA; explains the review model. |
| 2 | Interactive scene | Procedural geometry, stage selection, workflow/evidence/risk lenses | Select a stage and lens to inspect the implementation. |
| 3 | Detail blocks | Geometry, interaction, and fallback decisions | No CTA; makes resilience decisions legible. |
| 4 | Link row | `/work` and accessible fallback | **Back to the work** -> `/work`; **Open the static fallback** -> `/experience?fallback=1`. |

### `/work` - Case Study and Live Product Reference

| Order | Section | Evidence/work represented | CTA and role |
| --- | --- | --- | --- |
| 1 | Heading and introduction | Case-study standard: problem, decision, outcome | No CTA. |
| 2 | Genuine workflow case | AI-assisted engineering workflow and reviewed browser bug | No CTA; supplies the strongest narrative proof. |
| 3 | Unrelated entry | Excluded from this capstone map | No capstone claim should be based on it. |
| 4 | Backlog Tracker figure | Completed live product reference | **Open the live app** -> `backlog-tracker-app.vercel.app`; primary proof handoff. |
| 5 | DiffBlock | Guarded export correction | No CTA; concrete review artifact. |
| 6 | Closing prompt | Frontend-backlog positioning | **Get in touch** -> `/contact`; secondary action. |

## CTA ladder

```text
Home -> Review a live demo -> Backlog Tracker
Home -> See the work -> genuine workflow case -> Open the live app
Experience -> Back to the work -> Open the live app
Chat -> ask about the work -> inspect evidence -> live implementation
Contact -> Review the live demo or email
```

The primary action is to open a live implementation and judge the code. Contact is a later-stage option, not a substitute for proof.

## How to add the next case

The exact insertion point is the `CASES` array in `app/work/page.tsx`: add the new object immediately after the genuine `workflow-discipline` object and before the unrelated existing object. Because the current page renders the array in order, this puts the next verified capstone case directly after the lead case. Do not use the unrelated entry as the insertion anchor or as capstone evidence.

Use the same object shape already used by the page:

1. **Problem:** state the concrete problem supported by the assignment or implementation evidence.
2. **What I did / Decision:** state the implementation and a meaningful decision or tradeoff documented in the evidence.
3. **What came of it / Outcome:** state only a verified result, validation result, deployment fact, or honest in-progress status.

Give the case a unique `id` and specific `title`. Add a matching entry to `lib/tools.ts` only when it should be returned by the grounded chat. Before calling it complete, run `npm run typecheck`, `npm run lint`, `npm run test:unit`, and the relevant Playwright test. This FE-03 edit does not add the case to application code.

### Most defensible next case

The repository supports **FE-AA3 Signature Hero: A Fullscreen Shader** as the next case study. It is a completed named assignment with a dedicated document, implementation, production URL, and screenshot evidence. It is not currently represented as a written case in `/work`.

The next case should be added only after its three beats are written from `FE-AA3-Signature-Hero.md` and the implementation, without inventing a user or business outcome. FE-AA2 Review Pipeline is a second supported candidate, but FE-AA3 is the more defensible first addition because its assignment document is explicit and complete.

## Evidence still missing or unverified

- Backlog Tracker source code, tests, and deployment history are outside this repository and therefore unverified here.
- No external testimonials or client/mentor quote is present.
- Native Safari and mobile Safari validation is not recorded; WebKit automation is documented instead.
- The FE-AA2 assignment document is not present by filename; its identity is supported by the route label and implementation, but the assignment-document evidence is weaker than FE-AA3's.

## FE-03 compliance table

| Requirement | Status | Evidence | Remaining action |
| --- | --- | --- | --- |
| Preserve the Week 1 proof statement | **PASS** | The exact statement is retained above and matches the homepage copy in `app/page.tsx`. | None. |
| Audit and document actual portfolio work | **PASS** | Five genuine capstone work items are listed with provenance, status, and evidence; the unrelated `/work` entry is explicitly excluded. | None for the repository audit; keep future claims evidence-based. |
| Content map for the current portfolio | **PASS** | `/`, `/chat`, `/experience`, and `/work` are mapped from their current rendered sections and CTAs. | None. |
| Strongest work identified from evidence | **PASS** | Workflow is identified as strongest narrative proof; AI Chat as strongest shipped interactive implementation; Backlog Tracker as the direct live-demo handoff with source limitations stated. | None. |
| How to add the next case | **PASS** | Exact `CASES` insertion point and Problem -> Decision -> Outcome steps are documented above. | Add only a verified case; do not use the excluded entry. |
| Named next piece of work | **PASS** | FE-AA3 Signature Hero: A Fullscreen Shader is a completed, named assignment with repository implementation, deployment, screenshots, and dedicated documentation. | Add its evidence-based three-beat case to `/work` when the scheduled reminder prompts that future task. |
| Reminder evidence | **PASS** | External Google Calendar evidence supplied by the user shows the saved reminder titled **“Add FE-AA3 Signature Hero case study to portfolio”**, scheduled for Monday, August 31, 2026 at 9:00 AM, with the description `Add the FE-AA3 Signature Hero case to /work using Problem → What I Did → Outcome.` The screenshot is not stored in this repository, so no repository path is claimed. | None. Retain the supplied screenshot with the submission evidence. |
| Submission readiness | **PASS** | The one-line claim, content map, honest evidence list, named next work, and external Google Calendar reminder evidence are all documented. | None for FE-03. |

### Reminder evidence

**Pass.** The supplied external Google Calendar screenshot shows the saved reminder **“Add FE-AA3 Signature Hero case study to portfolio”** for Monday, August 31, 2026 at 9:00 AM, with the description `Add the FE-AA3 Signature Hero case to /work using Problem → What I Did → Outcome.` The screenshot is external evidence and is not stored in the repository; no filename or path is invented.

## Submission conclusion

FE-03 is **READY FOR SUBMISSION**. The five required deliverables are documented: the one-line claim, the pages-to-sections-to-cases-to-CTA content map, the honest still-need-to-gather list, the named FE-AA3 Signature Hero next piece of work, and the external Google Calendar reminder evidence.
