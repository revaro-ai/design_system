"use client";
import { Popover } from "@base-ui/react/popover";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "../cn";
import { useTheme } from "./theme";

// Days are "YYYY-MM-DD" strings in the shop's time zone. The app works out `today` in that zone;
// everything here is calendar arithmetic on plain dates, so no time zone can shift a day.
export type DayRange = { from: string; to: string };
export type QuickPick = "today" | "yesterday" | "week";
/** 0 Sunday, 1 Monday, 6 Saturday, as Date.getDay(). */
export type WeekStart = 0 | 1 | 6;

const toDate = (day: string) => new Date(`${day}T00:00:00Z`);
const toDay = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (day: string, n: number) => toDay(new Date(toDate(day).getTime() + n * 864e5));

/** The range a quick pick stands for. "week" runs from the start of the week to today. */
export function quickRange(pick: QuickPick, today: string, weekStart: WeekStart = 1): DayRange {
  if (pick === "today") return { from: today, to: today };
  if (pick === "yesterday") { const y = addDays(today, -1); return { from: y, to: y }; }
  const back = (toDate(today).getUTCDay() - weekStart + 7) % 7;
  return { from: addDays(today, -back), to: today };
}

const same = (a: DayRange | null | undefined, b: DayRange) => !!a && a.from === b.from && a.to === b.to;

export type DateLabels = { today: string; yesterday: string; thisWeek: string; pickDay: string; previousMonth: string; nextMonth: string };
type Display = {
  /** Month names, January first. */
  monthNames: string[];
  /** Short weekday names, Sunday first. */
  weekdayNames: string[];
  /** Digits for the reader's language, e.g. Burmese ၀–၉. */
  formatNumber?: (n: number) => string;
  /** A full, readable date for labels: "Tuesday, 20 October". */
  formatDay: (day: string) => string;
};

const chip = (active: boolean) => cn(
  "inline-flex min-h-9 items-center rounded-pill border px-3.5 text-body-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
  active ? "border-primary bg-primary-tint font-medium text-primary-ink" : "border-line-medium bg-surface text-ink-soft hover:bg-surface-sunken hover:text-ink",
);

export function DateQuickPick({ value, today, weekStart = 1, onChange, labels, label, ...display }: Display & {
  value: DayRange | null;
  today: string;
  weekStart?: WeekStart;
  onChange: (range: DayRange) => void;
  labels: DateLabels;
  /** Names the group for screen readers, e.g. "Day confirmed". */
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const picks: [QuickPick, string][] = [["today", labels.today], ["yesterday", labels.yesterday], ["week", labels.thisWeek]];
  const quick = picks.some(([p]) => same(value, quickRange(p, today, weekStart)));
  const pickedDay = value && !quick && value.from === value.to ? value.from : null;
  const picked = pickedDay !== null;
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {picks.map(([p, text]) => {
        const range = quickRange(p, today, weekStart);
        return <button key={p} type="button" aria-pressed={same(value, range)} className={chip(same(value, range))} onClick={() => onChange(range)}>{text}</button>;
      })}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger render={<button type="button" aria-pressed={picked} className={chip(picked)} />}>
          {pickedDay ? display.formatDay(pickedDay) : labels.pickDay}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner side="bottom" align="start" sideOffset={8} className="z-50" data-theme={theme}>
            <Popover.Popup className="rounded-lg border border-line bg-elevated p-3 text-ink shadow-float outline-none">
              <Calendar {...display} selected={pickedDay} today={today} max={today} weekStart={weekStart} labels={labels} onSelect={(day) => { onChange({ from: day, to: day }); setOpen(false); }} />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

export function Calendar({ selected, today, max, weekStart = 1, onSelect, labels, monthNames, weekdayNames, formatNumber = String, formatDay }: Display & {
  selected: string | null;
  today: string;
  /** The last day that can be picked, e.g. today for past orders. */
  max?: string;
  weekStart?: WeekStart;
  onSelect: (day: string) => void;
  labels: Pick<DateLabels, "previousMonth" | "nextMonth">;
}) {
  const [focus, setFocus] = useState(selected ?? today);
  const month = focus.slice(0, 7);
  const grid = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (moved.current) grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focus}"]`)?.focus();
  }, [focus]);
  const first = `${month}-01`;
  const lead = (toDate(first).getUTCDay() - weekStart + 7) % 7;
  const nextMonthFirst = toDay(new Date(Date.UTC(+month.slice(0, 4), +month.slice(5, 7), 1)));
  const length = Math.round((toDate(nextMonthFirst).getTime() - toDate(first).getTime()) / 864e5);
  const days = Array.from({ length }, (_, i) => addDays(first, i));
  const heads = Array.from({ length: 7 }, (_, i) => weekdayNames[(weekStart + i) % 7]);
  const shift = (months: number) => {
    const d = toDate(first);
    const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1));
    setFocus(toDay(target));
  };
  const allowed = (day: string) => !max || day <= max;
  const onKey = (e: KeyboardEvent) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = addDays(focus, step);
    if (allowed(next)) { moved.current = true; setFocus(next); }
  };
  const [y, m] = [+month.slice(0, 4), +month.slice(5, 7) - 1];
  return (
    <div className="grid w-[17.5rem] gap-2">
      <div className="flex items-center justify-between">
        <button type="button" aria-label={labels.previousMonth} onClick={() => shift(-1)} className="grid size-9 place-items-center rounded-md text-ink-soft hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-focus">‹</button>
        <span className="font-medium" aria-live="polite">{monthNames[m]} {formatNumber(y)}</span>
        <button type="button" aria-label={labels.nextMonth} onClick={() => shift(1)} disabled={!!max && nextMonthFirst > max} className="grid size-9 place-items-center rounded-md text-ink-soft hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-40">›</button>
      </div>
      <div ref={grid} onKeyDown={onKey} className="grid grid-cols-7 gap-0.5 text-center">
        {heads.map((h, i) => <span key={i} className="pb-1 text-caption text-ink-muted" aria-hidden="true">{h}</span>)}
        {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} />)}
        {days.map((day) => {
          const on = day === selected;
          return (
            <button
              key={day}
              type="button"
              data-day={day}
              tabIndex={day === focus ? 0 : -1}
              disabled={!allowed(day)}
              aria-pressed={on}
              aria-current={day === today ? "date" : undefined}
              aria-label={formatDay(day)}
              onFocus={() => setFocus(day)}
              onClick={() => onSelect(day)}
              className={cn(
                "grid h-9 place-items-center rounded-md text-body-sm tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-focus disabled:text-ink-muted/50",
                on ? "bg-primary font-medium text-on-primary" : "hover:bg-surface-sunken enabled:text-ink",
                day === today && !on && "font-semibold text-primary-ink",
              )}
            >
              {formatNumber(+day.slice(8))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
