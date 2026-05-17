import { type SettingsContextValue } from "@/contexts/SettingsProvider";
import { SettingsContext } from "@/contexts/settingsContext";
import { use } from "react";

export function useSettings(): SettingsContextValue {
  const ctx = use(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
