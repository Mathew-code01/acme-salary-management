// client/src/components/ui/dialog.tsx

import { useEffect, useRef, type ReactNode } from "react";

import { X } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="dialog-title"
      aria-describedby={description ? "dialog-description" : undefined}
      onCancel={() => onOpenChange(false)}
      onClose={() => onOpenChange(false)}
      className={cn(
        "w-[calc(100%-2rem)] max-w-lg rounded-xl border",
        "border-border bg-background p-0 text-foreground shadow-2xl",
        "backdrop:bg-black/40",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border p-6">
        <div>
          <h2 id="dialog-title" className="text-lg font-semibold">
            {title}
          </h2>

          {description ? (
            <p id="dialog-description" className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close dialog"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-6">{children}</div>
    </dialog>
  );
}
