import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api/responses";
import { getServerSession } from "@/lib/auth/session";
import { createVisaManualOverride } from "@/server/db";

const overrideSchema = z.object({
  citizenship: z.string().min(1),
  destination: z.string().min(1),
  visaRequired: z.boolean(),
  visaType: z.string().optional().nullable(),
  validity: z.string().optional().nullable(),
  processingTime: z.string().optional().nullable(),
  cost: z.coerce.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  embassyUrl: z.string().optional().nullable(),
  applicationUrl: z.string().optional().nullable(),
  passportValidity: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sourceUrl: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user.is_admin && !session?.user.is_moderator) {
    return apiError("FORBIDDEN", "Forbidden", 403);
  }

  const body = await request.json().catch(() => null);
  const parsed = overrideSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("INVALID_PAYLOAD", "Invalid payload", 400);
  }

  const override = await createVisaManualOverride(session.user.id, {
    citizenship: parsed.data.citizenship,
    destination: parsed.data.destination,
    visa_required: parsed.data.visaRequired,
    visa_type: parsed.data.visaType ?? null,
    validity: parsed.data.validity ?? null,
    processing_time: parsed.data.processingTime ?? null,
    cost: parsed.data.cost ?? null,
    currency: parsed.data.currency ?? null,
    embassy_url: parsed.data.embassyUrl ?? null,
    application_url: parsed.data.applicationUrl ?? null,
    passport_validity: parsed.data.passportValidity ?? null,
    notes: parsed.data.notes ?? null,
    source_url: parsed.data.sourceUrl ?? null,
    is_active: true,
  });

  return NextResponse.json({ override });
}
