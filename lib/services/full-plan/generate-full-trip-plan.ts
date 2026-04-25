import { getVisaRequirement } from "@/lib/services/visa";
import type {
  FullPlanGenerationReason,
  TripPlanSnapshot,
} from "@/lib/services/full-plan/types";
import { buildPlanSnapshot } from "@/lib/services/full-plan/build-plan-snapshot";
import {
  getTripById,
  listBudgetItems,
  upsertTripPlan,
} from "@/server/db";

export type GeneratedTripPlan = {
  tripId: string;
  userId: string;
  snapshot: TripPlanSnapshot;
};

export async function generateFullTripPlan(input: {
  tripId: string;
  userId: string;
  reason: FullPlanGenerationReason;
  forceRefreshVisa?: boolean;
}): Promise<GeneratedTripPlan> {
  const trip = await getTripById(input.tripId);
  if (!trip || trip.user_id !== input.userId) {
    throw new Error("TRIP_NOT_FOUND");
  }

  const [visa, budgetItems] = await Promise.all([
    getVisaRequirement(trip.citizenship, trip.destination_country).catch(
      () => null,
    ),
    listBudgetItems(trip.id),
  ]);
  const generatedAt = new Date().toISOString();
  const snapshot = buildPlanSnapshot({
    trip,
    visa,
    budgetItems,
    generatedAt,
    reason: input.reason,
  });

  await upsertTripPlan({
    trip_id: trip.id,
    user_id: input.userId,
    status: "full",
    plan_json: snapshot,
    visa_checked_at: trip.visa_last_checked,
  });

  return {
    tripId: trip.id,
    userId: input.userId,
    snapshot,
  };
}
