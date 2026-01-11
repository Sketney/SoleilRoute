import { NextResponse } from "next/server";
import { z } from "zod";
import { getVisaRequirementWithSource } from "@/lib/services/visa";
import { getServerSession } from "@/lib/auth/session";
import { createVisaCheck } from "@/server/db";

const visaCheckSchema = z.object({
  citizenship: z.string().min(1, "citizenship is required"),
  destination: z.string().min(1, "destination is required"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = visaCheckSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { citizenship, destination } = parsed.data;
  const session = await getServerSession();
  const checkedAt = new Date().toISOString();
  const lookup = await getVisaRequirementWithSource(citizenship, destination);
  const result = lookup.requirement;
  const source = lookup.source;
  const fallback = lookup.fallback;
  const insights = lookup.insights;

  if (session) {
    createVisaCheck(session.user.id, {
      citizenship,
      destination,
      found: Boolean(result),
      visa_required: result?.visaRequired ?? null,
      visa_type: result?.visaType ?? null,
      validity: result?.validity ?? null,
      processing_time: result?.processingTime ?? null,
      cost: result?.cost ?? null,
      currency: result?.currency ?? null,
      embassy_url: result?.embassyUrl ?? null,
      notes: result?.notes ?? null,
      source,
      checked_at: checkedAt,
    });
  }

  return NextResponse.json({
    visa: result ?? null,
    checkedAt,
    source,
    fallback,
    insights: insights ?? null,
  });
}

