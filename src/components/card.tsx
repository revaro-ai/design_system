import type { ComponentProps } from "react";
import { cn } from "../cn";
export function Card({className, ...props}: ComponentProps<"div">) { return <div className={cn("grid min-w-0 gap-4 rounded-lg border border-line bg-surface p-5", className)} {...props} />; }
