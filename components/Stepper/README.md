# Stepper

A quick way to change a count by one: stock levels and order quantities.

Each tap changes the number immediately and logs a stock movement, so a seller fixing counts after a busy day can tap through a list fast. For big changes ("40 arrived today") tapping the number opens a field to type it.

- The minus button disables at zero; stock never goes negative.
- Buttons are 44px and labelled for screen readers ("One fewer", "One more"); the number announces itself when it changes.
- Stock changes from a stepper show a Toast with Undo for a few seconds.
