import { DEFAULT_DURATIONS, TIMER_DISPLAY_STYLES } from "@/constants/consts";

type Durations = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
};

export type TimerDisplayStyle = (typeof TIMER_DISPLAY_STYLES)[keyof typeof TIMER_DISPLAY_STYLES];

export type Sessions = { pomodoro: number; shortBreak: number; longBreak: number };

export type SettingsContextProps = {
  durations: Durations;
  isNotificationEnabled: boolean;
  isSoundEnabled: boolean;
  timerDisplayStyle: TimerDisplayStyle;
  pomodorosBeforeLongBreak: number;
  dailyGoal: number;
};

export type SettingsContextValue = {
  settings: SettingsContextProps;
  handleSettings: (newSettings: Partial<SettingsContextProps>) => void;
};

export const DEFAULT_SETTINGS: SettingsContextProps = {
  durations: DEFAULT_DURATIONS,
  isNotificationEnabled: false,
  isSoundEnabled: true,
  timerDisplayStyle: TIMER_DISPLAY_STYLES.RING,
  pomodorosBeforeLongBreak: 4,
  dailyGoal: 8,
};
