// client/src/components/layout/ContentArea.tsx

import type { ReactNode } from "react";

export function ContentArea({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="min-w-0 flex-1 overflow-x-hidden bg-background">
      {children}
    </main>
  );
}
