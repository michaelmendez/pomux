import { formatTime } from "@/utils/formatTime";

const RING_RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type TimerProps = {
  seconds: number;
  totalSeconds: number;
  isRunning: boolean;
};

export default function Timer({ seconds, totalSeconds, isRunning }: Readonly<TimerProps>) {
  const [minutes, secs] = formatTime(seconds).split(":");
  const progress = totalSeconds > 0 ? seconds / totalSeconds : 1;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="relative flex scale-[1.2] items-center justify-center xs:w-52 xs:h-52 w-68 h-68 md:scale-[0.94] md:w-md md:h-112 lg:scale-100 my-4 sm:my-0">
      {/* Ambient glow when running */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-700 ease-in-out pointer-events-none ${
          isRunning
            ? "shadow-[0_0_80px_rgba(112,69,235,0.18),inset_0_0_60px_rgba(65,0,202,0.07)]"
            : "shadow-none"
        }`}
      />

      {/* SVG progress ring */}
      <svg
        viewBox="0 0 260 260"
        className="absolute inset-0 w-full h-full -rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx="130"
          cy="130"
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="2"
        />
        {/* Progress arc */}
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
          style={{ transition: isRunning ? "stroke-dashoffset 1s linear" : "none" }}
        />
      </svg>

      {/* Timer digits */}
      <span className="relative z-10 text-6xl xs:text-5xl md:text-9xl font-bold tracking-tight tabular-nums leading-none select-none">
        {minutes}
        <span
          className="transition-opacity duration-300"
          style={{ opacity: isRunning ? 0.55 : 0.85 }}
        >
          :
        </span>
        {secs}
      </span>
    </div>
  );
}
