import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { apiError } from "@/lib/api/responses";
import { hasTripPlanAccess } from "@/lib/services/entitlements";
import { generateFullTripPlan } from "@/lib/services/full-plan/generate-full-trip-plan";
import {
  getTripAccess,
  getTripPlan,
  listBudgetItems,
} from "@/server/db";
import { getVisaRequirement } from "@/lib/services/visa";
import { buildPlanSnapshot } from "@/lib/services/full-plan/build-plan-snapshot";

export async function GET(
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

  const hasAccess = await hasTripPlanAccess(session.user.id, access.trip.id);
  if (!hasAccess) {
    const [visa, budgetItems] = await Promise.all([
      getVisaRequirement(access.trip.citizenship, access.trip.destination_country).catch(
        () => null,
      ),
      listBudgetItems(access.trip.id),
    ]);
    const preview = buildPlanSnapshot({
      trip: access.trip,
      visa,
      budgetItems,
      reason: "manual_regenerate",
    });
    return NextResponse.json({
      locked: true,
      preview: {
        trip: preview.trip,
        visa: preview.visa,
        budget: preview.budget,
        documents: preview.documents.slice(0, 4),
        timeline: preview.timeline.slice(0, 4),
        sources: preview.sources,
        disclaimer: preview.disclaimer,
      },
      unlockOptions: [
        { productType: "trip_pass", label: "Trip Pass", price: 5.99, currency: "USD" },
        { productType: "monthly_pro", label: "Monthly Pro", price: 7.99, currency: "USD" },
      ],
    });
  }

  const existing = await getTripPlan(access.trip.id);
  const plan =
    existing?.status === "full"
      ? existing.plan_json
      : (await generateFullTripPlan({
          tripId: access.trip.id,
          userId: session.user.id,
          reason: "pro_unlock",
        })).snapshot;

  return NextResponse.json({
    locked: false,
    plan,
  });
}

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
    return apiError("PAYMENT_REQUIRED", "Full trip plan is locked", 402);
  }

  const generated = await generateFullTripPlan({
    tripId: access.trip.id,
    userId: session.user.id,
    reason: "manual_regenerate",
    forceRefreshVisa: true,
  });

  return NextResponse.json({
    locked: false,
    plan: generated.snapshot,
  });
}
