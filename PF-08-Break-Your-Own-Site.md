# PF-08 — Break Your Own Site

**Live site:** https://frontend-ai-capstone-two.vercel.app/

---

## How I tested

- Submitted the contact form empty, with whitespace-only fields, with a garbage email (`abc`, `abc@`, `abc@abc`), with a valid-format fake email, and with a 2001-character message
- Clicked every link on every page including the Backlog Tracker demo, GitHub, LinkedIn, and CV links
- Opened the site in a second browser profile with no cookies
- Tested the chat with an empty send, a very long message, rapid repeated sends, and the stop button mid-stream
- Opened `/experience?fallback=1` to verify the static fallback renders
- Checked all nav links on mobile viewport

---

## Findings

### Fix-now

| # | Where | What broke | Fix applied |
|---|-------|------------|-------------|
| 1 | `/contact` — email field | Client showed "Email is required" even when the user typed an invalid format like `abc@abc` and moved on — the server caught it but the client gave no format-specific feedback until after a failed submit | Added client-side email format validation with a distinct "Please enter a valid email address" error shown on blur |
| 2 | `/contact` — message field | No visible character limit — server rejects at 2000 chars with a generic error, user has no warning before hitting send | Added live character counter (`0/2000`) below the textarea, turns red and shows "Message is too long" when exceeded, submit is blocked client-side |

### Known limitations

| # | Where | Limitation | Why not fixed |
|---|-------|------------|---------------|
| 1 | `/contact` — email field | A valid-format but non-existent email (e.g. `test@test.com`) passes all validation and sends — there is no way to verify email existence without a third-party service | Acceptable for a portfolio contact form; Resend delivers to the real address regardless |
| 2 | `/chat` | The AI assistant has no memory between page reloads — conversation history is lost on refresh | By design; the route is stateless and this is a portfolio demo, not a product |
| 3 | `/experience` | The 3D scene requires WebGL — on devices or browsers where WebGL is blocked or unavailable, the static fallback renders instead | The fallback is intentional and documented; `/experience?fallback=1` is linked on the page |
| 4 | Rate limiting on `/api/chat` | The in-memory rate limiter is instance-local on Vercel serverless — in a multi-instance scenario a single client could exceed the limit across instances | Documented in README; acceptable for a low-traffic portfolio site |

---

## SEO and speed

### Meta
- `title`, `description`, `og:title`, `og:description`, `og:url`, `og:type`, `twitter:card` all set in `app/layout.tsx` ✅
- Favicon: `app/icon.svg` — dark square with "e" lettermark ✅
- Verifiable at https://www.opengraph.xyz/ using the live URL

### Speed
Run PageSpeed Insights at https://pagespeed.web.dev/ on the live URL.
Previous mobile Lighthouse scores recorded in AUDIT.md: 69 (home), 87 (chat), 70 (experience), 87 (work).
No new performance regressions introduced by this task's changes.

### Findability
Searching "Emmanuel Chukwukere Obinna frontend" returns the GitHub repo and Vercel deployment. The site is indexed.

---

## Links verified

| Link | Status |
|------|--------|
| https://backlog-tracker-app.vercel.app | ✅ Live |
| https://github.com/ephysians | ✅ Live |
| https://www.linkedin.com/in/emmanuel-chuks/ | ✅ Live |
| https://drive.google.com/file/d/1VvD_wMLWODIBU7GwzYctUpJjKQotFfWK/view | ✅ Live |
| All internal nav links (/, /work, /experience, /about, /contact, /chat) | ✅ All resolve |

---

## Files changed

| File | Change |
|------|--------|
| `app/contact/page.tsx` | Added client-side email format validation + live message character counter |
