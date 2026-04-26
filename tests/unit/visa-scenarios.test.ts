import { afterEach, describe, expect, it, vi } from "vitest";
import type { BudgetItemRecord, TripRecord } from "@/server/db/trips";
import type { VisaRequirement } from "@/lib/services/visa";
import { buildPlanSnapshot } from "@/lib/services/full-plan/build-plan-snapshot";
import { buildVisaScenarios } from "@/lib/services/full-plan/visa-scenarios/build-scenarios";
import { projectVisaScenario } from "@/lib/services/full-plan/visa-scenarios/project-scenario";
import {
  normalizeTripPlanSnapshot,
  selectActiveVisaScenario,
} from "@/server/db/trip-plans";

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

const uncatalogedTrip: TripRecord = {
  ...trip,
  id: "trip-2",
  name: "Santiago trip",
  destination_country: "Chile",
  destination_city: "Santiago",
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

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("visa scenarios in full plan snapshots", () => {
  it("builds merged curated scenarios for supported destinations", () => {
    const scenarios = buildVisaScenarios({
      trip,
      visa,
      generatedAt: "2026-04-25T12:00:00.000Z",
    });

    expect(scenarios.map((scenario) => scenario.id)).toEqual([
      "indonesia-tourist",
      "indonesia-digital-nomad",
      "indonesia-business",
    ]);
    expect(scenarios[0]).toMatchObject({
      label: "Tourist / short stay",
      isDefault: true,
      visa: {
        type: "Visa on arrival / eVisa",
      },
    });
    expect(
      scenarios[1]?.documents.some((document) => document.title === "Remote work income proof"),
    ).toBe(true);
    expect(
      scenarios[1]?.timeline.some((item) => item.title === "Prepare remote work eligibility documents"),
    ).toBe(true);
  });

  it("keeps alternate curated scenario visa details conservative when exact facts are unknown", () => {
    const scenarios = buildVisaScenarios({
      trip,
      visa,
      generatedAt: "2026-04-25T12:00:00.000Z",
    });

    expect(scenarios[1]?.id).toBe("indonesia-digital-nomad");
    expect(scenarios[1]?.visa).toMatchObject({
      type: "Remote worker / digital nomad pathway",
      required: null,
      validity: null,
      processingTime: "Check official guidance",
      applicationUrl: null,
      embassyUrl: "https://example.test/embassy",
    });
    expect(scenarios[1]?.visa.notes).not.toContain("Passport validity: 6 months.");
    expect(scenarios[1]?.visa.notes).toContain("Remote work stays may require income evidence");
    expect(scenarios[2]?.id).toBe("indonesia-business");
    expect(scenarios[2]?.visa).toMatchObject({
      type: "Business visit visa / eVisa",
      required: null,
      validity: null,
      processingTime: "Check official guidance",
      applicationUrl: null,
      embassyUrl: "https://example.test/embassy",
    });
    expect(scenarios[2]?.visa.notes).not.toContain("Passport validity: 6 months.");
    expect(scenarios[2]?.visa.notes).toContain("Business travel often depends on invitation letters");
  });

  it("projects the default active scenario to top-level fields with a stable id", () => {
    const snapshot = buildPlanSnapshot({
      trip,
      visa,
      budgetItems,
      generatedAt: "2026-04-25T12:00:00.000Z",
      reason: "purchase",
    });

    expect(snapshot.visaScenarios).toHaveLength(3);

    const [scenario] = snapshot.visaScenarios;

    expect(snapshot.activeVisaScenarioId).toBe("indonesia-tourist");
    expect(snapshot.activeVisaScenarioId).toBe(scenario.id);
    expect(scenario.label).toBe("Tourist / short stay");
    expect(snapshot.visa).toEqual(scenario.visa);
    expect(snapshot.documents).toEqual(scenario.documents);
    expect(snapshot.timeline).toEqual(scenario.timeline);
    expect(snapshot.reminders).toEqual(scenario.reminders);
  });

  it("projects a digital nomad scenario with different documents and timeline", () => {
    const snapshot = buildPlanSnapshot({
      trip,
      visa,
      budgetItems,
      generatedAt: "2026-04-25T12:00:00.000Z",
      reason: "purchase",
    });

    const projection = projectVisaScenario({
      scenarios: snapshot.visaScenarios,
      activeScenarioId: "indonesia-digital-nomad",
    });

    expect(projection.activeScenarioId).toBe("indonesia-digital-nomad");
    expect(projection.documents).not.toEqual(snapshot.documents);
    expect(projection.timeline).not.toEqual(snapshot.timeline);
    expect(projection.documents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Remote work income proof" }),
        expect.objectContaining({ title: "Employment or client contract evidence" }),
      ]),
    );
    expect(projection.timeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Prepare remote work eligibility documents" }),
      ]),
    );
  });

  it("reprojects top-level sections when a different scenario is selected for persistence", () => {
    const snapshot = buildPlanSnapshot({
      trip,
      visa,
      budgetItems,
      generatedAt: "2026-04-25T12:00:00.000Z",
      reason: "purchase",
    });

    const selected = selectActiveVisaScenario(
      snapshot,
      "indonesia-digital-nomad",
    );

    expect(selected.activeVisaScenarioId).toBe("indonesia-digital-nomad");
    expect(selected.visa).toEqual(
      selected.visaScenarios.find((scenario) => scenario.id === "indonesia-digital-nomad")?.visa,
    );
    expect(selected.documents).toEqual(
      selected.visaScenarios.find((scenario) => scenario.id === "indonesia-digital-nomad")?.documents,
    );
    expect(selected.timeline).toEqual(
      selected.visaScenarios.find((scenario) => scenario.id === "indonesia-digital-nomad")?.timeline,
    );
    expect(selected.reminders).toEqual(
      selected.visaScenarios.find((scenario) => scenario.id === "indonesia-digital-nomad")?.reminders,
    );
    expect(selected.documents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Remote work income proof" }),
      ]),
    );
  });

  it("rejects selecting a scenario that does not exist on the saved snapshot", () => {
    const snapshot = buildPlanSnapshot({
      trip,
      visa,
      budgetItems,
      generatedAt: "2026-04-25T12:00:00.000Z",
      reason: "purchase",
    });

    expect(() =>
      selectActiveVisaScenario(snapshot, "missing-scenario"),
    ).toThrowError("VISA_SCENARIO_NOT_FOUND");
  });

  it("creates a usable fallback scenario for an uncataloged destination when visa data is unavailable", () => {
    const snapshot = buildPlanSnapshot({
      trip: uncatalogedTrip,
      visa: null,
      budgetItems,
      generatedAt: "2026-04-25T12:00:00.000Z",
      reason: "purchase",
    });

    expect(snapshot.visaScenarios).toHaveLength(1);

    const [scenario] = snapshot.visaScenarios;

    expect(snapshot.activeVisaScenarioId).toBe(scenario.id);
    expect(scenario.id).toBe("default");
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

  it("preserves a valid saved active scenario during regeneration", async () => {
    vi.doMock("@/server/db", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/server/db")>();

      return {
        ...actual,
        getTripById: vi.fn(async () => trip),
        listBudgetItems: vi.fn(async () => budgetItems),
        getTripPlan: vi.fn(async () => ({
          id: "plan-1",
          trip_id: trip.id,
          user_id: trip.user_id,
          version: 1,
          status: "full",
          plan_json: {
            ...buildPlanSnapshot({
              trip,
              visa,
              budgetItems,
              generatedAt: "2026-04-25T12:00:00.000Z",
              reason: "purchase",
            }),
            activeVisaScenarioId: "indonesia-digital-nomad",
          },
          generated_at: "2026-04-25T12:00:00.000Z",
          visa_checked_at: trip.visa_last_checked,
          created_at: "2026-04-25T12:00:00.000Z",
          updated_at: "2026-04-25T12:00:00.000Z",
        })),
        upsertTripPlan: vi.fn(async (input: { plan_json: unknown }) => input),
      };
    });
    vi.doMock("@/lib/services/visa", () => ({
      getVisaRequirement: vi.fn(async () => visa),
    }));

    const { generateFullTripPlan } = await import(
      "@/lib/services/full-plan/generate-full-trip-plan"
    );

    const result = await generateFullTripPlan({
      tripId: trip.id,
      userId: trip.user_id,
      reason: "manual_regenerate",
    });

    expect(result.snapshot.activeVisaScenarioId).toBe("indonesia-digital-nomad");
    expect(
      result.snapshot.visaScenarios.some(
        (scenario) => scenario.id === result.snapshot.activeVisaScenarioId,
      ),
    ).toBe(true);
    expect(result.snapshot.visa).toEqual(
      result.snapshot.visaScenarios.find(
        (scenario) => scenario.id === "indonesia-digital-nomad",
      )?.visa,
    );
  });
});
