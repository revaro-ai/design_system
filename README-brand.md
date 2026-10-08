# Revaro

How the Revaro seller app should look, read and behave. Kept by Arkar (build) and Phyu Thwe (sellers and Burmese copy). Version 0.6, 8 October 2026.

None of this has been in front of a real seller yet. These are our starting calls; expect the December pilots to overturn some of them, and log it below when they do.

## Who it's for

A shop owner, or the admin she pays, selling clothes through a Facebook Page. We're assuming a mid-range Android phone on mobile data, with Messenger and KPay open in the background. She dips into Revaro for a minute at a time: between live sales, while packing, last thing at night. She reads Burmese first.

So the app has to make sense in one glance, with one thumb, on a small screen, half-asleep. If a screen needs explaining, the screen is wrong.

## Decisions so far

**The logo is a word and a full stop.** "revaro." in Rubik Medium with a terracotta full stop. A seller's chat is open-ended; Revaro's job is to close it into a settled order, and the full stop is that moment. The app icon is "r." on slate, set as one word so the dot sits on the baseline. Before landing here we tried a woven chat bubble, a Burmese letter mark, a moon, a price tag and several monograms.

**Slate, stone and terracotta.** The brand is mostly ink: slate text and slate buttons on paper and stone. Terracotta (`brand-dot`) is used the way the logo uses it, as one small deliberate mark: the active tab, the morning count, the logo itself. If terracotta starts showing up everywhere, the dot stops meaning anything.

**Terracotta is never a status.** It sits close to orange and red, so warnings are a yellow-amber and errors a cool crimson, both well clear of the brand colour. A seller should never wonder whether something orange is a problem or just the logo.

**Rubik for English; Pyidaungsu for Burmese.** Rubik has slightly rounded corners: warm without being cute, and sturdy on small cheap screens. It's common, so the full stop and the colours do the distinguishing. For Burmese we use Pyidaungsu, the government-standard Myanmar Unicode font from MCF: sellers already know it from their phones, so it looks familiar. It's licensed under the SIL Open Font License, so we host version 2.053 ourselves, as we do Rubik (`assets/Fonts/`). That way every seller sees the same Burmese, even on phones with an older copy or none at all, and English-only screens never download it.

**Three bubble colours, never two.** Customer in stone (`bubble-customer`), Revaro in slate (`bubble-revaro`), the seller in a terracotta tint (`bubble-seller`). If the seller can't tell at a glance what Revaro said on her behalf, she'll stop trusting it.

**Status is a word first, a colour second.** Every badge carries text. "Receipt received" and "Paid" are different words in different colours, because mixing them up costs money.

**Focus is blue.** Keyboard focus uses `focus` so it's never mistaken for a selected tab or the brand dot.

**No illustrations, gradients or emoji in the app.** They slow down cheap phones and make a tool about money feel like a toy. Empty states get one plain sentence and a button.

**Dark mode ships on day one.** A lot of this app gets used at night. In dark mode the buttons flip to stone on near-black and the dot lightens slightly so it stays visible.

## How we write

Write the way a sensible shop assistant talks. Short sentences. Say what happened, then what to do.

| Write | Not |
| --- | --- |
| Receipt received. Check KPay, then confirm. | Payment verified ✓ |
| Black M: 3 left | In stock |
| Couldn't send. Reconnect your Page in Settings. | Error 401: webhook failure |
| Confirm order · 25,000 MMK | Submit |
| Revaro paused here because you replied. | Automation disabled |

Never write "verified", "guaranteed" or "always" about payments or stock. Revaro only knows recorded stock, so say "left" or "available", never "we have". Customer replies in Burmese use the polite ending the shop picks (ရှင့် or ခင်ဗျာ). Use one digit style per screen, Burmese ၀–၉ or Latin 0–9, whichever the shop chose.

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

Side margins are `space-4` (16px) on phones, cards sit `space-5` apart, and the content never gets wider than `content-max` on tablets. Anything tappable is at least `tap-min` (44px). The main action on a screen is a full-width `tap-comfort` (48px) button in a sticky bar at the bottom, where the thumb already is. Cards use a `line` border and a faint `shadow-card`; if a card needs a heavy shadow to stand out, there's too much on the screen.

Motion is limited to quick fades and colour changes, about 150ms. Nothing bounces. Respect the phone's reduced-motion setting.

## Accessibility

Text is 4.5:1 or better in both themes; borders, icons and focus rings are 3:1 or better. Nothing relies on colour alone. Every input has a visible label. Before shipping a screen, check it with Burmese text at 200% zoom and with TalkBack on.

## Components

All components are CSS classes with an `rv-` prefix in `components/bundle.css`, using only tokens. Each has a live preview and guidelines.

- **Orders and status:** OrderCard, StatusBadge, StockPill, ReceiptViewer, MorningSummary, UsageMeter
- **Conversation:** ChatBubble
- **Navigation:** AppHeader, BottomNav, QueueTabs, ListRow
- **Forms:** Button, TextField, Select, Checkbox, Toggle, Stepper, CodeInput
- **Overlays:** Dialog, BottomSheet
- **Feedback:** Alert, Toast, LoadingState, EmptyState

That covers the MVP screens: review queue, order and chat detail, stock list, morning summary, connect channel, settings, usage and login. Desktop tables and onboarding steps are left for later.

## Not decided yet

- **Logo.** Chosen ("revaro." with a terracotta full stop) but not trademark-checked yet, and not shown to any sellers.
- **Icons.** Twenty-five drawn so far, in slate, on a 24px grid with a 1.5px stroke. If we need more than about 30, switch to an existing outline set rather than draw them all.
- **Default digits.** Burmese or Latin by default for new shops? Ask in interviews.
- **Does anyone use dark mode?** Watch the December pilots.
- **Burmese labels** in the table above need Phyu Thwe's review.

## Changelog

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
