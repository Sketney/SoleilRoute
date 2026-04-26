import type { FullPlanGenerationReason, TripPlanSnapshot } from "@/lib/services/full-plan/types";
import { generateFullTripPlan } from "@/lib/services/full-plan/generate-full-trip-plan";
import { getTripPlan } from "@/server/db";

export async function resolveFullTripPlan(input: {
  tripId: string;
  userId: string;
  reason: FullPlanGenerationReason;
}): Promise<TripPlanSnapshot> {
  const existing = await getTripPlan(input.tripId);
  if (existing?.status === "full") {
    return existing.plan_json;
  }

  const generated = await generateFullTripPlan(input);
  return generated.snapshot;
}
