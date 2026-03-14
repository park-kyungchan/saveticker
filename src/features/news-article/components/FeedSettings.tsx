/**
 * 피드 맞춤 설정 모달 — 태그 프리셋 + 키워드 추가/제거.
 * Feed customization modal — tag presets + keyword add/remove.
 */
import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/cn";
import { recipes } from "../../../theme/recipes";
import { useFeedStore } from "../../../stores/feedStore";

/** Semantic tag presets with color tokens (migrated from TagFilterStrip) */
const TAG_PRESETS: { label: string; color: string; activeColor: string }[] = [
  { label: "에너지",   color: "bg-accent-4/12 text-accent-4/70",  activeColor: "bg-accent-4/25 text-accent-4 border-accent-4/40" },
  { label: "지정학",   color: "bg-danger/12 text-danger/70",      activeColor: "bg-danger/25 text-danger border-danger/40" },
  { label: "사모신용", color: "bg-accent-5/12 text-accent-5/70",  activeColor: "bg-accent-5/25 text-accent-5 border-accent-5/40" },
  { label: "기업분석", color: "bg-info/12 text-info/70",          activeColor: "bg-info/25 text-info border-info/40" },
  { label: "경제지표", color: "bg-accent-3/12 text-accent-3/70",  activeColor: "bg-accent-3/25 text-accent-3 border-accent-3/40" },
  { label: "헤드라인", color: "bg-accent-2/12 text-accent-2/70",  activeColor: "bg-accent-2/25 text-accent-2 border-accent-2/40" },
  { label: "암호화폐", color: "bg-warning/12 text-warning/70",    activeColor: "bg-warning/25 text-warning border-warning/40" },
];

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

  const toggleTag = (tag: string) => {
    if (keywords.includes(tag)) removeKeyword(tag);
    else addKeyword(tag);
  };

  return createPortal(
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
            aria-label="맞춤 피드 설정"
            aria-modal="true"
            className={cn(recipes.card.base, "glass-panel relative w-full max-w-md space-y-4 rounded-t-2xl rounded-b-none p-5")}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-ink">맞춤 피드 설정</h2>
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

            {/* Tag presets */}
            <div data-label="feedSettings.tags" className="space-y-2">
              <p data-label="feedSettings.tags.label" className="text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted/50">관심 태그</p>
              <div className="flex flex-wrap gap-1.5">
                {TAG_PRESETS.map((tag) => {
                  const isActive = keywords.includes(tag.label);
                  return (
                    <button
                      key={tag.label}
                      type="button"
                      data-label={`feedSettings.tags.${tag.label}`}
                      aria-pressed={isActive}
                      onClick={() => toggleTag(tag.label)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-[12px] font-medium transition-all min-h-[36px]",
                        isActive
                          ? tag.activeColor
                          : cn(tag.color, "border-transparent"),
                      )}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom keyword input */}
            <div data-label="feedSettings.customInput" className="space-y-2">
              <p data-label="feedSettings.customInput.label" className="text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted/50">직접 입력</p>
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
            </div>

            {/* Active keyword list */}
            {keywords.length > 0 && (
              <div data-label="feedSettings.active" className="space-y-2">
                <p data-label="feedSettings.active.label" className="text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted/50">
                  활성 필터 · {keywords.length}개
                </p>
                <ul data-label="feedSettings.keywords" className="flex flex-wrap gap-1.5">
                  {keywords.map((kw) => {
                    const preset = TAG_PRESETS.find((t) => t.label === kw);
                    return (
                      <li
                        key={kw}
                        className={cn(
                          "flex items-center gap-1 rounded-full border px-3 py-1 text-[12px] font-medium",
                          preset ? preset.activeColor : "border-white/10 bg-white/5 text-ink",
                        )}
                      >
                        {kw}
                        <button
                          type="button"
                          aria-label={`${kw} 삭제`}
                          onClick={() => removeKeyword(kw)}
                          className="ml-0.5 text-ink-muted hover:text-danger min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
                        >
                          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {keywords.length === 0 && (
              <p data-label="feedSettings.empty" className="text-xs text-ink-muted/50 text-center py-2">태그를 선택하거나 키워드를 입력하면 맞춤 피드가 구성됩니다.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
