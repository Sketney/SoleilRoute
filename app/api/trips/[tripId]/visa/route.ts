import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/session";
import { visaStatusOptions } from "@/lib/constants";
import { canEditTrip, createNotification, getTripAccess, updateTrip } from "@/server/db";

type VisaStatusValue = (typeof visaStatusOptions)[number]["value"];
const visaStatusValues = visaStatusOptions.map((option) => option.value) as [
  VisaStatusValue,
  ...VisaStatusValue[],
];

const updateVisaSchema = z.object({
  status: z.enum(visaStatusValues),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tripId } = await params;
  const access = await getTripAccess(tripId, session.user.id);
  if (!access) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }
  if (!canEditTrip(access.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateVisaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await updateTrip(access.trip.id, {
    visa_status: parsed.data.status,
    visa_last_checked: new Date().toISOString(),
  });

  if (!updated) {
    return NextResponse.json(
      { error: "Unable to update visa status" },
      { status: 500 },
    );
  }

  await createNotification(session.user.id, {
    title: "Visa status updated",
    message: `Visa status for ${access.trip.destination_country} is now ${parsed.data.status.replace("_", " ")}.`,
    type: "info",
    action_url: `/dashboard/trips/${access.trip.id}/visa`,
  });

  return NextResponse.json({
    visa_status: updated.visa_status ?? "unknown",
    visa_last_checked: updated.visa_last_checked ?? null,
  });
}
