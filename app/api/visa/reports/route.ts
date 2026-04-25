import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api/responses";
import { getServerSession } from "@/lib/auth/session";
import { createVisaIssueReport, getTripAccess } from "@/server/db";

const reportSchema = z.object({
  citizenship: z.string().min(1),
  destination: z.string().min(1),
  issue: z.string().min(8).max(2000),
  tripId: z.string().optional().nullable(),
  visaCheckId: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return apiError("UNAUTHORIZED", "Unauthorized", 401);
  }

  const body = await request.json().catch(() => null);
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("INVALID_PAYLOAD", "Invalid payload", 400);
  }

  const tripId = parsed.data.tripId ?? null;
  if (tripId) {
    const access = await getTripAccess(tripId, session.user.id);
    if (!access) {
      return apiError("NOT_FOUND", "Trip not found", 404);
    }
  }

  const report = await createVisaIssueReport(session.user.id, {
    citizenship: parsed.data.citizenship,
    destination: parsed.data.destination,
    issue: parsed.data.issue,
    trip_id: tripId,
    visa_check_id: parsed.data.visaCheckId ?? null,
  });

  return NextResponse.json({ report });
}
