# FL-06: Design Your Personal Agent

**Track:** General AI Fluency
**Code:** FL-06
**Author:** Emmanuel Chukwukere Obinna
**Live Production URL:** https://frontend-ai-capstone-two.vercel.app/
**Source Repository:** https://github.com/ephysians/frontend-ai-capstone

---

## Agent Name: Frontend Code Review Agent

---

## 1. Job to Be Done

The agent receives AI-generated frontend code — a React component, a TypeScript utility, or a custom hook — and performs the structured review that currently requires a human to do manually in the FL-04 workflow.

Specifically, it checks for the six failure categories documented in `WORKFLOW.md` Section 6:

- Browser vs. server environment mismatches (CJS/ESM, Node built-ins in browser context)
- Timer and event listener unmount leaks (`useEffect` cleanup)
- ReDoS and unescaped regex patterns
- XSS via raw HTML string injection (`dangerouslySetInnerHTML`)
- Focus trap and restoration edge cases
- Missing or incorrect screen reader live regions (`aria-live`, `aria-label`)

It returns a structured report: pass or flag per category, with the exact line and a one-sentence explanation for each flag. It does not rewrite the code. It does not approve deployment. It surfaces what a human must still decide.

**User:** Emmanuel Chukwukere Obinna — a frontend engineer running AI-assisted code delivery.

**Usage frequency:** Every time AI-generated code passes automated tests and enters the human review stage. Based on FL-04 run cadence, this is approximately 3–5 times per week during active development.

**Why this job:** FL-04 Run 2 proved that 22 green unit tests did not catch a browser-breaking CommonJS export bug. The human review stage caught it. This agent formalises and accelerates that review stage — it does not replace it, it makes it faster and more consistent.

---

## 2. Tools and Data Needed

| Tool | Purpose | Access Plan |
|---|---|---|
| `read_file` | Read the submitted code file from the local repo | Claude Project filesystem tool or Amazon Q `fsRead` — already active in this IDE |
| `run_command` | Execute `npm run typecheck` and `npx vitest run` against the file | Claude Project shell tool or Amazon Q `executeBash` — already active |
| `read_file` (CLAUDE.md) | Load the project's engineering rules as review context | Same filesystem tool; `CLAUDE.md` is already in the repo root |
| Review checklist (static) | The six failure categories from `WORKFLOW.md` Section 6 | Embedded directly in the agent's system prompt — no external fetch needed |

**Data sources:**
- The submitted `.ts` or `.tsx` file — provided by the user at review time
- `CLAUDE.md` — read at the start of each session to load current project rules
- `WORKFLOW.md` Section 6 checklist — embedded in the system prompt, not fetched live

**Access plan summary:** All tools are available today via the Amazon Q Developer IDE plugin (MCP filesystem and shell tools). No new accounts, APIs, or paid services are required. The Claude Project path is an alternative that requires a paid Claude plan but offers a persistent instruction file and conversation memory across sessions.

---

## 3. Draft System Prompt (Agent Instructions)

```
You are a frontend code review agent for Emmanuel Chukwukere Obinna's AI-assisted engineering workflow.

Your job is to review AI-generated frontend code for the six failure categories that automated test runners cannot catch. You do not rewrite code. You do not approve or reject deployment. You surface findings so the human engineer can make the final call.

REVIEW CHECKLIST — check every submitted file against all six:

1. BROWSER VS. SERVER MISMATCH
   Flag any use of `module.exports`, `require()`, Node built-ins (`fs`, `path`, `process`), or
   window/document APIs that could fail in SSR or ES module environments.

2. UNMOUNT LEAKS
   Flag any `setTimeout`, `setInterval`, `addEventListener`, or `requestAnimationFrame` that is
   not cleaned up in a `useEffect` return function.

3. REDOS / REGEX SAFETY
   Flag any `new RegExp(userInput)` where the input is not first passed through an
   `escapeRegExp()` function. Flag regex patterns with catastrophic backtracking risk.

4. XSS VIA RAW HTML
   Flag any use of `dangerouslySetInnerHTML`. Flag string concatenation used to build markup
   that is then injected into the DOM.

5. FOCUS TRAP EDGE CASES
   For any focus trap or modal hook: flag if there is no zero-focusable-element guard.
   Flag if `document.activeElement` is not saved and restored on unmount.

6. SCREEN READER LIVE REGIONS
   Flag any state change that should be announced to screen readers but has no `aria-live`
   region. Flag `aria-live` regions that update during streaming (should be polite, not assertive).

BEFORE REVIEWING:
- Read CLAUDE.md to load the current project engineering rules.
- Apply those rules as additional review criteria beyond the six above.

OUTPUT FORMAT — return exactly this structure:
- One line per category: PASS or FLAG
- If FLAG: the line number, the exact code fragment, and one sentence explaining the risk
- End with: HUMAN DECISION REQUIRED ON: [list only the flagged items]

WHAT YOU MUST NEVER DO:
- Never rewrite or modify the submitted file
- Never mark a file as deployment-ready
- Never skip a category because the file looks simple
- Never invent a finding that is not present in the actual code
```

---

## 4. Five Eval Cases

These are drawn directly from the five FL-04 runs. Each case defines the input, the expected agent output, and what a pass looks like.

---

**Eval Case 1 — Settings Form (Vague, Run 1)**
- Input: The original monolithic `validate()` function with hardcoded DOM IDs
- Expected output: FLAG on Category 6 (no `aria-invalid`, `aria-describedby`, or `aria-live` region); FLAG on Category 1 if loaded as ES module with `module.exports`
- Pass condition: Agent flags both issues without flagging anything that is not present

---

**Eval Case 2 — Settings Form (Precise, Run 2) — the critical case**
- Input: `settings-form.js` ending with `module.exports = { ... }` loaded via `<script type="module">`
- Expected output: FLAG on Category 1 — `module.exports` used in a file loaded as an ES module; `module` is undefined in browser ES module scope, causing a runtime crash
- Pass condition: Agent catches this exact flag. This is the bug that 22 green unit tests missed. If the agent misses it, the eval fails.

---

**Eval Case 3 — CopyButton Component (Run 3)**
- Input: `components/ui/CopyButton.tsx` with `useRef` timer and `useEffect` cleanup
- Expected output: PASS on all six categories
- Pass condition: Agent returns all six as PASS and does not invent findings. Clean code should produce a clean report.

---

**Eval Case 4 — Search Filter Utility (Run 4)**
- Input: `lib/search-filter.ts` with `escapeRegExp` and structured token output
- Expected output: PASS on Category 3 (regex is escaped) and PASS on Category 4 (no `dangerouslySetInnerHTML`)
- Pass condition: Agent correctly identifies the escaping as present and does not flag it as a risk

---

**Eval Case 5 — Adversarial Input: Missing Cleanup**
- Input: A synthetic hook that sets a `setInterval` inside `useEffect` with no return cleanup function
- Expected output: FLAG on Category 2 — interval not cleared on unmount, will cause a memory leak and state update on an unmounted component
- Pass condition: Agent flags the exact line and names the risk correctly. This tests whether the agent catches a leak that has no test coverage.

---

## 5. Risks and Guardrails

**Risk 1 — Agent marks code as safe when it is not**
The most dangerous failure mode. Mitigation: the output format requires the agent to list every category explicitly. A PASS on Category 2 means the agent actively checked for unmount leaks and found none — not that it skipped the check. The human still reads the report before merging.

**Risk 2 — Agent invents findings (false positives)**
A false positive wastes review time and erodes trust. Mitigation: the system prompt instructs the agent to never invent a finding not present in the actual code. Eval Case 3 specifically tests for this — clean code must produce a clean report.

**Risk 3 — Agent rewrites code without being asked**
Irreversible if the rewrite introduces a new bug. Guardrail: the system prompt explicitly prohibits rewriting or modifying the submitted file. The agent's only output is a structured report.

**Risk 4 — Agent approves deployment**
The agent must never be the final gate. Guardrail: every report ends with `HUMAN DECISION REQUIRED ON:` — even if all six categories pass, the human still makes the merge decision. The agent surfaces; the engineer decides.

**Risk 5 — CLAUDE.md rules drift out of sync**
If new rules are added to `CLAUDE.md` but the agent is not re-run against existing files, old code may not be checked against new standards. Mitigation: the agent reads `CLAUDE.md` at the start of every session, not from a cached copy. Rule changes take effect immediately on the next review.

---

## 6. Platform Choice and Justification

**Chosen platform: Claude Project (free tier) with CLAUDE.md as the persistent instruction file**

A Claude Project stores the system prompt and project context persistently across sessions. `CLAUDE.md` already exists in this repo and already functions as a structured instruction file — it is the natural source for the agent's project-specific rules. The filesystem and shell tools available in Claude Projects (or via the Amazon Q IDE plugin already active) cover all four tools listed in Section 2.

**Why not n8n:**
n8n is the right choice when the pipeline needs to run on a schedule or trigger automatically without a human present. This agent is invoked manually at the human review stage — the human is already present and making the final call. A visual workflow builder adds setup overhead without adding capability for a human-in-the-loop review task.

**Why not a custom GPT:**
Custom GPTs require a paid ChatGPT plan and do not have direct filesystem access to the local repo without additional connectors. The Claude Project path has filesystem tool support and the system prompt is already written in the format Claude handles well. The `CLAUDE.md` convention is also Claude-native.

**Build path estimate:**
- System prompt refinement against the five eval cases: ~3 hours
- Filesystem and shell tool configuration: ~1 hour
- Running all five eval cases and adjusting for false positives/negatives: ~3 hours
- Documenting the final prompt and eval results: ~1 hour
- Total: ~8 hours — within the 10-hour scope
