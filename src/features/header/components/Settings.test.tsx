import {
  FIFTEEN_MINUTES,
  FIVE_MINUTES,
  TIMER_DISPLAY_STYLES,
  TWENTY_FIVE_MINUTES,
} from "@/constants/consts";
import { renderWithSettings } from "@/test/test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Settings from "./Settings";

describe("Settings", () => {
  it("opens the modal and saves new settings when an option is changed", async () => {
    const handleSettings = vi.fn();
    const user = userEvent.setup();

    renderWithSettings(<Settings />, {
      handleSettings,
      settings: {
        durations: {
          pomodoro: TWENTY_FIVE_MINUTES,
          shortBreak: FIVE_MINUTES,
          longBreak: FIFTEEN_MINUTES,
        },
        isNotificationEnabled: false,
        isSoundEnabled: true,
        timerDisplayStyle: TIMER_DISPLAY_STYLES.RING,
      },
    });

    await user.click(screen.getByRole("button", { name: /^settings$/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /minimal/i }));

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeEnabled();

    await user.click(saveButton);

    expect(handleSettings).toHaveBeenCalledWith(
      expect.objectContaining({ timerDisplayStyle: TIMER_DISPLAY_STYLES.MINIMAL }),
    );
  });
});
