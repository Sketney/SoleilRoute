import { describe, expect, it } from "vitest";
import type { BudgetItemRecord, TripRecord } from "@/server/db/trips";
import type { VisaRequirement } from "@/lib/services/visa";
import { buildPlanSnapshot } from "@/lib/services/full-plan/build-plan-snapshot";

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

const budgetItems: BudgetItemRecord[] = [];

describe("visa scenarios in full plan snapshots", () => {
  it("creates a default active scenario and projects it to top-level fields", () => {
    const snapshot = buildPlanSnapshot({
      trip,
      visa,
      budgetItems,
      generatedAt: "2026-04-25T12:00:00.000Z",
      reason: "purchase",
    });

    expect(snapshot.activeVisaScenarioId).toEqual(expect.any(String));
    expect(snapshot.visaScenarios.length).toBeGreaterThan(0);

    const activeScenario = snapshot.visaScenarios.find(
      (scenario) => scenario.id === snapshot.activeVisaScenarioId,
    );

    expect(activeScenario).toBeDefined();
    expect(snapshot.visa).toEqual(activeScenario?.visa);
    expect(snapshot.documents).toEqual(activeScenario?.documents);
    expect(snapshot.timeline).toEqual(activeScenario?.timeline);
    expect(snapshot.reminders).toEqual(activeScenario?.reminders);
  });
});
