# PF-07b — Plant Your Flag: Domain + Badge

**Live site:** https://frontend-ai-capstone-two.vercel.app/

---

## Domain

No custom domain purchased — budget is zero. The Vercel subdomain
`frontend-ai-capstone-two.vercel.app` is used as the clean fallback per the
task brief. The site is fully live over HTTPS on this address.

---

## Analytics

Vercel Analytics installed via `@vercel/analytics` package.

- Package: `@vercel/analytics`
- Component: `<Analytics />` added to `app/layout.tsx`
- Data visible in the Vercel project dashboard under the Analytics tab after
  the first real page visit on the deployed URL.
- No third-party account required — runs on the existing Vercel hobby tier.

**To verify:** Visit https://vercel.com/dashboard → select
`frontend-ai-capstone` project → Analytics tab.

---

## Launch hygiene

### Favicon
`app/icon.svg` — dark square with "e" lettermark and accent dot. Next.js App
Router picks this up automatically as the browser tab icon. ✅

### Page titles
Set in `app/layout.tsx` via the `metadata` export:

```
title: 'Emmanuel Chukwukere Obinna'
```

Applies to all routes as the default. ✅

### Social share preview (OG tags)
Added `openGraph` and `twitter` metadata to `app/layout.tsx`:

- `og:title` — Emmanuel Chukwukere Obinna
- `og:description` — I help technical co-founders drowning in frontend backlog...
- `og:url` — https://frontend-ai-capstone-two.vercel.app
- `og:type` — website
- `twitter:card` — summary

Verifiable at https://www.opengraph.xyz/ or https://cards-dev.twitter.com/validator
using the live URL. ✅

### Phone check
Site previously audited on mobile in PF-06. Three fixes applied then:
iOS zoom on inputs, missing nav link, DiffBlock overflow. No regressions
introduced by this task's changes.

---

## FlyRank graduate badge

Badge component created at `components/Footer.tsx` and rendered in
`app/layout.tsx` inside `<footer>` — visible on every page.

- Links to: https://internship.flyrank.ai/verify?id=E0EE4D3E-334F-4EA8-A625-33E7C6F49642&first_name=Obinna
- Credential ID: E0EE4D3E-334F-4EA8-A625-33E7C6F49642
- Verified credential badge with FlyRank branding rendered in footer ✅

---

## Files changed

| File | Change |
|------|--------|
| `app/layout.tsx` | Added OG/Twitter metadata, `<Analytics />`, `<Footer />` |
| `components/Footer.tsx` | Created — copyright line + FlyRank badge |
| `package.json` | Added `@vercel/analytics` |
