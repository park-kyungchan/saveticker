import { type ReactNode, useId } from "react";
import { cn } from "../../lib/cn";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  /** HTML id for the controlled input — links label via htmlFor */
  htmlFor?: string;
}

export function FormField({ label, error, required, children, className, htmlFor }: FormFieldProps) {
  const autoId = useId();
  const fieldId = htmlFor ?? autoId;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div data-label="shared.formField" className={cn("space-y-1", className)}>
      <label
        data-label="shared.formField.label"
        htmlFor={fieldId}
        className="block text-sm font-medium text-ink"
      >
        {label}
        {required && <span className="text-danger" aria-hidden="true"> *</span>}
        {required && <span className="sr-only"> (필수)</span>}
      </label>
      {children}
      {error && (
        <p
          id={errorId}
          data-label="shared.formField.error"
          role="alert"
          className="text-sm text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}
