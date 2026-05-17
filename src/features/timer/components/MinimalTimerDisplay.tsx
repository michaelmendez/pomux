type MinimalTimerDisplayProps = {
  minutes: string;
  secs: string;
  isRunning: boolean;
  separatorOpacity: string;
};

export default function MinimalTimerDisplay({
  minutes,
  secs,
  isRunning,
  separatorOpacity,
}: Readonly<MinimalTimerDisplayProps>) {
  const timeDisplay = `${minutes}:${secs}`;
  const statusLabel = isRunning ? "Timer running" : "Timer paused";

  return (
    <div className="relative flex items-center justify-center my-4 sm:my-0">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {statusLabel}, {timeDisplay}
      </div>
      <span className="relative z-10 text-6xl xs:text-5xl md:text-9xl font-semibold tracking-[-0.03em] text-white/95 drop-shadow-[0_6px_24px_rgba(0,0,0,0.22)] tabular-nums leading-none select-none">
        {minutes}
        <span className={`mx-0.5 transition-opacity duration-300 ${separatorOpacity}`}>:</span>
        {secs}
      </span>
    </div>
  );
}
