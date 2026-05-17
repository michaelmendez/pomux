import {
  APP_NAME,
  BASE_HEAD_TITLE,
  INITIAL_SESSIONS,
  NOTIFICATION_SOUND_PATH,
  STORAGE_KEYS,
  TIMER_INTERVAL_MS,
  TIMER_NOTIFICATION_MESSAGES,
  TIMER_TYPES,
} from "@/constants/consts";
import { useSettings } from "@/contexts/useSettings";
import MotivationalQuote from "@/features/timer/components/MotivationalQuote";
import TimerControlBar from "@/features/timer/components/TimerControlBar";
import TimerSessionNav from "@/features/timer/components/TimerSessionNav";
import useLocalStorage from "@/hooks/useLocalStorage";
import type { TimerTypes } from "@/types/types";
import { formatTime } from "@/utils/formatTime";
import { notifySessionEnd } from "@/utils/notifications";
import { getStoredPomodoroSeconds } from "@/utils/settingsStorage";
import { lazy, useEffect, useRef, useReducer, Suspense } from "react";

const Timer = lazy(() => import("@/features/timer/components/Timer"));

type TimerState = {
  isTimerRunning: boolean;
  seconds: number;
  activeButton: TimerTypes;
  pomodoroCount: number;
};

type KeyboardActions = {
  space: () => void;
  r: () => void;
  s: () => void;
};

const keyboardRef: { current: KeyboardActions } = {
  current: { space() {}, r() {}, s() {} },
};

function onKeyDown(event: KeyboardEvent) {
  const target = event.target as HTMLElement;
  if (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "BUTTON" ||
    target.isContentEditable
  )
    return;

  switch (event.code) {
    case "Space":
      event.preventDefault();
      keyboardRef.current.space();
      break;
    case "KeyR":
      keyboardRef.current.r();
      break;
    case "KeyS":
      keyboardRef.current.s();
      break;
  }
}

type TimerAction =
  | { type: "TICK" }
    | {
        type: "COMPLETE";
        autoStart: boolean;
        durations: Record<TimerTypes, number>;
        pomodorosBeforeLongBreak: number;
      }
  | {
      type: "SET_MODE";
      mode: TimerTypes;
      durations: Record<TimerTypes, number>;
      isRunning: boolean;
    }
  | { type: "TOGGLE_RUNNING" }
  | { type: "RESET"; seconds: number }
  | { type: "SKIP" };

function handleComplete(state: TimerState, action: TimerAction & { type: "COMPLETE" }): TimerState {
  const { autoStart, durations, pomodorosBeforeLongBreak } = action;

  if (state.activeButton === TIMER_TYPES.POMODORO) {
    const nextPomodoroCount = state.pomodoroCount + 1;
    const nextType =
      nextPomodoroCount % pomodorosBeforeLongBreak === 0
        ? TIMER_TYPES.LONG_BREAK
        : TIMER_TYPES.SHORT_BREAK;

    return {
      isTimerRunning: autoStart,
      seconds: durations[nextType],
      activeButton: nextType,
      pomodoroCount: nextPomodoroCount,
    };
  }

  return {
    isTimerRunning: autoStart,
    seconds: durations[TIMER_TYPES.POMODORO],
    activeButton: TIMER_TYPES.POMODORO,
    pomodoroCount: state.pomodoroCount,
  };
}

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "TICK": {
      if (!state.isTimerRunning) return state;
      if (state.seconds <= 1) {
        return { ...state, seconds: 0 };
      }
      return { ...state, seconds: state.seconds - 1 };
    }
    case "COMPLETE":
      return handleComplete(state, action);
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
      return { ...state, seconds: action.seconds, isTimerRunning: false };
    case "SKIP":
      return { ...state, seconds: 0, isTimerRunning: true };
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
  const [dailyData, setDailyData] = useLocalStorage<{ date: string; count: number }>(
    STORAGE_KEYS.DAILY_SESSIONS,
    { date: "", count: 0 },
  );
  const { settings } = useSettings();
  const isTimerRunningRef = useRef(state.isTimerRunning);
  const titleText = state.isTimerRunning
    ? `${formatTime(state.seconds)} · ${APP_NAME}`
    : BASE_HEAD_TITLE;

  useEffect(() => {
    isTimerRunningRef.current = state.isTimerRunning;
  }, [state.isTimerRunning]);

  useEffect(() => {
    if (!isTimerRunningRef.current) {
      dispatch({ type: "RESET", seconds: settings.durations[state.activeButton] });
    }
  }, [state.activeButton, settings.durations]);

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
    dispatch({ type: "RESET", seconds: settings.durations[state.activeButton] });
  };

  const handleTimerClick = (type: TimerTypes) => {
    dispatch({
      type: "SET_MODE",
      mode: type,
      durations: settings.durations,
      isRunning: state.isTimerRunning,
    });
  };

  const handleResetSessions = () => {
    setSessions(INITIAL_SESSIONS);
    setDailyData({ date: new Date().toISOString().slice(0, 10), count: 0 });
  };

  useEffect(() => {
    keyboardRef.current = {
      space: () => dispatch({ type: "TOGGLE_RUNNING" }),
      r: () =>
        dispatch({
          type: "RESET",
          seconds: settings.durations[state.activeButton],
        }),
      s: () => dispatch({ type: "SKIP" }),
    };
  });

  useEffect(() => {
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (state.seconds !== 0) return;
    if (!state.isTimerRunning) return;

    if (settings.isSoundEnabled ?? true) {
      notificationRef.current.play();
    }

    if (settings.isNotificationEnabled) {
      const notification =
        state.activeButton === TIMER_TYPES.POMODORO
          ? TIMER_NOTIFICATION_MESSAGES.POMODORO_COMPLETE
          : TIMER_NOTIFICATION_MESSAGES.BREAK_COMPLETE;
      notifySessionEnd(notification);
    }

    setSessions((prev) => ({
      ...prev,
      [state.activeButton]: prev[state.activeButton] + 1,
    }));

    if (state.activeButton === TIMER_TYPES.POMODORO) {
      setDailyData((prev) => {
        const today = new Date().toISOString().slice(0, 10);
        if (prev.date !== today) return { date: today, count: 1 };
        return { ...prev, count: prev.count + 1 };
      });
    }

    dispatch({
      type: "COMPLETE",
      autoStart,
      durations: settings.durations,
      pomodorosBeforeLongBreak: settings.pomodorosBeforeLongBreak,
    });
  }, [
    state.seconds,
    state.isTimerRunning,
    state.activeButton,
    autoStart,
    settings,
    setSessions,
    setDailyData,
  ]);

  return (
    <div className="mx-auto mt-8 flex w-full flex-col items-center gap-4 sm:mt-5 sm:gap-5 md:mt-6">
      <title>{titleText}</title>
      <TimerSessionNav
        activeButton={state.activeButton}
        handleTimerClick={handleTimerClick}
        sessions={sessions}
        handleResetSessions={handleResetSessions}
      />
      <div className="relative -mt-1 overflow-hidden rounded-full bg-white/8 px-4 py-1.5">
        <div
          className="absolute inset-0 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(100, (dailyData.count / settings.dailyGoal) * 100)}%`,
            background:
              dailyData.count >= settings.dailyGoal
                ? "linear-gradient(to right, rgba(52,211,153,0.15), rgba(110,231,183,0.15))"
                : "linear-gradient(to right, rgba(167,139,250,0.15), rgba(124,58,237,0.15))",
          }}
        />
        <span className="relative flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <span className="text-sm tabular-nums font-semibold text-violet-200">
              {dailyData.count}
            </span>
            <span className="text-white/40">/</span>
            <span className="text-sm tabular-nums text-white/65">{settings.dailyGoal}</span>
          </span>
          <span className="text-[12px] text-white/50 font-medium">Today</span>
        </span>
      </div>
      <Suspense fallback={<div className="h-40 flex items-center justify-center" />}>
        <Timer
          seconds={state.seconds}
          totalSeconds={settings.durations[state.activeButton]}
          isRunning={state.isTimerRunning}
        />
      </Suspense>
      <TimerControlBar
        isTimerRunning={state.isTimerRunning}
        handleStartTimer={handleStartTimer}
        handleRefreshTime={handleRefreshTime}
        activeButton={state.activeButton}
        seconds={state.seconds}
        totalSeconds={settings.durations[state.activeButton]}
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
