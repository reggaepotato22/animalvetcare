import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SteppedProgressProps {
  steps: string[];
  currentStep: number;
  sticky?: boolean;
}

export function SteppedProgress({ steps, currentStep, sticky = true }: SteppedProgressProps) {
  const total = steps.length;
  const progressPercent = ((currentStep + 1) / total) * 100;

  return (
    <div
      className={cn(
        "border-b border-slate-100 bg-white/80 backdrop-blur-md dark:bg-slate-900/80",
        sticky ? "sticky top-0 z-20" : "",
      )}
    >
      <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm">
      {/* Mobile: condensed */}
      <div className="flex items-center justify-between gap-2 sm:hidden">
        <p className="text-xs font-medium text-muted-foreground">
          Step {currentStep + 1} of {total}
        </p>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 sm:hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Desktop: full stepper */}
      <div className="hidden sm:flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Step {currentStep + 1} of {total}
          </span>
          <span>{steps[currentStep]}</span>
        </div>
        <div className="relative flex items-center gap-3">
          {steps.map((step, index) => {
            const status =
              index < currentStep ? "completed" : index === currentStep ? "active" : "upcoming";

            return (
              <div
                key={step}
                className="flex flex-1 items-center gap-2"
              >
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border text-xs transition-colors duration-200",
                    status === "completed" &&
                      "border-primary bg-primary text-primary-foreground",
                    status === "active" &&
                      "border-primary bg-primary/10 text-primary",
                    status === "upcoming" &&
                      "border-slate-200 bg-slate-50 text-slate-400"
                  )}
                >
                  {status === "completed" ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span
                    className={cn(
                      "truncate text-xs",
                      status === "active" && "font-semibold text-foreground",
                      status === "completed" && "text-muted-foreground",
                      status === "upcoming" && "text-slate-400"
                    )}
                  >
                    {step}
                  </span>
                </div>
                {index !== steps.length - 1 && (
                  <div className="h-px flex-1 bg-slate-200" />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      </div>
    </div>
  );
}
