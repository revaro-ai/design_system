import type { ComponentProps } from "react";
import { cn } from "../cn";

// Table parts for orders, stock and admin lists. Selection state belongs to the app; rows only
// show it. Columns can drop out below a width with hideBelow, so tablets keep the essentials.
const hidden = { md: "max-md:hidden", xl: "max-xl:hidden" };
type Hide = { hideBelow?: keyof typeof hidden };

export function DataTable({ className, label, children, ...props }: ComponentProps<"table"> & { label: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-line bg-surface", className)}>
      <table aria-label={label} className="w-full border-collapse text-left text-body-sm" {...props}>{children}</table>
    </div>
  );
}

export function DataTableHead({ className, children, ...props }: ComponentProps<"tr">) {
  return <thead><tr className={cn("bg-surface-sunken", className)} {...props}>{children}</tr></thead>;
}

export function DataTableHeader({ className, numeric, hideBelow, ...props }: ComponentProps<"th"> & Hide & { numeric?: boolean }) {
  return <th scope="col" className={cn("h-10 px-4 text-caption font-medium whitespace-nowrap text-ink-muted first:pl-5 last:pr-5", numeric && "text-right", hideBelow && hidden[hideBelow], className)} {...props} />;
}

export function DataTableRow({ className, selected, ...props }: ComponentProps<"tr"> & { selected?: boolean }) {
  return <tr data-selected={selected || undefined} className={cn("border-t border-line transition-colors hover:bg-surface-sunken/60", selected && "bg-primary-tint hover:bg-primary-tint", className)} {...props} />;
}

export function DataTableCell({ className, numeric, hideBelow, ...props }: ComponentProps<"td"> & Hide & { numeric?: boolean }) {
  return <td className={cn("h-13 px-4 align-middle first:pl-5 last:pr-5", numeric && "text-right font-medium whitespace-nowrap tabular-nums", hideBelow && hidden[hideBelow], className)} {...props} />;
}

export function DataTableFooter({ className, children, ...props }: ComponentProps<"tr">) {
  return <tfoot><tr className={cn("border-t border-line bg-surface-sunken text-ink-muted", className)} {...props}>{children}</tr></tfoot>;
}

/** A native checkbox sized and coloured for table rows. Give it an aria-label. */
export function RowCheckbox({ className, ...props }: Omit<ComponentProps<"input">, "type">) {
  return <input type="checkbox" className={cn("size-4 cursor-pointer accent-primary align-middle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus", className)} {...props} />;
}
