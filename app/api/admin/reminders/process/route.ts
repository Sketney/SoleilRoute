import { NextResponse } from "next/server";
import { apiError } from "@/lib/api/responses";
import { getServerSession } from "@/lib/auth/session";
import { processDueReminders } from "@/lib/services/reminders";

export async function POST() {
  const session = await getServerSession();
  if (!session?.user.is_admin && !session?.user.is_moderator) {
    return apiError("FORBIDDEN", "Forbidden", 403);
  }

  const result = await processDueReminders();
  return NextResponse.json(result);
}
