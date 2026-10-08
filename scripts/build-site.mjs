#!/usr/bin/env node
// Builds index.html (the documentation site) from README-brand.md, tokens/tokens.json,
// components/<Name>/README.md + preview.html and assets/. No dependencies.
// Run from anywhere: node scripts/build-site.mjs

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

/* ---------------------------------------------------------------- markdown */

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const MY = /[က-႟]/;
const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function inline(s) {
  let out = esc(s);
  out = out.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => {
    const href = u.endsWith(".md") ? `#${slug(t)}` : u;
    return `<a href="${href}">${t}</a>`;
  });
  return out;
}
// Wrap runs of Burmese text so they get the Burmese font stack and line height.
const myWrap = (html) => (/lang="my"/.test(html) ? html : html.replace(/[\u1000-\u109F]+(?:[ \u00a0]+[\u1000-\u109F]+)*/g, (m) => `<span lang="my" class="rv-my">${m}</span>`));

/** Parse markdown into a flat list of blocks: {type, ...}. Covers what our READMEs use. */
function blocks(md) {
  const lines = md.replace(/\r/g, "").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) { out.push({ type: "h", level: m[1].length, text: m[2] }); i++; continue; }
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim(); const body = []; i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i++; out.push({ type: "code", lang, text: body.join("\n") }); continue;
    }
    if (line.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      out.push({ type: "table", head: cells(rows[0]), rows: rows.slice(2).map(cells) }); continue;
    }
    if (/^[-*]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        let item = lines[i++].replace(/^[-*]\s+/, "");
        while (i < lines.length && /^\s{2,}\S/.test(lines[i])) item += " " + lines[i++].trim();
        items.push(item);
      }
      out.push({ type: "ul", items }); continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|\||[-*]\s)/.test(lines[i])) para.push(lines[i++].trim());
    out.push({ type: "p", text: para.join(" ") });
  }
  return out;
}

function renderBlocks(bs, { headingShift = 0 } = {}) {
  return bs.map((b) => {
    switch (b.type) {
      case "h": { const l = Math.min(6, b.level + headingShift); return `<h${l} id="${slug(b.text)}">${inline(b.text)}</h${l}>`; }
      case "p": return `<p>${myWrap(inline(b.text))}</p>`;
      case "ul": return `<ul>${b.items.map((t) => `<li>${myWrap(inline(t))}</li>`).join("")}</ul>`;
      case "code": return codeBlock(b.text, b.lang);
      case "table": return `<div class="table-wrap"><table><thead><tr>${b.head.map((h) => `<th>${inline(h)}</th>`).join("")}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${myWrap(inline(c))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
  }).join("\n");
}

/** Split blocks into sections by a heading level. */
function sections(bs, level) {
  const intro = []; const secs = [];
  for (const b of bs) {
    if (b.type === "h" && b.level === level) secs.push({ title: b.text, blocks: [] });
    else (secs.length ? secs[secs.length - 1].blocks : intro).push(b);
  }
  return { intro, secs };
}

/* --------------------------------------------------------------- html code */

const INLINE_TAGS = new Set(["a", "b", "strong", "em", "small", "span", "code", "svg", "path", "circle", "input", "output", "option", "img", "br", "kbd"]);
const VOID = new Set(["input", "img", "br", "hr", "meta", "link", "path", "circle"]);

/** Indent HTML for the code panel: block tags on their own lines, inline content kept together. */
function prettyHtml(html) {
  const tokens = html.match(/<[^>]+>|[^<]+/g) || [];
  const lines = []; let buf = ""; let depth = 0;
  const pad = () => "  ".repeat(depth);
  const flush = () => { if (buf.trim()) lines.push(buf.replace(/\s+$/, "")); buf = ""; };
  for (const t of tokens) {
    const m = t.match(/^<\/?([a-zA-Z0-9]+)/);
    if (!m) { if (t.trim()) buf += buf ? t : pad() + t.replace(/^\s+/, ""); continue; }
    const tag = m[1].toLowerCase();
    const closing = t.startsWith("</");
    const selfClosing = VOID.has(tag) || t.endsWith("/>");
    if (INLINE_TAGS.has(tag) || (buf && inSvg(buf))) { buf += buf ? t : pad() + t; continue; }
    if (closing) {
      depth = Math.max(0, depth - 1);
      if (buf) { buf += t; flush(); } else lines.push(pad() + t);
    } else {
      flush(); buf = pad() + t;
      if (!selfClosing) depth++; else flush();
    }
  }
  flush();
  return lines.join("\n");
}
const inSvg = (s) => (s.match(/<svg/g) || []).length > (s.match(/<\/svg>/g) || []).length;

function highlight(code) {
  // Light-touch HTML highlighting on escaped text. Attributes first, so the spans added
  // for tags aren't themselves highlighted as attributes.
  return esc(code)
    .replace(/([a-zA-Z:-]+)="([^"]*)"/g, '<span class="t-attr">$1</span>=<span class="t-str">"$2"</span>')
    .replace(/(&lt;\/?)([a-zA-Z0-9-]+)/g, '$1<span class="t-tag">$2</span>')
    .replace(/(?<![a-z0-9-])(--[a-z0-9-]+)/g, '<span class="t-var">$1</span>');
}

function codeBlock(text, lang = "html", label) {
  return `<div class="code"><div class="code__bar"><span>${label || lang || "code"}</span><button class="code__copy" type="button" data-copy-code>Copy</button></div><pre><code>${highlight(text)}</code></pre></div>`;
}

/* ------------------------------------------------------------------ colour */

const tokens = JSON.parse(read("tokens/tokens.json"));
const colorTokens = tokens.color.tokens;
const byName = Object.fromEntries(colorTokens.map((t) => [t.name, t]));
function resolve(name, theme) {
  let v = byName[name].value[theme];
  while (/^\{.+\}$/.test(v)) v = byName[v.slice(1, -1)].value[theme];
  return v;
}
function luminance(hex) {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const COLOR_GROUPS = [
  { title: "Paper and stone", note: "Grounds, surfaces and lines. Warm, quiet, and never competing with content.", names: ["ground", "surface", "surface-sunken", "line", "line-strong"] },
  { title: "Ink", note: "The brand is mostly ink: slate text and slate buttons. They flip to stone in dark mode.", names: ["ink", "ink-muted", "primary", "primary-hover", "primary-ink", "on-primary"] },
  { title: "Terracotta", note: "One small, deliberate mark. If it shows up everywhere, the dot stops meaning anything.", names: ["brand-dot", "accent"] },
  { title: "Status", note: "Always a word first. Amber and crimson are kept well clear of terracotta.", names: ["info-bg", "info-fg", "success-bg", "success-fg", "warning-bg", "warning-fg", "danger-bg", "danger-fg", "danger-solid", "on-danger-solid"] },
  { title: "Conversation", note: "Three bubble colours, never two.", names: ["bubble-customer", "bubble-revaro", "on-bubble-revaro", "bubble-seller", "on-bubble-seller"] },
  { title: "Utility", note: "Focus is blue so it's never mistaken for a selected tab or the dot.", names: ["focus", "scrim"] },
];
const PAIRS = [
  ["ink", "ground", "Body text"],
  ["ink-muted", "surface", "Help text"],
  ["on-primary", "primary", "Primary button"],
  ["accent", "surface", "Brand word"],
  ["info-fg", "info-bg", "Held"],
  ["success-fg", "success-bg", "Confirmed"],
  ["warning-fg", "warning-bg", "Payment to check"],
  ["danger-fg", "danger-bg", "Paid, no stock"],
  ["on-danger-solid", "danger-solid", "Reject payment"],
  ["on-bubble-revaro", "bubble-revaro", "Revaro · automatic"],
  ["on-bubble-seller", "bubble-seller", "You · 8:02 AM"],
  ["ink", "bubble-customer", "Customer"],
];

const hexOrRaw = (v) => v;
function swatch(name) {
  const t = byName[name];
  const l = resolve(name, "light"), d = resolve(name, "dark");
  return `<button class="swatch" type="button" data-copy="var(--${name})" title="Copy var(--${name})">
  <span class="swatch__chip" style="background:var(--${name})"></span>
  <span class="swatch__body"><span class="swatch__name">${name}</span>
  <span class="swatch__vals"><span><i style="background:${l}"></i>${hexOrRaw(l)}</span><span><i style="background:${d}"></i>${hexOrRaw(d)}</span></span>
  <span class="swatch__use">${esc(t.usage)}</span></span></button>`;
}
function grade(r) { return r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA large" : "Fail"; }
function pairTile([fg, bg, sample]) {
  const rl = contrast(resolve(fg, "light"), resolve(bg, "light"));
  const rd = contrast(resolve(fg, "dark"), resolve(bg, "dark"));
  return `<div class="pair" style="background:var(--${bg});color:var(--${fg})">
  <span class="pair__aa">Aa</span><span class="pair__sample">${sample}</span>
  <span class="pair__meta"><code>${fg}</code> on <code>${bg}</code></span>
  <span class="pair__ratios"><span title="Light theme">☀ ${rl.toFixed(1)} <b>${grade(rl)}</b></span><span title="Dark theme">☾ ${rd.toFixed(1)} <b>${grade(rd)}</b></span></span></div>`;
}

/* -------------------------------------------------------------- brand book */

const brand = blocks(read("README-brand.md"));
const { intro: brandIntro, secs: brandSecs } = sections(brand, 2);
const sec = (title) => brandSecs.find((s) => s.title.toLowerCase().startsWith(title.toLowerCase()));
const introParas = brandIntro.filter((b) => b.type === "p").map((b) => b.text);
const versionMatch = introParas[0].match(/Version ([\d.]+), ([^.]+?)\.?$/);
const VERSION = versionMatch ? versionMatch[1] : "";
const VERSION_DATE = versionMatch ? versionMatch[2] : "";

// "Decisions so far": each paragraph opens with a bold title.
const principles = sec("Decisions").blocks.filter((b) => b.type === "p").map((b) => {
  const m = b.text.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  return m ? { title: m[1], body: m[2] } : { title: "", body: b.text };
});

// "How we write": write/not table, rules, status words.
const writing = sec("How we write");
const { intro: writeIntro, secs: writeSubs } = sections(writing.blocks, 3);
const doDont = writeIntro.find((b) => b.type === "table");
const writeParas = writeIntro.filter((b) => b.type === "p");
const statusSub = writeSubs.find((s) => /status words/i.test(s.title));
const statusTable = statusSub.blocks.find((b) => b.type === "table");
const statusNote = statusSub.blocks.find((b) => b.type === "p");

// Components list in the brand book sets the groups and order.
const compSec = sec("Components");
const compGroups = compSec.blocks.find((b) => b.type === "ul").items.map((it) => {
  const m = it.match(/^\*\*(.+?):\*\*\s*(.*)$/);
  return { title: m[1], names: m[2].split(",").map((s) => s.trim()) };
});
const compIntro = compSec.blocks.filter((b) => b.type === "p");

const openQs = sec("Not decided").blocks.find((b) => b.type === "ul").items.map((t) => {
  const m = t.match(/^\*\*(.+?)\*\*\s*(.*)$/); return m ? { title: m[1].replace(/\.$/, ""), body: m[2] } : { title: "", body: t };
});
const changelog = sec("Changelog").blocks.find((b) => b.type === "ul").items.map((t) => {
  const m = t.match(/^\*\*(.+?) · (.+?)\*\*\s*·\s*(.*)$/); return { v: m[1], date: m[2], body: m[3] };
});

/* -------------------------------------------------------------- components */

const comps = compGroups.flatMap((g) => g.names.map((name) => {
  const dir = `components/${name}`;
  if (!existsSync(join(ROOT, dir, "README.md"))) throw new Error(`Missing ${dir}/README.md`);
  const md = blocks(read(`${dir}/README.md`)).filter((b) => !(b.type === "h" && b.level === 1));
  const preview = read(`${dir}/preview.html`);
  const stage = (preview.match(/<main class="solo">([\s\S]*?)<\/main>/) || [])[1]?.trim() || "";
  const leadIdx = md.findIndex((b) => b.type === "p");
  const lead = leadIdx >= 0 ? md[leadIdx].text : "";
  const rest = md.filter((_, i) => i !== leadIdx);
  // Strip the layout-only wrapper so the code panel shows just the component.
  const wrap = stage.match(/^<div class="rv-root"[^>]*>([\s\S]*)<\/div>$/);
  const snippet = prettyHtml(wrap ? wrap[1].trim() : stage);
  return { name, group: g.title, lead, rest, stage, snippet };
}));
const groupId = (t) => "g-" + slug(t);

// Thumbnails sit inside a link, so their own links become spans (nested <a> breaks parsing) and ids go.
const thumb = (html) => html.replace(/\s(id|aria-labelledby|aria-describedby|href)="[^"]*"/g, "").replace(/<a(\s|>)/g, "<span$1").replace(/<\/a>/g, "</span>");

function componentSection(c) {
  return `<section class="comp" id="${c.name}" data-section>
  <header class="comp__head">
    <div><span class="eyebrow">${esc(c.group)}</span><h3 class="comp__title">${c.name}</h3>
    <p class="comp__lead">${inline(c.lead)}</p></div>
    <a class="chip-link" href="components/${c.name}/preview.html">Open alone <svg class="rv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h9v9M18 6L6 18"/></svg></a>
  </header>
  <div class="demo" data-demo>
    <div class="demo__bar">
      <div class="seg" role="group" aria-label="Preview theme"><button type="button" data-stage-theme="" aria-pressed="true">Page</button><button type="button" data-stage-theme="light" aria-pressed="false">Light</button><button type="button" data-stage-theme="dark" aria-pressed="false">Dark</button></div>
      <div class="seg" role="group" aria-label="Preview width"><button type="button" data-stage-width="" aria-pressed="true">Fill</button><button type="button" data-stage-width="phone" aria-pressed="false">360px</button></div>
      <button type="button" class="demo__code-btn" data-toggle-code aria-expanded="false"><svg class="rv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg>Code</button>
    </div>
    <div class="demo__stage"><div class="demo__frame">${c.stage}</div></div>
    <div class="demo__code" hidden>${codeBlock(c.snippet, "html", "HTML")}</div>
  </div>
  <div class="prose comp__doc">${renderBlocks(c.rest, { headingShift: 2 })}</div>
</section>`;
}

/* ------------------------------------------------------------------ assets */

const cleanSvg = (s) => s.replace(/<\?xml[^>]*>/, "").replace(/<metadata>[\s\S]*?<\/metadata>/g, "").replace(/\sxmlns:c2pa="[^"]*"/, "");
const icons = readdirSync(join(ROOT, "assets/Icons")).filter((f) => f.endsWith(".svg")).sort().map((f) => {
  const name = f.replace(/\.svg$/, "");
  const svg = cleanSvg(read(`assets/Icons/${f}`))
    .replace(/<title>[^<]*<\/title>/, "")
    .replace(/\s(width|height|role)="[^"]*"/g, "")
    .replace(/#2a2d33/gi, "currentColor")
    .replace("<svg", '<svg aria-hidden="true" class="icon-tile__svg"');
  return { name, file: `assets/Icons/${f}`, svg };
});
const wordmark = cleanSvg(read("assets/Logos/revaro-wordmark.svg"))
  .replace(/<title>[^<]*<\/title>/, "")
  .replace(/\s(width|height)="[^"]*"/g, "")
  .replace('role="img"', 'role="img" aria-label="revaro."')
  .replace(/fill="#2a2d33"/gi, 'fill="currentColor"')
  .replace(/fill="#b5552e"/gi, 'class="logo-dot"');

const logos = [
  { file: "revaro-wordmark.svg", label: "Wordmark", note: "Light backgrounds. Min width 72px.", bg: "paper" },
  { file: "revaro-wordmark-reversed.svg", label: "Wordmark, reversed", note: "Stone on a slate panel, with the lighter dot.", bg: "slate" },
  { file: "revaro-app-icon.svg", label: "App icon", note: "“r.” on slate. PNGs at 512, 192 and 180.", bg: "stone" },
  { file: "revaro-favicon.svg", label: "Favicon", note: "Drawn larger to hold up at 16–32px.", bg: "stone" },
];

/* ------------------------------------------------------------------ layout */

const typeGroups = tokens.type.groups;
const fam = tokens.type.families;

const nav = [
  { title: "Start", items: [["overview", "Overview"], ["who", "Who it’s for"], ["quick-start", "Quick start"], ["tailwind", "Tailwind CSS"], ["principles", "Principles"]] },
  { title: "Foundations", items: [["colour", "Colour"], ["typography", "Typography"], ["layout", "Space and shape"], ["voice", "Voice and words"], ["accessibility", "Accessibility"]] },
  { title: "Components", items: [["components", "All components"]] },
  ...compGroups.map((g) => ({ title: g.title, items: g.names.map((n) => [n, n]) })),
  { title: "Assets", items: [["icons", "Icons"], ["logos", "Logos"]] },
  { title: "Project", items: [["open-questions", "Open questions"], ["changelog", "Changelog"]] },
];

const ICON = {
  search: '<svg class="rv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM20 20l-4.8-4.8"/></svg>',
  menu: '<svg class="rv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  sun: '<svg class="rv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',
  moon: '<svg class="rv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  auto: '<svg class="rv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H4zM9 20h6M12 16v4"/></svg>',
  arrow: '<svg class="rv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg class="rv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  cross: '<svg class="rv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  download: '<svg class="rv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
};

const totalIcons = icons.length;
const toneOf = (t) => (["info", "warning", "success", "danger", "neutral"].includes(t) ? t : "neutral");

const twCss = `/* npm install github:revaro-ai/design_system */
@import "tailwindcss";
@import "@revaro/design-system/tailwind.css";`;
const twJsx = `<body className="rv-root">
  <main className="max-w-content mx-auto p-4 grid gap-5">
    <h1 className="text-display">14 orders ready</h1>
    <article className="rv-order">…</article>
    <p className="text-caption text-ink-muted">Updated 2 min ago</p>
    <span className="bg-warning-bg text-warning-fg rounded-sm px-2 text-label">COD due</span>
    <button className="rv-btn rv-btn--primary rv-btn--block">Review 14 orders</button>
  </main>
</body>`;
const TW_ROWS = [
  ["Colours", colorTokens.map((t) => t.name).filter((n) => !/^on-|hover|scrim|focus/.test(n)).slice(0, 12).map((n) => (/fg$|^ink|^accent|-ink$/.test(n) ? `text-${n}` : n.startsWith("line") ? `border-${n}` : `bg-${n}`)), "Every colour token, same name, for bg-, text-, border-, ring-… They switch with the theme, so you rarely need dark:."],
  ["Spacing", ["p-4", "gap-5", "mt-6"], "Nothing to add: Tailwind's 4px step is the same as space-1 to space-12."],
  ["Type", ["text-display", "text-title", "text-heading", "text-body", "text-label", "text-caption", "text-numeral", "text-body-my", "text-heading-my"], "Size, line height, weight and font in one class."],
  ["Shape", ["rounded-sm", "rounded-md", "rounded-lg", "rounded-pill", "shadow-card", "shadow-sheet"], "Radius and shadow tokens."],
  ["Fonts", ["font-sans", "font-my", "font-mono"], "Rubik, Pyidaungsu and system mono, all hosted."],
  ["Sizes", ["min-h-tap", "min-h-tap-comfort", "max-w-content"], "44px and 48px tap targets, 640px reading width."],
  ["Dark mode", ["dark:"], "Same rule as the tokens: data-theme=\"dark\", or the phone's setting unless data-theme=\"light\"."],
  ["Components", ["rv-btn", "rv-badge", "rv-order", "…"], "In Tailwind's components layer, so utilities still win: rv-btn w-full works."],
];
const quickStart = `<link rel="stylesheet" href="tokens/tokens.css">
<link rel="stylesheet" href="components/bundle.css">

<body class="rv-root">
  <button class="rv-btn rv-btn--primary">Confirm order · 25,000 MMK</button>
</body>`;

const heroPhone = `<div class="phone" aria-hidden="true"><div class="phone__screen rv-root">
  <header class="rv-header"><h1 class="rv-header__title">Good morning<span class="rv-header__sub">Ma Thida's Closet · Messenger</span></h1></header>
  <div class="phone__body">
    <section class="rv-summary"><div><div class="rv-summary__eyebrow">Overnight · 10 PM – 8 AM</div><div class="rv-summary__big">14 orders ready</div></div>
    <ul class="rv-summary__list"><li class="rv-summary__item"><span>Payments to check</span><span class="rv-badge rv-badge--warning">3</span></li><li class="rv-summary__item"><span>Chats that need you</span><span class="rv-badge rv-badge--warning">2</span></li></ul>
    <button class="rv-btn rv-btn--primary rv-btn--block" tabindex="-1">Review 14 orders</button></section>
    <div class="rv-chat phone__chat"><p class="rv-bubble rv-bubble--customer rv-my" lang="my">ဒီဂါဝန် အနက်ရောင် ရှိသေးလား ရှင့်</p><p class="rv-bubble rv-bubble--revaro">Black M · 2 left. 25,000 MMK<span class="rv-bubble__meta">Revaro · automatic</span></p></div>
  </div>
  <nav class="rv-bottomnav"><span class="rv-bottomnav__item" aria-current="page"><svg class="rv-icon" viewBox="0 0 24 24"><path d="M3 13l2.5-7.5A2 2 0 0 1 7.4 4h9.2a2 2 0 0 1 1.9 1.5L21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5zM3 13h5l1.5 2.5h5L16 13h5"/></svg>Queue<span class="rv-bottomnav__count">3</span></span><span class="rv-bottomnav__item"><svg class="rv-icon" viewBox="0 0 24 24"><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-9l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>Chats</span><span class="rv-bottomnav__item"><svg class="rv-icon" viewBox="0 0 24 24"><path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8"/></svg>Stock</span><span class="rv-bottomnav__item"><svg class="rv-icon" viewBox="0 0 24 24"><path d="M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4"/></svg>Settings</span></nav>
</div></div>
<div class="float float--badges rv-root" aria-hidden="true"><span class="rv-badge rv-badge--success">Confirmed</span><span class="rv-badge rv-badge--info">Held</span></div>`;

const whoFor = sec("Who it").blocks.filter((b) => b.type === "p").map((b) => b.text);
const layoutTouch = sec("Layout").blocks;
const a11y = sec("Accessibility").blocks;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Revaro design system</title>
<meta name="description" content="Tokens, components, words and assets for the Revaro seller app. Light and dark, English and Burmese.">
<meta property="og:title" content="Revaro design system">
<meta property="og:description" content="Tokens, components, words and assets for the Revaro seller app.">
<meta property="og:image" content="assets/Social/revaro-share-card.png">
<meta name="theme-color" content="#f7f5f0" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#17191d" media="(prefers-color-scheme: dark)">
<link rel="icon" href="assets/Logos/revaro-favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/Logos/apple-touch-icon-180.png">
<script>try{var t=localStorage.getItem("rv-docs-theme");if(t)document.documentElement.dataset.theme=t;}catch(e){}</script>
<link rel="stylesheet" href="tokens/tokens.css">
<link rel="stylesheet" href="components/bundle.css">
<link rel="stylesheet" href="site.css">
</head>
<!-- Generated by scripts/build-site.mjs. Edit the READMEs, tokens or previews, then rebuild. -->
<body class="rv-root docs">
<a class="skip" href="#main">Skip to content</a>

<div class="topbar">
  <button class="rv-icon-btn" type="button" data-nav-open aria-label="Open navigation" aria-controls="sidebar" aria-expanded="false">${ICON.menu}</button>
  <a class="topbar__logo logo" href="#overview">${wordmark}</a>
  <span class="ver">v${VERSION}</span>
</div>

<aside class="sidebar" id="sidebar" aria-label="Documentation">
  <div class="sidebar__top">
    <a class="logo" href="#overview">${wordmark}</a>
    <span class="ver">v${VERSION}</span>
  </div>
  <label class="search">${ICON.search}<input type="search" placeholder="Search" aria-label="Search the docs" data-search autocomplete="off"><kbd>/</kbd></label>
  <nav class="sidebar__nav">
${nav.map((g) => `    <div class="navgroup"><p class="navgroup__title">${g.title}</p><ul>${g.items.map(([id, label]) => `<li><a href="#${id}" data-nav>${label}</a></li>`).join("")}</ul></div>`).join("\n")}
    <p class="search__empty" hidden>Nothing matches.</p>
  </nav>
  <div class="sidebar__foot">
    <div class="seg seg--theme" role="group" aria-label="Colour theme">
      <button type="button" data-theme-set="light" aria-pressed="false" title="Light">${ICON.sun}<span>Light</span></button>
      <button type="button" data-theme-set="" aria-pressed="true" title="Follow the device">${ICON.auto}<span>Auto</span></button>
      <button type="button" data-theme-set="dark" aria-pressed="false" title="Dark">${ICON.moon}<span>Dark</span></button>
    </div>
  </div>
</aside>
<div class="sidebar-scrim" data-nav-close hidden></div>

<main class="main" id="main">

<section class="hero" id="overview" data-section>
  <div class="hero__text">
    <span class="pill"><span class="pill__dot"></span>Design system · v${VERSION} · ${VERSION_DATE}</span>
    <h1 class="hero__title">Close the chat.<br>Settle the order<span class="dot">.</span></h1>
    <p class="hero__lead">Tokens, components, words and assets for the Revaro seller app. Light and dark, English and Burmese, made for one thumb on a cheap phone.</p>
    <div class="hero__cta">
      <a class="rv-btn rv-btn--primary" href="#components">Browse components ${ICON.arrow}</a>
      <a class="rv-btn" href="#tailwind">Use with Tailwind</a>
    </div>
    <dl class="stats">
      <div><dt>Components</dt><dd>${comps.length}</dd></div>
      <div><dt>Colour tokens</dt><dd>${colorTokens.length}</dd></div>
      <div><dt>Icons</dt><dd>${totalIcons}</dd></div>
      <div><dt>Themes · scripts</dt><dd>2 · 2</dd></div>
    </dl>
  </div>
  <div class="hero__art">${heroPhone}</div>
</section>

<section class="block who" id="who" data-section>
  <div class="who__text"><span class="eyebrow">Start</span><h2>Who it's for</h2><p>${inline(whoFor[0])}</p><p class="muted">${inline(introParas[1])}</p></div>
  <blockquote class="quote"><p>${inline(whoFor[1])}</p></blockquote>
</section>

<section class="block" id="quick-start" data-section>
  <div class="block__head"><span class="eyebrow">Start</span><h2>Quick start</h2>
  <p>Two stylesheets, one class on <code>body</code>. Every component is plain HTML with <code>rv-</code> classes and only token variables, so it works in any framework.</p></div>
  <div class="qs">
    <div class="qs__code">${codeBlock(quickStart, "html", "index.html")}</div>
    <ol class="qs__steps">
      <li><strong>Tokens</strong><span><code>tokens/tokens.css</code> is generated from <code>tokens.json</code>. Never edit it by hand.</span></li>
      <li><strong>Components</strong><span><code>components/bundle.css</code> holds every <code>rv-</code> class.</span></li>
      <li><strong>Dark mode</strong><span>Follows the phone. Force it with <code>data-theme="dark"</code> or <code>"light"</code> on any element.</span></li>
      <li><strong>Burmese</strong><span>Add <code>lang="my"</code> and <code>rv-my</code> for Pyidaungsu and the taller line height.</span></li>
    </ol>
  </div>
</section>

<section class="block" id="tailwind" data-section>
  <div class="block__head"><span class="eyebrow">Start</span><h2>Tailwind CSS</h2>
  <p>One import turns the tokens into Tailwind v4 utilities and brings every component with it. Use Tailwind for layout, <code>rv-</code> classes for components, and token colours instead of Tailwind's palette.</p></div>
  <div class="qs qs--tw">
    <div class="qs__code">${codeBlock(twCss, "css", "app/globals.css")}</div>
    <div class="qs__code">${codeBlock(twJsx, "tsx", "app/layout.tsx")}</div>
  </div>
  <div class="table-wrap tw-map"><table><thead><tr><th>What</th><th>Utilities</th><th>Notes</th></tr></thead><tbody>
${TW_ROWS.map(([what, classes, note]) => `<tr><td><strong>${what}</strong></td><td><span class="tw-chips">${classes.map((c) => `<code>${esc(c)}</code>`).join("")}</span></td><td>${esc(note)}</td></tr>`).join("\n")}
  </tbody></table></div>
</section>

<section class="block" id="principles" data-section>
  <div class="block__head"><span class="eyebrow">Start</span><h2>Principles</h2><p>The calls we've made so far. None of this has met a real seller yet; expect the December pilots to overturn some of it.</p></div>
  <div class="principles">
${principles.map((p, i) => `    <article class="principle"><span class="principle__n">${String(i + 1).padStart(2, "0")}</span><h3>${inline(p.title.replace(/\.$/, ""))}<span class="dot">.</span></h3><p>${myWrap(inline(p.body))}</p></article>`).join("\n")}
  </div>
</section>

<section class="block" id="colour" data-section>
  <div class="block__head"><span class="eyebrow">Foundations</span><h2>Colour</h2><p>Slate, stone and terracotta. Every token switches with the theme. Click a swatch to copy its variable.</p></div>
${COLOR_GROUPS.map((g) => `  <div class="cgroup"><div class="cgroup__head"><h3>${g.title}</h3><p>${g.note}</p></div><div class="swatches">${g.names.map(swatch).join("")}</div></div>`).join("\n")}
  <div class="cgroup"><div class="cgroup__head"><h3>Contrast pairs</h3><p>Text is 4.5:1 or better in both themes. Ratios are calculated from <code>tokens.json</code> at build time.</p></div>
  <div class="pairs">${PAIRS.map(pairTile).join("")}</div></div>
</section>

<section class="block" id="typography" data-section>
  <div class="block__head"><span class="eyebrow">Foundations</span><h2>Typography</h2><p>Rubik for English: warm without being cute, sturdy on cheap screens. Pyidaungsu for Burmese, hosted so every phone shows the same thing.</p></div>
  <div class="families">
    <div class="family"><span class="family__glyph" style="font-family:var(--font-sans)">Aa</span><div><strong>Rubik</strong><span>English · 400 500 600 700</span><code>--font-sans</code></div></div>
    <div class="family"><span class="family__glyph" style="font-family:var(--font-my)" lang="my">ကခ</span><div><strong>Pyidaungsu 2.053</strong><span>Burmese · 400 700 · SIL OFL</span><code>--font-my</code></div></div>
    <div class="family"><span class="family__glyph" style="font-family:var(--font-mono)">25k</span><div><strong>System mono</strong><span>Prices and counts, tabular</span><code>--font-mono</code></div></div>
  </div>
  <div class="typescale">
${typeGroups.flatMap((g) => g.styles.map((s) => {
  const family = s.family || g.family;
  const style = `font-family:var(--font-${family});font-size:${s.fontSize};line-height:${s.lineHeight};font-weight:${s.fontWeight}${s.letterSpacing ? `;letter-spacing:${s.letterSpacing}` : ""}`;
  return `    <div class="ts"><div class="ts__meta"><code>.${s.name}</code><span>${parseInt(s.fontSize)}/${parseInt(s.lineHeight)} · ${s.fontWeight}</span></div><div class="ts__sample"><span style="${style}"${MY.test(s.sample) ? ' lang="my"' : ""}>${esc(s.sample)}</span><p>${esc(s.usage)}</p></div></div>`;
})).join("\n")}
  </div>
</section>

<section class="block" id="layout" data-section>
  <div class="block__head"><span class="eyebrow">Foundations</span><h2>Space and shape</h2><p>${inline(layoutTouch.find((b) => b.type === "p").text)}</p></div>
  <div class="shape-grid">
    <div class="panel"><h3>Spacing</h3><ul class="spacing">${tokens.spacing.tokens.map((t) => `<li><code>${t.name}</code><span class="spacing__bar" style="width:${parseInt(t.value) * 3}px"></span><b>${t.value}</b><small>${esc(t.usage)}</small></li>`).join("")}</ul></div>
    <div class="panel"><h3>Radius</h3><div class="radii">${tokens.radius.tokens.map((t) => `<div class="radius"><span style="border-radius:var(--${t.name})"></span><code>${t.name}</code><b>${t.value}</b><small>${esc(t.usage)}</small></div>`).join("")}</div>
    <h3>Elevation</h3><div class="radii">${tokens.shadow.tokens.map((t) => `<div class="radius"><span class="elev" style="box-shadow:var(--${t.name})"></span><code>${t.name}</code><small>${esc(t.usage)}</small></div>`).join("")}</div>
    <h3>Sizes</h3><dl class="sizes">${tokens.size.tokens.map((t) => `<div><dt><code>${t.name}</code></dt><dd><b>${t.value}</b> ${esc(t.usage)}</dd></div>`).join("")}</dl></div>
  </div>
  <div class="note"><strong>Motion.</strong> ${inline(layoutTouch.filter((b) => b.type === "p")[1]?.text || "")}</div>
</section>

<section class="block" id="voice" data-section>
  <div class="block__head"><span class="eyebrow">Foundations</span><h2>Voice and words</h2><p>${inline(writeParas[0].text)}</p></div>
  <div class="dodont">
${doDont.rows.map(([yes, no]) => `    <div class="dd"><div class="dd__do">${ICON.check}<span>${inline(yes)}</span></div><div class="dd__dont">${ICON.cross}<span>${inline(no)}</span></div></div>`).join("\n")}
  </div>
  <div class="prose">${writeParas.slice(1).map((p) => `<p>${myWrap(inline(p.text))}</p>`).join("")}</div>
  <h3 class="sub">Status words</h3>
  <p class="muted">${inline(statusNote.text)}</p>
  <div class="table-wrap"><table class="status-table"><thead><tr>${statusTable.head.map((h) => `<th>${inline(h)}</th>`).join("")}</tr></thead><tbody>
${statusTable.rows.map(([meaning, en, my, tone]) => `<tr><td>${inline(meaning)}</td><td><span class="rv-badge rv-badge--${toneOf(tone)}">${inline(en)}</span></td><td><span class="rv-badge rv-badge--${toneOf(tone)} rv-my" lang="my">${esc(my)}</span></td><td><code>${tone}</code></td></tr>`).join("\n")}
  </tbody></table></div>
</section>

<section class="block" id="accessibility" data-section>
  <div class="block__head"><span class="eyebrow">Foundations</span><h2>Accessibility</h2><p>${inline(a11y.find((b) => b.type === "p").text)}</p></div>
  <dl class="stats stats--cards">
    <div><dt>Text contrast</dt><dd>4.5:1</dd></div>
    <div><dt>Borders, icons, focus</dt><dd>3:1</dd></div>
    <div><dt>Smallest tap target</dt><dd>44px</dd></div>
    <div><dt>Burmese zoom check</dt><dd>200%</dd></div>
  </dl>
</section>

<section class="block" id="components" data-section>
  <div class="block__head"><span class="eyebrow">Components</span><h2>Components</h2><p>${compIntro.map((p) => inline(p.text)).join(" ")}</p></div>
  <div class="gallery">
${comps.map((c) => `    <a class="tile" href="#${c.name}"><span class="tile__thumb" aria-hidden="true" inert><span class="tile__scale">${thumb(c.stage)}</span></span><span class="tile__body"><span class="tile__name">${c.name}</span><span class="tile__group">${esc(c.group)}</span></span></a>`).join("\n")}
  </div>
</section>

${compGroups.map((g) => `<div class="compgroup" id="${groupId(g.title)}"><h2 class="compgroup__title"><span class="eyebrow">Components</span>${esc(g.title)}</h2>
${comps.filter((c) => c.group === g.title).map(componentSection).join("\n")}
</div>`).join("\n")}

<section class="block" id="icons" data-section>
  <div class="block__head"><span class="eyebrow">Assets</span><h2>Icons</h2><p>${totalIcons} icons on a 24px grid with a 1.5px round stroke, one colour. Inline them as <code>&lt;svg class="rv-icon"&gt;</code> so they take the text colour. Click one to copy its SVG.</p></div>
  <div class="icons">
${icons.map((i) => `    <button class="icon-tile" type="button" data-copy-svg="${i.name}" title="Copy ${i.name}.svg">${i.svg}<span>${i.name}</span></button>`).join("\n")}
  </div>
</section>

<section class="block" id="logos" data-section>
  <div class="block__head"><span class="eyebrow">Assets</span><h2>Logos</h2><p>A word and a full stop. A seller's chat is open-ended; Revaro's job is to close it into a settled order, and the full stop is that moment. Keep one x-height of clear space; don't recolour the dot.</p></div>
  <div class="logos">
${logos.map((l) => `    <figure class="logo-card"><div class="logo-card__art logo-card__art--${l.bg}"><img src="assets/Logos/${l.file}" alt="${l.label}"></div><figcaption><span><strong>${l.label}</strong>${l.note}</span><a class="rv-icon-btn" href="assets/Logos/${l.file}" download aria-label="Download ${l.label}">${ICON.download}</a></figcaption></figure>`).join("\n")}
  </div>
  <figure class="share"><img src="assets/Social/revaro-share-card.png" alt="Revaro share card" loading="lazy"><figcaption>Share card, 1200×630. Use the PNG for <code>og:image</code>.</figcaption></figure>
</section>

<section class="block" id="open-questions" data-section>
  <div class="block__head"><span class="eyebrow">Project</span><h2>Open questions</h2><p>Things we haven't decided. The pilots should answer most of them.</p></div>
  <div class="questions">
${openQs.map((q) => `    <article class="question"><span class="rv-badge rv-badge--warning">Open</span><h3>${inline(q.title)}</h3><p>${inline(q.body)}</p></article>`).join("\n")}
  </div>
</section>

<section class="block" id="changelog" data-section>
  <div class="block__head"><span class="eyebrow">Project</span><h2>Changelog</h2></div>
  <ol class="timeline">
${changelog.map((c, i) => `    <li${i === 0 ? ' class="is-latest"' : ""}><div class="timeline__v"><span class="ver">${c.v}</span><time>${c.date}</time></div><p>${inline(c.body)}</p></li>`).join("\n")}
  </ol>
</section>

<footer class="foot">
  <span class="logo">${wordmark}</span>
  <p>${inline(introParas[0].replace(/ Version.*$/, ""))}</p>
  <p class="muted">Generated from the READMEs and <code>tokens.json</code> by <code>scripts/build-site.mjs</code>.</p>
</footer>
</main>

<div class="copied rv-root" role="status" aria-live="polite"><div class="rv-toast"><span class="rv-toast__msg" data-copied-msg></span></div></div>

<template id="icon-sources">${icons.map((i) => `<textarea data-icon="${i.name}">${esc(cleanSvg(read(i.file)).trim())}</textarea>`).join("")}</template>

<script src="site.js"></script>
</body>
</html>
`;

writeFileSync(join(ROOT, "index.html"), html);
console.log(`index.html: ${comps.length} components, ${colorTokens.length} colours, ${icons.length} icons, v${VERSION}`);
