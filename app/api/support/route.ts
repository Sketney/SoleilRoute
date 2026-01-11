import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/session";
import { sendSupportEmail } from "@/lib/services/resend";

const supportSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(3).max(120),
  message: z.string().min(10).max(2000),
});

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = supportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await sendSupportEmail({
    fromEmail: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
    userId: session.user.id,
    accountEmail: session.user.email,
  });

  if (result.skipped) {
    return NextResponse.json(
      { error: "Support email is not configured" },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true });
}
