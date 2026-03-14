/**
 * 피드 키워드 설정 모달 — 키워드 추가/제거.
 * Feed keyword settings modal — add/remove keywords.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/cn";
import { recipes } from "../../../theme/recipes";
import { useFeedStore } from "../../../stores/feedStore";

interface FeedSettingsProps {
  open: boolean;
  onClose: () => void;
}

export function FeedSettings({ open, onClose }: FeedSettingsProps) {
  const { keywords, addKeyword, removeKeyword } = useFeedStore();
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed) {
      addKeyword(trimmed);
      setInput("");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-label="feedSettings.overlay"
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            data-label="feedSettings.modal"
            role="dialog"
            aria-label="피드 키워드 설정"
            aria-modal="true"
            className={cn(recipes.card.base, "glass-panel relative w-full max-w-md space-y-4 rounded-t-2xl rounded-b-none p-5")}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-ink">피드 키워드 설정</h2>
              <button
                type="button"
                data-label="feedSettings.close"
                onClick={onClose}
                className="text-ink-muted hover:text-ink min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Input row */}
            <div className="flex gap-2">
              <input
                data-label="feedSettings.input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="키워드 입력..."
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent-1/50 focus:outline-none min-h-[44px]"
              />
              <button
                type="button"
                data-label="feedSettings.add"
                onClick={handleAdd}
                className="rounded-lg bg-accent-1/20 px-4 text-sm font-medium text-accent-1 hover:bg-accent-1/30 min-h-[44px]"
              >
                추가
              </button>
            </div>

            {/* Keyword list */}
            {keywords.length > 0 ? (
              <ul data-label="feedSettings.keywords" className="flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <li key={kw} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-ink">
                    {kw}
                    <button
                      type="button"
                      aria-label={`${kw} 삭제`}
                      onClick={() => removeKeyword(kw)}
                      className="ml-1 text-ink-muted hover:text-danger min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
                    >
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-ink-muted">키워드를 추가하면 맞춤 피드로 기사를 필터링합니다.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
