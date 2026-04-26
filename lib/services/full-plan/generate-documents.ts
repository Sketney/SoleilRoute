import type { TripRecord } from "@/server/db/trips";
import type { VisaRequirement } from "@/lib/services/visa";
import type { PlanDocument } from "@/lib/services/full-plan/types";

function dueDateFromStart(trip: TripRecord, daysBefore: number) {
  const date = new Date(trip.start_date);
  date.setUTCDate(date.getUTCDate() - daysBefore);
  return date.toISOString();
}

function documentId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function generateDocumentChecklist({
  trip,
  visa,
  scenarioId,
}: {
  trip: TripRecord;
  visa: VisaRequirement | null;
  scenarioId?: string | null;
}): PlanDocument[] {
  const documents: Omit<PlanDocument, "id" | "sortOrder" | "status" | "source">[] = [
    {
      title: "Passport",
      description: visa?.passportValidity
        ? `Passport should satisfy validity rule: ${visa.passportValidity}.`
        : "Passport should be valid for the whole stay and any destination-specific buffer.",
      category: "identity",
      required: true,
      dueDate: dueDateFromStart(trip, 180),
    },
    {
      title: "Travel insurance",
      description: "Carry medical travel insurance covering the full trip dates.",
      category: "health",
      required: true,
      dueDate: dueDateFromStart(trip, 21),
    },
    {
      title: "Flight or transport itinerary",
      description: "Keep booking references and proof of onward or return travel.",
      category: "travel",
      required: true,
      dueDate: dueDateFromStart(trip, 45),
    },
    {
      title: "Accommodation confirmation",
      description: "Keep hotel, apartment, or host confirmations for border and visa checks.",
      category: "travel",
      required: true,
      dueDate: dueDateFromStart(trip, 30),
    },
    {
      title: "Proof of funds",
      description: "Prepare bank statement, card statement, or other proof of sufficient funds.",
      category: "finance",
      required: true,
      dueDate: dueDateFromStart(trip, 30),
    },
    {
      title: "Emergency document copies",
      description: "Store offline and cloud copies of passport, insurance, bookings, and visas.",
      category: "identity",
      required: true,
      dueDate: dueDateFromStart(trip, 14),
    },
  ];

  if (visa?.visaRequired) {
    documents.push({
      title: "Visa or eVisa confirmation",
      description: visa.applicationUrl
        ? "Apply online and keep a digital and printed confirmation."
        : "Prepare visa approval, appointment confirmation, or stamped visa evidence.",
      category: "visa",
      required: true,
      dueDate: dueDateFromStart(trip, 60),
    });
  } else if (visa) {
    documents.push({
      title: "Visa-free entry proof",
      description: "Keep proof of return travel, accommodation, and entry conditions for visa-free travel.",
      category: "visa",
      required: false,
      dueDate: dueDateFromStart(trip, 14),
    });
  }

  if (visa?.mandatoryRegistration) {
    documents.push({
      title: `${visa.mandatoryRegistration.name} registration`,
      description: visa.mandatoryRegistration.link
        ? `Complete mandatory registration before arrival: ${visa.mandatoryRegistration.link}`
        : "Complete mandatory arrival or travel registration before departure.",
      category: "visa",
      required: true,
      dueDate: dueDateFromStart(trip, 7),
    });
  }

  const normalizedScenarioId = scenarioId?.toLowerCase().replace(/-/g, "_");

  if (normalizedScenarioId?.includes("digital_nomad")) {
    documents.push(
      {
        title: "Remote work income proof",
        description:
          "Prepare recent bank statements, payslips, or recurring income proof for remote work eligibility checks.",
        category: "finance",
        required: true,
        dueDate: dueDateFromStart(trip, 45),
      },
      {
        title: "Employment or client contract evidence",
        description:
          "Keep employer letters, freelance contracts, or client agreements that support the remote work purpose of stay.",
        category: "custom",
        required: true,
        dueDate: dueDateFromStart(trip, 45),
      },
      {
        title: "Long-stay accommodation plan",
        description:
          "Prepare accommodation details that cover the intended remote work stay and arrival address requirements.",
        category: "travel",
        required: true,
        dueDate: dueDateFromStart(trip, 30),
      },
    );
  }

  if (normalizedScenarioId?.includes("business")) {
    documents.push({
      title: "Business invitation letter",
      description:
        "Request an invitation letter or host confirmation covering meetings, company details, and trip purpose.",
      category: "custom",
      required: true,
      dueDate: dueDateFromStart(trip, 30),
    });
  }

  return documents.map((document, index) => ({
    ...document,
    id: documentId(document.title),
    status: "pending",
    source: visa ? "Travel Buddy" : "SoleilRoute checklist",
    sortOrder: index + 1,
  }));
}
