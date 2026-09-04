// client/src/components/navigation/MobileNavigation.tsx

import { useEffect, useRef } from 'react';
import { Building2, X } from 'lucide-react';

import { Button } from '../ui/button';
import { NavigationItem } from './NavigationItem';
import { navigationItems } from './navigation';

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNavigation({ open, onClose }: MobileNavigationProps) {
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const firstFocusableElement =
      navigationRef.current?.querySelector<HTMLElement>('button, a[href]');

    firstFocusableElement?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close navigation"
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        ref={navigationRef}
        className={[
          'relative flex h-full w-80 max-w-[88vw] flex-col',
          'border-r border-border bg-card shadow-2xl',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"
            >
              <Building2 className="h-5 w-5" strokeWidth={1.9} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-foreground">ACME</p>

              <p className="truncate text-xs text-muted-foreground">Salary Management</p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close navigation"
            onClick={onClose}
            className="shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.to}
                label={item.label}
                description={item.description}
                to={item.to}
                icon={item.icon}
                onNavigate={onClose}
              />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-border p-4">
          <div className="rounded-lg bg-muted/50 px-3 py-3">
            <p className="text-xs font-medium text-foreground">Internal HR Platform</p>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Compensation workspace
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}