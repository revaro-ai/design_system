import type { ComponentProps } from "react";
import { cn } from "../cn";
import { tones } from "./badge";

// A state, always as a word: needs you (warning), ready to confirm (success), to pack (info),
// dispatched or Revaro answering (neutral), cancelled (danger). Never terracotta.
export function StatusPill({ tone = "neutral", dot = false, className, children, ...props }: ComponentProps<"span"> & { tone?: keyof typeof tones; dot?: boolean }) {
  return (
    <span className={cn("inline-flex h-6 shrink-0 items-center gap-1.5 rounded-pill px-2.5 text-xs font-medium whitespace-nowrap", tones[tone], className)} {...props}>
      {dot && <span className="size-1.5 rounded-pill bg-current opacity-80" aria-hidden="true" />}
      {children}
    </span>
  );
}
