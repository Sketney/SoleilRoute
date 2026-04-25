import type { BudgetItemRecord, TripRecord } from "@/server/db/trips";
import type { VisaRequirement } from "@/lib/services/visa";
import type {
  FullPlanGenerationReason,
  TripPlanSnapshot,
  TripPlanVisaDetails,
} from "@/lib/services/full-plan/types";
import type { TripPlanVisaScenario } from "@/lib/services/full-plan/visa-scenarios/types";
import { generateBudgetSnapshot } from "@/lib/services/full-plan/generate-budget";
import { generateDocumentChecklist } from "@/lib/services/full-plan/generate-documents";
import { generateTimelinePlan } from "@/lib/services/full-plan/generate-timeline";

export const travelDisclaimer =
  "Visa and travel information is provided for planning purposes only. Always verify requirements with official government, embassy, airline, or visa center sources before booking or traveling.";

function buildVisaScenarioLabel(visa: TripPlanVisaDetails) {
  return visa.type?.trim() || "Entry requirements";
}

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
  const documents = generateDocumentChecklist({ trip, visa });
  const timeline = generateTimelinePlan({
    trip,
    visa,
    now: new Date(generatedAt),
  });
  const budget = generateBudgetSnapshot({ trip, budgetItems });
  const reminders = timeline.filter((item) => item.status === "pending");
  const visaDetails: TripPlanVisaDetails = {
    required: visa ? visa.visaRequired : null,
    type: visa?.visaType ?? null,
    validity: visa?.validity ?? null,
    processingTime: visa?.processingTime ?? null,
    passportValidity: visa?.passportValidity ?? null,
    source: visa ? "Travel Buddy" : "Unavailable",
    checkedAt: trip.visa_last_checked,
    embassyUrl: visa?.embassyUrl ?? null,
    applicationUrl: visa?.applicationUrl ?? null,
    notes: visa?.notes ?? null,
  };
  const defaultVisaScenario: TripPlanVisaScenario = {
    id: "default",
    label: buildVisaScenarioLabel(visaDetails),
    isDefault: true,
    visa: visaDetails,
    documents,
    timeline,
    reminders,
  };

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
    visaScenarios: [defaultVisaScenario],
    activeVisaScenarioId: defaultVisaScenario.id,
    visa: defaultVisaScenario.visa,
    documents: defaultVisaScenario.documents,
    timeline: defaultVisaScenario.timeline,
    budget,
    reminders: defaultVisaScenario.reminders,
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
