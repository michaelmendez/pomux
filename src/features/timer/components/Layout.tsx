import {
  APP_NAME,
  BASE_HEAD_TITLE,
  INITIAL_SESSIONS,
  NOTIFICATION_SOUND_PATH,
  POMODOROS_BEFORE_LONG_BREAK,
  STORAGE_KEYS,
  TIMER_INTERVAL_MS,
  TIMER_NOTIFICATION_MESSAGES,
  TIMER_TYPES,
} from "@/constants/consts";
import { useSettings } from "@/contexts/useSettings";
import MotivationalQuote from "@/features/timer/components/MotivationalQuote";
import Timer from "@/features/timer/components/Timer";
import TimerControlBar from "@/features/timer/components/TimerControlBar";
import TimerSessionNav from "@/features/timer/components/TimerSessionNav";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { TimerTypes } from "@/types/types";
import { formatTime } from "@/utils/formatTime";
import { notifySessionEnd } from "@/utils/notifications";
import { getStoredPomodoroSeconds } from "@/utils/settingsStorage";
import { useEffect, useRef, useReducer } from "react";

type TimerState = {
  isTimerRunning: boolean;
  seconds: number;
  activeButton: TimerTypes;
  pomodoroCount: number;
};

type TimerAction =
  | { type: "TICK" }
  | { type: "COMPLETE"; autoStart: boolean; durations: Record<TimerTypes, number>; isSoundEnabled: boolean; isNotificationEnabled: boolean; onSessionUpdate: () => void }
  | { type: "SET_MODE"; mode: TimerTypes; durations: Record<TimerTypes, number>; isRunning: boolean }
  | { type: "TOGGLE_RUNNING" }
  | { type: "RESET"; seconds: number }
  | { type: "SKIP" };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "TICK": {
      if (!state.isTimerRunning) return state;
      if (state.seconds <= 1) {
        return { ...state, seconds: 0, isTimerRunning: false };
      }
      return { ...state, seconds: state.seconds - 1 };
    }
    case "COMPLETE": {
      const { autoStart, durations, isSoundEnabled, isNotificationEnabled, onSessionUpdate } = action;

      if (isSoundEnabled ?? true) {
        // notification handled via ref in component
      }

      if (isNotificationEnabled) {
        const notification =
          state.activeButton === TIMER_TYPES.POMODORO
            ? TIMER_NOTIFICATION_MESSAGES.POMODORO_COMPLETE
            : TIMER_NOTIFICATION_MESSAGES.BREAK_COMPLETE;
        notifySessionEnd(notification);
      }

      onSessionUpdate();

      let nextPomodoroCount = state.pomodoroCount;
      let nextType: TimerTypes;

      if (state.activeButton === TIMER_TYPES.POMODORO) {
        nextPomodoroCount = state.pomodoroCount + 1;
        nextType =
          nextPomodoroCount % POMODOROS_BEFORE_LONG_BREAK === 0
            ? TIMER_TYPES.LONG_BREAK
            : TIMER_TYPES.SHORT_BREAK;
      } else {
        nextType = TIMER_TYPES.POMODORO;
      }

      return {
        isTimerRunning: autoStart,
        seconds: durations[nextType],
        activeButton: nextType,
        pomodoroCount: nextPomodoroCount,
      };
    }
    case "SET_MODE": {
      if (action.isRunning) return state;
      return {
        ...state,
        seconds: action.durations[action.mode],
        activeButton: action.mode,
      };
    }
    case "TOGGLE_RUNNING":
      return { ...state, isTimerRunning: !state.isTimerRunning };
    case "RESET":
      return { ...state, seconds: action.seconds };
    case "SKIP":
      return { ...state, seconds: 0 };
    default:
      return state;
  }
}

export default function TimerLayout() {
  const [state, dispatch] = useReducer(timerReducer, {
    isTimerRunning: false,
    seconds: getStoredPomodoroSeconds(),
    activeButton: TIMER_TYPES.POMODORO,
    pomodoroCount: 0,
  });
  const [autoStart, setAutoStart] = useLocalStorage<boolean>(STORAGE_KEYS.AUTO_START, true);
  const notificationRef = useRef<HTMLAudioElement>(new Audio(NOTIFICATION_SOUND_PATH));
  const [sessions, setSessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
  const { settings } = useSettings();
  const titleText = state.isTimerRunning ? `${formatTime(state.seconds)} · ${APP_NAME}` : BASE_HEAD_TITLE;

  useEffect(() => {
    if (state.seconds === 0 && state.isTimerRunning) {
      if (settings.isSoundEnabled ?? true) {
        notificationRef.current.play();
      }
      dispatch({
        type: "COMPLETE",
        autoStart,
        durations: settings.durations,
        isSoundEnabled: settings.isSoundEnabled ?? true,
        isNotificationEnabled: settings.isNotificationEnabled,
        onSessionUpdate: () =>
          setSessions((prev) => ({
            ...prev,
            [state.activeButton]: prev[state.activeButton] + 1,
          })),
      });
    }
  }, [state.seconds, state.isTimerRunning, state.activeButton, autoStart, settings, setSessions]);

  useEffect(() => {
    if (!state.isTimerRunning) {
      dispatch({ type: "RESET", seconds: settings.durations[state.activeButton] });
    }
  }, [state.activeButton, settings.durations, state.isTimerRunning]);

  useEffect(() => {
    let timerId: number | undefined;

    if (state.isTimerRunning) {
      timerId = setInterval(() => dispatch({ type: "TICK" }), TIMER_INTERVAL_MS);
    }

    return () => clearInterval(timerId);
  }, [state.isTimerRunning]);

  const handleSkipToNextPhase = () => {
    dispatch({ type: "SKIP" });
  };

  const handleStartTimer = () => {
    dispatch({ type: "TOGGLE_RUNNING" });
  };

  const handleRefreshTime = () => {
    handleTimerClick(state.activeButton);
  };

  const handleTimerClick = (type: TimerTypes) => {
    dispatch({ type: "SET_MODE", mode: type, durations: settings.durations, isRunning: state.isTimerRunning });
  };

  const handleResetSessions = () => {
    setSessions(INITIAL_SESSIONS);
  };

  return (
    <div className="mx-auto mt-8 flex w-full flex-col items-center gap-4 sm:mt-5 sm:gap-5 md:mt-6">
      <title>{titleText}</title>
      <TimerSessionNav
        activeButton={state.activeButton}
        handleTimerClick={handleTimerClick}
        sessions={sessions}
        handleResetSessions={handleResetSessions}
      />
      <Timer
        seconds={state.seconds}
        totalSeconds={settings.durations[state.activeButton]}
        isRunning={state.isTimerRunning}
      />
      <TimerControlBar
        isTimerRunning={state.isTimerRunning}
        handleStartTimer={handleStartTimer}
        handleRefreshTime={handleRefreshTime}
        activeButton={state.activeButton}
        seconds={state.seconds}
        autoStart={autoStart}
        setAutoStart={setAutoStart}
        handleSkipToNextPhase={handleSkipToNextPhase}
      />
      <div className="hidden sm:block">
        <MotivationalQuote />
      </div>
    </div>
  );
}
