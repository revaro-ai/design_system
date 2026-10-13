import type { ComponentProps } from "react";
import { cn } from "../cn";
import { tones } from "./badge";
export function Alert({tone="info",className,...props}:ComponentProps<"div">&{tone?:keyof typeof tones}) {return <div role={tone==="danger"?"alert":"status"} className={cn("rounded-md p-3 text-sm leading-relaxed",tones[tone],className)} {...props}/>;}
