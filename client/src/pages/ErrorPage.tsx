// client/src/pages/ErrorPage.tsx

import { Link, useRouteError } from "react-router-dom";

import { PageContainer } from "../components/layout/PageContainer";
import { ErrorState } from "../components/feedback/ErrorState";
import { Button } from "../components/ui/button";
import { logger } from "../lib/logger";

export default function ErrorPage() {
  const error = useRouteError();

  const message =
    error instanceof Error
      ? error.message
      : "An unexpected routing error occurred.";

  logger.error(
    "Router error",
    error,
  );

  return (
    <PageContainer>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-lg">
          <ErrorState
            title="Unable to load this page"
            message={
              import.meta.env.DEV
                ? message
                : "An unexpected error occurred while loading this page."
            }
          />

          <div className="mt-4 text-center">
            <Link to="/">
              <Button variant="outline">
                Return to dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}