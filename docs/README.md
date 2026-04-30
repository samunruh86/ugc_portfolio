# UGC Portfolio Static Site

This directory is the publishable GitHub Pages site for the UGC portfolio. GitHub Pages should be configured to publish from `docs/`.

The current site is a hand-authored static recreation based on the imported content creator source. It uses plain HTML, layered CSS, local JavaScript, local Montserrat font files, SVG assets, images, and videos. There is no build step, package manager, framework, backend, or deploy compilation.

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

## Files

- `index.html` is the single-page portfolio shell.
- `assets/css/styles.css` imports the active CSS layers.
- `assets/css/base.css` defines font faces, root color tokens, spacing tokens, resets, and base typography.
- `assets/css/layout.css` defines shared layout primitives such as `.container`, `.section`, and grid helpers.
- `assets/css/components.css` defines reusable UI components such as buttons, package cards, FAQ items, and reel cards.
- `assets/css/sections.css` composes full page sections: header, hero, achievements, videos, about, packages, FAQ, contact, and footer.
- `assets/css/motion.css` contains the `data-ix` reveal animation system.
- `assets/js/header.js` handles header scroll state and mobile navigation.
- `assets/js/dropdown.js` handles FAQ disclosure behavior.
- `assets/js/reveal.js` handles load and scroll reveal animation.
- `assets/js/stats.js` handles achievement count-up animation.
- `assets/js/reels.js` handles reel video playback.
- `assets/js/main.js` is the small bootstrap file.
- `assets/svgs/` contains the inline SVG assets used by the page.
- `assets/fonts/` contains local Montserrat font files.
- `assets/images/` contains page imagery and reel posters.
- `assets/videos/` contains the portfolio reels.
- `.nojekyll`, `CNAME`, `robots.txt`, and `sitemap.xml` support GitHub Pages deployment.

## Animation System

- `index.html` adds `ix-ready` early unless the user prefers reduced motion.
- Elements opt into animation with `data-ix`.
- `data-ix-load` animates on page load.
- `data-ix-stagger` staggers animated children.
- `assets/js/reveal.js` applies reveal classes and IntersectionObserver scroll reveals.
- `assets/css/motion.css` defines reveal states and reduced-motion behavior.
- Use `?captureStatic=true` for static full-page screenshots with all reveal targets visible.

Keep animation to opacity, transform, and light filter changes so screenshots do not capture blank below-fold sections.

## Validation

After code edits, run:

```sh
node --check assets/js/*.js
```

After visual edits, run the local server and inspect:

- desktop around `1440px`
- mobile around `390px`
- full-page screenshots for blank sections, overflow, or clipped text
- reel playback controls
- contact section and footer wrapping on mobile

## Deployment

Before publishing:

1. Confirm page copy, links, images, posters, and videos are final.
2. Update `CNAME` only if using a different custom domain.
3. Update `sitemap.xml` and `robots.txt` if the final public URL changes.
4. Verify locally at `http://127.0.0.1:4173/`.
