/**
 * Swipeable row — swipe-left to reveal action (e.g., delete).
 * 스와이프 가능한 행 — 왼쪽 스와이프로 액션 표시.
 */
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { haptic } from "../../lib/haptics";

interface SwipeableRowProps {
  children: ReactNode;
  /** Action to call when swipe threshold is reached / 스와이프 임계값에 도달 시 호출할 액션 */
  onSwipeAction: () => void;
  /** Label for the revealed action button / 표시되는 액션 버튼의 라벨 */
  actionLabel?: string;
  /** Whether to show a confirm dialog before action / 액션 전 확인 대화 상자 표시 여부 */
  confirmRequired?: boolean;
  /** Haptic feedback style on swipe / 스와이프 시 햅틱 피드백 스타일 */
  hapticStyle?: "light" | "medium" | "heavy";
}

const SWIPE_THRESHOLD = -80;

export function SwipeableRow({
  children,
  onSwipeAction,
  actionLabel = "삭제",
  confirmRequired = false,
  hapticStyle = "medium",
}: SwipeableRowProps) {
  const x = useMotionValue(0);
  const actionOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const triggered = useRef(false);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < SWIPE_THRESHOLD) {
      if (confirmRequired) {
        const confirmed = window.confirm(`${actionLabel}하시겠습니까?`);
        if (!confirmed) return;
      }
      haptic(hapticStyle);
      onSwipeAction();
      triggered.current = true;
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Action revealed behind */}
      <motion.div
        className="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-xl bg-danger px-6"
        style={{ opacity: actionOpacity }}
      >
        <span className="text-sm font-medium text-white">{actionLabel}</span>
      </motion.div>

      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: SWIPE_THRESHOLD, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative z-10 touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  );
}
