# Toast

A short message at the bottom of the screen confirming that something just happened, sometimes with Undo.

Use it after the seller does something: order confirmed, stock changed, reply sent. It disappears after about 5 seconds, or 8 if it has an Undo. Errors use the danger version and stay until dismissed or fixed.

- One line, past tense, with the specific thing it's about ("Order confirmed · Black dress M").
- Don't use a toast for something the seller must act on later; that's an Alert or a queue item.
- `role="status"` for confirmations, `role="alert"` for errors.
