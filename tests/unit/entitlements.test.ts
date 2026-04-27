import { describe, expect, it } from "vitest";
import {
  evaluateTripPlanAccess,
  hasTripPlanAccessForUser,
  type EntitlementSnapshot,
} from "@/lib/services/entitlements";

const now = new Date("2026-04-25T12:00:00.000Z");

describe("entitlement evaluation", () => {
  it("allows active pro subscriptions for any trip", () => {
    const snapshot: EntitlementSnapshot = {
      tripEntitlements: [],
      subscriptions: [
        {
          plan: "monthly_pro",
          status: "active",
          current_period_end: "2026-05-25T12:00:00.000Z",
        },
      ],
    };

    expect(evaluateTripPlanAccess(snapshot, "trip-1", now)).toBe(true);
  });

  it("allows active trip pass only for the matching trip", () => {
    const snapshot: EntitlementSnapshot = {
      tripEntitlements: [
        {
          trip_id: "trip-1",
          entitlement_type: "trip_pass",
          status: "active",
          expires_at: null,
        },
      ],
      subscriptions: [],
    };

    expect(evaluateTripPlanAccess(snapshot, "trip-1", now)).toBe(true);
    expect(evaluateTripPlanAccess(snapshot, "trip-2", now)).toBe(false);
  });

  it("rejects expired or revoked entitlements", () => {
    const snapshot: EntitlementSnapshot = {
      tripEntitlements: [
        {
          trip_id: "trip-1",
          entitlement_type: "trip_pass",
          status: "expired",
          expires_at: "2026-04-24T12:00:00.000Z",
        },
        {
          trip_id: "trip-1",
          entitlement_type: "admin_grant",
          status: "revoked",
          expires_at: null,
        },
      ],
      subscriptions: [
        {
          plan: "annual_pro",
          status: "canceled",
          current_period_end: "2026-05-25T12:00:00.000Z",
        },
      ],
    };

    expect(evaluateTripPlanAccess(snapshot, "trip-1", now)).toBe(false);
  });

  it("allows moderators to access any full trip plan without payment", async () => {
    await expect(
      hasTripPlanAccessForUser(
        {
          id: "moderator-1",
          is_admin: false,
          is_moderator: true,
        },
        "trip-1",
      ),
    ).resolves.toBe(true);
  });
});
