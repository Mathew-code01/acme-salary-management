// client/src/components/ui/tooltip.tsx

import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}

      <span
        role="tooltip"
        className="
          pointer-events-none absolute bottom-full left-1/2 z-50
          mb-2 -translate-x-1/2 whitespace-nowrap rounded-md
          bg-foreground px-2 py-1 text-xs text-background
          opacity-0 shadow-lg transition-opacity
          group-hover:opacity-100
          group-focus-within:opacity-100
        "
      >
        {content}
      </span>
    </span>
  );
}
