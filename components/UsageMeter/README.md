# UsageMeter

How much of this month's orders and AI replies a shop has used, and what happens when it runs out.

Two meters, orders and AI replies. Sellers never see tokens. Under 80% the bar is slate, from 80% it turns amber (`rv-meter--warn`), and during the free 10% grace it goes red (`rv-meter--over`). The line under the bar always says what happens next in plain words: "Replies pause at 6,600 unless you top up."
