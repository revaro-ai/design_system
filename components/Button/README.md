# Button

Use a button when tapping it does something; name it with a verb.

`rv-btn--primary` is the main action. One per card, one per screen bar. Two slate buttons side by side means we haven't decided what matters.

`rv-btn` (plain) is for the alternative: Take over, Edit, View chat. `rv-btn--ghost` is for small things in lists, like "Mark sold elsewhere". `rv-btn--danger` is only for Reject payment and Cancel order, and it always opens a confirm step first.

On phones, the screen's main action goes in the bottom bar as `rv-btn--block` (48px, full width).

A few things we care about:

- Put the money on money buttons: "Confirm order · 25,000 MMK".
- While it's working, disable it and change the words ("Confirming…"). A double tap must never confirm twice.
- Check the Burmese label still fits on one line at 360px wide. Burmese runs longer than English.
