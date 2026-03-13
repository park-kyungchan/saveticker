import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";

interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

export function FormActions({ submitLabel = "저장", cancelLabel = "취소", onCancel, loading, className }: FormActionsProps) {
  return (
    <div data-label="shared.formActions" className={cn("flex justify-end gap-3 pt-4", className)}>
      {onCancel && (
        <Button type="button" variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "저장 중..." : submitLabel}
      </Button>
    </div>
  );
}
