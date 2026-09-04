// client/src/components/navigation/NavigationItem.tsx

import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface NavigationItemProps {
  label: string;
  description?: string;
  to: string;
  icon: LucideIcon;
  onNavigate?: () => void;
}

export function NavigationItem({
  label,
  description,
  to,
  icon: Icon,
  onNavigate,
}: NavigationItemProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'group relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5',
          'text-sm font-medium outline-none transition-all duration-150',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'focus-visible:ring-offset-card',
          isActive
            ? [
                'bg-primary/10 text-primary',
                'before:absolute before:left-0 before:top-1/2 before:h-6 before:w-0.5',
                'before:-translate-y-1/2 before:rounded-full before:bg-primary',
              ].join(' ')
            : ['text-muted-foreground', 'hover:bg-muted/70 hover:text-foreground'].join(' '),
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <span
            aria-hidden="true"
            className={[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
              'transition-colors duration-150',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'bg-muted/60 text-muted-foreground group-hover:bg-background group-hover:text-foreground',
            ].join(' ')}
          >
            <Icon className="h-4 w-4" strokeWidth={1.9} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate">{label}</span>

            {description ? (
              <span
                className={[
                  'mt-0.5 block truncate text-[11px] font-normal leading-tight',
                  isActive ? 'text-primary/70' : 'text-muted-foreground/75',
                ].join(' ')}
              >
                {description}
              </span>
            ) : null}
          </span>

          <span
            aria-hidden="true"
            className={[
              'h-1.5 w-1.5 shrink-0 rounded-full transition-opacity',
              isActive ? 'bg-primary opacity-100' : 'opacity-0',
            ].join(' ')}
          />
        </>
      )}
    </NavLink>
  );
}