// client/src/components/feedback/ErrorBoundaryFallback.tsx

import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "../ui/button";

interface ErrorBoundaryFallbackProps {
  error: Error | null;
  onReset: () => void;
}

export function ErrorBoundaryFallback({ error, onReset }: ErrorBoundaryFallbackProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div
        role="alert"
        className="w-full max-w-lg rounded-xl border border-border bg-card p-8 text-center shadow-sm"
      >
        <AlertTriangle className="mx-auto h-10 w-10 text-warning" />

        <h1 className="mt-5 text-xl font-semibold">We couldn't display this page</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected application error occurred. Please try again.
        </p>

        {import.meta.env.DEV && error ? (
          <pre className="mt-5 max-h-40 overflow-auto rounded-md bg-muted p-3 text-left text-xs">
            {error.message}
          </pre>
        ) : null}

        <Button type="button" className="mt-6" onClick={onReset}>
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </main>
  );
}
