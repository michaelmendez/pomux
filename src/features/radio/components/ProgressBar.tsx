type Props = {
  isPlaying: boolean;
};

export default function ProgressBar({ isPlaying }: Readonly<Props>) {
  return (
    <div
      className="relative mx-auto w-52 sm:w-56"
      aria-label={isPlaying ? "Radio playing" : "Radio paused"}
    >
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-500/20 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isPlaying
              ? "bg-linear-to-r from-indigo-600 via-indigo-500 to-indigo-400"
              : "bg-slate-400/60"
          }`}
          style={{ width: isPlaying ? "100%" : "80%" }}
        >
          {isPlaying && (
            <div className="h-full w-full animate-[progressShine_1.8s_linear_infinite] bg-linear-to-r from-indigo-100/0 via-indigo-100/30 to-indigo-100/0" />
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
