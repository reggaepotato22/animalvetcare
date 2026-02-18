import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Package,
  UserCog,
  UserCheck,
  BarChart,
  Heart,
  ChevronLeft,
  ChevronRight,
  Hospital,
  Pill,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Patients",
    href: "/patients",
    icon: Heart,
  },
  {
    name: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    name: "Clinical Records",
    href: "/records",
    icon: FileText,
  },
  {
    name: "Labs",
    href: "/labs",
    icon: Package,
  },
  {
    name: "Post-Mortem",
    href: "/postmortem",
    icon: FileText,
  },
  {
    name: "Hospitalization",
    href: "/hospitalization",
    icon: Hospital,
  },
  {
    name: "Treatments",
    href: "/treatments",
    icon: Pill,
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Warehouse,
  },
  {
    name: "Staff",
    href: "/staff",
    icon: UserCog,
  },
  {
    name: "Users",
    href: "/users",
    icon: UserCheck,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart,
  },
];

export function Navigation() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "hidden md:flex md:flex-col h-[calc(100vh-2rem)] my-4 ml-4 bg-sidebar text-sidebar-foreground border border-sidebar-border/80 shadow-lg shadow-black/5 transition-all duration-300 rounded-3xl",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="px-4 py-3 border-b border-sidebar-border/60">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-sidebar-primary rounded-2xl flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight">VetCare Pro</span>
                <span className="text-[11px] text-sidebar-foreground/60">
                  Modern Veterinary Suite
                </span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 py-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 text-sm font-medium transition-colors relative",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border-r-2 border-sidebar-ring"
                  : "text-sidebar-foreground/80",
                collapsed && "justify-center px-2"
              )
            }
          >
            <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
