// client/src/components/layout/AppShell.tsx
import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { ContentArea } from './ContentArea';
import { Header } from '../navigation/Header';
import { MobileNavigation } from '../navigation/MobileNavigation';
import { Sidebar } from '../navigation/Sidebar';

export function AppShell() {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  const openMobileNavigation = useCallback(() => {
    setMobileNavigationOpen(true);
  }, []);

  const closeMobileNavigation = useCallback(() => {
    setMobileNavigationOpen(false);
  }, []);

  useEffect(() => {
    if (!mobileNavigationOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileNavigation();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileNavigationOpen, closeMobileNavigation]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMobileMenuOpen={openMobileNavigation} />

        <ContentArea>
          <Outlet />
        </ContentArea>
      </div>

      <MobileNavigation open={mobileNavigationOpen} onClose={closeMobileNavigation} />
    </div>
  );
}