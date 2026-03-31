type MinimalTimerDisplayProps = {
  minutes: string;
  secs: string;
  separatorOpacity: string;
};

export default function MinimalTimerDisplay({
  minutes,
  secs,
  separatorOpacity,
}: Readonly<MinimalTimerDisplayProps>) {
  return (
    <div className="relative flex items-center justify-center my-4 sm:my-0">
      <span className="relative z-10 text-6xl xs:text-5xl md:text-9xl font-semibold tracking-[-0.03em] text-white/95 drop-shadow-[0_6px_24px_rgba(0,0,0,0.22)] tabular-nums leading-none select-none">
        {minutes}
        <span className={`mx-0.5 transition-opacity duration-300 ${separatorOpacity}`}>:</span>
        {secs}
      </span>
    </div>
  );
}
