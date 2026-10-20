import type { ReactNode } from "react";
import { cn } from "../cn";

// A choice of two to four options as cards, in place of a list of radio buttons. Native radios,
// so they submit with the form and work without JavaScript.
export type Option = { value: string; label: ReactNode; description?: ReactNode; lang?: string };

export function OptionCards({ name, legend, options, defaultValue, value, onChange, columns = 2, className }: {
  name: string;
  legend: ReactNode;
  options: Option[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const cols = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 xl:grid-cols-4" }[columns];
  return (
    <fieldset className={cn("grid gap-2", className)}>
      <legend className="mb-2 text-label">{legend}</legend>
      <div className={cn("grid gap-2", cols)}>
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border border-line-medium bg-surface px-4 py-3 transition-colors hover:border-line-strong",
              "has-checked:border-primary has-checked:ring-3 has-checked:ring-primary-tint has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              defaultChecked={value === undefined ? defaultValue === o.value : undefined}
              checked={value === undefined ? undefined : value === o.value}
              onChange={onChange ? () => onChange(o.value) : undefined}
              className="mt-1 size-4 shrink-0 accent-primary focus-visible:outline-none"
            />
            <span className="grid gap-0.5">
              <span className="font-medium" lang={o.lang}>{o.label}</span>
              {o.description && <span className="text-caption text-ink-muted">{o.description}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
