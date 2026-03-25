import Button from "@/components/Button";
import Header from "@/components/Header";
import MotivationalQuote from "@/components/MotivationalQuote";
import Station from "@/components/Station";
import Timer from "@/components/Timer";
import {
  APP_NAME,
  BASE_HEAD_TITLE,
  DURATIONS,
  ICON_SIZE,
  NOTIFICATION_SOUND_PATH,
  POMODOROS_BEFORE_LONG_BREAK,
  STORAGE_KEYS,
  TIMER_INTERVAL_MS,
  TIMER_TYPES,
  TWENTY_FIVE_MINUTES,
} from "@/constants/consts";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { TimerTypes } from "@/types/types";
import { formatTime } from "@/utils/formatTime";
import { Repeat, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const initialSessions = {
  pomodoro: 0,
  shortBreak: 0,
  longBreak: 0,
};

function App() {
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(TWENTY_FIVE_MINUTES);
  const [activeButton, setActiveButton] = useState<TimerTypes>(TIMER_TYPES.POMODORO);
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);
  const [autoStart, setAutoStart] = useLocalStorage<boolean>(STORAGE_KEYS.AUTO_START, true);
  const notificationRef = useRef(new Audio(NOTIFICATION_SOUND_PATH));
  const [sessions, setSessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, initialSessions);

  useEffect(() => {
    if (seconds === 0) {
      notificationRef.current.play();

      let nextPomodoroCount = pomodoroCount;
      let nextType: TimerTypes;

      if (activeButton === TIMER_TYPES.POMODORO) {
        nextPomodoroCount = pomodoroCount + 1;
        nextType =
          nextPomodoroCount % POMODOROS_BEFORE_LONG_BREAK === 0
            ? TIMER_TYPES.LONG_BREAK
            : TIMER_TYPES.SHORT_BREAK;
      } else {
        nextType = TIMER_TYPES.POMODORO;
      }

      setPomodoroCount(nextPomodoroCount);
      setSessions((prev) => ({ ...prev, [activeButton]: prev[activeButton] + 1 }));
      setActiveButton(nextType);
      setSeconds(DURATIONS[nextType]);
      setIsTimerRunning(autoStart);
    }
  }, [activeButton, autoStart, pomodoroCount, seconds, setSessions]);

  useEffect(() => {
    let timerId: number | undefined;

    if (isTimerRunning) {
      timerId = setInterval(
        () =>
          setSeconds((prevSeconds) => {
            if (prevSeconds <= 1) {
              setIsTimerRunning(false);
              return 0;
            }
            return prevSeconds - 1;
          }),
        TIMER_INTERVAL_MS,
      );
    }

    return () => clearInterval(timerId);
  }, [isTimerRunning]);

  const handleStartTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleRefreshTime = () => {
    handleTimerClick(activeButton);
  };

  const handleTimerClick = (type: TimerTypes) => {
    setIsTimerRunning(false);
    setSeconds(DURATIONS[type]);
    setActiveButton(type);
  };

  const handleResetSessions = () => {
    setSessions(initialSessions);
  };

  return (
    <>
      <title>{isTimerRunning ? `${formatTime(seconds)} · ${APP_NAME}` : BASE_HEAD_TITLE}</title>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 xs:gap-2 px-4 sm:px-6 pb-40 sm:pb-44">
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
        <Timer seconds={seconds} isRunning={isTimerRunning} />
        <div className="flex items-center gap-3">
          <Button isActive={isTimerRunning} onClick={handleStartTimer}>
            {isTimerRunning ? "Pause" : "Start"}
          </Button>
          <Button
            onClick={handleRefreshTime}
            title="Restart timer"
            disabled={seconds === DURATIONS[activeButton]}
          >
            <RotateCcw size={ICON_SIZE.MD} />
          </Button>
          <Button
            isActive={autoStart}
            onClick={() => setAutoStart((prev) => !prev)}
            title={autoStart ? "Auto-start on" : "Auto-start off"}
          >
            <Repeat size={ICON_SIZE.MD} />
          </Button>
        </div>
        <MotivationalQuote />
      </main>
      <Station />
    </>
  );
}

export default App;
