import {
  BarChart3,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItemConfig {
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItemConfig[] = [
  {
    label: "Dashboard",
    description: "Overview and key metrics",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Employees",
    description: "Employee directory and records",
    to: "/employees",
    icon: Users,
  },
  {
    label: "Analytics",
    description: "Compensation insights",
    to: "/analytics",
    icon: BarChart3,
  },
];