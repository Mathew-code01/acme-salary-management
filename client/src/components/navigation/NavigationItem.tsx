// client/src/components/navigation/NavigationItem.tsx

import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";

import { cn } from "../../lib/utils";

interface NavigationItemProps {
  label: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
  onNavigate?: () => void;
}

export function NavigationItem({ label, to, icon: Icon, onNavigate }: NavigationItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5",
          "text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )
      }
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />

      <span>{label}</span>
    </NavLink>
  );
}
