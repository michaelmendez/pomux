import { TIMER_DISPLAY_STYLES } from "@/constants/consts";
import { useSettings } from "@/contexts/useSettings";
import MinimalTimerDisplay from "@/features/timer/components/MinimalTimerDisplay";
import PillTimerDisplay from "@/features/timer/components/PillTimerDisplay";
import RingTimerDisplay from "@/features/timer/components/RingTimerDisplay";
import { formatTime } from "@/utils/formatTime";

const RING_RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type TimerProps = {
  seconds: number;
  totalSeconds: number;
  isRunning: boolean;
};

export default function Timer({ seconds, totalSeconds, isRunning }: Readonly<TimerProps>) {
  const [minutes, secs] = formatTime(seconds).split(":");
  const progress = totalSeconds > 0 ? seconds / totalSeconds : 1;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const { settings } = useSettings();
  const separatorOpacity = isRunning ? "opacity-60" : "opacity-80";

  if (settings.timerDisplayStyle === TIMER_DISPLAY_STYLES.MINIMAL) {
    return (
      <MinimalTimerDisplay minutes={minutes} secs={secs} separatorOpacity={separatorOpacity} />
    );
  }

  if (settings.timerDisplayStyle === TIMER_DISPLAY_STYLES.PILL) {
    return (
      <PillTimerDisplay
        minutes={minutes}
        secs={secs}
        isRunning={isRunning}
        separatorOpacity={separatorOpacity}
      />
    );
  }

  return (
    <RingTimerDisplay
      minutes={minutes}
      secs={secs}
      isRunning={isRunning}
      strokeDashoffset={strokeDashoffset}
      separatorOpacity={separatorOpacity}
    />
  );
}
