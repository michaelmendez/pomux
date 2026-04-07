import { DEFAULT_DURATIONS, TIMER_DISPLAY_STYLES } from "@/constants/consts";
import { SettingsContext } from "@/contexts/settingsContext";
import type { SettingsContextValue } from "@/contexts/SettingsProvider";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";

type RenderWithSettingsOptions = Partial<SettingsContextValue>;

export function renderWithSettings(ui: ReactElement, options: RenderWithSettingsOptions = {}) {
  const defaultValue: SettingsContextValue = {
    settings: {
      durations: DEFAULT_DURATIONS,
      isNotificationEnabled: false,
      isSoundEnabled: true,
      timerDisplayStyle: TIMER_DISPLAY_STYLES.RING,
    },
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
