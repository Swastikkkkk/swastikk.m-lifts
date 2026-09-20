# Seeing who visits — Cloudflare Web Analytics

Free, no cookie banner needed, and it doesn't slow the page down. You do **not**
need to move your site to Cloudflare to use it. It works on GitHub Pages.

## Setting it up (about 4 minutes)

1. Make a free account at **dash.cloudflare.com** if you don't have one.
2. In the left sidebar go to **Analytics & Logs → Web Analytics**.
3. Click **Add a site**.
4. Enter your hostname — just the domain, no `https://` and no path.
   For GitHub Pages that's `swastikkkkk.github.io`.
5. Cloudflare shows you a snippet. You only need the **token** inside it —
   a long string that looks like `a1b2c3d4e5f6...`.
6. Open `index.html`, find `CF_ANALYTICS_TOKEN`, and replace it with that token.
   Keep the quotes around it.
7. Push. Open your site once yourself, wait a minute or two, and the dashboard
   starts filling in.

That token is **public on purpose** — it only says which site a pageview belongs
to. It is safe sitting in `index.html`. Nobody can read your stats with it.

## What you'll actually see

- **Visits** — a person arriving. This is the number that matters.
- **Page views** — every load. One person refreshing counts several times.
- **Referrers** — where they came from. Watch this after you post on Instagram.
- **Countries / devices / browsers** — mostly phones, in your case.

## Reading it honestly

Traffic on its own tells you nothing. The question worth asking is:
**how many people who land actually open the form?**

Cloudflare's free tier does not track button clicks, so you get that number by
comparing two things you already have:

- visits this week (Cloudflare)
- rows added to the **Applications** tab this week (your sheet)

If a lot of people land and almost nobody applies, the problem is the page,
not the traffic. If very few land at all, the problem is distribution — the
page is fine, nobody is seeing it.

## A caveat nobody mentions

Ad blockers block this script, and a big slice of your audience runs one. Your
real numbers are **higher** than what you see, often by 20–40%. Treat Cloudflare
as a trend line, not a headcount. Your sheet is the only source of truth for
applications, because that number can't be blocked.

## If you'd rather not use Cloudflare

Delete the beacon `<script>` line from `index.html` and nothing breaks.
Alternatives that work the same way: **Plausible** (paid, very clean) or
**Umami** (free if you self-host). Google Analytics 4 also works but is heavier,
needs a cookie notice in several countries, and its interface will cost you more
time than the data is worth at this stage.
