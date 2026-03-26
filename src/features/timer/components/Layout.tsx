import MotivationalQuote from "@/features/timer/components/MotivationalQuote";
import Timer from "@/features/timer/components/Timer";
import TimerControlBar from "@/features/timer/components/TimerControlBar";
import TimerSessionNav from "@/features/timer/components/TimerSessionNav";
import {
  TIMER_TYPES,
  STORAGE_KEYS,
  NOTIFICATION_SOUND_PATH,
  INITIAL_SESSIONS,
  POMODOROS_BEFORE_LONG_BREAK,
  TIMER_INTERVAL_MS,
} from "@/constants/consts";
import { useSettings } from "@/contexts/useSettings";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { TimerTypes } from "@/types/types";
import { useState, useRef, useEffect } from "react";

type TimerLayoutProps = {
  seconds: number;
  isTimerRunning: boolean;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TimerLayout({
  seconds,
  isTimerRunning,
  setSeconds,
  setIsTimerRunning,
}: Readonly<TimerLayoutProps>) {
  const [activeButton, setActiveButton] = useState<TimerTypes>(TIMER_TYPES.POMODORO);
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);
  const [autoStart, setAutoStart] = useLocalStorage<boolean>(STORAGE_KEYS.AUTO_START, true);
  const notificationRef = useRef<HTMLAudioElement>(new Audio(NOTIFICATION_SOUND_PATH));
  const [sessions, setSessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
  const { settings } = useSettings();

  useEffect(() => {
    if (!isTimerRunning) {
      setSeconds(settings.durations[activeButton]);
    }
  }, [activeButton, isTimerRunning, setSeconds, settings.durations]);

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
      setSessions((prev) => ({
        ...prev,
        [activeButton]: prev[activeButton] + 1,
      }));
      setActiveButton(nextType);
      setSeconds(settings.durations[nextType]);
      setIsTimerRunning(autoStart);
    }
  }, [
    activeButton,
    autoStart,
    pomodoroCount,
    seconds,
    setIsTimerRunning,
    setSeconds,
    setSessions,
    settings.durations,
  ]);

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
  }, [isTimerRunning, setIsTimerRunning, setSeconds]);

  const handleStartTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleRefreshTime = () => {
    handleTimerClick(activeButton);
  };

  const handleTimerClick = (type: TimerTypes) => {
    setIsTimerRunning(false);
    setSeconds(settings.durations[type]);
    setActiveButton(type);
  };

  const handleResetSessions = () => {
    setSessions(INITIAL_SESSIONS);
  };

  return (
    <>
      <TimerSessionNav
        activeButton={activeButton}
        handleTimerClick={handleTimerClick}
        sessions={sessions}
        handleResetSessions={handleResetSessions}
      />
      <Timer seconds={seconds} isRunning={isTimerRunning} />
      <TimerControlBar
        isTimerRunning={isTimerRunning}
        handleStartTimer={handleStartTimer}
        handleRefreshTime={handleRefreshTime}
        activeButton={activeButton}
        seconds={seconds}
        autoStart={autoStart}
        setAutoStart={setAutoStart}
      />
      <MotivationalQuote />
    </>
  );
}
