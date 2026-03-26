import Button from "@/shared/ui/Button";
import { DEFAULT_DURATIONS, ICON_SIZE } from "@/constants/consts";
import type { TimerTypes } from "@/types/types";
import { Repeat, RotateCcw } from "lucide-react";

type TimerControlBarProps = {
  isTimerRunning: boolean;
  handleStartTimer: () => void;
  handleRefreshTime: () => void;
  activeButton: TimerTypes;
  seconds: number;
  autoStart: boolean;
  setAutoStart: (newValue: boolean | ((prev: boolean) => boolean)) => void;
};

export default function TimerControlBar({
  isTimerRunning,
  handleStartTimer,
  handleRefreshTime,
  activeButton,
  seconds,
  autoStart,
  setAutoStart,
}: Readonly<TimerControlBarProps>) {
  return (
    <div className="flex items-center gap-3">
      <Button isActive={isTimerRunning} onClick={handleStartTimer}>
        {isTimerRunning ? "Pause" : "Start"}
      </Button>
      <Button
        onClick={handleRefreshTime}
        title="Restart timer"
        disabled={seconds === DEFAULT_DURATIONS[activeButton]}
      >
        <RotateCcw size={ICON_SIZE.MD} />
      </Button>
      <Button
        isActive={autoStart}
        onClick={() => setAutoStart((prev: boolean) => !prev)}
        title={autoStart ? "Auto-start on" : "Auto-start off"}
      >
        <Repeat size={ICON_SIZE.MD} />
      </Button>
    </div>
  );
}
