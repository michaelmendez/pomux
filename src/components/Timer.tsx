import { formatTime } from "@/utils/formatTime";

type TimerProps = {
  seconds: number;
  isRunning: boolean;
};

export default function Timer({ seconds, isRunning }: Readonly<TimerProps>) {
  const [minutes, secs] = formatTime(seconds).split(":");

  return (
    <div
      className={`rounded-full p-4 sm:p-8 transition-all duration-700 ${
        isRunning ? "shadow-[0_0_60px_10px_rgba(65,0,202,0.4)]" : "shadow-none"
      }`}
    >
      <span className="text-8xl xs:text-6xl md:text-9xl font-bold tracking-tight tabular-nums">
        {minutes}
        <span className={isRunning ? "animate-pulse" : ""}>:</span>
        {secs}
      </span>
    </div>
  );
}
