# StatusBadge

A badge shows one state of an order, payment or chat, always as a word with a colour behind it.

Pick the tone by what the seller has to do:

| Tone | Means | Examples |
| --- | --- | --- |
| `info` | Nothing yet, Revaro is on it | Held, Drafting, Waiting for details |
| `warning` | Look at this | Payment to check, COD due, Needs you |
| `success` | Done | Confirmed, Paid, Sold |
| `danger` | Something's wrong | Paid, no stock; Sold out; Failed to send |
| `neutral` | Inactive | Draft, Cancelled |

Payment and stock get separate badges, payment first. "Receipt received" is never green; only the seller's confirmation is. Use the exact words from the status table in the README. If more than three badges apply, show the most urgent three.
