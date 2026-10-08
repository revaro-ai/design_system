# ReceiptViewer

Shows the customer's payment screenshot next to what the order says, so the seller can check it against her wallet app before confirming.

A small thumbnail sits beside "Payment to check" on the order card; tapping it opens the viewer. The viewer shows the screenshot as large as the screen allows, the order total Revaro calculated, when it was sent and by whom, and a reminder to check the wallet.

- Revaro never claims the screenshot is genuine. The facts shown come from the order, not from reading the image.
- "Payment received" is the seller's confirmation, so it's the primary button. "Reject…" opens a Dialog.
- Screenshots are private files with short-lived links; never cache them on shared devices.
