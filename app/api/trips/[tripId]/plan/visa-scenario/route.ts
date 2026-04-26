import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { apiError } from "@/lib/api/responses";
import { hasTripPlanAccessForUser } from "@/lib/services/entitlements";
import {
  getTripAccess,
  getTripPlan,
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

  if (!(await hasTripPlanAccessForUser(session.user, access.trip.id))) {
    return apiError("PAYMENT_REQUIRED", "Full trip plan is locked", 402);
  }

  const body = (await request.json().catch(() => null)) as {
    scenarioId?: unknown;
  } | null;
  if (typeof body?.scenarioId !== "string" || body.scenarioId.trim().length === 0) {
    return apiError("BAD_REQUEST", "scenarioId is required", 400);
  }

  const existingPlan = await getTripPlan(access.trip.id);
  if (!existingPlan || existingPlan.status !== "full") {
    return apiError("NOT_FOUND", "Full trip plan not found", 404);
  }

  let updatedSnapshot;
  try {
    updatedSnapshot = selectActiveVisaScenario(
      existingPlan.plan_json,
      body.scenarioId,
    );
  } catch (error) {
    if (error instanceof Error && error.message === "VISA_SCENARIO_NOT_FOUND") {
      return apiError("BAD_REQUEST", "Visa scenario not found", 400);
    }
    throw error;
  }

  const updatedPlan = await upsertTripPlan({
    trip_id: existingPlan.trip_id,
    user_id: existingPlan.user_id,
    status: "full",
    plan_json: updatedSnapshot,
    visa_checked_at: existingPlan.visa_checked_at,
  });

  return NextResponse.json({
    activeVisaScenarioId: updatedPlan.plan_json.activeVisaScenarioId,
    visa: updatedPlan.plan_json.visa,
    documents: updatedPlan.plan_json.documents,
    timeline: updatedPlan.plan_json.timeline,
    reminders: updatedPlan.plan_json.reminders,
  });
}
