# AGENTS.md - UGC Portfolio Guidance

This project is a static GitHub Pages UGC portfolio. Keep it simple, fast, and easy for a non-developer to update.

## Scope

- Publishable site lives in `docs/`.
- There is no build system, package manager, framework, or backend.
- Do not add dependencies or introduce a build step unless explicitly requested.
- Prefer editing `docs/assets/data/portfolio.json` for content changes.
- Keep HTML/CSS/JS hand-authored and static-site friendly.

## Local Preview

Because `assets/main.js` uses `fetch()` to load JSON, preview through a local server instead of opening the HTML file directly.

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
- preserve the refined serif headline, blue CTA, phone-frame video cards, sage contact section, and editorial UGC feel

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
- Elements use `data-ix`, `data-ix-load`, `data-ix-delay`, and `data-ix-stagger`.
- `docs/assets/main.js` owns reveal setup and IntersectionObserver behavior.
- `docs/assets/style.css` owns reveal CSS.

When adding animation:

- Use opacity, transform, and light filter only.
- Respect `prefers-reduced-motion`.
- Ensure full-page screenshots do not show blank below-fold sections.
- Keep load animations subtle; the hero should land crisp quickly.

## Icons

Some relevant SVG references were copied from SiteLift into `docs/assets/icons/` for future static use. Inline icons in `main.js` are currently optimized for service/process display.

If improving icons:

- Prefer clean stroke SVGs that inherit `currentColor`.
- Keep a consistent `viewBox`, stroke width, linecap, and linejoin.
- Avoid adding large icon libraries.
- If copying from SiteLift, copy only the small files needed and keep them under `docs/assets/icons/`.

## Media

Expected media paths:

- hero: `docs/assets/images/hero.jpg`
- contact: `docs/assets/images/contact.jpg`
- posters: `docs/assets/images/posters/reel-XX.jpg`
- public videos: `docs/assets/videos/reel-XX.mp4`
- raw videos: `docs/assets/videos/raw-XX.mp4`

`raw-*.mp4` files are intentionally ignored in `.gitignore`. Do not delete or rewrite media unless the user asks.

## Validation Expectations

For code changes, run:

```sh
node --check docs/assets/main.js
```

For visual changes, inspect with Playwright or the in-app browser:

- desktop viewport around `1440px`
- mobile viewport around `390px`
- full-page screenshot
- filter click
- video modal open/close
- contact/footer on mobile

Report any validation not run.

## Change Discipline

- Keep diffs scoped.
- Do not touch unrelated sibling projects under `/Users/main/Dropbox/Coding/Github`.
- Do not modify SiteLift source files when using them as references.
- If replacing real creator content later, avoid changing layout unless the new media exposes a layout problem.
- Keep `docs/README.md` updated when changing structure, data conventions, animation conventions, or deployment instructions.
