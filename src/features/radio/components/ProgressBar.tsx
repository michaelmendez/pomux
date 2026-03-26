type Props = {
  isPlaying: boolean;
};

const WAVE_BARS = [
  { height: "42%", delay: "0ms", duration: "880ms" },
  { height: "58%", delay: "80ms", duration: "760ms" },
  { height: "72%", delay: "160ms", duration: "920ms" },
  { height: "48%", delay: "240ms", duration: "840ms" },
  { height: "64%", delay: "320ms", duration: "980ms" },
  { height: "80%", delay: "400ms", duration: "900ms" },
  { height: "52%", delay: "480ms", duration: "780ms" },
  { height: "68%", delay: "560ms", duration: "940ms" },
  { height: "86%", delay: "640ms", duration: "970ms" },
  { height: "62%", delay: "720ms", duration: "820ms" },
  { height: "74%", delay: "800ms", duration: "890ms" },
  { height: "56%", delay: "880ms", duration: "760ms" },
  { height: "82%", delay: "960ms", duration: "930ms" },
  { height: "66%", delay: "1040ms", duration: "840ms" },
  { height: "54%", delay: "1120ms", duration: "910ms" },
  { height: "44%", delay: "1200ms", duration: "790ms" },
] as const;

export default function ProgressBar({ isPlaying }: Readonly<Props>) {
  return (
    <div
      className="relative mx-auto w-52 sm:w-56"
      aria-label={isPlaying ? "Radio playing" : "Radio paused"}
    >
      <div className="flex h-8 w-full items-center justify-center gap-1">
        {WAVE_BARS.map((bar) => (
          <span
            key={`${bar.delay}-${bar.duration}`}
            className={`block w-1.5 rounded-full bg-indigo-300 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
              isPlaying ? "opacity-95" : "opacity-35"
            }`}
            style={{
              height: bar.height,
              transformOrigin: "center",
              transform: isPlaying ? "none" : "scaleY(0.38)",
              animation: `radio-wave ${bar.duration} ease-in-out infinite alternate`,
              animationDelay: `-${bar.delay}`,
              animationPlayState: isPlaying ? "running" : "paused",
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes radio-wave {
          0% { transform: scaleY(0.35); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
