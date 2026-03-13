import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    return (
      <div>
        {label && (
          <label data-label="shared.input.label" htmlFor={inputId} className="mb-1 block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          data-label="shared.input.field"
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            "w-full rounded-lg border bg-white/5 px-3 py-2.5 text-base text-ink shadow-inner placeholder:text-ink-muted focus:border-white/25 focus:outline-none focus:shadow-glow-brand min-h-[44px]",
            error && "border-danger focus:border-danger",
            className,
          )}
          {...props}
        />
        {error && <p id={errorId} data-label="shared.input.error" role="alert" className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  },
);
