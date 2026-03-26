import { SECONDS_PER_MINUTE } from "@/constants/consts";

const TIME_PAD_LENGTH = 2;
const ZERO_TIME_DIGIT = "0";

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / SECONDS_PER_MINUTE);
  const s = seconds % SECONDS_PER_MINUTE;

  return `${String(m).padStart(TIME_PAD_LENGTH, ZERO_TIME_DIGIT)}:${String(s).padStart(TIME_PAD_LENGTH, ZERO_TIME_DIGIT)}`;
};
