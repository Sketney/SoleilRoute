import type {
  PlanDocument,
  PlanTimelineItem,
  TripPlanVisaDetails,
} from "@/lib/services/full-plan/types";
import type { TripPlanVisaScenario } from "@/lib/services/full-plan/visa-scenarios/types";

export type ActiveScenarioProjection = {
  activeScenarioId: string | null;
  visa: TripPlanVisaDetails;
  documents: PlanDocument[];
  timeline: PlanTimelineItem[];
  reminders: PlanTimelineItem[];
};

export function projectVisaScenario({
  scenarios,
  activeScenarioId,
}: {
  scenarios: TripPlanVisaScenario[];
  activeScenarioId?: string | null;
}): ActiveScenarioProjection {
  const activeScenario =
    scenarios.find((scenario) => scenario.id === activeScenarioId) ?? scenarios[0];

  if (!activeScenario) {
    throw new Error("VISA_SCENARIO_REQUIRED");
  }

  return {
    activeScenarioId: activeScenario.id,
    visa: activeScenario.visa,
    documents: activeScenario.documents,
    timeline: activeScenario.timeline,
    reminders: activeScenario.reminders,
  };
}
