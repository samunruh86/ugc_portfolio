# UGC Portfolio Static Site

This directory is the publishable GitHub Pages site for the UGC portfolio. GitHub Pages should point at the `docs/` folder.

## What Is Inside

- `index.html` is the single-page portfolio shell.
- `assets/style.css` contains all layout, responsive styling, visual polish, and animation CSS.
- `assets/main.js` loads portfolio data, renders repeatable content, handles filters, opens the video modal, and runs scroll/on-load animations.
- `assets/data/portfolio.json` is the main content source for creator details, brands, videos, services, and process steps.
- `assets/images/` contains hero/contact images, texture, favicon, and poster images.
- `assets/videos/` contains the displayed portfolio reels.
- `assets/icons/` contains copied reference SVG icons from the SiteLift admin/web assets for future static use.
- `.nojekyll` tells GitHub Pages to serve files as-is.
- `CNAME`, `robots.txt`, and `sitemap.xml` are deployment/SEO files.

## How It Works

The page is intentionally static: there is no build step, framework, package manager, or server-side code. `index.html` loads `assets/style.css` and `assets/main.js`. The JavaScript fetches `assets/data/portfolio.json`, then renders the dynamic sections:

- hero reel rail
- category filters
- featured work cards
- brand strip
- services
- process steps
- modal video playback

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

For each video item, keep these fields aligned:

- `title`: display title
- `category`: used for filter pills
- `brand`: shown as compact metadata
- `description`: available for richer card copy
- `video`: path to the `.mp4`
- `poster`: path to the poster image
- `sourceUrl`: optional source/reference link

When replacing placeholder media, keep paths stable where possible:

- posters: `assets/images/posters/reel-01.jpg`
- videos: `assets/videos/reel-01.mp4`
- hero image: `assets/images/hero.jpg`
- contact image: `assets/images/contact.jpg`

## Animation System

The motion system is adapted from SiteLift’s static site pattern:

- `index.html` adds `ix-ready` early unless the user prefers reduced motion.
- Elements opt into animation with `data-ix`.
- `data-ix-load` means animate on page load.
- `data-ix-stagger` staggers animated children.
- `assets/main.js` applies reveal classes and IntersectionObserver scroll reveals.
- `assets/style.css` defines `reveal-ready`, `reveal-in`, `reveal-soft`, `reveal-card`, and reduced-motion behavior.

Keep animations transform/opacity based. Avoid layout-affecting animation.

## Deployment

This site is ready for free GitHub Pages hosting from the `docs/` folder. Before publishing:

1. Replace placeholder name, email, social links, brands, images, posters, and videos.
2. Update `CNAME` only if using a custom domain.
3. Update `sitemap.xml` and `robots.txt` if the final public URL changes.
4. Verify locally at `http://127.0.0.1:4173/`.
5. Capture desktop and mobile screenshots after any visual change.

## Validation

Recommended checks after edits:

```sh
node --check assets/main.js
python3 -m http.server 4173
```

Then inspect:

- desktop around `1440px`
- mobile around `390px`
- filtering behavior
- video modal open/close
- footer wrapping
- no blank sections in full-page screenshots

