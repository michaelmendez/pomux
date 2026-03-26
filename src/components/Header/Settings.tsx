import Slider from "@/components/Common/Slider";
import { useSettings } from "@/contexts/useSettings";
import { toMinutes, toSeconds } from "@/utils/timeConversion";
import { Settings2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MAX_MINUTES = 60;
const MODAL_ANIMATION_MS = 220;

export default function Settings() {
  const { settings, handleSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [pomodoro, setPomodoro] = useState(toMinutes(settings.durations.pomodoro));
  const [shortBreak, setShortBreak] = useState(toMinutes(settings.durations.shortBreak));
  const [longBreak, setLongBreak] = useState(toMinutes(settings.durations.longBreak));

  const isDirty =
    pomodoro !== toMinutes(settings.durations.pomodoro) ||
    shortBreak !== toMinutes(settings.durations.shortBreak) ||
    longBreak !== toMinutes(settings.durations.longBreak);

  useEffect(() => {
    setPomodoro(toMinutes(settings.durations.pomodoro));
    setShortBreak(toMinutes(settings.durations.shortBreak));
    setLongBreak(toMinutes(settings.durations.longBreak));
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
    }, MODAL_ANIMATION_MS);

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
        pomodoro: toSeconds(Math.max(1, Math.min(MAX_MINUTES, pomodoro))),
        shortBreak: toSeconds(Math.max(1, Math.min(MAX_MINUTES, shortBreak))),
        longBreak: toSeconds(Math.max(1, Math.min(MAX_MINUTES, longBreak))),
      },
    });
    setIsClosing(true);
  };

  const openModal = () => {
    setPomodoro(toMinutes(settings.durations.pomodoro));
    setShortBreak(toMinutes(settings.durations.shortBreak));
    setLongBreak(toMinutes(settings.durations.longBreak));
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
          className={`fixed inset-0 z-100 m-0 h-full w-full p-4 transition-all duration-200 ease-out ${
            isClosing || isEntering
              ? "bg-black/0 backdrop-blur-none"
              : "bg-black/50 backdrop-blur-md"
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
              className={`relative z-10 w-full max-w-xl rounded-2xl border border-white/12 bg-[#11131b] text-white shadow-[0_24px_70px_rgba(0,0,0,0.6)] transition-all duration-200 ease-out ${
                isClosing || isEntering
                  ? "translate-y-3 scale-[0.98] opacity-0"
                  : "translate-y-0 scale-100 opacity-100"
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Timer Settings</h2>
                  <p className="text-sm text-white/65">Adjust your defaults in minutes.</p>
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
                className="space-y-4 p-6"
              >
                <div className="space-y-2 rounded-xl border border-white/8 bg-white/2 p-5">
                  <label className="block text-base text-white/90 font-medium">
                    Work duration: {pomodoro} min
                  </label>
                  <Slider
                    value={pomodoro}
                    min={1}
                    max={MAX_MINUTES}
                    step={1}
                    onChange={(v) => setPomodoro(v)}
                    valueFormatter={(v) => `${v} min`}
                    minLabel="1 min"
                    midLabel="30 min"
                    maxLabel="60 min"
                  />
                </div>

                <div className="space-y-2 rounded-xl border border-white/8 bg-white/2 p-5">
                  <label className="block text-base text-white/90 font-medium">
                    Short break: {shortBreak} min
                  </label>
                  <Slider
                    value={shortBreak}
                    min={1}
                    max={MAX_MINUTES}
                    step={1}
                    onChange={(v) => setShortBreak(v)}
                    valueFormatter={(v) => `${v} min`}
                    minLabel="1 min"
                    midLabel="30 min"
                    maxLabel="60 min"
                  />
                </div>

                <div className="space-y-2 rounded-xl border border-white/8 bg-white/2 p-5">
                  <label className="block text-base text-white/90 font-medium">
                    Long break: {longBreak} min
                  </label>
                  <Slider
                    value={longBreak}
                    min={1}
                    max={MAX_MINUTES}
                    step={1}
                    onChange={(v) => setLongBreak(v)}
                    valueFormatter={(v) => `${v} min`}
                    minLabel="1 min"
                    midLabel="30 min"
                    maxLabel="60 min"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
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
                    className="rounded-full bg-white px-5 py-2 text-base font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
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
