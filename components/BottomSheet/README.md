# BottomSheet

A short list of actions or a small form that slides up from the bottom, so the seller doesn't leave the screen she's on.

Used for stock actions on a variant (sold elsewhere, restocked, recount), the "more" menu on an order, and quick filters. The title says what the sheet is about. Each option is a ListRow with a one-line explanation underneath.

- Keep it short: up to five options, or one small form. Anything longer is its own screen.
- Tapping outside or swiping down closes it without doing anything.
- Use `role="dialog"` and move focus into it, as with Dialog.
