# Toggle

An on/off setting that takes effect straight away, such as away mode or pausing Revaro in one chat.

The label says what's on when the switch is on ("Away mode", "Revaro replies in this chat"), and the small line underneath says what that means in practice. The whole row is tappable, not just the switch.

- Use a toggle only when the change is immediate. If something needs saving, use a Checkbox with a Save button.
- Use a native checkbox with `role="switch"` so screen readers announce it as on or off.
- Never make a toggle that changes money or stock silently. Those need a Dialog.
