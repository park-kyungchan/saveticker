import { type SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = error && selectId ? `${selectId}-error` : undefined;
    return (
      <div>
        {label && (
          <label data-label="shared.select.label" htmlFor={selectId} className="mb-1 block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <select
          data-label="shared.select.field"
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            "w-full rounded-lg border bg-white/5 px-3 py-2.5 text-base text-ink shadow-inner placeholder:text-ink-muted focus:border-white/25 focus:outline-none focus:shadow-glow-brand min-h-[44px]",
            error && "border-danger",
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p id={errorId} data-label="shared.select.error" role="alert" className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  },
);
