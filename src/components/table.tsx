import type { ComponentProps } from "react";
import { cn } from "../cn";
export function Table({className,...props}:ComponentProps<"table">){return <table className={cn("w-full border-collapse text-left text-sm [&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-normal [&_th]:text-ink-muted [&_td]:px-4 [&_td]:py-4 [&_td]:align-top [&_td]:tabular-nums [&_tr]:border-b [&_tr]:border-line [&_tbody_tr:last-child]:border-0",className)} {...props}/>;}
