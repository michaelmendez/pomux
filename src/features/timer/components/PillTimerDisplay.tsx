type PillTimerDisplayProps = {
  minutes: string;
  secs: string;
  isRunning: boolean;
  separatorOpacity: string;
};

export default function PillTimerDisplay({
  minutes,
  secs,
  isRunning,
  separatorOpacity,
}: Readonly<PillTimerDisplayProps>) {
  return (
    <div className="relative isolate flex items-center justify-center my-4 sm:my-0">
      <div
        className={`pointer-events-none absolute -inset-x-3 -inset-y-2 sm:-inset-x-5 sm:-inset-y-3 rounded-full blur-md transition-opacity duration-400 ${
          isRunning ? "opacity-50" : "opacity-0"
        }`}
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 62%, rgba(129,92,255,0.35) 70%, rgba(112,69,235,0) 79%)",
        }}
      />
      <div
        className={`relative z-10 rounded-full px-11 py-4 backdrop-blur-md sm:px-14 sm:py-5 ${
          isRunning
            ? "bg-black/60 shadow-[0_20px_56px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.14)]"
            : "bg-black/60 shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
        }`}
      >
        <span className="text-6xl xs:text-6xl md:text-9xl font-bold tracking-tight tabular-nums leading-none select-none">
          {minutes}
          <span className={`transition-opacity duration-300 ${separatorOpacity}`}>:</span>
          {secs}
        </span>
      </div>
    </div>
  );
}
