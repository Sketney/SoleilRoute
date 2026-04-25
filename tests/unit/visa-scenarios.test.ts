import { describe, expect, it } from "vitest";
import type { BudgetItemRecord, TripRecord } from "@/server/db/trips";
import type { VisaRequirement } from "@/lib/services/visa";
import { buildPlanSnapshot } from "@/lib/services/full-plan/build-plan-snapshot";
import { normalizeTripPlanSnapshot } from "@/server/db/trip-plans";

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
  it("creates one baseline scenario and projects it to top-level fields", () => {
    const snapshot = buildPlanSnapshot({
      trip,
      visa,
      budgetItems,
      generatedAt: "2026-04-25T12:00:00.000Z",
      reason: "purchase",
    });

    expect(snapshot.visaScenarios).toHaveLength(1);

    const [scenario] = snapshot.visaScenarios;

    expect(snapshot.activeVisaScenarioId).toBe(scenario.id);
    expect(scenario.label).toBe("Visa on arrival / eVisa");
    expect(snapshot.visa).toEqual(scenario.visa);
    expect(snapshot.documents).toEqual(scenario.documents);
    expect(snapshot.timeline).toEqual(scenario.timeline);
    expect(snapshot.reminders).toEqual(scenario.reminders);
  });

  it("creates a usable fallback scenario when visa data is unavailable", () => {
    const snapshot = buildPlanSnapshot({
      trip,
      visa: null,
      budgetItems,
      generatedAt: "2026-04-25T12:00:00.000Z",
      reason: "purchase",
    });

    expect(snapshot.visaScenarios).toHaveLength(1);

    const [scenario] = snapshot.visaScenarios;

    expect(snapshot.activeVisaScenarioId).toBe(scenario.id);
    expect(scenario.label).toBe("Entry requirements");
    expect(snapshot.visa).toEqual(scenario.visa);
    expect(snapshot.documents).toEqual(scenario.documents);
    expect(snapshot.timeline).toEqual(scenario.timeline);
    expect(snapshot.reminders).toEqual(scenario.reminders);
    expect(snapshot.visa.required).toBeNull();
    expect(scenario.documents.length).toBeGreaterThan(0);
    expect(scenario.timeline.length).toBeGreaterThan(0);
  });

  it("normalizes legacy snapshots without scenario metadata on read", () => {
    const snapshot = buildPlanSnapshot({
      trip,
      visa,
      budgetItems,
      generatedAt: "2026-04-25T12:00:00.000Z",
      reason: "purchase",
    });

    const legacySnapshot = {
      ...snapshot,
      visaScenarios: undefined,
      activeVisaScenarioId: undefined,
    };

    const normalized = normalizeTripPlanSnapshot(legacySnapshot);

    expect(normalized.visaScenarios).toHaveLength(1);
    expect(normalized.activeVisaScenarioId).toBe(normalized.visaScenarios[0]?.id);
    expect(normalized.visaScenarios[0]?.label).toBe("Visa on arrival / eVisa");
    expect(normalized.visa).toEqual(normalized.visaScenarios[0]?.visa);
    expect(normalized.documents).toEqual(normalized.visaScenarios[0]?.documents);
    expect(normalized.timeline).toEqual(normalized.visaScenarios[0]?.timeline);
    expect(normalized.reminders).toEqual(normalized.visaScenarios[0]?.reminders);
  });
});
