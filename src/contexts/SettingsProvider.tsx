import { STORAGE_KEYS } from "@/constants/consts";
import { SettingsContext } from "@/contexts/settingsContext";
import type { SettingsContextProps, SettingsContextValue } from "@/contexts/settingsTypes";
import { DEFAULT_SETTINGS } from "@/contexts/settingsTypes";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useCallback, useEffect, useMemo } from "react";

type SettingsProviderProps = { children: React.ReactNode };

export function SettingsProvider({ children }: Readonly<SettingsProviderProps>) {
  const [settings, setSettings] = useLocalStorage<SettingsContextProps>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

  useEffect(() => {
    if (settings.isSoundEnabled === undefined) {
      setSettings((prev) => ({ ...prev, isSoundEnabled: true }));
    }
  }, [setSettings, settings.isSoundEnabled]);

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
