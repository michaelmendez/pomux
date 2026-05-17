import { toMinutes, toSeconds } from "@/utils/timeConversion";
import { SETTINGS_LIMITS } from "@/constants/consts";
import type { SettingsContextProps, TimerDisplayStyle } from "@/contexts/settingsTypes";

export type SettingsDraft = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  isNotificationEnabled: boolean;
  isSoundEnabled: boolean;
  timerDisplayStyle: TimerDisplayStyle;
  pomodorosBeforeLongBreak: number;
  dailyGoal: number;
};

export type SettingsDraftAction =
  | { type: "reset"; value: SettingsDraft }
  | { type: "setPomodoro"; value: number }
  | { type: "setShortBreak"; value: number }
  | { type: "setLongBreak"; value: number }
  | { type: "setNotificationEnabled"; value: boolean }
  | { type: "toggleSoundEnabled" }
  | { type: "setTimerDisplayStyle"; value: TimerDisplayStyle }
  | { type: "setPomodorosBeforeLongBreak"; value: number }
  | { type: "setDailyGoal"; value: number };

export function settingsDraftReducer(draft: SettingsDraft, action: SettingsDraftAction): SettingsDraft {
  switch (action.type) {
    case "reset":
      return action.value;
    case "setPomodoro":
      return { ...draft, pomodoro: action.value };
    case "setShortBreak":
      return { ...draft, shortBreak: action.value };
    case "setLongBreak":
      return { ...draft, longBreak: action.value };
    case "setNotificationEnabled":
      return { ...draft, isNotificationEnabled: action.value };
    case "toggleSoundEnabled":
      return { ...draft, isSoundEnabled: !draft.isSoundEnabled };
    case "setTimerDisplayStyle":
      return { ...draft, timerDisplayStyle: action.value };
    case "setPomodorosBeforeLongBreak":
      return { ...draft, pomodorosBeforeLongBreak: action.value };
    case "setDailyGoal":
      return { ...draft, dailyGoal: action.value };
  }
}

export function createSettingsDraft(settings: SettingsContextProps): SettingsDraft {
  return {
    pomodoro: toMinutes(settings.durations.pomodoro),
    shortBreak: toMinutes(settings.durations.shortBreak),
    longBreak: toMinutes(settings.durations.longBreak),
    isNotificationEnabled: settings.isNotificationEnabled,
    isSoundEnabled: settings.isSoundEnabled ?? true,
    timerDisplayStyle: settings.timerDisplayStyle,
    pomodorosBeforeLongBreak: settings.pomodorosBeforeLongBreak,
    dailyGoal: settings.dailyGoal,
  };
}

export function createSettingsPayload(draft: SettingsDraft): SettingsContextProps {
  return {
    durations: {
      pomodoro: toSeconds(
        Math.max(
          SETTINGS_LIMITS.MIN_MINUTES,
          Math.min(SETTINGS_LIMITS.MAX_MINUTES, draft.pomodoro),
        ),
      ),
      shortBreak: toSeconds(
        Math.max(
          SETTINGS_LIMITS.MIN_MINUTES,
          Math.min(SETTINGS_LIMITS.MAX_MINUTES, draft.shortBreak),
        ),
      ),
      longBreak: toSeconds(
        Math.max(
          SETTINGS_LIMITS.MIN_MINUTES,
          Math.min(SETTINGS_LIMITS.MAX_MINUTES, draft.longBreak),
        ),
      ),
    },
    isNotificationEnabled: draft.isNotificationEnabled,
    isSoundEnabled: draft.isSoundEnabled,
    timerDisplayStyle: draft.timerDisplayStyle,
    pomodorosBeforeLongBreak: draft.pomodorosBeforeLongBreak,
    dailyGoal: draft.dailyGoal,
  };
}

export function hasSettingsDraftChanged(draft: SettingsDraft, savedDraft: SettingsDraft) {
  return (
    draft.pomodoro !== savedDraft.pomodoro ||
    draft.shortBreak !== savedDraft.shortBreak ||
    draft.longBreak !== savedDraft.longBreak ||
    draft.isNotificationEnabled !== savedDraft.isNotificationEnabled ||
    draft.isSoundEnabled !== savedDraft.isSoundEnabled ||
    draft.timerDisplayStyle !== savedDraft.timerDisplayStyle ||
    draft.pomodorosBeforeLongBreak !== savedDraft.pomodorosBeforeLongBreak ||
    draft.dailyGoal !== savedDraft.dailyGoal
  );
}
