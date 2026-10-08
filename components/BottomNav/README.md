# BottomNav

The four main places in the app, in thumb reach at the bottom of the phone screen: Queue, Chats, Stock, Settings.

The current tab is marked in ink with a small terracotta dot under its label, the same full stop as the logo. That's one of the few places `brand-dot` appears in the app.

- Four tabs, never more. New sections go inside Settings or behind the header's "more" menu.
- The red count appears only on Queue, and only for things that need the seller now (Needs you, Paid but no stock).
- Use real links with `aria-current="page"` on the current one.
- It respects the phone's bottom safe area, so it isn't hidden behind the gesture bar.
