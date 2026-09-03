# PF-04: DNS Walkthrough

**Track:** General AI Fluency
**Code:** PF-04
**Author:** Emmanuel Chukwukere Obinna
**Live site:** https://frontend-ai-capstone-two.vercel.app/
**Source repository:** https://github.com/ephysians/frontend-ai-capstone

---

## What DNS Does

DNS stands for Domain Name System. Its job is simple: it translates a human-readable name like `frontend-ai-capstone-two.vercel.app` into a machine-readable number like `76.76.21.21` — the actual IP address where the server lives.

Computers on the internet talk to each other using IP addresses, not names. But nobody wants to memorise a string of numbers every time they want to visit a website. DNS is the phone book that sits between the name you type and the address the network actually uses.

---

## What Happens When You Type a URL

Here is the full journey, step by step, from the moment you press Enter to the moment the page loads.

**1. Your browser checks its own memory first**

Before asking anyone, your browser checks whether it already knows the IP address for this domain from a recent visit. If it does, it skips everything below and goes straight to the server. This is called the browser cache.

**2. Your operating system checks its own cache**

If the browser has no record, it asks the operating system. The OS keeps its own short-term memory of recent DNS lookups. If it finds the answer there, it returns it immediately.

**3. The recursive resolver takes over**

If neither cache has the answer, the request goes to a DNS recursive resolver — a server run by your internet provider (or a public one like Cloudflare's `1.1.1.1` or Google's `8.8.8.8`). This resolver is the one that does the actual detective work on your behalf. You never see it, but it handles every DNS lookup your device makes.

**4. The resolver asks the root nameserver**

The resolver starts at the top of the DNS hierarchy: the root nameservers. There are 13 sets of these distributed around the world. The resolver asks: "Who is responsible for `.app` domains?" The root nameserver does not know the final answer, but it knows who to ask next — the TLD nameserver for `.app`.

**5. The TLD nameserver points to the authoritative nameserver**

The TLD (Top-Level Domain) nameserver for `.app` knows which nameserver is authoritative for `vercel.app`. It returns that address. The resolver now knows who actually holds the DNS records for this domain.

**6. The authoritative nameserver returns the record**

The authoritative nameserver is the final source of truth. It holds the actual DNS records for the domain. The resolver asks it: "What is the IP address for `frontend-ai-capstone-two.vercel.app`?" The authoritative nameserver looks up its records and returns the answer — an A record (for IPv4) or AAAA record (for IPv6) containing the IP address of Vercel's servers.

**7. The resolver caches the answer and returns it**

The resolver stores the answer for a period of time defined by the TTL (Time to Live) value on the record — so it does not have to repeat this whole journey for every visitor. It then returns the IP address to your browser.

**8. Your browser connects to the server**

Now that your browser has the IP address, it opens a connection to Vercel's server, completes the HTTPS handshake (which is how the padlock appears), and requests the page. The server responds with the HTML, and the site loads.

The entire journey from step 1 to step 8 typically takes less than 50 milliseconds.

---

## What a CNAME Record Is

A CNAME record — short for Canonical Name record — is a type of DNS record that points one domain name to another domain name, rather than directly to an IP address.

Here is a concrete example. Suppose you own `emmanueldev.com` and you want `www.emmanueldev.com` to point to your Vercel deployment. Instead of finding out Vercel's IP address and hardcoding it (which could change), you create a CNAME record that says:

```
www.emmanueldev.com  →  cname.vercel-dns.com
```

Now when someone visits `www.emmanueldev.com`, DNS resolves the CNAME first — following the pointer to `cname.vercel-dns.com` — and then resolves that to Vercel's actual IP address. If Vercel ever changes their IP addresses, your site keeps working because your record points to their name, not their number.

CNAME records are how most custom domain setups work with hosting providers like Vercel, Netlify, and GitHub Pages. The hosting provider gives you a target name to point at; you create the CNAME in your domain registrar's DNS settings; DNS does the rest.

One important rule: a CNAME cannot be used on a bare domain (also called an apex domain) like `emmanueldev.com` without the `www`. Most registrars and DNS providers handle this with a workaround called ANAME or ALIAS records, or by flattening the CNAME at the root. For this assignment, the free hosting URL (`frontend-ai-capstone-two.vercel.app`) is a subdomain of Vercel's domain, so no custom CNAME configuration was needed.

---

## How This Site Is Deployed

This site is deployed on Vercel's free hobby tier, connected directly to the GitHub repository at `github.com/ephysians/frontend-ai-capstone`. Every push to the main branch triggers an automatic rebuild and redeployment. Vercel handles HTTPS automatically — the SSL certificate is provisioned and renewed without any manual configuration.

The live URL is: **https://frontend-ai-capstone-two.vercel.app**

The site is accessible over HTTPS, loads on a clean named URL, and can be verified in a private browser window without logging in.
