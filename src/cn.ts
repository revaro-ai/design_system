import { extendTailwindMerge } from "tailwind-merge";

// Tell tailwind-merge about the type scale in tokens.json, so a size like text-title-sm and a
// colour like text-warning-fg don't count as the same utility and cancel each other out.
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["display", "title", "title-sm", "heading", "body", "body-sm", "label", "caption", "numeral", "body-my", "heading-my"] } },
});

export function cn(...classes: (string | false | null | undefined)[]) {
  return twMerge(classes.filter(Boolean).join(" "));
}
