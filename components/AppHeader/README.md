# AppHeader

The bar at the top of every screen: where you are, a way back, and at most two actions.

Top-level screens (Queue, Chats, Stock, Settings) show just the title, no back button. Detail screens show a back button, the title, and an optional second line for context such as the channel and time.

- Two icon actions at most; anything else goes in the "more" menu.
- Every icon button gets an `aria-label`, because there's no visible text.
- Titles truncate with an ellipsis rather than wrapping. Long Burmese names still fit on 360px screens.
- It sticks to the top while the content scrolls.
