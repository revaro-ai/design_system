# Revaro design system

Design rules, tokens, components and assets for the Revaro seller app. The brand book (decisions, writing, layout, accessibility, changelog) is in [README-brand.md](README-brand.md).

**Gallery:** open `index.html`, or the GitHub Pages site once it's enabled. Every component is shown live with its guidelines, in light and dark.

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
| `index.html`, `site.css` | The gallery page |

## Use it in an app

```html
<link rel="stylesheet" href="tokens/tokens.css">
<link rel="stylesheet" href="components/bundle.css">
<body class="rv-root">
  <button class="rv-btn rv-btn--primary">Confirm order</button>
</body>
```

Dark mode follows the phone's setting. Set `data-theme="dark"` or `data-theme="light"` on `<html>` to force one.

## Publish the gallery

`.github/workflows/pages.yml` deploys the repository root to GitHub Pages. In the repository's **Settings › Pages**, set **Source** to **GitHub Actions**, then push to `main`.

## Fonts

Rubik and Padauk load from Google Fonts. Burmese text tries the phone's own Pyidaungsu first; it isn't bundled because its licence for embedding hasn't been confirmed.

`tokens/tokens.css` is generated. If you change `tokens.json`, regenerate the CSS rather than editing it by hand.
