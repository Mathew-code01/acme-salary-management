// client/src/components/navigation/Header.tsx

import { Bell, Menu, UserCircle } from 'lucide-react';

import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuItem } from '../ui/dropdown-menu';

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export function Header({ onMobileMenuOpen }: HeaderProps) {
  return (
    <header
      className={[
        'sticky top-0 z-30 flex h-16 shrink-0 items-center',
        'justify-between border-b border-border',
        'bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80',
        'sm:px-6',
      ].join(' ')}
    >
      {/* Left side */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          aria-label="Open navigation"
          onClick={onMobileMenuOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile title */}
        <div className="min-w-0 lg:hidden">
          <p className="truncate text-sm font-semibold tracking-tight text-foreground">
            ACME Salary Management
          </p>

          <p className="truncate text-[11px] text-muted-foreground">Internal HR Platform</p>
        </div>

        {/* Desktop workspace label */}
        <div className="hidden min-w-0 lg:block">
          <p className="text-sm font-medium text-foreground">Compensation workspace</p>

          <p className="text-xs text-muted-foreground">Internal HR Platform</p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu
          trigger={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Open account menu"
              title="Account"
            >
              <UserCircle className="h-5 w-5" />
            </Button>
          }
        >
          <DropdownMenuItem>Account</DropdownMenuItem>

          <DropdownMenuItem>Settings</DropdownMenuItem>

          <DropdownMenuItem>Sign out</DropdownMenuItem>
        </DropdownMenu>
      </div>
    </header>
  );
}