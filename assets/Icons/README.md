# Icons

Twenty-five icons for the seller app, on a 24px grid with a 1.5px round stroke in slate (#2a2d33). All of them are one colour, including the dot on "needs you": terracotta is the brand mark, never a status, so the meaning comes from the badge or label next to the icon, not from the icon's colour.

Product icons: chat, confirm, held (clock, for "held for 2 hours"), morning (the morning summary), needs-you, pause (Revaro paused), receipt (payment to check), sold-elsewhere, stock, top-up.

Interface icons: back, close, menu, more, search, settings (sliders, so it can't be confused with the morning sun), edit, plus, minus, export, filter, inbox (the Queue tab), image, check, alert.

In components, icons are inlined as `<svg class="rv-icon">` so they take the text colour and work in dark mode.

They're shown as images, so the slate is baked in. For dark mode, inline the SVG and set the stroke from `ink`, or export a copy with #ece9e2. Always put a word next to an icon that carries a money or stock state. Add new icons on the same grid and stroke; past about 30, switch to an existing outline set instead of drawing them all.
