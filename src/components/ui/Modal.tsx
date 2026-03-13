import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "../../lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const titleId = title ? "modal-title" : undefined;

  return (
    <dialog
      data-label="shared.modal"
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-modal="true"
      className={cn("rounded-xl border p-0 shadow-lg glass-panel-heavy backdrop:bg-black/60 backdrop:backdrop-blur-sm", className)}
    >
      <div className="min-w-80 p-6">
        {title && <h2 id={titleId} data-label="shared.modal.title" className="mb-4 text-lg font-semibold">{title}</h2>}
        {children}
      </div>
    </dialog>
  );
}
