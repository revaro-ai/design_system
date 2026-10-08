# Dialog

A confirm step before anything that's hard to undo or touches money: reject payment, cancel a confirmed order, disconnect a channel.

The title is the question ("Reject this payment?"). The body says exactly what will happen, including what Revaro will and won't do. The two buttons are named for their outcomes ("Keep order", "Reject payment"), never "Cancel" and "OK", because "Cancel" is ambiguous when the action itself is a cancellation.

- The safe choice sits on the left, the destructive one on the right in `rv-btn--danger`.
- Use `role="alertdialog"`, move focus into it when it opens, and return focus to where it came from when it closes.
- Don't use a dialog for information. If nothing needs confirming, use a Toast or an Alert.
