import type { ComponentProps, ReactNode } from "react";
import { cn } from "../cn";
import { burmeseLeading } from "./page-header";

export function StatCard({ label, value, note, tone = "default", className, ...props }: Omit<ComponentProps<"div">, "children"> & { label: ReactNode; value: ReactNode; note?: ReactNode; tone?: "default" | "warning" }) {
  return (
    <div className={cn("grid min-w-0 content-start gap-1 rounded-lg border border-line bg-surface px-4 py-3 md:px-5 md:py-4", className)} {...props}>
      <span className="text-body-sm text-ink-muted">{label}</span>
      <span className={cn("text-title-sm whitespace-nowrap tabular-nums md:text-display", burmeseLeading, tone === "warning" && "text-warning-fg")}>{value}</span>
      {note && <span className="text-caption text-ink-muted">{note}</span>}
    </div>
  );
}
