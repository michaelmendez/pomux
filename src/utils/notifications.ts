import { NOTIFICATION_ASSETS } from "@/constants/consts";
import { toAbsoluteUrl } from "@/utils/url";

export async function ensureNotificationPermission() {
  if (!("Notification" in globalThis)) {
    console.warn("Notifications not supported by this browser");
    return false;
  }

  const status = await Notification.requestPermission();
  return status === "granted";
}

export function notifySessionEnd({ title, body }: { title: string; body: string }) {
  if (!("Notification" in globalThis)) return;
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: toAbsoluteUrl(NOTIFICATION_ASSETS.ICON_PATH),
    badge: toAbsoluteUrl(NOTIFICATION_ASSETS.BADGE_PATH),
    silent: false,
  });
}

