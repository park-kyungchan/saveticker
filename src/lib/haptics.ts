/**
 * Haptic feedback thin wrapper — @capacitor/haptics with web fallback (no-op).
 * 햅틱 피드백 래퍼 — 웹에서는 무시됨.
 */
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";

const isNative = Capacitor.isNativePlatform();

type HapticStyle = "light" | "medium" | "heavy" | "selection" | "success" | "warning" | "error" | "none";

const IMPACT_MAP: Record<string, ImpactStyle> = {
  light: ImpactStyle.Light,
  medium: ImpactStyle.Medium,
  heavy: ImpactStyle.Heavy,
};

const NOTIFICATION_MAP: Record<string, NotificationType> = {
  success: NotificationType.Success,
  warning: NotificationType.Warning,
  error: NotificationType.Error,
};

export async function haptic(style: HapticStyle): Promise<void> {
  if (!isNative || style === "none") return;

  if (style === "selection") {
    await Haptics.selectionStart();
    await Haptics.selectionEnd();
    return;
  }

  if (style in IMPACT_MAP) {
    await Haptics.impact({ style: IMPACT_MAP[style] });
    return;
  }

  if (style in NOTIFICATION_MAP) {
    await Haptics.notification({ type: NOTIFICATION_MAP[style] });
  }
}
