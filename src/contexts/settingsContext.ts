import type { SettingsContextValue } from "@/contexts/settingsTypes";
import { createContext } from "react";

export const SettingsContext = createContext<SettingsContextValue | null>(null);
