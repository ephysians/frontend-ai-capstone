# FL-07: Build the Agent — Build Log

**Track:** General AI Fluency
**Code:** FL-07
**Author:** Emmanuel Chukwukere Obinna
**Live Production URL:** https://frontend-ai-capstone-two.vercel.app/
**Source Repository:** https://github.com/ephysians/frontend-ai-capstone
**Agent:** Frontend Code Review Agent (designed in FL-06)

---

## Platform Deviation: Claude Project → Amazon Q Developer (IDE)

**Spec said:** Claude Project (free tier) with CLAUDE.md as the persistent instruction file.

**What actually happened:** Claude Projects require a paid Claude Pro subscription ($20/month). The free tier does not include Projects. This was not confirmed before writing the FL-06 spec.

**What I used instead:** Amazon Q Developer IDE plugin (VS Code), already active and already proven in FL-05. Amazon Q exposes the same tool primitives the spec required — `fsRead` (read_file), `executeBash` (run_command) — via MCP, connected live to the local repository.

**Why this is a valid substitution:**
- The FL-06 spec explicitly listed Amazon Q as the access plan for all four tools: *"All tools are available today via the Amazon Q Developer IDE plugin."*
- The agent's system prompt, checklist, and output format are identical to the spec — only the hosting platform changed.
- The live tool connections (filesystem reads of `CLAUDE.md`, `CopyButton.tsx`, `search-filter.ts`, `use-focus-trap.ts`, `use-leak-hook.ts`) are real MCP tool calls, not simulated responses.

---

## What Was Cut from the Spec

**Cut: `run_command` tool (npm run typecheck + npx vitest run)**

The spec listed shell execution as a tool. In practice, the agent's value is in the semantic review — catching CJS/ESM mismatches, unmount leaks, ReDoS patterns, and accessibility gaps that test runners cannot catch. Running the test suite is already part of the FL-04 automated verification stage that happens *before* the agent is invoked. Adding it to the agent run would duplicate a step that already passed.

**Decision:** The agent reads files and applies the checklist. Test execution stays in the automated verification stage where it belongs. This is a scope tightening, not a capability loss.

---

## Build Iterations

**Iteration 1 — System prompt too broad**
First draft of the checklist included "check for TypeScript errors." Removed immediately — TypeScript errors are caught by `npm run typecheck` before the agent is ever invoked. The agent's job is the six categories that *automated tools cannot catch*. Keeping TypeScript in the checklist would produce noise and erode trust in the report.

**Iteration 2 — Eval Case 1 input clarification**
The vague settings form from Run 1 no longer exists as a file in the repo — it was a documented baseline, not a committed artifact. Resolved by reading its documented properties from `WORKFLOW.md` Run 1 and applying the checklist to the described code. The agent correctly flagged Category 6 and the CLAUDE.md blur-validation rule from the description alone.

**Iteration 3 — Eval Case 2 confirmation**
The critical test: does the agent catch the CJS/ESM bug that 22 unit tests missed? Yes. The agent flagged `module.exports` used in a file loaded as `<script type="module">` and named the exact runtime failure — `module` is undefined in browser ES module scope. This is the core proof that the agent adds value beyond the test runner.

**Iteration 4 — False positive check (Cases 3 and 4)**
Clean code must produce a clean report. Both `CopyButton.tsx` and `search-filter.ts` returned all six categories as PASS with no invented findings. The `escapeRegExp` call in `search-filter.ts` was correctly identified as present and safe — the agent did not flag it as a risk.

**Iteration 5 — Adversarial case (Case 5)**
`use-leak-hook.ts` was created specifically for this eval — a `setInterval` inside `useEffect` with no return cleanup. The agent flagged it at the correct line, named the exact risk (memory leak + setState on unmounted component), and provided the correct fix pattern (`const id = setInterval(...); return () => clearInterval(id)`).

---

## Eval Results

| Eval Case | Input | Expected | Result |
|---|---|---|---|
| Case 1 — Vague form | Monolithic validate(), submit-only | FLAG Cat 6 + CLAUDE.md | ✅ PASS |
| Case 2 — CJS/ESM bug | module.exports + script type="module" | FLAG Cat 1 + CLAUDE.md | ✅ PASS — critical case |
| Case 3 — CopyButton | Clean component with proper cleanup | All PASS, no false positives | ✅ PASS |
| Case 4 — Search filter | Clean utility with escapeRegExp | All PASS, no false positives | ✅ PASS |
| Case 5 — Leak hook | setInterval with no cleanup | FLAG Cat 2 at exact line | ✅ PASS |

**5 / 5 eval cases passed.**

---

## Live Tool Connections Used

| Tool | MCP Call | File Read |
|---|---|---|
| `fsRead` | ✅ | `CLAUDE.md` — loaded at session start |
| `fsRead` | ✅ | `WORKFLOW.md` — source for Cases 1 and 2 |
| `fsRead` | ✅ | `components/ui/CopyButton.tsx` — Case 3 |
| `fsRead` | ✅ | `lib/search-filter.ts` — Case 4 |
| `fsRead` | ✅ | `tests/lib/use-leak-hook.ts` — Case 5 |

All reads are live filesystem tool calls against the local repository. No file content was pasted or cached.

---

## Run Capture

A raw, unedited screen recording of the full end-to-end agent run (all 5 eval cases, CLAUDE.md load, tool calls, and structured reports) was captured during the live session using the Windows Snipping Tool video recorder.

The recording shows:
- `fsRead` tool call on `CLAUDE.md` (project rules loaded)
- `fsRead` tool call on `WORKFLOW.md` (Cases 1 and 2 sourced)
- Structured report for Case 1: FLAG Category 6 + CLAUDE.md rule
- Structured report for Case 2: FLAG Category 1 + CLAUDE.md rule (the critical CJS/ESM catch)
- `fsRead` tool call on `CopyButton.tsx` + all-PASS report (Case 3)
- `fsRead` tool call on `search-filter.ts` + all-PASS report (Case 4)
- `fsRead` tool call on `use-leak-hook.ts` + FLAG Category 2 at exact line (Case 5)

---

## What the Agent Does Well

- Catches the CJS/ESM mismatch that unit tests cannot catch (proven in Case 2)
- Produces clean reports on clean code — no false positives (Cases 3 and 4)
- Catches unmount leaks at the exact line with the correct fix pattern (Case 5)
- Reads `CLAUDE.md` live at session start — rule changes take effect immediately

## What the Agent Cannot Do

- It cannot run the test suite — that stays in the automated verification stage
- It cannot verify runtime behavior in a real browser — only static analysis
- It cannot catch bugs that require execution context (e.g. race conditions, network timing)
- It is only as good as the checklist — new failure categories must be added manually to the system prompt and to `CLAUDE.md`

## Human Review Is Still Required

The agent surfaces findings. The engineer decides. Every report ends with `HUMAN DECISION REQUIRED ON:` — even a clean all-PASS report does not mean the code is deployment-ready. The agent is a faster, more consistent first pass. It is not a replacement for the human review stage.
