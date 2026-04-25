import type { BudgetCategoryId } from "@/lib/constants";
import type { TripPlanVisaScenario } from "@/lib/services/full-plan/visa-scenarios/types";

export type FullPlanGenerationReason =
  | "purchase"
  | "pro_unlock"
  | "manual_regenerate"
  | "scheduled_refresh";

export type PlanDocumentStatus = "pending" | "completed" | "not_applicable";

export type PlanDocument = {
  id: string;
  title: string;
  description: string;
  category: "identity" | "visa" | "travel" | "health" | "finance" | "custom";
  required: boolean;
  status: PlanDocumentStatus;
  dueDate: string | null;
  source: string;
  sortOrder: number;
};

export type PlanTimelineItem = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: "visa" | "documents" | "booking" | "money" | "departure";
  status: "pending" | "completed";
  urgent: boolean;
  source: string;
  sortOrder: number;
};

export type PlanBudgetItem = {
  category: BudgetCategoryId | "insurance" | "communication" | "local_transport" | "emergency_reserve";
  amount: number;
  currency: string;
  source: "user_input" | "generated_estimate";
  confidence: "high" | "medium" | "low";
  editable: boolean;
};

export type PlanSource = {
  label: string;
  source: string;
  checkedAt: string | null;
  confidence: "high" | "medium" | "low";
  url?: string | null;
};

export type TripPlanVisaDetails = {
  required: boolean | null;
  type: string | null;
  validity: string | null;
  processingTime: string | null;
  passportValidity: string | null;
  source: string;
  checkedAt: string | null;
  embassyUrl: string | null;
  applicationUrl: string | null;
  notes: string | null;
};

export type TripPlanSnapshot = {
  version: number;
  generatedAt: string;
  reason: FullPlanGenerationReason;
  trip: {
    id: string;
    name: string;
    destination: string;
    dates: {
      start: string;
      end: string;
    };
    citizenship: string;
  };
  visaScenarios: TripPlanVisaScenario[];
  activeVisaScenarioId: string | null;
  visa: TripPlanVisaDetails;
  documents: PlanDocument[];
  timeline: PlanTimelineItem[];
  budget: {
    total: number;
    currency: string;
    items: PlanBudgetItem[];
  };
  reminders: PlanTimelineItem[];
  sources: PlanSource[];
  disclaimer: string;
};
