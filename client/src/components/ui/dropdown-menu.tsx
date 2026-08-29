// client/src/components/ui/dropdown-menu.tsx

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "../../lib/utils";

interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function DropdownMenu({ trigger, children, align = "right", className }: DropdownMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        containerRef.current?.querySelector("details")?.removeAttribute("open");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <details className="group">
        <summary className="list-none cursor-pointer">{trigger}</summary>

        <div
          className={cn(
            "absolute z-50 mt-2 min-w-48 rounded-lg border",
            "border-border bg-popover p-1 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      </details>
    </div>
  );
}

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export function DropdownMenuItem({
  children,
  onClick,
  destructive = false,
  disabled = false,
}: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-md px-3 py-2",
        "text-left text-sm transition-colors",
        "hover:bg-muted",
        "disabled:pointer-events-none disabled:opacity-50",
        destructive ? "text-destructive" : "text-foreground",
      )}
    >
      {children}
    </button>
  );
}
