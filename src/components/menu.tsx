"use client";
import { Menu as Primitive } from "@base-ui/react/menu";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "../cn";
import { useTheme } from "./theme";
export function Menu({ trigger, children, side = "bottom", align = "end" }: { trigger: ReactElement; children: ReactNode; side?: "top" | "bottom"; align?: "start" | "end" }) {
  const theme = useTheme();
  return <Primitive.Root><Primitive.Trigger render={trigger} /><Primitive.Portal><Primitive.Positioner side={side} align={align} sideOffset={6} className="z-50" data-theme={theme}><Primitive.Popup className="grid max-h-[min(24rem,var(--available-height))] min-w-48 overflow-y-auto overscroll-contain rounded-md border border-line bg-surface p-1 text-ink shadow-sheet outline-none">{children}</Primitive.Popup></Primitive.Positioner></Primitive.Portal></Primitive.Root>;
}
export function MenuItem({ className, ...props }: ComponentProps<typeof Primitive.Item>) {
  return <Primitive.Item className={(state) => cn("flex min-h-11 cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none data-[highlighted]:bg-surface-sunken data-[disabled]:opacity-50", typeof className === "function" ? className(state) : className)} {...props} />;
}
