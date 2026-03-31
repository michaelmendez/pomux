import { DEFAULT_DURATIONS, TIMER_TYPES } from "@/constants/consts";
import Button from "@/shared/ui/Button";
import type { TimerTypes } from "@/types/types";
import {
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

type TimerControlBarProps = {
  isTimerRunning: boolean;
  handleStartTimer: () => void;
  handleRefreshTime: () => void;
  activeButton: TimerTypes;
  seconds: number;
  autoStart: boolean;
  setAutoStart: (newValue: boolean | ((prev: boolean) => boolean)) => void;
  handleSkipToNextPhase: () => void;
};

export default function TimerControlBar({
  isTimerRunning,
  handleStartTimer,
  handleRefreshTime,
  activeButton,
  seconds,
  autoStart,
  setAutoStart,
  handleSkipToNextPhase,
}: Readonly<TimerControlBarProps>) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="cta"
        isActive={isTimerRunning}
        onClick={handleStartTimer}
        className="font-semibold rounded-full px-8 py-2.5 text-sm tracking-wide"
      >
        {isTimerRunning ? "Pause" : "Start"}
      </Button>
      <Button
        isActive={autoStart}
        onClick={() => setAutoStart((prev: boolean) => !prev)}
        title={autoStart ? "Auto-start on" : "Auto-start off"}
        className="font-semibold rounded-full p-2.5 text-sm"
      >
        <ArrowPathIcon className="h-5 w-5" />
      </Button>
      <Button
        onClick={handleRefreshTime}
        title="Restart timer"
        disabled={seconds === DEFAULT_DURATIONS[activeButton]}
        className="font-semibold rounded-full p-2.5 text-sm"
      >
        <ArrowPathRoundedSquareIcon className="h-5 w-5" />
      </Button>
      <Button
        onClick={handleSkipToNextPhase}
        title={activeButton === TIMER_TYPES.POMODORO ? "Skip to Break" : "Skip to Focus Session"}
        aria-label={
          activeButton === TIMER_TYPES.POMODORO ? "Skip to Break" : "Skip to Focus Session"
        }
        className="font-semibold rounded-full p-2.5 text-sm"
      >
        <ArrowRightIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
