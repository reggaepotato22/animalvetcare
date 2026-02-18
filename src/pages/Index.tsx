import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, AlertCircle, Clock, Users, Info, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, subMinutes, subHours, subDays, subSeconds } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { DashboardStats } from "@/components/DashboardStats";

const Index = () => {
  const navigate = useNavigate();
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [checklist, setChecklist] = useState({
    patient: false,
    appointment: false,
    record: false,
    labs: false,
  });
  
  // Mock data for recent activities
  const recentAppointments = [
    { id: "1", patient: "Max", owner: "Sarah Johnson", time: "9:00 AM", type: "Checkup" },
    { id: "2", patient: "Whiskers", owner: "Michael Chen", time: "10:30 AM", type: "Vaccination" },
    { id: "3", patient: "Luna", owner: "Emily Rodriguez", time: "2:00 PM", type: "Surgery" },
  ];

  // All alerts (including the ones shown in dashboard)
  const allAlerts = [
    { 
      id: 1, 
      message: "Rocky needs immediate attention", 
      type: "critical",
      timestamp: subMinutes(new Date(), 5) // 5 minutes ago
    },
    { 
      id: 2, 
      message: "Inventory low: Heartworm medication", 
      type: "warning",
      timestamp: subHours(new Date(), 2) // 2 hours ago
    },
    { 
      id: 3, 
      message: "Staff meeting scheduled for 3 PM", 
      type: "info",
      timestamp: subDays(new Date(), 1) // 1 day ago
    },
    { 
      id: 4, 
      message: "Patient Max - Lab results ready for review", 
      type: "info",
      timestamp: subMinutes(new Date(), 15) // 15 minutes ago
    },
    { 
      id: 5, 
      message: "Vaccination due: Luna (Rabies)", 
      type: "warning",
      timestamp: subHours(new Date(), 4) // 4 hours ago
    },
    { 
      id: 6, 
      message: "Emergency case arrived - Dr. Johnson requested", 
      type: "critical",
      timestamp: subSeconds(new Date(), 30) // 30 seconds ago
    },
    { 
      id: 7, 
      message: "Prescription refill requested: Buddy", 
      type: "info",
      timestamp: subHours(new Date(), 1) // 1 hour ago
    },
    { 
      id: 8, 
      message: "Equipment maintenance due: X-ray machine", 
      type: "warning",
      timestamp: subDays(new Date(), 2) // 2 days ago
    },
    { 
      id: 9, 
      message: "Follow-up appointment reminder: Charlie", 
      type: "info",
      timestamp: subHours(new Date(), 6) // 6 hours ago
    },
  ];

  const alerts = allAlerts.slice(0, 3);

  useEffect(() => {
    const storedChecklist = localStorage.getItem("vetcare_onboarding_checklist");
    if (storedChecklist) {
      try {
        const parsed = JSON.parse(storedChecklist);
        setChecklist({
          patient: Boolean(parsed.patient),
          appointment: Boolean(parsed.appointment),
          record: Boolean(parsed.record),
          labs: Boolean(parsed.labs),
        });
      } catch {
      }
    }
    const timeout = setTimeout(() => setIsStatsLoading(false), 400);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    localStorage.setItem("vetcare_onboarding_checklist", JSON.stringify(checklist));
  }, [checklist]);

  const checklistItems = [
    { key: "patient", label: "Add your first patient" },
    { key: "appointment", label: "Book an appointment" },
    { key: "record", label: "Create a clinical record" },
    { key: "labs", label: "Order a lab test" },
  ] as const;

  const completedCount = checklistItems.filter((item) => checklist[item.key]).length;
  const totalSteps = checklistItems.length;
  const progressValue = (completedCount / totalSteps) * 100;

  return (
    <div className="space-y-6 animate-in fade-in-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Welcome back! Here's what's happening at your veterinary clinic today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      <Alert className="border-primary/30 bg-primary/5 backdrop-blur-sm">
        <Info className="h-4 w-4" />
        <AlertTitle>New to VetCare Pro?</AlertTitle>
        <AlertDescription>
          Start by adding your first patient, booking an appointment, and creating a visit record.
          You can always return here to see today's schedule, alerts, and quick links.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {isStatsLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <DashboardStats />
        )}
      </div>

      <Card className="transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Getting started checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={progressValue} />
            <p className="text-xs text-muted-foreground">
              {completedCount === totalSteps
                ? "You have completed the key setup steps. You can keep using the quick actions below."
                : `${completedCount} of ${totalSteps} steps completed`}
            </p>
            <div className="space-y-2 pt-1">
              {checklistItems.map((item) => {
                const done = checklist[item.key];
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={
                          done
                            ? "h-4 w-4 rounded-full bg-primary"
                            : "h-4 w-4 rounded-full border border-muted-foreground/40"
                        }
                      />
                      <span
                        className={
                          done ? "text-foreground" : "text-muted-foreground"
                        }
                      >
                        {item.label}
                      </span>
                    </div>
                    {done && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Quick actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Button
              className="justify-start"
              onClick={() => {
                setChecklist((prev) => ({ ...prev, patient: true }));
                navigate("/patients/add");
              }}
            >
              Add first patient
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                setChecklist((prev) => ({ ...prev, appointment: true }));
                navigate("/appointments");
              }}
            >
              Book appointment
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                setChecklist((prev) => ({ ...prev, record: true }));
                navigate("/records/new");
              }}
            >
              Create visit record
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                setChecklist((prev) => ({ ...prev, labs: true }));
                navigate("/labs");
              }}
            >
              Order lab tests
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate("/hospitalization")}
            >
              Admit patient
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  onClick={() => navigate(`/appointments/${appointment.id}`)}
                  className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">{appointment.owner}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appointment.time}</p>
                    <Badge variant="outline">{appointment.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate("/appointments")}
            >
              View All Appointments
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'critical' 
                    ? 'border-destructive bg-destructive/10' 
                    : alert.type === 'warning'
                    ? 'border-warning bg-warning/10'
                    : 'border-primary bg-primary/10'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm flex-1">{alert.message}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => setIsAlertsModalOpen(true)}
            >
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* All Alerts Modal */}
      <Dialog open={isAlertsModalOpen} onOpenChange={setIsAlertsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              All Alerts & Notifications
            </DialogTitle>
            <DialogDescription>
              View and manage all system alerts and notifications
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-3">
              {allAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No alerts available
                </div>
              ) : (
                allAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'critical' 
                        ? 'border-destructive bg-destructive/10' 
                        : alert.type === 'warning'
                        ? 'border-warning bg-warning/10'
                        : 'border-primary bg-primary/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={
                              alert.type === 'critical'
                                ? 'destructive'
                                : alert.type === 'warning'
                                ? 'default'
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {alert.type}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
