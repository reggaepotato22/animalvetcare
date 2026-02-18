import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generatePatientId } from "@/lib/utils";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagInput } from "@/components/ui/tag-input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SteppedProgress } from "@/components/SteppedProgress";

const patientSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string().min(1, "Breed is required"),
  age: z.string().min(1, "Age is required"),
  weight: z.string().min(1, "Weight is required"),
  gender: z.string().min(1, "Gender is required"),
  color: z.string().min(1, "Color is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  ownerPhone: z.string().min(1, "Owner phone is required"),
  ownerEmail: z.string().email("Valid email is required"),
  ownerAddress: z.string().min(1, "Owner address is required"),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
  emergencyPhone: z.string().min(1, "Emergency phone is required"),
  medicalHistory: z.string().optional(),
  surgeries: z.string().optional(),
  chronicConditions: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  vaccinations: z.array(z.string()).default([]),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function AddPatient() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientId] = useState(() => generatePatientId());
  const [currentStep, setCurrentStep] = useState(0);
  const contentTopRef = useRef<HTMLDivElement | null>(null);

  const steps = [
    "Owner Information",
    "Pet Details",
    "Medical History",
    "Confirmation",
  ] as const;

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      age: "",
      weight: "",
      gender: "",
      color: "",
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      ownerAddress: "",
      emergencyContact: "",
      emergencyPhone: "",
      medicalHistory: "",
      surgeries: "",
      chronicConditions: "",
      allergies: [],
      medications: [],
      vaccinations: [],
    },
  });

  const watched = form.watch();

  const isOwnerStepComplete =
    !!watched.ownerName &&
    !!watched.ownerPhone &&
    !!watched.ownerEmail &&
    !!watched.ownerAddress &&
    !!watched.emergencyContact &&
    !!watched.emergencyPhone;

  const isPetStepComplete =
    !!watched.name &&
    !!watched.species &&
    !!watched.breed &&
    !!watched.age &&
    !!watched.weight &&
    !!watched.gender &&
    !!watched.color;

  const isMedicalStepComplete = true;

  const isCurrentStepComplete =
    currentStep === 0
      ? isOwnerStepComplete
      : currentStep === 1
      ? isPetStepComplete
      : currentStep === 2
      ? isMedicalStepComplete
      : true;

  const handleNext = async () => {
    const fieldsToValidate =
      currentStep === 0
        ? [
            "ownerName",
            "ownerPhone",
            "ownerEmail",
            "ownerAddress",
            "emergencyContact",
            "emergencyPhone",
          ]
        : currentStep === 1
        ? ["name", "species", "breed", "age", "weight", "gender", "color"]
        : currentStep === 2
        ? []
        : [];

    if (fieldsToValidate.length > 0) {
      const valid = await form.trigger(fieldsToValidate as (keyof PatientFormData)[], {
        shouldFocus: true,
      });
      if (!valid) return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));

    if (contentTopRef.current) {
      contentTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Patient data:", { ...data, patientId });
    
    toast({
      title: "Patient Added Successfully",
      description: `${data.name} has been added with ID: ${patientId}`,
    });
    
    setIsSubmitting(false);
    navigate("/patients");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/patients")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Patient</h1>
          <p className="text-muted-foreground">
            Add a new animal patient to the system
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SteppedProgress steps={steps as unknown as string[]} currentStep={currentStep} />

          <div ref={contentTopRef} className="space-y-6 scroll-mt-20">
          {/* Patient ID Display */}
          <Card className="bg-muted/50 border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Patient Identification Number</p>
                  <p className="text-2xl font-bold font-mono text-primary">{patientId}</p>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">Auto-Generated</Badge>
              </div>
            </CardContent>
          </Card>

          {currentStep === 0 && (
            <Card>
              <CardHeader className="scroll-mt-20">
                <CardTitle>Owner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter owner name" {...field} />
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="owner@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter full address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 987-6543" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 1 && (
            <Card>
              <CardHeader className="scroll-mt-20">
                <CardTitle>Pet Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pet name" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select species" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="bird">Bird</SelectItem>
                          <SelectItem value="rabbit">Rabbit</SelectItem>
                          <SelectItem value="hamster">Hamster</SelectItem>
                          <SelectItem value="reptile">Reptile</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breed</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter breed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 3 years" {...field} />
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
                          <Input placeholder="e.g., 28kg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter color" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader className="scroll-mt-20">
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="medicalHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical History</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any relevant medical history..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="surgeries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surgeries</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter previous surgeries" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="chronicConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chronic Conditions</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter chronic conditions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                          <TagInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Add allergies (e.g., peanuts, dust)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Medications</FormLabel>
                        <FormControl>
                          <TagInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Add medications (e.g., aspirin, insulin)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vaccinations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vaccinations</FormLabel>
                        <FormControl>
                          <TagInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Add vaccinations (e.g., rabies, DHPP)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader className="scroll-mt-20">
                <CardTitle>Review & Confirm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground">
                  Review the owner, pet, and medical details before creating this patient record.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 rounded-2xl border border-slate-100 bg-white p-4">
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                      Owner
                    </h3>
                    <p className="font-medium">{watched.ownerName || "—"}</p>
                    <p className="text-muted-foreground">
                      {watched.ownerPhone || "No phone provided"}
                    </p>
                    <p className="text-muted-foreground">
                      {watched.ownerEmail || "No email provided"}
                    </p>
                    <p className="text-muted-foreground">
                      {watched.ownerAddress || "No address provided"}
                    </p>
                  </div>
                  <div className="space-y-2 rounded-2xl border border-slate-100 bg-white p-4">
                    <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                      Pet
                    </h3>
                    <p className="font-medium">
                      {watched.name || "Unnamed pet"}
                    </p>
                    <p className="text-muted-foreground">
                      {watched.species || "Species not set"} ·{" "}
                      {watched.breed || "Breed not set"}
                    </p>
                    <p className="text-muted-foreground">
                      {watched.age || "Age not set"} ·{" "}
                      {watched.weight || "Weight not set"}
                    </p>
                    <p className="text-muted-foreground">
                      {watched.color || "Color not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/patients")}
            >
              Cancel
            </Button>
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isCurrentStepComplete}
                >
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Adding Patient..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Add Patient
                    </>
                  )}
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
