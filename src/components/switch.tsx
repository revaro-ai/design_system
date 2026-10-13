"use client";
import { Switch as Primitive } from "@base-ui/react/switch";
import type { ComponentProps } from "react";
import { cn } from "../cn";
export function Switch({ className, ...props }: ComponentProps<typeof Primitive.Root>) {
  return <Primitive.Root className={(state) => cn("inline-flex h-7 w-12 shrink-0 items-center rounded-pill border border-line-strong bg-surface-sunken p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus data-[checked]:border-primary data-[checked]:bg-primary data-[disabled]:opacity-50", typeof className === "function" ? className(state) : className)} {...props}><Primitive.Thumb className="size-5 rounded-pill bg-ink-muted transition-transform data-[checked]:translate-x-5 data-[checked]:bg-on-primary" /></Primitive.Root>;
}
