import { SETTINGS_LIMITS, TIMER_DISPLAY_STYLES } from "@/constants/consts";
import type { SettingsContextProps, TimerDisplayStyle } from "@/contexts/SettingsProvider";
import { useSettings } from "@/contexts/useSettings";
import Slider from "@/shared/ui/Slider";
import { ensureNotificationPermission } from "@/utils/notifications";
import { toMinutes, toSeconds } from "@/utils/timeConversion";
import {
  BellIcon,
  BellSlashIcon,
  Cog6ToothIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useMemo, useReducer, useRef } from "react";

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

type SettingsDraft = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  isNotificationEnabled: boolean;
  isSoundEnabled: boolean;
  timerDisplayStyle: TimerDisplayStyle;
};

type SettingsDraftAction =
  | { type: "reset"; value: SettingsDraft }
  | { type: "setPomodoro"; value: number }
  | { type: "setShortBreak"; value: number }
  | { type: "setLongBreak"; value: number }
  | { type: "setNotificationEnabled"; value: boolean }
  | { type: "toggleSoundEnabled" }
  | { type: "setTimerDisplayStyle"; value: TimerDisplayStyle };

type SettingsModalState = {
  isOpen: boolean;
  isEntering: boolean;
  isClosing: boolean;
};

type SettingsModalAction =
  | { type: "open" }
  | { type: "entered" }
  | { type: "requestClose" }
  | { type: "finishClose" };

type DurationSettingsProps = {
  draft: SettingsDraft;
  dispatchDraft: React.Dispatch<SettingsDraftAction>;
};

type TimerDisplaySectionProps = {
  timerDisplayStyle: TimerDisplayStyle;
  dispatchDraft: React.Dispatch<SettingsDraftAction>;
};

type AlertsSectionProps = {
  isNotificationEnabled: boolean;
  isSoundEnabled: boolean;
  onNotificationsClick: () => void;
  dispatchDraft: React.Dispatch<SettingsDraftAction>;
};

type SettingsActionsProps = {
  isDirty: boolean;
  onCancel: () => void;
  onSave: () => void;
};

type SettingsModalProps = {
  draft: SettingsDraft;
  isDirty: boolean;
  isEntering: boolean;
  isClosing: boolean;
  onClose: () => void;
  onSave: () => void;
  onNotificationsClick: () => void;
  dispatchDraft: React.Dispatch<SettingsDraftAction>;
};

const TIMER_DISPLAY_OPTIONS = [
  {
    key: TIMER_DISPLAY_STYLES.RING,
    label: "Ring",
    description: "Progress ring + digits",
  },
  {
    key: TIMER_DISPLAY_STYLES.MINIMAL,
    label: "Minimal",
    description: "Large digital-only timer",
  },
  {
    key: TIMER_DISPLAY_STYLES.PILL,
    label: "Pill",
    description: "Capsule timer with glow",
  },
] as const;

function createSettingsDraft(settings: SettingsContextProps): SettingsDraft {
  return {
    pomodoro: toMinutes(settings.durations.pomodoro),
    shortBreak: toMinutes(settings.durations.shortBreak),
    longBreak: toMinutes(settings.durations.longBreak),
    isNotificationEnabled: settings.isNotificationEnabled,
    isSoundEnabled: settings.isSoundEnabled ?? true,
    timerDisplayStyle: settings.timerDisplayStyle,
  };
}

function createSettingsPayload(draft: SettingsDraft): SettingsContextProps {
  return {
    durations: {
      pomodoro: toSeconds(
        Math.max(
          SETTINGS_LIMITS.MIN_MINUTES,
          Math.min(SETTINGS_LIMITS.MAX_MINUTES, draft.pomodoro),
        ),
      ),
      shortBreak: toSeconds(
        Math.max(
          SETTINGS_LIMITS.MIN_MINUTES,
          Math.min(SETTINGS_LIMITS.MAX_MINUTES, draft.shortBreak),
        ),
      ),
      longBreak: toSeconds(
        Math.max(
          SETTINGS_LIMITS.MIN_MINUTES,
          Math.min(SETTINGS_LIMITS.MAX_MINUTES, draft.longBreak),
        ),
      ),
    },
    isNotificationEnabled: draft.isNotificationEnabled,
    isSoundEnabled: draft.isSoundEnabled,
    timerDisplayStyle: draft.timerDisplayStyle,
  };
}

function hasSettingsDraftChanged(draft: SettingsDraft, savedDraft: SettingsDraft) {
  return (
    draft.pomodoro !== savedDraft.pomodoro ||
    draft.shortBreak !== savedDraft.shortBreak ||
    draft.longBreak !== savedDraft.longBreak ||
    draft.isNotificationEnabled !== savedDraft.isNotificationEnabled ||
    draft.isSoundEnabled !== savedDraft.isSoundEnabled ||
    draft.timerDisplayStyle !== savedDraft.timerDisplayStyle
  );
}

function settingsDraftReducer(draft: SettingsDraft, action: SettingsDraftAction): SettingsDraft {
  switch (action.type) {
    case "reset":
      return action.value;
    case "setPomodoro":
      return { ...draft, pomodoro: action.value };
    case "setShortBreak":
      return { ...draft, shortBreak: action.value };
    case "setLongBreak":
      return { ...draft, longBreak: action.value };
    case "setNotificationEnabled":
      return { ...draft, isNotificationEnabled: action.value };
    case "toggleSoundEnabled":
      return { ...draft, isSoundEnabled: !draft.isSoundEnabled };
    case "setTimerDisplayStyle":
      return { ...draft, timerDisplayStyle: action.value };
  }
}

function settingsModalReducer(
  state: SettingsModalState,
  action: SettingsModalAction,
): SettingsModalState {
  switch (action.type) {
    case "open":
      return { isOpen: true, isEntering: true, isClosing: false };
    case "entered":
      return { ...state, isEntering: false };
    case "requestClose":
      return { ...state, isClosing: true };
    case "finishClose":
      return { isOpen: false, isEntering: false, isClosing: false };
  }
}

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

function SettingsTrigger({ onClick }: Readonly<{ onClick: () => void }>) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClick}
        title="Open settings"
        className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/95 backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <Cog6ToothIcon className="size-4" />
        Settings
      </button>
    </div>
  );
}

function DurationSlider({
  label,
  value,
  onChange,
}: Readonly<{ label: string; value: number; onChange: (value: number) => void }>) {
  return (
    <div className="space-y-2 rounded-xl bg-white/2 p-5">
      <label className="block text-base text-white/90 font-medium">
        {label}: {value} min
      </label>
      <Slider
        value={value}
        min={SETTINGS_LIMITS.MIN_MINUTES}
        max={SETTINGS_LIMITS.MAX_MINUTES}
        step={1}
        onChange={onChange}
        valueFormatter={(v) => `${v} min`}
        minLabel={`${SETTINGS_LIMITS.MIN_MINUTES} min`}
        midLabel={`${SETTINGS_LIMITS.MID_MINUTES} min`}
        maxLabel={`${SETTINGS_LIMITS.MAX_MINUTES} min`}
      />
    </div>
  );
}

function DurationSettings({ draft, dispatchDraft }: Readonly<DurationSettingsProps>) {
  return (
    <>
      <DurationSlider
        label="Work duration"
        value={draft.pomodoro}
        onChange={(value) => dispatchDraft({ type: "setPomodoro", value })}
      />
      <DurationSlider
        label="Short break"
        value={draft.shortBreak}
        onChange={(value) => dispatchDraft({ type: "setShortBreak", value })}
      />
      <DurationSlider
        label="Long break"
        value={draft.longBreak}
        onChange={(value) => dispatchDraft({ type: "setLongBreak", value })}
      />
    </>
  );
}

function TimerDisplaySection({
  timerDisplayStyle,
  dispatchDraft,
}: Readonly<TimerDisplaySectionProps>) {
  return (
    <section className="space-y-3 rounded-xl bg-white/3 p-4">
      <div>
        <h3 className="text-base font-semibold tracking-wide text-white/92">Timer display</h3>
        <p className="mt-1 text-sm text-white/76">Pick how the timer should look while you work.</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {TIMER_DISPLAY_OPTIONS.map((option) => {
          const isActive = timerDisplayStyle === option.key;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => dispatchDraft({ type: "setTimerDisplayStyle", value: option.key })}
              className={`rounded-xl border px-3 py-2.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 ${
                isActive
                  ? "border-violet-400/80 bg-violet-500/18 text-white shadow-[0_8px_24px_rgba(124,58,237,0.28)] focus-visible:ring-violet-300/65"
                  : "border-white/14 bg-white/4 text-white/88 hover:bg-white/8 focus-visible:ring-white/35"
              }`}
              aria-pressed={isActive}
            >
              <div className="text-sm font-semibold tracking-wide">{option.label}</div>
              <div className="mt-0.5 text-xs text-white/70">{option.description}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function AlertsSection({
  isNotificationEnabled,
  isSoundEnabled,
  onNotificationsClick,
  dispatchDraft,
}: Readonly<AlertsSectionProps>) {
  return (
    <section className="space-y-3 rounded-xl bg-white/3 p-4">
      <div>
        <h3 className="text-base font-semibold tracking-wide text-white/92">Alerts</h3>
        <p className="mt-1 text-sm text-white/76">
          Notifications and sound are used for end-of-session reminders.
        </p>
      </div>

      <SettingsToggleCard
        enabled={isNotificationEnabled}
        onClick={onNotificationsClick}
        enabledTitle="Notifications are enabled"
        disabledTitle="Enable notifications"
        enabledDescription="You will get alerts when a session ends."
        disabledDescription="Get alerts when focus or break sessions complete."
        enabledIcon={<BellIcon className="size-4" />}
        disabledIcon={<BellSlashIcon className="size-4" />}
      />

      <SettingsToggleCard
        enabled={isSoundEnabled}
        onClick={() => dispatchDraft({ type: "toggleSoundEnabled" })}
        enabledTitle="Sound is enabled"
        disabledTitle="Enable sound"
        enabledDescription="Play a sound when a session ends."
        disabledDescription="Mute end-of-session sound alerts."
        enabledIcon={<SpeakerWaveIcon className="size-4" />}
        disabledIcon={<SpeakerXMarkIcon className="size-4" />}
      />
    </section>
  );
}

function SettingsActions({ isDirty, onCancel, onSave }: Readonly<SettingsActionsProps>) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-4 sm:px-6">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full border border-white/20 px-5 py-2 text-base font-medium text-white/85 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={!isDirty}
        className="rounded-full bg-violet-600 px-5 py-2 text-base font-semibold text-white shadow-lg shadow-violet-950/40 transition-all hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
      >
        Save
      </button>
    </div>
  );
}

function SettingsModal({
  draft,
  isDirty,
  isEntering,
  isClosing,
  onClose,
  onSave,
  onNotificationsClick,
  dispatchDraft,
}: Readonly<SettingsModalProps>) {
  const isAnimatingOut = isClosing || isEntering;

  return (
    <dialog
      open
      aria-label="Timer settings"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className={`fixed inset-0 z-100 m-0 size-full bg-black/50 p-3 backdrop-blur-md transition-opacity duration-200 ease-out sm:p-4 ${
        isAnimatingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex min-h-full items-center justify-center">
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close settings"
          onClick={onClose}
          className="absolute inset-0"
        />
        <div
          className={`relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#11131b] text-white shadow-[0_24px_70px_rgba(0,0,0,0.6)] transition-all duration-200 ease-out ${
            isAnimatingOut
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
              onClick={onClose}
              className="rounded-full border border-white/20 p-2 text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <XMarkIcon className="size-4" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="minimal-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
              <DurationSettings draft={draft} dispatchDraft={dispatchDraft} />
              <TimerDisplaySection
                timerDisplayStyle={draft.timerDisplayStyle}
                dispatchDraft={dispatchDraft}
              />
              <AlertsSection
                isNotificationEnabled={draft.isNotificationEnabled}
                isSoundEnabled={draft.isSoundEnabled}
                onNotificationsClick={onNotificationsClick}
                dispatchDraft={dispatchDraft}
              />
            </div>
            <SettingsActions isDirty={isDirty} onCancel={onClose} onSave={onSave} />
          </div>
        </div>
      </div>
    </dialog>
  );
}

function useSettingsModalControls(
  savedDraft: SettingsDraft,
  dispatchDraft: React.Dispatch<SettingsDraftAction>,
) {
  const [modalState, dispatchModal] = useReducer(settingsModalReducer, {
    isOpen: false,
    isEntering: false,
    isClosing: false,
  });
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!modalState.isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatchModal({ type: "requestClose" });
      }
    };

    document.body.style.overflow = "hidden";
    globalThis.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      globalThis.removeEventListener("keydown", onKeyDown);
    };
  }, [modalState.isOpen]);

  useEffect(() => {
    if (!modalState.isClosing) return;

    closeTimerRef.current = setTimeout(() => {
      dispatchModal({ type: "finishClose" });
    }, SETTINGS_LIMITS.MODAL_ANIMATION_MS);

    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [modalState.isClosing]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const openModal = () => {
    dispatchDraft({ type: "reset", value: savedDraft });
    dispatchModal({ type: "open" });

    globalThis.requestAnimationFrame(() => {
      dispatchModal({ type: "entered" });
    });
  };

  const closeModal = () => {
    dispatchModal({ type: "requestClose" });
  };

  return { closeModal, modalState, openModal };
}

export default function Settings() {
  const { settings, handleSettings } = useSettings();
  const savedDraft = useMemo(() => createSettingsDraft(settings), [settings]);
  const [draft, dispatchDraft] = useReducer(
    settingsDraftReducer,
    settings,
    createSettingsDraft,
  );
  const { closeModal, modalState, openModal } = useSettingsModalControls(
    savedDraft,
    dispatchDraft,
  );
  const isDirty = hasSettingsDraftChanged(draft, savedDraft);

  const saveSettings = () => {
    handleSettings(createSettingsPayload(draft));
    closeModal();
  };

  const handleNotifications = async () => {
    if (draft.isNotificationEnabled) {
      dispatchDraft({ type: "setNotificationEnabled", value: false });
      return;
    }

    const isEnabled = await ensureNotificationPermission();
    dispatchDraft({ type: "setNotificationEnabled", value: isEnabled });
  };

  return (
    <>
      <SettingsTrigger onClick={openModal} />

      {modalState.isOpen && (
        <SettingsModal
          draft={draft}
          isDirty={isDirty}
          isEntering={modalState.isEntering}
          isClosing={modalState.isClosing}
          onClose={closeModal}
          onSave={saveSettings}
          onNotificationsClick={handleNotifications}
          dispatchDraft={dispatchDraft}
        />
      )}
    </>
  );
}
