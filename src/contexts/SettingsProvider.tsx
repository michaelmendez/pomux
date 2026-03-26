import { DEFAULT_DURATIONS, STORAGE_KEYS } from "@/constants/consts";
import { SettingsContext } from "@/contexts/settingsContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useCallback, useEffect, useMemo } from "react";

export type Durations = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
};

export type Sessions = { pomodoro: number; shortBreak: number; longBreak: number };

export type SettingsContextProps = {
  durations: Durations;
  isNotificationEnabled: boolean;
  isSoundEnabled: boolean;
  isWaveEnabled: boolean;
};

export type SettingsContextValue = {
  settings: SettingsContextProps;
  handleSettings: (newSettings: Partial<SettingsContextProps>) => void;
};

type SettingsProviderProps = { children: React.ReactNode };

export function SettingsProvider({ children }: Readonly<SettingsProviderProps>) {
  const [settings, setSettings] = useLocalStorage<SettingsContextProps>(STORAGE_KEYS.SETTINGS, {
    durations: DEFAULT_DURATIONS,
    isNotificationEnabled: false,
    isSoundEnabled: true,
    isWaveEnabled: true,
  });

  useEffect(() => {
    if (settings.isSoundEnabled === undefined) {
      setSettings((prev) => ({ ...prev, isSoundEnabled: true }));
    }
  }, [setSettings, settings.isSoundEnabled]);

  useEffect(() => {
    if (settings.isWaveEnabled === undefined) {
      setSettings((prev) => ({ ...prev, isWaveEnabled: true }));
    }
  }, [setSettings, settings.isWaveEnabled]);

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
