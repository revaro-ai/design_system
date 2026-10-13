import type { ComponentProps } from "react";
import { cn } from "../cn";
export const tones = {neutral:"bg-surface-sunken text-ink-muted",success:"bg-success-bg text-success-fg",warning:"bg-warning-bg text-warning-fg",danger:"bg-danger-bg text-danger-fg",info:"bg-info-bg text-info-fg"};
export function Badge({tone="neutral",className,...props}:ComponentProps<"span">&{tone?:keyof typeof tones}) {return <span className={cn("inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-xs font-medium",tones[tone],className)} {...props}/>;}
