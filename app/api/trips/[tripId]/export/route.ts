import { NextResponse } from "next/server";
import { apiError } from "@/lib/api/responses";
import { getServerSession } from "@/lib/auth/session";
import { hasTripPlanAccessForUser } from "@/lib/services/entitlements";
import { buildTripPlanPdf } from "@/lib/services/full-plan/export-pdf";
import { generateFullTripPlan } from "@/lib/services/full-plan/generate-full-trip-plan";
import { getTripAccess, getTripPlan } from "@/server/db";

function filename(value: string) {
  return value.replace(/[^a-z0-9-]+/gi, "-").replace(/-+/g, "-").toLowerCase();
}

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

  if (!(await hasTripPlanAccessForUser(session.user, access.trip.id))) {
    return apiError("PAYMENT_REQUIRED", "Full trip plan is locked", 402);
  }

  const storedPlan = await getTripPlan(access.trip.id);
  const plan =
    storedPlan?.status === "full"
      ? storedPlan.plan_json
      : (
          await generateFullTripPlan({
            tripId: access.trip.id,
            userId: session.user.id,
            reason: "manual_regenerate",
          })
        ).snapshot;
  const pdf = buildTripPlanPdf(plan);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="soleilroute-${filename(access.trip.name || access.trip.destination_country)}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
