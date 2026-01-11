import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/session";
import { isAdminEmail } from "@/lib/auth/roles";
import { getUserById, listUsers, setUserModerator } from "@/server/db";

const updateSchema = z.object({
  userId: z.string(),
  enabled: z.boolean(),
});

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(session.user.id);
  if (!isAdminEmail(user?.email ?? null)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = (await listUsers()).map((entry) => ({
    id: entry.id,
    email: entry.email,
    is_moderator: entry.is_moderator ?? false,
  }));
  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(session.user.id);
  if (!isAdminEmail(user?.email ?? null)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await setUserModerator(parsed.data.userId, parsed.data.enabled);
  return NextResponse.json({
    user: {
      id: updated.id,
      email: updated.email,
      is_moderator: updated.is_moderator ?? false,
    },
  });
}
