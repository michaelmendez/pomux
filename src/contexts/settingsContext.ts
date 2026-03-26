import type { SettingsContextValue } from "@/contexts/SettingsProvider";
import { createContext } from "react";

export const SettingsContext = createContext<SettingsContextValue | null>(null);
