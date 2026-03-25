import type { TimerTypes } from "@/types/types";

export const APP_NAME = "Pomux";
export const BASE_HEAD_TITLE = "Pomux — Free Pomodoro Timer";
export const POMODOROS_BEFORE_LONG_BREAK = 4;
export const TWENTY_FIVE_MINUTES = 25 * 60;
export const FIFTEEN_MINUTES = 15 * 60;
export const FIVE_MINUTES = 5 * 60;

export const TIMER_INTERVAL_MS = 1000;
export const NOTIFICATION_SOUND_PATH = "/notificationSound.ogg";

export const STORAGE_KEYS = {
  SESSIONS: "sessions",
  AUTO_START: "autoStart",
} as const;

export const ICON_SIZE = {
  XS: 16,
  SM: 18,
  MD: 20,
} as const;

export const TIMER_TYPES = {
  POMODORO: "pomodoro",
  SHORT_BREAK: "shortBreak",
  LONG_BREAK: "longBreak",
} as const;

export const DURATIONS: Record<TimerTypes, number> = {
  [TIMER_TYPES.POMODORO]: TWENTY_FIVE_MINUTES,
  [TIMER_TYPES.LONG_BREAK]: FIFTEEN_MINUTES,
  [TIMER_TYPES.SHORT_BREAK]: FIVE_MINUTES,
};

