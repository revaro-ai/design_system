import type { ElementType, ReactNode } from "react";
import { cn } from "../cn";

export type NavItem = {
  href: string;
  label: ReactNode;
  icon: ReactNode;
  current?: boolean;
  /** A small count next to the item, like chats that need the seller. */
  count?: ReactNode;
  countTone?: "warning" | "neutral";
};

const countTones = { warning: "bg-warning-bg text-warning-fg", neutral: "bg-neutral-bg text-neutral-fg" };

// One navigation that changes shape with the width: bottom tabs under 768px, an icon rail with
// labels from 768px, the full sidebar from 1280px. CSS only, so it renders on the server.
export function AppShell({
  items,
  brand,
  compactBrand,
  account,
  children,
  label = "Main",
  hideNavOnPhone = false,
  link: Link = "a",
}: {
  items: NavItem[];
  /** The wordmark, shown in the sidebar. */
  brand: ReactNode;
  /** A short mark for the rail, like "r.". */
  compactBrand?: ReactNode;
  /** Shop and account, at the foot of the sidebar. Phones and the rail reach it from Settings. */
  account?: ReactNode;
  children: ReactNode;
  label?: string;
  /** Hide the bottom tabs, as inside a conversation where the order bar takes the space. */
  hideNavOnPhone?: boolean;
  /** The app's link component, such as Next.js Link. */
  link?: ElementType;
}) {
  return (
    <div className="min-h-dvh bg-ground text-ink md:grid md:grid-cols-[var(--rail)_minmax(0,1fr)] xl:grid-cols-[var(--sidebar)_minmax(0,1fr)]">
      <nav
        aria-label={label}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]",
          "md:sticky md:inset-auto md:top-0 md:h-dvh md:flex-col md:items-center md:gap-1 md:border-t-0 md:border-r md:py-4 md:pb-4",
          "xl:items-stretch xl:px-3 xl:py-5",
          hideNavOnPhone && "max-md:hidden",
        )}
      >
        <div className="mb-4 hidden px-3 xl:block">{brand}</div>
        {compactBrand && <div className="mb-3 hidden md:block xl:hidden">{compactBrand}</div>}
        <ul className="flex flex-1 md:flex-none md:flex-col md:gap-1">
          {items.map((item) => (
            <li key={item.href} className="flex-1 md:flex-none">
              <Link
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={cn(
                  "relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[11px] text-ink-muted transition-colors",
                  "md:w-14 md:rounded-md md:py-2",
                  "xl:min-h-9 xl:w-auto xl:flex-row xl:justify-start xl:gap-3 xl:px-3 xl:text-label xl:font-normal",
                  "hover:text-ink md:hover:bg-surface-sunken focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus",
                  item.current && "font-medium text-primary-ink hover:text-primary-ink md:bg-primary-tint md:hover:bg-primary-tint xl:font-medium",
                )}
              >
                <span className="grid size-6 place-items-center [&_svg]:size-5" aria-hidden="true">{item.icon}</span>
                <span className="max-w-full truncate">{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={cn(
                      "absolute top-1 left-[calc(50%+6px)] grid h-4 min-w-4 place-items-center rounded-pill px-1 text-[10px] font-semibold tabular-nums",
                      "xl:static xl:ml-auto xl:h-5 xl:min-w-5 xl:px-1.5 xl:text-xs",
                      countTones[item.countTone ?? "neutral"],
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        {account && <div className="mt-auto hidden border-t border-line px-2 pt-4 xl:block">{account}</div>}
      </nav>
      <main className={cn("min-w-0", !hideNavOnPhone && "pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0")}>{children}</main>
    </div>
  );
}
