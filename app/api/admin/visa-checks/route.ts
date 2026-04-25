import { NextResponse } from "next/server";
import { apiError } from "@/lib/api/responses";
import { getServerSession } from "@/lib/auth/session";
import {
  listVisaChecks,
  listVisaIssueReports,
  listVisaManualOverrides,
} from "@/server/db";

function canUseAdminQa(session: Awaited<ReturnType<typeof getServerSession>>) {
  return Boolean(session?.user.is_admin || session?.user.is_moderator);
}

export async function GET() {
  const session = await getServerSession();
  if (!canUseAdminQa(session)) {
    return apiError("FORBIDDEN", "Forbidden", 403);
  }

  const [checks, reports, overrides] = await Promise.all([
    listVisaChecks(50),
    listVisaIssueReports(50),
    listVisaManualOverrides(50),
  ]);

  return NextResponse.json({ checks, reports, overrides });
}
