export default function StationFavicon({ url }: Readonly<{ url?: string }>) {
  if (url) {
    return (
      <img
        src={url}
        alt="Station Logo"
        className="w-10 h-10 rounded-full ring-2 ring-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.4)] shrink-0 object-cover"
      />
    );
  }
  return <div className="w-10 h-10 rounded-full ring-2 ring-white/10 bg-white/5 shrink-0" />;
}
