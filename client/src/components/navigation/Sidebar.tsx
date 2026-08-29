// client/src/components/navigation/Sidebar.tsx

import { BarChart3, Building2, LayoutDashboard, Users } from "lucide-react";

import { NavigationItem } from "./NavigationItem";

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

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-border px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold">ACME</p>
            <p className="text-xs text-muted-foreground">Salary Management</p>
          </div>
        </div>
      </div>

      <nav aria-label="Primary navigation" className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavigationItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">Internal HR Platform</p>
      </div>
    </aside>
  );
}
