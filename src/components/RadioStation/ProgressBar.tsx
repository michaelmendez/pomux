type Props = {
  isPlaying: boolean;
};

export default function ProgressBar({ isPlaying }: Readonly<Props>) {
  return (
    <div
      className="relative w-full sm:max-w-[16rem] h-2 rounded-full overflow-hidden bg-white/5 ring-1 ring-white/10"
      aria-label={isPlaying ? "Radio playing" : "Radio paused"}
    >
      <div
        className={`absolute inset-0 rounded-full bg-zinc-500/65 transition-all duration-700 ease-in-out motion-reduce:transition-none ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        className={`absolute inset-0 origin-left rounded-full bg-linear-to-r from-indigo-500 via-violet-500 to-indigo-400 transition-all duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${
          isPlaying
            ? "opacity-100 scale-x-100 animate-[pulse_4s_ease-in-out_infinite]"
            : "opacity-0 scale-x-90"
        }`}
      />
    </div>
  );
}
