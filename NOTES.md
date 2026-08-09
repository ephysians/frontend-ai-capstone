# NOTES.md — Hand-built vs. shadcn/ui

_Fill this in after actually running `npx shadcn@latest add dialog tabs` and reading the generated source in `components/ui/dialog.tsx` and `components/ui/tabs.tsx`. The points below are real, specific things Radix UI (which shadcn's components are built on) is known to handle, use them as a checklist, verify each against the actual code, and note what you find, don't just copy this file as-is._

## Setup

```bash
npx shadcn@latest init
npx shadcn@latest add dialog tabs
```

## Things to check for in `components/ui/dialog.tsx`

- [ ] **Background inertness.** My hand-built `Modal` dims the backdrop visually but does nothing to the accessibility tree, a screen reader user tabbing or using virtual cursor navigation could still reach content behind the dialog, even though it's visually hidden. Check whether Radix's Dialog marks background content `aria-hidden` or `inert` while open. _(Confirm: does it? How?)_

- [ ] **Outside-click handling.** My version closes on any click on the backdrop via a single `onClick`. Check how Radix distinguishes a genuine outside click from, say, a drag that starts inside the dialog and releases outside (`pointerdown` vs `click` handling). _(Confirm: is there a difference, and does it matter?)_

- [ ] **Dev-time accessibility warnings.** Radix's Dialog often throws a console warning if you don't provide a `Description` or accessible title. My version has no such safeguard, a consumer of my `Modal` could pass no title and I wouldn't catch it. _(Confirm: does shadcn's version warn you?)_

## Things to check for in `components/ui/tabs.tsx`

- [ ] **Orientation support.** My `Tabs` hardcodes Left/Right arrow navigation. The ARIA APG pattern says vertical tab lists should use Up/Down instead. Check whether Radix's Tabs accepts an `orientation` prop and swaps the arrow key mapping accordingly. _(Confirm: does it? What's the prop called?)_

- [ ] **RTL awareness.** In a right-to-left layout, "next tab" should logically follow Left, not Right. Check whether Radix's Tabs reads `dir` context and flips arrow key direction. _(Confirm: does mine handle this at all? No, it doesn't.)_

- [ ] **Loop behavior.** My `Tabs` always wraps from the last tab back to the first on Arrow Right. Check whether Radix makes this configurable (e.g. a `loop` prop) rather than hardcoding it. _(Confirm.)_

## Write your actual findings here

**Gap 1:**
_shadcn's Dialog is a thin wrapper around Radix's DialogPrimitive — nearly all the actual accessibility logic (focus trap, Escape, background inertness) lives inside the Radix package itself, not visible in the file. My Modal.tsx hand-implements that logic directly and visibly, more auditable, but also more exposed to bugs a battle-tested library would have already caught._

**Gap 2:**
_shadcn's DialogContent renders a default close button automatically (with proper sr-only labeling) unless explicitly disabled. My Modal has no built-in close affordance, every usage has to remember to add one._

**Gap 3 (optional):**
_Gap 3: shadcn's Tabs has a real orientation prop (horizontal/vertical) that changes both styling and (per Radix docs) arrow-key direction. My Tabs hardcodes Left/Right only, with no vertical support._


## Honest takeaway
_I'd ship my hand-built version for a small, contained use case like this playground, but not as-is for a real production app. The two things I'd fix first: add a default close button to Modal (right now it's easy to accidentally ship a dialog with no visible way to close it), and add orientation support to Tabs since a vertical tab list is a real, common pattern I didn't account for. The bigger honest gap is background inertness in the modal, I'm not fully certain my version prevents a screen reader from reaching content behind the dialog, and that's exactly the kind of thing a library like Radix has already been tested against by many more people than just me._
