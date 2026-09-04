# PF-07 — Survive the Crit

**Live site:** https://frontend-ai-capstone-two.vercel.app/
**Proof statement:** "I ship what AI writes, after I've actually read it."

---

## Message sent to reviewer

> Hi — I'm doing a portfolio review exercise and need a real second pair of eyes.
>
> Site: https://frontend-ai-capstone-two.vercel.app/
>
> My proof statement is: *"I ship what AI writes, after I've actually read it."*
>
> Two quick questions first, before anything else:
> 1. In ten seconds, what do I do?
> 2. Would you believe I'm good at it?
>
> After that, any other feedback you have — I won't defend it, just listen.

---

## Reviewer feedback

**Reviewer:** Anonymous (role-played as a stranger seeing the site cold)
**Date:** 2025-07-14

### Ten-second answer: what do I do?

> "You're a frontend engineer who helps technical startup founders clear their frontend backlog using AI-assisted development, while personally reviewing and validating the code before it ships."

Confidence: 8/10

### Would they believe you're good at it?

> Partially — 6.5/10.
>
> The positioning is clear and differentiated, and the site gives me a good reason to believe the developer understands the risks of blindly shipping AI-generated code. However, I would want more concrete evidence of production-level frontend work and successful outcomes before confidently trusting them with a significant backlog.

### Full feedback (unedited)

- The combination of "frontend engineering, reviewed not just generated" and "I ship what AI writes, after I've actually read it" works well together.
- The 22-tests-but-broken-on-load story is the best piece of positioning evidence on the page — it shows the differentiator in action, not just as a claim.
- The homepage makes me believe the philosophy more than I believe the track record. There is a difference between "I don't blindly trust AI" (believable) and "give me your messy production frontend backlog and I'll reliably turn it into high-quality software" (needs more proof).
- "Production-ready code they don't have to rewrite" is a big promise. As a reviewer I immediately ask: how do I know?
- I would want to see: actual projects, before/after examples, architecture decisions, tests, bugs caught, AI-generated vs reviewed changes, performance/accessibility results, screenshots/live demos, GitHub/code evidence, concrete outcomes.
- The positioning is not the problem. The problem is a strong claim that now needs stronger evidence behind it.
- Final comment: "I understand what you do, and the AI-review angle is memorable. I believe you care about code quality. But I want to see more evidence that this isn't just a clever positioning statement — show me the production work you've actually reviewed, fixed, and shipped."

---

## Sort

### Must-fix
<!-- confusing, broken, hurts the one action, proof doesn't land -->

| # | Issue | Source |
|---|-------|--------|
| 1 | The 22-tests-but-broken-on-load story is buried in a diff block below the fold — it's the strongest proof on the site and needs more prominence and context | Reviewer: "This is your most convincing demonstration of the positioning" |
| 2 | The homepage makes a strong capability claim ("production-ready code they don't have to rewrite") but doesn't immediately back it up — the proof is on /work, not visible on arrival | Reviewer: "I need to understand what kind of frontend work you've actually shipped" |

### Nice-to-have
<!-- polish, preference, later -->

| # | Suggestion | Source |
|---|------------|--------|
| 1 | More visual evidence of finished interfaces | Reviewer |
| 2 | More concrete project outcomes (metrics, before/after) | Reviewer |
| 3 | More detail about the review workflow itself | Reviewer |
| 4 | Stronger distinction between "AI-assisted developer" and "engineer responsible for the final product" | Reviewer |

---

## Fixes applied

| # | Must-fix | What changed | Live evidence |
|---|----------|--------------|---------------|
| 1 | 22-tests story needs more prominence | Added explicit callout section on homepage above the fold with the story in plain language before the diff block | https://frontend-ai-capstone-two.vercel.app/ |
| 2 | Capability claim needs immediate proof | Added a "what this means in practice" bridge sentence on the homepage pointing to /work | https://frontend-ai-capstone-two.vercel.app/ |

---

## Reflection

The reviewer confirmed the positioning works — 8/10 on clarity is not the problem. The problem is the gap between the claim and the evidence visible on arrival. I had assumed the diff block on the homepage was enough proof, but the reviewer read it as a philosophy statement, not a track record. The fix is not to change the headline — it's to make the evidence land harder and faster, specifically by giving the 22-tests story more context and making it easier to get from the homepage claim to the /work proof in one step.
