import type { ComponentProps } from "react";
import { cn } from "../cn";

const variants = {
  primary: "border-primary bg-primary text-on-primary hover:border-primary-hover hover:bg-primary-hover",
  secondary: "border-line-medium bg-surface text-ink hover:bg-surface-sunken",
  ghost: "border-transparent bg-transparent text-ink hover:bg-surface-sunken",
  danger: "border-danger-solid bg-danger-solid text-on-danger-solid hover:brightness-95",
};
export type ButtonVariant = keyof typeof variants;
export function buttonClasses(variant: ButtonVariant = "secondary", size: "sm" | "md" = "md", className?: string) {
  return cn("inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50", variants[variant], size === "sm" && "min-h-9 px-3", className);
}
export function Button({ variant = "secondary", size = "md", className, type = "button", ...props }: ComponentProps<"button"> & { variant?: ButtonVariant; size?: "sm" | "md" }) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}
export function IconButton({ className, ...props }: ComponentProps<typeof Button>) {
  return <Button variant="ghost" className={cn("size-11 shrink-0 p-0", className)} {...props} />;
}
