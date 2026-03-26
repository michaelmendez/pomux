import { ICON_SIZE, TIMER_TYPES } from "@/constants/consts";
import type { Sessions } from "@/contexts/SettingsProvider";
import Button from "@/shared/ui/Button";
import type { TimerTypes } from "@/types/types";
import { Coffee, Flame, Moon, Trash2 } from "lucide-react";

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
    <div className="flex flex-wrap justify-center gap-5 max-[376px]:gap-3">
      <Button
        isActive={activeButton === TIMER_TYPES.POMODORO}
        onClick={() => handleTimerClick(TIMER_TYPES.POMODORO)}
        title="Pomodoro"
        className="font-semibold rounded-full px-4 py-2 text-sm max-[376px]:px-4 max-[376px]:py-2 max-[376px]:text-xs"
      >
        <span className="max-[376px]:hidden">{sessions.pomodoro} Pomodoro</span>
        <span className="hidden max-[376px]:inline-flex items-center gap-2">
          <Flame size={18} />
          {sessions.pomodoro}
        </span>
      </Button>
      <Button
        isActive={activeButton === TIMER_TYPES.SHORT_BREAK}
        onClick={() => handleTimerClick(TIMER_TYPES.SHORT_BREAK)}
        title="Short Break"
        className="font-semibold rounded-full px-4 py-2 text-sm max-[376px]:px-4 max-[376px]:py-2 max-[376px]:text-xs"
      >
        <span className="max-[376px]:hidden">{sessions.shortBreak} Short Break</span>
        <span className="hidden max-[376px]:inline-flex items-center gap-2">
          <Coffee size={18} />
          {sessions.shortBreak}
        </span>
      </Button>
      <Button
        isActive={activeButton === TIMER_TYPES.LONG_BREAK}
        onClick={() => handleTimerClick(TIMER_TYPES.LONG_BREAK)}
        title="Long Break"
        className="font-semibold rounded-full px-4 py-2 text-sm max-[376px]:px-4 max-[376px]:py-2 max-[376px]:text-xs"
      >
        <span className="max-[376px]:hidden">{sessions.longBreak} Long Break</span>
        <span className="hidden max-[376px]:inline-flex items-center gap-2">
          <Moon size={18} />
          {sessions.longBreak}
        </span>
      </Button>
      <Button
        onClick={handleResetSessions}
        title="Reset sessions"
        disabled={Object.values(sessions).every((s: number) => s === 0)}
        className="font-semibold rounded-full px-4 py-2 text-sm"
      >
        <Trash2 size={ICON_SIZE.SM} />
      </Button>
    </div>
  );
}
