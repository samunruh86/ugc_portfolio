# UGC Portfolio Static Site

This directory is the publishable GitHub Pages site for the UGC portfolio. GitHub Pages should be configured to publish from `docs/`.

The site is intentionally simple: plain HTML, CSS, JSON, and browser JavaScript. There is no build step, package manager, framework, backend, or deploy compilation.

## Quick Start

From the project root:

```sh
./RUN.command
```

Or from this `docs/` directory:

```sh
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/
```

Use a local server instead of opening `index.html` directly because the page fetches `assets/data/portfolio.json`.

## Files

- `index.html` is the single-page portfolio shell.
- `styleguide.html` is a local noindex reference for colors, typography, spacing, and reusable components.
- `assets/data/portfolio.json` is the main editable content source.
- `assets/css/styles.css` imports the active CSS layers.
- `assets/css/base.css` defines font faces, root color tokens, spacing tokens, radii, shadows, resets, and base typography.
- `assets/css/layout.css` defines shared layout primitives such as `.container`, `.section`, and `.section-heading`.
- `assets/css/components.css` defines reusable UI components such as `.btn`, `.contact-link`, `.phone-frame`, `.video-card`, `.icon-card`, `.process-step`, and `.form-field`.
- `assets/css/sections.css` composes full page sections: header, hero, work, services, process, contact, and footer.
- `assets/css/motion.css` contains the `data-ix` reveal animation system.
- `assets/js/data.js` contains shared selectors, HTML escaping, data fetching, and responsive work-count helpers.
- `assets/js/render.js` renders JSON-backed page sections.
- `assets/js/video.js` handles phone-frame hover preview and click-to-toggle playback.
- `assets/js/reveal.js` handles load and scroll reveal animation.
- `assets/js/header.js` handles header scroll state.
- `assets/js/main.js` is the small bootstrap file.
- `assets/icons/portfolio-icons.svg` is the SVG sprite used by service, process, and contact icons.
- `assets/fonts/` currently contains the active Montserrat font files only.
- `assets/images/` contains the hero image, contact image, texture, favicon, and video posters.
- `assets/videos/` contains the portfolio reels.
- `.nojekyll`, `CNAME`, `robots.txt`, and `sitemap.xml` support GitHub Pages deployment.

## Editing Content

For normal portfolio updates, edit `assets/data/portfolio.json` first. The page renders creator details, work cards, services, and process steps from that file.

Common fields:

- `creator.name`: brand text and document title.
- `creator.email`: mail links and contact form `mailto:` action.
- `creator.instagram` and `creator.tiktok`: social/contact links.
- `creator.lead`: hero supporting copy.
- `creator.contactCopy`: contact-section paragraph.
- `videos`: work cards.
- `services`: cards in the services section.
- `process`: cards in the process section.

For each `videos` item, keep these fields aligned:

- `title`: accessible video button label.
- `category`: visible card title.
- `brand`: compact uppercase metadata above the title.
- `description`: available for richer card copy.
- `video`: path to the `.mp4`.
- `poster`: path to the poster image.

Preferred media paths:

- hero image: `assets/images/hero.jpeg`
- contact image: `assets/images/contact.jpeg`
- posters: `assets/images/posters/reel-01.jpg`
- public reels: `assets/videos/reel-01.mp4`
- raw local source videos, when present, should stay outside the published flow or remain ignored.

## Styling Conventions

Use the split CSS layers instead of adding one-off rules to `index.html`.

- Put global tokens and base element styles in `assets/css/base.css`.
- Put reusable spacing/layout patterns in `assets/css/layout.css`.
- Put repeated UI pieces in `assets/css/components.css`.
- Put page-specific composition in `assets/css/sections.css`.
- Put animation-only rules in `assets/css/motion.css`.

Class names should stay descriptive and reusable:

- page sections use `*-section`
- component blocks use names like `.video-card`, `.icon-card`, `.process-step`, and `.contact-link`
- component elements use BEM-style suffixes such as `.video-card__body`
- JavaScript hooks should use `data-render`, `data-action`, or `data-video-card` instead of styling classes

Before changing the palette, check `:root` in `assets/css/base.css` and update tokens there first. The current hardcoded visual direction is the final Montserrat/influencer-pop style, not a selectable theme.

## JavaScript Conventions

Scripts are loaded directly by `index.html` in dependency order:

1. `assets/js/data.js`
2. `assets/js/video.js`
3. `assets/js/reveal.js`
4. `assets/js/header.js`
5. `assets/js/render.js`
6. `assets/js/main.js`

Keep rendering in `render.js`, behavior in the relevant behavior module, and bootstrapping in `main.js`. Escape JSON-backed text with `escapeHtml` before writing HTML strings.

## Animation System

- `index.html` adds `ix-ready` early unless the user prefers reduced motion.
- Elements opt into animation with `data-ix`.
- `data-ix-load` animates on page load.
- `data-ix-stagger` staggers animated children.
- `assets/js/reveal.js` applies reveal classes and IntersectionObserver scroll reveals.
- `assets/css/motion.css` defines reveal states and reduced-motion behavior.

Keep animation to opacity, transform, and light filter changes so screenshots do not capture blank below-fold sections.

## Validation

After code edits, run:

```sh
node --check assets/js/*.js
```

After visual edits, run the local server and inspect:

- desktop around `1440px`
- mobile around `390px`
- `styleguide.html`
- "See More Work" on mobile and desktop
- phone-frame hover preview and click-to-toggle playback
- contact section and footer wrapping on mobile
- full-page screenshots for blank sections, overflow, or clipped text

## Deployment

Before publishing:

1. Confirm `assets/data/portfolio.json` has final creator details.
2. Confirm images, posters, and videos use the expected paths.
3. Update `CNAME` only if using a custom domain.
4. Update `sitemap.xml` and `robots.txt` if the final public URL changes.
5. Verify locally at `http://127.0.0.1:4173/`.
