// client/src/pages/NotFoundPage.tsx

import { Link } from "react-router-dom";

import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { useDocumentTitle } from "../hooks/use-document-title";

export default function NotFoundPage() {
  useDocumentTitle("Page Not Found");

  return (
    <PageContainer>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-sm font-medium text-primary">404</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>

        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link to="/" className="mt-6">
          <Button>Return to dashboard</Button>
        </Link>
      </div>
    </PageContainer>
  );
}
