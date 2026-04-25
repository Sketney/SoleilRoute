import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { apiError } from "@/lib/api/responses";
import { grantMockTripPass, hasTripPlanAccess } from "@/lib/services/entitlements";
import { generateFullTripPlan } from "@/lib/services/full-plan/generate-full-trip-plan";
import { createNotification, getTripAccess } from "@/server/db";

export async function POST(
  _: Request,
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

  if (!(await hasTripPlanAccess(session.user.id, access.trip.id))) {
    if ((process.env.PAYMENT_PROVIDER ?? "mock") !== "mock") {
      return apiError("CHECKOUT_REQUIRED", "Checkout provider is not configured", 402);
    }
    await grantMockTripPass(session.user.id, access.trip.id);
  }

  const generated = await generateFullTripPlan({
    tripId: access.trip.id,
    userId: session.user.id,
    reason: "purchase",
  });

  await createNotification(session.user.id, {
    title: "Full trip plan ready",
    message: `Your plan for ${access.trip.destination_city} is ready.`,
    type: "success",
    action_url: `/dashboard/trips/${access.trip.id}/plan`,
  });

  return NextResponse.json({
    success: true,
    plan: generated.snapshot,
  });
}
