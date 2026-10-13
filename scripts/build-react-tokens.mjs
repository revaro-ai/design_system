import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(resolve(root, 'tokens/tokens.json'), 'utf8'));
const themed = [...tokens.color.tokens, ...tokens.shadow.tokens];
const value = v => /^\{.+\}$/.test(v) ? `var(--${v.slice(1, -1)})` : v;
const theme = name => themed.map(t => `  --${t.name.startsWith("shadow-") ? "revaro-" + t.name : t.name}: ${value(t.value[name])};`).join('\n');
const fixed = [...tokens.spacing.tokens, ...tokens.radius.tokens, ...tokens.size.tokens].map(t => `  --${t.name}: ${t.value};`).join('\n');
const families = Object.entries(tokens.type.families).map(([name, family]) => `  --font-${name}: ${family};`).join('\n');
const types = tokens.type.groups.flatMap(g => g.styles.map(s => ({...s, family:s.family || g.family})));
const aliases = tokens.color.tokens.map(t => `  --color-${t.name}: var(--${t.name});`).join('\n');
const typeTheme = types.map(t => `  --text-${t.name.replace(/^text-/, '')}: ${t.fontSize};\n  --text-${t.name.replace(/^text-/, '')}--line-height: ${t.lineHeight};\n  --text-${t.name.replace(/^text-/, '')}--font-weight: ${t.fontWeight};`).join('\n');
writeFileSync(resolve(root, 'styles/tokens.css'), `/* Generated from tokens/tokens.json. */
:root, [data-theme="light"] {\n${theme('light')}\n${fixed}\n${families}\n  color-scheme: light;\n}
[data-theme="dark"] {\n${theme('dark')}\n  color-scheme: dark;\n}
@theme inline {
${aliases}
${typeTheme}
${families}
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-pill: 9999px;
  --shadow-card: var(--revaro-shadow-card);
  --shadow-sheet: var(--revaro-shadow-sheet);
  --container-content: 1120px;
}
`);
