import type { ReactNode } from "react";
import { cn } from "../cn";
export function MoneyText({ amount, unit }: { amount: string; unit: string }) { return <span className="whitespace-nowrap font-semibold tabular-nums">{amount} <span className="text-xs font-normal text-ink-muted">{unit}</span></span>; }
const sizes = { sm: "size-10 text-base rounded-sm", md: "size-14 text-xl rounded-md", lg: "size-24 text-[32px] rounded-lg" };
const hues = ["bg-info-bg text-info-fg", "bg-success-bg text-success-fg", "bg-warning-bg text-warning-fg", "bg-danger-bg text-danger-fg", "bg-surface-sunken text-ink-muted", "bg-bubble-seller text-on-bubble-seller"];
export function Thumbnail({ src, alt, fallback, size = "md" }: { src?: string; alt: string; fallback: string; size?: keyof typeof sizes }) {
  const classes = cn("inline-grid shrink-0 place-items-center overflow-hidden object-cover font-semibold", sizes[size]);
  if (!src) return <span className={cn(classes, hues[(alt.codePointAt(0) ?? 0) % hues.length])} aria-hidden="true">{fallback}</span>;
  // Authenticated photo proxy URLs cannot be fetched by the image optimizer.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={{ sm: 40, md: 56, lg: 96 }[size]} height={{ sm: 40, md: 56, lg: 96 }[size]} className={classes} loading="lazy" decoding="async" />;
}
export function EmptyState({ icon, text, action }: { icon?: ReactNode; text: string; action?: ReactNode }) { return <div className="grid justify-items-center gap-3 px-4 py-10 text-center text-ink-muted">{icon && <span className="grid size-12 place-items-center rounded-pill bg-surface-sunken" aria-hidden="true">{icon}</span>}<p className="max-w-[36ch]">{text}</p>{action}</div>; }
