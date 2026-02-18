import { useEffect, useState } from "react";
import { Bell, Search, AlertCircle, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow, subMinutes, subHours, subSeconds } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { navigationItems } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const currentUser = {
  name: "Dr. Emily Carter",
  referenceId: "CLINIC-2045",
  role: "Lead Veterinarian",
  avatarUrl: "",
};

const notifications = [
  { 
    id: 1, 
    message: "Rocky needs immediate attention", 
    type: "critical",
    timestamp: subMinutes(new Date(), 5)
  },
  { 
    id: 2, 
    message: "Inventory low: Heartworm medication", 
    type: "warning",
    timestamp: subHours(new Date(), 2)
  },
  { 
    id: 3, 
    message: "Patient Max - Lab results ready for review", 
    type: "info",
    timestamp: subMinutes(new Date(), 15)
  },
  { 
    id: 4, 
    message: "Emergency case arrived - Dr. Johnson requested", 
    type: "critical",
    timestamp: subSeconds(new Date(), 30)
  },
  { 
    id: 5, 
    message: "Vaccination due: Luna (Rabies)", 
    type: "warning",
    timestamp: subHours(new Date(), 4)
  },
];

export function Header() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const unreadCount = notifications.filter(n => n.type === 'critical' || n.type === 'warning').length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/patients?q=${encodeURIComponent(trimmed)}`);
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-destructive bg-destructive/10';
      case 'warning':
        return 'border-warning bg-warning/10';
      default:
        return 'border-primary bg-primary/10';
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 md:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="text-left text-base">
                    Navigation
                  </DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-4 space-y-1">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={() => navigate(item.href)}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
            <h1 className="text-lg font-semibold text-primary">
              VetCare Pro
            </h1>
          </div>
          <h1 className="hidden md:block text-2xl font-bold text-primary">
            VetCare Pro
          </h1>
          <div className="relative hidden sm:block w-40 sm:w-72 lg:w-96">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search patients, appointments, or records..."
              aria-label="Search patients, appointments, or records"
              className="h-10 rounded-2xl border border-slate-200 bg-white/80 pl-11 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSearchSubmit();
                }
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Open notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
                <span className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Notifications
                </span>
                <Badge variant="secondary" className="text-xs">
                  {notifications.length}
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No notifications
                  </div>
                ) : (
                  <div className="p-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border-l-4 mb-2 cursor-pointer hover:bg-muted/50 transition-colors ${getNotificationColor(notification.type)}`}
                        onClick={() => navigate("/")}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm flex-1">{notification.message}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={
                              notification.type === 'critical'
                                ? 'destructive'
                                : notification.type === 'warning'
                                ? 'default'
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-sm"
                  onClick={() => navigate("/")}
                >
                  View All Notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-3 py-1.5 text-left shadow-sm transition-transform transition-shadow duration-150 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                  <AvatarFallback className="text-xs font-medium">
                    {currentUser.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-semibold leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground leading-tight">
                    {currentUser.referenceId}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{currentUser.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {currentUser.role}
                  </span>
                  <span className="mt-1 text-[11px] text-muted-foreground">
                    Ref: {currentUser.referenceId}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
