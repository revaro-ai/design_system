import type { ReactNode } from "react";
import { cn } from "../cn";

// Burmese headings need a taller line so stacked marks don't clip.
export const burmeseLeading = "[&:lang(my)]:leading-[1.6] [&:lang(my)]:tracking-normal";

export function PageHeader({ title, description, eyebrow, actions, className }: { title: ReactNode; description?: ReactNode; eyebrow?: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <header className={cn("flex flex-wrap items-end gap-x-4 gap-y-3", className)}>
      <div className="grid min-w-0 flex-[1_1_18rem] gap-1">
        {eyebrow && <p className="text-caption text-ink-muted">{eyebrow}</p>}
        <h1 className={cn("text-title-sm md:text-title", burmeseLeading)}>{title}</h1>
        {description && <p className="text-body-sm text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
