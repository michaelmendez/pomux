import { SETTINGS_LIMITS } from "@/constants/consts";
import { useSettings } from "@/contexts/useSettings";
import Slider from "@/shared/ui/Slider";
import { ensureNotificationPermission } from "@/utils/notifications";
import { toMinutes, toSeconds } from "@/utils/timeConversion";
import { Bell, BellOff, Settings2, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

function SettingsToggleCard({
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

export default function Settings() {
  const { settings, handleSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [pomodoro, setPomodoro] = useState(toMinutes(settings.durations.pomodoro));
  const [shortBreak, setShortBreak] = useState(toMinutes(settings.durations.shortBreak));
  const [longBreak, setLongBreak] = useState(toMinutes(settings.durations.longBreak));
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(
    settings.isNotificationEnabled,
  );
  const [isSoundEnabled, setIsSoundEnabled] = useState(settings.isSoundEnabled ?? true);

  const isDirty =
    pomodoro !== toMinutes(settings.durations.pomodoro) ||
    shortBreak !== toMinutes(settings.durations.shortBreak) ||
    longBreak !== toMinutes(settings.durations.longBreak) ||
    isNotificationEnabled !== settings.isNotificationEnabled ||
    isSoundEnabled !== (settings.isSoundEnabled ?? true);

  useEffect(() => {
    setPomodoro(toMinutes(settings.durations.pomodoro));
    setShortBreak(toMinutes(settings.durations.shortBreak));
    setLongBreak(toMinutes(settings.durations.longBreak));
    setIsNotificationEnabled(settings.isNotificationEnabled);
    setIsSoundEnabled(settings.isSoundEnabled ?? true);
  }, [settings]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsClosing(true);
      }
    };

    document.body.style.overflow = "hidden";
    globalThis.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      globalThis.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isClosing) return;

    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, SETTINGS_LIMITS.MODAL_ANIMATION_MS);

    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [isClosing]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const saveSettings = () => {
    handleSettings({
      durations: {
        pomodoro: toSeconds(
          Math.max(SETTINGS_LIMITS.MIN_MINUTES, Math.min(SETTINGS_LIMITS.MAX_MINUTES, pomodoro)),
        ),
        shortBreak: toSeconds(
          Math.max(SETTINGS_LIMITS.MIN_MINUTES, Math.min(SETTINGS_LIMITS.MAX_MINUTES, shortBreak)),
        ),
        longBreak: toSeconds(
          Math.max(SETTINGS_LIMITS.MIN_MINUTES, Math.min(SETTINGS_LIMITS.MAX_MINUTES, longBreak)),
        ),
      },
      isNotificationEnabled,
      isSoundEnabled,
    });
    setIsClosing(true);
  };

  const openModal = () => {
    setPomodoro(toMinutes(settings.durations.pomodoro));
    setShortBreak(toMinutes(settings.durations.shortBreak));
    setLongBreak(toMinutes(settings.durations.longBreak));
    setIsNotificationEnabled(settings.isNotificationEnabled);
    setIsSoundEnabled(settings.isSoundEnabled ?? true);
    setIsClosing(false);
    setIsEntering(true);
    setIsOpen(true);

    globalThis.requestAnimationFrame(() => {
      setIsEntering(false);
    });
  };

  const closeModal = () => {
    setIsClosing(true);
  };

  const handleNotifications = async () => {
    if (isNotificationEnabled) {
      setIsNotificationEnabled(false);
      return;
    }

    const isEnabled = await ensureNotificationPermission();
    setIsNotificationEnabled(isEnabled);
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openModal}
          title="Open settings"
          className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/95 backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <Settings2 size={16} />
          Settings
        </button>
      </div>

      {isOpen && (
        <dialog
          open
          aria-label="Timer settings"
          onCancel={(event) => {
            event.preventDefault();
            closeModal();
          }}
          className={`fixed inset-0 z-100 m-0 h-full w-full bg-black/50 p-3 backdrop-blur-md transition-opacity duration-200 ease-out sm:p-4 ${
            isClosing || isEntering ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="relative flex min-h-full items-center justify-center">
            <button
              type="button"
              tabIndex={-1}
              aria-label="Close settings"
              onClick={closeModal}
              className="absolute inset-0"
            />
            <div
              className={`relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#11131b] text-white shadow-[0_24px_70px_rgba(0,0,0,0.6)] transition-all duration-200 ease-out ${
                isClosing || isEntering
                  ? "translate-y-3 scale-[0.98] opacity-0"
                  : "translate-y-0 scale-100 opacity-100"
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Timer Settings</h2>
                  <p className="text-sm text-white/75">Set your focus and break durations.</p>
                </div>
                <button
                  type="button"
                  aria-label="Close settings"
                  onClick={closeModal}
                  className="rounded-full border border-white/20 p-2 text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <X size={16} />
                </button>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  saveSettings();
                }}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="minimal-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
                  <div className="space-y-2 rounded-xl bg-white/2 p-5">
                    <label className="block text-base text-white/90 font-medium">
                      Work duration: {pomodoro} min
                    </label>
                    <Slider
                      value={pomodoro}
                      min={SETTINGS_LIMITS.MIN_MINUTES}
                      max={SETTINGS_LIMITS.MAX_MINUTES}
                      step={1}
                      onChange={(v) => setPomodoro(v)}
                      valueFormatter={(v) => `${v} min`}
                      minLabel={`${SETTINGS_LIMITS.MIN_MINUTES} min`}
                      midLabel={`${SETTINGS_LIMITS.MID_MINUTES} min`}
                      maxLabel={`${SETTINGS_LIMITS.MAX_MINUTES} min`}
                    />
                  </div>

                  <div className="space-y-2 rounded-xl bg-white/2 p-5">
                    <label className="block text-base text-white/90 font-medium">
                      Short break: {shortBreak} min
                    </label>
                    <Slider
                      value={shortBreak}
                      min={SETTINGS_LIMITS.MIN_MINUTES}
                      max={SETTINGS_LIMITS.MAX_MINUTES}
                      step={1}
                      onChange={(v) => setShortBreak(v)}
                      valueFormatter={(v) => `${v} min`}
                      minLabel={`${SETTINGS_LIMITS.MIN_MINUTES} min`}
                      midLabel={`${SETTINGS_LIMITS.MID_MINUTES} min`}
                      maxLabel={`${SETTINGS_LIMITS.MAX_MINUTES} min`}
                    />
                  </div>

                  <div className="space-y-2 rounded-xl bg-white/2 p-5">
                    <label className="block text-base text-white/90 font-medium">
                      Long break: {longBreak} min
                    </label>
                    <Slider
                      value={longBreak}
                      min={SETTINGS_LIMITS.MIN_MINUTES}
                      max={SETTINGS_LIMITS.MAX_MINUTES}
                      step={1}
                      onChange={(v) => setLongBreak(v)}
                      valueFormatter={(v) => `${v} min`}
                      minLabel={`${SETTINGS_LIMITS.MIN_MINUTES} min`}
                      midLabel={`${SETTINGS_LIMITS.MID_MINUTES} min`}
                      maxLabel={`${SETTINGS_LIMITS.MAX_MINUTES} min`}
                    />
                  </div>

                  <section className="space-y-3 rounded-xl bg-white/3 p-4">
                    <div>
                      <h3 className="text-base font-semibold tracking-wide text-white/92">
                        Alerts
                      </h3>
                      <p className="mt-1 text-sm text-white/76">
                        Notifications and sound are used for end-of-session reminders.
                      </p>
                    </div>

                    <SettingsToggleCard
                      enabled={isNotificationEnabled}
                      onClick={handleNotifications}
                      enabledTitle="Notifications are enabled"
                      disabledTitle="Enable notifications"
                      enabledDescription="You will get alerts when a session ends."
                      disabledDescription="Get alerts when focus or break sessions complete."
                      enabledIcon={<Bell size={18} />}
                      disabledIcon={<BellOff size={18} />}
                    />

                    <SettingsToggleCard
                      enabled={isSoundEnabled}
                      onClick={() => setIsSoundEnabled((prev) => !prev)}
                      enabledTitle="Sound is enabled"
                      disabledTitle="Enable sound"
                      enabledDescription="Play a sound when a session ends."
                      disabledDescription="Mute end-of-session sound alerts."
                      enabledIcon={<Volume2 size={18} />}
                      disabledIcon={<VolumeX size={18} />}
                    />
                  </section>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-4 sm:px-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-white/20 px-5 py-2 text-base font-medium text-white/85 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isDirty}
                    className="rounded-full bg-violet-600 px-5 py-2 text-base font-semibold text-white shadow-lg shadow-violet-950/40 transition-all hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
