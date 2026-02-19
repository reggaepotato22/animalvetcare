import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type WorkflowStageId =
  | "reception"
  | "triage"
  | "laboratory"
  | "consultation"
  | "pharmacy"
  | "billing";

export interface WorkflowStageConfig {
  id: WorkflowStageId;
  enabled: boolean;
  order: number;
}

interface WorkflowRequiredFields {
  triage: {
    weightRequired: boolean;
  };
}

interface WorkflowState {
  stages: WorkflowStageConfig[];
  activeStages: WorkflowStageConfig[];
  isExpressMode: boolean;
  requiredFields: WorkflowRequiredFields;
  currentStageId: WorkflowStageId | null;
  setStages: (stages: WorkflowStageConfig[]) => void;
  toggleStageEnabled: (id: WorkflowStageId) => void;
  resetToRecommended: () => void;
  setExpressMode: (value: boolean) => void;
  updateRequiredFields: (fields: Partial<WorkflowRequiredFields>) => void;
  setCurrentStageId: (id: WorkflowStageId | null) => void;
}

const WORKFLOW_CONFIG_STORAGE_KEY = "vetcare_workflow_config";

const defaultStages: WorkflowStageConfig[] = [
  { id: "reception", enabled: true, order: 1 },
  { id: "triage", enabled: true, order: 2 },
  { id: "laboratory", enabled: false, order: 3 },
  { id: "consultation", enabled: true, order: 4 },
  { id: "pharmacy", enabled: false, order: 5 },
  { id: "billing", enabled: true, order: 6 },
];

const defaultRequiredFields: WorkflowRequiredFields = {
  triage: {
    weightRequired: true,
  },
};

export const WORKFLOW_STAGE_META: Record<
  WorkflowStageId,
  { label: string; description: string }
> = {
  reception: {
    label: "Reception",
    description: "ID verification and check-in",
  },
  triage: {
    label: "Triage / Vitals",
    description: "Capture weight and vital signs",
  },
  laboratory: {
    label: "Laboratory",
    description: "Order and track lab tests",
  },
  consultation: {
    label: "Consultation",
    description: "SOAP notes and treatment plan",
  },
  pharmacy: {
    label: "Pharmacy",
    description: "Medications and dispensing",
  },
  billing: {
    label: "Billing / Invoice",
    description: "Checkout and payment summary",
  },
};

const WorkflowContext = createContext<WorkflowState | undefined>(undefined);

export function WorkflowProvider(props: React.PropsWithChildren) {
  const [stages, setStagesState] =
    useState<WorkflowStageConfig[]>(defaultStages);
  const [isExpressMode, setExpressModeState] = useState(false);
  const [requiredFields, setRequiredFields] =
    useState<WorkflowRequiredFields>(defaultRequiredFields);
  const [currentStageId, setCurrentStageId] =
    useState<WorkflowStageId | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WORKFLOW_CONFIG_STORAGE_KEY);
      if (!stored) {
        return;
      }
      const parsed = JSON.parse(stored) as {
        workflow?: WorkflowStageConfig[];
        isExpressMode?: boolean;
        requiredFields?: WorkflowRequiredFields;
      };
      if (parsed.workflow && Array.isArray(parsed.workflow)) {
        setStagesState(parsed.workflow);
      }
      if (typeof parsed.isExpressMode === "boolean") {
        setExpressModeState(parsed.isExpressMode);
      }
      if (parsed.requiredFields) {
        setRequiredFields((prev) => ({
          triage: {
            ...prev.triage,
            ...parsed.requiredFields?.triage,
          },
        }));
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    const payload = {
      workflow: stages,
      isExpressMode,
      requiredFields,
    };
    try {
      localStorage.setItem(
        WORKFLOW_CONFIG_STORAGE_KEY,
        JSON.stringify(payload),
      );
    } catch {
    }
  }, [stages, isExpressMode, requiredFields]);

  const setStages = (next: WorkflowStageConfig[]) => {
    setStagesState(next);
  };

  const toggleStageEnabled = (id: WorkflowStageId) => {
    setStagesState((prev) =>
      prev.map((stage) =>
        stage.id === id ? { ...stage, enabled: !stage.enabled } : stage,
      ),
    );
  };

  const resetToRecommended = () => {
    setStagesState(defaultStages);
    setExpressModeState(false);
    setRequiredFields(defaultRequiredFields);
    setCurrentStageId(null);
  };

  const updateRequiredFields = (fields: Partial<WorkflowRequiredFields>) => {
    setRequiredFields((prev) => ({
      triage: {
        ...prev.triage,
        ...(fields.triage ?? {}),
      },
    }));
  };

  const activeStages = useMemo(
    () =>
      stages
        .filter((stage) => stage.enabled)
        .slice()
        .sort((a, b) => a.order - b.order),
    [stages],
  );

  const value: WorkflowState = useMemo(
    () => ({
      stages,
      activeStages,
      isExpressMode,
      requiredFields,
      currentStageId,
      setStages,
      toggleStageEnabled,
      resetToRecommended,
      setExpressMode: setExpressModeState,
      updateRequiredFields,
      setCurrentStageId,
    }),
    [
      stages,
      activeStages,
      isExpressMode,
      requiredFields,
      currentStageId,
      updateRequiredFields,
    ],
  );

  return (
    <WorkflowContext.Provider value={value}>
      {props.children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider");
  }
  return context;
}

