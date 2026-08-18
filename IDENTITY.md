# Week 3 Deliverable — Consistency, Not Talent

## 1. One-Line Claim

> **I ship what AI writes, after I've actually read it.**

### How it was chosen

AI generated ten options. The shortlist came down to two:

- *"I help technical co-founders ship production-ready frontend without rewriting it."* — accurate but forgettable. Describes the outcome, not the discipline.
- *"I ship what AI writes, after I've actually read it."* — specific, honest, and slightly uncomfortable in the right way. It names the thing most AI-assisted developers skip. A technical co-founder reads that and immediately knows what makes this different.

The second one was already on the homepage. It won because it is the proof statement, not a description of it.

---

## 2. Content Map

### The one action everything ladders to
**Book a call / send an email** — a technical co-founder decides to reach out after seeing enough proof that Emmanuel is worth their time.

---

### Page by page

#### `/` — Home
| Order | Section | Purpose |
|---|---|---|
| 1 | One-line claim + sub-claim | Land the proof statement immediately |
| 2 | Two CTAs | "Review a live demo" (primary) · "See the work" (secondary) |
| 3 | DiffBlock proof snippet | Show, don't tell — the workflow discipline in one diff |

**Named CTA:** Review a live demo → `backlog-tracker-app.vercel.app`
**Ladders to:** Contact via demo → email

---

#### `/work` — Case Studies
| Order | Section | Purpose |
|---|---|---|
| 1 | Section label + headline | "Case studies, not a portfolio grid" — sets expectation |
| 2 | Case 1 (lead): Workflow discipline | Strongest case — concrete bug caught, 22 tests, real outcome |
| 3 | Case 2: Agro-tourism onboarding | In-progress, honest about status |
| 4 | DiffBlock: the caught bug | Visual proof anchoring Case 1 |

**Named CTA:** None explicit — page ends at the DiffBlock. **Gap:** needs a closing CTA sending visitor to `/contact`
**Ladders to:** Contact

---

#### `/about` — Bio
| Order | Section | Purpose |
|---|---|---|
| 1 | Section label + headline | "Straightforward, curious, blunt, human." |
| 2 | One paragraph bio | VertexIQ, agro-tourism platform, AI-as-discipline positioning |

**Named CTA:** None. **Gap:** needs a link to `/work` or `/contact` at the bottom
**Ladders to:** Work or Contact

---

#### `/chat` — AI Assistant
| Order | Section | Purpose |
|---|---|---|
| 1 | Section label + headline | "Ask, don't just read." |
| 2 | Context paragraph | Sets expectation — grounded in case studies, not generic |
| 3 | Chat interface | Starter prompts → conversation → case study cards |

**Named CTA:** Implicit — conversation leads to contact intent
**Gap:** needs a closing nudge ("Convinced? Email works.") below the chat component
**Ladders to:** Contact

---

#### `/contact` — Contact
| Order | Section | Purpose |
|---|---|---|
| 1 | Section label + headline | "See the code before you take a call." |
| 2 | Context paragraph | Directs to demo first, then email |
| 3 | Two CTAs | "Review the live demo" (primary) · "Email instead" (secondary) |
| 4 | Closing line | "Convinced already? Email works." |

**Named CTA:** Email → `njokuobinna@gmail.com`
**Ladders to:** This is the destination — no onward link needed

---

#### `/health` — Live Data Demo
| Order | Section | Purpose |
|---|---|---|
| 1 | Section label + headline | "Live data fetch" |
| 2 | Context paragraph | Explains SSR fetch — honest about what it is |
| 3 | GitHub API data card | Real data, fails visibly if fetch fails |

**Named CTA:** None — this is a proof page, not a conversion page
**Note:** Not in the main nav. Exists as a technical proof point, not a visitor destination

---

### Still need to gather
- [ ] Clean screenshot of the Backlog Tracker UI (for `/work` or homepage — real capture, not generated)
- [ ] Closing CTA added to `/work` page (sends visitor to `/contact`)
- [ ] Closing CTA added to `/about` page (sends visitor to `/work` or `/contact`)
- [ ] Closing nudge below Chat component on `/chat`
- [ ] Testimonial or quote from a client/mentor (optional but would strengthen `/about`)

---

## 3. Identity Kit

### Fonts

| Role | Font | Weight | Where used |
|---|---|---|---|
| Display / Headings | **Sora** | 500, 600, 700 | `h1`, `h2`, page headlines |
| Body | **Inter** | 400, 500 | Paragraphs, UI text |
| Mono / Labels | **JetBrains Mono** | 400 | Code, labels, nav links, buttons, tags |

All three are free on Google Fonts. Already loaded via `next/font/google` — zero layout shift.

**Why this pairing:** Sora is geometric and confident without being loud — it reads as technical but not cold. Inter is the most readable body font on screens at any size. JetBrains Mono signals that this is a developer's site without needing to say so. Three fonts sounds like too many; in practice they occupy completely separate roles and never compete.

---

### Palette

| Token | Hex | Role |
|---|---|---|
| `base` | `#0F1115` | Page background — near-black, slightly blue-tinted |
| `panel` | `#171A21` | Card / surface background — one step lighter than base |
| `ink` | `#E8EAED` | Primary text — near-white, not pure white (reduces glare) |
| `muted` | `#8B93A1` | Secondary text, labels, placeholders |
| `accent` | `#6C7BFF` | Single accent — indigo-blue, links, CTAs, focus rings |
| `add` | `#3FB68B` | Diff add lines only — functional, not decorative |
| `remove` | `#E4572E` | Diff remove lines + error states only — functional |

**Effective palette for a visitor:** 4 colors — `#0F1115`, `#E8EAED`, `#8B93A1`, `#6C7BFF`. The `add` and `remove` colors only appear inside DiffBlocks and error states. They are never used as decoration.

**Contrast check:**
- `ink` `#E8EAED` on `base` `#0F1115` — ratio ~15:1 ✅ (WCAG AAA)
- `muted` `#8B93A1` on `base` `#0F1115` — ratio ~5.5:1 ✅ (WCAG AA)
- `accent` `#6C7BFF` on `base` `#0F1115` — ratio ~4.6:1 ✅ (WCAG AA for large text / UI components)

---

### Logo / Favicon

**Logotype:** `emmanuel.dev` — the nav link, set in JetBrains Mono with the `.` in `#6C7BFF` accent. No icon, no mark. The punctuation is the logo.

**Favicon:** `app/icon.svg` — already in the repo. A minimal SVG served by Next.js automatically.

---

### Style Note (two lines)

Sora headings, Inter body, JetBrains Mono for everything that should feel like a terminal. Near-black background `#0F1115`, near-white text `#E8EAED`, one indigo accent `#6C7BFF` — used only for links, CTAs, and focus states. The work is the color on the page; the site itself stays quiet.

---

### Reusable style reference (paste into AI workspace to keep builds consistent)

```
Fonts: Sora (headings, 500–700), Inter (body, 400–500), JetBrains Mono (labels/code/buttons, 400)
Colors:
  Background:   #0F1115
  Surface:      #171A21
  Text:         #E8EAED
  Muted text:   #8B93A1
  Accent:       #6C7BFF
  Add (diff):   #3FB68B
  Remove/error: #E4572E
Spacing: generous — 16px base, sections separated by 48–96px vertical space
Tone: calm, dark, code-first. The work is the loudest thing on the page.
```

---

## 4. Image Set + Rejection Note

### Images the portfolio actually needs

| Page | Image | Type | Status |
|---|---|---|---|
| `/` | DiffBlock proof snippet | Code UI (real) | ✅ Built — renders from real data |
| `/work` | Backlog Tracker screenshot | Real capture | ⚠️ Still need to gather |
| `/work` | DiffBlock: caught bug | Code UI (real) | ✅ Built — renders from real data |
| `/about` | No image | Text-only | ✅ Deliberate — see reasoning below |
| `/chat` | No image | UI component | ✅ The chat interface is the visual |
| `/contact` | No image | Text-only | ✅ Correct — conversion pages stay clean |

**Total generated images needed: zero.** Every visual on this site is either a real UI component (DiffBlock, CaseStudyCard, Chat) or a real screenshot. That is not a gap — it is the point.

---

### Rejection note

During this exercise, three generated hero image options were considered for the homepage — abstract code visualisations in a dark, glowing style. All three were rejected.

**Why:** They had the exact quality the brief calls "AI slop" — a fake-glass, melted look that signals "this person used a generator and kept the first result." More importantly, they competed with the DiffBlock already on the page. The DiffBlock is a real artefact from real work. A generated abstract image next to it would have made the real thing look less real, not more impressive. A generated image that makes your actual proof look worse is not a design choice — it is a mistake.

The homepage already has its visual: the diff. That is a real screenshot of a real decision. Nothing generated comes close to it.
