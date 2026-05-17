type SettingsToggleCardProps = {
  enabled: boolean;
  onClick: () => void;
  enabledTitle: string;
  disabledTitle: string;
  enabledDescription: string;
  disabledDescription: string;
  enabledIcon: React.ReactNode;
  disabledIcon: React.ReactNode;
};

export default function SettingsToggleCard({
  enabled,
  onClick,
  enabledTitle,
  disabledTitle,
  enabledDescription,
  disabledDescription,
  enabledIcon,
  disabledIcon,
}: Readonly<SettingsToggleCardProps>) {
  return (
    <div className="rounded-xl bg-white/2 p-3">
      <button
        type="button"
        onClick={onClick}
        className={`group flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ${
          enabled
            ? "bg-emerald-500/14 text-emerald-50 hover:bg-emerald-500/20 focus-visible:ring-emerald-300/45"
            : "bg-rose-400/10 text-white/92 hover:bg-rose-400/16 focus-visible:ring-rose-300/35"
        }`}
      >
        <span className="flex items-center gap-3">
          <span
            className={`inline-flex items-center justify-center ${
              enabled ? "text-emerald-50" : "text-white/82"
            }`}
          >
            {enabled ? enabledIcon : disabledIcon}
          </span>
          <span className="flex flex-col">
            <span className="text-base font-semibold tracking-tight">
              {enabled ? enabledTitle : disabledTitle}
            </span>
            <span className={`text-sm ${enabled ? "text-white/90" : "text-white/82"}`}>
              {enabled ? enabledDescription : disabledDescription}
            </span>
          </span>
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
            enabled ? "bg-emerald-300/22 text-emerald-50" : "bg-rose-300/24 text-rose-100"
          }`}
        >
          {enabled ? "On" : "Off"}
        </span>
      </button>
    </div>
  );
}
