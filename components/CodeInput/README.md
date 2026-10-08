# CodeInput

The one-time code a seller types to log in.

Six boxes, number keyboard, and the cursor moves on by itself. Pasting a whole code fills every box, and the phone's SMS autofill should work (`autocomplete="one-time-code"` on the first box).

- Accept Burmese digits as well as Latin; convert before checking.
- On a wrong code, mark the boxes with `rv-code--error`, clear them, and say how many tries are left.
- Show a countdown before allowing a resend, so sellers don't trigger several codes at once.
