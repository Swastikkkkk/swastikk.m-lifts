# Swastik Lifts

Powerbuilding coaching site. Static — no build step, no npm, no server.

```
index.html        the site (CSS + JS + the 3D drive, all inline)
assets/img/       photos, extracted so the browser can cache them
assets/og.jpg     1200x630 social preview
backend/code.gs   Google Apps Script — applications + lap times into a Sheet
docs/             DEPLOY.md, ANALYTICS.md
```

## Run it

Open `index.html` in a browser. Because photos are separate files now, open it
through a local server rather than double-clicking, so `fetch()` can read them:

```bash
python3 -m http.server 8000
# then http://localhost:8000
```

## Deploy it

See `docs/DEPLOY.md`. Short version: replace the four ALL-CAPS placeholders,
push, turn on GitHub Pages.

## On secrets

`index.html` is downloaded in full by every visitor. Nothing in it is private,
whether or not this repo is. Values that must stay secret live in
`backend/code.gs`, which runs on Google's servers. See the comments in
`.env.example`.

## Notes

Only outside requests are Google Fonts and three cdnjs script tags (three.js
r128, cannon.js 0.6.2, GSAP 3.12.5 with ScrollTrigger and Lenis).

The driving section degrades on its own: it checks for WebGL and
`prefers-reduced-motion`, watches real framerate and steps shadows and
resolution down to match, and is skipped entirely rather than shown broken if
three.js fails to load.
