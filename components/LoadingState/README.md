# LoadingState

What the seller sees while data is on its way, which on Myanmar mobile data can be a few seconds.

Lists load with skeleton cards in the shape of what's coming (`rv-skeleton`), so the layout doesn't jump when real orders arrive. Small waits inside a button or a row use the spinner (`rv-spinner`) with a word next to it ("Loading orders…").

- Show cached data straight away where there is some, and refresh quietly behind it.
- After about 10 seconds, switch to the error state with a retry button rather than spinning forever.
- Animations stop when the phone asks for reduced motion.
