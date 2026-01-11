import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/session";
import {
  listNotificationsByUser,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/server/db";

const updateSchema = z
  .object({
    id: z.string().optional(),
    all: z.boolean().optional(),
  })
  .refine((data) => data.id || data.all, "id or all is required");

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : 20;
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), 200)
    : 20;

  const notifications = listNotificationsByUser(session.user.id, limit);
  const unreadCount = notifications.filter((item) => !item.read_at).length;

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (parsed.data.all) {
    markAllNotificationsRead(session.user.id);
  } else if (parsed.data.id) {
    markNotificationRead(parsed.data.id);
  }

  return NextResponse.json({ success: true });
}
