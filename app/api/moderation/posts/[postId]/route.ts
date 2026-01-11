import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/session";
import {
  getUserById,
  updateCommunityPostStatus,
  createNotification,
} from "@/server/db";
import { isModerator } from "@/lib/auth/roles";

const updateSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  reason: z.string().max(280).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(session.user.id);
  if (!isModerator(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { postId } = await params;
  const updated = await updateCommunityPostStatus(
    postId,
    parsed.data.status,
    session.user.id,
    parsed.data.reason,
  );

  const actionUrl = "/dashboard/community";
  const title =
    parsed.data.status === "approved"
      ? "Post approved"
      : "Post rejected";
  const message =
    parsed.data.status === "approved"
      ? "Your post has been approved and is now visible in the community feed."
      : parsed.data.reason
        ? `Your post was rejected. Reason: ${parsed.data.reason}`
        : "Your post was rejected by the moderation team.";

  await createNotification(updated.author_id, {
    title,
    message,
    type: parsed.data.status === "approved" ? "success" : "warning",
    action_url: actionUrl,
  });

  return NextResponse.json({ post: updated });
}
