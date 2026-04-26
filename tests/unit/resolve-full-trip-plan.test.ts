import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  vi.unmock("@/server/db");
  vi.unmock("@/lib/services/full-plan/generate-full-trip-plan");
});

describe("resolveFullTripPlan", () => {
  it("generates a full plan when storage does not yet have a saved full plan", async () => {
    vi.doMock("@/server/db", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/server/db")>();
      return {
        ...actual,
        getTripPlan: vi.fn(async () => null),
      };
    });
    vi.doMock("@/lib/services/full-plan/generate-full-trip-plan", () => ({
      generateFullTripPlan: vi.fn(async () => ({
        snapshot: {
          trip: { id: "trip-1" },
          activeVisaScenarioId: "spain-tourist",
        },
      })),
    }));

    const { resolveFullTripPlan } = await import(
      "@/lib/services/full-plan/resolve-full-trip-plan"
    );

    const result = await resolveFullTripPlan({
      tripId: "trip-1",
      userId: "user-1",
      reason: "pro_unlock",
    });

    expect(result.activeVisaScenarioId).toBe("spain-tourist");
  });

  it("returns the saved full plan without regenerating when one already exists", async () => {
    const existingPlan = {
      status: "full" as const,
      plan_json: {
        trip: { id: "trip-1" },
        activeVisaScenarioId: "spain-student",
      },
    };

    vi.doMock("@/server/db", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/server/db")>();
      return {
        ...actual,
        getTripPlan: vi.fn(async () => existingPlan),
      };
    });
    const generateFullTripPlan = vi.fn(async () => ({
      snapshot: {
        trip: { id: "trip-1" },
        activeVisaScenarioId: "spain-tourist",
      },
    }));
    vi.doMock("@/lib/services/full-plan/generate-full-trip-plan", () => ({
      generateFullTripPlan,
    }));

    const { resolveFullTripPlan } = await import(
      "@/lib/services/full-plan/resolve-full-trip-plan"
    );

    const result = await resolveFullTripPlan({
      tripId: "trip-1",
      userId: "user-1",
      reason: "pro_unlock",
    });

    expect(result).toBe(existingPlan.plan_json);
    expect(generateFullTripPlan).not.toHaveBeenCalled();
  });
});
