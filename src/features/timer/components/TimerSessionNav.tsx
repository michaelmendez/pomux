import Button from "@/shared/ui/Button";
import { ICON_SIZE, TIMER_TYPES } from "@/constants/consts";
import type { Sessions } from "@/contexts/SettingsProvider";
import type { TimerTypes } from "@/types/types";
import { Trash2 } from "lucide-react";

type TimerSessionNavProps = {
  activeButton: TimerTypes;
  handleTimerClick: (type: TimerTypes) => void;
  sessions: Sessions;
  handleResetSessions: () => void;
};

export default function TimerSessionNav({
  activeButton,
  handleTimerClick,
  sessions,
  handleResetSessions,
}: Readonly<TimerSessionNavProps>) {
  return (
    <div className="flex flex-wrap justify-center gap-5 xs:gap-2">
      <Button
        isActive={activeButton === TIMER_TYPES.POMODORO}
        onClick={() => handleTimerClick(TIMER_TYPES.POMODORO)}
      >
        {sessions.pomodoro} Pomodoro
      </Button>
      <Button
        isActive={activeButton === TIMER_TYPES.SHORT_BREAK}
        onClick={() => handleTimerClick(TIMER_TYPES.SHORT_BREAK)}
      >
        {sessions.shortBreak} Short Break
      </Button>
      <Button
        isActive={activeButton === TIMER_TYPES.LONG_BREAK}
        onClick={() => handleTimerClick(TIMER_TYPES.LONG_BREAK)}
      >
        {sessions.longBreak} Long Break
      </Button>
      <Button
        onClick={handleResetSessions}
        title="Reset sessions"
        disabled={Object.values(sessions).every((s: number) => s === 0)}
      >
        <Trash2 size={ICON_SIZE.SM} />
      </Button>
    </div>
  );
}
