/**
 * Animated list wrapper — staggers children on mount with spring animation.
 * 애니메이션 리스트 래퍼 — 마운트 시 자식 요소를 순차적으로 스프링 애니메이션.
 *
 * Fix: Uses React.Key from children for stable identity instead of index.
 */
import { type ReactElement } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AnimatedListProps {
  /** Children must be elements with stable keys (not index-based) */
  children: ReactElement[];
  /** Delay between each child animation in ms / 자식 애니메이션 사이의 지연 시간(ms) */
  staggerDelay?: number;
  /** Additional CSS classes / 추가 CSS 클래스 */
  className?: string;
}

export function AnimatedList({
  children,
  staggerDelay = 50,
  className,
}: AnimatedListProps) {
  return (
    <AnimatePresence mode="popLayout">
      <div className={className}>
        {children.map((child, i) => {
          // Use child's key for stable identity — fall back to index only as last resort
          const stableKey = child.key ?? i;

          return (
            <motion.div
              key={stableKey}
              custom={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: i * (staggerDelay / 1000),
                  type: "spring",
                  stiffness: 300,
                  damping: 24,
                },
              }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            >
              {child}
            </motion.div>
          );
        })}
      </div>
    </AnimatePresence>
  );
}
