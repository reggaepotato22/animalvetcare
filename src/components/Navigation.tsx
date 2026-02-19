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
  Settings,
  TestTube,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkflow, WORKFLOW_STAGE_META } from "@/state/workflow";

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
  {
    name: "Workflow",
    href: "/settings/workflow",
    icon: Settings,
  },
];

export function Navigation() {
  const [collapsed, setCollapsed] = useState(false);
  const { activeStages, isExpressMode } = useWorkflow();

  const getStageIcon = (id: string) => {
    switch (id) {
      case "reception":
        return LayoutDashboard;
      case "triage":
        return Heart;
      case "laboratory":
        return TestTube;
      case "consultation":
        return Stethoscope;
      case "pharmacy":
        return Pill;
      case "billing":
        return CreditCard;
      default:
        return FileText;
    }
  };

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

        {!isExpressMode && activeStages.length > 0 && (
          <div className="mt-4 border-t border-sidebar-border/60 pt-4">
            {!collapsed && (
              <div className="px-4 pb-2 text-[11px] font-semibold uppercase text-sidebar-foreground/60">
                Visit workflow
              </div>
            )}
            {activeStages.map((stage) => {
              const meta = WORKFLOW_STAGE_META[stage.id];
              const StageIcon = getStageIcon(stage.id);
              return (
                <NavLink
                  key={stage.id}
                  to={`/visits/active?stage=${stage.id}`}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-2 text-xs font-medium transition-colors relative",
                      "hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive
                        ? "bg-sidebar-accent/70 text-sidebar-accent-foreground border-r-2 border-sidebar-ring"
                        : "text-sidebar-foreground/70",
                      collapsed && "justify-center px-2"
                    )
                  }
                >
                  <StageIcon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                  {!collapsed && <span>{meta.label}</span>}
                </NavLink>
              );
            })}
          </div>
        )}

        {isExpressMode && (
          <div className="mt-4 border-t border-sidebar-border/60 pt-4">
            {!collapsed && (
              <div className="px-4 pb-2 text-[11px] font-semibold uppercase text-sidebar-foreground/60">
                Visit workflow
              </div>
            )}
            <NavLink
              to="/visits/active"
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-2 text-xs font-medium transition-colors relative",
                  "hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-sidebar-accent/70 text-sidebar-accent-foreground border-r-2 border-sidebar-ring"
                    : "text-sidebar-foreground/70",
                  collapsed && "justify-center px-2"
                )
              }
            >
              <Stethoscope className={cn("h-4 w-4", !collapsed && "mr-2")} />
              {!collapsed && <span>Express Visit</span>}
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
