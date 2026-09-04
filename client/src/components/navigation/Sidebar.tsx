// client/src/components/navigation/Sidebar.tsx

import { Building2 } from 'lucide-react';

import { NavigationItem } from './NavigationItem';
import { navigationItems } from './navigation';

export function Sidebar() {
  return (
    <aside
      aria-label="Primary sidebar"
      className={[
        'hidden w-64 shrink-0 border-r border-border bg-card',
        'lg:flex lg:flex-col',
      ].join(' ')}
    >
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            aria-hidden="true"
            className={[
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
              'bg-primary text-primary-foreground',
              'shadow-sm',
            ].join(' ')}
          >
            <Building2 className="h-5 w-5" strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-foreground">ACME</p>

            <p className="truncate text-xs text-muted-foreground">Salary Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.to}
              label={item.label}
              description={item.description}
              to={item.to}
              icon={item.icon}
            />
          ))}
        </div>
      </nav>

      {/* Workspace information */}
      <div className="shrink-0 border-t border-border p-4">
        <div className="rounded-lg bg-muted/50 px-3 py-3">
          <p className="text-xs font-medium text-foreground">Internal HR Platform</p>

          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Compensation workspace
          </p>
        </div>
      </div>
    </aside>
  );
}