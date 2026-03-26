import FooterLayout from "@/features/footer/components/Layout";
import HeaderLayout from "@/features/header/components/Layout";
import TimerLayout from "@/features/timer/components/Layout";
import { APP_NAME, BASE_HEAD_TITLE } from "@/constants/consts";
import { SettingsProvider } from "@/contexts/SettingsProvider";
import { formatTime } from "@/utils/formatTime";
import { getStoredPomodoroSeconds } from "@/utils/settingsStorage";
import { useState } from "react";

function App() {
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(getStoredPomodoroSeconds);

  return (
    <SettingsProvider>
      <title>{isTimerRunning ? `${formatTime(seconds)} · ${APP_NAME}` : BASE_HEAD_TITLE}</title>
      <HeaderLayout />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 xs:gap-2 px-4 sm:px-6 pb-40 sm:pb-44">
        <TimerLayout
          seconds={seconds}
          setSeconds={setSeconds}
          isTimerRunning={isTimerRunning}
          setIsTimerRunning={setIsTimerRunning}
        />
      </main>
      <FooterLayout />
    </SettingsProvider>
  );
}

export default App;
