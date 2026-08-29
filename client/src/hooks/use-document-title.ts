// client/src/hooks/use-document-title.ts

import { useEffect } from "react";

const APP_NAME = "ACME Salary Management";

export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;

    return () => {
      document.title = APP_NAME;
    };
  }, [title]);
}
