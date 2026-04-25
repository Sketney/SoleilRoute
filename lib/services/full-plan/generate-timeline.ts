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
}: {
  trip: TripRecord;
  visa: VisaRequirement | null;
  now?: Date;
}): PlanTimelineItem[] {
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

  return items
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .map((item, index) => ({ ...item, sortOrder: index + 1 }));
}
