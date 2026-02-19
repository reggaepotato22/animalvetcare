import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Search, Stethoscope, DollarSign, ArrowLeft, Calendar as CalendarIcon } from "lucide-react";

import { SteppedProgress } from "@/components/SteppedProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useWorkflow } from "@/state/workflow";

const visitSchema = z.object({
  ownerName: z.string().min(1, "Owner name is required"),
  ownerPhone: z.string().min(1, "Owner phone is required"),
  ownerEmail: z.string().email("Valid email is required"),
  petName: z.string().min(1, "Pet name is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string().min(1, "Breed is required"),
  age: z.string().min(1, "Age is required"),
  weight: z.string().min(1, "Weight is required"),
  reasonForVisit: z.string().min(1, "Reason for visit is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  treatmentPlan: z.string().min(1, "Treatment plan is required"),
  followUpDate: z.date().optional(),
});

type VisitFormData = z.infer<typeof visitSchema>;

type QuickServiceKey = "consultation" | "vaccination" | "deworming";

interface InvoiceItem {
  id: string;
  label: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const quickServices: Record<
  QuickServiceKey,
  { label: string; description: string; unitPrice: number }
> = {
  consultation: {
    label: "Consultation",
    description: "General consultation and examination",
    unitPrice: 45,
  },
  vaccination: {
    label: "Vaccination",
    description: "Core vaccine administration",
    unitPrice: 25,
  },
  deworming: {
    label: "Deworming",
    description: "Deworming treatment",
    unitPrice: 20,
  },
};

const mockPatients = [
  {
    id: "1",
    petName: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    age: "3 years",
    weight: "28kg",
    ownerName: "Sarah Johnson",
    ownerPhone: "+1 (555) 123-4567",
    ownerEmail: "sarah.johnson@email.com",
  },
  {
    id: "2",
    petName: "Whiskers",
    species: "Cat",
    breed: "Persian",
    age: "5 years",
    weight: "4.2kg",
    ownerName: "Michael Chen",
    ownerPhone: "+1 (555) 987-6543",
    ownerEmail: "michael.chen@email.com",
  },
  {
    id: "3",
    petName: "Luna",
    species: "Cat",
    breed: "Maine Coon",
    age: "2 years",
    weight: "5.1kg",
    ownerName: "Emily Rodriguez",
    ownerPhone: "+1 (555) 456-7890",
    ownerEmail: "emily.rodriguez@email.com",
  },
];

const ACTIVE_VISIT_STORAGE_KEY = "activeVisitDraft";

export default function ActiveVisit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isExpressMode } = useWorkflow();

  const [currentStep, setCurrentStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const contentTopRef = useRef<HTMLDivElement | null>(null);

  const steps = ["Check-in", "Clinical Notes", "Billing & Checkout"] as const;

  const form = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    mode: "onChange",
    defaultValues: {
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      petName: "",
      species: "",
      breed: "",
      age: "",
      weight: "",
      reasonForVisit: "",
      diagnosis: "",
      treatmentPlan: "",
      followUpDate: undefined,
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem(ACTIVE_VISIT_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          form: Partial<VisitFormData> & { followUpDate?: string | null };
          invoiceItems: InvoiceItem[];
          currentStep: number;
        };
        if (parsed.form) {
          const followUpDate =
            parsed.form.followUpDate && typeof parsed.form.followUpDate === "string"
              ? new Date(parsed.form.followUpDate)
              : undefined;
          form.reset({
            ...form.getValues(),
            ...parsed.form,
            followUpDate,
          });
        }
        if (parsed.invoiceItems) {
          setInvoiceItems(parsed.invoiceItems);
        }
        if (typeof parsed.currentStep === "number") {
          setCurrentStep(parsed.currentStep);
        }
      } catch {
      }
    }
  }, []);

  const watched = form.watch();

  useEffect(() => {
    const payload = {
      form: {
        ...watched,
        followUpDate: watched.followUpDate
          ? watched.followUpDate.toISOString()
          : null,
      },
      invoiceItems,
      currentStep,
    };
    localStorage.setItem(ACTIVE_VISIT_STORAGE_KEY, JSON.stringify(payload));
  }, [watched, invoiceItems, currentStep]);

  const isCheckInComplete =
    !!watched.ownerName &&
    !!watched.ownerPhone &&
    !!watched.ownerEmail &&
    !!watched.petName &&
    !!watched.species &&
    !!watched.breed &&
    !!watched.age &&
    !!watched.weight;

  const isClinicalNotesComplete =
    !!watched.reasonForVisit &&
    !!watched.diagnosis &&
    !!watched.treatmentPlan;

  const hasInvoiceItems = invoiceItems.length > 0;

  const isCurrentStepComplete =
    currentStep === 0
      ? isCheckInComplete
      : currentStep === 1
      ? isClinicalNotesComplete
      : hasInvoiceItems;

  const handleNext = async () => {
    const fieldsToValidate =
      currentStep === 0
        ? [
            "ownerName",
            "ownerPhone",
            "ownerEmail",
            "petName",
            "species",
            "breed",
            "age",
            "weight",
          ]
        : currentStep === 1
        ? ["reasonForVisit", "diagnosis", "treatmentPlan"]
        : [];

    if (fieldsToValidate.length > 0) {
      const valid = await form.trigger(
        fieldsToValidate as (keyof VisitFormData)[],
        { shouldFocus: true },
      );
      if (!valid) {
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSelectPatient = (id: string) => {
    const patient = mockPatients.find((p) => p.id === id);
    if (!patient) return;

    form.setValue("ownerName", patient.ownerName, { shouldValidate: true });
    form.setValue("ownerPhone", patient.ownerPhone, { shouldValidate: true });
    form.setValue("ownerEmail", patient.ownerEmail, { shouldValidate: true });
    form.setValue("petName", patient.petName, { shouldValidate: true });
    form.setValue("species", patient.species, { shouldValidate: true });
    form.setValue("breed", patient.breed, { shouldValidate: true });
    form.setValue("age", patient.age, { shouldValidate: true });
    form.setValue("weight", patient.weight, { shouldValidate: true });

    toast({
      title: "Patient details loaded",
      description: `${patient.petName}'s information has been prefilled.`,
    });
  };

  const handleAddQuickService = (key: QuickServiceKey) => {
    const service = quickServices[key];
    setInvoiceItems((prev) => [
      ...prev,
      {
        id: `${key}-${Date.now()}-${prev.length}`,
        label: service.label,
        description: service.description,
        quantity: 1,
        unitPrice: service.unitPrice,
      },
    ]);
  };

  const handleUpdateInvoiceItem = (
    id: string,
    patch: Partial<Pick<InvoiceItem, "quantity" | "unitPrice" | "description">>,
  ) => {
    setInvoiceItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    );
  };

  const handleRemoveInvoiceItem = (id: string) => {
    setInvoiceItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = invoiceItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const taxRate = 0.0;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const handleFinalizeVisit = async () => {
    if (!hasInvoiceItems) return;

    const valid = await form.trigger(undefined, { shouldFocus: true });
    if (!valid) {
      return;
    }

    setIsFinalizing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast({
      title: "Visit completed",
      description: `${watched.petName} has been checked out. Total: $${total.toFixed(
        2,
      )}`,
    });

    localStorage.removeItem(ACTIVE_VISIT_STORAGE_KEY);
    setIsFinalizing(false);
    navigate("/records");
  };

  const filteredPatients = mockPatients.filter((patient) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      patient.petName.toLowerCase().includes(term) ||
      patient.ownerName.toLowerCase().includes(term) ||
      patient.breed.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Active Visit</h1>
          <p className="text-muted-foreground">
            {isExpressMode
              ? "Express mode: Complete check-in, notes, and billing in one continuous flow."
              : "Move a patient from check-in to checkout in one streamlined flow."}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {!isExpressMode && (
            <SteppedProgress
              steps={steps as unknown as string[]}
              currentStep={currentStep}
              sticky
            />
          )}

          <div ref={contentTopRef} className="space-y-6 scroll-mt-20">
            {(isExpressMode || currentStep === 0) && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
                <Card>
                  <CardHeader>
                    <CardTitle>Check-in: Owner & Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ownerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Owner Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Owner full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ownerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Owner Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ownerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Owner Email</FormLabel>
                            <FormControl>
                              <Input placeholder="owner@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="hidden md:block" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="petName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pet Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Pet name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="species"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Species</FormLabel>
                            <FormControl>
                              <Input placeholder="Dog, Cat, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="breed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Breed</FormLabel>
                            <FormControl>
                              <Input placeholder="Breed" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 3 years" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 5.2kg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Find Existing Patient
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by pet, owner, or breed..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="max-h-64 space-y-2 overflow-y-auto">
                      {filteredPatients.map((patient) => (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => handleSelectPatient(patient.id)}
                          className="flex w-full items-center justify-between rounded-md border border-border bg-card p-3 text-left text-sm transition-colors hover:bg-muted"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {patient.petName}
                              </span>
                              <Badge variant="outline">
                                {patient.species} • {patient.breed}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {patient.ownerName} • {patient.ownerPhone}
                            </p>
                          </div>
                        </button>
                      ))}
                      {filteredPatients.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          No patients match this search.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {(isExpressMode || currentStep === 1) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Clinical Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="reasonForVisit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Visit</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={2}
                            placeholder="Chief complaint or reason for today's visit"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="diagnosis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diagnosis</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Primary diagnosis and key findings"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="treatmentPlan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Treatment Plan</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Planned treatments, medications, and recommendations"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="followUpDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Follow-up Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select a follow-up date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="p-3"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {(isExpressMode || currentStep === 2) && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Billing & Quick Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Common Services</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddQuickService("consultation")}
                        >
                          Consultation · ${quickServices.consultation.unitPrice}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddQuickService("vaccination")}
                        >
                          Vaccination · ${quickServices.vaccination.unitPrice}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddQuickService("deworming")}
                        >
                          Deworming · ${quickServices.deworming.unitPrice}
                        </Button>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-md border">
                      <div className="grid grid-cols-[2fr_80px_100px_80px] items-center border-b bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
                        <span>Item</span>
                        <span className="text-right">Qty</span>
                        <span className="text-right">Unit Price</span>
                        <span className="text-right">Total</span>
                      </div>
                      <div className="divide-y">
                        {invoiceItems.map((item) => {
                          const lineTotal = item.quantity * item.unitPrice;
                          return (
                            <div
                              key={item.id}
                              className="grid grid-cols-[2fr_80px_100px_80px] items-center px-3 py-2 text-sm"
                            >
                              <div className="pr-2">
                                <Input
                                  value={item.label}
                                  onChange={(e) =>
                                    handleUpdateInvoiceItem(item.id, {
                                      description: e.target.value,
                                    })
                                  }
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <Input
                                  type="number"
                                  min={1}
                                  className="h-8 text-right"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleUpdateInvoiceItem(item.id, {
                                      quantity: Math.max(
                                        1,
                                        Number(e.target.value) || 1,
                                      ),
                                    })
                                  }
                                />
                              </div>
                              <div className="text-right">
                                <Input
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  className="h-8 text-right"
                                  value={item.unitPrice}
                                  onChange={(e) =>
                                    handleUpdateInvoiceItem(item.id, {
                                      unitPrice:
                                        Number(e.target.value) || item.unitPrice,
                                    })
                                  }
                                />
                              </div>
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-sm font-medium">
                                  ${lineTotal.toFixed(2)}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveInvoiceItem(item.id)}
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                        {invoiceItems.length === 0 && (
                          <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                            Use the common service buttons above to quickly build
                            an invoice.
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Visit Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <h3 className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                        Patient
                      </h3>
                      <p className="font-medium">
                        {watched.petName || "Pet name"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {watched.species && watched.breed
                          ? `${watched.species} • ${watched.breed}`
                          : "Species • Breed"}
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                        Owner
                      </h3>
                      <p className="font-medium">
                        {watched.ownerName || "Owner name"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {watched.ownerPhone || ""}{" "}
                        {watched.ownerEmail ? `• ${watched.ownerEmail}` : ""}
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                        Diagnosis & Recommendation
                      </h3>
                      <p className="text-sm">
                        {watched.diagnosis || "Diagnosis will appear here."}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {watched.treatmentPlan ||
                          "Treatment plan and recommendations will appear here."}
                      </p>
                      {watched.followUpDate && (
                        <p className="mt-1 text-xs font-medium">
                          Follow-up:{" "}
                          {format(watched.followUpDate, "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1 border-t pt-3 text-sm">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Tax</span>
                        <span>${taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                {isExpressMode &&
                  "Express mode: Complete all sections, then finalize the visit."}
                {!isExpressMode &&
                  currentStep === 0 &&
                  "Step 1: Confirm owner and patient details."}
                {!isExpressMode &&
                  currentStep === 1 &&
                  "Step 2: Capture diagnosis and treatment plan."}
                {!isExpressMode &&
                  currentStep === 2 &&
                  "Step 3: Build the invoice and finalize the visit."}
              </div>
              <div className="flex items-center gap-2">
                {!isExpressMode && currentStep > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                )}
                {!isExpressMode && currentStep < steps.length - 1 && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isCurrentStepComplete}
                  >
                    Next
                  </Button>
                )}
                {(isExpressMode || currentStep === steps.length - 1) && (
                  <Button
                    type="button"
                    onClick={handleFinalizeVisit}
                    disabled={!hasInvoiceItems || isFinalizing}
                  >
                    {isFinalizing ? "Finalizing..." : "Finalize Visit"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
