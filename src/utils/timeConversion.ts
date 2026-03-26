import { SECONDS_PER_MINUTE } from "@/constants/consts";

export const toMinutes = (seconds: number): number => Math.round(seconds / SECONDS_PER_MINUTE);

export const toSeconds = (minutes: number): number => minutes * SECONDS_PER_MINUTE;
