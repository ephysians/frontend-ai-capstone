# PF-05: Make It Do Something — Plain-Words Explainer

**Track:** General AI Fluency
**Author:** Emmanuel Chukwukere Obinna
**Live feature:** https://frontend-ai-capstone-two.vercel.app/contact
**Source repository:** https://github.com/ephysians/frontend-ai-capstone

---

## The feature: a working contact form

The contact page on this portfolio now has a real form. You fill in your name, email, and message, press Send, and the message arrives in my inbox at `njokuobinna@gmail.com`. No email client opens, no third-party service handles it visibly — it just works, end to end.

---

## What a backend is

When you visit a website, your browser downloads files — HTML, CSS, JavaScript — and renders them on your screen. That all happens on your device. That is the frontend.

A backend is the part that runs on a server, not in your browser. It is code that executes somewhere else — in this case, on Vercel's infrastructure — and it can do things your browser cannot: store data, send emails, talk to external services, and keep secrets like API keys away from anyone who might inspect the page source.

The simplest way to think about it: the frontend is what you see and interact with. The backend is what happens after you press a button.

---

## How the contact form works — the full data flow

**Step 1 — You fill in the form and press Send**

The form lives in `app/contact/page.tsx`. It is a React component running in your browser. When you press Send, it does not navigate to a new page or open your email client. Instead, it makes a `fetch` request — a background network call — to `/api/contact` on the same site. It sends your name, email, and message as JSON in the body of that request.

**Step 2 — The request hits the server**

`/api/contact` maps to `app/api/contact/route.ts`. This file runs on Vercel's servers, not in your browser. The first thing it does is validate the incoming data: are all three fields present? Is the email address shaped like an email address? Is the message within the character limit? If anything fails these checks, it sends back an error immediately and never touches the email service.

**Step 3 — The server calls Resend**

If the data is valid, the server calls Resend — an email delivery service — using a secret API key stored in the server's environment variables. That key never appears in the browser, never appears in the page source, and never gets sent to your device. The server tells Resend: send an email to `njokuobinna@gmail.com`, with the subject line "Portfolio enquiry from [name]", and set the reply-to address to the sender's email so I can reply directly.

**Step 4 — Resend delivers the email**

Resend handles the actual email delivery — routing it through mail servers, handling deliverability, and confirming it was sent. This is the part that would be complicated to build from scratch. Using a service means I do not have to manage SMTP servers or worry about emails landing in spam.

**Step 5 — The server responds to the browser**

Once Resend confirms the email was sent, the server sends back `{ success: true }`. The browser receives this response, and the form replaces itself with a confirmation message: "Message sent. I'll reply within a day."

If anything goes wrong at any step — network failure, Resend error, invalid input — the server sends back an error message and the form shows it inline, without losing what the user typed.

---

## Why this is the right feature for this portfolio

The contact page already existed but it only had a `mailto:` link — clicking it opened your email client, which breaks the flow and does not work at all on devices where no email client is configured. A real form that sends directly is more reliable, more professional, and more useful to the person trying to reach me.

It also demonstrates the same pattern used in the AI chat feature on this site: a client component sends a request to a server-side API route, the route does the sensitive work (calling an external service with a secret key), and the result flows back to the UI. One pattern, two features.

---

## Evidence

A test submission was sent through the live form at `https://frontend-ai-capstone-two.vercel.app/contact` and received at `njokuobinna@gmail.com`. Screenshot of the received email is included in the submission.
