import type { ComponentProps, ReactNode } from "react";
import { cn } from "../cn";

// Floats over a table while rows are ticked: "2 selected · 66,500 Ks", then the actions. Render it
// only while something is selected. It matches the theme it sits in (elevated + shadow-float).
export function SelectionBar({ summary, children, className, label = "Selected items", ...props }: ComponentProps<"div"> & { summary: ReactNode; label?: string }) {
  return (
    <div
      role="region"
      aria-label={label}
      aria-live="polite"
      className={cn(
        "fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-line bg-elevated py-2 pr-2 pl-4 text-body-sm text-ink shadow-float",
        "md:inset-x-auto md:bottom-7 md:left-[calc(50%+var(--rail)/2)] md:-translate-x-1/2 xl:left-[calc(50%+var(--sidebar)/2)]",
        className,
      )}
      {...props}
    >
      <span className="font-medium tabular-nums">{summary}</span>
      <span className="hidden h-5 w-px bg-line md:block" aria-hidden="true" />
      <div className="flex flex-1 flex-wrap items-center justify-end gap-2 md:flex-none">{children}</div>
    </div>
  );
}
