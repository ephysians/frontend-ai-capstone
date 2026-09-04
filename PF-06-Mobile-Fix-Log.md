# PF-06: Open It on Your Phone — Mobile Fix Log

**Track:** General AI Fluency
**Author:** Emmanuel Chukwukere Obinna
**Live URL:** https://frontend-ai-capstone-two.vercel.app/
**Source repository:** https://github.com/ephysians/frontend-ai-capstone

---

## Audit method

Code audit of all pages and components against known mobile failure patterns, followed by live phone testing on the deployed site. AI-assisted audit prompt used: "what's broken on mobile, what's the accessibility problem, why is this slow" — applied to each component in turn.

---

## Fix 1 — iOS Safari zoom on contact form inputs

**What was broken:**
On iOS Safari, any input with a font size below 16px causes the browser to automatically zoom in when the field is focused. The contact form inputs (`name`, `email`, `message`) had no explicit font size set, inheriting `text-sm` (14px) from Tailwind. Every tap on a form field triggered an unwanted zoom that did not reset after typing.

**What I changed:**
Added `style={{ fontSize: '16px' }}` to all three form fields (`input#name`, `input#email`, `textarea#message`) in `app/contact/page.tsx`. This is the same fix already applied to the chat input in `components/Chat.tsx`.

**Files changed:** `app/contact/page.tsx`

---

## Fix 2 — Missing "3d lab" link in mobile navigation

**What was broken:**
The desktop navigation (`components/Nav.tsx`) included five links: work, 3d lab, about, contact, chat. The mobile hamburger menu (`components/MobileMenu.tsx`) only had four — "3d lab" was missing. A visitor on mobile had no way to reach the `/experience` page from the navigation.

**What I changed:**
Added `{ href: '/experience', label: '3d lab' }` to the `LINKS` array in `MobileMenu.tsx` to match the desktop nav exactly.

**Files changed:** `components/MobileMenu.tsx`

---

## Fix 3 — DiffBlock horizontal overflow on narrow screens

**What was broken:**
The `DiffBlock` component renders code lines inside a `<pre>` tag at `text-sm` (14px) with `overflow-x-auto`. On mobile, long lines — particularly the `module.exports` guard line on the `/work` page — caused horizontal scrolling within the block. The text was readable but the layout broke the page flow on screens narrower than 400px.

**What I changed:**
- Changed `text-sm` to `text-xs sm:text-sm` — smaller text on mobile, normal size on larger screens
- Added `whitespace-pre-wrap break-words` — long lines wrap instead of forcing horizontal scroll

**Files changed:** `components/DiffBlock.tsx`

---

## Links checked

All links verified working on mobile:

| Link | Destination | Status |
|---|---|---|
| Review a live demo (home) | `backlog-tracker-app.vercel.app` | ✅ |
| See the work (home) | `/work` | ✅ |
| Open the live app (work) | `backlog-tracker-app.vercel.app` | ✅ |
| Get in touch (work) | `/contact` | ✅ |
| LinkedIn (about) | `linkedin.com/in/emmanuel-chuks/` | ✅ |
| GitHub (about) | `github.com/ephysians` | ✅ |
| CV (about) | Google Drive PDF | ✅ |
| Email (contact) | `mailto:njokuobinna@gmail.com` | ✅ |
| All nav links (mobile menu) | work, 3d lab, about, contact, chat | ✅ |

---

## What was already working

- Responsive layout: all pages use `max-w-4xl px-4 sm:px-6` — correct padding at all widths
- Backlog Tracker image: uses Next.js `<Image>` with `sizes` and `w-full h-auto` — no overflow, no blur
- Mobile hamburger menu: present, accessible, closes on link tap
- Button tap targets: all buttons use `py-3` minimum — adequate touch target size
- Color contrast: dark background `#0F1115` with `#E8EAED` text — ~15:1 ratio, passes WCAG AAA
- Chat input: already had `fontSize: 16px` — no iOS zoom issue

---

## Before / after screenshots

Phone screenshots taken on a real device before and after the fixes are included as file attachments in the submission.
