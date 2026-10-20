"use client";
import { Toast as Primitive } from "@base-ui/react/toast";
import type { ReactNode } from "react";
import { cn } from "../cn";
import { useTheme } from "./theme";

// Confirmation messages: "Order #0142 confirmed · Ma Hnin was told". Put ToastProvider once
// around the signed-in workspace (inside ThemeScope) and call useToast().add(...).
// tone "success" closes after 5 seconds; "warning" stays until dismissed.
export type ToastData = { tone?: "success" | "warning" };

export function ToastProvider({ children, closeLabel = "Dismiss" }: { children: ReactNode; closeLabel?: string }) {
  return (
    <Primitive.Provider timeout={5000} limit={3}>
      {children}
      <Viewport closeLabel={closeLabel} />
    </Primitive.Provider>
  );
}

export function useToast() {
  const manager = Primitive.useToastManager<ToastData>();
  return {
    add: ({ title, description, tone = "success" }: { title: ReactNode; description?: ReactNode; tone?: "success" | "warning" }) =>
      manager.add({ title, description, data: { tone }, timeout: tone === "warning" ? 0 : 5000, priority: tone === "warning" ? "high" : "low" }),
    close: manager.close,
  };
}

const icons = {
  success: <path d="M5 12l5 5 9-10" />,
  warning: <path d="M12 8v5M12 16.5v.5M10.3 3.9L2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />,
};

function Viewport({ closeLabel }: { closeLabel: string }) {
  const { toasts } = Primitive.useToastManager<ToastData>();
  const theme = useTheme();
  return (
    <Primitive.Portal>
      <Primitive.Viewport data-theme={theme} className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 flex flex-col items-center gap-2 md:inset-x-auto md:right-6 md:bottom-6 md:items-end">
        {toasts.map((toast) => {
          const tone = toast.data?.tone ?? "success";
          return (
            <Primitive.Root
              key={toast.id}
              toast={toast}
              className={cn(
                "flex w-full max-w-md items-start gap-3 rounded-lg border border-line bg-elevated py-3 pr-2 pl-4 text-body-sm text-ink shadow-float",
                "transition-[opacity,translate] duration-150 data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0 motion-reduce:transition-none",
              )}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cn("mt-0.5 size-4 shrink-0", tone === "success" ? "text-success-fg" : "text-warning-fg")}>{icons[tone]}</svg>
              <div className="grid min-w-0 flex-1 gap-0.5">
                <Primitive.Title className="font-medium" />
                <Primitive.Description className="text-caption text-ink-muted empty:hidden" />
              </div>
              <Primitive.Close aria-label={closeLabel} className="grid size-8 shrink-0 place-items-center rounded-md text-ink-muted hover:bg-surface-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-focus">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-3.5"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </Primitive.Close>
            </Primitive.Root>
          );
        })}
      </Primitive.Viewport>
    </Primitive.Portal>
  );
}
