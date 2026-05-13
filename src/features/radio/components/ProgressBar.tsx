type Props = {
  isPlaying: boolean;
};

export default function ProgressBar({ isPlaying }: Readonly<Props>) {
  return (
    <div
      className="relative mx-auto w-52 sm:w-56"
      aria-label={isPlaying ? "Radio playing" : "Radio paused"}
    >
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-500/20 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isPlaying
              ? "bg-linear-to-r from-brand via-violet-500 to-fuchsia-400 w-full"
              : "bg-zinc-400/60 w-4/5"
          }`}
        >
          {isPlaying && (
            <div className="size-full animate-[progressShine_1.8s_linear_infinite] bg-linear-to-r from-violet-100/0 via-violet-100/30 to-violet-100/0" />
          )}
        </div>
      </div>
      <style>{`
        @keyframes progressShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
