import { SettingsProvider } from "@/contexts/SettingsProvider";
import FooterLayout from "@/features/footer/components/Layout";
import HeaderLayout from "@/features/header/components/Layout";
import TimerLayout from "@/features/timer/components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <HeaderLayout />
        <main className="flex flex-1 flex-col items-center justify-center gap-6 xs:gap-3 px-4 sm:px-6 pb-44 xs:pb-52 sm:pb-44">
          <TimerLayout />
        </main>
        <FooterLayout />
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
