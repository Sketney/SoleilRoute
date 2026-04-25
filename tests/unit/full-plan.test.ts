import { describe, expect, it } from "vitest";
import type { TripRecord, BudgetItemRecord } from "@/server/db/trips";
import type { VisaRequirement } from "@/lib/services/visa";
import { buildPlanSnapshot } from "@/lib/services/full-plan/build-plan-snapshot";
import { generateDocumentChecklist } from "@/lib/services/full-plan/generate-documents";
import { generateTimelinePlan } from "@/lib/services/full-plan/generate-timeline";

const trip: TripRecord = {
  id: "trip-1",
  user_id: "user-1",
  name: "Jakarta trip",
  destination_country: "Indonesia",
  destination_city: "Jakarta",
  start_date: "2026-08-01T00:00:00.000Z",
  end_date: "2026-08-12T00:00:00.000Z",
  total_budget: 2400,
  budget_tier: "mid",
  currency: "USD",
  citizenship: "China",
  base_currency: "USD",
  exchange_rate: 1,
  notes: null,
  visa_status: "required",
  visa_last_checked: "2026-04-25T10:00:00.000Z",
  created_at: "2026-04-25T09:00:00.000Z",
};

const visa: VisaRequirement = {
  citizenship: "China",
  destination: "Indonesia",
  visaRequired: true,
  visaType: "Visa on arrival / eVisa",
  validity: "30 days",
  processingTime: "See official guidance",
  cost: 0,
  currency: "IDR",
  embassyUrl: "https://example.test/embassy",
  applicationUrl: "https://example.test/evisa",
  passportValidity: "6 months",
  mandatoryRegistration: {
    name: "e-Arrival",
    link: "https://example.test/arrival",
  },
  notes: "Passport validity: 6 months.",
};

const budgetItems: BudgetItemRecord[] = [
  {
    id: "budget-1",
    trip_id: "trip-1",
    category: "transport",
    description: null,
    amount: 500,
    currency: "USD",
    is_paid: false,
    created_at: "2026-04-25T09:00:00.000Z",
  },
  {
    id: "budget-2",
    trip_id: "trip-1",
    category: "visa",
    description: null,
    amount: 100,
    currency: "USD",
    is_paid: false,
    created_at: "2026-04-25T09:00:00.000Z",
  },
];

describe("full trip plan generation", () => {
  it("generates required and conditional documents from visa data", () => {
    const documents = generateDocumentChecklist({ trip, visa });

    expect(documents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Passport", required: true }),
        expect.objectContaining({ title: "Visa or eVisa confirmation", required: true }),
        expect.objectContaining({ title: "e-Arrival registration", required: true }),
      ]),
    );
  });

  it("generates timeline items without past dates for short-notice trips", () => {
    const timeline = generateTimelinePlan({
      trip: {
        ...trip,
        start_date: "2026-04-30T00:00:00.000Z",
      },
      visa,
      now: new Date("2026-04-25T00:00:00.000Z"),
    });

    expect(timeline.length).toBeGreaterThan(4);
    expect(timeline.every((item) => new Date(item.dueDate) >= new Date("2026-04-25T00:00:00.000Z"))).toBe(true);
    expect(timeline.some((item) => item.urgent)).toBe(true);
  });

  it("builds a reproducible plan snapshot with sections and sources", () => {
    const snapshot = buildPlanSnapshot({
      trip,
      visa,
      budgetItems,
      generatedAt: "2026-04-25T12:00:00.000Z",
      reason: "purchase",
    });

    expect(snapshot.version).toBe(1);
    expect(snapshot.trip.id).toBe("trip-1");
    expect(snapshot.visa.source).toBe("Travel Buddy");
    expect(snapshot.documents.length).toBeGreaterThan(3);
    expect(snapshot.timeline.length).toBeGreaterThan(6);
    expect(snapshot.budget.total).toBe(600);
    expect(snapshot.sources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Visa requirements",
          source: "Travel Buddy",
          checkedAt: "2026-04-25T10:00:00.000Z",
        }),
      ]),
    );
    expect(snapshot.disclaimer).toContain("planning purposes only");
  });
});
