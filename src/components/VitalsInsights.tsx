import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

const heartRateData = [
  { time: "9:00", value: 82 },
  { time: "10:00", value: 88 },
  { time: "11:00", value: 90 },
  { time: "12:00", value: 86 },
  { time: "13:00", value: 84 },
];

const temperatureData = [
  { time: "Mon", value: 38.5 },
  { time: "Tue", value: 38.7 },
  { time: "Wed", value: 38.4 },
  { time: "Thu", value: 38.6 },
  { time: "Fri", value: 38.5 },
];

const respiratoryData = [
  { time: "9:00", value: 18 },
  { time: "10:00", value: 20 },
  { time: "11:00", value: 19 },
  { time: "12:00", value: 21 },
  { time: "13:00", value: 20 },
];

export function VitalsInsights() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-slate-100 bg-white shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span>Average Heart Rate</span>
            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
              Stable
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">86</span>
            <span className="text-xs text-muted-foreground">bpm today</span>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateData}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <RechartsTooltip
                  cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1 }}
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-100 bg-white shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span>Body Temperature</span>
            <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">
              Within range
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">38.5</span>
            <span className="text-xs text-muted-foreground">°C average</span>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <XAxis dataKey="time" hide />
                <YAxis domain={[38.3, 38.9]} hide />
                <RechartsTooltip
                  cursor={{ stroke: "hsl(var(--secondary))", strokeWidth: 1 }}
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-100 bg-white shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span>Respiratory Rate</span>
            <Badge className="bg-sky-50 text-sky-700 hover:bg-sky-50">
              Monitoring
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">20</span>
            <span className="text-xs text-muted-foreground">
              breaths/min average
            </span>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={respiratoryData}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <RechartsTooltip
                  cursor={{ stroke: "hsl(var(--accent))", strokeWidth: 1 }}
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

