// client/src/components/navigation/MobileNavigation.tsx

import { BarChart3, LayoutDashboard, Users, X } from "lucide-react";

import { NavigationItem } from "./NavigationItem";
import { Button } from "../ui/button";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Employees",
    to: "/employees",
    icon: Users,
  },
  {
    label: "Analytics",
    to: "/analytics",
    icon: BarChart3,
  },
];

export function MobileNavigation({ open, onClose }: MobileNavigationProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-card shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div>
            <p className="text-sm font-semibold">ACME</p>
            <p className="text-xs text-muted-foreground">Salary Management</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav aria-label="Mobile navigation" className="space-y-1 p-4">
          {navigation.map((item) => (
            <NavigationItem key={item.to} {...item} onNavigate={onClose} />
          ))}
        </nav>
      </aside>
    </div>
  );
}
