// client/src/components/ui/input.tsx

import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", error = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={error || undefined}
      className={cn(
        "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm",
        "text-foreground placeholder:text-muted-foreground",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-destructive focus-visible:ring-destructive/25" : "border-input",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
