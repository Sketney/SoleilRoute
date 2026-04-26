import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { apiError } from "@/lib/api/responses";
import { hasTripPlanAccessForUser } from "@/lib/services/entitlements";
import { resolveFullTripPlan } from "@/lib/services/full-plan/resolve-full-trip-plan";
import {
  canEditTrip,
  getTripAccess,
  selectActiveVisaScenario,
  upsertTripPlan,
} from "@/server/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return apiError("UNAUTHORIZED", "Unauthorized", 401);
  }

  const { tripId } = await params;
  const access = await getTripAccess(tripId, session.user.id);
  if (!access) {
    return apiError("NOT_FOUND", "Trip not found", 404);
  }

  if (!canEditTrip(access.role)) {
    return apiError("FORBIDDEN", "Forbidden", 403);
  }

  if (!(await hasTripPlanAccessForUser(session.user, access.trip.id))) {
    return apiError("PAYMENT_REQUIRED", "Full trip plan is locked", 402);
  }

  const body = (await request.json().catch(() => null)) as {
    scenarioId?: unknown;
  } | null;
  if (typeof body?.scenarioId !== "string" || body.scenarioId.trim().length === 0) {
    return apiError("BAD_REQUEST", "scenarioId is required", 400);
  }

  const existingSnapshot = await resolveFullTripPlan({
    tripId: access.trip.id,
    userId: session.user.id,
    reason: "pro_unlock",
  });

  let updatedSnapshot;
  try {
    updatedSnapshot = selectActiveVisaScenario(
      existingSnapshot,
      body.scenarioId,
    );
  } catch (error) {
    if (error instanceof Error && error.message === "VISA_SCENARIO_NOT_FOUND") {
      return apiError("BAD_REQUEST", "Visa scenario not found", 400);
    }
    throw error;
  }

  const updatedPlan = await upsertTripPlan({
    trip_id: access.trip.id,
    user_id: session.user.id,
    status: "full",
    plan_json: updatedSnapshot,
    visa_checked_at: access.trip.visa_last_checked,
  });

  return NextResponse.json({
    activeVisaScenarioId: updatedPlan.plan_json.activeVisaScenarioId,
    visa: updatedPlan.plan_json.visa,
    documents: updatedPlan.plan_json.documents,
    timeline: updatedPlan.plan_json.timeline,
    reminders: updatedPlan.plan_json.reminders,
  });
}
