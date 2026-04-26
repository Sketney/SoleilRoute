import type { BudgetItemRecord, TripRecord } from "@/server/db/trips";
import type { VisaRequirement } from "@/lib/services/visa";
import type {
  FullPlanGenerationReason,
  TripPlanSnapshot,
} from "@/lib/services/full-plan/types";
import { generateBudgetSnapshot } from "@/lib/services/full-plan/generate-budget";
import { buildVisaScenarios } from "@/lib/services/full-plan/visa-scenarios/build-scenarios";
import { projectVisaScenario } from "@/lib/services/full-plan/visa-scenarios/project-scenario";

export const travelDisclaimer =
  "Visa and travel information is provided for planning purposes only. Always verify requirements with official government, embassy, airline, or visa center sources before booking or traveling.";

export function buildPlanSnapshot({
  trip,
  visa,
  budgetItems,
  generatedAt = new Date().toISOString(),
  reason,
}: {
  trip: TripRecord;
  visa: VisaRequirement | null;
  budgetItems: BudgetItemRecord[];
  generatedAt?: string;
  reason: FullPlanGenerationReason;
}): TripPlanSnapshot {
  const visaScenarios = buildVisaScenarios({
    trip,
    visa,
    generatedAt,
  });
  const budget = generateBudgetSnapshot({ trip, budgetItems });
  const projection = projectVisaScenario({
    scenarios: visaScenarios,
    activeScenarioId: visaScenarios.find((scenario) => scenario.isDefault)?.id ?? null,
  });

  return {
    version: 1,
    generatedAt,
    reason,
    trip: {
      id: trip.id,
      name: trip.name,
      destination: `${trip.destination_city}, ${trip.destination_country}`,
      dates: {
        start: trip.start_date,
        end: trip.end_date,
      },
      citizenship: trip.citizenship,
    },
    visaScenarios,
    activeVisaScenarioId: projection.activeScenarioId,
    visa: projection.visa,
    documents: projection.documents,
    timeline: projection.timeline,
    budget,
    reminders: projection.reminders,
    sources: [
      {
        label: "Visa requirements",
        source: visa ? "Travel Buddy" : "Unavailable",
        checkedAt: trip.visa_last_checked,
        confidence: visa ? "high" : "low",
        url: visa?.embassyUrl ?? visa?.applicationUrl ?? null,
      },
      {
        label: "Budget",
        source: budgetItems.length > 0 ? "User budget items" : "SoleilRoute generated estimate",
        checkedAt: generatedAt,
        confidence: budgetItems.length > 0 ? "high" : "medium",
      },
      {
        label: "Timeline and documents",
        source: "SoleilRoute rules engine",
        checkedAt: generatedAt,
        confidence: "medium",
      },
    ],
    disclaimer: travelDisclaimer,
  };
}
