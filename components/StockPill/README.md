# StockPill

Shows how many of a variant Revaro thinks are left, and how fresh that number is.

The number is recorded stock minus anything held in other chats. It is not a promise about the shelf, so the copy says "3 left", never "in stock".

- Plain: fine.
- `rv-stock--low`: two or fewer.
- `rv-stock--out`: none. Revaro offers other sizes or colours instead.
- `rv-stock--stale`: not counted in 7 days, or a mismatch was logged. Revaro stops promising this variant and asks the seller first.

Tapping a pill opens +/−, "sold elsewhere" and "recount". When it's tappable, keep it 44px tall.
