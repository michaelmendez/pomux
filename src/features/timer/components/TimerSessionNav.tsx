import { ICON_SIZE, TIMER_TYPES } from "@/constants/consts";
import type { Sessions } from "@/contexts/SettingsProvider";
import Button from "@/shared/ui/Button";
import type { TimerTypes } from "@/types/types";
import { FireIcon, MoonIcon, BoltIcon, TrashIcon } from "@heroicons/react/24/solid";

type TimerSessionNavProps = {
  activeButton: TimerTypes;
  handleTimerClick: (type: TimerTypes) => void;
  sessions: Sessions;
  handleResetSessions: () => void;
};

const NAV_BTN =
  "inline-flex items-center gap-2 font-semibold rounded-full px-5 py-2.5 text-sm xs:px-4 xs:py-2 xs:text-sm";

export default function TimerSessionNav({
  activeButton,
  handleTimerClick,
  sessions,
  handleResetSessions,
}: Readonly<TimerSessionNavProps>) {
  return (
    <div className="mt-2 sm:mt-1 flex flex-wrap justify-center gap-2.5 max-[376px]:gap-2">
      <Button
        isActive={activeButton === TIMER_TYPES.POMODORO}
        onClick={() => handleTimerClick(TIMER_TYPES.POMODORO)}
        title="Pomodoro"
        className={NAV_BTN}
      >
        <FireIcon style={{ width: 17, height: 17 }} className="shrink-0 opacity-80" />
        <span className="tabular-nums opacity-80 text-base xs:text-sm leading-none">
          {sessions.pomodoro}
        </span>
      </Button>

      <Button
        isActive={activeButton === TIMER_TYPES.SHORT_BREAK}
        onClick={() => handleTimerClick(TIMER_TYPES.SHORT_BREAK)}
        title="Short Break"
        className={NAV_BTN}
      >
        <BoltIcon style={{ width: 17, height: 17 }} className="shrink-0 opacity-80" />
        <span className="tabular-nums opacity-80 text-base xs:text-sm leading-none">
          {sessions.shortBreak}
        </span>
      </Button>

      <Button
        isActive={activeButton === TIMER_TYPES.LONG_BREAK}
        onClick={() => handleTimerClick(TIMER_TYPES.LONG_BREAK)}
        title="Long Break"
        className={NAV_BTN}
      >
        <MoonIcon style={{ width: 17, height: 17 }} className="shrink-0 opacity-80" />
        <span className="tabular-nums opacity-80 text-base xs:text-sm leading-none">
          {sessions.longBreak}
        </span>
      </Button>

      <Button
        onClick={handleResetSessions}
        title="Reset sessions"
        disabled={Object.values(sessions).every((s: number) => s === 0)}
        className="inline-flex items-center rounded-full p-2 text-sm"
      >
        <TrashIcon style={{ width: ICON_SIZE.MD, height: ICON_SIZE.MD }} />
      </Button>
    </div>
  );
}
