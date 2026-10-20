# Revaro

How the Revaro seller app should look, read and behave. Kept by Arkar (build) and Phyu Thwe (sellers and Burmese copy). Version 2.0, 20 October 2026.

None of this has been in front of a real seller yet. These are our starting calls; expect the December pilots to overturn some of them, and log it below when they do.

## Who it's for

A shop owner, or the admin she pays, selling clothes through a Facebook Page. We're assuming a mid-range Android phone on mobile data, with Messenger and KPay open in the background. She dips into Revaro for a minute at a time: between live sales, while packing, last thing at night. She reads Burmese first.

So the app has to make sense in one glance, with one thumb, on a small screen, half-asleep. If a screen needs explaining, the screen is wrong.

## Decisions so far

**The logo is a word and a full stop.** "revaro." in Rubik Medium with a terracotta full stop. A seller's chat is open-ended; Revaro's job is to close it into a settled order, and the full stop is that moment. The app icon is "r." on slate, set as one word so the dot sits on the baseline. Before landing here we tried a woven chat bubble, a Burmese letter mark, a moon, a price tag and several monograms.

**White, slate and one terracotta action.** The page is white in light mode and near-black in dark, with cards one step off the page. Text is slate. Terracotta (`primary`) is the one action colour: the main button on a screen, switches that are on, the active tab marker and menu item, links (`primary-ink`). Everything else stays slate and grey, so the next thing to tap is always the terracotta one. One main button per screen; if two compete, one of them is secondary. (Changed in 2.0: terracotta used to be a small mark only.)

**Terracotta is never a status.** It means "do this", not "this is the state". States are soft tinted pills, one colour family each: amber for needs you, green for ready to confirm, blue for to pack, grey for dispatched and Revaro answering, crimson for cancelled. Amber and crimson stay well clear of terracotta.

**Rubik for English; Pyidaungsu for Burmese.** Rubik has slightly rounded corners: warm without being cute, and sturdy on small cheap screens. It's common, so the full stop and the colours do the distinguishing. For Burmese we use Pyidaungsu, the government-standard Myanmar Unicode font from MCF: sellers already know it from their phones, so it looks familiar. It's licensed under the SIL Open Font License, so we host version 2.053 ourselves, as we do Rubik (`assets/Fonts/`). That way every seller sees the same Burmese, even on phones with an older copy or none at all, and English-only screens never download it.

**Three bubble colours, never two, and never solid black or white.** Customer in white with a thin outline (`bubble-customer`, `bubble-customer-line`), Revaro in a slate tint (`bubble-revaro`), the seller in a terracotta tint (`bubble-seller`), all on the `canvas` background. Dark mode keeps all three dark. If the seller can't tell at a glance what Revaro said on her behalf, she'll stop trusting it.

**Status is a word first, a colour second.** Every badge carries text. "Receipt received" and "Paid" are different words in different colours, because mixing them up costs money.

**Focus is blue.** Keyboard focus uses `focus` so it's never mistaken for a selected tab or the brand dot.

**No illustrations, gradients or emoji in the app.** They slow down cheap phones and make a tool about money feel like a toy. Empty states get one plain sentence and a button.

**Dark mode ships on day one.** A lot of this app gets used at night. Surfaces match the theme they sit in: floating panels are `elevated` with `shadow-float` in both themes, never a light panel on a dark page or a black one on a light page. Terracotta text lightens (`primary-ink`) so it stays readable on near-black.

## How we write

Write the way a sensible shop assistant talks. Short sentences. Say what happened, then what to do.

| Write | Not |
| --- | --- |
| Receipt received. Check KPay, then confirm. | Payment verified ✓ |
| Black M: 3 left | In stock |
| Couldn't send. Reconnect your Page in Settings. | Error 401: webhook failure |
| Confirm order · 25,000 MMK | Submit |
| Revaro paused here because you replied. | Automation disabled |

Never write "verified", "guaranteed" or "always" about payments or stock. Revaro only knows recorded stock, so say "left" or "available", never "we have". Customer replies in Burmese use the polite ending the shop picks (ရှင့် or ခင်ဗျာ). In the Burmese interface every number uses Burmese digits (၀–၉): prices, counts, dates, times, order and phone numbers. The delivery list CSV keeps Latin digits for packing staff and couriers.

### Status words

Burmese column is a first draft. Phyu Thwe signs these off before anything ships.

| Meaning | English | Burmese (draft) | Tone |
| --- | --- | --- | --- |
| Item held for this chat | Held | သိမ်းထားသည် | info |
| Receipt in, seller must check | Payment to check | ငွေလွှဲ စစ်ရန် | warning |
| Cash on delivery owed | COD due | အိမ်ရောက်ငွေချေ | warning |
| Seller confirmed | Confirmed | အတည်ပြုပြီး | success |
| Revaro handed the chat over | Needs you | သင့်ကို လိုအပ်သည် | warning |
| Customer paid, item gone | Paid, no stock | ငွေရပြီး ပစ္စည်းမရှိ | danger |
| No recorded stock | Sold out | ကုန်သွားပြီ | danger |

## Layout and touch

Three layouts by width. Under 768px: bottom tabs, one column, the main action a full-width `tap-comfort` (48px) button in a bar at the bottom. 768–1279px: a `rail` of icons with labels. 1280px and up: the `sidebar`, with tables for orders and stock and the chat's order panel beside the conversation. Pages use the full width beside the navigation; reading pages (Settings, Billing) stop at `content-max`, aligned left. Desktop text is `body-sm` (14px); phone text and every input stay at `body` (16px).

Side margins are `space-4` (16px) on phones. Anything tappable is at least `tap-min` (44px) on touch screens. Controls are `radius-md`, cards and tables `radius-lg`, bubbles `radius-xl`. Cards use a `line` border and at most `shadow-card`; only floating things get `shadow-float`. Input borders use `line-strong` (3:1); button and chip borders `line-medium`, since their label already identifies them.

Motion is limited to quick fades and colour changes, about 150ms. Nothing bounces. Respect the phone's reduced-motion setting.

## Accessibility

Text is 4.5:1 or better in both themes; borders, icons and focus rings are 3:1 or better. Nothing relies on colour alone. Every input has a visible label. Before shipping a screen, check it with Burmese text at 200% zoom and with TalkBack on.

## Components

React components in `src/components`, using only tokens: Alert, Badge, Button, Card, Dialog, display helpers (MoneyText, Thumbnail, EmptyState), Field and Input, LoadingState, Menu, Switch, Table and ThemeScope. Version 2 adds AppShell, PageHeader, StatCard, StatusPill, DataTable, SelectionBar, FilterChip, DateQuickPick with Calendar, OptionCard, Toast and ChatBubble.

## Not decided yet

- **Logo.** Chosen ("revaro." with a terracotta full stop) but not trademark-checked yet, and not shown to any sellers.
- **Icons.** Twenty-five drawn so far, in slate, on a 24px grid with a 1.5px stroke. If we need more than about 30, switch to an existing outline set rather than draw them all.
- **Does anyone use dark mode?** Watch the December pilots.
- **Burmese labels** in the table above need Phyu Thwe's review.

## Changelog

- **2.0 · 20 Oct 2026** · The Counter look. White page, near-black dark mode, terracotta as the one action colour, soft tinted status pills, three bubbles with no solid black or white, `elevated` panels with `shadow-float`. New tokens: `canvas`, `elevated`, `line-medium`, `ink-soft`, `primary-tint`, `neutral-bg`/`neutral-fg`, `bubble-customer-line`, `radius-xl`, `shadow-float`, `sidebar`, `rail`; type steps `title-sm` and `body-sm`, letter spacing on display and titles; `content-max` is now 720px. Radius and shadow utilities now come from `tokens.json`. Removed the legacy CSS layer (`tailwind.css`, `tokens.css`, `bundle.css`, the `rv-` classes) and the HTML gallery.
- **0.6 · 8 Oct 2026** · Works with Tailwind CSS v4: `tailwind/revaro.css` turns the tokens into utilities (`bg-surface`, `text-ink-muted`, `text-display`, `rounded-pill`…) and puts the components in a layer. Rubik is now hosted too, so nothing loads from Google. Installable with `npm install github:revaro-ai/design_system`.
- **0.5.1 · 8 Oct 2026** · Burmese is now Pyidaungsu 2.053 everywhere, hosted from `assets/Fonts/` (SIL Open Font License). Padauk removed.
- **0.5 · 8 Oct 2026** · Added 14 components for the MVP screens (AppHeader, BottomNav, Dialog, BottomSheet, Toggle, Stepper, ListRow, Select, Checkbox, LoadingState, EmptyState, Toast, ReceiptViewer, CodeInput), 15 interface icons and a `scrim` colour for overlays.
- **0.4.3 · 8 Oct 2026** · Removed the retired woven-bubble logo files and the longyi check pattern.
- **0.4.2 · 8 Oct 2026** · Icons redrawn in slate, all one colour. Added PNG app icons (512, 192, Apple 180) and a PNG share card.
- **0.4.1 · 8 Oct 2026** · Burmese font stack now tries the phone's own Pyidaungsu before Padauk.
- **0.4 · 8 Oct 2026** · New logo: "revaro." with a terracotta full stop. Colours moved to slate, stone and terracotta; English font to Rubik. Warning and danger colours moved away from terracotta. Longyi check pattern retired.
- **0.3 · 8 Oct 2026** · Added a draft logo (mark, wordmark, app icon, favicon), ten icons, the longyi check tile and a share card.
- **0.2 · 8 Oct 2026** · Moved from teal, cream and Plus Jakarta Sans to indigo, thanaka and marigold with Schibsted Grotesk and Padauk. Seller bubble changed to marigold. Docs rewritten.
- **0.1 · 8 Oct 2026** · First version, taken from the pitch deck.
