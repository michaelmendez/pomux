const RING_RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type RingTimerDisplayProps = {
  minutes: string;
  secs: string;
  isRunning: boolean;
  strokeDashoffset: number;
  separatorOpacity: string;
};

export default function RingTimerDisplay({
  minutes,
  secs,
  isRunning,
  strokeDashoffset,
  separatorOpacity,
}: Readonly<RingTimerDisplayProps>) {
  return (
    <div className="relative flex scale-[1.2] items-center justify-center size-68 xs:size-52 md:h-112 md:w-md md:scale-[0.94] lg:scale-100 my-4 sm:my-0">
      <div
        className={`absolute inset-0 rounded-full transition-all duration-700 ease-in-out pointer-events-none ${
          isRunning
            ? "shadow-[0_0_80px_rgba(112,69,235,0.18),inset_0_0_60px_rgba(65,0,202,0.07)]"
            : "shadow-none"
        }`}
      />

      <svg
        viewBox="0 0 260 260"
        className="absolute inset-0 size-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="130"
          cy="130"
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="2"
        />
        <circle
          cx="130"
          cy="130"
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(112,69,235,0.8)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          className={isRunning ? "transition-[stroke-dashoffset] duration-1000 ease-linear" : ""}
        />
      </svg>

      <span className="relative z-10 text-6xl xs:text-5xl md:text-9xl font-bold tracking-tight tabular-nums leading-none select-none">
        {minutes}
        <span className={`transition-opacity duration-300 ${separatorOpacity}`}>:</span>
        {secs}
      </span>
    </div>
  );
}
