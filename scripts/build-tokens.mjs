#!/usr/bin/env node
// Generates the CSS that comes from tokens/tokens.json. No dependencies.
//   tokens/tokens.css   CSS custom properties and the type classes, for plain CSS
//   tailwind/revaro.css the same tokens as a Tailwind CSS v4 theme, plus the components in a layer
// Run from anywhere: node scripts/build-tokens.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const t = JSON.parse(readFileSync(join(ROOT, "tokens/tokens.json"), "utf8"));

const ref = (v) => (/^\{.+\}$/.test(v) ? `var(--${v.slice(1, -1)})` : v);
const themed = [...t.color.tokens, ...t.shadow.tokens];
const themeVars = (theme, indent) => themed.map((x) => `${indent}--${x.name}: ${ref(x.value[theme])};`).join("\n");
const fixedVars = [
  ...t.spacing.tokens, ...t.radius.tokens, ...t.size.tokens,
  ...Object.entries(t.type.families).map(([name, value]) => ({ name: `font-${name}`, value })),
].map((x) => `  --${x.name}: ${x.value};`).join("\n");
const typeStyles = t.type.groups.flatMap((g) => g.styles.map((s) => ({ ...s, family: s.family || g.family })));
const typeDecls = (s) => `font-family: var(--font-${s.family}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight};${s.letterSpacing ? ` letter-spacing: ${s.letterSpacing};` : ""}`;

/** Light on :root, dark by attribute, and dark by the phone's setting unless light is forced. */
const themeBlocks = `:root, [data-theme="light"] {
${themeVars("light", "  ")}
}
[data-theme="dark"] {
${themeVars("dark", "  ")}
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${themeVars("dark", "    ")}
  }
}
:root {
${fixedVars}
}`;

/* ------------------------------------------------------------ tokens.css */

const tokensCss = `/* Revaro tokens, generated from tokens.json. Edit tokens.json, then regenerate. */
${themeBlocks}
${typeStyles.map((s) => `.${s.name} { ${typeDecls(s)} }`).join("\n")}
`;

/* ------------------------------------------------------ tailwind/revaro.css */

const colourNames = t.color.tokens.map((x) => x.name);
const tailwindCss = `/* Revaro for Tailwind CSS v4. Generated from tokens/tokens.json by scripts/build-tokens.mjs; don't edit by hand.

   In your CSS entry file:
     @import "tailwindcss";
     @import "<path to this repo>/tailwind/revaro.css";

   What you get:
   - Colours as utilities with the token names: bg-surface, text-ink, text-ink-muted, border-line,
     bg-warning-bg text-warning-fg, bg-brand-dot… They switch with light and dark on their own.
   - Spacing needs nothing: Tailwind's 4px step already matches the tokens (p-4 = space-4 = 16px).
   - rounded-sm/md/lg/pill, shadow-card, shadow-sheet, font-sans, font-my, font-mono with Revaro values.
   - min-h-tap, min-h-tap-comfort, max-w-content.
   - Type styles: text-display, text-title, text-heading, text-body, text-label, text-caption,
     text-numeral, text-body-my, text-heading-my.
   - dark: follows the same rule as the tokens: data-theme="dark", or the phone's setting unless
     data-theme="light" is set.
   - Every rv- component class, in the components layer, so your utilities can still adjust them
     (class="rv-btn w-full" works). */

/* Components and fonts. @import has to come first in the file. */
@import "../components/bundle.css" layer(components);

/* The token values. Left outside any layer on purpose: they replace Tailwind's own defaults for
   --font-sans, --radius-sm/md/lg and friends with Revaro's. */
${themeBlocks}

/* Utilities. "reference" stops Tailwind writing these again as variables; "inline" makes each
   utility point straight at the token, so it follows the theme. */
@theme inline reference {
${colourNames.map((n) => `  --color-${n}: var(--${n});`).join("\n")}

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-pill: var(--radius-pill);

${t.shadow.tokens.map((x) => `  --shadow-${x.name.replace(/^shadow-/, "")}: var(--${x.name});`).join("\n")}

${Object.keys(t.type.families).map((n) => `  --font-${n}: var(--font-${n});`).join("\n")}

  --spacing-tap: var(--tap-min);
  --spacing-tap-comfort: var(--tap-comfort);
  --container-content: var(--content-max);
}

${typeStyles.map((s) => `@utility text-${s.name} { ${typeDecls(s)} }`).join("\n")}

@custom-variant dark {
  &:where([data-theme="dark"], [data-theme="dark"] *) { @slot; }
  @media (prefers-color-scheme: dark) {
    &:where(:root:not([data-theme="light"]), :root:not([data-theme="light"]) *):not(:where([data-theme="light"], [data-theme="light"] *)) { @slot; }
  }
}
`;

writeFileSync(join(ROOT, "tokens/tokens.css"), tokensCss);
mkdirSync(join(ROOT, "tailwind"), { recursive: true });
writeFileSync(join(ROOT, "tailwind/revaro.css"), tailwindCss);
console.log(`tokens.css and tailwind/revaro.css: ${colourNames.length} colours, ${typeStyles.length} type styles`);
