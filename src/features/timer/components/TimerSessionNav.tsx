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

const NAV_BTN =
  "inline-flex items-center gap-1.5 font-medium rounded-full px-4 py-2 text-[13px] xs:px-3 xs:py-1.5 xs:text-xs";

export default function TimerSessionNav({
  activeButton,
  handleTimerClick,
  sessions,
  handleResetSessions,
}: Readonly<TimerSessionNavProps>) {
  return (
    <div className="flex flex-wrap justify-center gap-2.5 max-[376px]:gap-2">
      <Button
        isActive={activeButton === TIMER_TYPES.POMODORO}
        onClick={() => handleTimerClick(TIMER_TYPES.POMODORO)}
        title="Pomodoro"
        className={NAV_BTN}
      >
        <Flame size={13} className="shrink-0 opacity-80" />
        <span className="xs:hidden">Pomodoro</span>
        <span className="tabular-nums opacity-70 text-sm xs:text-xs leading-none">
          {sessions.pomodoro}
        </span>
      </Button>

      <Button
        isActive={activeButton === TIMER_TYPES.SHORT_BREAK}
        onClick={() => handleTimerClick(TIMER_TYPES.SHORT_BREAK)}
        title="Short Break"
        className={NAV_BTN}
      >
        <Coffee size={13} className="shrink-0 opacity-80" />
        <span className="xs:hidden">Short Break</span>
        <span className="tabular-nums opacity-70 text-sm xs:text-xs leading-none">
          {sessions.shortBreak}
        </span>
      </Button>

      <Button
        isActive={activeButton === TIMER_TYPES.LONG_BREAK}
        onClick={() => handleTimerClick(TIMER_TYPES.LONG_BREAK)}
        title="Long Break"
        className={NAV_BTN}
      >
        <Moon size={13} className="shrink-0 opacity-80" />
        <span className="xs:hidden">Long Break</span>
        <span className="tabular-nums opacity-70 text-sm xs:text-xs leading-none">
          {sessions.longBreak}
        </span>
      </Button>

      <Button
        onClick={handleResetSessions}
        title="Reset sessions"
        disabled={Object.values(sessions).every((s: number) => s === 0)}
        className="inline-flex items-center rounded-full p-2 text-sm"
      >
        <Trash2 size={ICON_SIZE.SM} />
      </Button>
    </div>
  );
}
