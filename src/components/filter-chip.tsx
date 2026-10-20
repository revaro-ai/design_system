import type { ComponentProps } from "react";
import { cn } from "../cn";

// An unset filter is a dashed "+ Township"; a set one is solid, "Township: Hlaing". Use the
// classes on a link when filters live in the URL.
export function filterChipClasses(active = false, className?: string) {
  return cn(
    "inline-flex min-h-9 items-center gap-1.5 rounded-pill border px-3 text-body-sm whitespace-nowrap transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
    active ? "border-line-medium bg-surface-sunken text-ink hover:border-line-strong" : "border-dashed border-line-strong text-ink-soft hover:bg-surface-sunken hover:text-ink",
    className,
  );
}

export function FilterChip({ active = false, className, type = "button", ...props }: ComponentProps<"button"> & { active?: boolean }) {
  return <button type={type} aria-pressed={active} className={filterChipClasses(active, className)} {...props} />;
}
