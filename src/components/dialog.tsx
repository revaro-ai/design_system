"use client";
import { Dialog as Primitive } from "@base-ui/react/dialog";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { useTheme } from "./theme";
export function Dialog({ trigger, title, description, children, ...props }: Omit<ComponentProps<typeof Primitive.Root>, "children"> & { trigger: ReactElement; title: ReactNode; children: ReactNode; description?: ReactNode }) {
  const theme = useTheme();
  return <Primitive.Root {...props}><Primitive.Trigger render={trigger} /><Primitive.Portal><div data-theme={theme}><Primitive.Backdrop className="fixed inset-0 z-50 bg-scrim" /><Primitive.Popup className="fixed top-1/2 left-1/2 z-50 grid max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-lg border border-line bg-surface p-6 text-ink shadow-sheet outline-none"><Primitive.Title className="text-xl font-semibold">{title}</Primitive.Title>{description && <Primitive.Description className="text-sm text-ink-muted">{description}</Primitive.Description>}{children}</Primitive.Popup></div></Primitive.Portal></Primitive.Root>;
}
export const DialogClose = Primitive.Close;
