import { useSettings } from "@/contexts/useSettings";
import { ensureNotificationPermission } from "@/utils/notifications";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useMemo, useReducer } from "react";
import SettingsModal from "./SettingsModal";
import { useSettingsModalControls } from "./useSettingsModalControls";
import {
  createSettingsDraft,
  createSettingsPayload,
  hasSettingsDraftChanged,
  settingsDraftReducer,
} from "./settingsDraft";

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
