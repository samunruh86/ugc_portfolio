# UGC Portfolio Static Site

This directory is the publishable GitHub Pages site for the UGC portfolio. GitHub Pages should point at the `docs/` folder.

## What Is Inside

- `index.html` is the single-page portfolio shell.
- `styleguide.html` is a noindex local reference for tokens, typography, and reusable components.
- `assets/css/styles.css` imports the active CSS layers.
- `assets/css/base.css` contains fonts, root tokens, resets, and base typography.
- `assets/css/layout.css` contains reusable layout primitives such as `.container`, `.section`, and `.section-heading`.
- `assets/css/components.css` contains reusable UI components such as buttons, contact links, phone frames, cards, process steps, and form fields.
- `assets/css/sections.css` contains page-section composition for header, hero, work, services, process, contact, and footer.
- `assets/css/motion.css` contains the `data-ix` reveal animation system.
- `assets/js/main.js` orchestrates loading, rendering, header state, video playback, and reveal animation through focused modules in `assets/js/`.
- `assets/data/portfolio.json` is the main content source for creator details, videos, services, and process steps.
- `assets/images/` contains hero/contact images, texture, favicon, and poster images.
- `assets/videos/` contains the displayed portfolio reels.
- `assets/icons/` contains local SVG icons and the normalized Lucide sprite used by services and process steps.
- `.nojekyll` tells GitHub Pages to serve files as-is.
- `CNAME`, `robots.txt`, and `sitemap.xml` are deployment/SEO files.

## How It Works

The page is intentionally static: there is no build step, framework, package manager, or server-side code. `index.html` loads `assets/css/styles.css` and the small scripts in `assets/js/`. The JavaScript fetches `assets/data/portfolio.json`, then renders the dynamic sections:

- layered hero phone image
- featured work cards, showing fewer initial items on small mobile screens before the "See More Work" reveal
- services
- process steps, capped at four items
- inline phone-frame video playback: muted preview on hover, audio playback toggled on click

Because the content is loaded with `fetch()`, view the site through a local web server instead of opening `index.html` directly from Finder.

Use this from `docs/`:

```sh
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Editing Content

Most content changes should happen in `assets/data/portfolio.json`.

## Structure

The portfolio now follows the same broad organization as the SiteLift static site:

- root tokens live in `assets/css/base.css`
- page spacing uses `.container`, `.section`, `.section-heading`, and tokenized spacing values
- reusable UI is styled as components, not one-off section rules
- section classes use `*-section` names
- JavaScript uses `data-render` for render targets and `data-action` / `data-video-card` for behavior hooks
- `styleguide.html` mirrors the active CSS primitives for quick visual checks

Legacy files `assets/style.css`, `assets/themes.css`, and `assets/main.js` are no longer loaded by `index.html`. They are retained for reference until it is safe to remove them.

For each video item, keep these fields aligned:

- `title`: display title
- `category`: shown as the card title
- `brand`: shown as compact metadata
- `description`: available for richer card copy
- `video`: path to the `.mp4`
- `poster`: path to the poster image

When replacing placeholder media, keep paths stable where possible:

- posters: `assets/images/posters/reel-01.jpg`
- videos: `assets/videos/reel-01.mp4`
- hero image: `assets/images/hero.jpeg`
- contact image: `assets/images/contact.jpg`

## Animation System

The motion system is adapted from SiteLift’s static site pattern:

- `index.html` adds `ix-ready` early unless the user prefers reduced motion.
- Elements opt into animation with `data-ix`.
- `data-ix-load` means animate on page load.
- `data-ix-stagger` staggers animated children.
- `assets/js/reveal.js` applies reveal classes and IntersectionObserver scroll reveals.
- `assets/css/motion.css` defines `reveal-ready`, `reveal-in`, `reveal-soft`, `reveal-card`, and reduced-motion behavior.

Keep animations transform/opacity based. Avoid layout-affecting animation.

## Deployment

This site is ready for free GitHub Pages hosting from the `docs/` folder. Before publishing:

1. Replace placeholder name, email, social links, images, posters, and videos.
2. Update `CNAME` only if using a custom domain.
3. Update `sitemap.xml` and `robots.txt` if the final public URL changes.
4. Verify locally at `http://127.0.0.1:4173/`.
5. Capture desktop and mobile screenshots after any visual change.

## Validation

Recommended checks after edits:

```sh
node --check assets/js/*.js
python3 -m http.server 4173
```

Then inspect:

- desktop around `1440px`
- mobile around `390px`
- phone-frame hover preview and click-to-toggle audio playback
- mobile "See More Work" reveal
- footer wrapping
- no blank sections in full-page screenshots
