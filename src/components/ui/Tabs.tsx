/**
 * 탭 바 컴포넌트.
 * Tab bar component for switching between content sections.
 */
import { cn } from "../../lib/cn";

interface TabItem {
  value: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIndex = (index + 1) % items.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = items.length - 1;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      onChange(items[nextIndex].value);
      const tabEl = (e.currentTarget.parentElement?.children[nextIndex] as HTMLElement);
      tabEl?.focus();
    }
  };

  return (
    <div data-label="shared.tabs" role="tablist" className={cn("flex gap-1 rounded-lg border glass-panel p-1", className)}>
      {items.map((item, index) => (
        <button
          key={item.value}
          data-label={`shared.tabs.item.${item.value}`}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          tabIndex={value === item.value ? 0 : -1}
          onClick={() => onChange(item.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={cn(
            "flex-1 rounded-md px-3 py-2.5 text-sm font-medium transition-all active:scale-[0.97] min-h-[44px]",
            value === item.value
              ? "bg-brand/80 text-white shadow-sm"
              : "text-ink-muted hover:text-ink hover:bg-white/5",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
