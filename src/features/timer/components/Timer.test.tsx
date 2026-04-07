import { SECONDS_PER_MINUTE, TIMER_DISPLAY_STYLES } from "@/constants/consts";
import { renderWithSettings } from "@/test/test-utils";
import { describe, expect, it } from "vitest";
import Timer from "./Timer";

const seconds = SECONDS_PER_MINUTE + 30;
const totalSeconds = SECONDS_PER_MINUTE * 2 + 30;

describe("Timer", () => {
  it("renders minimal timer display when settings specify minimal style", () => {
    const { container } = renderWithSettings(
      <Timer seconds={seconds} totalSeconds={totalSeconds} isRunning={true} />,
      {
        settings: {
          durations: { pomodoro: 1500, shortBreak: 300, longBreak: 900 },
          isNotificationEnabled: false,
          isSoundEnabled: true,
          timerDisplayStyle: TIMER_DISPLAY_STYLES.MINIMAL,
        },
      },
    );

    expect(container.firstChild?.textContent?.replaceAll(/\s+/g, "")).toBe("01:30");
  });

  it("renders ring timer display and applies correct stroke offset", () => {
    const { container } = renderWithSettings(
      <Timer seconds={seconds} totalSeconds={totalSeconds} isRunning={true} />,
      {
        settings: {
          durations: { pomodoro: 1500, shortBreak: 300, longBreak: 900 },
          isNotificationEnabled: false,
          isSoundEnabled: true,
          timerDisplayStyle: TIMER_DISPLAY_STYLES.RING,
        },
      },
    );

    expect(container.firstChild?.textContent?.replaceAll(/\s+/g, "")).toBe("01:30");
    const progressCircle = container.querySelector("circle[stroke-dashoffset]");

    expect(progressCircle).toBeInTheDocument();
    expect(progressCircle).toHaveAttribute("stroke-dasharray");
    expect(Number.parseFloat(progressCircle?.getAttribute("stroke-dashoffset") ?? "")).toBeCloseTo(
      2 * Math.PI * 120 * (1 - seconds / totalSeconds),
      3,
    );
  });
});
