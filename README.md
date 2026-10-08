# Revaro design system

Design rules, tokens, components and assets for the Revaro seller app. The brand book (decisions, writing, layout, accessibility, changelog) is in [README-brand.md](README-brand.md).

**Docs site:** open `index.html`, or the GitHub Pages site once it's enabled. It has the principles, colour, type, spacing, writing rules, every component live (with a light/dark switch, a 360px phone width and copyable HTML), icons, logos and the changelog.

## What's here

| Path | What |
| --- | --- |
| `README-brand.md` | The brand book |
| `tokens/tokens.json` | Source of truth: colours (light and dark), type, spacing, radius, shadows, sizes |
| `tokens/tokens.css` | CSS custom properties generated from `tokens.json` |
| `components/bundle.css` | Component styles (`rv-` classes), using only token variables |
| `components/<Name>/preview.html` | A standalone, working preview of each component |
| `components/<Name>/README.md` | Guidelines for each component |
| `assets/` | Logos (SVG and PNG), icons, share card |
| `index.html` | The docs site. Generated; don't edit by hand |
| `scripts/build-site.mjs` | Builds `index.html` from the READMEs, `tokens.json`, the previews and `assets/` |
| `site.css`, `site.js` | Docs site styles and behaviour (not needed in the app) |

## Use it in an app

```html
<link rel="stylesheet" href="tokens/tokens.css">
<link rel="stylesheet" href="components/bundle.css">
<body class="rv-root">
  <button class="rv-btn rv-btn--primary">Confirm order</button>
</body>
```

Dark mode follows the phone's setting. Set `data-theme="dark"` or `data-theme="light"` on `<html>` to force one.

## Update the docs site

`index.html` is built from the other files. After changing a README, `tokens.json`, a `preview.html` or an asset, run:

```sh
node scripts/build-site.mjs
```

It needs Node 18 or newer and has no dependencies. New components show up once they're listed under **Components** in `README-brand.md` and have a `components/<Name>/` folder with a README and a preview.

## Publish the docs site

`.github/workflows/pages.yml` rebuilds `index.html` and deploys the repository root to GitHub Pages. In the repository's **Settings › Pages**, set **Source** to **GitHub Actions**, then push to `main`.

## Fonts

Rubik and Padauk load from Google Fonts. Burmese text tries the phone's own Pyidaungsu first; it isn't bundled because its licence for embedding hasn't been confirmed.

`tokens/tokens.css` is generated. If you change `tokens.json`, regenerate the CSS rather than editing it by hand.
