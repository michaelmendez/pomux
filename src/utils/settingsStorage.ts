import { DEFAULT_DURATIONS, STORAGE_KEYS } from "@/constants/consts";

type PersistedSettingsShape = {
  durations?: {
    pomodoro?: number;
  };
};

export const getStoredPomodoroSeconds = (): number => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_DURATIONS.pomodoro;

    const parsed = JSON.parse(raw) as PersistedSettingsShape;
    const persistedPomodoro = parsed?.durations?.pomodoro;

    return typeof persistedPomodoro === "number" && Number.isFinite(persistedPomodoro)
      ? persistedPomodoro
      : DEFAULT_DURATIONS.pomodoro;
  } catch {
    return DEFAULT_DURATIONS.pomodoro;
  }
};
