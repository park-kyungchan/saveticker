/**
 * Animated list wrapper — staggers children on mount with spring animation.
 * 애니메이션 리스트 래퍼 — 마운트 시 자식 요소를 순차적으로 스프링 애니메이션.
 */
import { type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AnimatedListProps {
  children: ReactNode[];
  /** Delay between each child animation in ms / 자식 애니메이션 사이의 지연 시간(ms) */
  staggerDelay?: number;
  /** Additional CSS classes / 추가 CSS 클래스 */
  className?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  }),
};

export function AnimatedList({
  children,
  staggerDelay = 50,
  className,
}: AnimatedListProps) {
  return (
    <AnimatePresence mode="popLayout">
      <div className={className}>
        {children.map((child, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            variants={{
              ...itemVariants,
              visible: (idx: number) => ({
                opacity: 1,
                y: 0,
                transition: {
                  delay: idx * (staggerDelay / 1000),
                  type: "spring",
                  stiffness: 300,
                  damping: 24,
                },
              }),
            }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
