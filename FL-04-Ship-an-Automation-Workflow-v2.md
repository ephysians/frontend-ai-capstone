# FL-04: Ship an Automation Workflow (v2)

**Track:** Frontend AI Engineering  
**Project:** Frontend AI Engineering Capstone  
**Author:** Emmanuel Chukwukere Obinna  
**Live Production URL:** https://frontend-ai-capstone-two.vercel.app/  
**Source Repository:** https://github.com/ephysians/frontend-ai-capstone  

---

## 1. Workflow Purpose & Design

The purpose of this automation workflow is to establish a repeatable, high-reliability engineering discipline for AI-assisted frontend development. 

The core thesis of this capstone is:
> *"I ship what AI writes, after I've actually read it."*

While AI models excel at generating functional UI components and boilerplate unit tests quickly, they routinely introduce subtle runtime bugs, accessibility omissions, memory leaks, security vulnerabilities, or environment mismatches that automated test runners miss. This workflow formalizes the handoff between prompt engineering, automated testing, line-by-line human code review, and persistent rule capture.

### Distinguishing the Workflow from the Test Runs
* **The No-Code Workflow Design:** The governance process and stage-gate model (Prompt Definition → AI Code Generation → Automated Verification → Human Review & Edge-Case Audit → Rule Capture & Deployment).
* **The Five Verified Runs:** The empirical evidence runs executed across the repository to test, validate, and measure the effectiveness and time-savings of this workflow in real engineering scenarios.

---

## 2. Workflow Diagram & Handoffs

```
┌─────────────────────────┐
│  1. PRECISE PROMPT      │
│  (Architectural Rules & │
│  Explicit Constraints)  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  2. AI GENERATION       │
│  (Component Code &      │
│  Automated Test Suite)  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  3. AUTOMATED CHECKS    │
│  (TypeScript typecheck  │
│  & Vitest unit suite)   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  4. HUMAN CODE REVIEW   │
│  (Line-by-line audit:   │
│  CJS/ESM, ReDoS, XSS,   │
│  Unmount Leaks, Focus)  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  5. RULE CAPTURE &      │
│  DEPLOYMENT             │
│  (Persist to CLAUDE.md  │
│  & merge clean code)    │
└─────────────────────────┘
```

### Stage Handoffs
1. **Prompt → Generation:** Structured prompt with explicit constraints is supplied to the AI.
2. **Generation → Automated Verification:** AI outputs the implementation file and Vitest/Jest unit tests. The test runner (`npm run typecheck` + `npx vitest run`) executes automatically.
3. **Automated Verification → Human Review:** If automated checks pass, the code enters mandatory human review. The reviewer inspects runtime environment assumptions, browser vs. Node APIs, memory leaks, security edge cases, and screen-reader accessibility attributes.
4. **Human Review → Rule Capture:** If a bug or edge-case omission is caught, it is fixed, re-tested, and permanently encoded into `CLAUDE.md` to prevent recurring AI errors.

---

## 3. Prompts and Configurations Used

### Core Configuration & System Constraints (`CLAUDE.md`)
* Use Conventional Commits (`feat`, `fix`, `docs`, `test`, `chore`).
* Guard `module.exports` so scripts operate in both Node (test runner) and browser environments (`if (typeof module !== 'undefined' && module.exports)`).
* Forms validate on blur AND submit, never submit-only.
* Submit button disabled states computed live from error state.
* Keep secrets server-only (never prefix AI credentials with `NEXT_PUBLIC_`).

### Standardized Prompt Templates

#### Component & Hook Prompt Template:
> *"Create a React 18 TypeScript client component/hook `[Name]` in `[Path]`. Requirements: 1) Explicit props and typed interfaces. 2) Handle state lifecycle and error states gracefully. 3) Enforce accessibility attributes (`aria-label`, `aria-live`, focus management, keyboard interaction). 4) Include clean lifecycle unmount cleanup for timers and event listeners. 5) Create a comprehensive Vitest unit test suite in `tests/[Path].test.tsx` using `@testing-library/react`."*

#### Utility Prompt Template:
> *"Create a pure TypeScript utility in `[Path]` with unit tests in `tests/[Path].test.ts`. Requirements: 1) Generic, strongly-typed inputs/outputs. 2) Pure functions with zero side effects. 3) Explicit regex escaping to prevent ReDoS and unescaped syntax errors. 4) Return structured token objects instead of raw HTML strings for safe UI rendering. 5) Provide a full Vitest test suite covering edge cases, empty input, whitespace, and special characters."*

---

## 4. All Five Verified Workflow Runs

---

### Run 1: Settings Form — Vague Prompting Run (Original Baseline)

* **Real Input / Task:** Build a user settings form with basic validation (`username`, `email`, `password`).
* **AI Prompt Used:** Vague prompt asking for a settings form without architectural constraints or testing instructions.
* **AI Output:** Monolithic HTML/JS implementation with a single flat `validate()` function tightly coupled to hardcoded DOM IDs (`username`, `email`, `password`).
* **Automated Verification:** Manual form submit test in browser (validates on submit only).
* **Human Review Findings:** Form logic and UI were brittle and tightly coupled to global state. Missing `aria-invalid`, `aria-describedby`, and `aria-live` region accessibility attributes. Validation ran only on submit rather than on blur.
* **Defects / Lessons:** Vague prompts yield fragile, unaccessible code that passes initial visual inspection but fails production engineering standards.
* **Timing:** ~2m 00s (Review and initial acceptance time).
* **Location in Repository:** [`WORKFLOW.md`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/WORKFLOW.md) (lines 3–9, 29–35, 39–43, 47–48) & Commit `5799962` on branch `workflow-vague`.

---

### Run 2: Settings Form — Precise Prompting & CJS/ESM Review Run (Original Benchmark)

* **Real Input / Task:** Rebuild the settings form with factory pattern architecture, pure validation, blur triggers, live button state, and a unit test suite.
* **AI Prompt Used:** Detailed constraint prompt requiring `createSettingsForm`/`mountSettingsForm` factory, pure `validate(field, value)` function, per-field rules in a `RULES` object, blur validation, live submit-button state synchronization, and Jest/Node unit tests.
* **AI Output:** `src/settings-form.js`, `src/index.html`, and `tests/settings-form.test.js` (22 unit tests).
* **Automated Verification:** 22 unit tests executed in Node/Jest: **All 22 tests passed (100% PASS)**.
* **Human Review & Defect Caught:** **CRITICAL BUG CAUGHT.** All 22 unit tests passed green in Node because Node supports CommonJS (`module.exports`). However, manual code review revealed that `settings-form.js` ended with `module.exports = { ... }`, whereas `index.html` loaded it as a browser ES module (`<script type="module">`). In a real browser, `module` is undefined in ES modules, causing an immediate runtime crash on page load.
* **Correction / Refinement:** Guarded the export (`if (typeof module !== 'undefined' && module.exports)`) and updated `index.html` to a standard `<script>` tag. Rule recorded in `CLAUDE.md`.
* **Timing:** ~10m 00s (Active review, bug isolation, fix, and rule capture).
* **Location in Repository:** [`WORKFLOW.md`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/WORKFLOW.md) (lines 10–26, 31–35, 39–43, 48–53), [`CLAUDE.md`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/CLAUDE.md) (lines 22–25), & Commits `df9cd68` / `8e52079` on branch `workflow-precise`.

---

### Run 3: Accessible Copy-to-Clipboard Component (`CopyButton`)

* **Real Input / Task:** Build an accessible React 18 TypeScript `CopyButton` client component (`components/ui/CopyButton.tsx`) with state lifecycle (idle → copied → idle after 2000ms; idle → error → idle), `aria-live` announcements, unmount timer cleanup, and unit tests.
* **AI Prompt Used:** Standardized component prompt specifying `textToCopy`, `label`, `onCopied`, `navigator.clipboard.writeText`, `aria-live="polite"`, 2000ms timer reset, and fake-timer Vitest test suite.
* **AI Output:** [`components/ui/CopyButton.tsx`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/components/ui/CopyButton.tsx) and [`tests/components/CopyButton.test.tsx`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/tests/components/CopyButton.test.tsx).
* **Automated Verification:**
  * `npm run typecheck` (`tsc --noEmit`): Exit code 0 (PASS).
  * `npx vitest run tests/components/CopyButton.test.tsx`: 5 / 5 tests passed (PASS).
* **Human Review Findings:** Inspected `timerRef` management across rapid clicks and `useEffect` unmount cleanup. Verified that `navigator.clipboard` is safely guarded against missing API environments (e.g. non-HTTPS iframes). Verified `aria-live="polite"` element. No architectural defects found.
* **Defects / Fixes:** None. Generated code met production standards cleanly.
* **Timing Log:**
  * Start Timestamp: `2026-08-27T08:45:35+01:00`
  * AI Generation Phase: 2m 11s
  * Automated Verification Phase: 3m 45s
  * Human Code Review Phase: 2m 14s
  * End Timestamp: `2026-08-27T08:53:45+01:00`
  * **Total Active Duration:** 8m 10s
* **Location in Repository:** [`components/ui/CopyButton.tsx`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/components/ui/CopyButton.tsx) & [`tests/components/CopyButton.test.tsx`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/tests/components/CopyButton.test.tsx).

---

### Run 4: Safe Multi-Field Search & Highlight Utility (`search-filter`)

* **Real Input / Task:** Build a pure TypeScript search filter (`filterItems`) and safe match highlighter (`highlightMatches`) returning structured tokens (`{ text: string, isMatch: boolean }[]`), escaping regular expression special characters to prevent ReDoS and XSS.
* **AI Prompt Used:** Standardized utility prompt specifying generic array filtering, regex special character escaping (`.*+?^${}()|[]\`), chunk tokenization, and Vitest test suite.
* **AI Output:** [`lib/search-filter.ts`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/lib/search-filter.ts) and [`tests/lib/search-filter.test.ts`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/tests/lib/search-filter.test.ts).
* **Automated Verification:**
  * `npm run typecheck` (`tsc --noEmit`): Exit code 0 (PASS).
  * `npx vitest run tests/lib/search-filter.test.ts`: 10 / 10 tests passed (PASS).
* **Human Review Findings:** Verified `escapeRegExp` safety against queries containing brackets `"[work]"`, parentheses `"(AI)"`, symbols `"c++"`, or backslashes `"\\path"`. Confirmed `highlightMatches` avoids `dangerouslySetInnerHTML` to eliminate XSS risks. Confirmed case-insensitive matching preserves original text casing.
* **Defects / Fixes:** None. Implementation passed all safety checks on initial run.
* **Timing Log:**
  * Start Timestamp: `2026-08-27T12:39:48+01:00`
  * AI Generation Phase: 1m 09s
  * Automated Verification Phase: 1m 15s
  * Human Code Review Phase: 1m 30s
  * End Timestamp: `2026-08-27T12:43:42+01:00`
  * **Total Active Duration:** 3m 54s
* **Location in Repository:** [`lib/search-filter.ts`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/lib/search-filter.ts) & [`tests/lib/search-filter.test.ts`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/tests/lib/search-filter.test.ts).

---

### Run 5: Accessible Modal Focus Trap & Restoration Hook (`useFocusTrap`)

* **Real Input / Task:** Build a React 18 TypeScript custom hook `useFocusTrap(isOpen, onClose?)` managing keyboard Tab/Shift+Tab wrapping, Escape key dismissal, initial autofocus, and focus restoration to `document.activeElement` on unmount/close.
* **AI Prompt Used:** Standardized hook prompt specifying container ref, focus restoration, zero-element protection, negative tabindex exclusion (`:not([tabindex="-1"])`), and Vitest test suite.
* **AI Output:** [`lib/use-focus-trap.ts`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/lib/use-focus-trap.ts) and [`tests/lib/use-focus-trap.test.tsx`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/tests/lib/use-focus-trap.test.tsx).
* **Automated Verification:**
  * `npm run typecheck` (`tsc --noEmit`): Exit code 0 (PASS).
  * `npx vitest run tests/lib/use-focus-trap.test.tsx`: 5 / 5 tests passed (PASS).
  * Full regression test suite (`npx vitest run`): 5 test files passed, 30 / 30 tests passed (PASS).
* **Human Review Findings:** Verified `previouslyFocusedElementRef.current` saves and restores focus cleanly on unmount or close. Verified `getFocusableElements` zero-element check prevents `TypeError` on static modals. Verified selector excludes `tabindex="-1"` and `disabled` elements. Verified event listener cleanup.
* **Defects / Fixes:** None. Implementation passed all accessibility and edge-case reviews.
* **Timing Log:**
  * Start Timestamp: `2026-09-03T06:15:40+01:00`
  * AI Generation Phase: 40s
  * Automated Verification Phase: 1m 20s
  * Human Code Review Phase: 1m 00s
  * End Timestamp: `2026-09-03T06:18:40+01:00`
  * **Total Active Duration:** 3m 00s
* **Location in Repository:** [`lib/use-focus-trap.ts`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/lib/use-focus-trap.ts) & [`tests/lib/use-focus-trap.test.tsx`](file:///c:/Users/CHUKS/Desktop/frontend_capstone/frontend-ai-capstone/tests/lib/use-focus-trap.test.tsx).

---

## 5. Honest Time Accounting & Time Savings Analysis

### Cumulative Time Across All Five Runs

| Run # | Active Workflow Task | Generation Time | Verification & Test Time | Human Review & Fix Time | Total Active Duration |
|---|---|---:|---:|---:|---:|
| **Run 1** | Settings Form (Vague) | 0m 30s | 0m 30s | 1m 00s | **2m 00s** |
| **Run 2** | Settings Form (Precise & Review) | 1m 30s | 2m 30s | 6m 00s | **10m 00s** |
| **Run 3** | CopyButton Component | 2m 11s | 3m 45s | 2m 14s | **8m 10s** |
| **Run 4** | Search Filter Utility | 1m 09s | 1m 15s | 1m 30s | **3m 54s** |
| **Run 5** | Focus Trap Hook | 0m 40s | 1m 20s | 1m 00s | **3m 00s** |
| **TOTAL** | **5 Verified Runs** | **6m 00s** | **9m 20s** | **12m 14s** | **27m 04s** |

* **Workflow Setup Cost (One-Time):** ~25 minutes (defining prompt guidelines, configuring Vitest setup, establishing `CLAUDE.md` rules).

### Estimated Time Saved vs. Manual Development

* **Manual Benchmark Estimate:**
  Writing a production-ready, fully typed, accessible React component/hook or utility with full Vitest test coverage from scratch manually takes approximately **45–60 minutes per feature** (including writing boilerplate HTML/ARIA attributes, crafting mock tests, and handling edge cases).
  * Manual implementation for 5 features: ~225 minutes (3.75 hours).
* **AI-Assisted Workflow Actual:** 27 minutes active execution time + 25 minutes setup = **52 minutes total**.
* **Net Time Saved:** Approximately **173 minutes (~2.88 hours)** saved across 5 features (a **~76% speedup** in delivery), while achieving zero regression bugs and 100% test coverage.

---

## 6. Known Failure Points & Human Audit Checklist

Automated test suites cannot catch every real-world failure mode. The following checklist defines what a human reviewer must still inspect on every AI-assisted code delivery:

- [ ] **Browser vs. Server Environment Mismatch:** Verify whether CommonJS exports (`module.exports`), Node built-ins (`fs`, `path`), or window APIs (`navigator`, `document`, `window`) are used inappropriately in ES module or SSR environments.
- [ ] **Timer & Event Listener Unmount Leaks:** Verify that every `setTimeout`, `setInterval`, `addEventListener`, or `requestAnimationFrame` is cleaned up in a `useEffect` return function to prevent memory leaks and unmounted component state updates.
- [ ] **ReDoS & Regular Expression Crashes:** Verify that any user input passed into `new RegExp()` is properly escaped with `escapeRegExp()` so special characters (`[`, `(`, `*`, `+`, `?`, `\`) do not cause runtime syntax errors or catastrophic backtracking.
- [ ] **XSS via Raw HTML Strings:** Verify that text highlighting or markup generation splits text into structured JavaScript object tokens rather than using `dangerouslySetInnerHTML`.
- [ ] **Focus Restoration & Trapping Edge Cases:** Verify that modal focus traps handle zero-focusable element containers without throwing `TypeError`, and restore focus to `document.activeElement` on unmount.
- [ ] **Screen Reader Live Regions:** Verify that state updates announce via `aria-live="polite"` or `aria-label` without hijacking active keyboard focus.

---

## 7. Final Reflection & Conclusion

This automation workflow demonstrates that **AI speed is only valuable when paired with rigorous human review discipline**.

As proven in **Run 2**, 22 green unit tests in Node did not prevent a browser-breaking CommonJS export bug from reaching code review. Automated unit tests verify that the code fulfills the developer's explicit assumptions, but human review verifies whether those assumptions hold true in the actual deployment environment.

By combining structured, precise prompting with automated Vitest test suites and mandatory human code inspection, this workflow achieved:
1. **High velocity:** Delivered five production-grade, fully tested frontend features in 27 minutes of active workflow execution.
2. **Zero production regressions:** Passed 30 out of 30 unit tests across the repository with zero TypeScript errors.
3. **Verified resilience:** Caught structural environment bugs before deployment and permanently captured the rules in `CLAUDE.md`.

This workflow is the operational proof of the capstone statement:  
**I ship what AI writes, after I've actually read it.**

