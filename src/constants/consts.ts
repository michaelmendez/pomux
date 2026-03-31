import type { TimerTypes } from "@/types/types";

export const APP_NAME = "Pomux";
export const BASE_HEAD_TITLE = "Pomux — Free Pomodoro Timer";
export const POMODOROS_BEFORE_LONG_BREAK = 4;
export const SECONDS_PER_MINUTE = 60;
export const TWENTY_FIVE_MINUTES = 25 * SECONDS_PER_MINUTE;
export const FIFTEEN_MINUTES = 15 * SECONDS_PER_MINUTE;
export const FIVE_MINUTES = 5 * SECONDS_PER_MINUTE;

export const SETTINGS_LIMITS = {
  MIN_MINUTES: 1,
  MID_MINUTES: 30,
  MAX_MINUTES: 60,
  MODAL_ANIMATION_MS: 220,
} as const;

export const API_RESPONSE_PREVIEW_CHARS = 120;

export const NOTIFICATION_ASSETS = {
  ICON_PATH: "/web-app-manifest-192x192.png",
  BADGE_PATH: "/favicon-96x96.png",
} as const;

export const TIMER_NOTIFICATION_MESSAGES = {
  POMODORO_COMPLETE: { title: "Focus complete", body: "Step away for a moment." },
  BREAK_COMPLETE: { title: "Break finished", body: "Ready to focus again." },
} as const;

export const AUDIO_VOLUME = {
  MIN: 0,
  LOW_THRESHOLD: 50,
  DEFAULT: 100,
  MAX: 100,
  RESTORE_FALLBACK: 50,
} as const;

export const TIMER_INTERVAL_MS = 1000;
export const NOTIFICATION_SOUND_PATH = "/notificationSound.ogg";

export const STORAGE_KEYS = {
  SETTINGS: "settings",
  SESSIONS: "sessions",
  AUTO_START: "autoStart",
} as const;

export const TIMER_TYPES = {
  POMODORO: "pomodoro",
  SHORT_BREAK: "shortBreak",
  LONG_BREAK: "longBreak",
} as const;

export const INITIAL_SESSIONS = {
  pomodoro: 0,
  shortBreak: 0,
  longBreak: 0,
};

export const DEFAULT_DURATIONS: Record<TimerTypes, number> = {
  [TIMER_TYPES.POMODORO]: TWENTY_FIVE_MINUTES,
  [TIMER_TYPES.LONG_BREAK]: FIFTEEN_MINUTES,
  [TIMER_TYPES.SHORT_BREAK]: FIVE_MINUTES,
};

