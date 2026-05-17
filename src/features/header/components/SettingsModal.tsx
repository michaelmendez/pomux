import { TIMER_DISPLAY_STYLES } from "@/constants/consts";
import type { TimerDisplayStyle } from "@/contexts/settingsTypes";
import {
  BellIcon,
  BellSlashIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import DurationSlider from "./DurationSlider";
import SettingsToggleCard from "./SettingsToggleCard";
import type { SettingsDraft, SettingsDraftAction } from "./settingsDraft";

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
      <DurationSlider
        label="Long break interval"
        value={draft.pomodorosBeforeLongBreak}
        min={2}
        max={8}
        unit="sessions"
        onChange={(value) => dispatchDraft({ type: "setPomodorosBeforeLongBreak", value })}
      />
      <DurationSlider
        label="Daily goal"
        value={draft.dailyGoal}
        min={2}
        max={20}
        unit="sessions"
        midValue={10}
        onChange={(value) => dispatchDraft({ type: "setDailyGoal", value })}
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

export default SettingsModal;
