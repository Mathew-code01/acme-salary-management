// client/src/components/layout/ContentArea.tsx

import type { ReactNode } from 'react';

interface ContentAreaProps {
  children: ReactNode;
}

export function ContentArea({ children }: ContentAreaProps) {
  return (
    <main
      id="main-content"
      className={['min-w-0 flex-1 overflow-x-hidden', 'bg-background'].join(' ')}
    >
      {children}
    </main>
  );
}