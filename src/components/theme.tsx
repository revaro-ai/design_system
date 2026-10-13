"use client";
import { createContext, useContext, type ReactNode } from "react";
const Theme = createContext<"light" | "dark">("light");
export function ThemeScope({ theme, children }: { theme: "light" | "dark"; children: ReactNode }) {
  return <Theme.Provider value={theme}>{children}</Theme.Provider>;
}
export const useTheme = () => useContext(Theme);
