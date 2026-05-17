import { SETTINGS_LIMITS } from "@/constants/consts";
import { useEffect, useReducer, useRef } from "react";
import type { SettingsDraft, SettingsDraftAction } from "./settingsDraft";

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

export function useSettingsModalControls(
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
