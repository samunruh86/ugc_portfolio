# AGENTS.md - UGC Portfolio Guidance

This project is a static GitHub Pages UGC portfolio. Keep it simple, fast, and easy for a non-developer to update.

## Scope

- Publishable site lives in `docs/`.
- Previous site snapshot lives in `docs_v1/`.
- There is no build system, package manager, framework, or backend.
- Do not add dependencies or introduce a build step unless explicitly requested.
- Prefer editing `docs/index.html` for content changes in the current static page.
- Keep HTML/CSS/JS hand-authored and static-site friendly.

## Local Preview

Preview through a local server so relative assets, video files, and deployment paths behave like GitHub Pages.

From `docs/`:

```sh
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

From the project root, you can also run:

```sh
./RUN.command
```

If port `4173` is already in use, check whether the existing server is serving this site before starting another one.

## Design Direction

The intended visual direction is:

- calm, polished UGC portfolio aesthetic
- closer to the already-built site than the loud Webflow influencer template
- borrow from Webflow/SiteLift only for clean spacing, motion, SVG quality, interaction polish, and layout discipline
- avoid decorative clutter, oversized marketing sections, and one-note palettes
- preserve the content-creator portfolio direction, polished motion, phone-frame video cards, clear packages, and editorial UGC feel

Important UI constraints:

- Do not scale font size with viewport width.
- Do not use negative letter spacing.
- Do not add decorative orbs/bokeh blobs.
- Do not nest cards inside cards.
- Keep text from overlapping or overflowing on mobile.
- Use icons/SVGs for compact controls where appropriate.

## Motion System

The current animation system is based on the SiteLift static site pattern:

- `index.html` adds `ix-ready` early.
- Elements use `data-ix`, `data-ix-load`, and `data-ix-stagger`.
- `docs/assets/js/reveal.js` owns reveal setup and IntersectionObserver behavior.
- `docs/assets/css/motion.css` owns reveal CSS.

When adding animation:

- Use opacity, transform, and light filter only.
- Respect `prefers-reduced-motion`.
- Ensure full-page screenshots do not show blank below-fold sections.
- Keep load animations subtle; the hero should land crisp quickly.

## Icons

SVG references live in `docs/assets/svgs/` and are used directly from the static HTML.

If improving icons:

- Prefer clean stroke SVGs that inherit `currentColor`.
- Keep a consistent `viewBox`, stroke width, linecap, and linejoin.
- Avoid adding large icon libraries.
- If copying additional SVGs, copy only the small files needed and keep them under `docs/assets/svgs/`.

## Media

Expected media paths:

- hero: `docs/assets/images/image-home-hero-hayley-p-1200.jpeg`
- posters: `docs/assets/images/posters/reel-XX.jpg`
- public videos: `docs/assets/videos/reel-XX.mp4`
- raw videos: `docs/assets/videos/raw-XX.mp4`

`raw-*.mp4` files are intentionally ignored in `.gitignore`. Do not delete or rewrite media unless the user asks.

## Validation Expectations

For code changes, run:

```sh
node --check docs/assets/js/*.js
```

For visual changes, inspect with Playwright or the in-app browser:

- desktop viewport around `1440px`
- mobile viewport around `390px`
- full-page screenshot
- mobile navigation open/close
- FAQ open/close
- reel playback
- contact/footer on mobile

Report any validation not run.

## Change Discipline

- Keep diffs scoped.
- Do not touch unrelated sibling projects under `/Users/main/Dropbox/Coding/Github`.
- Do not modify SiteLift source files when using them as references.
- If replacing real creator content later, avoid changing layout unless the new media exposes a layout problem.
- Keep `docs/README.md` updated when changing structure, data conventions, animation conventions, or deployment instructions.
