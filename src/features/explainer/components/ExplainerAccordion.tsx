/**
 * Explainer Accordion — 애니메이션 아코디언 섹션.
 * Animated accordion with progressive disclosure for explainer sections.
 */
import { useState, useId, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/cn";

interface ExplainerAccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function ExplainerAccordion({ title, children, defaultOpen = false, className }: ExplainerAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const contentId = `${id}-content`;
  const triggerId = `${id}-trigger`;

  return (
    <div data-label="explainer.accordion" className={cn("rounded-xl border glass-panel overflow-hidden", className)}>
      <button
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left min-h-[48px] hover:bg-white/[0.03] transition-colors"
      >
        <span className="text-[15px] font-medium text-ink">{title}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          viewBox="0 0 16 16"
          className="size-3.5 shrink-0 text-ink-muted/50"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-base leading-[1.75] text-ink/85">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
