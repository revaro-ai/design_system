import type { ComponentProps, ReactNode } from "react";
import { cn } from "../cn";

// Three senders, three colours, never solid black or white. Put bubbles in a flex column on the
// canvas background (bg-canvas); each one aligns itself.
const senders = {
  customer: { side: "self-start items-start", bubble: "rounded-bl-md bg-bubble-customer text-ink ring-1 ring-bubble-customer-line ring-inset" },
  revaro: { side: "self-end items-end", bubble: "rounded-br-md bg-bubble-revaro text-on-bubble-revaro" },
  seller: { side: "self-end items-end", bubble: "rounded-br-md bg-bubble-seller text-on-bubble-seller" },
};

export function ChatBubble({ from, meta, className, children, ...props }: ComponentProps<"div"> & { from: keyof typeof senders; meta?: ReactNode }) {
  const s = senders[from];
  return (
    <div className={cn("flex max-w-[min(80%,36rem)] flex-col gap-1", s.side, className)} {...props}>
      <div className={cn("rounded-xl px-3.5 py-2 text-[15px] leading-[1.6] break-words whitespace-pre-wrap [&:lang(my)]:leading-[1.8]", s.bubble)}>{children}</div>
      {meta && <span className="px-1.5 text-caption text-ink-muted tabular-nums">{meta}</span>}
    </div>
  );
}

/** A centred note between bubbles: "Held until 10:13 PM", "Today". */
export function ChatEvent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-center gap-2 self-center py-1 text-caption text-ink-soft before:h-px before:w-8 before:bg-line after:h-px after:w-8 after:bg-line", className)} {...props} />;
}
