# UGC Portfolio Static Site

This directory is the publishable GitHub Pages site for the UGC portfolio. GitHub Pages should be configured to publish from `docs/`.

The site is intentionally simple: plain HTML, layered CSS, browser JavaScript, local font files, SVG assets, images, and videos. There is no build step, package manager, framework, backend, or deploy compilation.

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

Use a local server instead of opening `index.html` directly so relative assets, video files, and deployment paths behave like GitHub Pages.

## Files

- `index.html` is the single-page portfolio shell and the main place to edit page copy.
- `assets/css/styles.css` imports the active CSS layers.
- `assets/css/base.css` defines font faces, root color tokens, spacing tokens, resets, and base typography.
- `assets/css/layout.css` defines shared layout primitives such as `.container`, `.section`, `.section-heading`, and action rows.
- `assets/css/components.css` defines reusable UI components such as buttons, social icons, and dropdown-related styles.
- `assets/css/sections.css` composes full page sections: header, hero, achievements, videos, about, packages, FAQ, contact, and footer.
- `assets/css/motion.css` contains the `data-ix` reveal animation system.
- `assets/js/header.js` handles header scroll state.
- `assets/js/dropdown.js` handles FAQ disclosure behavior.
- `assets/js/reveal.js` handles load and scroll reveal animation.
- `assets/js/stats.js` handles achievement count-up animation.
- `assets/js/reels.js` handles reel lazy-loading, mobile "View More", hover preview, and click-to-play behavior.
- `assets/js/contact.js` handles Web3Forms contact-form submission and inline status messages.
- `assets/js/main.js` is the small bootstrap file.
- `assets/svgs/` contains the SVG assets used by the page.
- `assets/fonts/` contains local Montserrat and Lora font files.
- `assets/images/` contains page imagery and reel posters.
- `assets/videos/` contains the portfolio reels.
- `.nojekyll`, `CNAME`, `robots.txt`, and `sitemap.xml` support GitHub Pages deployment.

## Editing Content

Most visible copy is edited directly in `index.html`. Keep copy concise so it continues to fit the existing responsive layout.

Current sections:

- header/nav
- hero
- achievements
- recent product videos
- about
- packages
- FAQ
- contact
- footer

For copy-only changes, replace existing text without adding new elements unless the requested change needs a structure update.

## Contact Form

The contact form posts directly to Web3Forms from the static GitHub Pages site. There is no local backend. The Web3Forms access key lives in the hidden `access_key` input in `index.html`.

If the recipient email or Web3Forms account changes, create a new Web3Forms access key, replace the hidden `access_key` value in `index.html`, and test from the local preview URL or the deployed GitHub Pages URL.

The form uses `assets/js/contact.js` to submit with `fetch()`, keep visitors on the page, disable the button while sending, and show an inline success or error message. If the placeholder access key is still present, the form shows a setup message instead of submitting. The hidden `botcheck` checkbox is the Web3Forms honeypot field.

## Media And Videos

Preferred media paths:

- hero image: `assets/images/hero-hayley-v2-p-1200.jpeg`
- about image: `assets/images/about-hayley-v2c-p-800.jpg`
- posters: `assets/images/posters/reel-01.jpg`
- public reels: `assets/videos/reel-01.mp4`

Reel cards are optimized so poster images appear immediately and MP4 files lazy-load later. Keep the video URL in `data-src`, not `src`, and keep `preload="none"` in `index.html`. `assets/js/reels.js` attaches the real `src` when the card is near the viewport or the user interacts. On mobile, only the first three reels show initially; the `View More` button expands the remaining reels with a CSS transition.

## Styling Conventions

Use the split CSS layers instead of adding one-off rules to `index.html`.

- Put global tokens and base element styles in `assets/css/base.css`.
- Put reusable spacing/layout patterns in `assets/css/layout.css`.
- Put repeated UI pieces in `assets/css/components.css`.
- Put page-specific composition in `assets/css/sections.css`.
- Put animation-only rules in `assets/css/motion.css`.

Prefer existing classes and section patterns. Use `text-wrap: balance` for short display copy where it improves line breaks, but avoid it for dense lists or long form-field labels.

## Color And Typography

The palette and font choices are fixed in `assets/css/base.css` as CSS variables. The current direction uses a bright pink accent, Lora headings, and Montserrat body/UI text. Keep component and section CSS pointed at variables instead of hardcoding repeated color or font values.

## JavaScript Conventions

Scripts are loaded directly by `index.html` in dependency order:

1. `assets/js/header.js`
2. `assets/js/dropdown.js`
3. `assets/js/reveal.js`
4. `assets/js/stats.js`
5. `assets/js/reels.js`
6. `assets/js/contact.js`
7. `assets/js/main.js`

Keep behavior in the relevant behavior module and bootstrapping in `main.js`. Do not add a build system or dependencies for simple static-site behavior.

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

After JavaScript edits, run:

```sh
node --check assets/js/*.js
```

For copy-only edits, a targeted file review is usually enough unless visual QA is requested.

After visual or behavior edits, run the local server and inspect:

- desktop around `1440px`
- mobile around `390px`
- full-page screenshots for blank sections, overflow, or clipped text
- desktop navigation visibility and mobile header spacing
- FAQ open/close
- mobile reel "View More", reel lazy-loading, and playback
- contact section and footer wrapping on mobile

## Deployment

Before publishing:

1. Confirm page copy, links, images, posters, and videos are final.
2. Update `CNAME` only if using a different custom domain.
3. Update `sitemap.xml` and `robots.txt` if the final public URL changes.
4. Verify locally at `http://127.0.0.1:4173/`.
