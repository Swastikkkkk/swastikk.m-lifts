# Going live

## What's in the folder

| Path | What it is |
|---|---|
| `index.html` | The whole site. CSS, JS and the 3D drive are all still inside it. |
| `assets/img/` | The 30 photos, pulled out of the HTML so the browser can cache them. |
| `assets/og.jpg` | The 1200×630 preview image for WhatsApp / Instagram links. |
| `404.html` | Shown for a bad URL. GitHub Pages picks it up automatically. |
| `robots.txt`, `sitemap.xml` | So Google indexes you. |
| `backend/code.gs` | Google Apps Script. Runs on Google's servers, not in the browser. |
| `.env.example` | A notebook for your values. Read the comments — it is not a config file. |
| `.gitignore` | Keeps a real `.env` out of git. |

## Step 1 — replace the placeholders

Four values are written as ALL-CAPS placeholders. Find and replace each one
everywhere it appears:

| Placeholder | Replace with | Appears in |
|---|---|---|
| `SITE_URL` | Your live root, **no trailing slash** | `index.html`, `robots.txt`, `sitemap.xml` |
| `CF_ANALYTICS_TOKEN` | Cloudflare token (see `ANALYTICS.md`) | `index.html` |
| `LOCALITY` | Your gym's area in Jaipur | `index.html` |
| `PASTE_YOUR_SECRET_KEY_HERE` | The key already in `index.html`'s `SL_CFG` | `backend/code.gs` |

For GitHub Pages at the default address, `SITE_URL` is:

```
https://swastikkkkk.github.io/swastik-lifts
```

If you get `SITE_URL` wrong, the site still works — but link previews break and
Google gets told your page lives somewhere else. Worth getting right.

## Step 2 — push it

```bash
git init
git add .
git commit -m "site"
git remote add origin https://github.com/Swastikkkkk/swastik-lifts.git
git push -u origin main
```

Then **Settings → Pages → Deploy from a branch**, branch `main`, folder `/ (root)`.

Wait a minute, then open your URL. Photos now load as separate files, so the
first paint is much faster than before — the HTML went from 2.6 MB to ~350 KB.

## Step 3 — wire up the backend

1. `sheets.new`, name it **Swastik Lifts**
2. **Extensions → Apps Script**, delete the sample, paste all of `backend/code.gs`
3. Set `SECRET_KEY` to match the one in `index.html`. Set `NOTIFY_EMAIL` if you
   want an email per application.
4. **Deploy → New deployment → Web app.** *Execute as* **Me**, *Who has access*
   **Anyone**. Approve the prompt, copy the `/exec` URL.
5. Put that URL in `SL_CFG.SCRIPT_URL` in `index.html`. Push again.

Run `selfTest()` once from the Apps Script editor first — it confirms the sheet
wiring without involving the website.

**After any edit to `code.gs`** you must do **Deploy → Manage deployments → edit
→ Version: New version**, or the live URL keeps serving the old code. This
catches people out constantly.

Until the endpoint is live nothing breaks: applications save on the visitor's
device and hand off to you over WhatsApp with every answer pre-filled.

## Custom domain

Add a file called `CNAME` next to `index.html` containing just the domain:

```
swastiklifts.com
```

Then point a CNAME DNS record at `swastikkkkk.github.io`. Update `SITE_URL`
everywhere afterwards.

## Before you call it done

- [ ] All four placeholders replaced
- [ ] Preview tested — paste your link into a WhatsApp chat with yourself
- [ ] Submitted the form once and seen the row land in the sheet
- [ ] Opened it on your own phone, both portrait and landscape
- [ ] Testimonials replaced with real ones, or that block cut
