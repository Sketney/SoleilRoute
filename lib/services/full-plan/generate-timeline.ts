import type { TripRecord } from "@/server/db/trips";
import type { VisaRequirement } from "@/lib/services/visa";
import type { PlanTimelineItem } from "@/lib/services/full-plan/types";

type TimelineTemplate = {
  daysBefore: number;
  title: string;
  description: string;
  category: PlanTimelineItem["category"];
  skipWhenVisaFree?: boolean;
};

const templates: TimelineTemplate[] = [
  {
    daysBefore: 180,
    title: "Check passport validity",
    description: "Confirm passport validity and renewal lead times.",
    category: "documents",
  },
  {
    daysBefore: 120,
    title: "Confirm visa requirements",
    description: "Review visa rules and official source links.",
    category: "visa",
  },
  {
    daysBefore: 90,
    title: "Start document collection",
    description: "Gather identity, financial, travel, and insurance documents.",
    category: "documents",
  },
  {
    daysBefore: 60,
    title: "Submit visa application",
    description: "Submit visa or eVisa application and save confirmation.",
    category: "visa",
    skipWhenVisaFree: true,
  },
  {
    daysBefore: 45,
    title: "Book flights or transport",
    description: "Book core transport and keep itinerary details.",
    category: "booking",
  },
  {
    daysBefore: 30,
    title: "Confirm accommodation",
    description: "Finalize stay addresses and booking confirmations.",
    category: "booking",
  },
  {
    daysBefore: 21,
    title: "Review travel insurance",
    description: "Check health coverage, destination rules, and emergency contacts.",
    category: "documents",
  },
  {
    daysBefore: 14,
    title: "Prepare document copies",
    description: "Save digital and printed copies of critical documents.",
    category: "documents",
  },
  {
    daysBefore: 7,
    title: "Prepare connectivity and money",
    description: "Arrange eSIM, local payments, and emergency cash or card backup.",
    category: "money",
  },
  {
    daysBefore: 3,
    title: "Check luggage and documents",
    description: "Verify luggage rules, documents, arrival forms, and airport timing.",
    category: "departure",
  },
  {
    daysBefore: 1,
    title: "Online check-in",
    description: "Complete transport check-in and keep boarding passes accessible.",
    category: "departure",
  },
];

function itemId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function dueDate(startDate: string, daysBefore: number, now: Date) {
  const due = new Date(startDate);
  due.setUTCDate(due.getUTCDate() - daysBefore);
  if (due < now) {
    return {
      date: now.toISOString(),
      urgent: true,
    };
  }
  return {
    date: due.toISOString(),
    urgent: false,
  };
}

export function generateTimelinePlan({
  trip,
  visa,
  now = new Date(),
  scenarioId,
}: {
  trip: TripRecord;
  visa: VisaRequirement | null;
  now?: Date;
  scenarioId?: string | null;
}): PlanTimelineItem[] {
  const normalizedScenarioId = scenarioId?.toLowerCase().replace(/-/g, "_");
  const items = templates.flatMap((template, index) => {
    if (template.skipWhenVisaFree && visa && !visa.visaRequired) {
      return [];
    }
    const due = dueDate(trip.start_date, template.daysBefore, now);
    return {
      id: itemId(template.title),
      title:
        template.skipWhenVisaFree && visa?.visaRequired
          ? `${template.title}: ${visa.visaType}`
          : template.title,
      description: due.urgent
        ? `${template.description} This step is urgent because the trip is soon.`
        : template.description,
      dueDate: due.date,
      category: template.category,
      status: "pending" as const,
      urgent: due.urgent,
      source: "SoleilRoute timeline generator",
      sortOrder: index + 1,
    };
  });

  if (visa && !visa.visaRequired) {
    items.splice(3, 0, {
      id: "confirm-visa-free-entry-conditions",
      title: "Confirm visa-free entry conditions",
      description: "Check stay length, passport validity, and proof of onward travel.",
      dueDate: dueDate(trip.start_date, 30, now).date,
      category: "visa",
      status: "pending",
      urgent: dueDate(trip.start_date, 30, now).urgent,
      source: "SoleilRoute timeline generator",
      sortOrder: 4,
    });
  }

  if (normalizedScenarioId?.includes("digital_nomad")) {
    const remoteWorkDocumentsDue = dueDate(trip.start_date, 75, now);
    const remoteWorkRulesDue = dueDate(trip.start_date, 40, now);

    items.push(
      {
        id: "prepare-remote-work-eligibility-documents",
        title: "Prepare remote work eligibility documents",
        description:
          "Collect income proof, employer or client contracts, insurance details, and accommodation evidence for remote work stays.",
        dueDate: remoteWorkDocumentsDue.date,
        category: "documents",
        status: "pending",
        urgent: remoteWorkDocumentsDue.urgent,
        source: "SoleilRoute timeline generator",
        sortOrder: items.length + 1,
      },
      {
        id: "confirm-remote-work-stay-rules",
        title: "Confirm tax and stay rules for remote work",
        description:
          "Review remote work eligibility, local stay limits, and any tax or registration expectations before departure.",
        dueDate: remoteWorkRulesDue.date,
        category: "visa",
        status: "pending",
        urgent: remoteWorkRulesDue.urgent,
        source: "SoleilRoute timeline generator",
        sortOrder: items.length + 2,
      },
    );
  }

  if (normalizedScenarioId?.includes("business")) {
    const businessDocumentsDue = dueDate(trip.start_date, 50, now);

    items.push({
      id: "request-business-host-documents",
      title: "Request host company documents",
      description:
        "Confirm invitation letters, meeting schedules, and company contact details for the business trip.",
      dueDate: businessDocumentsDue.date,
      category: "documents",
      status: "pending",
      urgent: businessDocumentsDue.urgent,
      source: "SoleilRoute timeline generator",
      sortOrder: items.length + 1,
    });
  }

  return items
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .map((item, index) => ({ ...item, sortOrder: index + 1 }));
}
