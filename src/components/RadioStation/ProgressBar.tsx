export default function ProgressBar() {
  return (
    <div className="w-full sm:max-w-[16rem] h-2 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full w-full bg-linear-to-r from-indigo-500 via-violet-500 to-indigo-400 rounded-full animate-[pulse_3s_ease-in-out_infinite]" />
    </div>
  );
}
