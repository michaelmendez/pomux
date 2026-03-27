import { SettingsProvider } from "@/contexts/SettingsProvider";
import FooterLayout from "@/features/footer/components/Layout";
import HeaderLayout from "@/features/header/components/Layout";
import TimerLayout from "@/features/timer/components/Layout";

function App() {
  return (
    <SettingsProvider>
      <HeaderLayout />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 xs:gap-3 px-4 sm:px-6 pb-44 xs:pb-52 sm:pb-44">
        <TimerLayout />
      </main>
      <FooterLayout />
    </SettingsProvider>
  );
}

export default App;
