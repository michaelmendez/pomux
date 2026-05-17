import Header from "@/features/header/components/Header";
import WaveDivider from "@/features/header/components/WaveDivider";
import { lazy, Suspense } from "react";

const Settings = lazy(() => import("@/features/header/components/Settings"));

function SettingsFallback() {
  return (
    <button
      type="button"
      disabled
      className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/50"
    >
      <span
        className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60"
        aria-hidden="true"
      />{" "}
      Settings
    </button>
  );
}

export default function HeaderLayout() {
  return (
    <>
      <div className="text-white px-4 py-2.25 sm:px-6 sm:py-4 bg-brand">
        <div className="flex items-center justify-between gap-4">
          <Header />
          <Suspense fallback={<SettingsFallback />}>
            <Settings />
          </Suspense>
        </div>
      </div>
      <WaveDivider />
    </>
  );
}
