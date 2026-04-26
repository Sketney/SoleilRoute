import type { TripRecord } from "@/server/db/trips";
import type { VisaRequirement } from "@/lib/services/visa";
import type { TripPlanVisaDetails } from "@/lib/services/full-plan/types";
import { generateDocumentChecklist } from "@/lib/services/full-plan/generate-documents";
import { generateTimelinePlan } from "@/lib/services/full-plan/generate-timeline";
import {
  getCuratedVisaScenarioCatalog,
  type CuratedVisaScenarioKind,
  type CuratedVisaScenarioTemplate,
} from "@/lib/services/full-plan/visa-scenarios/catalog";
import type { TripPlanVisaScenario } from "@/lib/services/full-plan/visa-scenarios/types";

function joinNotes(...notes: Array<string | null | undefined>) {
  const items = notes.map((note) => note?.trim()).filter(Boolean);
  return items.length > 0 ? items.join(" ") : null;
}

function buildScenarioNotes(
  baseVisaDetails: TripPlanVisaDetails,
  scenario: CuratedVisaScenarioTemplate,
) {
  if (scenario.kind === "tourist") {
    return joinNotes(baseVisaDetails.notes, scenario.notesAppend);
  }

  return (
    scenario.notesAppend?.trim() ||
    "Check official guidance for scenario-specific eligibility, supporting documents, and stay conditions."
  );
}

function buildScenarioId(country: string, kind: CuratedVisaScenarioKind) {
  return `${country.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${kind.replace(/_/g, "-")}`;
}

function buildVisaDetails(
  visa: VisaRequirement | null,
  checkedAt: string | null,
): TripPlanVisaDetails {
  return {
    required: visa ? visa.visaRequired : null,
    type: visa?.visaType ?? null,
    validity: visa?.validity ?? null,
    processingTime: visa?.processingTime ?? null,
    passportValidity: visa?.passportValidity ?? null,
    source: visa ? "Travel Buddy" : "Unavailable",
    checkedAt,
    embassyUrl: visa?.embassyUrl ?? null,
    applicationUrl: visa?.applicationUrl ?? null,
    notes: visa?.notes ?? null,
  };
}

function buildScenarioVisaDetails(
  baseVisaDetails: TripPlanVisaDetails,
  scenario: CuratedVisaScenarioTemplate,
) {
  if (scenario.kind === "tourist") {
    return {
      ...baseVisaDetails,
      type: scenario.visaTypeOverride ?? baseVisaDetails.type,
      notes: buildScenarioNotes(baseVisaDetails, scenario),
    };
  }

  return {
    ...baseVisaDetails,
    required: scenario.requiredOverride ?? null,
    type: scenario.visaTypeOverride ?? baseVisaDetails.type,
    validity: scenario.validityOverride ?? null,
    processingTime:
      scenario.processingTimeOverride ??
      (baseVisaDetails.embassyUrl ? "Check official guidance" : null),
    embassyUrl: scenario.embassyUrlOverride ?? baseVisaDetails.embassyUrl,
    applicationUrl: scenario.applicationUrlOverride ?? null,
    notes: buildScenarioNotes(baseVisaDetails, scenario),
  };
}

function buildFallbackScenario({
  trip,
  visa,
  generatedAt,
}: {
  trip: TripRecord;
  visa: VisaRequirement | null;
  generatedAt: string;
}): TripPlanVisaScenario {
  const visaDetails = buildVisaDetails(visa, trip.visa_last_checked);
  const timeline = generateTimelinePlan({
    trip,
    visa,
    now: new Date(generatedAt),
  });

  return {
    id: "default",
    label: visaDetails.type?.trim() || "Entry requirements",
    isDefault: true,
    visa: visaDetails,
    documents: generateDocumentChecklist({ trip, visa }),
    timeline,
    reminders: timeline.filter((item) => item.status === "pending"),
  };
}

export function buildVisaScenarios({
  trip,
  visa,
  generatedAt,
}: {
  trip: TripRecord;
  visa: VisaRequirement | null;
  generatedAt: string;
}): TripPlanVisaScenario[] {
  const curatedScenarios = getCuratedVisaScenarioCatalog(trip.destination_country);

  if (curatedScenarios.length === 0) {
    return [buildFallbackScenario({ trip, visa, generatedAt })];
  }

  const baseVisaDetails = buildVisaDetails(visa, trip.visa_last_checked);

  return curatedScenarios.map((scenario, index) => {
    const timeline = generateTimelinePlan({
      trip,
      visa,
      now: new Date(generatedAt),
      scenarioId: scenario.kind,
    });

    return {
      id: buildScenarioId(trip.destination_country, scenario.kind),
      label: scenario.label,
      isDefault: index === 0,
      visa: buildScenarioVisaDetails(baseVisaDetails, scenario),
      documents: generateDocumentChecklist({
        trip,
        visa,
        scenarioId: scenario.kind,
      }),
      timeline,
      reminders: timeline.filter((item) => item.status === "pending"),
    };
  });
}
