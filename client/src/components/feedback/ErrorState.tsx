// client/src/components/feedback/ErrorState.tsx

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "../ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this information. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center"
    >
      <AlertCircle className="mx-auto h-8 w-8 text-destructive" />

      <h2 className="mt-4 text-base font-semibold">{title}</h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{message}</p>

      {onRetry ? (
        <Button type="button" variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
