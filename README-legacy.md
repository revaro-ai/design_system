# Revaro design system

Design rules, tokens, components and assets for the Revaro seller app. The brand book (decisions, writing, layout, accessibility, changelog) is in [README-brand.md](README-brand.md).

**Docs site:** open `index.html`, or the GitHub Pages site once it's enabled. It has the principles, colour, type, spacing, writing rules, every component live (with a light/dark switch, a 360px phone width and copyable HTML), icons, logos and the changelog.

## What's here

| Path | What |
| --- | --- |
| `README-brand.md` | The brand book |
| `tokens/tokens.json` | Source of truth: colours (light and dark), type, spacing, radius, shadows, sizes |
| `tokens/tokens.css` | CSS custom properties generated from `tokens.json` |
| `tailwind/revaro.css` | The tokens as a Tailwind CSS v4 theme, plus the components. Generated from `tokens.json` |
| `components/bundle.css` | Component styles (`rv-` classes), using only token variables |
| `components/<Name>/preview.html` | A standalone, working preview of each component |
| `components/<Name>/README.md` | Guidelines for each component |
| `assets/` | Logos (SVG and PNG), icons, share card, fonts (Rubik and Pyidaungsu) |
| `index.html` | The docs site. Generated; don't edit by hand |
| `scripts/build-tokens.mjs` | Builds `tokens.css` and `tailwind/revaro.css` from `tokens.json` |
| `scripts/build-site.mjs` | Builds `index.html` from the READMEs, `tokens.json`, the previews and `assets/` |
| `site.css`, `site.js` | Docs site styles and behaviour (not needed in the app) |

## Install

```sh
npm install github:revaro-ai/design_system
```

The package is called `@revaro/design-system`. To update, run the same command again (or `npm update @revaro/design-system`). You can also copy `tokens/`, `components/bundle.css`, `tailwind/` and `assets/Fonts/` into your app; keep the folders side by side so the font paths still work.

## Use it with Tailwind CSS (v4)

In your CSS entry file (in Next.js, `app/globals.css`):

```css
@import "tailwindcss";
@import "@revaro/design-system/tailwind.css";
```

Then put `rv-root` on `<body>` and mix the two freely:

```tsx
<body className="rv-root">
  <main className="max-w-content mx-auto p-4 grid gap-5">
    <h1 className="text-display">14 orders ready</h1>
    <article className="rv-order">…</article>
    <p className="text-caption text-ink-muted">Updated 2 min ago</p>
    <button className="rv-btn rv-btn--primary rv-btn--block">Review 14 orders</button>
  </main>
</body>
```

What the theme adds:

| Tailwind | Comes from |
| --- | --- |
| `bg-ground`, `bg-surface`, `bg-surface-sunken`, `text-ink`, `text-ink-muted`, `border-line`, `border-line-strong`, `bg-primary text-on-primary`, `bg-brand-dot`, `text-accent`, `bg-warning-bg text-warning-fg` and every other colour token | Colour tokens, same names. They switch with light and dark on their own, so you rarely need `dark:` |
| `p-4`, `gap-5`, `mt-6`… | Nothing to add: Tailwind's 4px step is the same as `space-1`…`space-12` |
| `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-pill` | Radius tokens (6, 10, 16px, pill) |
| `shadow-card`, `shadow-sheet` | Shadow tokens |
| `font-sans`, `font-my`, `font-mono` | Rubik, Pyidaungsu, system mono |
| `text-display`, `text-title`, `text-heading`, `text-body`, `text-label`, `text-caption`, `text-numeral`, `text-body-my`, `text-heading-my` | Type styles: size, line height, weight and font in one class |
| `min-h-tap`, `min-h-tap-comfort`, `max-w-content` | Size tokens |
| `dark:` | The same rule as the tokens: `data-theme="dark"` on a parent, or the phone's dark setting unless `data-theme="light"` is set |
| `rv-btn`, `rv-badge`, `rv-order`… | All components, in Tailwind's `components` layer, so utilities still win: `className="rv-btn w-full"` works |

Use the token colours rather than Tailwind's built-in palette (`text-ink`, not `text-gray-900`), so dark mode and the brand stay right. To remove the built-in palette completely, add `@theme { --color-*: initial; }` **between** the two imports.

## Use it without Tailwind

```css
@import "@revaro/design-system/tokens.css";
@import "@revaro/design-system/bundle.css";
```

or, in plain HTML:

```html
<link rel="stylesheet" href="tokens/tokens.css">
<link rel="stylesheet" href="components/bundle.css">
<body class="rv-root">
  <button class="rv-btn rv-btn--primary">Confirm order</button>
</body>
```

`tokens.css` also has plain type classes (`.display`, `.title`, `.body`…). The Tailwind file leaves those out and gives you `text-display` and friends instead, so they can't clash with your own class names.

## Dark mode and Burmese

Dark mode follows the phone's setting. Set `data-theme="dark"` or `data-theme="light"` on `<html>` (or any element) to force one. If a script sets it before React loads, add `suppressHydrationWarning` to `<html>`.

Put `lang="my"` on Burmese text and add `rv-my` (or `font-my`) so it gets Pyidaungsu and the taller line height.

## Change the tokens

`tokens/tokens.json` is the source of truth. After editing it, run:

```sh
npm run build
```

That regenerates `tokens/tokens.css`, `tailwind/revaro.css` and the docs site. Never edit the generated files by hand.

## Update the docs site

`index.html` is built from the other files. After changing a README, a `preview.html` or an asset, run:

```sh
npm run build:site
```

It needs Node 18 or newer and has no dependencies. New components show up once they're listed under **Components** in `README-brand.md` and have a `components/<Name>/` folder with a README and a preview.

## Publish the docs site

`.github/workflows/pages.yml` rebuilds `index.html` and deploys the repository root to GitHub Pages. In the repository's **Settings › Pages**, set **Source** to **GitHub Actions**, then push to `main`.

## Fonts

Both fonts are hosted in `assets/Fonts/` and declared at the top of `components/bundle.css`; nothing loads from Google. Rubik (English) is a variable font, weights 300–900. Pyidaungsu 2.053 (Burmese) is from the Myanmar Computer Federation. Both are under the SIL Open Font License; see `assets/Fonts/README.md`. A page only downloads the files for the scripts it shows.
