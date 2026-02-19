import { useState } from "react";
import { Settings2, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  WORKFLOW_STAGE_META,
  WorkflowStageConfig,
  WorkflowStageId,
  useWorkflow,
} from "@/state/workflow";

export default function WorkflowSettings() {
  const {
    stages,
    setStages,
    toggleStageEnabled,
    resetToRecommended,
    isExpressMode,
    setExpressMode,
    requiredFields,
    updateRequiredFields,
  } = useWorkflow();

  const [draggedId, setDraggedId] = useState<WorkflowStageId | null>(null);

  const sortedStages = stages.slice().sort((a, b) => a.order - b.order);

  const handleDrop = (targetId: WorkflowStageId) => {
    if (!draggedId || draggedId === targetId) {
      return;
    }
    const ordered = sortedStages.slice();
    const fromIndex = ordered.findIndex((stage) => stage.id === draggedId);
    const toIndex = ordered.findIndex((stage) => stage.id === targetId);
    if (fromIndex === -1 || toIndex === -1) {
      return;
    }
    const updated: WorkflowStageConfig[] = ordered.slice();
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    const withOrder = updated.map((stage, index) => ({
      ...stage,
      order: index + 1,
    }));
    setStages(withOrder);
    setDraggedId(null);
  };

  const handleExpressToggle = (value: boolean) => {
    setExpressMode(value);
  };

  const handleWeightRequiredToggle = (value: boolean) => {
    updateRequiredFields({
      triage: {
        weightRequired: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Workflow configuration
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Configure the stages of a pet&apos;s visit, choose express mode, and
            control which fields are required before moving forward.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToRecommended}
            className="gap-2"
          >
            <Settings2 className="h-4 w-4" />
            Reset to recommended
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Recommended: Reception → Triage → Consultation → Billing
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Visit stages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Drag and drop to reorder the visit stages. Toggle a stage on or
              off to enable or disable it for your clinic.
            </p>
            <div className="space-y-3">
              {sortedStages.map((stage) => {
                const meta = WORKFLOW_STAGE_META[stage.id];
                return (
                  <div
                    key={stage.id}
                    draggable
                    onDragStart={() => setDraggedId(stage.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDrop(stage.id)}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-3 text-sm shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center rounded-md border bg-muted p-1">
                        <GripVertical className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{meta.label}</span>
                          {stage.enabled ? (
                            <Badge
                              variant="outline"
                              className="border-emerald-500/40 text-[10px] font-normal text-emerald-700"
                            >
                              Enabled
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-muted-foreground/30 text-[10px] font-normal text-muted-foreground"
                            >
                              Disabled
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {meta.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-muted-foreground">
                        Step {stage.order}
                      </span>
                      <Switch
                        checked={stage.enabled}
                        onCheckedChange={() => toggleStageEnabled(stage.id)}
                        aria-label={`Toggle ${meta.label}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Express mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">One-man shop express mode</p>
                  <p className="text-xs text-muted-foreground">
                    Combine triage, consultation, and billing into a single
                    long-scroll page for solo vets.
                  </p>
                </div>
                <Switch
                  checked={isExpressMode}
                  onCheckedChange={handleExpressToggle}
                  aria-label="Toggle express mode"
                />
              </div>
              <div className="rounded-md border border-dashed border-muted-foreground/30 px-3 py-2 text-xs text-muted-foreground">
                When enabled, the Active Visit screen shows all enabled stages
                in one continuous form instead of a step-by-step wizard.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Field requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Triage: weight required before consultation
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Require a weight to be recorded before moving from triage
                      to the doctor.
                    </p>
                  </div>
                  <Switch
                    checked={requiredFields.triage.weightRequired}
                    onCheckedChange={handleWeightRequiredToggle}
                    aria-label="Toggle required weight in triage"
                  />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Additional required-field rules can be added here as your clinic
                workflow evolves.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

