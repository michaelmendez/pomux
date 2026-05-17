import { SettingsContext } from "@/contexts/settingsContext";
import type { SettingsContextValue } from "@/contexts/settingsTypes";
import { DEFAULT_SETTINGS } from "@/contexts/settingsTypes";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";

type RenderWithSettingsOptions = Partial<SettingsContextValue>;

export function renderWithSettings(ui: ReactElement, options: RenderWithSettingsOptions = {}) {
  const defaultValue: SettingsContextValue = {
    settings: DEFAULT_SETTINGS,
    handleSettings: () => undefined,
  };

  const value: SettingsContextValue = {
    ...defaultValue,
    ...options,
    settings: {
      ...defaultValue.settings,
      ...(options.settings ?? {}),
    },
  };

  return render(<SettingsContext.Provider value={value}>{ui}</SettingsContext.Provider>);
}
