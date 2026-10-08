# OrderCard

One order, ready for the seller to confirm: what, who, how much, and what's still unclear.

Top: item × quantity, then the customer's name, channel and time, with the total on the right in tabular figures. Under that, the payment badge and the stock badge. Then phone, address and delivery fee. If something's missing, write "Missing" in `danger-fg`; don't leave a blank the seller might not notice.

Two buttons: Take over (or Edit) and Confirm order. Rejecting a payment lives in the card's menu behind a confirm step, not next to Confirm where a thumb can slip.

The total comes from our code, never from the model. If the seller overrode the price, show the catalogue price struck through next to hers. If there's a receipt, show a small thumbnail beside "Payment to check".
