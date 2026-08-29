// client/src/components/navigation/Header.tsx

import { Bell, Menu, UserCircle } from "lucide-react";

import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuItem } from "../ui/dropdown-menu";

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export function Header({ onMobileMenuOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
          onClick={onMobileMenuOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="lg:hidden">
          <p className="text-sm font-semibold">ACME Salary Management</p>
        </div>

        <div className="hidden lg:block">
          <p className="text-sm text-muted-foreground">Compensation workspace</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu
          trigger={
            <Button type="button" variant="ghost" size="icon" aria-label="Open account menu">
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
