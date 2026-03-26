import { DEFAULT_DURATIONS, STORAGE_KEYS } from "@/constants/consts";
import { SettingsContext } from "@/contexts/settingsContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useCallback, useMemo } from "react";

export type Durations = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
};

export type Sessions = { pomodoro: number; shortBreak: number; longBreak: number };

export type SettingsContextProps = {
  durations: Durations;
};

export type SettingsContextValue = {
  settings: SettingsContextProps;
  handleSettings: (newSettings: Partial<SettingsContextProps>) => void;
};

type SettingsProviderProps = { children: React.ReactNode };

export function SettingsProvider({ children }: Readonly<SettingsProviderProps>) {
  const [settings, setSettings] = useLocalStorage<SettingsContextProps>(STORAGE_KEYS.SETTINGS, {
    durations: DEFAULT_DURATIONS,
  });

  const handleSettings = useCallback(
    (newSettings: Partial<SettingsContextProps>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    [setSettings],
  );

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, handleSettings }),
    [settings, handleSettings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
