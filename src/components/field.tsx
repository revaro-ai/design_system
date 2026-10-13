import { cloneElement, type ComponentProps, type ReactElement, type ReactNode } from "react";
import { cn } from "../cn";

export const inputClasses = "min-h-11 w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-base text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger-solid";
export function Input({ className, ...props }: ComponentProps<"input">) { return <input className={cn(inputClasses, className)} {...props} />; }
export function Textarea({ className, ...props }: ComponentProps<"textarea">) { return <textarea className={cn(inputClasses, "min-h-24", className)} {...props} />; }
export function NativeSelect({ className, multiple, size, ...props }: ComponentProps<"select">) {
  const dropdown = !multiple && (!size || size === 1);
  return <select className={cn(inputClasses, dropdown && "revaro-native-select pr-10", className)} multiple={multiple} size={size} {...props} />;
}
export function Field({ label, description, error, id, children, className }: {label: ReactNode; description?: ReactNode; error?: ReactNode; id: string; children: ReactElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean }>; className?: string}) {
  const fieldId = id;
  return <div className={cn("grid gap-1.5", className)}><label htmlFor={fieldId} className="text-sm font-medium">{label}</label>{cloneElement(children, { id: fieldId, "aria-describedby": [children.props["aria-describedby"], description && `${fieldId}-description`, error && `${fieldId}-error`].filter(Boolean).join(" ") || undefined, "aria-invalid": error ? true : children.props["aria-invalid"] })}{description && <p id={`${fieldId}-description`} className="text-sm text-ink-muted">{description}</p>}{error && <p id={`${fieldId}-error`} role="alert" className="text-sm text-danger-fg">{error}</p>}</div>;
}
