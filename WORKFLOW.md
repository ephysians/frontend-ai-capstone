# WORKFLOW.md — Vague vs. Precise Prompting Drill

## Correctness

Round 1 validates on submit only, with a single flat `validate()` function tied
directly to hardcoded DOM IDs (`username`, `email`, `password`). It works, but
it's brittle: the form and its logic are wired together with no separation, so
reusing or testing it means touching global state.

Round 2 is structurally sounder (a `createSettingsForm`/`mountSettingsForm`
factory, a pure `validate(field, value)` function, per-field rules in a `RULES`
object) but it shipped a real bug that 22 passing tests didn't catch: the file
ended with `module.exports = { ... }` (CommonJS), while `index.html` loaded it
with `import { mountSettingsForm } from './settings-form.js'` (ES module
syntax). The test suite runs in Node, where `module.exports` works fine — but
in an actual browser, `module` isn't defined inside an ES module script, so the
import would fail and the form would never render. Tests were green; the app
was broken. That's the single most important thing this drill surfaced: test
coverage on logic doesn't guarantee the code actually runs where it's deployed.
Fixed by guarding the export (`if (typeof module !== 'undefined' && module.exports)`)
and switching `index.html` to a plain `<script>` tag instead of `type="module"`.

There's also a minor encoding bug in round 2 — the display-name error message
originally rendered as `'Display name must be 2ΓÇô50 characters.'`, a mangled
en-dash from a file-save encoding mismatch.

## Accessibility

Neither round is fully accessible. Round 1 has no `aria-invalid` or
`aria-describedby` linking inputs to their error spans, and no `aria-live`
region, so a screen reader wouldn't announce validation errors. Round 2 has
the same gap — its `data-error` targeting is cleaner for JS to update, but it
still isn't wired to `aria-describedby`, so the improvement is structural, not
accessible. More organized code didn't translate to more accessible code
without an explicit ask.

## Edge cases

Round 2 handles several cases round 1 doesn't: blur-triggered validation (round
1 only validates on submit), a disabled-submit state driven by live error
state (`syncSubmitButton`), and explicit length bounds (2–50 chars) on display
name. Round 1's password field also had no complexity rule beyond length, and
notifications weren't a field at all in round 1's scope.

## Review effort

Round 1 took under two minutes to accept — there was nothing to review because
there was nothing to catch (it does what it appears to do, no more). Round 2
looked done at a glance and would have shipped broken if I'd trusted the green
test suite without actually reading the module export vs. import mismatch.
Reviewing round 2 took longer up front, but round 1 would have cost far more
later — no tests, no blur validation, and a monolithic structure that resists
reuse. Net, round 2 is slower to review once and faster for everything after.