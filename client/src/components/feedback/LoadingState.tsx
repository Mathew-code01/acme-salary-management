// client/src/components/feedback/LoadingState.tsx

// client/src/components/feedback/LoadingState.tsx

import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  label?: string;
  fullPage?: boolean;
}

export function LoadingState({
  label = "Loading...",
  fullPage = false,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className={
        fullPage
          ? "flex min-h-[60vh] items-center justify-center"
          : "flex items-center justify-center py-12"
      }
    >
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2
          aria-hidden="true"
          className="h-5 w-5 animate-spin"
        />

        <span>{label}</span>
      </div>
    </div>
  );
}