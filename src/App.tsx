import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";
import PatientDetails from "./pages/PatientDetails";
import Appointments from "./pages/Appointments";
import AppointmentDetails from "./pages/AppointmentDetails";
import Records from "./pages/Records";
import NewRecord from "./pages/NewRecord";
import ClinicalRecordDetails from "./pages/ClinicalRecordDetails";
import Staff from "./pages/Staff";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Labs from "./pages/Labs";
import AddLabResults from "./pages/AddLabResults";
import Postmortem from "./pages/Postmortem";
import NewPostMortem from "./pages/NewPostMortem";
import PostmortemDetails from "./pages/PostmortemDetails";
import Hospitalization from "./pages/Hospitalization";
import Treatments from "./pages/Treatments";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

class AppErrorBoundary extends React.Component<
  React.PropsWithChildren,
  { hasError: boolean }
> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error("AppErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground">
            Please try reloading the page or returning to the dashboard.
          </p>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = "/";
            }}
          >
            Go to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppErrorBoundary>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/patients/add" element={<AddPatient />} />
                <Route path="/patients/:id" element={<PatientDetails />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/appointments/:id" element={<AppointmentDetails />} />
                <Route path="/records" element={<Records />} />
                <Route path="/records/new" element={<NewRecord />} />
                <Route path="/records/:id" element={<ClinicalRecordDetails />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/users" element={<Users />} />
                <Route path="/labs" element={<Labs />} />
                <Route path="/labs/results/add/:orderId" element={<AddLabResults />} />
                <Route path="/postmortem" element={<Postmortem />} />
                <Route path="/postmortem/new" element={<NewPostMortem />} />
                <Route path="/postmortem/:id" element={<PostmortemDetails />} />
                <Route path="/hospitalization" element={<Hospitalization />} />
                <Route path="/treatments" element={<Treatments />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AppErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
