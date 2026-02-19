import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Heart } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
}

function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="max-w-[70%] text-xs font-medium leading-snug text-muted-foreground line-clamp-2">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center">
            {trend === "up" ? (
              <TrendingUp className="mr-1 h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
            )}
            <span
              className={
                trend === "up" ? "font-medium text-success" : "font-medium text-destructive"
              }
            >
              {change}
            </span>
          </div>
          <div className="text-[11px] leading-snug">
            from last week
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const stats = [
    {
      title: "Total Patients",
      value: "2,847",
      change: "+12%",
      trend: "up" as const,
      icon: Heart,
    },
    {
      title: "Today's Appointments",
      value: "24",
      change: "+8%",
      trend: "up" as const,
      icon: Calendar,
    },
    {
      title: "Weekly Revenue",
      value: "$18,420",
      change: "+15%",
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      title: "Active Staff",
      value: "12",
      change: "0%",
      trend: "up" as const,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
