# QueueTabs

The home screen's piles of work, each with a count: To confirm, Payments, Needs you, All chats.

Open on the first pile that isn't empty. Red counts (`rv-count--alert`) are only for Needs you and Paid, no stock; everything else stays dark so red still means something. On narrow phones the tabs scroll sideways rather than wrapping. Use real tab roles (`tablist`, `aria-selected`) so TalkBack reads them properly.
